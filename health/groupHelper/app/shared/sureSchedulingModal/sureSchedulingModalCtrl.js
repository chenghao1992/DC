(function() {
    angular.module('app')
    .controller('SureSchedulingModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http','constants','optionsEdit', "$uibModalInstance",
        function($scope, $modalInstance, toaster, $http, constants, optionsEdit, $uibModalInstance ){

        	$scope.type = optionsEdit.type;

        	// 关闭弹窗
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            // 删除医生排班信息
            $scope.funDeleteOffline = function(){
                $http.post(constants.api.scheduling.deleteOffline, {
                    access_token: localStorage['groupHelper_access_token'],
                    id: optionsEdit.id,
                    doctorId: optionsEdit.doctorId,
                    hospitalId: optionsEdit.hospitalId
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "撤销成功");
                        $uibModalInstance.close();
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                        $uibModalInstance.close();
                    }
                }).error(function(data, status, headers, config) {
                    toaster.pop('error', null, "网络错误");
                });   
            }
        
    }]);
})();
