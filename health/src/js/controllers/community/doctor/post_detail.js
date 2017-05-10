'use strict';
(function() {

    angular.module('app').controller('doctorPostDetailCtrl', doctorPostDetailCtrl);

    doctorPostDetailCtrl.$inject = ['$scope', 'utils', '$http', 'toaster', '$stateParams', '$modal', '$state'];

    function doctorPostDetailCtrl($scope, utils, $http, toaster, $stateParams, $modal, $state) {
        var postId = $stateParams.postId; // 帖子id
        $scope.page_size = 10;
        $scope.pageIndex = 1;
        $scope.postType = $stateParams.postType; //帖子类型，草稿or帖子
        // 获取帖子内容
        function getPostDetail() {
            $http.post(app.url.community.findByTopicDetail, {
                access_token: app.url.access_token,
                groupId: app.url.groupId,
                id: postId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.postDetail = data.data;
                    $scope.postDetail.text = $scope.postDetail.text ? $scope.postDetail.text : $scope.postDetail.richText;
                } else {
                    toaster.pop('error', '', data.resultMsg);

                    setTimeout(function() {
                        $state.go('app.doctorCommunity.post_list', {
                            postType: $scope.postType
                        });
                    }, 3000);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', '', '服务器繁忙，请稍后再试！');
            });
        };

        // 获取帖子评论列表
        function getPostReply(index) {
            if (!index) {
                index = 0;
                $scope.pageIndex = 1;
            } else {
                index = index - 1;
            }
            $http.post(app.url.community.findByReplyList, {
                access_token: app.url.access_token,
                groupId: app.url.groupId,
                topicId: postId,
                pageIndex: index,
                pageSize: $scope.page_size
            }).
            success(function(data, status, headers, config) {
                var getData = data.data;
                if (data.resultCode == 1) {
                    $scope.replyList = getData.pageData;
                    $scope.page_count = getData.pageCount;
                    $scope.replyTotal = getData.total;
                } else {
                    toaster.pop('error', '', data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', '', '服务器繁忙，请稍后再试！');
            });
        };

        // 每次进来执行一遍获取信息
        getPostDetail();
        getPostReply();

        // 分页size选择
        $scope.pageSizeChange = function() {
            $scope.pageIndex = 1;
            getPostReply();
        }

        // 分页选择第几页
        $scope.pageChanged = function() {
            getPostReply($scope.pageIndex);
        }

        //删除回复
        $scope.deletePostReply = function(replyId) {
            var modalInstance = $modal.open({
                templateUrl: 'delReplyModal.html',
                controller: 'delPostReplyModalCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function(status) {
                if (status == 'ok') {
                    $http.post(app.url.community.deleteReplyId, {
                        access_token: app.url.access_token,
                        id: replyId
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, "删除评论成功！");
                            getPostReply();
                        } else {
                            toaster.pop('error', '', data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                    });
                }
            });
        };

        //删除帖子
        $scope.deletePost = function(postId) {
            var modalInstance = $modal.open({
                templateUrl: 'delPostModal.html',
                controller: 'delPostModalCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function(status) {
                if (status == 'ok') {
                    $scope.isDisabled = !0;
                    $http.post(app.url.community.deleteTopic, {
                        access_token: app.url.access_token,
                        id: postId
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            if ($scope.postType == 1) {
                                toaster.pop('success', null, "删除草稿成功！");
                            } else {
                                toaster.pop('success', null, "删除帖子成功！");
                            }
                            //$modalInstance.close('ok');
                            setTimeout(function() {
                                $state.go('app.doctorCommunity.post_list', {
                                    postType: $scope.postType
                                });
                            }, 3000);
                        } else {
                            $scope.isDisabled = !1;
                            toaster.pop('error', '', data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                    });
                }
            });
        };

        $scope.cancel = function() {
            //$modalInstance.dismiss('cancel');
            $state.go('app.doctorCommunity.post_list', {
                postType: $scope.postType
            });
        };

        //编辑帖子
        $scope.editPost = function() {
                //判断当前帖子是视频帖子还是图文帖子
                if (!$scope.postDetail.video) {
                    //图文帖子
                    $state.go('app.doctorCommunity.create_post_imgt', {
                        id: postId,
                        postType: $scope.postType
                    });
                } else {
                    //视频帖子
                    $state.go('app.doctorCommunity.create_post_video', {
                        id: postId,
                        postType: $scope.postType
                    });
                }
            }
            //显示图片大图
        $scope.showImage = function(images, index) {
            var imageInfo = {
                images: images,
                index: index
            };
            var modalInstance = $modal.open({
                templateUrl: 'showImage.html',
                controller: 'showImageModalCtrl',
                windowClass: 'post-detail-img',
                keyboard: false,
                backdrop: false,
                resolve: {
                    imageInfo: function() {
                        return imageInfo;
                    }
                }
            });

            $scope.showModal = true;
            modalInstance.result.then(function(status) {
                if (status == "cancel") {
                    $scope.showModal = !1;
                }
            });
        }
    };
    angular.module('app').controller('showImageModalCtrl', showImageModalCtrl);

    showImageModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils', 'imageInfo'];

    function showImageModalCtrl($scope, $modalInstance, toaster, $http, utils, imageInfo) {
        $scope.cancel = function() {
            $modalInstance.close('cancel');
        };

        $scope.active = imageInfo.index;
        $scope.noWrapSlides = false;
        var slides = $scope.slides = [];
        var currIndex = 0;
        var addSlide = function() {
            for (var i = 0; i < imageInfo.images.length; i++) {
                slides.push({
                    image: imageInfo.images[i],
                    id: currIndex++
                });
                if(imageInfo.index==i){
                    slides[i].active=true;
                }
            }
        };

        addSlide();
    };

    angular.module('app').controller('delPostReplyModalCtrl', delPostReplyModalCtrl);

    delPostReplyModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function delPostReplyModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    angular.module('app').controller('delPostModalCtrl', delPostModalCtrl);

    delPostModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

    function delPostModalCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();