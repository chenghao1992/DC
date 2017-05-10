'use strict';
(function () {
    app.controller('MyPostCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams', '$modal', '$sce',
        function ($rootScope, $scope, $http, utils, $state, toaster, $stateParams, $modal, $sce) {
            $scope.pageSize = 10;
            $scope.pageIndex = 1;
            $scope.postTotal = 0;

            // 初始化查询条件
            $scope.search = {
                keywords: '',
                startDate: '',
                endDate: '',
                text: '查询',
                can: false
            }

            // 日历打开关闭
            $scope.open = function ($event, typeBtn) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.endBtn = false;
                $scope.startBtn = false;
                $scope[typeBtn] = true;
            };

            // 获取帖子列表
            $scope.queryPostList = function () {

                if( $scope.search.can == true ) { //enter 键触发的时候判断是否需要查询
                    return;
                }

                $scope.search.can = true;
                $scope.search.text = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';

                $http.post(app.url.community.getWebTopicList, {
                    access_token: app.url.access_token,
                    startTime: moment($scope.search.startDate).startOf('day').unix() * 1000||'',
                    endTime: moment($scope.search.endDate).endOf('day').unix() * 1000||'',
                    keyWords: $scope.search.keywords,
                    pageIndex: $scope.pageIndex - 1,
                    pageSize: $scope.pageSize
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (data.data && data.data.pageData) {
                            $scope.postList = data.data.pageData;
                            if ($scope.postList === null) {
                                $scope.postList = [];
                            }
                            $scope.postTotal = data.data.total;
                        }
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                    $scope.search.can = false;
                    $scope.search.text = "查询";
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                    $scope.search.can = false;
                    $scope.search.text = "查询";
                });
            }
            $scope.queryPostList();


            // 分页页数选择
            $scope.pageChange = function () {
                $scope.queryPostList();
            }

            // 帖子推荐/取消推荐
            $scope.funRecommend = function (post) {
                $http.post(app.url.community.postRecommend, {
                    access_token: app.url.access_token,
                    topicId: post.topicId,
                    recommendState: post.recommend == 0 ? 1 : 0
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        var msg = post.recommend == 0 ? '帖子推荐成功！' : '帖子取消推荐成功！';
                        toaster.pop('success', '', msg);
                        if(post.recommend===1){
                            post.recommend = 0;
                        }
                        else{
                            post.recommend = 1;
                        }

                        //$scope.queryPostList();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            };


            //到编辑帖子页面
            $scope.funToEditPost = function (post) {
                $state.go('app.community.editPost', {id: post.topicId});
            }


            // 分页数改变
            $scope.pageSizeChange = function () {
                $scope.pageIndex = 1;
                $scope.queryPostList();
            }

            // 查看详情
            $scope.funGoDetail = function (post) {
                var url = $state.href('postDetail', {id: post.topicId});
                window.open(url,'_blank');
            }

            //删除帖子
            $scope.funDeletePost = function (post) {
                var modalInstance = $modal.open({
                    templateUrl: 'delModalContent.html',
                    controller: 'delModalInstanceCtrl',
                    size: 'sm'
                });

                modalInstance.result.then(function (status) {
                    if (status == 'ok') {
                        $http.post(app.url.community.deletePost, {
                            access_token: app.url.access_token,
                            id: post.topicId
                        }).
                        success(function (data, status, headers, config) {
                            if (data.resultCode == 1) {
                                $scope.queryPostList();
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
        }
    ]);

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

