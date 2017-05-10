(function() {
    angular.module('app')
    .controller('EditSchedulingModalCtrl', ['$scope', '$uibModalInstance', 'toaster', '$http', 'options', 'constants', 'sureSchedulingModalFactory',
        function($scope, $uibModalInstance, toaster, $http, options, constants, sureSchedulingModalFactory ){

            $scope.options = options;
            $scope.minDate = moment(options.date).startOf('day').add(6, 'h').format('YYYY/MM/DD H:mm');
            $scope.maxDate = moment(options.date).startOf('day').add(22, 'h').add(30, 'm').format('YYYY/MM/DD H:mm');

            // 判断医生该时间段是否有被患者预约
            $scope.funEditScheduling = function(id){

                // 判断是否可以撤销
                $http.post(constants.api.scheduling.hasAppointment, {
                    access_token: localStorage['groupHelper_access_token'],
                    id: id
                }).success(function(data, status, headers, config) {
                    if (data) {
                        var optionsEdit = {
                            id: id,
                            hospitalId: options.hospitalId,
                            doctorId: options.id,
                            type: data.data,
                            callback: function(){
                                $scope.funQueryDoctorPeriodOfflines();
                                options.callback();
                            }
                        }
                        sureSchedulingModalFactory.openModal(optionsEdit);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).error(function(data, status, headers, config) {
                    toaster.pop('error', null, "网络错误");
                });   
            }

            // 查询某个医生在哪家医院某个时间段内的所有排班信息
            $scope.funQueryDoctorPeriodOfflines = function(){

                $http.post(constants.api.scheduling.queryDoctorPeriodOfflines, {
                    access_token: localStorage['groupHelper_access_token'],
                    hospitalId: options.hospitalId,
                    doctorId: options.id,
                    dateTime: options.date
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.options.offlines = data.data;
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).error(function(data, status, headers, config) {
                    toaster.pop('error', null, "网络错误");
                });   
            }

            $scope.timeSchedulingCallBack = function(){
                $scope.funQueryDoctorPeriodOfflines();
                options.callback();
            }

            // 关闭弹窗
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
    }]);
})();
