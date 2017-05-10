(function() {
    angular.module('app')
        .controller('TimeEditorCtrl', TimeEditorCtrl)
        .controller('TimeEditorCtrlModalInstanceCtrl', TimeEditorCtrlModalInstanceCtrl);

    TimeEditorCtrl.$inject = ['$scope', '$uibModal', 'moment'];

    function TimeEditorCtrl($scope, $uibModal, moment) {

        // 设置时间
        function setFreeDate() {
            var now = moment(new Date()).format('YYYY-MM-DD H');
            var minute = moment(new Date()).format('mm');
            if (minute > 30) {
                now = moment(new Date()).add(1, 'hours').format('YYYY-MM-DD H');
                now = now + ':00';
            } else {
                now = now + ':30';
            }

            now = moment(now).unix()*1000;
            return now;

        }

        $scope.open = function(date, callBackParam) {
            if (!date)
                date = new Date(setFreeDate());
            else
                date = moment(date).unix() * 1000;

            var modalInstance = $uibModal.open({
                templateUrl: 'TimeEditorCtrlBox.html',
                controller: 'TimeEditorCtrlModalInstanceCtrl',
                size: 'md',
                resolve: {
                    data: {
                        date: date,
                        maxDate: $scope.maxDate,
                        minDate: $scope.minDate,
                        minuteStep: $scope.minuteStep,
                        hourStep: $scope.hourStep
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                if ($scope.callBack && callBackParam)
                    $scope.callBack(selectedItem, callBackParam);
                else if ($scope.callBack)
                    $scope.callBack(selectedItem);
                else
                    $scope.date = selectedItem;
            });

        };

    };

    TimeEditorCtrlModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'data'];

    function TimeEditorCtrlModalInstanceCtrl($scope, $uibModalInstance, toaster, data) {
        $scope.changed=function(){
            console.log($scope.data.date);
        };
        $scope.data = data;

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ok = function() {
            $uibModalInstance.close(data.date);
        };


    }

})();
