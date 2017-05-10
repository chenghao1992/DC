'use strict';
(function () {

    angular.module('app').factory('ShowData', function () {
        return {
            formData: [],
            accessoryList: []
        }
    });
    angular.module('app').controller('creatImgtCtrl', creatImgtCtrl);

    creatImgtCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', 'MyFileSelectBoxFactory', 'ShowData', '$q'];

    function creatImgtCtrl($scope, $rootScope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, MyFileSelectBoxFactory, ShowData, $q) {

        window.onbeforeunload = onbeforeunload_handler;

        function onbeforeunload_handler() {
            var warning = "确认退出?";
            return warning;
        }

        // 栏目选择
        $scope.chooseCircle = function (index) {
            $scope.chooseCircleId = $scope.circleSideList[index].id;
            $scope.formData.circleName = $scope.circleSideList[index].name;
        }

        // 获取栏目列表
        $http.post(app.url.community.columns, {
            access_token: app.url.access_token,
            enable: 0,
            pageIndex: 0,
            pageSize: 999
        }).
        success(function (data, status, headers, config) {
            if (data.resultCode == 1) {
                $scope.circleSideList = data.data.pageData;
                $scope.formData.circle = data.data.pageData[0].id;
                $scope.chooseCircleId = $scope.chooseCircleId ? $scope.chooseCircleId : $scope.formData.circle; // 栏目
                $scope.formData.circleName = $scope.formData.circleName ? $scope.formData.circleName : $scope.circleSideList[0].name;
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function (data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
        
        var postType = $stateParams.postType; //来源
        var oldFormData = {};
        //判断是否编辑
        if ($stateParams.id) {
            //查询信息
            $http.post(app.url.community.getWebTopicSimple, {
                access_token: app.url.access_token,
                id: $stateParams.id
            }).
            success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.formData = data.data;
                    oldFormData = angular.copy($scope.formData);
                    $scope.digestImgUrls = $scope.formData.digestImgUrls.length > 0 ? $scope.formData.digestImgUrls[0] : '';
                    $scope.umeditor.replaceHtml($scope.formData.richText);
                    $scope.titleLength = $scope.formData.title.length ? $scope.formData.title.length : 0;
                    $scope.chooseCircleId = $scope.formData.columnId ? $scope.formData.columnId : $scope.circleSideList[0].id; // 栏目
                    $scope.indentity.userId = $scope.formData.createUserId;
                } else {
                    toaster.pop('error', '', data.resultMsg);
                    setTimeout(function () {
                        $state.go('app.community.myPost', {
                            postType: postType
                        });
                    }, 3000);
                }
            }).
            error(function (data, status, headers, config) {
                toaster.pop('error', '', '服务器繁忙，请稍后再试！');
            });

        }

        var userName = localStorage.getItem('user_name');
        var access_token = localStorage.getItem('access_token');
        $scope.formData = {};
        $scope.accessoryList = []; // 附件
        $scope.titleLength = 0;
        $scope.isSaved = false;
        $scope.chooseCircleId = 0;
        $scope.identities = [];
        $scope.indentity = {};
        $scope.isEdit = false;
        if ($stateParams.id) {
            $scope.isEdit = true;
        }

        //正文统计字数
        $scope.contentCount = 0;
        $scope.$watch('formData.content', function (newValue, oldValue) {
            if (newValue != oldValue) {
                //得到富文本编辑器纯文本
                var umeditorLength = $scope.umeditor.getContentTxt().length;
                if (umeditorLength > 10000) {
                    $scope.umeditor.replaceHtml(oldValue);
                } else {
                    $scope.contentCount = umeditorLength;
                }
            }
        }, true);

        $scope.funGetLength = function () {
            if ($scope.formData.title) {
                $scope.titleLength = $scope.formData.title.length;
            } else {
                $scope.titleLength = 0;
            }
        };

        //如果是编辑状态
        if ($scope.isEdit) {
            getQNPromise().then(function (postDetail) {
                getAuthorListPromise().then(function (identityData) {
                    $scope.identities = identityData;
                }, function (err) {
                    toaster.pop('error', null, err);
                });
            });
        } else {
            getQNPromise().then(function () {
                getAuthorListPromise().then(function (data) {
                    $scope.identities = data;
                }, function (err) {
                    toaster.pop('error', null, err);
                });
            });
        }

        //获取七牛上传token和domain
        function getQNPromise() {
            return $q(function (resolve, reject) {
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
                            maximumWords: 10000
                        });
                        resolve();
                    } else {
                        console.error(rep);
                        resolve(rep);
                    }
                });
            })
        }

        //获取用户身份列表
        function getAuthorListPromise() {
            return $q(function (resolve, reject) {
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
        //选择一个身份的时候
        $scope.indentitySelect = function (indentity) {
            if ($scope.isEdit) {
                return ;
            }

            $scope.identities.forEach(function (item, index, array) {
                item.selected = false;
            });
            indentity.selected = true;
            $scope.indentity = indentity;
        };

        //保存文章
        $scope.saveDoc = function(saveType) {
            //saveType:0发布，1草稿
            if (saveType == 0 && !$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            $scope.isSaved = true;
            var digest = '';
            var contentTxt = $scope.umeditor.getContentTxt();
            if (contentTxt) {
                $scope.formData.richTextLength=contentTxt.length;
                if (contentTxt.length > 35) {
                    digest = contentTxt.substring(0, 35);
                } else {
                    digest = contentTxt;
                }
            }
            var postInfo = {
                access_token: app.url.access_token,
                title: $scope.formData.title,
                richText: $scope.formData.content,
                richTextLength:$scope.formData.richTextLength,
                digestImgUrls: $scope.digestImgUrls,
                digest: digest,
                columnId: $scope.chooseCircleId,
                userType: 4,    // 用户类别（1 患者 3医生 4后台管理）
                type: 1,         // 帖子类型(0手机端帖子 1-web图文混排 2-web视频帖子)
                userId: $scope.indentity.userId,
            };
         
            //判断是新增还是修改
            if ($stateParams.id) {
                postInfo.id = $stateParams.id;
                //修改
                $http.post(app.url.community.webEdit, postInfo).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (saveType == 1) {
                            // toaster.pop('success', '', '修改草稿成功,3秒钟后返回草稿列表');
                        } else {
                            toaster.pop('success', '', '编辑成功,3秒钟后返回帖子列表');
                        }
                        setTimeout(function() {
                            $state.go('app.community.myPost', {
                                postType: saveType
                            }, {
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
                    toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                });
            } else {
                //新增
                $http.post(app.url.community.webPublish, postInfo).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (saveType == 1) {
                            // toaster.pop('success', '', '保存草稿成功,3秒钟后返回草稿列表');
                        } else {
                            toaster.pop('success', '', '发帖成功,3秒钟后返回帖子列表');
                        }
                        setTimeout(function() {
                            $state.go('app.community.myPost', {
                                postType: saveType
                            }, {
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
                    toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                });
            }
        };

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
        $scope.selectFile = function () {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function (up, files) {
            $scope.uploadPercent = 0;
        };

        // 每个文件上传成功回调
        $scope.uploaderSuccess = function (up, file, info) {
            $scope.digestImgUrls = file.url;
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '展示图修改成功！');
        };

        //取消上传
        $scope.cancelFile = function () {
            $scope.digestImgUrls = '';
            $scope.uploadPercent = 0;
        };

        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            if (err.code == -600) {
                $timeout(function () {
                    toaster.pop('error', null, '文件大小超过2M，无法上传');
                });
            } else {
                $timeout(function () {
                    toaster.pop('error', null, errTip);
                });
            }
        };

        //上传进度
        $scope.fileUploadProcess = function (up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };
        var um = null;
        //获取七牛上传token和domain
        (function () {
            //获取七牛上传token和domain
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
                        qiniuDomain: rep.data.domain
                    });
                } else {
                    console.error(rep);
                }
            });
        })();

        //取消上传
        $scope.cancelFile = function () {
            $scope.digestImgUrls = '';
            $scope.uploadPercent = 0;
        };

        //返回
        $scope.cancelCreate = function () {
            var isTrue = !0;
            if ($stateParams.id) {
                if (oldFormData.title && oldFormData.title != $scope.formData.title) {
                    isTrue = !1;
                }
                if (oldFormData.richText && oldFormData.richText != $scope.formData.content) {
                    isTrue = !1;
                }
                if (oldFormData.indentity && oldFormData.indentity.userId != $scope.indentity.userId) {
                    isTrue = !1;
                }
                if (oldFormData.circleId && oldFormData.circleId != $scope.chooseCircleId) {
                    isTrue = !1;
                }
                if (oldFormData.digestImgUrls && oldFormData.digestImgUrls[0] != $scope.digestImgUrls) {
                    isTrue = !1;
                }
            } else {
                if ($scope.formData.title || $scope.formData.content || $scope.digestImgUrls || $scope.indentity.userName) {
                    isTrue = !1;
                }
            }
            //判断是否有更改
            if (!isTrue) {
                //询问是否保存
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: 'saveCPostModal.html',
                    controller: 'saveCPostModalCtrl',
                    size: 'sm'
                });

                modalInstance.result.then(function (status) {
                    if (status == 'ok') {
                        $state.go('app.community.myPost', {
                            postType: postType
                        }, {
                            reload: true
                        });
                    }
                });
            } else {
                //返回
                if ($stateParams.id) {
                    $state.go('app.community.myPost', {
                        postId: $stateParams.id,
                        postType: postType
                    });
                } else {
                    $state.go('app.community.myPost', {
                        postType: postType
                    }, {
                            reload: true
                    });
                }
            }
        }

        // 编辑器错误提示
        $scope.umerrorcallback = function (value) {
            $timeout(function () {
                toaster.pop('error', '', value);
            }, 0);
        };

        //预览
        $scope.showPost = function () {
            if ($scope.indentity) {
                var headUrl;
                var createName;
                $scope.identities.forEach(function (item, index, array) {
                    if (item.userId == $scope.indentity.userId) {
                        headUrl = item.headPic;
                        createName = item.userName;
                    }
                });
            }
            ShowData.formData = $scope.formData;
            ShowData.formData.digestImgUrls = $scope.digestImgUrls;
            $scope.circleSideList.forEach(function(item, index, array) {
                if (item.id == $scope.chooseCircleId) {
                    ShowData.formData.circleName = item.name;
                }
            });
            ShowData.formData.headUrl = headUrl;
            ShowData.formData.createName = createName;
            var date = new Date();
            ShowData.formData.createTime = date.getHours() + ':' + date.getMinutes();
            ShowData.accessoryList = $scope.accessoryList;
            var modalInstance = $modal.open({
                templateUrl: 'showPostModal.html',
                controller: 'showModalCtrl',
                size: 'default',
                keyboard: false,
                backdrop: false
            });
            $scope.showModal = true;
            modalInstance.result.then(function (status) {
                if (status == "cancel") {
                    $scope.showModal = !1;
                }
            });
        }

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
                    getAuthorListPromise().then(function (data) {
                        $scope.identities = data;
                    }, function (err) {
                        toaster.pop('error', null, err);
                    });
                }
            }, function () {

            });
        };

        //打开删除身份模态框
        $scope.removeIdentity = function ($event, item) {
            $event.stopPropagation();
            if ($scope.isEdit) {
                return ;
            }
            
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function (status) {
                if (status == 'ok') {
                    $scope.indentity = {};
                    $http.post(app.url.community.deleteAuthor, {
                        access_token: app.url.access_token,
                        id: item.id
                    }).
                    success(function (data, status, headers, config) {
                        if (data.resultCode == 1) {
                            getAuthorListPromise().then(function (data) {
                                $scope.identities = data;
                            }, function (err) {
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

    };


    angular.module('app').controller('showModalCtrl', showModalCtrl);

    showModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils', 'ShowData'];

    function showModalCtrl($scope, $modalInstance, toaster, $http, utils, ShowData) {
        $scope.formData = ShowData.formData;
        $scope.accessoryList = ShowData.accessoryList;

        $scope.cancelShow = function () {
            $modalInstance.close('cancel');
        };
    };


    angular.module('app').controller('savePostModalCtrl', savePostModalCtrl);

    savePostModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function savePostModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.close('cancel');
        };
        $scope.closeShow = function () {
            $modalInstance.dismiss('close');
        };
    };


    angular.module('app').controller('saveCPostModalCtrl', saveCPostModalCtrl);

    saveCPostModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function saveCPostModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.close('cancel');
        };

        $scope.closeShow = function () {
            $modalInstance.dismiss('close');
        };
    };


    // 打开添加身份弹窗
    app.controller('addIdentityInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils', function ($scope, $modalInstance, toaster, $http, utils) {
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


    //删除身份弹窗
    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils', function ($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();