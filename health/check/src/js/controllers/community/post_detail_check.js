'use strict';
(function () {
    app.controller('PostDetailCheckCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams', '$modal', '$sce',
        function ($rootScope, $scope, $http, utils, $state, toaster, $stateParams, $modal, $sce) {
            var url = window.opener.location.href;
            $scope.urlParams={};
            if(url.indexOf('checkReport')>-1){
                $scope.urlParams.urltype=2;
            }else if(url.indexOf('checkPost')>-1){
                $scope.urlParams.urltype=1;
            }
            $scope.urlParams.urlIndex=$stateParams.page;
            $scope.urlParams.urlstatus=$stateParams.zt;
            $scope.urlParams.urlType=$stateParams.type;
            $scope.urlParams.audid=$stateParams.topid;
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
            getWebTopicDetail();
            getReplyList();

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
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });

            };

            //删除帖子
            $scope.deletePost = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'delModalContent.html',
                    controller: 'delModalInstanceCtrl',
                    size: 'sm'
                });

                modalInstance.result.then(function (status) {
                    if (status == 'ok') {
                        if (url.indexOf('checkReport') > -1) {
                            $http.post(app.url.community.checkAuditdel, {
                                access_token: app.url.access_token,
                                idList: $scope.urlParams.audid,
                                state: 1
                            }).success(function (data) {
                                if (data.resultCode == 1) {
                                    toaster.pop('success', null, '删除成功');
                                    window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                    window.close();
                                } else {
                                    toaster.pop('error', null, data.resultMsg);
                                }
                            })
                        }
                        else if (url.indexOf('checkPost') > -1) {
                            $http.post(app.url.community.deltopicAudit, {
                                access_token: app.url.access_token,
                                idList: $stateParams.id,
                                state: 1
                            }).success(function (data) {
                                if (data.resultCode == 1) {
                                    toaster.pop('success', null, '删除成功');
                                    window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                    window.close();
                                } else {
                                    toaster.pop('error', null, data.resultMsg);
                                }
                            })
                        }

                    }
                }, function () {
                    toaster.pop('success', null, data.resultMsg);
                });

            };
            //撤销
            $scope.cancelPost = function () {
                var params;
                if (url.indexOf('checkReport') > -1) {
                    if ($scope.urlParams.urlstatus == 1) {
                        params = {
                            access_token: app.url.access_token,
                            idList: $scope.urlParams.audid,
                            state: 0
                        };
                        $http.post(app.url.community.checkAuditdel, params).success(function (data) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', null, '撤销成功');
                                $scope.post.state = 0;
                                window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                window.close();
                            }
                            else {
                                toaster.pop('error', null, data.resultMsg);
                            }
                        })
                    }
                    else if ($scope.urlParams.urlstatus == 2) {
                        params = {
                            access_token: app.url.access_token,
                            idList: $scope.urlParams.audid,
                            state: 0
                        };
                        $http.post(app.url.community.checkAuditaudit, params).success(function (data) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', null, '撤销成功');
                                $scope.post.state = 0;
                                window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                window.close();
                            }
                            else {
                                toaster.pop('error', null, data.resultMsg);
                            }
                        })
                    }
                }
                else if (url.indexOf('checkPost') > -1) {

                    if ($scope.post.state == 1) {
                        params = {
                            access_token: app.url.access_token,
                            idList: $stateParams.id,
                            state: 0
                        };
                        $http.post(app.url.community.deltopicAudit, params).success(function (data) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', null, '撤销成功');
                                $scope.post.state = 0;
                                window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                window.close();
                            }
                            else {
                                toaster.pop('error', null, data.resultMsg);
                            }
                        })
                    }
                    else if ($scope.post.state == 2) {
                        params = {
                            access_token: app.url.access_token,
                            idList: $stateParams.id,
                            state: 0
                        };
                        $http.post(app.url.community.audittopicAudit, params).success(function (data) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', null, '撤销成功');
                                $scope.post.state = 0;
                                window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                                window.close();
                            }
                            else {
                                toaster.pop('error', null, data.resultMsg);
                            }
                        })
                    }
                }
            };


            //通过帖子
            $scope.passPost = function () {
                if (url.indexOf('checkReport') > -1) {
                    $http.post(app.url.community.checkAuditaudit, {
                        access_token: app.url.access_token,
                        idList: $scope.urlParams.audid,
                        state: 2
                    }).success(function (data) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, '审核通过');
                            window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                            window.close();
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    })
                }
                else if (url.indexOf('checkPost') > -1) {
                    $http.post(app.url.community.audittopicAudit, {
                        access_token: app.url.access_token,
                        idList: $stateParams.id,
                        state: 2
                    }).success(function (data) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, '审核通过');
                            window.opener.reflashData($scope.urlParams.urlType,$scope.urlParams.urlIndex,$scope.urlParams.urltype);
                            window.close();
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    })
                }


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
