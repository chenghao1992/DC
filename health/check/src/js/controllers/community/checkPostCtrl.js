'use strict';
(function () {
    app.controller('checkpostlist', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams','$modal',
        function($rootScope, $scope, $http,utils, $state, toaster, $stateParams,$modal) {
            //初始话分页
            $scope.page = {
                size: 10,
                index: 1,
                size1:10,
                index1:1,
                size2:10,
                index2:1
            };
            $scope.search={};
            $scope.activeTab = [true,false,false];
            $scope.check = {
                isCheckAll: false,
                isCheckAll1:false,
                isCheckAll2:false
            };
            //面板数据
            $scope.byPostCheck=function (e) {
                var parem={};
                $scope.datalist=[];
                $scope.check.isCheckAll=false;
                $scope.check.isCheckAll1=false;
                $scope.check.isCheckAll2=false;
                $scope.numberlsit=0;
                if(e==0){
                    $scope.search.keyword1="";
                    $scope.search.keyword2="";
                    parem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index-1,
                        pageSize:$scope.page.size,
                        state:0,
                        keywords:$scope.search.keyword
                    }
                }else if(e==1){
                    $scope.search.keyword="";
                    $scope.search.keyword2="";
                    parem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index1-1,
                        pageSize:$scope.page.size1,
                        state:2,
                        keywords:$scope.search.keyword1
                    };

                }else if(e==2){
                    $scope.search.keyword="";
                    $scope.search.keyword1="";
                    parem={
                        access_token: app.url.access_token,
                        pageIndex:$scope.page.index2-1,
                        pageSize:$scope.page.size2,
                        state:1,
                        keywords:$scope.search.keyword2
                    }
                }
                $http.post(app.url.community.topicAuditlist,parem).success(function (data) {
                    if(data.resultCode == 1){
                        $scope.datalist=data.data.pageData;
                        for(var i in $scope.datalist){
                            $scope.datalist[i].isCheck=false;
                        }
                        //点击分页后数据在下一页的做操作的时候数据会乱，暂时没找到好的方法，只能分开获取
                        if(e==1){
                            $scope.search.postTotal1=data.data.total;
                        }else if(e==2){
                            $scope.search.postTotal2=data.data.total;
                        }else{
                            $scope.search.postTotal0=data.data.total;
                        }

                        //$scope.search.postTotal=data.data.total;
                        //e != 1 && !($scope.search.postTotal=data.data.total);
                    }else{
                        toaster.pop('danger',null,data.meg);
                    }
                }).error(function(data){
                    toaster.pop('error', null, "服务器繁忙，请稍后再试！");
                })
            };
            //搜索按钮事件
            $scope.queryReportList=function(e,keyword){
                if(e==0){
                    $scope.search.keyword=keyword;
                    $scope.page.index=1;
                    $scope.byPostCheck(0);
                }else if(e==1){
                    $scope.search.keyword1=keyword;
                    $scope.page.index1=1;
                    $scope.byPostCheck(1);
                }else{
                    $scope.search.keyword2=keyword;
                    $scope.page.index2=1;
                    $scope.byPostCheck(2);
                }
            }
            //下一页上一页
            $scope.funPageindex=function(e){
                if(e==0){
                    $scope.byPostCheck(0);
                }else if(e==1){
                    $scope.byPostCheck(1);
                }else{
                    $scope.byPostCheck(2);
                }
            };
            $scope.funPageSizeChange=function(e){
                if(e==0){
                    $scope.page.index=1;
                    $scope.byPostCheck(0);
                }else if(e==1){
                    $scope.page.index1=1;
                    $scope.byPostCheck(1);
                }else{
                    $scope.page.index2=1;
                    $scope.byPostCheck(2);
                }
            }
            //撤销操作，和当个撤销多个撤销共享一个事件根据item来判断是多条还是单条，type是判断是来着已审核，已删除页面
            $scope.checkPostview=function(item,type){
                var prem={};
                if(item!=0){
                    if(type==1){
                        prem={
                            access_token:app.url.access_token,
                            idList:item,
                            state:0
                        };
                        $http.post(app.url.community.audittopicAudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.byPostCheck(1);
                            }
                        })
                    }else{
                        prem={
                            access_token:app.url.access_token,
                            idList:item,
                            state:0
                        };
                        $http.post(app.url.community.deltopicAudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.byPostCheck(2);
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
                            access_token:app.url.access_token,
                            idList:testlist().join(","),
                            state:0
                        };
                        $http.post(app.url.community.audittopicAudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.byPostCheck(1);
                            }
                        })
                    }else{
                        prem={
                            access_token:app.url.access_token,
                            idList:testlist().join(","),
                            state:0
                        };
                        $http.post(app.url.community.deltopicAudit,prem).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,'撤销成功');
                                $scope.byPostCheck(2);
                            }
                        })
                    }
                }
            };
            //全选
            $scope.allSelected = function(e) {
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
            //删除
            $scope.bydelPost=function(item){
                var id='';
                if(item){
                    id=item
                }else{
                    id=testlist().join(",");
                }
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'deletebanner.html',
                    controller: 'ModaldeletePostCtrl',
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
                        $scope.byPostCheck(0);
                    }
                });
            };
            $scope.bypassPost=function(item){
                if(item){
                    $http.post(app.url.community.audittopicAudit,{
                        access_token:app.url.access_token,
                        idList:item,
                        state:2
                    }).success(function(data){
                        if(data.resultCode==1){
                            toaster.pop('info',null,'审核通过');
                            $scope.byPostCheck(0);
                        }else{
                            toaster.pop('danger',null,data.resultMsg);
                        }
                    });
                }else{
                    $http.post(app.url.community.audittopicAudit,{
                        access_token:app.url.access_token,
                        idList:testlist().join(","),
                        state:2
                    }).success(function(data){
                        if(data.resultCode==1){
                            toaster.pop('info',null,'审核通过');
                            $scope.byPostCheck(0);
                        }else{
                            toaster.pop('error',null,"请选择已审核的帖子");
                        }
                    });
                }
            };
            //预览帖子
            $scope.funGoDetail=function(topicId,type,page,stu){
                var url = $state.href('postDetailCheck', {id:topicId,type:type,page:page,zt:stu});
                window.open(url,'_blank');
            };
            //预览帖子操作后刷新
            window.reflashData=function(type,index,status){
                if(status==1){
                    if(type==0){
                        $scope.page.index=index;
                        $scope.byPostCheck(type);
                    }else if(type==1){
                        $scope.page.index1=index;
                        $scope.byPostCheck(type);
                    }else {
                        $scope.page.index2=index;
                        $scope.byPostCheck(type);
                    }
                }
            };
        }
    ]);
    app.controller('ModaldeletePostCtrl',['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster',function($scope, $uibModal, $http, items, $uibModalInstance, toaster){
        $scope.modalCancel=function () {
            $uibModalInstance.dismiss('data');
        };
        $scope.modalOk=function(){
            if(items){
                $http.post(app.url.community.deltopicAudit,{
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
                toaster.pop('error',null,'请选择要删除的帖子');
            }
        }
    }]);

})();
