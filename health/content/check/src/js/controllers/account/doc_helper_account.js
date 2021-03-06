/**
 * Created by clf on 2016/2/29.
 */
'use strict';
(function () {
    app.controller('DocHelperAccountCtrl', ['$scope','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams','$filter',function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$filter) {

        //获取医生助手列表
        getGuiderList();
        function getGuiderList(){
            $http.post(app.url.account.getFeldsherList, {
                access_token: app.url.access_token || localStorage.getItem('check_access_token'),
                pageIndex:0,
                userType:2,
                pageSize:9999
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.data=data.data.pageData.map(function(item,index,array){
                        item.name=item.name?item.name:'助手'+item.userId;
                        item.createTime=$filter('date')(item.createTime,'yyyy-MM-dd HH:mm');
                        return item;
                    });
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        }

        //更改状态
        $scope.changeStatus=function(item,$event){
            $event.stopPropagation();
            if(item.status==1){
                $http.post(app.url.account.updateFeldsherStatus, {
                    access_token:app.url.access_token,
                    userId:item.userId,
                    status:2
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success',null,'禁用成功');
                        item.status=2;
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            }
            else{
                $http.post(app.url.account.updateFeldsherStatus, {
                    access_token:app.url.access_token,
                    userId:item.userId,
                    status:1
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        toaster.pop('success',null,'启用成功');
                        item.status=1;
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            }
        };

        ////启用
        //$scope.enable=function(item,$event){
        //    $event.stopPropagation();
        //    $http.post(app.url.account.updateStatus, {
        //        access_token:app.url.access_token,
        //        userId:item.userId,
        //        flag:1
        //    }).
        //    success(function(data, status, headers, config) {
        //        if(data.resultCode==1){
        //            toaster.pop('success',null,'启用成功');
        //            item.status=1;
        //        }
        //        else{
        //            toaster.pop('error',null,data.resultMsg);
        //        }
        //    }).
        //    error(function(data, status, headers, config) {
        //        toaster.pop('error',null,data.resultMsg);
        //    });
        //};
        //
        ////禁用
        //$scope.disable=function(item,$event){
        //    $event.stopPropagation();
        //    $http.post(app.url.account.updateStatus, {
        //        access_token:app.url.access_token,
        //        userId:item.userId,
        //        flag:5
        //    }).
        //    success(function(data, status, headers, config) {
        //        if(data.resultCode==1){
        //            toaster.pop('success',null,'禁用成功');
        //            item.status=0;
        //        }
        //        else{
        //            toaster.pop('error',null,data.resultMsg);
        //        }
        //    }).
        //    error(function(data, status, headers, config) {
        //        toaster.pop('error',null,data.resultMsg);
        //    });
        //};


        //打开添加导医账户模态框
        $scope.openAddGuiderModal=function(){
            var modalInstance = $modal.open({
                templateUrl: 'addDocHelperModalContent.html',
                controller: 'addDocHelperInstanceCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (returnValue) {
                if(returnValue=='ok'){
                    getGuiderList();
                }
            }, function () {

            });
        };

        //打开修改导医信息模态框
        $scope.openGuiderInfoModal=function(item){
            var modalInstance = $modal.open({
                templateUrl: 'docHelperInfoModalContent.html',
                controller: 'docHelperInfoInstanceCtrl',
                size: 'md',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (returnValue) {
                if(returnValue=='ok'){
                    getGuiderList();
                }
            }, function () {

            });
        };
    }]);

    app.controller('addDocHelperInstanceCtrl', ['$scope', '$modalInstance','toaster','$http','utils',function ($scope, $modalInstance,toaster,$http,utils) {
        $scope.addGuiderAccount=function(){
            $scope.errorInfo='';
            if(!$scope.name){
                $scope.errorInfo='用户名不能为空';
                return;
            }
            if(!$scope.telephone){
                $scope.errorInfo='手机号码不能为空';
                return;
            }

            if(($scope.telephone + '').length < 11) {
                $scope.errorInfo='手机号码小于11位';
                return;
            }

            $http.post(app.url.account.register, {
                access_token:app.url.access_token,
                telephone:$scope.telephone,
                name:$scope.name,
                userType:2
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success',null,'添加成功');
                    $modalInstance.close('ok');
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });
        };

        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

    app.controller('docHelperInfoInstanceCtrl', ['$scope', '$modalInstance','toaster','$http','item',function ($scope, $modalInstance,toaster,$http,item) {
        $scope.name=item.name;
        $scope.telephone=item.telephone;
        $scope.saveGuiderAccount=function(){
            $scope.errorInfo='';
            if(!$scope.name){
                $scope.errorInfo='用户名不能为空';
                return;
            }
            if(!$scope.telephone){
                $scope.errorInfo='手机号码不能为空';
                return;
            }

            $http.post(app.url.account.updateFeldsherInfo, {
                access_token:app.url.access_token,
                userId:item.userId,
                name:$scope.name,
                telephone:$scope.telephone
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success',null,'修改成功');
                    $modalInstance.close('ok');
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });
        };

        $scope.resetPassWord=function(){
            $http.post(app.url.account.resetPassword, {
                access_token:app.url.access_token,
                userId:item.userId,
                telephone:item.telephone
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success',null,'重置成功');
                    $modalInstance.close('ok');
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });
        };

        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
})()
