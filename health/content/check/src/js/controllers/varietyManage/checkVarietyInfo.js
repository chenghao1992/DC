'use strict';
(function() {

//品种库管理
angular.module('app').controller('checkVarietyInfoCtrl', checkVarietyInfoCtrl);
checkVarietyInfoCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', '$log', 'toaster', '$state', '$stateParams', '$sce'];
function checkVarietyInfoCtrl($scope, $timeout, utils, $http, $modal, $log, toaster, $state, $stateParams, $sce) {
    //初始化参数
    var access_token = app.url.access_token;

    var vartId = $stateParams.vartId;


    //初始化品种组信息
    $scope.InitGoodGroup = function(vartId) {
        $http.post(app.url.VartMan.viewGoods, {
            access_token: app.url.access_token,
            id: vartId
        }).success(function(data) {
            if (data.resultCode == 1) {
                $timeout(function () {
                    $scope.Data = data.data;
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

                    var str = '';
                    for (var i = 0, length = $scope.Data.pharmacoTypes.length; i < length; i++) {
                        if (i == length - 1) {
                            str += $scope.Data.pharmacoTypes[i].name;
                        } else {}
                    }
                    $scope.pharmacoTypesText = str;
                },300);
            }
        }).error(function(e) {
            console.log(e)
        })
    };
    //初始化包装单位
    (function() {
        $http.post(app.url.drug.getAllUnitList, {
            access_token: app.url.access_token

        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.packUnitList = data.data;
                //console.log($scope.GGData)
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
    $scope.InitGoodGroup(vartId);
    //提交审核
    $scope.check1 = function() {
        $http.post(app.url.VartMan.throughTheGoods, {
            access_token: app.url.access_token,
            id: vartId,
            groupId: $scope.Data.groupId
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "提交审核成功");
                $state.go('app.VarietyManage.check');
            }
        }).error(function(e) {
            console.log(e)
        });
    };
    //审核选择结果
    $scope.CheckStatus = function() {
        if ($scope.selected == '1') {
            $http.post(app.url.VartMan.throughTheGoods, {
                access_token: app.url.access_token,
                id: vartId,
                groupId: $scope.Data.groupId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "审核通过");
                    $state.go('app.VarietyManage.check');
                }
            }).error(function(e) {
                console.log(e)
            });
        } else if ($scope.selected == '2') {
            $http.post(app.url.VartMan.rejectTheGoods, {
                access_token: app.url.access_token,
                id: vartId,
                comment: $scope.comment
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "审核不通过");
                    $state.go('app.VarietyManage.check');
                }
            }).error(function(e) {
                console.log(e)
            });
        }
    };
    // 设置七牛上传获取uptoken的参数
    $scope.token = app.url.access_token;

    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        // $scope.uploadBoxOpen = true;
        $scope.titlePic = null;
    };
    $scope.progressCallBack = function(up, file) {
        $scope.imgFile = file;
        //console.log($scope.imgFile);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        //console.log(up, file, info);
        $scope.$apply(function() {
            $scope.titlePic = file.url;
        });
        $scope.fileList = [];
    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {
        // console.error(up, err, errTip);
        toaster.pop('error', null, errTip);
    };
    //返回上一页
    $scope.GoBack = function() {
        history.back(-1);
    };


};

angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
ModalCompanyCtrl.$inject = ['$scope', '$modalInstance', '$http', 'items'];
function ModalCompanyCtrl($scope, $modalInstance, $http, items) {
    $scope.StatusItems = [{
        status: 1,
        name: '审核通过'
    }, {
        status: 2,
        name: '审核不通过'
    }];
    $scope.selected = {
        item: $scope.StatusItems
    };
    $scope.comment = '';
    $scope.modalOk = function() {
        $modalInstance.close($scope.selected.item, $scope.comment);
        // console.log($scope.selected.item)
    };

    $scope.modalCancel = function() {
        $modalInstance.close('cancel');
    };
};

})();
