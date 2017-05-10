'use strict';
(function() {

    //医院列表
angular.module('app').controller('HospitalEditCtrl', HospitalEditCtrl);
HospitalEditCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', '$compile', 'utils', '$modal', 'toaster', '$stateParams', 'AddHospitalFactory', 'searchDoctorModalFactory'];
function HospitalEditCtrl($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams, AddHospitalFactory, searchDoctorModalFactory) {


    // ui-selected 必须先命名一个对象
    $scope.hospital = {};

    $scope.admin = null;

    // 添加可选择医院
    $scope.addHospital = function() {
        AddHospitalFactory.open(callback);

        function callback(hospital) {
            $scope.hospital.selected = hospital;
        };
    };

    // 搜索医院
    $scope.getHospitalOption = (function getHospitalOption(keyWord) {
        $scope.keyWord = keyWord;
        $http.post(app.url.hospital.findHospitalByCondition, {
            access_token: app.url.access_token,
            pageIndex: 0,
            pageSize: 20,
            keyWord: keyWord || null
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {

                $scope.hospitalOption = rpn.data.pageData;

            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        return getHospitalOption;
    })();

    // 选择管理员
    $scope.addAdmin = function(doctors) {

        var options = {
            apiUrl: app.url.hospital.findDoctorsByCondition,
            apiParams: {
                access_token: app.url.access_token
            },
            selectType: 0,
            doctors: doctors || [],
            callback: callback
        };
        searchDoctorModalFactory.openModal(options);

        function callback(list) {
            $scope.admin = list[0];
        }

    };


    // 创建医院
    $scope.createHospital = function(hospitalId, doctorId) {
        $http.post(app.url.hospital.createGroupHospital, {
            access_token: app.url.access_token,
            hospitalId: hospitalId,
            doctorId: doctorId
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                $state.go('app.hospital.list');
                toaster.pop('success', null, '创建成功');

            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

    };
};

// 添加可选择医院
    angular.module('app').factory('AddHospitalFactory', AddHospitalFactory);

    // 手动注入依赖
    AddHospitalFactory.$inject = ['$http', '$modal'];

    function AddHospitalFactory($http, $modal, $scope) {
        return {
            open: openModel
        };

        // 打开选择窗口
        function openModel(callback) {
            var modalInstance = $modal.open({
                template: '<div class="clearfix">\
                                <h4 class="col-xs-12 m-t-lg text-center">添加医院</h4>\
                                <div class="col-xs-12 m-t m-b">\
                                    <div class="form-group clearfix m-b-xs">\
                                        <label class="col-xs-3 control-label m-b-none text-right">医院所在省份：</label>\
                                        <div class="col-xs-9">\
                                            <select class="form-control m-b-none" ng-model="_provincesCode" ng-change="getArea(_provincesCode,\'citys\');_cityCode=\'\';_regionCode=\'\'">\
                                                <option value="">请选择</option>\
                                                <option value="{{pro.code}}" ng-repeat="pro in provinces">{{pro.name}}</option>\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="line line-dashed b-b line-lg pull-in"></div>\
                                    <div class="form-group clearfix m-b-xs">\
                                        <label class="col-xs-3 control-label m-b-none text-right">医院所在城市：</label>\
                                        <div class="col-xs-9">\
                                            <select class="form-control m-b-none" ng-model="_cityCode" ng-change="getArea(_cityCode,\'regions\');_regionCode=\'\'" ng-disabled="!_provincesCode">\
                                              <option value="">{{_provincesCode?\'请选择\':\'请先选择省份\'}}</option>\
                                              <option value="{{city.code}}" ng-repeat="city in citys">{{city.name}}</option>\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="line line-dashed b-b line-lg pull-in"></div>\
                                    <div class="form-group clearfix m-b-xs">\
                                        <label class="col-xs-3 control-label m-b-none text-right">医院所在区域：</label>\
                                        <div class="col-xs-9">\
                                            <select class="form-control m-b-none" ng-model="_regionCode" ng-disabled="!_cityCode">\
                                              <option value="">{{_cityCode?\'请选择\':\'请先选择城市\'}}</option>\
                                              <option value="{{region.code}}" ng-repeat="region in regions">{{region.name}}</option>\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="line line-dashed b-b line-lg pull-in"></div>\
                                    <div class="form-group clearfix">\
                                        <label class="col-xs-3 control-label m-b-none text-right">医院名称：</label>\
                                        <div class="col-xs-9">\
                                            <input type="text" class="form-control" placeholder="请输入医院名称" ng-model="_hospitalName">\
                                        </div>\
                                    </div>\
                                    <div class="line line-dashed b-b line-lg pull-in"></div>\
                                    <div class="form-group clearfix">\
                                        <label class="col-xs-3 control-label m-b-none text-right">医院等级：</label>\
                                        <div class="col-xs-9">\
                                            <select class="form-control" ng-model="_hospitalLevel">\
                                                <option value="">请先选医院等级</option>\
                                                <option ng-repeat="lv in levels" value="{{lv}}">{{lv}}</option>\
                                            </select>\
                                        </div>\
                                    </div>\
                                    <div class="line line-dashed b-b line-lg pull-in"></div>\
                                    <div class="form-group">\
                                        <div class="col-xs-offset-3 col-xs-3">\
                                            <button type="submit" class="w100 btn btn-primary" ng-click="addHospital(_provincesCode, _cityCode, _regionCode, _hospitalName, _hospitalLevel)" ng-disabled="!_provincesCode||!_cityCode||!_regionCode||!_hospitalName||!_hospitalLevel">\
                                                添加\
                                            </button>\
                                        </div>\
                                        <div class="col-xs-3">\
                                            <button type="button" class="w100 btn btn-default" ng-click="cancel()">返回</button>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>',
                controller: 'AddHospitalCtrl',
                size: 'md'
            });

            modalInstance.result.then(function(hospital) {
                if (callback)
                    callback(hospital);
            });
        }

    };

angular.module('app').controller('AddHospitalCtrl', AddHospitalCtrl);
AddHospitalCtrl.$inject = ['$http', '$modalInstance', '$scope', 'toaster'];
function AddHospitalCtrl($http, $modalInstance, $scope, toaster) {

        // 获取医院级别
        $http.post(app.url.hospital.getHospitalLevel, {
            access_token: app.url.access_token
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                if (rpn.data && rpn.data.level) {
                    $scope.ids = rpn.data.id;
                    $scope.levels = rpn.data.level;
                }else{
                    $scope.levels = ['一级甲等','二级甲等','三级甲等','一级乙等','二级乙等','三级乙等'];
                }
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        $scope.levels = ['一级甲等','二级甲等','三级甲等','一级乙等','二级乙等','三级乙等'];

        // 添加医院
        $scope.addHospital = function(provinceId, cityId, countryId, name, level) {
            $http.post(app.url.admin.check.addHospital, {
                access_token: app.url.access_token,
                provinceId: provinceId,
                cityId: cityId,
                countryId: countryId,
                name: name,
                level: level
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {
                    toaster.pop('success', null, '添加成功');
                    $modalInstance.close(rpn.data);

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };


        // 获取省,市,区
        $scope.getArea = (function getArea(area_id, area_scope) {

            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: area_id
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    // 初始化市,区
                    if (!area_scope && !area_id) {
                        $scope.provinces = rpn.data;
                        $scope.citys = null;
                        $scope.regions = null;
                    } else {
                        $scope[area_scope] = rpn.data;
                    }

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });

            return getArea;
        })();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
};

})();
