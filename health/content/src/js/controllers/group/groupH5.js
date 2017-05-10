'use strict';
(function () {
    app.controller('GroupH5Ctrl',funcGroupH5Ctrl);
    funcGroupH5Ctrl.$inject=['$scope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', '$sce'];
    function funcGroupH5Ctrl($scope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, $sce){
        $scope.formData = {};
        $scope.fontImg = null;
        $scope.fontImgUrl = null;
        $scope.isSaved = false;
        $scope.formData.isShowImg = false;

        //编辑H5
        function getData() {
            $http.post(app.url.yiliao.getGroupDescInfoById, {
                access_token: app.url.access_token,
                groupId: localStorage.getItem('curGroupId')
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.fontImgUrl = data.data.copyPath;
                    $scope.formData.isShowImg = data.data.isShowImg == 1;
                    $scope.umeditor.replaceHtml(data.data.content);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        }
        getData();

        $scope.config = {
            file: {
                urlParams: '?imageView2/3/w/800/h/800'
            }
        };

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
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.fontImgUrl = file.url;
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '展示图修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            if (err.code == -600) {
                $timeout(function(){
                    toaster.pop('error', null, '文件大小超过2M，无法上传');
                });
            } else {
                $timeout(function(){
                    toaster.pop('error', null, errTip);
                });
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };


        //保存文章
        $scope.saveDoc = function() {
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传展示图');
                return;
            }

            if ($scope.formData.content.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }

            $scope.isSaved = true;
            var isShowImg = $scope.formData.isShowImg == true ? 1 : 2;

            $http.post(app.url.yiliao.createDocument, {
                access_token: app.url.access_token,
                documentType: 5,
                copyPath: $scope.fontImgUrl,
                isShowImg: isShowImg,
                content: $scope.formData.content,
                groupId: localStorage.getItem('curGroupId')
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', '', '保存成功,3秒钟后返回集团设置');
                    setTimeout(function() {
                        $state.go('app.setting.group_edit', {}, {
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
        };

        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传展示图');
                return;
            }

            if ($scope.formData.content.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }

            var articlePreview = {
                copyPath: $scope.fontImgUrl,
                content: $scope.formData.content,
                isShow: $scope.formData.isShowImg
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

        // 编辑器错误提示
        $scope.umerrorcallback = function(value) {
            $timeout(function() {
                console.log(toaster);
                toaster.pop('error', '', value);
            }, 0);
        };
    };

})();

(function () {
    app.controller('previewModalInstanceCtrl', funcpreviewModalInstanceCtrl);
    funcpreviewModalInstanceCtrl.$inject=['$scope', '$modalInstance', 'article', '$sce'];
    function funcpreviewModalInstanceCtrl($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})()


