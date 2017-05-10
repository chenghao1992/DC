(function() {
    angular.module('app').controller('EditDocAppointmentCtrl', EditDocAppointmentCtrl);

    EditDocAppointmentCtrl.$inject = ['$scope', '$uibModalInstance', 'moment', 'toaster','data','$http','constants','EditDocAppointmentFactory','$timeout'];

    function EditDocAppointmentCtrl($scope, $uibModalInstance, moment, toaster,data,$http,constants,EditDocAppointmentFactory,$timeout) {
        $scope.callView={};


        // 获取用户数据
        var user = JSON.parse(localStorage['user']);

        //将openModal传进来的数据赋值给inputDate
        $scope.inputData=data;

        //选中的医院
        $scope.selectedHosp = {
            selected: null
        };

        //集团id
        var groupId = null;
        //医院列表
        $scope.hospitalList = [];

        $scope.data = {
            info: {},
            introduce: {},
            remarks: {},
            doctorInfo: {},
            itemData: {},
        };

        //医院选择改变的时候
        $scope.hospChange=function(){
            funScheduleTime(Date.now(),$scope.selectedHosp.selected.id,$scope.inputData.doctorId);
        };

        getGroupId();
        getDoctorIntroduce(data.doctorId);
        getDoctorInfo(data.doctorId);
        doctorInfo(data.doctorId);

        // 获取医生基本信息
        function getDoctorInfo(doctorId) {

            $scope.infoIsloading = true;
            var param = {
                access_token: localStorage['groupHelper_access_token'],
                doctorId: doctorId
            };

            EditDocAppointmentFactory
                .basicInfo(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.infoIsloading = false;
                $scope.data.info = response;

            }
        }

        // 获取医生介绍
        function getDoctorIntroduce(doctorId) {
            $scope.introduceIsloading = true;
            var param = {
                access_token: localStorage['groupHelper_access_token'],
                userId: doctorId
            }

            EditDocAppointmentFactory
                .getIntro(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.introduceIsloading = false;
                $scope.data.introduce = response;

            }
        }


        // 获取医生信息
        function doctorInfo(doctorId) {
            var param = {
                access_token: localStorage['groupHelper_access_token'],
                doctorId: doctorId
            };

            EditDocAppointmentFactory
                .doctorInfo(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.data.doctorInfo = response;

                if (response)
                    $scope.dateArry = response.timeList||[];

            }
        }


        //获取集团id
        function getGroupId() {
            $http.post(constants.api.outLine.getById, {
                access_token: localStorage.getItem('groupHelper_access_token'),
                Id: '5721afe7f95c43d41203d233'
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    groupId = data.data.groupId;
                    getHospital();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        //获取医院列表
        function getHospital() {
            $http.post(constants.api.outLine.getGroupHospital, {
                access_token: localStorage.getItem('groupHelper_access_token'),
                groupId: groupId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.hospitalList = data.data;
                    if($scope.hospitalList.length>0){
                        $scope.selectedHosp = {
                            selected: $scope.hospitalList[0]
                        };
                        //第一个医院
                        funScheduleTime(Date.now(),$scope.hospitalList[0].id,$scope.inputData.doctorId);
                        funGetTimeLables(Date.now(),$scope.selectedHosp.selected.id,$scope.inputData.doctorId);
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };






        // 拨打电话
        $scope.callPhone = function(toTel, fromTel) {
            $scope.call = {};
            $scope.call.isCalling = true;

            if (!fromTel) var fromTel = user.telephone;

            var param = {
                access_token: localStorage['groupHelper_access_token'],
                toTel: toTel,
                fromTel: fromTel
            }

            EditDocAppointmentFactory
                .callByTel(param)
                .then(thenFc);

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.resp) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                //成功
                if (response.resp.respCode == '000000') {
                    //$scope.call.result = {
                    //    type: true,
                    //    content: '拨打成功'
                    //};
                    $scope.callView.isOpen=false;
                    $scope.call = {};
                    toaster.pop('success',null,'拨打成功');
                }

                if (response.resp.respCode !== '000000') {
                    $scope.call.result = {
                        type: false,
                        content: '拨打失败'
                    }
                }
            }

        };
        //关闭电话对话框
        $scope.closeCallView=function(){
            $scope.call={};
            $scope.callView.isOpen=false;
        };


        // 确定
        $scope.submit = function() {
            //如果有选择预约时间
            if($scope.bookTime){
                $scope.inputData.callback({
                    id:$scope.inputData.doctorId,
                    name:$scope.data.info.name,
                    price:$scope.inputData.price,
                    hospital:{
                        id:$scope.selectedHosp.selected.id,
                        name:$scope.selectedHosp.selected.name
                    },
                    bookTime:$scope.bookTime
                });
            }
            //自己添加的预约时间
            else if($scope.appointTime){
                if($scope.price){
                    $scope.inputData.callback({
                        id:$scope.inputData.doctorId,
                        name:$scope.data.info.name,
                        price:$scope.price*100,
                        hospital:{
                            id:$scope.selectedHosp.selected.id,
                            name:$scope.selectedHosp.selected.name
                        },
                        bookTime:{
                            startTime:(new Date($scope.appointTime)).getTime(),
                            endTime:moment($scope.appointTime*1000).add('30','minutes').unix()
                        }
                    });
                }
                else{
                    return toaster.pop('error', null, '请添加正确的金额');
                }
            }
            //没有任何预约时间
            else{
                return toaster.pop('error', null, '请添加预约时间');
            }
            $uibModalInstance.dismiss('cancel');
        };

        // 选择预约时间
        $scope.funSelectBookTime = function(item) {
            if($scope.bookTime == item){
                $scope.bookTime=null;
            }
            else{
                $scope.bookTime = item;
            }
        };

        // 今天
        $scope.today = function() {
            $scope.selectDate = new Date();
        };


        // 获取时间选择项
        function funGetTimeLables(date,hospitalId,doctorId) {
            $scope.bookTimeId = '';

            $http.post(constants.api.outLine.getDoctorOneDayOffline, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: hospitalId,
                date: date,
                doctorId: doctorId
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
        function funScheduleTime(date,hospitalId,doctorId) {
            $http.post(constants.api.outLine.getHaveAppointmentListByDate, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: hospitalId,
                date: date,
                doctorId: doctorId
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
                funScheduleTime(new Date(searchDate).getTime(),$scope.selectedHosp.selected.id,$scope.inputData.doctorId);
                funGetTimeLables(new Date(searchDate).getTime(),$scope.selectedHosp.selected.id,$scope.inputData.doctorId);
            }
            // 切换日期更新当天日程
            else if (_newDay != _oldDay) {
                funGetTimeLables(new Date(searchDate).getTime(),$scope.selectedHosp.selected.id,$scope.inputData.doctorId);
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


        // timeEditor
        $scope.minDate = moment(new Date()).format('YYYY/MM/DD H:mm');
        //时间选择控件选择时间后返回
        $scope.timeEditorCallBack = function(selected) {
            //获取医生在某一时间段是否可预约
            $http.post(constants.api.outLine.isTimeToAppointment, {
                access_token: localStorage.getItem('groupHelper_access_token'),
                startTime: (new Date(selected)).getTime(),
                doctorId:$scope.inputData.doctorId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    if(data.data==1){
                        $scope.appointTime = selected;
                    }
                    else{
                        toaster.pop('error', null, '该时间段不可预约');
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();
