'use strict';
(function () {
    app.controller('PostDetailCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams', '$modal', '$sce',
        function ($rootScope, $scope, $http, utils, $state, toaster, $stateParams, $modal, $sce) {

            //获取帖子详情
            function getWebTopicDetail() {
                $http.post(app.url.community.getWebTopicDetail, {
                    access_token: app.url.access_token,
                    id: $stateParams.id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.post = data.data;
                        $scope.post.content = $sce.trustAsHtml($scope.post.content);
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            //获取主评论
            function getReplyList() {
                $http.post(app.url.community.getReplyList, {
                    access_token: app.url.access_token,
                    topicId: $stateParams.id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.replyList = data.data.pageData;
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            //查看更多
            $scope.loadMoreReply = function (reply) {
                if (reply.isMore) {
                    reply.replys = reply.replys.slice(0, 3);
                    reply.isMore = false;
                    return;
                }
                $http.post(app.url.community.getCommentList, {
                    access_token: app.url.access_token,
                    replyId: reply.id,
                    pageIndex: 0,
                    pageSize: 999
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        reply.isMore = true;
                        reply.replys = data.data.pageData;
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', data.resultMsg);
                });

            };

            getWebTopicDetail();

            getReplyList();

            //打开评论弹窗
            $scope.openComment = function (topicId, replyId, toReplyId, toUserId) {
                var modalInstance = $modal.open({
                    templateUrl: 'commentModalContent.html',
                    controller: 'commentModalInstanceCtrl',
                    size: 'lg',
                    backdrop: false,
                    resolve: {
                        inputData: function () {
                            return {
                                topicId: topicId,
                                replyId: replyId,
                                toReplyId: toReplyId,
                                toUserId: toUserId
                            }
                        }
                    }
                });

                modalInstance.result.then(function (status) {
                    if (status == 'ok') {
                        getReplyList();
                    }
                }, function () {

                });
            };


        }
    ]);

//评论模态框
    app.controller('commentModalInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', '$q', '$modal', 'inputData',function ($scope, $modalInstance, toaster, $http, $q, $modal, inputData) {
        //如果有评论id的话，则不显示图片上传框。
        $scope.isShowUploadImg = inputData.replyId ? false : true;
        $scope.submit = function (item) {
            if (!item.key) return;
            $scope.data.isOpen = false;
            $scope.shared.changeText(item.key);
        };

        $scope.shared = {};
        $scope.replyCan = true;

        // 提交输入内容
        $scope.shared.submit = function (param, type) {

            if (!param) return toaster.pop('error', null, '输入的内容不能为空');

            var data = {
                windowId: $scope.data.gid,
                type: type,
                user: {
                    id: JSON.parse(localStorage['user']).id,
                    name: JSON.parse(localStorage['user']).name
                },
                target: $scope.target
            }

            if (type == 1) {

                data.content = param;
                $scope.editorData = '';

            } else if (type == 2) {

                if (param.oUrl)
                    data.uri = param.oUrl;
                else {
                    data.uri = param.url;
                }

                if (param.format)
                    data.format = param.format;
                if (param.key)
                    data.key = param.key;

                data.name = param.oFileName || param.name;

                data.width = param.width;
                data.height = param.height;
                data.size = param.size;

                $scope.uploadFile.isOpen = false;
                $scope.uploadFile.imgFile = null;
            }

            $scope.goRunning(data);

        };

        // 修改文本内容
        $scope.shared.changeText = function (value) {
            if (!value) {
                return console.log('内容不能为空')
            }
            if (!$scope.editorData) {
                return $scope.editorData = value;
            }
            return $scope.editorData = $scope.editorData + value;
        }

        // 打开关闭工具箱
        $scope.shared.closePopover = function (viewName) {

            var viewNameArry = [
                'uploadFile',
                'quickReply',
                'faceIcon'
            ];
            for (var i = 0; i < viewNameArry.length; i++) {

                if (viewName == viewNameArry[i] && $scope[viewNameArry[i]]) {
                    $scope[viewNameArry[i]].isOpen = true;

                } else if ($scope[viewNameArry[i]]) {
                    $scope[viewNameArry[i]].isOpen = false;
                }

            }

        }

        $scope.fontImgs = [];
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
            $scope.fontImgs = $scope.fontImgs.filter(function (item) {
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
            $scope.fontImgs.push({
                url: '',
                uploadPercent: 0
            });
            console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function (up, file, info) {
            $scope.fontImgs[$scope.fontImgs.length - 1] = {url: file.url, uploadPercent: 100};
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            $scope.fontImgs.pop();
            if (err.code == -600) {
                toaster.pop('error', null, '文件过大');
            }
            else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function (up, file) {
            $scope.fontImgs[$scope.fontImgs.length - 1] = {url: file.url, uploadPercent: file.percent};
        };


        //选择一个身份的时候
        $scope.indentitySelect = function (indentity) {
            $scope.identities.forEach(function (item, index, array) {
                item.selected = false;
            });
            indentity.selected = true;
        };


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

        getAuthorListPromise().then(function (data) {
            $scope.identities = data;
        }, function (err) {
            toaster.pop('error', null, err);
        });


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
        //回复评论
        $scope.replyTopic = function () {
            if (!$scope.editorData) {
                toaster.pop('warn', '', '评论不能为空')
                return;
            }

            var imageParams = [];
            $scope.fontImgs.forEach(function (item, index, array) {
                imageParams.push(item.url);
            });

            var identity = $scope.identities.filter(function (item, index, array) {
                return item.selected == true;
            })[0];

            if (!identity) {
                toaster.pop('warn', '', '请选择一个身份');
                return;
            }

            $scope.replyCan = false;

            if (!inputData.replyId) {
                $http.post(app.url.community.replyTopic, {
                    access_token: app.url.access_token,
                    content: $scope.editorData,
                    imgUrls: imageParams,
                    topicId: inputData.topicId,
                    userType: identity.userType,
                    userId: identity.userId
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, '回复成功');
                        $modalInstance.close('ok');
                    }
                    else {
                        toaster.pop('error', null, data.resultMsg);
                        $scope.replyCan = true;
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', null, data.resultMsg);
                    $scope.replyCan = true;
                });
            }
            else {
                $http.post(app.url.community.replyUser, {
                    access_token: app.url.access_token,
                    content: $scope.editorData,
                    topicId: inputData.topicId,
                    replyId: inputData.replyId,
                    userType: identity.userType,
                    userId: identity.userId,
                    toReplyId: inputData.toReplyId,
                    toUserId: inputData.toUserId
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, '回复成功');
                        $modalInstance.close('ok');
                    }
                    else {
                        toaster.pop('error', null, data.resultMsg);
                        $scope.replyCan = true;
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', null, data.resultMsg);
                    $scope.replyCan = true;
                });
            }
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
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

//删除弹窗
    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils',function ($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


})();
