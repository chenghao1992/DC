'use strict';
(function () {
    app.controller('communitylistCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster','$stateParams', '$modal', '$sce',
        function($rootScope, $scope, $http, utils, $state, toaster, $stateParams, $modal, $sce) {

            $scope.curColumn = $stateParams.id;
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
            $scope.open = function($event, typeBtn) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.endBtn = false;
                $scope.startBtn = false;
                $scope[typeBtn] = true;
            };

            // 获取帖子列表
            $scope.queryPostList = function() {

                if( $scope.search.can == true ) { //enter 键触发的时候判断是否需要查询
                    return;
                }

                $scope.search.can = true;
                $scope.search.text = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';

                $http.post(app.url.community.postQueryList, {
                    access_token: app.url.access_token,
                    columnId: $scope.curColumn,
                    beginDate: moment($scope.search.startDate).startOf('day').unix()*1000 || '',
                    endDate: moment($scope.search.endDate).endOf('day').unix()*1000 || '',
                    keywords: $scope.search.keywords,
                    pageIndex: $scope.pageIndex-1,
                    pageSize: $scope.pageSize
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if(data.data && data.data.pageData) {
                            $scope.postList = data.data.pageData;
                            if($scope.postList === null) {
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
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                    $scope.search.can = false;
                    $scope.search.text = "查询";
                });
            }

            // 页面确定当前栏目后开始加载数据
            if($scope.curColumn) {
                $scope.queryPostList();
            }

            // 分页页数选择
            $scope.pageChange = function() {
                $scope.queryPostList();
            }

            // 帖子推荐/取消推荐
            $scope.funRecommend = function(post) {
                $http.post(app.url.community.postRecommend, {
                    access_token: app.url.access_token,
                    topicId: post.id,
                    recommendState: post.recommended == 0 ? 1 : 0
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        var msg = post.recommended == 0 ? '帖子推荐成功！' : '帖子取消推荐成功！';
                        toaster.pop('success', '', msg);
                        $scope.queryPostList();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 帖子置顶
            $scope.funTopPost = function(post, type) {
                $http.post(app.url.community.postTop, {
                    access_token: app.url.access_token,
                    columnId: $scope.curColumn,
                    id: post.id,
                    topType: type.id
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '帖子置顶' + type.valueName + '成功！');
                        $scope.queryPostList();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 帖子取消置顶
            $scope.funUnTopPost = function(post) {
                $http.post(app.url.community.postUnTop, {
                    access_token: app.url.access_token,
                    columnId: $scope.curColumn,
                    id: post.id
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '帖子取消置顶成功！');
                        $scope.queryPostList();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 上移帖子
            $scope.funMoveUp = function(post) {
                $http.post(app.url.community.postMoveUp, {
                    access_token: app.url.access_token,
                    columnId: $scope.curColumn,
                    id: post.id
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode == 1) {
                        toaster.pop('success', '', '帖子上移成功！');
                        $scope.queryPostList();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 分页数改变
            $scope.pageSizeChange = function() {
                $scope.pageIndex = 1;
                $scope.queryPostList();
            }

            // 查看详情
            $scope.funGoDetail = function(post) {
                var url = $state.href('postDetail', {id: post.id});
                window.open(url,'_blank');
            }
        }
    ]);
})();
