/**
 * Created by clf on 2016/2/29.
 */
'use strict';
(function () {
    app.controller('DocHelperAccountCtrl', ['$scope','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams','$filter',function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$filter) {

        // 获取医生助手列表
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
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null, '服务器繁忙，请稍后再试！');
            });
        }

        // 打开添加导医账户模态框
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

        // 修改医生助手信息
        $scope.editGuiderInfoModal = function(item){
            var modalInstance = $modal.open({
                templateUrl: 'docHelperEditModalContent.html',
                controller: 'docHelperEditInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return angular.copy(item);
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
            if(!(/^1\d{10}$/.test($scope.telephone))){ 
                $scope.errorInfo='请填写正确的手机号码'; 
                return false; 
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

    app.controller('docHelperEditInstanceCtrl', ['$scope', '$modalInstance','toaster','$http','item',function ($scope, $modalInstance,toaster,$http,item) {
        
        if(item.telephone) {
            item.telephone = Number(item.telephone);
        }
        $scope.item = item;

        $scope.state = {
            changeStatus: false, // 是否正在修改状态
            ifRefresh: false // 返回时是否需要刷新
        }

        // 初始化分页参数
        $scope.pageIndex = 1;
        $scope.pageSize = 5;

        $scope.setTable = function(pageIndex, pageSize) {
            $http.post(app.urlRoot + 'designer/getCarePlans', {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || '',
                pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
                pageSize: pageSize || $scope.pageSize || 10
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    $scope.planList = rpn.data.pageData;
                    $scope.page_count = rpn.data.total;

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };

        $scope.pageChanged = function() {
            $scope.setTable();
        };

        // 修改助手信息
        $scope.saveGuiderAccount=function(){
            $scope.errorInfo = '';
            if(!$scope.item.name){
                $scope.errorInfo='用户名不能为空';
                return;
            }
            if(!$scope.item.telephone){
                $scope.errorInfo='手机号码不能为空';
                return;
            }
            if(!(/^1\d{10}$/.test($scope.item.telephone))){ 
                $scope.errorInfo='请填写正确的手机号码'; 
                return false; 
            } 

            $http.post(app.url.account.updateFeldsherInfo, {
                access_token:app.url.access_token,
                userId:item.userId,
                name:$scope.item.name,
                telephone:$scope.item.telephone
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success',null,'修改成功');
                    // $modalInstance.close('ok');
                    $scope.state.ifRefresh = true;
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null, '服务器繁忙，请稍后再试！');
            });
        };

        // 重置密码
        $scope.resetPassWord=function(){
            $http.post(app.url.account.resetPassword, {
                access_token:app.url.access_token,
                userId:item.userId,
                telephone:item.telephone
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success',null,'重置成功');
                    // $modalInstance.close('ok');
                    $scope.state.ifRefresh = true;
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null, '服务器繁忙，请稍后再试！');
            });
        };

         // 启用/禁用
        $scope.changeStatus=function(){
            if($scope.state.changeStatus) {
                return ;
            } else {
                $scope.state.changeStatus = true;
            }

            $http.post(app.url.account.updateFeldsherStatus, {
                access_token:app.url.access_token,
                userId: item.userId,
                status: item.status == 1 ? 2 : 1
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    var msg = item.status==1 ? '禁用成功！' : '启用成功！';
                    toaster.pop('success', null, msg);
                    item.status = item.status == 1 ? 2 : 1;
                    $scope.state.ifRefresh = true;
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
                $scope.state.changeStatus = false;
            }).
            error(function(data, status, headers, config) {
                $scope.state.changeStatus = false;
                toaster.pop('error',null, '服务器繁忙，请稍后再试！');
            });
        };

        $scope.cancel = function() {
            if($scope.state.ifRefresh) {
                $modalInstance.close('ok'); // 刷新列表
            } else {
                $modalInstance.dismiss('cancel'); // 不刷新
            }
        };
    }]);
})()
