'use strict';
(function() {

angular.module('app').controller('doctorCommunityCtrl', doctorCommunityCtrl);

doctorCommunityCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$location', '$state','$stateParams'];

function doctorCommunityCtrl($scope, $timeout, utils, $http, $modal, toaster, $location, $state,$stateParams) {
    var dataPostTable, 
        hasCircle = false;
    //获取当前用户的集团名称
    $scope.groupName = localStorage.getItem('curGroupName');

    //我的帖子列表获取数据的url和param
    var postListApi = app.url.community.getPubListTopic;
    $scope.postType=$stateParams.postType?$stateParams.postType:0;//判断是否根据类别查看帖子
    $scope.pageIndex = 1;
    $scope.pageSize = 20 ;
    $scope.pageTotal= 0 ;
    // 帖子列表table组装
    $scope.initPostListTable = function(type) {
        $scope.postType=type;
        //改变背景色
        if(type==0){
            $scope.tStyle={"background-color":"#f6f8f8"};
            $scope.cStyle={"background-color":"#fff"};
        }else{
            $scope.cStyle={"background-color":"#f6f8f8"};
            $scope.tStyle={"background-color":"#fff"};
        }

        // 初始化参数
        /*var postListParam={
            access_token: app.url.access_token,
            groupId: app.url.groupId,
            saveType:type,
            pageIndex: 0,
            pageSize: $scope.pageSize
        };*/
        $http.post(postListApi, {
                access_token: app.url.access_token,
                groupId: app.url.groupId,
                saveType:type,
                pageIndex: $scope.pageIndex-1||0,
                pageSize: $scope.pageSize
            }).
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

        /*var index = 0,
            length = 20,
            start = 0,
            idx = 0,
            size = 10,
            num = 0;

        var setTable = function () {
            dataPostTable = $('#postListTable').DataTable({
                "language": app.lang.datatables.translation,
                "searching": false,
                "sScrollX": "100%",
                "sScrollXInner": "110%",
                "destroy": true,
                "lengthChange": true,
                "ordering": false,
                "draw": index,
                "pageLength": length,
                "lengthMenu": [10,20,50,100],
                "autoWidth" : false,
                "displayStart": start,
                "bServerSide": true,
                "sAjaxSource": postListApi,
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $.ajax({
                        "type": "post",
                        "url": sSource,
                        "dataType": "json",
                        "data": postListParam,
                        "success": function (resp) {
                            if(resp.resultCode==1){
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                fnCallback(data);
                            }
                            else{
                                toaster.pop('error', '', resp.resultMsg);
                            }
                        }
                    });
                },
                "columns": [{
                    "data": "title",
                    "render": function (set, status, dt) {
                        if(dt.title==''){
                            return '<i id="goDetail"><无标题></i>';
                        }
                        else {
                            return '<span id="goDetail">'+ dt.title +'</span>';
                        }
                        
                    }   
                }, {
                    "data": "createName",
                    "className": "text-center",
                    "render": function (set, status, dt) {
                        if(dt.createName==undefined){
                            return '--';
                        }
                        else{
                            return dt.createName;
                        }
                    }
                }, 
                // {
                //     "data": "type",
                //     "className": "text-center",
                //     "render": function (set, status, dt) {
                //         if(dt.type==1){
                //             return "PC端";
                //         }
                //         else{
                //             return "移动端";
                //         }
                //     }
                // }, 
                {
                    "data": "likeCount",
                    "className": "text-center",
                    "render": function (set, status, dt) {
                        if(dt.likeCount==undefined){
                            return 0;
                        }
                        else{
                            return dt.likeCount;
                        }
                    }
                }, {
                    "data": "replies",
                    "className": "text-center",
                    "render": function (set, status, dt) {
                        var replies = dt.replies || 0;
                        return replies;
                    }
                }, {
                    "data": "createTime",
                    "className": "text-center",
                    "render": function (set, status, dt) {
                        var createTime = dt.createTime || 0;
                        return createTime
                    }
                },  {
                    "data": "delete",
                    "className": "text-center",
                    "render": function (set, status, dt) {
                        return ('<button id="deletePost" class="btn btn-xs btn-danger">删除</button>');
                    }
                }],
                "createdRow": function (nRow, aData, iDataIndex) {
                    // 删除帖子
                    $(nRow).on('click', '#deletePost', function(event) {
                        event.stopPropagation();
                        var modalInstance = $modal.open({
                            templateUrl: 'delPostInListModal.html',
                            controller: 'delPostInListModalCtrl',
                            size: 'sm'
                        });

                        modalInstance.result.then(function(status) {
                            if (status == 'ok') {
                                $http.post(app.url.community.deleteTopic, {
                                    access_token: app.url.access_token,
                                    id: aData.id
                                }).
                                success(function(data, status, headers, config) {
                                    if (data.resultCode == 1) {
                                        toaster.pop('success', null, "删除帖子成功！");
                                        setTable();
                                    } else {
                                        toaster.pop('error', '', data.resultMsg);
                                    }
                                }).
                                error(function(data, status, headers, config) {
                                    toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                                });
                            }
                        });
                    })
                    //查看详情
                    //$(nRow).on('click', '#goDetail', function(event) {
                    $(nRow).on('click', function(event) {
                         // $state.go('app_post_detail_doctor', { id: aData.id });
                         $state.go('app.doctorCommunity.post_detail',{postId:aData.id,postType:$scope.postType});
                        /*var modalInstance = $modal.open({
                            templateUrl: 'src/tpl/community/doctor/post_detail.html',
                            controller: 'doctorPostDetailCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            resolve: {
                                postDetailId: function() {
                                    return aData.id;
                                }
                            }
                        });

                        modalInstance.result.then(function(status) {
                            if (status == 'ok') {
                                setTable();
                            }
                        });*/
                  /*  });

                    
                }
            });*/

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            /*dataPostTable.off('page.dt').on('page.dt', function (e, settings) {
                index = dataPostTable.page.info().page;
                start = length * index;
                postListParam.pageIndex=index;
            })
            .on('length.dt', function ( e, settings, len ) {
                length=len;
                index = 0;
                start = 0;
                postListParam.pageIndex=0;
                postListParam.pageSize=len;
            });
        };
        setTable();*/
    }
    // 换页
    $scope.pageChange = function() {
        $scope.initPostListTable($scope.postType);
    };
    //查看详情
    $scope.postDetail=function(id){
        $state.go('app.doctorCommunity.post_detail',{postId:id,postType:$scope.postType});
    }
    //删除帖子
    $scope.deletePost=function(id,event){
        event.stopPropagation();
        var modalInstance = $modal.open({
            templateUrl: 'delPostInListModal.html',
            controller: 'delPostInListModalCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function(status) {
            if (status == 'ok') {
                $http.post(app.url.community.deleteTopic, {
                    access_token: app.url.access_token,
                    id: id
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "删除帖子成功！");
                        $scope.initPostListTable($scope.postType);
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', '服务器繁忙，请稍后再试！');
                });
            }
        });
    }
    // 初始化帖子列表
    $scope.initPostListTable($scope.postType);

    // 获取栏目列表 (无栏目不可发帖)
    $http.post(app.url.community.getByGroupCircle, {
            access_token: app.url.access_token,
            groupId: app.url.groupId,
        }).
        success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                if( data.data.length > 0 ){
                    hasCircle = true;
                }
            } else {
                toaster.pop('error', '', data.resultMsg);
            }
        }).
        error(function(data, status, headers, config) {
            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
        });

    // 发帖选择类型
    $scope.funPostType = function() {
        if(!hasCircle){
            toaster.pop('error', '', "集团尚无栏目，管理员新增栏目后方可发帖！");
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: 'postTypeModal.html',
            controller: 'postTypeModalCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function(status) {
            if (status == 'imgText') {
                $state.go('app.doctorCommunity.create_post_imgt');
            }
            if (status == 'video') {
                $state.go('app.doctorCommunity.create_post_video');
            }
        });
    }

    window.reflashData=function(){
        initPostListTable();
    };

};

angular.module('app').controller('postTypeModalCtrl', postTypeModalCtrl);

postTypeModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

function postTypeModalCtrl($scope, $modalInstance, toaster, $http, utils) {
    $scope.imgText = function() {
        $modalInstance.close('imgText');
    };

    $scope.video = function() {
        $modalInstance.close('video');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
angular.module('app').controller('delPostInListModalCtrl', delPostInListModalCtrl);

delPostInListModalCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', 'utils'];

function delPostInListModalCtrl($scope, $modalInstance, toaster, $http, utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();


