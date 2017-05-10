(function() {
    angular.module('app')
        .controller('SearchOrderModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http','constants','options','orderDetailModalFactory',function($scope, $modalInstance, toaster, $http,constants,options,orderDetailModalFactory){
            $scope.data=[];
            //watch搜索框，计算输入字符串的长度
            $scope.keyWordLength=0;
            $scope.$watch('keyWord',function(newValue, oldValue){
                if(newValue!==oldValue){
                    if($scope.keyWord){
                        $scope.keyWordLength=$scope.keyWord.length;
                    }
                    else{
                        $scope.keyWordLength=0;
                    }
                }
            });

            $scope.transOrderStatus=function(item){
                if(item.orderStatus==1){
                    return '待预约';
                }
                else if(item.orderStatus==2){
                    return '待支付';
                }
                else if(item.orderStatus==3&&item.serviceBeginTime){
                    return '进行中';
                }
                else if(item.orderStatus==3){
                    return '已支付';
                }
                else if(item.orderStatus==4){
                    return '已完成';
                }
                else if(item.orderStatus==5){
                    return '已取消';
                }
                else if(item.orderStatus==6){
                    return '进行中';
                }
                else if(item.orderStatus==7){
                    return '待完善';
                }
                else if(item==10){
                    return '预约成功';
                }
            };

            //通过关键字搜索
            $scope.findByKeyWord=function(){
                $http.post(constants.api.outLine.searchAppointmentOrderByKeyword, {
                    access_token: localStorage['groupHelper_access_token'],
                    keyword:$scope.keyWord||null,
                    pageIndex: 0,
                    pageSize: 9999
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.data=data.data.pageData||[];
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            };

            //清除搜索关键字
            $scope.clearKW=function(){
                $scope.keyWord=null;
                $scope.data=[];
            };


            //按回车键搜索
            $scope.pressEnter=function($event){
                if($event.keyCode==13){
                    $scope.findByKeyWord();
                }
            };


            //查看详情
            $scope.showDetail=function(item){
                orderDetailModalFactory.openModal({
                    orderId:item.orderId,
                    callback:$scope.findByKeyWord
                });
            };

            //点击取消
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
})();
