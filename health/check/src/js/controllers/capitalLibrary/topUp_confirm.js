'use strict';
(function () {
//充值确认
    app.controller('topUpConfirmCtrl', ['$rootScope', '$scope', '$state', '$http', '$compile', 'utils', '$modal', 'toaster', '$stateParams',function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {
        getVendors();
        // 获取药厂选项
        function getVendors() {
            $http.post(app.url.compnMan.searchByDrugCompany,{
                access_token:app.url.access_token
            }).success(function(data){
                if(data.resultCode==1){
                    $scope.vendors=data.data.pageData;
                }
            });
        }
        // 获取y药品选项
        $scope.getDrugs=function(companyId) {
            $http.post(app.url.VartMan.getCheckedGoodsListByCompanyId,{
                access_token:app.url.access_token,
                companyId:companyId
            }).success(function(data){
                if(data.resultCode==1){
                    //Sdata=data.data;
                    $scope.drugs=data.data;
                }
            });
        };

        // 状态选项
        $scope.statusOption = [{
            title: '全部',
            value: ''
        }, {
            title: '待核对',
            value: 1
        }, {
            title: '核对通过',
            value: 2
        }, {
            title: '审核通过',
            value: 3
        }, {
            title: '核对不通过',
            value: 5
        }, {
            title: '审核不通过',
            value: 6
        }, {
            title: '已取消',
            value: 7
        }];

        $scope.pageSize = 10;
        $scope.pageIndex = 1;
        $scope._status = '';
        $scope.vendorId = '';
        $scope.drugId = '';

        // 翻页
        $scope.pageChange = function() {
            getWalletRechargeList($scope.pageSize, $scope.pageIndex, $scope.startDate, $scope.endDate, $scope.status, $scope.vendorId, $scope.drugId);
        };

        getWalletRechargeList($scope.pageSize,$scope.pageIndex);
        // 获取列表数据
        function getWalletRechargeList(pageSize, pageIndex, startDate, endDate, status, vendorId, drugId) {

            if (pageSize)
                $scope.pageSize = pageSize;
            if (pageIndex)
                $scope.pageIndex = pageIndex;

            $scope.startDate = startDate;
            if (startDate)
                startDate = moment($scope.startDate).unix() * 1000;

            $scope.endDate = endDate;
            if (endDate)
                endDate = moment($scope.endDate).unix() * 1000;

            $scope.status = status;

            $scope.vendorId = vendorId;

            $scope.drugId = drugId;
            $http.post(app.url.VartMan.getWalletRechargePageList,{
                access_token:app.url.access_token,
                drugCompanyId:vendorId,
                goodsId:drugId,
                startDate:startDate,
                endDate:endDate,
                status :status,
                pageSize:pageSize,
                pageIndex:pageIndex-1

            }).success(function(data){
                if(data.resultCode==1){
                    $scope.walletRechargeList = data.data.pageData;
                    $scope.page_count = data.data.total;
                }else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, data.resultMsg);
                } else {
                    toaster.pop('error', null, '获取数据出错');
                }
            });
        }
        $scope.getWalletRechargeList = getWalletRechargeList;

        $scope.walletRechargeApprove = function(id, status, item) {
            if (status == 2) {
                var data = {
                    id: id,
                    status: status,
                    item: item
                };
                $scope.openCheckMoneyDialog(data);
            } else {
                walletRechargeApprove(id, status);
            }

        };

        function walletRechargeApprove(id, status, money) {

            $http.post(app.url.VartMan.walletRechargeApprove,{
                access_token:app.url.access_token,
                id:id,
                status:status,
                money:money*100||''

            }).success(function(data){
                if(data.resultCode==1){
                    //getWalletRechargeList($scope.pageSize, $scope.pageIndex, $scope.startDate, $scope.endDate, $scope.status, $scope.vendorId, $scope.drugId)
                    toaster.pop('success', null, '操作成功');
                    $state.reload();
                }else if (data && data.resultMsg) {
                    toaster.pop('error', null, data.resultMsg);
                } else {
                    toaster.pop('error', null, '获取数据出错');
                }
            });
        }

        // 日历打开关闭
        $scope.open = function($event, typeBtn) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[typeBtn] = true;
        };

        // 核对金额窗口
        $scope.openCheckMoneyDialog = function(data) {

            var modalInstance = $modal.open({
                templateUrl: 'CheckMoneyDialog.html',
                controller: 'CheckMoneyDialogCtrl',
                size: 'sm',
                resolve: {
                    data: function() {
                        var _data = data || {};
                        return _data;
                    }
                }
            });

            modalInstance.result.then(function(money) {
                walletRechargeApprove(data.id, data.status, money);

            });

        };

    }])

// 审核确认弹框
    app.controller('CheckMoneyDialogCtrl', ['$scope', '$modalInstance', 'data',function($scope, $modalInstance, data) {

        $scope.money = data.item.money || 0;

        $scope.applyMoney = data.item.applyMoney;

        $scope.ok = function() {
            $modalInstance.close($scope.money);
        };

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();

