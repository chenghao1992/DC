'use strict';
(function() {

//品种库管理
angular.module('app').controller('editVarietyInfoCtrl', editVarietyInfoCtrl);
editVarietyInfoCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce'];
function editVarietyInfoCtrl($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce) {
    //初始化参数
    var access_token = app.url.access_token;
    var vartId = $stateParams.vartId;

    //初始化包装单位
    (function() {
        $http.post(app.url.drug.getAvailUnitList, {
            access_token: app.url.access_token

        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.packUnitList = data.data;
            }
        }).error(function(e) {
            console.log(e)
        });
        //管理类别列表
        function initMngTypeList() {
            $http.post(app.url.VartMan.getAvailManageTypeList, {
                access_token: app.url.access_token
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.manageTypes = data.data;
                    //console.log($scope.GGData)
                }
            }).error(function(e) {
                console.log(e)
            });
        }
        initMngTypeList();
        //产品类别列表
        function initBizTypeList() {
            $http.post(app.url.VartMan.getAvailBizTypeList, {
                access_token: app.url.access_token
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.productTypes = data.data;
                    //console.log($scope.GGData)
                }
            }).error(function(e) {
                console.log(e)
            });
        }
        initBizTypeList();

        function initFormList(argument) {
            // body...
            $http.post(app.url.VartMan.getAvailFormList, {
                access_token: app.url.access_token

            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.formList = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });
        }
        initFormList();

        function initAvailDoseList(argument) {
            // body...
            $http.post(app.url.drug.getAvailDoseList, {
                access_token: app.url.access_token

            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.AvailDoseList = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });
        }
        initAvailDoseList();
    })();

    //初始化品种组信息
    $scope.InitGoodGroup = function(vartId) {
        $http.post(app.url.VartMan.viewGoods, {
            access_token: app.url.access_token,
            id: vartId
        }).success(function(data) {
            if (data.resultCode == 1) {
                $timeout(function () {
                    $scope.Data = data.data;
                    // var reg = new RegExp("<[^<]*>", "gi");
                    // $scope.Data.manual = $scope.Data.manual.replace(reg, ""); //去掉HTML标签为空。
                    $scope.titlePic = $scope.Data.imageUrl;

                    //拆分packSpecification字段
                    $scope.Data.specificat = $scope.Data.packSpecification.split('/');
                    $scope.Data.unitsN = $scope.Data.specificat[0].replace(/\d+/g,'').replace('.','');//服药单位
                    $scope.Data.packNum = $scope.Data.specificat[0].replace(/[^\d.]/g,'');//数量
                    $scope.Data.packUnitN =$scope.Data.specificat[1];//包装单位
                    for(var i=0;i<$scope.AvailDoseList.length;i++){
                        if($scope.AvailDoseList[i]['name']==$scope.Data.unitsN){
                            $scope.Data.units =$scope.AvailDoseList[i]['id'];
                        }
                    }

                    //是否慢病用药，1：慢病用药,2：非慢病用药
                    if($scope.Data.drugType==1){
                        $scope.Data.drugType =true;
                    }else if($scope.Data.drugType==2){
                        $scope.Data.drugType =false;
                    }
                    var timestamp = $scope.Data.approvalDate;
                    var d = new Date(timestamp * 1000); //根据时间戳生成的时间对象
                    var date1 = (d.getFullYear()) + "-" +
                        (d.getMonth() + 1) + "-" +
                        (d.getDate());
                    $scope.dt = date1;
                    var str = '';
                    for (var i = 0; i < $scope.Data.pharmacoTypes.length; i++) {
                        str += $scope.Data.pharmacoTypes[i].name + ',';
                    }
                    $scope.pharmacoTypesText = str;
                },300);
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        }).error(function(e) {
            console.log(e)
        })
    };

    $scope.InitGoodGroup(vartId);
    //禁用品种
    $scope.disable = function() {
        $scope.isEditValid=true;
       $http.post(app.url.VartMan.disableTheGoods, {
            access_token: app.url.access_token,
            id: vartId,
            groupId: $scope.Data.groupId
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "禁用成功");
                  $scope.InitGoodGroup(vartId);
                
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
                $scope.isEditValid=false;
        })
    };
    //启用品种
    $scope.enabledGood = function() {
            $scope.isEditValid=true;
        $http.post(app.url.VartMan.enableTheGoods, {
            access_token: app.url.access_token,
            id: vartId,
            groupId: $scope.Data.groupId
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "启用成功");
                  $scope.InitGoodGroup(vartId);
               
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
             $scope.isEditValid=false;
        })
    };

    // $scope.openDatePicker = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();

    //     $scope.opened = true;
    // };

    //返回上一页
    $scope.GoBack = function() {
        history.back(-1);
    }

};

})();
