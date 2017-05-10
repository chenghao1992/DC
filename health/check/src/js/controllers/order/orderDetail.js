'use strict';
(function() {

//订单详情控制器
angular.module('app').controller('OrderDetailCtrl', OrderDetailCtrl);
OrderDetailCtrl.$inject = ['$scope', '$timeout','utils','$http','$modal','$log','toaster','$location','$state','$stateParams','Lightbox'];
function OrderDetailCtrl($scope, $timeout,utils,$http,$modal,$log,toaster,$location,$state,$stateParams,Lightbox) {
    $scope.orderId = $stateParams.id; //获取URL的参数orderId
    $scope.images = [
        {
            'url': 'http://www.deskcar.com/desktop/fengjing/2012712204621/14.jpg',
            'thumbUrl': 'http://www.deskcar.com/desktop/fengjing/2012712204621/14.jpg'
        },
        {
            'url': 'http://www.deskcar.com/desktop/fengjing/2012712204621/15.jpg',
            'thumbUrl': 'http://www.deskcar.com/desktop/fengjing/2012712204621/15.jpg'
        }
    ];
    $scope.openLightboxModal = function (index) {
        Lightbox.openModal(['http://www.deskcar.com/desktop/fengjing/' +
        '/15.jpg'], index);
    };


    //获取订单详情数据
    (function () {
        $http.post(app.url.order.getOrderDetail,{
            access_token:app.url.access_token,
            orderId:$scope.orderId
        }).
        success(function (data, status, headers, config) {
            if(data.resultCode==1){
                $log.log(data);
                $scope.orderDetail =data.data;
                $scope.orderDoctors =data.data.doctors[0];//医生信息
            }
            else{
                toaster.pop('error',null,data.resultMsg);
            }

        }).
        error(function (data, status, headers, config) {
            toaster.pop('error',null,data.resultMsg);
        })
    })();

    //获取电子病历详情
    (function () {
        $http.post(app.url.order.getIllCaseByOrderId,{
            access_token:app.url.access_token,
            orderId:$scope.orderId
        }).
        success(function (data, status, headers, config) {
            if(data.resultCode==1){
                console.log(data);
                $scope.caseContent =data.data;
            }else{
                toaster.pop('error',null,data.resultMsg);
            }
        }).
        error(function (data, status, headers, config) {
            toaster.pop('error',null,data.resultMsg);
        })
    })();

    //取消订单
    $scope.CancelOrder =function () {
        var modalInstance = $modal.open({
            templateUrl: 'cancelOrder.html',
            controller: 'cancelOrderCtrl',
            resolve: {
                items: function () {
                    return {
                        orderId: $scope.orderId
                    }
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
            $log.info('取消');
        });
    }


};

angular.module('app').controller('cancelOrderCtrl', cancelOrderCtrl);
cancelOrderCtrl.$inject = ['$scope', '$modalInstance','$log','$rootScope','$http','toaster','items'];
function cancelOrderCtrl($scope, $modalInstance,$log,$rootScope,$http,toaster,items) {
    $scope.orderId =items.orderId;
    //取消订单
    $scope.orderOK =function () {
        $http.post(app.url.order.cancelOrderByAdmin,{
            access_token:app.url.access_token,
            orderId:$scope.orderId,
            cancelReason: $scope.canceCause
        }).
        success(function (data, status, headers, config) {
            $modalInstance.dismiss('cancel');
            toaster.pop('success',null,data.resultMsg);
        }).
        error(function (data, status, headers, config) {
            toaster.pop('error',null,data.resultMsg);
        })
    }
    //返回
    $scope.orderNo =function () {
        $modalInstance.dismiss('cancel');
    }
};

})();
