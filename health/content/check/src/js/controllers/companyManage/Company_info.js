'use strict';
(function () {
    //编辑企业
    app.controller('CompanyInfoCtrl', ['$rootScope', '$scope', '$modal', '$http', 'utils', 'toaster', '$stateParams',function($rootScope, $scope, $modal, $http, utils, toaster, $stateParams) {
        //初始化参数
        $scope.is_show_map = true;
        $scope.type = {};
        $scope.ProvinceList = null;
        $scope.CityList = null;
        $scope.CountyList = null;
        $scope.isP = true;
        var companyId = $stateParams.companyId;
        var type = $stateParams.type;
        $scope.lng = null;
        $scope.lat = null;

        $scope.AreaChange = function(id, y) {
            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    if (y == 0) {
                        $scope.ProvinceList = data.data;
                    } else if (y == 1) {
                        $scope.CityList = data.data;

                    } else if (y == 2) {
                        $scope.CountyList = data.data;
                        //$scope.isP=false;
                    }

                }
            });
        };

        $scope.AreaChange('', 0);

        //初始化药企详情
        InitTable();

        function InitTable() {
            if(type == 0){
                var url = app.url.compnMan.getDrugOrgById;
            }else{
                var url = app.url.compnMan.getDrugCompanyById;
            }

            $http.post(url, {
                access_token: app.url.access_token,
                id: companyId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.infoData = data.data;
                    var str = '';
                    var businessJson = [];
                    if ($scope.infoData.businessScope) {
                        businessJson = eval('(' + $scope.infoData.businessScope + ')');
                    }

                    if (businessJson) {
                        for (var i = 0; i < businessJson.length; i++) {
                            str += businessJson[i].name + ",";
                        }
                    }

                    $scope.infoData.businessScope = str;
                    setTimeout(function() {
                        $scope.AreaChange($scope.infoData.areaProvince, 1);
                        setTimeout(function() {
                            $scope.AreaChange($scope.infoData.areaCity, 2);
                            //地图加载
                            initMap();
                        }, 500);
                    }, 500);


                }
            });
        }
        $scope.goBack = function() {
            history.go(-1);
        };
        $scope.getPro = function() {
            console.log($scope.areaProvince + $scope.areaCity + $scope.areaCounty);
        };

        //企业状态编辑
        $scope.editStatus = function(status, str) {
            $http.post(app.url.compnMan.enableOrDisableDrugCompany, {
                access_token: app.url.access_token,
                id: companyId,
                status: status

            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, str);
                    if (status == 1) {
                        $scope.infoData.status = 2;
                    } else {
                        $scope.infoData.status = 1;
                    }
                }
            });
        };

        var map = new BMap.Map("allmap"),
            myValue;

        function diseaseSelected(dt) {
            console.log(dt);
            $scope.infoData.businessScope = dt[0].name;
            $scope.$apply($scope.infoData.businessScope);
        }
        var geoc = new BMap.Geocoder();

        function G(id) {
            return document.getElementById(id);
        }

        function showPoint(e) {
            G('lat').value = e.point.lat;
            G('lng').value = e.point.lng;
            var p = new BMap.Point(e.point.lng, e.point.lat);
            $scope.infoData.longitude = e.point.lng; //经度
            $scope.infoData.latitude = e.point.lat; //经度
            var mk = new BMap.Marker(p);
            map.clearOverlays();
            map.addOverlay(mk);
            mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

            var pt = e.point;
            geoc.getLocation(pt, function(rs) {
                var addComp = rs.addressComponents;
                var _province = '';
                if (addComp.province == '北京市' || addComp.province == '上海市' || addComp.province == '天津市' || addComp.province == '重庆市') {
                    _province = '';
                } else {
                    _province = addComp.province;
                }
                $scope.$apply(function() {
                    $scope.infoData.address = _province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                })
            });
        }




        function initMap() {
            if ($scope.is_show_map) { //显示地图才去加载
                // 百度地图API功能
                var locals = typeof $scope.lxdz == 'undefined' || $scope.lxdz == "" ? "深圳市" : $scope.lxdz; // 定义本地地址；
                var lng = $scope.infoData.longtitude || 114.065959;
                var lat = $scope.infoData.latitude || 22.54859;
                if (lng == '' && lat == '') {
                    map.centerAndZoom(locals);
                    var point = new BMap.Point(114.065959, 22.54859);
                } else {
                    map.centerAndZoom(new BMap.Point(lng, lat), 18);
                    var point = new BMap.Point(lng, lat);
                }

                map.centerAndZoom(point, 12);
                var marker = new BMap.Marker(point); // 创建标注


                map.clearOverlays();
                map.addOverlay(marker); // 将标注添加到地图中
                var ac = new BMap.Autocomplete({
                    "input": "areaDetail",
                    "location": map
                }); //建立一个自动完成的对象
                ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
                    var str = "";
                    var _value = e.fromitem.value;
                    var value = "";
                    if (e.fromitem.index > -1) {
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                    value = "";
                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                    G("searchResultPanel").innerHTML = str;
                });

                ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                    $scope.lxdz = myValue;
                    //将自动匹配的下拉框值作为参数区查询
                    setPlace();
                });


            }
        }

    }]);

// app.controller('previewModalInstanceCtrl', function($scope, $modalInstance, article, $sce) {
//     $scope.article = article;
//     $scope.article.content = $sce.trustAsHtml($scope.article.content);
//     $scope.cancel = function() {
//         $modalInstance.dismiss('cancel');
//     };
// });

})();
