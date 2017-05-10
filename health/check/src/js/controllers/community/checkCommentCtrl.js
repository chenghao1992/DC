'use strict';
(function () {
    app.controller('checkcommentlist', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams','$modal',
        function($rootScope, $scope, $http,utils, $state, toaster, $stateParams,$modal) {
            $scope.page={
                index:1,
                size:10,
                index1:1,
                size1:10,
                index2:1,
                size2:10
            };
            $scope.search={};
            $scope.check = {
                isCheckAll: false,
                isCheckAll1:false,
                isCheckAll2:false
            };
            $scope.bycheckComment=function(e){
                var prem={};
                $scope.datalist=[];
                $scope.check.isCheckAll=false;
                $scope.check.isCheckAll1=false;
                $scope.check.isCheckAll2=false;
                $scope.numberlsit=0;
                if(e==0){
                    prem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index-1,
                        pageSize:$scope.page.size,
                        state:0,
                    }
                }else if(e==1){
                    prem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index1-1,
                        pageSize:$scope.page.size1,
                        state:2,
                    }
                }else{
                    prem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index2-1,
                        pageSize:$scope.page.size2,
                        state:1,
                    }
                }
                $http.post(app.url.community.replyAuditlist,prem).success(function(data){
                    if(data.resultCode==1){
                        $scope.datalist=data.data.pageData;
                        for(var i in $scope.datalist){
                            $scope.datalist[i].isCheck=false;
                        }
                        if(e==1){
                            $scope.search.postTotal1=data.data.total;
                        }else if(e==2){
                            $scope.search.postTotal2=data.data.total;
                        }else{
                            $scope.search.postTotal0=data.data.total;
                        }
                        //$scope.search.postTotal=data.data.total;
                    }else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).error(function(data){
                    toaster.pop('error',null,'服务器繁忙，请稍后再试！');
                })
            };
            //删除
            $scope.bycomDel=function(e){
                var id='';
                if(e){
                    id=e;
                }else{
                    id=testlist().join(",");
                }
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'deleteComment.html',
                    controller: 'ModaldeleteCommentCtrl',
                    size: 'sm',
                    resolve: {
                        items: function() {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    if(data){
                        $scope.numberlsit=0;
                        $scope.bycheckComment(0);
                    }
                });

            };
            $scope.isCheckAll=false;
            $scope.numberlsit=0;
            $scope.allSelected = function(e) {
                //console.log($scope.$parent.$parent.isCheckAll);return;
                if(e==true){
                    for(var i=0 ; i< $scope.datalist.length;i++){
                        $scope.datalist[i].isCheck=true;
                        $scope.numberlsit=$scope.datalist.length;
                    }
                }
                else {
                    for(var i=0 ; i< $scope.datalist.length;i++){
                        $scope.datalist[i].isCheck=false;
                        $scope.numberlsit=0;
                    }
                }
            };
            var testlist=function(){
                var checkList = [];
                for(var i=0 ; i< $scope.datalist.length;i++){
                    if($scope.datalist[i].isCheck==true) {
                        checkList.push($scope.datalist[i].id);
                    }
                }
                return checkList;
            }
            $scope.singleSelected = function(item) {
                if(item.isCheck == false){
                    item.isCheck = false;
                    $scope.numberlsit--;
                }
                if(item.isCheck == true) {
                    item.isCheck = true;
                    $scope.numberlsit++;
                }
            };
            //审核通过
            $scope.bycomPass=function(e){
                var prem={};
                if(e) {
                    prem = {
                        access_token: app.url.access_token,
                        idList: e,
                        state: 2
                    }
                }else{
                    prem = {
                        access_token: app.url.access_token,
                        idList:testlist().join(","),
                        state: 2
                    }
                }
                $http.post(app.url.community.replyAuditaudit,prem).success(function(data){
                    if(data.resultCode==1){
                        toaster.pop('info',null,'审核通过');
                        $scope.numberlsit=0;
                        $scope.bycheckComment(0);
                    }else{
                        toaster.pop('error',null,"请选择已审核的评论");
                    }
                }).error(function(data){
                    toaster.pop('error', null, "服务器繁忙，请稍后再试！");
                })

            };
            $scope.funPageSizeChange=function (type) {
                if(type==0){
                    $scope.page.index=1;
                    $scope.bycheckComment(0);
                }else if(type==1){
                    $scope.page.index1=1;
                    $scope.bycheckComment(1);
                }else{
                    $scope.page.index2=1;
                    $scope.bycheckComment(2);
                }
            };
            $scope.funPageindex=function (type) {
                if(type==0){
                    $scope.bycheckComment(0);
                }else if(type==1){
                    $scope.bycheckComment(1);
                }else{
                    $scope.bycheckComment(2);
                }

            }
            //撤销和反审核
            $scope.bycomDelcheck=function(item,type){
                var prem={};
                if(item){
                    if(type==1){
                        prem={
                            access_token: app.url.access_token,
                            idList:item,
                            state:0,
                        };
                        $http.post(app.url.community.replyAuditaudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.bycheckComment(1);
                            }else{
                                toaster.pop('info',null,data.resultMsg);
                            }
                        });
                    }else {
                        prem={
                            access_token: app.url.access_token,
                            idList:item,
                            state:0,
                        }
                        $http.post(app.url.community.replyAuditdel,prem).success(function (data) {
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.bycheckComment(2);
                            }else{
                                toaster.pop('info',null,data.resultMsg);
                            }
                        })
                    }
                }else {
                    if(!testlist().join(",")){
                        toaster.pop('error',null,'请选择帖子');
                        return
                    }
                    if(type==1){
                        prem={
                            access_token: app.url.access_token,
                            idList:testlist().join(","),
                            state:0,
                        };
                        $http.post(app.url.community.replyAuditaudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.bycheckComment(1);
                            }else{
                                toaster.pop('info',null,data.resultMsg);
                            }
                        });
                    }else {
                        prem={
                            access_token: app.url.access_token,
                            idList:testlist().join(","),
                            state:0,
                        }
                        $http.post(app.url.community.replyAuditdel,prem).success(function (data) {
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.bycheckComment(2);
                            }else{
                                toaster.pop('info',null,data.resultMsg);
                            }
                        })
                    }
                }
            }
        }
    ]);
    app.controller('ModaldeleteCommentCtrl',['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster',function($scope, $uibModal, $http, items, $uibModalInstance, toaster){
        $scope.modalCancel=function () {
            $uibModalInstance.dismiss('data');
        };
        $scope.modalOk=function(){
            if(items){
                $http.post(app.url.community.replyAuditdel,{
                    access_token:app.url.access_token,
                    idList:items,
                    state:1
                }).success(function (data) {
                    if(data.resultCode==1){
                        toaster.pop('danger',null,'删除成功');
                        $uibModalInstance.close(data);
                    }else{
                        toaster.pop('danger',null,data.resultMsg);
                    }
                })
            }else {
                toaster.pop('error',null,'请选择要删除的评论');
            }
        }
    }]);

})();
