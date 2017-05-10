'use strict';
(function () {
    app.controller('DrugADEditCtrl', ['$scope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', '$sce','$log','$rootScope','modal',function($scope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, $sce,$log,$rootScope,modal) {
        $scope.titleLength = 0;
        $scope.summaryLength = 0;
        $scope.formData = {};
        $scope.formData.keywords = [];
        $scope.fontImg = null;
        $scope.fontImgUrl = null;
        $scope.isSaved = false;
        $scope.formData.isShowImg = false;
        var isEdit = false;
        var articleId = null;
        var um = null;
        //获取七牛上传token和domain
        $http({
            url: serverApiRoot + 'vpanfile/getUploadToken',
            method: 'post',
            data: {
                access_token: app.url.access_token,
                bucket: 'resource'
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                //初始化编辑器
                um = UM.getEditor('myEditor', {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 300,
                    qiniuToken: rep.data.token,
                    qiniuDomain: rep.data.domain
                });
                initEdit();
            } else {
                console.error(rep);
            }
        });

        $scope.$on('$destroy', function() {
            um.destroy();
        });

        //获取文字的长度
        var getByteLen = function(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                    len += 2;
                else
                    len += 1;
            };
            return len;
        };

        //编辑文章
        function initEdit() {
            if ($stateParams.id) {
                isEdit = true;
                $http.post(app.url.drug.getAdvertisementById, {
                    access_token: app.url.access_token,
                    id: $stateParams.id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.formData = {
                            title: data.data.title
                        };
                        $scope.fontImgUrl = data.data.copyPath;
                        $scope.formData.isShowImg = data.data.isShowImg == 1 ? true : false;
                        articleId = data.data.id;
                        $scope.isShow =data.data.isShow;//获取药店广告的显示和不显示状态
                        um.setContent(data.data.content);
                    }
                    else {
                        alert(data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    alert(data.resultMsg);
                });
            }
        }

        $scope.$watch('formData.title', function(newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.title) {
                    // var totalLen = 0;
                    // var cutTitle = "";
                    // for (var j = 0; j < $scope.formData.title.length; j++) {
                    //     if (totalLen >= 50) {
                    //         break;
                    //     } else {
                    //         totalLen += getByteLen($scope.formData.title[j]);
                    //         if( totalLen==51 ){
                    //             break;
                    //         }
                    //         cutTitle += $scope.formData.title[j];
                    //     }
                    // }
                    // $scope.titleLength = getByteLen($scope.formData.title);
                    // $scope.formData.title = cutTitle;
                    $scope.titleLength = $scope.formData.title.length;
                } else {
                    $scope.titleLength = 0;
                }
            }
        });
        $scope.$watch('formData.summary', function(newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.summary) {
                    var totalLen = 0;
                    var cutSummary = "";
                    for (var j = 0; j < $scope.formData.summary.length; j++) {
                        if (totalLen >= 80) {
                            break;
                        } else {
                            totalLen += getByteLen($scope.formData.summary[j]);
                            cutSummary += $scope.formData.summary[j];
                        }
                    }
                    $scope.summaryLength = getByteLen($scope.formData.summary);
                    $scope.formData.summary = cutSummary;
                } else {
                    $scope.summaryLength = 0;
                }
            }


        });


        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        //选择文件上传
        $scope.selectFile = function() {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent = 0;
            console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.fontImgUrl = file.url;
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            if (err.code == -600) {
                toaster.pop('error', null, '文件过大');
            } else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };

        //保存文章
        $scope.saveDoc = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var html = um.getContent();
            if (html.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }

            $scope.isSaved = true;
            var isShowImg = $scope.formData.isShowImg == false ? 0 : 1;
            if (isEdit == true) {
                $scope.docParam ={
                    access_token: app.url.access_token,
                    id: articleId,
                    title: $scope.formData.title,
                    copyPath: $scope.fontImgUrl,
                    isShowImg: isShowImg,
                    content: html,
                }

                $http({
                    url: app.url.drug.updateAdvertisement,
                    method: 'post',
                    "data":$scope.docParam
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if ($state.includes('app.document.edit_drug_ad')) {
                            toaster.pop('success', '', '保存成功,3秒钟后返回药店广告条列表');
                            setTimeout(function() {
                                $state.go('app.document.drug_ad', {}, {
                                    reload: true
                                });
                            }, 3000);
                        } else if ($state.includes('edit_drug_ad')) {
                            toaster.pop('success', '', '保存成功,3秒钟后返回文章');
                            window.opener.reflashData();
                            setTimeout(function() {
                                $state.go('drug_ad_article', {
                                    id: $stateParams.id
                                }, {
                                    reload: true
                                });
                            }, 3000);
                        }
                    } else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }else {
                $scope.docParam ={
                    access_token: app.url.access_token,
                    title: $scope.formData.title,
                    copyPath: $scope.fontImgUrl,
                    isShowImg: isShowImg,
                    content: html
                }
                $http({
                    url: app.url.drug.addAdvertisement,
                    method: 'post',
                    "data":$scope.docParam
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '保存成功,3秒钟后返回药店广告条列表');
                        setTimeout(function() {
                            $state.go('app.document.drug_ad', {}, {
                                reload: true
                            });
                        }, 3000);
                    } else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }

        };

        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var html = um.getContent();
            if (html.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }
            var isShowImg = $scope.formData.isShowImg == false ? 0 : 1;
            var articlePreview = {
                authorName: '玄关健康中心',
                title: $scope.formData.title,
                copyPath: $scope.fontImgUrl,
                content: html,
                isShow: isShowImg,
                date: Date.now()
            };

            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'previewModalInstanceCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function() {
                        return articlePreview;
                    }
                }
            });

        };
    }]);


    app.controller('previewModalInstanceCtrl', ['$scope', '$modalInstance', 'article', '$sce',function($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);


})();
