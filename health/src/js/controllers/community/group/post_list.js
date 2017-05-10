'use strict';
(function() {

angular.module('app').controller('groupCommunityCtrl', groupCommunityCtrl);

groupCommunityCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$location', '$state'];

function groupCommunityCtrl($scope, $timeout, utils, $http, $modal, toaster, $location, $state) {
    var dataPostTable;
    //获取当前用户的集团名称
    $scope.groupName = localStorage.getItem('curGroupName');
    $scope.searchKeyword = "";

    $scope.isPostList = true; // 栏目管理和帖子列表切换

    var postListApi = app.url.community.findPcTopicList; // 帖子列表
    var postSearchApi = app.url.community.findTopicKeyWord; // 搜索结果

    // 获取栏目列表 side模块
    function getSideCircle() {
        $http.post(app.url.community.getByGroupCircle, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                $scope.circleSideList = data.data;
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }
    getSideCircle();
    $scope.pageIndex = 1;
    $scope.pageSize = 20 ;
    $scope.pageTotal= 0 ;
    
    // 帖子列表table组装
    $scope.initPostListTable = function(circle, type) {
        //console.log(circle,type);
        $scope.isPostList = true;
        // 初始化参数 (栏目切换需要初始化参数，分页时则不会执行该初始化操作)
        var postListParam={
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            circleId: '',
            pageIndex: $scope.pageIndex-1||0,
            pageSize: $scope.pageSize
        };

        // 栏目切换（非搜索时触发）
        if(!circle){
            $scope.carActiveId = 'allCarg';
            postListParam.circleId = '';
            //$scope.searchKeyword = '';
            $scope.circle='';
        } else {
            $scope.carActiveId = circle.id;
            $scope.circle=circle;
            postListParam.circleId = circle.id;
            //$scope.searchKeyword = '';
        }
        if($scope.searchKeyword){
            postListParam.keyWord = $scope.searchKeyword;
        }else{
            delete postListParam.keyWord; 
        }
        // 搜索处理
        /*if( type == 'search' ){
            postListParam.keyWord = $scope.searchKeyword;
            if( $scope.carActiveId && $scope.carActiveId != 'allCarg' ) {
                postListParam.circleId = $scope.carActiveId;  // 用于搜索时保存选中的栏目
            }
        } 
        if( type != 'search' ) {
            delete postListParam.keyWord; 
        }*/
        $http.post($scope.searchKeyword ? postSearchApi : postListApi, postListParam).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                $scope.postList = data.data;
                $scope.pageTotal = data.data.total;
                $scope.pageSize = data.data.pageSize;
                $scope.pageIndex= data.data.pageIndex+1;
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', '服务器繁忙，请稍后再试！');
        });
        
    }
    //查看详情
    $scope.goDetail=function(id){
        var modalInstance = $modal.open({
            templateUrl: 'src/tpl/community/group/post_detail.html',
            controller: 'groupPostDetailCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                postDetailId: function() {
                    return id;
                }
            }
        });

        modalInstance.result.then(function(status) {
            if (status == 'ok') {
                $scope.initPostListTable();
            }
        });
    }
    // 置顶
    $scope.topPost=function(id){
        $http.post(app.url.community.topTopic, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            id: id,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                toaster.pop('success', '', '置顶成功！');
                $scope.initPostListTable();
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }
    // 取消置顶
    $scope.unTopPost=function(id){
        $http.post(app.url.community.undoTopTopic, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            id: id,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                toaster.pop('success', '', '取消置顶成功！');
                $scope.initPostListTable();
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }
    // 上移帖子
    $scope.movePost=function(id) {
        $http.post(app.url.community.moveTopic, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            id: id,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                toaster.pop('success', '', '上移成功！');
                $scope.initPostListTable();
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }
    // 初始化帖子列表
    $scope.initPostListTable();

    // 获取栏目列表
    $scope.initCircleTable = function() {
        $scope.carActiveId = ''; //当前未选中栏目(查看帖子列表)
        $scope.isPostList = false;

        $http.post(app.url.community.getByGroupCircle, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                $scope.circleList = data.data;
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }

    // 新增栏目
    $scope.addCircle = function() {
        var modalInstance = $modal.open({
            templateUrl: 'addCircle.html',
            controller: 'addCircleModalCtrl',
            size: 'md'
        });

        modalInstance.result.then(function(addObj) {
            if (addObj.status == 'ok') {
                $http.post(app.url.community.addCircle, {
                    access_token: app.url.access_token,
                    groupId: app.url.groupId,
                    name: addObj.circleName
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '新增栏目成功！');
                        $scope.initCircleTable();
                        getSideCircle();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }
        });
    }

    // 删除栏目
    $scope.deleteCircle = function(ciecleId) {
        var modalInstance = $modal.open({
            templateUrl: 'deleteCircle.html',
            controller: 'deleteCircleModalCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function(status) {
            if (status == 'ok') {
                $http.post(app.url.community.deleteCircle, {
                    access_token: app.url.access_token,
                    // groupId: app.url.groupId,
                    id: ciecleId
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '删除栏目成功！');
                        $scope.initCircleTable();
                        getSideCircle();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }
        });
    }

    // 编辑栏目
    $scope.editCircle = function(ciecle) {
        var modalInstance = $modal.open({
            templateUrl: 'editCircle.html',
            controller: 'editCircleModalCtrl',
            size: 'md',
            resolve: {
                editCircle: function() {
                    return ciecle;
                }
            }
        });

        modalInstance.result.then(function(editObj) {
            if (editObj.status == 'ok') {
                $http.post(app.url.community.updateCircle, {
                    access_token: app.url.access_token,
                    // groupId: app.url.groupId,
                    id: ciecle.id,
                    name: editObj.newName
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '编辑栏目成功！');
                        $scope.initCircleTable();
                        getSideCircle();
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }
        });
    }

    // 上移栏目
    $scope.topCircle = function(ciecleId) {
        $http.post(app.url.community.topCircle, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            id: ciecleId
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                toaster.pop('success', '', '上移栏目成功！');
                $scope.initCircleTable();
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });
    }

    window.reflashData=function(){
        initPostListTable();
    };

};

angular.module('app').controller('addCircleModalCtrl', addCircleModalCtrl);

addCircleModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

function addCircleModalCtrl($scope, $modalInstance, toaster, $http, utils) {
    $scope.titleLength = 0;

    $scope.funGetLength = function(){
       if($scope.circleName){
            $scope.titleLength = $scope.circleName.length;
        } else {
            $scope.titleLength = 0;
        }
    };

    $scope.ok = function() {
        var addObj = {
           circleName: $scope.circleName,
           status: 'ok' 
        }
        $modalInstance.close(addObj);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('app').controller('editCircleModalCtrl', editCircleModalCtrl);

editCircleModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils', 'editCircle'];

function editCircleModalCtrl($scope, $modalInstance, toaster, $http, utils, editCircle) {
    $scope.circle = editCircle;
    $scope.titleLength = 0;

    $scope.funGetLength = function(){
       if($scope.circle.newName){
            $scope.titleLength = $scope.circle.newName.length;
        } else {
            $scope.titleLength = 0;
        }
    };

    $scope.ok = function() {
        var editObj = {
           newName: $scope.circle.newName,
           status: 'ok' 
        }
        $modalInstance.close(editObj);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('app').controller('deleteCircleModalCtrl', deleteCircleModalCtrl);

deleteCircleModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

function deleteCircleModalCtrl($scope, $modalInstance, toaster, $http, utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();