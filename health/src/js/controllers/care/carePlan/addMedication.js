'use strict';
(function() {
    angular.module('app').factory('AddMedicationFtory', AddMedicationFtory);

    // 手动注入依赖
    AddMedicationFtory.$inject = ['$http', '$modal'];

    function AddMedicationFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(medicationData, callBack) {

            if (!medicationData) medicationData = {
                MedicalCare: {
                    medicalInfos: []
                }
            };
            console.log(medicationData)
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addMedication.html';
                    else
                        return 'src/tpl/care/carePlan/addMedication.html';
                }(),
                controller: 'AddMedicationCtrl',
                windowClass: 'docModal doc',
                // size: 'lg',
                resolve: {
                    medicationData1: function() {
                        return medicationData;
                    }
                }
            });
            modalInstance.result.then(function(callbackData) {
                if (callBack)
                    callBack(callbackData);
            });
        };


    };

    angular.module('app').controller('AddMedicationCtrl', AddMedicationCtrl);

    AddMedicationCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','SelectMedicineBoxFactory', 'medicationData1'];

    function AddMedicationCtrl($scope, $http, $modal, $modalInstance, toaster, SelectMedicineBoxFactory, medicationData1) {

        $scope.medicationData = angular.copy(medicationData1);
        $scope.packUnit = medicationData1;
        $scope.isSaved=false;
        
        // 添加药品
        $scope.openDrugBox = function() {

            // {
            //     'goodsId': '药品Id',
            //     'generalName': '药品名',
            //     'title': '药品标题，显示全部用这个',
            //     'manufacturer': '生产厂商',
            //     'packSpecification': '包装规格',
            //     'imageUrl': '药品图片',
            //     'totalQuantity': {
            //         'quantity': '药量数量',
            //         'unit': '药量单位',
            //         'days': '用药天数'
            //     },
            //     'usage': {
            //         'periodNum': '每?天',
            //         'periodUnit': '天',
            //         'times': '一个周期?次',
            //         'quantity': '一次?颗',
            //         'unit': '单位（颗、包）'
            //         'patients': '适用人群',
            //         'remarks': '备注'
            //     }
            // }

            SelectMedicineBoxFactory.open({
                medicines: [],
                access_token: app.url.access_token,
                callback: function(medicines) {
                    medicines.map(function(item) {
                        //截取字段，未启用
                        // var unitText = item.packSpecification;
                        // unitText1 = unitText.substring(unitText.lastIndexOf('/') + 1);
                        // console.log(unitText1);
                        //
                        var drug = {
                            'goodsId': item.id,
                            'generalName': item.generalName,
                            'title': item.title,
                            'manufacturer': item.manufacturer,
                            'packSpecification': item.packSpecification,
                            'imageUrl': item.imageUrl,
                            'packUnitText': item.packUnitText||'',
                            //'packUnit':item.packUnit,
                            'totalQuantity': {
                                       'quantity': 1,
                                       'unit': item.packUnitText,
                                       'days': 1
                                       },
                            'specification': item.specification
                        };
                        $scope.medicationData.MedicalCare.medicalInfos.push(drug);

                    })

                }
            });
        };

        // 移除药品
        $scope.removeDrug = function(index) {
            $scope.medicationData.MedicalCare.medicalInfos.splice(index, 1);
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
           checkData($scope.medicationData);
        };

        $scope.SetDose=function(index,dose,untext,days){
         
            var Dose={
                quantity:dose,
                unit:untext,
                days:days
            }
            $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity=Dose;
        };
        $scope.SetDay=function(index,dose,untext,days){
            var Day={
                quantity:dose,
                unit:untext,
                days:days
            };
            $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity=Day;
        };

        // 提交数据
        function submitRemindData(data) {

            var param = {
                access_token: app.url.access_token,
                sendTime: data.sendTime,
                carePlanId: data.carePlanId,
                schedulePlanId: data.schedulePlanId,
                dateSeq: data.dateSeq,
                jsonData: JSON.stringify(data.MedicalCare)
            };
            $scope.isSaved = true;
            if (data.id)
                param.id = data.id;

            $http.post(app.urlRoot + 'designer/saveMedicalCare', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '保存成功');
                        //$modalInstance.close(param.jsonData);
                        $modalInstance.close(rpn.data);
                        $scope.isSaved=false;
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '保存出错');
                        console.error(rpn);
                    };
                });
        };

        // 数据校验
        function checkData(data) {
        
            if (!data.sendTime)
                return toaster.pop('error', null, '请输入发送时间');
            if (!data.carePlanId)
                return toaster.pop('error', null, '缺少关怀计划id');
            if (!data.dateSeq)
                return toaster.pop('error', null, '缺少日程天数');
            if (data.MedicalCare && data.MedicalCare.medicalInfos) {
                if (data.MedicalCare.medicalInfos.length < 1) {
                    return toaster.pop('error', null, '请添加药品');
                } else {
                    var arry = data.MedicalCare.medicalInfos;
                    // console.log(arry);
                    for (var i = 0; i < arry.length; i++) {
                        if(!arry[i].usage){
                            return toaster.pop('error', null, '请正确填写药品的每一项');
                        }
                        if (arry[i].usage.quantity == '适量' || arry[i].usage.quantity == '0') {
                            arry[i].usage.quantity = "0";
                           // arry[i].usage.unit = "0"
                        }
                        if (!arry[i].totalQuantity ||
                            !arry[i].totalQuantity.quantity ||
                            !arry[i].totalQuantity.unit ||
                            !arry[i].totalQuantity.days ||
                            !arry[i].usage ||
                            // !arry[i].usage.days ||
                            !arry[i].usage.patients ||
                            !arry[i].usage.quantity ||
                            !arry[i].usage.times ||
                            !arry[i].usage.periodNum ||
                            !arry[i].usage.unit
                        )
                            return toaster.pop('error', null, '请正确填写药品的每一项');
                    }
                }
            }
            submitRemindData(data);
        };

        // 设置用法用量
        $scope.setUsage = function(index, usage, goodsId) {
            console.log(usage);
            if (!usage) usage = {};
            if (goodsId) usage.goodsId = goodsId;

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'SetUsageView.html',
                controller: 'SetUsageCtrl',
                size: 'md',
                resolve: {
                    usage: function() {
                        return usage;
                    },
                }
            });
            modalInstance.result.then(function(usage) {
                $scope.medicationData.MedicalCare.medicalInfos[index].usage = usage;
            });
        };


        // 设置药量
        // $scope.setDose = function(index, doseData, packUnitText,showTest) {
        //     if (!doseData) doseData = {};
        //     var modalInstance = $modal.open({
        //         animation: true,
        //         templateUrl: 'SetDoseView.html',
        //         controller: 'SetDoseCtrl',
        //         size: 'md',
        //         resolve: {
        //             doseData: function() {
        //                 return doseData;
        //             },
        //             packUnit: function() {
        //                 return packUnitText;
        //             },
        //             showT:function(){
        //                 return showTest;
        //             }
        //         }
        //     });
        //     modalInstance.result.then(function(doseData) {
        //         $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity=doseData;
        //         $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity.quantity=doseData.quantity;
        //         $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity.unit=doseData.unit;
        //         console.log($scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity);
        //     });
        // };
        // //设置天数
        // $scope.setDay=function(index,doseData,packUnitText){
        //         if (!doseData) doseData = {};
        //         var modalInstance=$modal.open({
        //             animation: true,
        //             templateUrl: 'SetDayView.html',
        //             controller: 'SetDayCtrl',
        //             size: 'md',
        //             resolve: {
        //                 doseData: function() {
        //                     return doseData;
        //                 },
        //                 packUnit: function() {
        //                     return packUnitText;
        //                 }
        //             }
        //         });
        //     modalInstance.result.then(function(doseData) {
        //         //$scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity=doseData;
        //         //console.log($scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity);
        //         $scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity.days=doseData.days;
        //         console.log($scope.medicationData.MedicalCare.medicalInfos[index].totalQuantity);
        //
        //     });
        // };

    };
    //获取天数
    // angular.module('app')
    //     .controller('SetDayCtrl',SetDayCtrl)
    // function SetDayCtrl($scope, $http, $modal, $modalInstance, toaster, doseData, packUnit){
    //     (function() {
    //         $http.post(drugFirmsApiRoot + 'goods/dose/getAvailDoseList', {
    //             access_token: app.url.access_token
    //         }).
    //         then(function(rpn) {
    //             rpn = rpn.data;
    //             if (rpn && rpn.resultCode == 1) {
    //                 $scope.units = rpn.data || [];
    //                 setUnits();
    //                 //console.log($scope.doseData.unit);
    //             } else if (rpn && rpn.resultMsg) {
    //                 toaster.pop('error', null, rpn.resultMsg);
    //             } else {
    //                 toaster.pop('error', null, '获取用量单位失败');
    //             }
    //         });
    //     })();
    //     function setUnits() {
    //         if (doseData.quantity && packUnit) {
    //             $scope.doseData = {
    //                 //quantity: doseData.quantity,
    //                 //unit: packUnit || doseData.unit,
    //                 days: doseData.days || 1
    //             };
    //         } else {
    //             $scope.doseData = {
    //                 //quantity: 1,
    //                 //unit: packUnit || doseData.unit,
    //                 days: 1
    //             }
    //         }
    //     };
    //     // 取消
    //     $scope.cancel = function() {
    //         $modalInstance.dismiss('cancel');
    //     };
    //
    //     // 确定
    //     $scope.ok = function() {
    //         $modalInstance.close($scope.doseData);
    //     };
    // };
    // angular.module('app')
    //     .controller('SetDoseCtrl', SetDoseCtrl)
    // function SetDoseCtrl($scope, $http, $modal, $modalInstance, toaster, doseData, packUnit,showT) {
    //     $scope.showT=showT;
    //     (function() {
    //         $http.post(drugFirmsApiRoot + 'goods/dose/getAvailDoseList', {
    //             access_token: app.url.access_token
    //         }).
    //         then(function(rpn) {
    //             rpn = rpn.data;
    //             if (rpn && rpn.resultCode == 1) {
    //                 $scope.units = rpn.data || [];
    //                 setUnits();
    //                 //console.log($scope.doseData.unit);
    //             } else if (rpn && rpn.resultMsg) {
    //                 toaster.pop('error', null, rpn.resultMsg);
    //             } else {
    //                 toaster.pop('error', null, '获取用量单位失败');
    //             }
    //         });
    //     })();
    //
    //
    //     function setUnits() {
    //         if (doseData.quantity && packUnit) {
    //             $scope.doseData = {
    //                 quantity: doseData.quantity,
    //                 unit: packUnit || doseData.unit
    //                 //days: doseData.days || 1
    //             };
    //         } else {
    //             $scope.doseData = {
    //                 quantity: 1,
    //                 unit: packUnit || doseData.unit
    //                 //days: 1
    //             }
    //         }
    //     };
    //
    //     // 取消
    //     $scope.cancel = function() {
    //         $modalInstance.dismiss('cancel');
    //     };
    //     // 确定
    //     $scope.ok = function() {
    //          $modalInstance.close($scope.doseData);
    //     };
    // };
    angular.module('app').controller('SetUsageCtrl', SetUsageCtrl);

    SetUsageCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','usage'];
    
    function SetUsageCtrl($scope, $http, $modal, $modalInstance, toaster, usage) {

        var goodsId = usage.goodsId;
        
        (function() {
            $http.post(drugFirmsApiRoot + 'goods/dose/getAvailDoseList', {
                access_token: app.url.access_token
            }).
            then(function(rpn) {
                // console.log(rpn)
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    $scope.unitList = rpn.data || [];

                    getUsages();

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '获取用量单位失败');
                }
            });
        })();


        // {
        //     method: "2"
        //     patients: "2"
        //     periodNum: 2
        //     periodTime: "1"
        //     quantity: 2
        //     times: 1
        //     unit: "57512a18bae14d41aa749b1b"
        //     unitText: ""
        // }
        //     'usage': {
        //         'periodNum': '每?天',
        //         'periodUnit': '天',
        //         'times': '一个周期?次',
        //         'quantity': '一次?颗',
        //         'unit': '单位（颗、包）'
        //         'patients': '适用人群',
        //         'remarks': '备注'
        //     }

        // 格式转换
        function formChange(oldArray) {
            var newArray = [];

            oldArray.map(function(item, index) {
                if (item.quantity == '适量') {
                    item.quantity = 0;
                    item.unit = "";
                }
                newArray.push({
                    'periodNum': item.periodNum || 0,
                    'periodUnit': '天',
                    'times': item.times || 0,
                    'quantity': item.quantity || 0,
                    'unit': item.unitText || '',
                    'patients': item.patients || '',
                    'remarks': item.method || ''
                })
            })

            return newArray;
        };

        function getUsages() {
            $http.post(drugFirmsApiRoot + 'goods/viewGoods', {
                access_token: app.url.access_token,
                id: goodsId
            }).
            then(function(rpn) {

                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1 && rpn.data && rpn.data.drugUsegeList) {
                    $scope.usagesList = formChange(rpn.data.drugUsegeList || []);

                    $scope.usageSelected = angular.copy(usage);
                    $scope.usage = angular.copy(usage);
                
                    if(!$scope.usage.quantity){
                            $scope.usage.quantity=1;
                    }
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '获取药品失败');
                }
            });
        };

        // 更改用法用量
        $scope.usageChange = function(usage) {
            $scope.usageSelected = angular.copy(usage);
        };

        // 只能输入正整数
        $scope.onlyNbr = function(nbr) {
            console.log(nbr);
            if (nbr === null || nbr === undefined || nbr <= 0) {

                toaster.pop('error', null, '请输入正确数量');
                return 1;


            }
            return nbr;
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {
            if (!checkData($scope.usageSelected)) return;
            $modalInstance.close($scope.usageSelected);
        };

        // 校验
        function checkData(usageSelected) {

            if (!usageSelected) {
                toaster.pop('error', null, '请设置用法用量');
                return false;
            }

            if (!usageSelected.patients) {
                toaster.pop('error', null, '请输入适用人群');
                return false;
            }

            if (!usageSelected.periodNum || usageSelected.periodNum <= 0) {
                toaster.pop('error', null, '请输入正确的用法天数');
                return false;
            }

            if (!usageSelected.times || usageSelected.times <= 0) {
                toaster.pop('error', null, '请输入正确的用法次数');
                return false;
            }

            // if (!usageSelected.quantity) {
            //     toaster.pop('error', null, '请输入正确的用量');
            //     return false;
            // }
            // if(usageSelected.quantity=='适量' || usageSelected.quantity==0)
            // {
            //     usageSelected.unit="0";
            // }
            if (!usageSelected.unit) {
                toaster.pop('error', null, '请输入正确的用量单位');
                return false;
            }

            return true;
        }

    };
})();
