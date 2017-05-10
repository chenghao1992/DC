'use strict';
(function() {

angular.module('app').controller('groupPostDetailCtrl', groupPostDetailCtrl);

groupPostDetailCtrl.$inject = ['$scope', 'utils', '$http', '$modal', '$modalInstance', 'toaster', 'postDetailId'];

function groupPostDetailCtrl($scope, utils, $http, $modal, $modalInstance, toaster, postDetailId) {

    var postId = postDetailId; // 帖子id
    $scope.page_size = 10;
    $scope.pageIndex = 1;

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
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', '服务器繁忙，请稍后再试！');
        });
    };

    // 获取帖子评论列表
    function getPostReply(index) {
        if(!index){
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
                $http.post(app.url.community.deleteTopic, {
                    access_token: app.url.access_token,
                    id: postId
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "删除帖子成功！");
                        $modalInstance.close('ok');
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

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

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


