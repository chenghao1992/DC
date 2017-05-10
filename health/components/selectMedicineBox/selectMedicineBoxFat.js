'use strict';
(function() {
    angular.module('app').factory('SelectMedicineBoxFactory', funSelectMedicineBoxFactory);

    funSelectMedicineBoxFactory.$inject = ['$http', '$state', '$rootScope', 'RightDrawerFactory'];

    function funSelectMedicineBoxFactory($http, $state, $rootScope, RightDrawerFactory) {


        var template = '\
                        <div class="panel-heading font-bold text-center">品种新增</div>\
                        <div class="panel-body">\
                            <div class="clear h-full over-flow-y-auto">\
                                <div class="row">\
                                    <div class="col-xs-8 col-xs-offset-2">\
                                        <div class="input-group">\
                                            <input type="search" class="form-control" placeholder="药品名称/助记码/生产厂家/药品商品名" ng-model="key" ng-enter="funSearchByKeyword(key)">\
                                            <span class="input-group-btn">\
                                                <button class="btn btn-default" type="button" ng-click="funSearchByKeyword(key)">搜索</button>\
                                            </span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="row m-t-md">\
                                    <div class="col-xs-2 text-right">\
                                        <div class="row m-t-xs m-b-sm">\
                                            关键字：\
                                        </div>\
                                    </div>\
                                    <ul class="clearfix col-xs-10">\
                                        <li class="m-r-xs pull-left">\
                                            <button class="btn m-b-xs btn-sm btn-success" ng-show="search.keyword">{{search.keyword}} <i class="fa fa-times"></i></button>\
                                        </li>\
                                    </ul>\
                                </div>\
                                <div class="row m-t-xs">\
                                    <div class="col-xs-2 text-right">\
                                        <div class="row m-t-xs m-b-sm">\
                                            生产厂商：\
                                        </div>\
                                    </div>\
                                    <ul class="clearfix col-xs-10">\
                                        <li class="m-r-xs pull-left" ng-repeat="manufacturer in manufacturerList" ng-init="singleModel=1">\
                                            <button type="button" class="btn m-b-xs btn-sm btn-info" ng-model="manufacturer.isSelected" btn-checkbox btn-checkbox-true="true" btn-checkbox-false="false" ng-change="funChangeSearch(manufacturerList)" ng-disabled="search.manufacturers.length<=1&&manufacturer.isSelected">\
                                                <i class="fa fa-check text-active" ng-show="singleModel"></i> {{manufacturer.name}}\
                                            </button>\
                                        </li>\
                                    </ul>\
                                </div>\
                                <div class="line line-solid b-b line-lg pull-in"></div>\
                                <div class="row">\
                                    <ul class="col-xs-12" ng-show="goodsList&&goodsList.length>0">\
                                        <li class="b b-grey bg-f9 p-sm clearfix m-b-sm a-link" ng-repeat="good in goodsList" ng-click="funSelectGoods(good)">\
                                            <div class="pull-left thumb-md thumb-wrapper m-r">\
                                                <img ng-src="{{good.imageUrl}}" style="width:64px;height:64px">\
                                            </div>\
                                            <div class="pull-right">\
                                                <div class="i-checks m-t-md">\
                                                    <input type="checkbox" ng-checked="good.isSelected"><i></i>\
                                                </div>\
                                            </div>\
                                            <div class="clear">\
                                                <div class="font-semibold text-ellipsis">{{good.title}}</div>\
                                                <div class="text-xs m-t-xs font-semibold text-ellipsis">{{good.specification}} {{good.packSpecification}}</div>\
                                                <div class="text-xs m-t-xxs font-semibold text-ellipsis">{{good.manufacturer}}</div>\
                                            </div>\
                                        </li>\
                                        <li class="text-center">\
                                            <a ng-click="funGetMoreGoods()" ng-hide="noMore">获取更多</a>\
                                            <span class="text-danger" ng-show="noMore">已获取全部</span>\
                                        </li>\
                                    </ul>\
                                    <div class="col-xs-12 text-center" ng-hide="goodsList||goodsList.length>0">\
                                        无数据\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="cnt-opr-bar form-group">\
                            <div class="col-xs-12 text-center">\
                                <button ng-click="ok(selectedGoods)" type="button" class="btn inline-block w-sm  btn-success">确定</button>\
                                <button ng-click="close()" type="button" class="btn inline-block w-sm btn-default">取消</button>\
                            </div>\
                        </div>\
                        ';

        function open(config) {


            if (!config) return console.warn('缺少配置参数');

            if (!Array.isArray(config.medicines)) return console.warn('medicines必须为包含id属性的对象数组');

            // medicines = [{
            //     id:12312
            // },{
            //     id:12312
            // }]


            RightDrawerFactory.open({
                thisclass: 'cnt-anim-dialog',
                template: template,
                controller: 'SelectMedicineBoxCtrl',
                data: {
                    callback: config.callback || null,
                    access_token: config.access_token,
                    medicines: config.medicines || []
                }
            });

        };

        return {
            open: open
        };

    };

    angular.module('app').controller('SelectMedicineBoxCtrl', funSelectMedicineBoxCtrl);

    funSelectMedicineBoxCtrl.$inject = ['$scope', '$http', '$state', 'toaster']

    function funSelectMedicineBoxCtrl($scope, $http, $state, toaster) {

        // 已选择的
        $scope.selectedGoods = $scope.data.medicines || [];


        // 关键字搜索条件
        $scope.search = {
            keyword: '',
            manufacturers: []
        };

        // 厂商搜索条件
        $scope.manufacturerList = [];

        // 品种列表
        $scope.goodsList = [];


        // 翻页参数
        $scope.pageIndex = 0;
        $scope.pageSize = 8;
        $scope.pageCount = 0;
        $scope.noMore = false;

        // 搜索药
        function funSearchGoods(keyword, manufacturers) {

            return $http.post(drugFirmsApiRoot + 'goods/drugStore/searchGoodsForAdd', {
                access_token: $scope.data.access_token,
                pageIndex: $scope.pageIndex,
                pageSize: $scope.pageSize,
                keyword: keyword || '',
                manufacturers: manufacturers || []
            }).then(function(response) {

                response = response.data;
                if (!response) {
                    return false;
                } else if (response.resultCode != 1) {
                    if (response.resultMsg) {
                        toaster.pop('error', null, response.resultMsg);
                    } else {
                        toaster.pop('error', null, '接口出错');
                    }
                    return false;
                } else {

                    // 记录总页数
                    $scope.pageCount = response.data.pageCount;

                    return response.data || true;
                }
            });

        };

        // 搜索
        $scope.funSearchByKeyword = function(keyword) {

            if (!keyword) return;

            $scope.search.keyword = keyword;

            $scope.noMore = false;

            funSearchGoods(keyword)
                .then(function(_data) {
                    $scope.manufacturerList = [];
                    $scope.search.manufacturers = _data.manufacturerList;
                    $scope.goodsList = _data.pageData;

                    // $scope.manufacturerList = _data.manufacturerList;

                    var _arry = _data.manufacturerList;
                    var _index = 0;
                    while (_index < _arry.length) {

                        $scope.manufacturerList.push({
                            name: _arry[_index],
                            isSelected: true
                        })
                        _index++;
                    };

                    funSetIsSelected($scope.goodsList);

                })
        };

        // 获取更多
        $scope.funGetMoreGoods = function() {

            $scope.pageIndex = $scope.pageIndex + 1;

            funSearchGoods($scope.search.keyword, $scope.search.manufacturers)
                .then(function(_data) {

                    if ($scope.pageIndex >= $scope.pageCount) {
                        $scope.noMore = true;
                    }

                    if (!_data.pageData || _data.pageData.length < 1) return;

                    $scope.goodsList = $scope.goodsList.concat(_data.pageData);

                    funSetIsSelected($scope.goodsList);

                })
        };


        // 更改厂商搜索条件搜索
        $scope.funChangeSearch = function(manufacturerList) {

            $scope.search.manufacturers = [];
            $scope.noMore = false;

            var _index = 0;
            var _len = manufacturerList.length;
            while (_index < _len) {

                if (manufacturerList[_index].isSelected) {
                    $scope.search.manufacturers.push(manufacturerList[_index].name);
                }
                _index++
            }

            funSearchGoods($scope.search.keyword, $scope.search.manufacturers)
                .then(function(_data) {
                    $scope.goodsList = _data.pageData;
                    funSetIsSelected($scope.goodsList);
                })

        };


        // 选择品种
        $scope.funSelectGoods = function(good) {

            if (good.isSelected) {
                good.isSelected = false;
                funRemoveGood(good);
            } else {
                good.isSelected = true;
                $scope.selectedGoods.push(good);
            }

        };


        // 在已选择的品种中移除品种
        function funRemoveGood(good) {
            var _arry = $scope.selectedGoods;
            var _index = 0;
            while (_index < _arry.length) {
                if (_arry[_index].id == good.id) {
                    $scope.selectedGoods.splice(_index, 1);
                }
                _index++
            }

        };

        // 设置已选中的品种
        function funSetIsSelected(goodsList) {
            if (!goodsList) goodsList = [];
            // 设置已选中的
            var gIndex = 0;
            while (gIndex < goodsList.length) {

                var dIndex = 0;
                while (dIndex < $scope.selectedGoods.length) {
                    if (goodsList[gIndex].id == $scope.selectedGoods[dIndex].id) {
                        goodsList[gIndex].isSelected = true;
                    }
                    dIndex++
                }

                gIndex++

            }
        };

        // 确定
        $scope.ok = function(selectedGoods) {
            if ($scope.data.callback) {
                $scope.data.callback(selectedGoods);
            }
            $scope.close();
        };


    };


})();
