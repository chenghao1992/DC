(function() {
    angular.module('app')
        .controller('OfflineCtrl', OfflineCtrl);

    // 手动注入依赖
    OfflineCtrl.$inject = ['$scope', '$state', '$http', 'constants', 'toaster', 'orderDetailModalFactory', '$timeout', 'searchOrderModalFactory', 'EditRemarModal','SearchOffLineDoctorDialogFactory','addAppointmentFactory'];

    // 订单首页控制器
    function OfflineCtrl($scope, $state, $http, constants, toaster, orderDetailModalFactory, $timeout, searchOrderModalFactory, EditRemarModal,SearchOffLineDoctorDialogFactory,addAppointmentFactory) {
        //周控件
        $scope.step=0;
        var transfer={
            0:'周日',
            1:'周一',
            2:'周二',
            3:'周三',
            4:'周四',
            5:'周五',
            6:'周六',
        };

        //当前周的数据
        $scope.getWeekDateList=function(step){
            var dateList=[];
            var start=step*7+1;
            var end=step*7+7;
            for(var i=start;i<=end;i++){
                dateList.push({
                    date:moment().startOf('week').add(i,'days').format('MM-DD'),
                    day:transfer[moment().startOf('week').add(i,'days').day()],
                    millisecond:moment().startOf('week').add(i,'days').unix()*1000,
                    active:moment().startOf('week').add(i,'days').date()==moment().date()
                });
            }
            $scope.currWeek= dateList;
            console.log($scope.currWeek);
        };


        //下一周
        $scope.nextWeek=function(){
            //if($scope.step<3){
                $scope.step++;
                $scope.getWeekDateList($scope.step);
            //}
            //else{
            //    return;
            //}
        };

        //上一周
        $scope.preWeek=function(){
            $scope.step--;
            $scope.getWeekDateList($scope.step);
        };


        $scope.step=0;
        $scope.getWeekDateList($scope.step);
        //本周
        $scope.curWeek=function(){
            $scope.selectDate=Date.now();
            $scope.step=0;
            $scope.getWeekDateList($scope.step);
            funGetDoctorList(new Date(),$scope.period);
        };


        var user = JSON.parse(localStorage.getItem('user'));

        // 选中的日期
        $scope.selectDate = new Date();
        // 选中的时间段，上午下午晚上
        $scope.period = 1;
        // 选中的医院
        $scope.curentHospital = null;
        // 选中的医生
        $scope.curentDoctor = null;

        // 更新当前的医院
        $scope.funUpdateCurrentHospital = function(hospital) {

            if ($scope.curentHospital && hospital.id == $scope.curentHospital.id) return;

            $scope.curentHospital = hospital;
            console.log($scope.curentHospital);
            $scope.scheduleTime = [];
            funGetDoctorList($scope.selectDate, $scope.period);

            $scope.selectDate = new Date();
            funScheduleTime($scope.selectDate);
        };

        // 更新当前的医生
        $scope.funUpdateCurentDoctor = function(doctor) {
            console.log(doctor);
            $scope.curentDoctor = doctor;
            $scope.funGetOrderList($scope.selectDate, doctor.doctorId, $scope.period);
        };

        // 切换日期
        $scope.updateDate = function(item) {
            $scope.selectDate=item.millisecond;
            $scope.currWeek.forEach(function(item,index,array){
                item.active=false;
            });

            item.active=true;

            funGetDoctorList($scope.selectDate,1);
        };

        // 切换时间段
        $scope.funUpdatePeriod = function(period) {
            if ($scope.period == period) {
                return;
            }
            $scope.period = period;
            funGetDoctorList($scope.selectDate, $scope.period);
        };

        // 获取可选择的医院列表
        (function funGetHospitals() {
            $http.post(constants.api.outLine.getGroupHospital, {
                access_token: localStorage['groupHelper_access_token'],
                groupId: user.curentGroup.id
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    $scope.hospitals = rpn.data;

                    $scope.funUpdateCurrentHospital($scope.hospitals[0]);

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '获取医院出错');
                    console.error(rpn);
                };
            });
        })();


        // 获取已预约的医生列表
        function funGetDoctorList(date, period) {
            $scope.doctorList = [];
            $scope.orderList = [];
            date = new Date(date).getTime();

            $http.post(constants.api.outLine.doctorOfflinesByDate, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: $scope.curentHospital.id,
                groupId: user.curentGroup.id,
                date: date,
                period: period,
                pageSize: 99999,
                pageIndex: 0
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {

                    if (rpn.data && rpn.data.pageData) {
                        $scope.doctorList = rpn.data.pageData;
                    } else {
                        $scope.doctorList = [];
                    }

                    // 有医生则获取更新当前选中的医生
                    if ($scope.doctorList && $scope.doctorList[0] && $scope.doctorList[0].doctorId) {
                        $scope.funUpdateCurentDoctor($scope.doctorList[0]);
                    } else {
                        $scope.orderList = [];
                    }

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });

        };


        // 获取已预约的医生当天的订单列表
        $scope.funGetOrderList = function(date, doctorId, period) {

            date = new Date(date).getTime();


            $http.post(constants.api.outLine.getAppointmentListByCondition, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: $scope.curentHospital.id,
                doctorId: doctorId || $scope.curentDoctor.doctorId,
                oppointTime: date,
                period: period
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {

                    if (rpn.data)
                        $scope.orderList = rpn.data.orderList || [];

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });

        };

        // 开启服务
        $scope.funBeginService = function(orderId) {
            $http.post(constants.api.outLine.beginService, {
                access_token: localStorage['groupHelper_access_token'],
                orderId: orderId
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '成功开始服务');
                    $scope.funGetOrderList($scope.selectDate, $scope.curentDoctor.doctorId, $scope.period);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '出错');
                    console.error(rpn);
                };
            });
        };

        // 结束服务
        $scope.funFinishService = function(orderId) {
            $http.post(constants.api.outLine.finishService, {
                access_token: localStorage['groupHelper_access_token'],
                orderId: orderId
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '成功结束服务');
                    $scope.funGetOrderList($scope.selectDate, $scope.curentDoctor.doctorId, $scope.period);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '出错');
                    console.error(rpn);
                };
            });
        };

        //添加无数据项的预约
        $scope.addDocAppointment=function(item){
            addAppointmentFactory.openModal({
                id:$scope.curentDoctor.doctorId,
                name:$scope.curentDoctor.name,
                price:item.price,
                hospital:{
                    id:$scope.curentHospital.id,
                    name:$scope.curentHospital.name
                },
                bookTime:{
                    id:item.offlineItemId,
                    startTime:item.appointTime,
                    endTime:moment(item.appointTime*1000).add('30','minutes').unix()
                }
            });
            //$scope.inputData.callback({
            //    id:$scope.inputData.doctorId,
            //    name:$scope.data.info.name,
            //    price:$scope.price,
            //    hospital:{
            //        id:$scope.selectedHosp.selected.id,
            //        name:$scope.selectedHosp.selected.name
            //    },
            //    bookTime:{
            //        startTime:(new Date($scope.appointTime)).getTime(),
            //        endTime:moment($scope.appointTime*1000).add('30','minutes').unix()
            //    }
            //});
        };


        // 订单详情
        $scope.funOrderDetails = function(orderId) {
            orderDetailModalFactory.openModal({
                orderId: orderId,
                callback: function(results) {
                    $scope.funGetOrderList($scope.selectDate, $scope.curentDoctor.doctorId, $scope.period);
                }
            })
        };


        // 搜索订单
        $scope.funSearchOrder = function() {
            searchOrderModalFactory.openModal();
        };



        // 编辑备注
        $scope.funEditRemarks = function(order) {
            EditRemarModal.open({
                data: {
                    remark: order.remarks,
                    isSend: false
                },
                callback: function(data) {
                    data.orderId = order.orderId
                    funEditRemarks(data, order);
                }
            });
        };


        function funEditRemarks(data, order) {
            $http.post(constants.api.outLine.updateRemark, {
                access_token: localStorage['groupHelper_access_token'],
                orderId: data.orderId,
                isSend: data.isSend || false,
                remark: data.remark
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    order.remarks = data.remark
                    toaster.pop('success', null, '修改成功');
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '修改出错');
                };
            });
        };


        // 获取当月是否有预约订单
        function funScheduleTime(date) {

            date = new Date(date).getTime();


            $http.post(constants.api.outLine.getHaveAppointmentListByDate, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: $scope.curentHospital.id,
                date: date
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

        // 今天
        $scope.today = function() {
            $scope.selectDate = new Date();
        };

        //搜索医生
        $scope.searchOffLineDoc=function(){
            SearchOffLineDoctorDialogFactory.openModal({
                callback:function(data){
                    console.log(data);
                }
            });
        };

        //点击新增预约
        $scope.addAppointment=function(){
            addAppointmentFactory.openModal();
        };

        //// 监听当前选择的日期
        //$scope.$watch('selectDate', function(newValue, oldValue, scope) {
        //
        //    // 忽略第一次
        //    if (newValue == oldValue || !oldValue)
        //        return;
        //
        //    searchDate = newValue;
        //
        //    var _newMonth = moment(new Date(newValue)).format('MM'),
        //        _oldMonth = moment(new Date(oldValue)).format('MM'),
        //        _newYear = moment(new Date(newValue)).format('YYYY'),
        //        _oldYear = moment(new Date(oldValue)).format('YYYY'),
        //        _newDay = moment(new Date(newValue)).format('DD'),
        //        _oldDay = moment(new Date(oldValue)).format('DD');
        //
        //
        //    // 切换月份或年份更新日历圆点标记和当天日程
        //    if (_newMonth != _oldMonth || _newYear != _oldYear) {
        //        funGetDoctorList(searchDate, $scope.period);
        //        funScheduleTime(searchDate);
        //    }
        //    // 切换日期更新当天日程
        //    else if (_newDay != _oldDay) {
        //        funGetDoctorList(searchDate, $scope.period);
        //    }
        //
        //});
        //
        //
        //// 限制切换日历（最后一次点击才生效）
        //var _time = 1000,
        //    _timeOut,
        //    _thisDte;
        //
        //// 标记日历
        //$scope.getDayClass = function(date, mode) {
        //
        //    if ($scope.selectDate && moment(date).format('D') == 15) {
        //        if (moment(date).format('YYYY-MM') != moment($scope.selectDate).format('YYYY-MM')) {
        //            // console.log(moment(date).format('YYYY-MM-DD'), moment($scope.selectDate).format('YYYY-MM-DD'));
        //
        //            // 切换了日期重置计时器
        //            if (_thisDte != date) {
        //                $timeout.cancel(_timeOut);
        //                _timeOut = $timeout(function() {
        //                    _thisDte = date;
        //                    $scope.selectDate = _thisDte;
        //                    searchDate = _thisDte;
        //                }, _time);
        //            }
        //
        //            return '';
        //        }
        //    }
        //
        //
        //    if ($scope.scheduleTime && mode == 'day') {
        //        for (var i = 0; i < $scope.scheduleTime.length; i++) {
        //            if (moment(date).format('D') == $scope.scheduleTime[i].dayNum && moment(date).format('E') == $scope.scheduleTime[i].week && $scope.scheduleTime[i].isTrue == 1) {
        //                return 'haveData';
        //            }
        //        }
        //
        //    }
        //
        //};

    };
})();
