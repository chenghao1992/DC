(function() {
    angular.module('app')
        .controller('TimeSchedulingCtrl', TimeSchedulingCtrl)
        .controller('TimeSchedulingCtrlModalInstanceCtrl', TimeSchedulingCtrlModalInstanceCtrl);

    TimeSchedulingCtrl.$inject = ['$scope', '$uibModal', 'moment'];

    function TimeSchedulingCtrl($scope, $uibModal, moment) {

        $scope.open = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'TimeSchedulingCtrlBox.html',
                controller: 'TimeSchedulingCtrlModalInstanceCtrl',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    dataPrev: {
                        minuteStep: $scope.minuteStep,
                        hourStep: $scope.hourStep,
                        minDate: $scope.minDate,
                        maxDate: $scope.maxDate,
                        options: JSON.parse($scope.options),
                        callBack: function(e) {
                            $scope.callBack(e);
                        }
                    }
                }
            });
        };

    };

    TimeSchedulingCtrlModalInstanceCtrl.$inject = ['$scope', '$http', '$uibModalInstance', 'toaster', 'dataPrev', 'constants'];

    function TimeSchedulingCtrlModalInstanceCtrl($scope, $http, $uibModalInstance, toaster, dataPrev, constants) {

        $scope.dataPrev = {
            start: dataPrev.minDate,
            end: dataPrev.maxDate,
            minDate: dataPrev.minDate,
            maxDate: dataPrev.maxDate,
            minuteStep: dataPrev.minuteStep,
            hourStep: dataPrev.hourStep
        }

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        // 新增排班
        $scope.ok = function() {
            var period = funGetPeriod($scope.dataPrev.start,$scope.dataPrev.end);
            if(period == -2){
                toaster.pop('error', null, "请选择整点或整点半");
                return ;
            }
            if(period == -1){
                toaster.pop('error', null, "开始时间不能大于结束时间");
                return ;
            }
            var tempObj = {
                access_token: localStorage['groupHelper_access_token'],
                doctorId: dataPrev.options.id,
                hospitalId: dataPrev.options.hospitalId,
                hospital: dataPrev.options.hospital,
                week: dataPrev.options.week,
                startTime: moment($scope.dataPrev.start).unix()*1000,
                endTime: moment($scope.dataPrev.end).unix()*1000,
                dateTime: dataPrev.options.date,
                period: period
            }
            $http.post(constants.api.scheduling.addOffline, tempObj)
            .success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    dataPrev.callBack(); 
                    toaster.pop('success', null, "新增排班成功");
                    $uibModalInstance.close();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                toaster.pop('error', null, "网络错误");
            });

        };

        // 获取对应的时间段period
        function funGetPeriod(startTime,endTime) {
            if( !startTime || !endTime ){
                return "";
            }
            var sixTime = parseInt(moment(startTime).startOf('day').add(6, 'h').unix()); // 6点
            var twelveTime = parseInt(moment(startTime).startOf('day').add(12, 'h').unix()); // 12点
            var eighteenTime = parseInt(moment(startTime).startOf('day').add(18, 'h').unix()); // 18点
            var halfTTTime = parseInt(moment(startTime).startOf('day').add(22, 'h').add(30, 'm').unix()); // 22:30点
            var start = parseInt(moment(startTime).unix());
            var end = parseInt(moment(endTime).unix());
            var startFormat = moment(startTime).format('mm')+'';
            var endFormat = moment(endTime).format('mm')+'';

            if( (startFormat!='00' && startFormat!='30') || (endFormat!='00' && endFormat!='30') ){
                return -2;
            }
            if( start-end > 0 ){
                return -1;
            }
            if( sixTime-start<=0 && end-twelveTime<=0 ){
                return 1;
            }
            if( twelveTime-start<=0 && end-eighteenTime<=0 ){
                return 2;
            }
            if( eighteenTime-start<=0 && end-halfTTTime<=0 ){
                return 3;
            }
            return "";
        }
    }

})();
