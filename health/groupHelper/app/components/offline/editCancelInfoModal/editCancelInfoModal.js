(function() {
    angular.module('app')
        .factory('EditCancelInfoModal', EditCancelInfoModal);

    function EditCancelInfoModal($uibModal) {

        var template = '\
        <div>\
            <h3 class="p-md">为了确保取消订单为实际操作：</h3>\
            <div class="form-group clearfix">\
            <label class="col-sm-3 control-label" for="input-id-1">请输入您密码：</label>\
                <div class="col-sm-9">\
                    <input type="password" class="form-control" ng-model="password">\
                </div>\
            </div>\
            <div class="p-l-md p-r-md">请填写取消原因（系统会告知医生与患者）：</div>\
            <div class="p-md">\
                <textarea ng-model="reason" class="form-control" rows="5" placeholder=""></textarea>\
            </div>\
            <div class="text-center">\
                <div class="m-t-sm m-b-md">\
                    <button class="btn m-b-xs w-xs btn-success" ng-click="ok(data)">确定</button>\
                    <button class="btn m-b-xs w-xs btn-default" ng-click="cancel()">返回</button>\
                </div>\
            </div>\
        </div>\
        ';

        function open(options) {
            var modalInstance = $uibModal.open({
                template: template,
                controller: 'EditCancelInfoModalCtrl',
                keyboard: false,
                size: 'md',
                resolve: {
                    options: options
                }

            });

            modalInstance.result.then(function(data) {
                if (options.callback) {
                    options.callback(data);
                }
            });
        };

        return {
            open: open
        }

    };

    angular.module('app')
        .controller('EditCancelInfoModalCtrl', EditCancelInfoModalCtrl)

    function EditCancelInfoModalCtrl($scope, $modalInstance,toaster,$http,constants,options) {
        console.log(options);

        //点击取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            if(!$scope.password){
                toaster.pop('error', null, '请输入密码');
                return;
            }

            $http.post(constants.api.outLine.cancelOrder, {
                access_token: localStorage['groupHelper_access_token'],
                orderId: options.orderId,
                pwd:$scope.password,
                cancelReason:$scope.reason||''
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '已取消订单');
                    if(options.callback){
                        options.callback();
                    }
                    $modalInstance.dismiss('cancel');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };
    };

})();
