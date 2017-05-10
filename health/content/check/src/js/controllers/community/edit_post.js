'use strict';
(function () {
    app.controller('EditPostCtrl', ['$scope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', '$sce','$q',function ($scope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, $sce,$q) {
        $scope.titleLength = 0;
        $scope.summaryLength = 0;
        $scope.formData = {};
        $scope.formData.isShow = true;
        $scope.formData.fontImgs = [];
        $scope.isSaved = false;
        $scope.identities = [];

        $scope.isEdit = false;
        if ($stateParams.id) {
            $scope.isEdit = true;
        }

        var um = null;



        //获取用户身份列表
        function getAuthorListPromise() {
            return $q(function(resolve,reject){
                $http.post(app.url.community.getAuthorList, {
                    access_token: app.url.access_token
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        resolve(data.data);
                    }
                    else {
                        reject(data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    reject(data.resultMsg);
                });
            });

        }

        //获取栏目列表
        function getColumnsPromise() {
            return $q(function(resolve,reject) {
                $http.post(app.url.community.columns, {
                    access_token: app.url.access_token,
                    enable: 0,
                    pageIndex: 0,
                    pageSize: 999
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        resolve(data.data.pageData);
                    }
                    else {
                        reject(data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    reject(data.resultMsg);

                });
            })
        }

        //删除身份
        $scope.removeAuthor = function (value) {
            $http.post(app.url.community.deleteAuthor, {
                access_token: app.url.access_token,
                id: value.id
            }).
            success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.identities = $scope.identities.filter(function (item) {
                        return item != value;
                    });
                }
                else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        //选择一个身份的时候
        $scope.indentitySelect = function (indentity) {
            $scope.identities.forEach(function (item, index, array) {
                item.selected = false;
            });
            indentity.selected = true;
        };

        //选中一个栏目的时候
        $scope.columnSelect = function (column) {
            $scope.columns.forEach(function (item, index, array) {
                item.selected = false;
            });
            column.selected = true;
        };


        //获取七牛上传token和domain
        function getQNPromise(){
            return $q(function(resolve,reject) {
                $http({
                    url: serverApiRoot + 'vpanfile/getUploadToken',
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        bucket: 'resource'
                    }
                }).then(function (response) {
                    var rep = response.data;
                    if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                        //初始化编辑器
                        um = UM.getEditor('myEditor', {
                            initialFrameWidth: '100%',
                            initialFrameHeight: 300,
                            qiniuToken: rep.data.token,
                            qiniuDomain: rep.data.domain,
                            maximumWords:10000
                        });
                        resolve();
                    } else {
                        console.error(rep);
                        resolve(rep);
                    }
                });
            })
        }

        //如果是编辑状态
        if($scope.isEdit){
            getQNPromise().then(function(){
                return initEditPromise();
            }).then(function(postDetail){
                getAuthorListPromise().then(function(identityData){
                    $scope.identities=identityData;
                    $scope.identities.forEach(function (item, index, array) {
                        if (item.userId == postDetail.createUserId) {
                            item.selected = true;

                        }
                        item.disabled = true;
                    });
                },function(err){
                    toaster.pop('error', null, err);
                });

                getColumnsPromise().then(function(columnsData){
                    $scope.columns=columnsData;
                    $scope.columns.forEach(function (item, index, array) {
                        if (item.id == postDetail.columnId) {
                            item.selected = true;
                        }
                        item.disabled = true;
                    });
                },function(err){
                    toaster.pop('error', null, err);
                });
            });
        }
        else{
            getQNPromise().then(function(){
                getAuthorListPromise().then(function(data){
                    $scope.identities = data;
                },function(err){
                    toaster.pop('error', null, err);
                });

                getColumnsPromise().then(function(data){
                    $scope.columns = data;
                },function(err){
                    toaster.pop('error', null, err);
                });
            });
        }




        $scope.$on('$destroy', function () {
            um.destroy();
        });


        //编辑文章
        function initEditPromise() {
            return $q(function(resolve,reject){
                $http.post(app.url.community.getWebTopicSimple, {
                    access_token: app.url.access_token,
                    id: $stateParams.id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.formData.summary = data.data.digest;
                        $scope.formData.title = data.data.title;


                        data.data.digestImgUrls.forEach(function (item, index, array) {
                            $scope.formData.fontImgs.push({
                                url: item,
                                uploadPercent: 100
                            });
                        });

                        um.setContent(data.data.richText);
                        resolve(data.data);

                    }
                    else {
                        console.log(data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    alert(data.resultMsg);
                });
            });

        }


        //title的长度
        $scope.$watch('formData.title', function (newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.title) {
                    $scope.titleLength = $scope.formData.title.length;
                }
                else {
                    $scope.titleLength = 0;
                }
            }
        });
        //摘要的长度
        $scope.$watch('formData.summary', function (newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.summary) {
                    if($scope.formData.summary.length>80){
                        $scope.formData.summary=$scope.formData.summary.slice(0,80);
                    }
                    $scope.summaryLength = $scope.formData.summary.length;
                }
                else {
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

        //删除图片
        $scope.removeImg = function (value) {
            $scope.formData.fontImgs = $scope.formData.fontImgs.filter(function (item) {
                return item != value;
            });
        };

        //选择文件上传
        $scope.selectFile = function () {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function (up, files) {
            $scope.formData.fontImgs.push({
                url: '',
                uploadPercent: 0
            });
            console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function (up, file, info) {
            $scope.formData.fontImgs[$scope.formData.fontImgs.length - 1] = {url: file.url, uploadPercent: 100};
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            $scope.formData.fontImgs.pop();
            if (err.code == -600) {
                toaster.pop('error', null, '文件过大');
            }
            else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function (up, file) {
            $scope.formData.fontImgs[$scope.formData.fontImgs.length - 1] = {url: file.url, uploadPercent: file.percent};
        };


        //打开添加身份模态框
        $scope.addIdentity = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addIdentityModalContent.html',
                controller: 'addIdentityInstanceCtrl',
                size: 'md',
                resolve: {
                    type: function () {
                        return 0
                    }
                }
            });

            modalInstance.result.then(function (returnValue) {
                if (returnValue == 'ok') {
                    //这里更新身份列表
                    getAuthorListPromise().then(function(data){
                        $scope.identities = data;
                    },function(err){
                        toaster.pop('error', null, err);
                    });
                }
            }, function () {

            });
        };

        //打开删除身份模态框
        $scope.removeIdentity = function ($event, item) {
            $event.stopPropagation();
            console.log(item);
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function (status) {
                if (status == 'ok') {
                    $http.post(app.url.community.deleteAuthor, {
                        access_token: app.url.access_token,
                        id: item.id
                    }).
                    success(function (data, status, headers, config) {
                        if (data.resultCode == 1) {
                            getAuthorListPromise().then(function(data){
                                $scope.identities = data;
                            },function(err){
                                toaster.pop('error', null, err);
                            });
                        }
                        else {
                            toaster.pop('error', '', data.resultMsg);
                        }
                    }).
                    error(function (data, status, headers, config) {
                        toaster.pop('error', '', data.resultMsg);
                    });
                }
            }, function () {

            });

        };


        //保存文章
        $scope.saveDoc = function () {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题')
                return;
            }

            var columnId;

            var column = $scope.columns.filter(function (item, index, array) {
                return item.selected == true;
            })[0];

            if (column) {
                columnId = column.id;
            }
            if (!columnId) {
                toaster.pop('warn', '', '请选择一个栏目');
                return;
            }

            if ($scope.formData.fontImgs.length == 0) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }

            if (!$scope.formData.summary) {
                toaster.pop('warn', '', '请填写摘要');
                return;
            }


            var html = um.getContent();

            var contentText= um.getContentTxt();


            if (!html) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }
            if(contentText.length>10000){
                toaster.pop('error', null, '正文字数超过10000');
                return ;
            }

            var identity = $scope.identities.filter(function (item, index, array) {
                return item.selected == true;
            })[0];

            if (!identity) {
                toaster.pop('warn', '', '请选择一个身份');
                return;
            }

            var imageParams = [];
            $scope.formData.fontImgs.forEach(function (item, index, array) {
                imageParams.push(item.url);
            });

            var newPostParams = {};
            var updatePostParams = {};
            newPostParams = {
                access_token: app.url.access_token,
                title: $scope.formData.title,
                richText: html,
                columnId: columnId,
                digest: $scope.formData.summary,
                digestImgUrls: imageParams,
                userType: identity.userType,
                userId: identity.userId
            };

            updatePostParams = {
                id: $stateParams.id,
                access_token: app.url.access_token,
                title: $scope.formData.title,
                richText: html,
                digest: $scope.formData.summary,
                digestImgUrls: imageParams
            };

            if (identity.role) {
                newPostParams.role = identity.role;
            }

            $scope.isSaved = true;


            if ($scope.isEdit) {
                $http.post(app.url.community.webEdit, updatePostParams).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '保存成功,3秒钟后返回帖子列表');
                        setTimeout(function () {
                            $state.go('app.community.myPost', {}, {reload: true});
                        }, 3000);
                    }
                    else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }
            else {
                //新建的post
                $http.post(app.url.community.webPublish, newPostParams).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '保存成功,3秒钟后返回帖子列表');
                        setTimeout(function () {
                            $state.go('app.community.myPost', {}, {reload: true});
                        }, 3000);
                    }
                    else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }

        };

        //预览文章，并不保存
        $scope.toPreview = function () {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题')
                return;
            }

            var columnName;

            var column = $scope.columns.filter(function (item, index, array) {
                return item.selected == true;
            })[0];

            if (column) {
                columnName = column.name;
            }
            if (!columnName) {
                toaster.pop('warn', '', '请选择一个栏目');
                return;
            }

            if ($scope.formData.fontImgs.length == 0) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }

            if (!$scope.formData.summary) {
                toaster.pop('warn', '', '请填写摘要');
                return;
            }


            var html = um.getContent();

            var contentText= um.getContentTxt();

            if (!html) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }
            if(contentText.length>10000){
                toaster.pop('error', null, '正文字数超过10000');
                return ;
            }

            var identity = $scope.identities.filter(function (item, index, array) {
                return item.selected == true;
            })[0];

            if (!identity) {
                toaster.pop('warn', '', '请选择一个身份');
                return;
            }

            var imageParams = [];
            $scope.formData.fontImgs.forEach(function (item, index, array) {
                imageParams.push(item.url);
            });

            var newPostParams = {};

            newPostParams = {
                title: $scope.formData.title,
                richText: html,
                columnName: columnName,
                digest: $scope.formData.summary,
                digestImgUrls: imageParams,
                userId: identity.userId,
                headPic:identity.headPic,
                doctorName:identity.userName,
                groupName:identity.groupName,
                doctorTitle:identity.doctorTitle,
                dateTime:Date.now()
            };

            if (identity.role) {
                newPostParams.role = identity.role;
            }
            else {
                newPostParams.userType = identity.userType;
            }


            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'previewModalInstanceCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function () {
                        return newPostParams;
                    }
                }
            });

        };
    }]);


    app.controller('addIdentityInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils',function ($scope, $modalInstance, toaster, $http, utils) {
        $scope.identities = [{
            type: '医生',
            typeId: 3,
            selected: true
        }, {
            type: '患者',
            typeId: 1
        }];

        $scope.indentitySelect = function (indentity) {
            $scope.identities.forEach(function (item, index, array) {
                item.selected = false;
            });
            indentity.selected = true;
        };
        $scope.addIdentityAccount = function () {
            $scope.errorInfo = '';
            if (!$scope.telephone) {
                $scope.errorInfo = '用户名不能为空';
                return;
            }
            if (!$scope.password) {
                $scope.errorInfo = '密码不能为空';
                return;
            }

            //选中的类型
            var selectedType = $scope.identities.filter(function (item, index, array) {
                return item.selected == true;
            })[0].typeId;

            $http.post(app.url.community.addAuthor, {
                access_token: app.url.access_token,
                userType: selectedType,
                telephone: $scope.telephone,
                password: $scope.password
            }).
            success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '添加成功');
                    $modalInstance.close('ok');
                }
                else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

    app.controller('previewModalInstanceCtrl', ['$scope', '$modalInstance', 'article', '$sce',function ($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.richText = $sce.trustAsHtml($scope.article.richText);
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

    //删除弹窗
    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils',function ($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


})()
