(function() {
    angular.module('app')
        .factory('EditBookTimeModal', EditBookTimeModal);

    function EditBookTimeModal($uibModal) {

        var template = '\
        <div class="clearfix">\
            <div class="col-xs-6 m-t-md m-b-md">\
                <div>\
                    <uib-datepicker class="datepicker w-full text-lg" ng-model="selectDate" current-text="今天" clear-text="清理" close-text="关闭" show-weeks="false" starting-day="1" custom-class="getDayClass(date,mode)" />\
                </div>\
                <div class="text-center m-t">\
                    <button class="btn btn-info r r-2x text-base p-r-sm p-l-sm" ng-click="today()">今天</button>\
                </div>\
            </div>\
            <div class="col-xs-6 m-t-md m-b-md">\
                <div class="b-b grey">上午</div>\
                <ul class="clearfix m-t-sm">\
                    <li class="pull-left m-r-xs m-b-xs" ng-repeat="time in timeLables[1]" ng-click="funSelectBookTime(time.id)" ng-show="timeLables[1]&&timeLables[1].length>0">\
                        <button class="btn btn-sm" ng-class="bookTimeId==time.id?\'btn-info\':\'btn-default\'" ng-disabled="time.patientId">{{time.startTime | date:\'HH:mm\'}}</button>\
                    </li>\
                    <li class="pull-left m-r-xs m-b-xs text-center" ng-hide="timeLables[1]&&timeLables[1].length>0">\
                        没有可预约时间\
                    </li>\
                </ul>\
                <div class="b-b grey">下午</div>\
                <ul class="clearfix m-t-sm">\
                    <li class="pull-left m-r-xs m-b-xs" ng-repeat="time in timeLables[2]" ng-click="funSelectBookTime(time.id)" ng-show="timeLables[2]&&timeLables[2].length>0">\
                        <button class="btn btn-sm" ng-class="bookTimeId==time.id?\'btn-info\':\'btn-default\'" ng-disabled="time.patientId">{{time.startTime | date:\'HH:mm\'}}</button>\
                    </li>\
                    <li class="pull-left m-r-xs m-b-xs text-center" ng-hide="timeLables[2]&&timeLables[2].length>0">\
                        没有可预约时间\
                    </li>\
                </ul>\
                <div class="b-b grey">晚上</div>\
                <ul class="clearfix m-t-sm">\
                    <li class="pull-left m-r-xs m-b-xs" ng-repeat="time in timeLables[3]" ng-click="funSelectBookTime(time.id)" ng-show="timeLables[3]&&timeLables[3].length>0">\
                        <button class="btn btn-sm" ng-class="bookTimeId==time.id?\'btn-info\':\'btn-default\'" ng-disabled="time.patientId">{{time.startTime | date:\'HH:mm\'}}</button>\
                    </li>\
                    <li class="pull-left m-r-xs m-b-xs text-center" ng-hide="timeLables[3]&&timeLables[3].length>0">\
                        没有可预约时间\
                    </li>\
                </ul>\
            </div>\
            <div class="col-xs-12 text-center m-b-md">\
                <button class="btn btn-success btn-sm w-sm" ng-click="ok(bookTimeId)" ng-disabled="!bookTimeId">确定</button>\
                <button class="btn btn-default btn-sm w-sm" ng-click="cancel()">返回</button>\
            </div>\
        </div>\
        ';

        function open(option) {

            if (!option || !option.data) {
                option = {
                    data: ''
                }
            }

            var modalInstance = $uibModal.open({
                template: template,
                controller: 'EditBookTimeModalCtrl',
                keyboard: false,
                size: 'md',
                resolve: {
                    data: option.data
                }

            });

            modalInstance.result.then(function(data) {
                if (option.callback) {
                    option.callback(data);
                }
            });
        };

        return {
            open: open
        }

    };

    angular.module('app')
        .controller('EditBookTimeModalCtrl', EditBookTimeModalCtrl)

    function EditBookTimeModalCtrl($scope, $modalInstance, $timeout, $http, constants, toaster, data) {

        if (data && data.appointmentStart) {
            funGetTimeLables(data.appointmentStart);
            funScheduleTime(data.appointmentStart);
        };

        //点击取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function(bookTimeId) {

            funUpdateBookTime(bookTimeId)
        };



        // 选择预约时间
        $scope.funSelectBookTime = function(bookTimeId) {
            $scope.bookTimeId = bookTimeId;
        };
        // 更改预约时间
        function funUpdateBookTime(bookTimeId) {

            $http.post(constants.api.outLine.changeAppointmentTime, {
                access_token: localStorage['groupHelper_access_token'],
                offlineItemId: bookTimeId,
                orderId: data.orderId
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '修改成功');
                    $modalInstance.close($scope.bookTime);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '修改出错');
                };
            });

        };

        // 今天
        $scope.today = function() {
            $scope.selectDate = new Date();
        };



        // 获取时间选择项
        function funGetTimeLables(date) {

            date = new Date(date).getTime();

            $scope.bookTimeId = '';

            $http.post(constants.api.outLine.getPatientAppointmentByCondition, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: data.hospitalId || 2,
                oppointTime: date,
                doctorId: data.doctorId
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {

                    $scope.timeLables = rpn.data;

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                };
            });

        };


        // 获取当月是否有预约订单
        function funScheduleTime(date) {

            date = new Date(date).getTime();

            $http.post(constants.api.outLine.getHaveAppointmentListByDate, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: 2,
                date: date,
                doctorId: data.doctorId
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {

                    $scope.scheduleTime = rpn.data;

                    if (!$scope.selectDate) {
                        $scope.selectDate = new Date();
                    }
                    // 重置已选择的日期，更新标记
                    else {
                        $scope.selectDate = date;
                    }

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });

        };

        // 监听当前选择的日期
        $scope.$watch('selectDate', function(newValue, oldValue, scope) {

            // 忽略第一次
            if (newValue == oldValue || !oldValue)
                return;

            searchDate = newValue;

            var _newMonth = moment(new Date(newValue)).format('MM'),
                _oldMonth = moment(new Date(oldValue)).format('MM'),
                _newYear = moment(new Date(newValue)).format('YYYY'),
                _oldYear = moment(new Date(oldValue)).format('YYYY'),
                _newDay = moment(new Date(newValue)).format('DD'),
                _oldDay = moment(new Date(oldValue)).format('DD');


            // 切换月份或年份更新日历圆点标记和当天日程
            if (_newMonth != _oldMonth || _newYear != _oldYear) {
                funGetTimeLables(searchDate);
                funScheduleTime(searchDate);
            }
            // 切换日期更新当天日程
            else if (_newDay != _oldDay) {
                funGetTimeLables(searchDate);
            }

        });


        // 限制切换日历（最后一次点击才生效）
        var _time = 1000,
            _timeOut,
            _thisDte;

        // 标记日历
        $scope.getDayClass = function(date, mode) {

            if ($scope.selectDate && moment(date).format('D') == 15) {
                if (moment(date).format('YYYY-MM') != moment($scope.selectDate).format('YYYY-MM')) {
                    // console.log(moment(date).format('YYYY-MM-DD'), moment($scope.selectDate).format('YYYY-MM-DD'));

                    // 切换了日期重置计时器
                    if (_thisDte != date) {
                        $timeout.cancel(_timeOut);
                        _timeOut = $timeout(function() {
                            _thisDte = date;
                            $scope.selectDate = _thisDte;
                            searchDate = _thisDte;
                        }, _time);
                    }

                    return '';
                }
            }


            if ($scope.scheduleTime && mode == 'day') {
                for (var i = 0; i < $scope.scheduleTime.length; i++) {
                    if (moment(date).format('D') == $scope.scheduleTime[i].dayNum && moment(date).format('E') == $scope.scheduleTime[i].week && $scope.scheduleTime[i].isTrue == 1) {
                        return 'haveData';
                    }
                }

            }

        };


    };

})();
