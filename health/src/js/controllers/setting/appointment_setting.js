'use strict';
(function(){
    app.controller('appointmentEdit', ['$rootScope', '$scope', '$modal', '$log', '$http', '$state', '$stateParams', 'utils', 'modal', 'Group', 'toaster', 'AppFactory',


        function($rootScope, $scope, $modal, $log, $http, $state, $stateParams, utils, modal, Group, toaster, AppFactory) {


            // 获取当前组织信息
            $scope.currentOrgInfo = Group.getCurrentOrgInfo();

            $scope.appointment = {
                openAppointment: false,
                appointmentGroupProfit: 0,
                appointmentParentProfit: 0,
                appointmentMin: 0
            };

            (function() {
                $http.post(app.url.order.getAppointmentInfo, {
                    access_token: localStorage.getItem('access_token'),
                    groupId: $scope.currentOrgInfo.id

                }).then(function(_data) {
                    _data = AppFactory.ajax.dealHealth(_data);
                    if (_data) {
                        $scope.appointment = {
                            openAppointment: _data.openAppointment,
                            appointmentGroupProfit: _data.appointmentGroupProfit,
                            appointmentParentProfit: _data.appointmentParentProfit,
                            appointmentMin: _data.appointmentMin / 100
                        }
                    }
                });
            })();

            // 设置线下预约
            $scope.funSetAppointment = function(appointment) {
                if (!funCheckParam(appointment)) return;

                $http.post(app.url.order.setAppointmentInfo, {
                    access_token: localStorage.getItem('access_token'),
                    groupId: $scope.currentOrgInfo.id,
                    openAppointment: appointment.openAppointment,
                    appointmentGroupProfit: appointment.appointmentGroupProfit,
                    appointmentParentProfit: appointment.appointmentParentProfit,
                    appointmentMin: appointment.appointmentMin * 100
                }).then(function(_data) {
                    _data = AppFactory.ajax.dealHealth(_data);
                    if (_data) {
                        toaster.pop('success', null, '设置成功');
                    }
                });

            };

            function funCheckParam(_data) {
                if (!_data.openAppointment) {
                    return true;
                }
                if (_data.appointmentMin <= 0) {
                    toaster.pop('error', null, '集团预约收费价格不能少于0');
                    return false;
                }
                if (100 < _data.appointmentGroupProfit || _data.appointmentGroupProfit < 0) {
                    toaster.pop('error', null, '集团分成比例范围为0%～100%');
                    return false;
                }
                if (100 < _data.appointmentParentProfit || _data.appointmentParentProfit < 0) {
                    toaster.pop('error', null, '上级分成比例范围为0%～100%');
                    return false;
                }
                if ((_data.appointmentGroupProfit) - 0 + (_data.appointmentParentProfit - 0) > 100) {
                    toaster.pop('error', null, '集团抽成与上级抽成比例之和不能大于100%');
                    return false;
                }
                return true
            };

        }
    ]);

})();
//集团设置控制器
