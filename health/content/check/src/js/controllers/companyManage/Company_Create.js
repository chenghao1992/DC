'use strict';
(function () {
    //新建企业
    app.controller('CompanyCreateCtrl', ['$rootScope', '$scope', '$modal', '$http', 'utils', 'toaster', '$state', '$timeout',function($rootScope, $scope, $modal, $http, utils, toaster, $state, $timeout) {
        //初始化参数
        $scope.is_show_map = true;
        $scope.type = 2;
        $scope.ProvinceList = null;
        $scope.CityList = null;
        $scope.CountyList = null;
        $scope.isCreate=false;
        var map = new BMap.Map("allmap"),
            myValue;

        var province = null,
            city = null,
            county = null;

        $scope.chooseBusinessScope = function() {
            var tagsModal = new DataBox('data_res', {
                hasCheck: true,
                allCheck: true,
                leafCheck: true,
                multiple: true,
                allHaveArr: false,
                self: true,
                cover: false,
                leafDepth: 3,
                selectView: true,
                search: {
                    searchDepth: [2],
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parentId',
                        dataSet: 'data'
                    },
                    unwind: false
                },
                arrType: [0, 0],
                data: {
                    url: app.url.drug.getAvailScopeList + "?access_token=" + app.url.access_token
                },
                titles: {
                    main: '选择经营范围',
                    searchKey: '搜索经营范围...',
                    label: '已选择经营范围'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                fixdata: $scope.thisBusinessScope,
                response: tagsSelected,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    parentId: 'parentId'
                },
                callback: function(tree) {


                }
            });

        };

        function tagsSelected(dt) {
            var str = '';

            var PhTypes = [];

            if (dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    PhTypes[i] = { name: dt[i].name, id: dt[i].id }
                }
            }
            for (var n = 0; n < dt.length; n++) {
                str += dt[n].name + ',';
            }

            $timeout(function() {
                $scope.businessScopeList = str;
                $scope.businessScope = JSON.stringify(PhTypes);
                $scope.thisBusinessScope = PhTypes;

            }, 100);

        }
        $scope.searchLocation = function() {

            var province = $("#province option:selected").html()
            var city = $("#city option:selected").html()
            var area = $("#area option:selected").html()
            // $scope.companyInfo.address = cityName;

            if (city != "" || area != "") {

                map.centerAndZoom(province +city + area, 11); // 用城市名设置地图中心点

            }
            $scope.address = area;
        }
        $scope.AreaChange = function(id, y) {


            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    if (y == 0) {

                        $scope.ProvinceList = data.data;
                    } else if (y == 1) {
                        console.log($("#province").find("option:selected").text());
                        $scope.CityList = data.data;

                    } else if (y == 2) {
                        console.log($('#city').find("option:selected").val());
                        $scope.CountyList = data.data;

                    }

                }
            });
        };
        $scope.AreaChange('', 0);

        var url = app.url.compnMan.saveDrugOrg;

        $scope.chooseType = function() {
            console.log($scope.type)
            if ($scope.type == '1' || $scope.type == '2') {
                url = app.url.compnMan.saveDrugOrg;
            } else {
                url = app.url.compnMan.saveDrugCompany;
            }
        };

        // 获取银行列表
        (function getBankList() {
            $http({
                url: app.url.compnMan.bankMessage,
                method: 'post',
                data: {
                    access_token: app.url.access_token
                }
            }).then(function(resp) {
                $scope.transferBankList = resp.data.data;
            });
        })();


        $scope.save = function() {

            if (fv.IsNull($scope.name)) {
                toaster.pop('error', null, "请输入企业名称");
                return;
            } else if ($scope.type.$$hashKey) {
                toaster.pop('error', null, "请选择企业类型");
                return;

            } else if (fv.IsNull($scope.headUserName)) {
                toaster.pop('error', null, "请输入企业负责人");
                return;

            }
            if (fv.IsNull($scope.headUserPhone)) {
                toaster.pop('error', null, "手机号码格式不对，请输入正确的管理员手机号码");
                return;

            }
            if (fv.IsNull($scope.manageUserName)) {
                toaster.pop('error', null, "请输入管理员姓名");
                return;

            }

            if (fv.IsNull($scope.manageUserPhone)) {
                toaster.pop('error', null, "手机号码格式不对，请输入正确的管理员手机号码");
                return;

            }
            if (!$scope.areaProvince) {
                toaster.pop('error', null, "请选择厂家所在区域！");
                return;
            }
            if (!$scope.address) {
                toaster.pop('error', null, "请输入联系地址！");
                return;
            }
            if ($scope.bankCardAccount) {
                if (fv.IsBankNum($scope.bankCardAccount)) {
                    toaster.pop('error', null, "输入正确的银行卡号”");
                    return;
                }
            }
            if ($scope.bankCardUserPhone) {
                if (fv.IsPhone($scope.bankCardUserPhone)) {
                    toaster.pop('error', null, "请输入正确的预留手机号，方便您的客户与您的企业联系”");
                    return;
                }
            }
            if (!$scope.latitude) {
                toaster.pop('error', null, "未正确设置联系地址");
                return;
            }

            var checkService;
            if ($scope.doorService) {
                checkService = 1;
            } else {
                checkService = 2;
            }

            var CheckmedicalInsurance;
            if ($scope.medicalInsurance) {
                CheckmedicalInsurance = 1;
            } else {
                CheckmedicalInsurance = 2;
            }
            $scope.isCreate=true;
            $http.post(url, {
                access_token: app.url.access_token,
                name: $scope.name,
                type: $scope.type,
                businessScope: $scope.businessScope,
                description: $scope.description,
                headUserName: $scope.headUserName,
                headUserPhone: $scope.headUserPhone,
                manageUserName: $scope.manageUserName,
                manageUserPhone: $scope.manageUserPhone,
                areaProvince: $scope.areaProvince,
                areaCity: $scope.areaCity||'',
                address: G('areaDetail').value,
                areaCounty: $scope.areaCounty||'',
                longtitude: $scope.longitude,
                latitude: $scope.latitude,
                bankName: $scope.bankName,
                bankCardAccount: $scope.bankCardAccount,
                bankCardUserName: $scope.bankCardUserName,
                bankCardUserPhone: $scope.bankCardUserPhone,
                medicalInsurance: CheckmedicalInsurance,
                doorService: checkService,
                deliveryNote: $scope.deliveryNote,
                businessHours: $scope.businessHours,
                contactPhone: $scope.contactPhone
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "保存成功");
                    if ($scope.type == '1' || $scope.type == '2') {
                        $state.go('app.ComMan.list',{type:'enterprise'});
                    } else {
                        $state.go('app.ComMan.list',{type:'store'});
                    }

                    $scope.isCreate=false;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                    $scope.isCreate=false;
                }
            });
        };



        var geoc = new BMap.Geocoder();

        function G(id) {
            return document.getElementById(id);
        }

        function showPoint(e) {
            G('lat').value = e.point.lat;
            G('lng').value = e.point.lng;
            var p = new BMap.Point(e.point.lng, e.point.lat);
            $scope.longitude = e.point.lng; //经度
            $scope.latitude = e.point.lat; //经度
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
                    $scope.address = _province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
            });
        }

        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;
                //获取第一个智能搜索的结果
                G('lng').value = pp.lng;
                G('lat').value = pp.lat;
                $scope.longitude = pp.lng; //经度
                $scope.latitude = pp.lat; //经度
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp)); //添加标注

            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }



        ////地图加载
        initMap();

        function initMap() {
            if ($scope.is_show_map) { //显示地图才去加载
                // 百度地图API功能
                var locals = typeof $scope.lxdz == 'undefined' || $scope.lxdz == "" ? "深圳市" : $scope.lxdz; // 定义本地地址；
                var lng = typeof $scope.longitude == 'undefined' || $scope.longitude == "" ? "116.403798" : $scope.longitude;
                var lat = typeof $scope.latitude == 'undefined' || $scope.latitude == "" ? "39.915145" : $scope.latitude;
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
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画


                map.enableScrollWheelZoom(true);
                map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
                map.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    type: BMAP_NAVIGATION_CONTROL_SMALL
                })); //右上角，仅包含平移和缩放按钮
                map.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                    type: BMAP_NAVIGATION_CONTROL_PAN
                })); //左下角，仅包含平移按钮
                map.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM
                })); //右下角，仅包含缩放按钮
                map.addEventListener("click", showPoint);

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

        $scope.cancle = function() {
            history.back(-1);
        }
    }]);

    app.controller('previewModalInstanceCtrl', ['$scope', '$modalInstance', 'article', '$sce',function($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
