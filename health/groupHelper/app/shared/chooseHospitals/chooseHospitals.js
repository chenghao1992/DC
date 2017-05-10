'use strict';

(function() {
    angular.module('app')
        .factory('ChooseHospitalsFactory', ChooseHospitalsFactory);

    // 手动注入依赖
    ChooseHospitalsFactory.$inject = ['$http', '$modal'];

    function ChooseHospitalsFactory($http, $modal) {

        var template = '\
                        <style type="text/css">\
                            .bigWindows .modal-dialog{\
                                width:900px;\
                            }\
                        </style>\
                        <div class="panel panel-default">\
                            <div class="panel-heading font-bold">选择医疗机构</div>\
                            <div class="m b b-grey r clearfix">\
                                <div class="col-xs-9">\
                                    <div class="row b-r b-grey">\
                                        <div class="b-b b-grey">\
                                            <div class="m-sm">\
                                                <span>\
                                                    <lable>地区：</lable>\
                                                </span>\
                                                <span ng-repeat="area in areas track by $index" >\
                                                    <lable ng-if="site.isSelected" ng-repeat="site in area track by $index">{{site.name}}<i class="fa fa-angle-right m-r-xs m-l-xs"></i></lable>\
                                                </span>\
                                            </div>\
                                        </div>\
                                        <div class="clearfix">\
                                            <ul class="pull-left inline-block" style="height:400px;overflow:auto;" ng-repeat="area in areas track by $index">\
                                                <li class="b-l b-4x clearfix r a-link m-r-sm" ng-class="site.isSelected?\'b-danger bg-light\':\'b-white\'" ng-repeat="site in area track by $index" ng-click="funGetArea($parent.$index+1,site.code)">\
                                                    <span class="block m-xs clearfix">\
                                                        <lable class="pull-left m-r-sm" style="white-space:nowrap;">{{site.name}}<i class="fa fa-angle-right"></i></lable>\
                                                    </span>\
                                                </li>\
                                            </ul>\
                                            <ul class="inline-block" style="height:400px;overflow:auto;" ng-if="hospitals&&hospitals.length>0">\
                                                <li class="b-l b-4x clearfix r a-link b-white" ng-class="funIsSelected(hospital)?\'bg-light\':\'\'" ng-repeat="hospital in hospitals track by $index" ng-click="funSelectHospital(hospital)">\
                                                    <span class="block m-xs clearfix" >\
                                                        <lable class="pull-left m-r-sm"><i class="fa fa-check m-l-xs text-success" ng-show="funIsSelected(hospital)"></i>{{hospital.name}}</lable>\
                                                    </span>\
                                                </li>\
                                            </ul>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="col-xs-3">\
                                    <div class="row">\
                                        <div class="m-sm clearfix">\
                                            <h5 class="m-t-xs">已选择：<small ng-if="max" ng-class="selectHospitals.length>=max?\'text-danger\':\'\'">({{selectHospitals.length||0}}/{{max||1}})</small></h5>\
                                            <ul class="clearfix" style="height:400px;overflow:auto;">\
                                                <li class="block m-b-xs" ng-repeat="selectHospital in selectHospitals track by $index">\
                                                    <lable title="点击移除" class="btn btn-info btn-sm btn-block" ng-click="funSelectHospital(selectHospital)">\
                                                        <span style="white-space:normal;max-width:100%;">{{selectHospital.name}}</span>\
                                                        <span>&nbsp;×</span>\
                                                    </lable>\
                                                </li>\
                                            </ul>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="row m-b">\
                                <div class="col-xs-offset-2 col-xs-4">\
                                    <button ng-click="ok()" type="submit" class="pull-right w100 btn btn-sm btn-primary">\
                                        确定\
                                    </button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button ng-click="cancel()" type="button" class="pull-right w100 btn btn-sm btn-default">取消</button>\
                                </div>\
                            </div>\
                        </div>\
                        ';


        // 打开选择窗口
        function openModel(option, callback) {
            var modalInstance = $modal.open({
                template: template,
                controller: 'ChooseHospitalsCtrl',
                // size: 'lg',
                windowClass: 'bigWindows',
                backdrop: 'static',
                resolve: {
                    option: function() {

                        if (!option) option = {};

                        return {
                            data: option.data || [],
                            // 默认多选
                            multichoice: option.multichoice,
                            // 最多可选多少项
                            max: option.max || null,
                        };
                    }
                }
            });

            modalInstance.result.then(function(department) {
                if (callback) {
                    callback(department);
                }
            });
        };

        return {
            open: openModel
        };

    };

    angular.module('app')
        .controller('ChooseHospitalsCtrl', ChooseHospitalsCtrl);

    function ChooseHospitalsCtrl($http, $modalInstance, $scope, toaster, option) {

        $scope.areas = [];
        $scope.hospitals = [];
        $scope.selectHospitals = [];

        // 是否多选
        $scope.multichoice = option.multichoice;
        $scope.max = option.multichoice ? option.max : 1;

        // 设置已默认选中的医院
        if (option.data && Array.isArray(option.data)) {
            for (var i = 0; i < option.data.length; i++) {
                $scope.selectHospitals.push(option.data[i]);
            }
        }

        // 获取地区
        $scope.funGetArea = (function _funGetArea(index, id) {

            if (index === '' || index === undefined || index === null) return;

            // 选中地区
            funAreaSelected(index, id);

            // 重置第三列数据
            if (index == 1) {
                $scope.areas[index + 1] = [];
            };

            // 点击第三列获取医院
            if (index == 3) {
                return funGetHospitals(id);
            };

            $http.post(serverApiRoot + 'admin/check/getArea', {
                access_token: app.url.access_token,
                id: id || ''
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    $scope.areas[index] = rpn.data;
                } else {
                    console.warn(rpn);
                }
            });

            return _funGetArea;

        })(0, null);

        // 选中地区
        function funAreaSelected(index, id) {
            index = index - 1;
            if (!$scope.areas[index] || $scope.areas[index].length < 1) return;
            for (var i = 0; i < $scope.areas[index].length; i++) {
                if ($scope.areas[index][i].code == id) {
                    $scope.areas[index][i].isSelected = true;
                } else {
                    $scope.areas[index][i].isSelected = false;
                }
            }
        };

        // 获取医院
        function funGetHospitals(id) {

            if (!id) return;

            $http.post(serverApiRoot + 'admin/check/getHospitals', {
                access_token: app.url.access_token,
                id: id
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    $scope.hospitals = rpn.data;
                } else {
                    console.warn(rpn);
                }
            });

        };

        // 选中医院
        $scope.funSelectHospital = function(hospital) {
            var index = funCheckHospitalIsSelected(hospital);
            if (index > -1) {
                return $scope.selectHospitals.splice(index, 1);
            }
            // 单选
            if (!$scope.multichoice) {
                // 清除已选择的医院
                $scope.selectHospitals = [];
            }

            // 超出最大可选数量
            if (funCeckIsToMore()) return;

            return $scope.selectHospitals.push(hospital);

        };

        // 是否已经选择（医院）
        $scope.funIsSelected = function(hospital) {
            if (funCheckHospitalIsSelected(hospital) > -1) {
                return true;
            }
            return false;
        };

        // 判断该医院是否已选择
        function funCheckHospitalIsSelected(hospital) {
            var array = $scope.selectHospitals,
                arrayLen = array.length;
            while (arrayLen--) {
                if (array[arrayLen].id == hospital.id) {
                    return arrayLen;
                }
            }
            return -1;
        };

        // 判断是否选择过多(开启了多选)
        function funCeckIsToMore() {
            if ($scope.multichoice && $scope.max && $scope.selectHospitals.length >= $scope.max) {
                toaster.pop('error', null, '最多只能选择' + $scope.max + '间医院');
                return true;
            }
            return false;
        };

        $scope.ok = function() {
            // 超出最大可选数量
            if (funCeckIsToMore()) return;
            $modalInstance.close($scope.selectHospitals);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();
