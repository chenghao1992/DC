'use strict';
(function() {
    angular.module('app').factory('ShowData', function() {
        return {
            formData: [],
            accessoryList: []
        }
    });
    angular.module('app').controller('creatVideoCtrl', creatVideoCtrl);

    creatVideoCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', 'Group', 'AppFactory', '$sce', 'MyFileSelectBoxFactory', 'ShowData'];

    function creatVideoCtrl($scope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, Group, AppFactory, $sce, MyFileSelectBoxFactory, ShowData) {
        window.onbeforeunload = onbeforeunload_handler;
        function onbeforeunload_handler() {
            var warning = "确认退出?";
            return warning;
        }
        var postType = $stateParams.postType; //来源
        var oldFormData = {};
        //判断是否编辑
        if ($stateParams.id) {
            //查询信息
            $http.post(app.url.community.findByTopicDetail, {
                access_token: app.url.access_token,
                groupId: app.url.groupId,
                id: $stateParams.id
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.formData = data.data;
                    if (data.data.files) {
                        $scope.accessoryList = data.data.files;
                    } else {
                        oldFormData.files = [];
                    }
                    $scope.chooseCircleId = $scope.formData.circleId ? $scope.formData.circleId : $scope.circleSideList[0].id; // 栏目
                    $scope.formData.circleName = $scope.formData.circleName ? $scope.formData.circleName : $scope.circleSideList[0].name;
                    $scope.formData.videoDesc = data.data.text;
                    $scope.formData.video = data.data.video[0];
                    oldFormData = angular.copy($scope.formData);
                    $scope.funGetLength(); //统计字体个数
                } else {
                    toaster.pop('error', '', data.resultMsg);
                    setTimeout(function() {
                        $state.go('app.doctorCommunity.post_list', {
                            postType: postType
                        });
                    }, 3000);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', '', '服务器繁忙，请稍后再试！');
            });

        }
        var userName = localStorage.getItem('user_name');
        var access_token = localStorage.getItem('access_token');
        $scope.formData = {};
        $scope.formData.video = {};
        $scope.accessoryList = []; // 附件
        $scope.chooseCircleId = 0; // 栏目
        $scope.titleLength = 0;
        $scope.isSaved = false;

        // 获取当前组织信息
        $scope.currentOrgInfo = Group.getCurrentOrgInfo();

        $scope.funGetLength = function() {
            if ($scope.formData.title) {
                $scope.titleLength = $scope.formData.title.length;
            } else {
                $scope.titleLength = 0;
            }
        };

        // 获取栏目列表
        $http.post(app.url.community.getByGroupCircle, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                $scope.circleSideList = data.data;
                $scope.formData.circle = data.data[0].id;
                $scope.chooseCircleId = $scope.formData.circleId ? $scope.formData.circleId : data.data[0].id; // 栏目
                $scope.formData.circleName = $scope.formData.circleName ? $scope.formData.circleName : $scope.circleSideList[0].name;
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });

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
                $timeout(function() {
                    toaster.pop('error', null, '文件大小超过2M，无法上传');
                });
            } else {
                $timeout(function() {
                    toaster.pop('error', null, errTip);
                });
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };

        // 添加视频
        $scope.addVideo = function() {
            MyFileSelectBoxFactory.open({
                type: ['video'],
                onlyIf: true
            }, function(files) {
                if (files.length > 0) {
                    $scope.formData.video = {
                        play_first: files[0].url + '?vframe/jpg/offset/1/w/474/h/268',
                        play_url: files[0].url,
                        size: files[0].sizeStr,
                        suffix: files[0].suffix
                    }

                }
            })
        }

        //删除上传视频
        $scope.cancelVideo=function(){
            $scope.formData.video={};
        }

        // 添加附件
        $scope.addAccessory = function() {
            MyFileSelectBoxFactory.open({
                type: ['']
            }, function(files) {
                for (var i = 0; i < files.length; i++) {
                    $scope.accessoryList.push({
                        file_url: files[i].url,
                        size: files[i].size,
                        sizeStr: files[i].sizeStr,
                        file_name: files[i].name,
                        type: files[i].type,
                        file_id: files[i].fileId,
                        suffix: files[i].suffix
                    })
                }
            })
        }

        // 移除附件
        $scope.removeAcce = function(fileId) {
            $scope.accessoryList = $scope.accessoryList.filter(function(acce) {
                return acce.file_id != fileId;
            })
        }

        // 栏目选择
        $scope.chooseCircle = function(index) {
            $scope.chooseCircleId = $scope.circleSideList[index].id;
            $scope.formData.circleName = $scope.circleSideList[index].name;
        }

        //保存文章
        $scope.saveDoc = function(saveType) {

            if (saveType == 0 && !$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }

            $scope.isSaved = true;
            if (saveType == 0) {
                // 获取七牛视频长度
                $http.post($scope.formData.video.play_url + '?avinfo', {}).
                success(function(data) {
                    if (data.format && data.format.duration !== undefined) {
                        $scope.formData.video.play_time = data.format.duration;
                        saveDetail(saveType, data);

                    } else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', '获取视频信息失败，请重新选择！');
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', '获取视频信息失败，请重新选择！');
                });
            } else {
                saveDetail(saveType);
            }

        };

        function saveDetail(saveType, data) {

            var postInfo = {
                access_token: app.url.access_token,
                groupId: app.url.groupId,
                title: $scope.formData.title,
                type: 2,
                text: $scope.formData.videoDesc,
                circleId: $scope.chooseCircleId,
                filesJson: JSON.stringify($scope.accessoryList),
                videoJson: JSON.stringify([$scope.formData.video]),
                saveType: saveType
            };
            //return;
            // 保存文章
            //判断是新增还是修改
            if ($stateParams.id) {
                //修改
                postInfo.id = $stateParams.id;
                $http.post(app.url.community.editTopic, postInfo).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (saveType == 1) {
                            toaster.pop('success', '', '修改草稿成功,3秒钟后返回草稿列表');
                        } else {
                            toaster.pop('success', '', '改帖成功,3秒钟后返回帖子列表');
                        }
                        setTimeout(function() {
                            $state.go('app.doctorCommunity.post_list', {
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
                $http.post(app.url.community.publish, postInfo).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (saveType == 1) {
                            toaster.pop('success', '', '保存草稿成功,3秒钟后返回草稿列表');
                        } else {
                            toaster.pop('success', '', '发帖成功,3秒钟后返回帖子列表');
                        }
                        setTimeout(function() {
                            $state.go('app.doctorCommunity.post_list', {
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
        }
        // 编辑器错误提示
        $scope.umerrorcallback = function(value) {
            $timeout(function() {
                toaster.pop('error', '', value);
            }, 0);
        };

        //返回
        //返回类别页
        $scope.cancel = function() {
                var isTrue = !0;
                if($scope.formData.id){
                    if (oldFormData.title && oldFormData.title != $scope.formData.title) {
                        isTrue = !1;
                    }
                    if (oldFormData.video && oldFormData.video.play_first != $scope.formData.video.play_first) {
                        isTrue = !1;
                    }
                    if (oldFormData.videoDesc && oldFormData.videoDesc != $scope.formData.videoDesc) {
                        isTrue = !1;
                    }
                    if (oldFormData.circleId && oldFormData.circleId != $scope.chooseCircleId) {
                        isTrue = !1;
                    }
                    if (oldFormData.files && oldFormData.files.length != $scope.accessoryList.length) {
                        isTrue = !1;
                    } else {
                        var count = 0;
                        angular.forEach($scope.accessoryList, function(file, key) {
                            angular.forEach(oldFormData.files, function(oldFile, key) {
                                if (file.file_id == oldFile.file_id) {
                                    count++;
                                }
                            })
                        })
                        if (count != $scope.accessoryList.length) {
                            isTrue = !1;
                        }
                    }
                }else{
                    if($scope.formData.title||$scope.formData.video.play_first||$scope.formData.videoDesc||$scope.accessoryList.length>0){
                        isTrue = !1;
                    }
                }
                //判断是否有更改
                if (!isTrue) {
                    //询问是否保存
                    var modalInstance;
                    if ($stateParams.id) {
                        //是否修改
                        modalInstance = $modal.open({
                            templateUrl: 'savePostModal.html',
                            controller: 'savePostModalCtrl',
                            size: 'sm'
                        });

                        modalInstance.result.then(function(status) {
                            if (status == 'ok') {
                                //调用保存方法
                                $scope.saveDoc(0);
                            }
                            if (status == "cancel") {
                                $state.go('app.doctorCommunity.post_detail', {
                                    postId: $stateParams.id,
                                    postType: postType
                                });
                            }
                        });
                    } else {
                        //保存草稿
                        modalInstance = $modal.open({
                            templateUrl: 'saveCPostModal.html',
                            controller: 'saveCPostModalCtrl',
                            size: 'sm'
                        });

                        modalInstance.result.then(function(status) {
                            if (status == 'ok') {
                                //调用保存方法
                                $scope.saveDoc(1);
                            }
                            if (status == "cancel") {
                                $state.go('app.doctorCommunity.post_list', {
                                    postType: postType
                                }, {
                                    reload: true
                                });
                            }
                        });
                    }
                } else {
                    //返回
                    if ($stateParams.id) {

                        $state.go('app.doctorCommunity.post_detail', {
                            postId: $stateParams.id,
                            postType: postType
                        });
                    } else {
                        $state.go('app.doctorCommunity.post_list', {
                            postType: postType
                        }, {
                            reload: true
                        });
                    }
                }
            }
            //得到用户头像
        var headUrl=localStorage.getItem('headPicFile');
        var createName=localStorage.getItem('user_name');
            //预览
        $scope.showPost = function() {
            ShowData.formData = $scope.formData;
            if(postType==0){
                ShowData.formData.headUrl=headUrl;
                ShowData.formData.createName=createName;
                var date=new Date();
                ShowData.formData.createTime= date.getHours()+':'+date.getMinutes();
            }
            ShowData.accessoryList = $scope.accessoryList;
            var modalInstance = $modal.open({
                templateUrl: 'showPostModal.html',
                controller: 'showModalCtrl',
                size: 'default',
                keyboard:false,
                backdrop:false
            });
            $scope.showModal=true;
            modalInstance.result.then(function(status){
                if(status=="cancel"){
                    $scope.showModal=!1;
                }
            });
        }
    };
    angular.module('app').controller('showModalCtrl', showModalCtrl);

    showModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils', 'ShowData'];

    function showModalCtrl($scope, $modalInstance, toaster, $http, utils, ShowData) {
        $scope.formData = ShowData.formData;
        $scope.accessoryList = ShowData.accessoryList;

        $scope.cancelShow = function() {
            $modalInstance.close('cancel');
        };
    };
    angular.module('app').controller('savePostModalCtrl', savePostModalCtrl);

    savePostModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function savePostModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            //$modalInstance.dismiss('cancel');
            $modalInstance.close('cancel');
        };
        $scope.closeShow = function() {
            $modalInstance.dismiss('close');
        };
    };
    angular.module('app').controller('saveCPostModalCtrl', saveCPostModalCtrl);

    saveCPostModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function saveCPostModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            //$modalInstance.dismiss('cancel');
            $modalInstance.close('cancel');
        };
        $scope.closeShow = function() {
            $modalInstance.dismiss('close');
        };
    };
})();