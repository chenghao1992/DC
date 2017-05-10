'use strict';
(function () {
    app.controller('checkreportlist', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams','$modal',
        function($rootScope, $scope, $http,utils, $state, toaster, $stateParams,$modal) {
            $scope.page = {
                index:1,
                size:10,
                index1:1,
                size1:10,
                index2:1,
                size2:10
            };
            $scope.search={};
            $scope.check = {
                isOne: false,
                isTwo:false,
                isThere:false,
            };
            //$scope.tabs.active = [true, false, false];
            $scope.checkReport=function(e){
                var pream={};
                $scope.reportList=[];
                $scope.check.isOne=false;
                $scope.check.isTwo=false;
                $scope.check.isThere=false;
                $scope.numberlsit=0;
                if(e==0){
                    $scope.search.keyword1="";
                    $scope.search.keyword2="";
                    pream={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index-1,
                        pageSize:$scope.page.size,
                        state:'0',
                        keywords:$scope.search.keyword
                    }
                }else if(e==1){
                    $scope.search.keyword="";
                    $scope.search.keyword2="";
                    pream={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index1-1,
                        pageSize:$scope.page.size1,
                        state:'2',
                        keywords:$scope.search.keyword1
                    }
                }else {
                    $scope.search.keyword="";
                    $scope.search.keyword1="";
                    pream={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index2-1,
                        pageSize:$scope.page.size2,
                        state:'1',
                        keywords:$scope.search.keyword2
                    }
                }
                $http.post(app.url.community.checkAuditlist,pream).success(function (data) {
                    if(data.resultCode==1){
                        $scope.reportList=data.data.pageData;
                        for(var i in $scope.reportList){
                            $scope.reportList[i].isCheck=false;
                        }
                        if(e==1){
                            $scope.search.postTotal1=data.data.total;
                        }else if(e==2){
                            $scope.search.postTotal2=data.data.total;
                        }else{
                            $scope.search.postTotal0=data.data.total;
                        }
                        // $scope.search.postTotal=data.data.total;
                    }else{
                        toaster.pop('danger',null,data.resultMsg);
                    }
                }).error(function(data){
                    toaster.pop('error', null, "服务器繁忙，请稍后再试！");
                })
            };
            $scope.queryReportList=function (type,key) {
                if(type==0){
                    $scope.search.keyword=key;
                    $scope.checkReport(0);
                    $scope.page.index=1;
                }else if(type==1){
                    $scope.search.keyword1=key;
                    $scope.checkReport(1);
                    $scope.page.index1=1;
                }else{
                    $scope.search.keyword2=key;
                    $scope.checkReport(2);
                    $scope.page.index2=1;
                }
            }
            $scope.byReportPass=function(e){
                if(e){
                    $http.post(app.url.community.checkAuditaudit,{
                        access_token: app.url.access_token,
                        idList:e,
                        state:2
                    }).success(function (data) {
                        if(data.resultCode==1){
                            toaster.pop('info',null,'审核成功');
                            $scope.checkReport(0);
                        }else{
                            toaster.pop('danger',null,data.resultMsg);
                        }
                    })
                }else{
                    $http.post(app.url.community.checkAuditaudit,{
                        access_token: app.url.access_token,
                        idList:testlist().join(","),
                        state:2
                    }).success(function (data) {
                        if(data.resultCode==1){
                            toaster.pop('info',null,'审核成功');
                            $scope.checkReport(0);
                        }else{
                            toaster.pop('error',null,"请选择待审核的举报帖子");
                        }
                    })
                }
            };
            $scope.numberlsit=0;
            $scope.allSelected = function(e) {
                if(e==true){
                    for(var i=0 ; i< $scope.reportList.length;i++){
                        $scope.reportList[i].isCheck=true;
                        $scope.numberlsit=$scope.reportList.length;
                    }
                }
                else {
                    for(var i=0 ; i< $scope.reportList.length;i++){
                        $scope.reportList[i].isCheck=false;
                        $scope.numberlsit=0;
                    }
                }
            };
            var testlist=function(){
                var checkList = [];
                for(var i=0 ; i< $scope.reportList.length;i++){
                    if($scope.reportList[i].isCheck==true) {
                        checkList.push($scope.reportList[i].id);
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
            $scope.byReportDel=function(e){
                var id='';
                if(e){
                    id=e;
                }else{
                    id=testlist().join(",");
                }
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'deleteReport.html',
                    controller: 'ModaldeleteReportCtrl',
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
                        $scope.checkReport(0);
                    }
                });
            };
            $scope.checkReportNopass=function(item,type){
                if(item!=0){
                    var prem={};
                    if(type==1){
                        prem={
                            access_token: app.url.access_token,
                            idList:item,
                            state:0
                        }
                        $http.post(app.url.community.checkAuditaudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.checkReport(1);

                            }else{
                                toaster.pop('danger',null,data.resultMsg);
                            }
                        })
                    }else{
                        prem={
                            access_token: app.url.access_token,
                            idList:item,
                            state:0
                        };
                        $http.post(app.url.community.checkAuditdel,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.checkReport(2);
                            }else{
                                toaster.pop('danger',null,data.resultMsg);
                            }
                        });
                    }
                }else{
                    if(!testlist().join(",")){
                        toaster.pop('error',null,'请选择帖子');
                        return
                    }
                    if(type==1){
                        prem={
                            access_token: app.url.access_token,
                            idList:testlist().join(","),
                            state:0
                        }
                        $http.post(app.url.community.checkAuditaudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.checkReport(1);
                            }else{
                                toaster.pop('danger',null,data.resultMsg);
                            }
                        })
                    }else{
                        prem={
                            access_token: app.url.access_token,
                            idList:testlist().join(","),
                            state:0
                        };
                        $http.post(app.url.community.checkAuditdel,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.checkReport(2);
                            }else{
                                toaster.pop('danger',null,data.resultMsg);
                            }
                        });
                    }
                }
            };
            $scope.funPageindex=function(e){
                if(e==0){
                    $scope.checkReport(0);
                }else if(e==1){
                    $scope.checkReport(1);
                }else{
                    $scope.checkReport(2);
                }
            }
            $scope.funPageSizeChange=function(e){
                if(e==0){
                    $scope.page.index=1;
                    $scope.checkReport(0);
                }else if(e==1){
                    $scope.page.index1=1;
                    $scope.checkReport(1);
                }else {
                    $scope.page.index2=1;
                    $scope.checkReport(2);
                }
            }
            $scope.funGoDetail = function (topicId,type,page,stu,id) {
                var url = $state.href('postDetailCheck', {id:topicId,type:type,page:page,zt:stu,topid:id});
                window.open(url,'_blank');
            };
            window.reflashData=function(type,index,status){
                if(status==2){
                    if(type==0){
                        $scope.page.index=index;
                        $scope.checkReport(type);
                    }else if(type==1){
                        $scope.page.index1=index;
                        $scope.checkReport(type);
                    }else {
                        $scope.page.index2=index;
                        $scope.checkReport(type);
                    }
                }
            };
        }
    ]);
    app.controller('ModaldeleteReportCtrl',['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster',function($scope, $uibModal, $http, items, $uibModalInstance, toaster){
        $scope.modalCancel=function () {
            $uibModalInstance.dismiss('data');
        };
        $scope.modalOk=function(){
            if(items){
                $http.post(app.url.community.checkAuditdel,{
                    access_token:app.url.access_token,
                    idList:items.toString(),
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
                toaster.pop('error',null,'请选择要删除的举报帖子');
            }
        }
    }]);

})();
