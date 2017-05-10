/**
 * Created by clf on 2016/3/4.
 */
(function() {
    angular.module('app')
        .controller('outLineCtrl', outLineCtrl);

    // 手动注入依赖
    outLineCtrl.$inject = ['$scope', '$state', '$http', 'toaster', 'DoctorInfoDailogFtory', 'constants', 'Lightbox', 'moment', '$uibModal'];

    // 订单首页控制器
    function outLineCtrl($scope, $state, $http, toaster, DoctorInfoDailogFtory, constants, Lightbox, moment, $uibModal) {
        var user = JSON.parse(localStorage.getItem('user'));
        $scope.isShowWait = false;
        $scope.handleCareOrderList = [];
        $scope.careDetail = null;
        $scope.currentCare = null;
        $scope.currentCallViewInfo = {};
        $scope.remarkList = [];
        $scope.selectedHosp = {
            selected: null
        };
        var groupId = null;
        $scope.hospitalList = [];


        getGroupId();
        getHandleCareOrder();

        // timeEditor
        $scope.minDate = moment(new Date()).format('YYYY/MM/DD H:mm');

        $scope.timeEditorCallBack = function(selected, backParam) {
            $scope.appointTime = selected;
        };


        //获取正在接单数据
        function getHandleCareOrder() {
            $http.post(constants.api.outLine.getAppointmentOrders, {
                access_token: localStorage['groupHelper_access_token'],
                pageIndex: 0,
                pageSize: 9999
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.handleCareOrderList = data.data.pageData;
                    if (!$scope.currentCare) {
                        if ($scope.handleCareOrderList.length > 0) {
                            $scope.handel($scope.handleCareOrderList[0]);
                        }
                    }
                } else {
                    console.warn(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                if (data && data.resultMsg) {
                    console.warn(data.resultMsg);
                }
            });
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

                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };


        //将时间戳转换为时间
        function convertTime(timeStamp) {
            var date = new Date(timeStamp);
            var dayStr = date.getUTCDate() - 1 == 0 ? '' : date.getUTCDate() - 1 + '天';
            var hoursStr = date.getUTCHours() + '小时';
            var minutesStr = date.getUTCMinutes() + '分钟';
            return dayStr + hoursStr + minutesStr + '前';
        }


        //轮询
        var polling = setInterval(function() {
            getHandleCareOrder();
            // 离开此页退出轮询
            if (!$state.is('order.outLine')) {
                clearInterval(polling);
            }

        }, 1000 * 10);


        //处理（点击每一项）
        $scope.handel = function(item) {
            $scope.careDetail=null;
            $scope.currentCare = item;
            $scope.selectedHosp = {
                selected: null
            };
            $scope.appointTime=null;
            //获取信息
            $http.post(constants.api.outLine.getAppointmentDetail, {
                access_token: localStorage.getItem('groupHelper_access_token'),
                orderId: item.orderId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.careDetail = data.data;
                    if (data.data.remark && data.data.remark.remarkList) {
                        $scope.remarkList = data.data.remark.remarkList;
                    } else {
                        $scope.remarkList = [];
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        $scope.currentDocItem = {};
        $scope.docItem = {};
        $scope.patientItem = {};
        //设置当前医生的电话
        $scope.setCurrentDocTel = function(item, tel) {
            item.callViewIsOpen = true;
            item.telephone = tel;
            $scope.currentDocItem = item;
            $scope.call = {};
        };

        // 拨打电话
        $scope.callPhone = function() {
            $scope.call = {};
            $scope.call.isCalling = true;
            var toTel = $scope.currentDocItem.telephone;
            var fromTel = user.telephone;

            var param = {
                access_token: localStorage['groupHelper_access_token'],
                toTel: toTel,
                fromTel: fromTel
            };


            $http.post(constants.api.order.callByTel, param).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        thenFc(data);
                    } else {
                        $scope.call.isCalling = false;
                        $scope.currentDocItem.callViewIsOpen = false;
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.call.isCalling = false;
                    $scope.currentDocItem.callViewIsOpen = false;
                    toaster.pop('error', null, data.resultMsg);
                });

            function thenFc(response) {
                $scope.call.isCalling = false;

                if (!response) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.data) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (!response.data.resp) {
                    $scope.call.result = {
                        type: false,
                        content: '接口调用失败'
                    };
                    return;
                }

                if (response.data.resp.respCode == '000000') {
                    $scope.call.result = {
                        type: true,
                        content: '拨打成功'
                    };
                    $scope.currentDocItem.callViewIsOpen = false;
                    $scope.call = {};
                    toaster.pop('success', null, '拨打成功');
                }

                if (response.data.resp.respCode !== '000000') {
                    $scope.currentDocItem.callViewIsOpen = false;
                    $scope.call.result = {
                        type: false,
                        content: '拨打失败'
                    }
                }
            }
        };


        // 放大图片
        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.careDetail.disease.diseaseImgs, index);
        };

        //添加备注
        $scope.addCareRemarks = function() {
            $scope.remarkList.unshift({
                doctorId: user.id,
                guideName: user.name || '导医' + user.id,
                createTime: '',
                remark: '',
                isNew: true
            });

            setTimeout(function() {
                var remarkListContent = document.getElementById('remarkListContent');
                remarkListContent.scrollTop = document.getElementById('remarkListContent').scrollHeight;
            }, 10);
        };

        //点击确认添加
        $scope.updateCareRemarks = function(item) {
            if (item.remark === '') {
                toaster.pop('warn', null, '备注不能为空');
                return;
            }

            //更新备注
            $http.post(constants.api.doctor.addDocRemark, {
                access_token: localStorage['groupHelper_access_token'],
                doctorId: $scope.currentCare.orderId,
                guideId: $scope.currentCare.orderId,
                guideName: user.name || '导医' + user.id,
                remark: item.remark
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.remarkList = data.data.remarkList;
                    toaster.pop('success', null, '添加成功');
                } else {
                    toaster.pop('error', null, '添加失败');
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        };

        //显示医生信息
        $scope.showDocInfo = function(doctorId) {
            DoctorInfoDailogFtory.openModal(doctorId, null, 1, null);
        }

        //提交订单
        $scope.submit = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm',
                windowClass:'m-t-300'
            });

            modalInstance.result.then(function(status) {
                if (status == 'ok') {
                    $http.post(constants.api.outLine.submitAppointmentOrder, {
                        access_token: localStorage.getItem('groupHelper_access_token'),
                        orderId: $scope.currentCare.orderId,
                        hospitalId: $scope.selectedHosp.selected.id,
                        appointTime: $scope.appointTime.getTime()
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, '提交成功');
                            getHandleCareOrder();
                            $scope.careDetail=null;
                            $scope.currentCare=null;
                            $scope.selectedHosp = {
                                selected: null
                            };
                            $scope.appointTime=null;
                        } else if (data.resultMsg) {
                            toaster.pop('error', null, data.resultMsg);
                        } else {
                            toaster.pop('error', null, '提交失败');
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });
                }
            });
        };
    }

    //删除确认框
    angular.module('app').controller('delModalInstanceCtrl', function($scope, $uibModalInstance) {
        $scope.ok = function() {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
