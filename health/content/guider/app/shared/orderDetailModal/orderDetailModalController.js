(function() {
    angular.module('app')
        .controller('OrderDetailModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'constants', 'EditBookTimeModal', 'EditRemarModal', 'options','EditCancelInfoModal','Lightbox',
            function($scope, $modalInstance, toaster, $http, constants, EditBookTimeModal, EditRemarModal, options,EditCancelInfoModal,Lightbox) {

                $scope.orderData = {};
                $scope.diseaseImgs=[];

                //订单状态文字描述
                $scope.transOrderStatus = function() {
                    if ($scope.orderData.orderStatus == 1) {
                        return '待预约';
                    } else if ($scope.orderData.orderStatus == 2) {
                        return '待支付';
                    } else if ($scope.orderData.orderStatus == 3 && $scope.orderData.serviceBeginTime) {
                        return '服务中';
                    } else if ($scope.orderData.orderStatus == 3) {
                        return '已支付';
                    } else if ($scope.orderData.orderStatus == 4) {
                        return '已完成';
                    } else if ($scope.orderData.orderStatus == 5) {
                        return '已取消';
                    } else if ($scope.orderData.orderStatus == 6) {
                        return '已结束';
                    } else if ($scope.orderData.orderStatus == 7) {
                        return '待完善';
                    } else if ($scope.orderData.orderStatus == 10) {
                        return '预约成功';
                    }
                };

                //获取数据
                getData();

                function getData() {
                    $http.post(constants.api.outLine.orderDetail, {
                        access_token: localStorage['guider_access_token'],
                        orderId: options.orderId
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            // console.log(data.data);
                            $scope.orderData = data.data;
                            $scope.getIllcaseBaseContent();
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });
                }

                // 结束服务
                $scope.funFinishService = function(orderId) {
                    $http.post(constants.api.outLine.finishService, {
                        access_token: localStorage['guider_access_token'],
                        orderId: orderId
                    }).then(function(rpn) {
                        rpn = rpn.data;
                        if (rpn && rpn.resultCode == 1) {
                            toaster.pop('success', null, '成功结束服务');
                            getData();
                            options.callback();
                        } else if (rpn && rpn.resultMsg) {
                            toaster.pop('error', null, rpn.resultMsg);
                        } else {
                            toaster.pop('error', null, '出错');
                            console.error(rpn);
                        };
                    });
                };

                // 开启服务
                $scope.funBeginService = function(orderId) {
                    $http.post(constants.api.outLine.beginService, {
                        access_token: localStorage['guider_access_token'],
                        orderId: orderId
                    }).then(function(rpn) {
                        rpn = rpn.data;
                        if (rpn && rpn.resultCode == 1) {
                            toaster.pop('success', null, '成功开始服务');
                            getData();
                            options.callback();
                        } else if (rpn && rpn.resultMsg) {
                            toaster.pop('error', null, rpn.resultMsg);
                        } else {
                            toaster.pop('error', null, '出错');
                            console.error(rpn);
                        };
                    });
                };

                //点击退款
                $scope.refund = function() {
                    EditCancelInfoModal.open({
                        orderId:options.orderId,
                        callback: function(data) {
                            getData();
                            options.callback();
                        }
                    });

                };

                //点击取消
                $scope.close = function() {
                    $modalInstance.dismiss('cancel');
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

                var user = JSON.parse(localStorage.getItem('user'));

                // 拨打电话
                $scope.callPhone = function() {
                    $scope.call = {};
                    $scope.call.isCalling = true;
                    var toTel = $scope.currentDocItem.telephone;
                    var fromTel = user.telephone;

                    var param = {
                        access_token: localStorage['guider_access_token'],
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

                //修改备注
                function funEditRemarks(data, order) {
                    $http.post(constants.api.outLine.updateRemark, {
                        access_token: localStorage['guider_access_token'],
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

                // 修改预约时间
                $scope.funEditBooktime = function(order) {
                    EditBookTimeModal.open({
                        data: {
                            doctorId: order.doctors[0].userId,
                            hospitalId: order.hospitalId,
                            appointmentStart: order.appointmentStart,
                            orderId: order.orderId
                        },
                        callback: function(data) {
                            getData();
                            options.callback();
                        }
                    });
                };

                //获取病情资料
                $scope.getIllcaseBaseContent=function(){
                    $http.post(constants.api.outLine.getIllcaseBaseContentById, {
                        access_token: localStorage['guider_access_token'],
                        illcaseInfoId: $scope.orderData.illCaseInfoId
                    }).then(function(rpn) {
                        rpn = rpn.data;
                        if (rpn && rpn.resultCode == 1) {
                            $scope.diseaseData=rpn.data;
                            $scope.diseaseImgs=$scope.diseaseData[0].contentImages||[];
                            console.log($scope.diseaseData);
                        } else if (rpn && rpn.resultMsg) {
                            toaster.pop('error', null, rpn.resultMsg);
                        } else {
                            toaster.pop('error', null, '出错');
                        };
                    });
                };

                //自动保存填写的患者资料
                $scope.savePatientInfo = function(item) {
                    $http.post(constants.api.outLine.saveIllCaseTypeContent, {
                        access_token: localStorage['guider_access_token'],
                        illCaseInfoId:item.illCaseInfoId,
                        illCaseTypeId:item.illCaseTypeId,
                        contentTxt:item.contentTxt||''
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, '自动保存于' + (new Date()).toLocaleString());
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });

                };

                // 七牛上传文件过滤
                $scope.qiniuFilters = {
                    mime_types: [ //只允许上传图片和zip文件
                        {
                            title: "Image files",
                            extensions: "jpg,gif,png"
                        }
                    ]
                };

                //选择病情资料文件上传
                $scope.selectDiseaseImgs=function(){
                    $scope.upload();
                };

                // 设置七牛上传获取uptoken的参数
                $scope.token = localStorage['guider_access_token'];
                // 选择文件后回调
                $scope.uploaderAdded = function(up, files) {
                    $scope.uploadPercent=0;
                    console.log(up,files);
                };


                // 每个文件上传成功回调
                $scope.uploaderSuccess = function(up, file, info) {
                    $scope.uploadPercent=100;
                    toaster.pop('success',null,'上传成功！');
                    $scope.diseaseImgs.push(file.url);

                    $http.post(constants.api.outLine.saveIllCaseTypeContent, {
                        access_token: localStorage['guider_access_token'],
                        illCaseInfoId:$scope.diseaseData[0].illCaseInfoId,
                        illCaseTypeId:$scope.diseaseData[0].illCaseTypeId,
                        contentTxt:$scope.diseaseData[0].contentTxt,
                        contentImages:$scope.diseaseImgs
                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, '自动保存于' + (new Date()).toLocaleString());
                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });

                };
                // 每个文件上传失败后回调
                $scope.uploaderError = function(up, err, errTip) {
                    if(err.code==-600){
                        toaster.pop('error', null, '文件过大');
                    }
                    else{
                        toaster.pop('error', null, errTip);
                    }
                };

                //上传进度
                $scope.fileUploadProcess=function(up, file){
                    $scope.uploadPercent=file.percent==100?99:file.percent;
                };

                // 放大图片
                $scope.openLightboxModal = function(index) {
                    var modalInstance = Lightbox.openModal($scope.diseaseImgs, index);
                };
            }
        ]);
})();
