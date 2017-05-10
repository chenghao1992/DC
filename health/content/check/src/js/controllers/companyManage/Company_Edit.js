'use strict';
(function () {
    //编辑企业'
    app.controller('CompanyEditCtrl', ['$rootScope', '$scope', '$state', '$modal', '$http', 'utils', 'toaster', '$stateParams', '$timeout',function($rootScope, $scope, $state, $modal, $http, utils, toaster, $stateParams, $timeout) {

        // $scope.keywords = [];
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
        $scope.isBsnChange = false;
        var map = new BMap.Map("allmap"),
            myValue;
        //选择经营范围
        $scope.chooseBusinessScope = function() {
            var tagsModal = new DataBox('data_res', {
                hasCheck: true,
                allCheck: true,
                leafCheck: true,
                multiple: true,
                allHaveArr: false,
                self: false,
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
                fixdata: $scope.businessScope,
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
                $scope.data.businessScope = JSON.stringify(PhTypes);
                $scope.businessScope = PhTypes;
                $scope.isBsnChange = true;
            }, 100);


        }
        $scope.AreaChange = function(id, y) {
            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    if (!y) {
                        $scope.ProvinceList = data.data;
                    } else if (y == 1 && id) {
                        $scope.CityList = data.data;
                        // 清空区
                        $scope.CountyList = [];
                    } else if (y == 2 && id) {
                        $scope.CountyList = data.data;
                        //$scope.isP=false;
                    }

                }
            });
        };

        // 获取银行列表
        function getBankList() {
            $http({
                url: app.url.compnMan.bankMessage,
                method: 'post',
                data: {
                    access_token: app.url.access_token
                }
            }).then(function(resp) {
                $scope.transferBankList = resp.data.data;
                //初始化药企详情
                InitTable(); //先加载option银行列表，再加载初始化数据（不然会有bug）
            });
        }
        getBankList();

        $scope.AreaChange('', 0);
        $scope.searchLocation = function() {

            var province = $("#province option:selected").html()
            var city = $("#city option:selected").html()
            var area = $("#area option:selected").html()
            // $scope.companyInfo.address = cityName;

            if (city != "" || area != "") {

                map.centerAndZoom(province + city + area, 11); // 用城市名设置地图中心点

            }
            $scope.data.address = area;
        }

        function InitTable() {
            if (type == 0) {
                var url = app.url.compnMan.getDrugOrgById;
            } else {
                var url = app.url.compnMan.getDrugCompanyById;
            }

            $http.post(url, {
                access_token: app.url.access_token,
                id: companyId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.data = data.data;
                    var str = '';
                    var businessJson = [];
                    if ($scope.data.businessScope) {
                        businessJson = eval('(' + $scope.data.businessScope + ')');
                    };
                    if (!$scope.data.address) {
                        $scope.data.address = ' ';
                    };
                    if (businessJson) {
                        for (var i = 0; i < businessJson.length; i++) {
                            str += businessJson[i].name + ",";
                        }
                    };
                    $scope.businessScopeList = str;
                    $scope.businessScope = businessJson;

                    setTimeout(function() {
                        $scope.AreaChange($scope.data.areaProvince, 1);

                        (function(value) {
                            document.getElementById('areaDetail').value = value;
                        })($scope.data.address);

                        setTimeout(function() {
                            $scope.AreaChange($scope.data.areaCity, 2);
                        }, 500);
                    }, 500);
                    $scope.data.longitude = $scope.data.longtitude;
                    //地图加载
                    initMap();
                }
            });
        }
        $scope.goBack = function() {
            history.go(-1);
        };
        $scope.getPro = function() {
            console.log($scope.areaProvince + $scope.areaCity + $scope.areaCounty);
        };
        $scope.formBlur = function() {
            $scope.data.longitude = '';
        };

        var url = app.url.compnMan.updateByDrugOrg;

        $scope.chooseType = function() {

            if ($scope.data.type == '1' || $scope.data.type == '2') {

                url = app.url.compnMan.updateByDrugOrg;
            } else {
                url = app.url.compnMan.updateByDrugCompany;
            }
        };

        //更新企业信息
        $scope.update = function() {
            if ($scope.data.type == '1' || $scope.data.type == '2') {

                url = app.url.compnMan.updateByDrugOrg;
            } else {
                url = app.url.compnMan.updateByDrugCompany;
            }
            if (fv.IsNull($scope.data.name)) {
                toaster.pop('error', null, "请输入企业名称");
                return;
            } else if ($scope.data.type.$$hashKey) {
                toaster.pop('error', null, "请选择企业类型");
                return;

            } else if (fv.IsNull($scope.data.headUserName)) {
                toaster.pop('error', null, "请输入企业负责人");
                return;
            }
            if (fv.IsNull($scope.data.headUserPhone)) {
                toaster.pop('error', null, "请输入企业负责人手机号");
                return;
            } else if (!$scope.data.headUserPhone) {
                toaster.pop('error', null, "企业负责人手机号不能为空！");
                return;
            }
            if (fv.IsNull($scope.data.manageUserName)) {
                toaster.pop('error', null, "请输入管理员姓名");
                return;
            }
            if (fv.IsNull($scope.data.manageUserPhone)) {
                toaster.pop('error', null, "请输入管理员手机号");
                return;

            } else if (!$scope.data.manageUserPhone) {
                toaster.pop('error', null, "管理员手机号不能为空");
                return;
            }
            if (!$scope.data.areaProvince ) {
                toaster.pop('error', null, "请选择厂家所在区域！");
                return;
            }
            if (!$scope.data.address) {
                toaster.pop('error', null, "请输入联系地址！");
                return;
            }
            if ($scope.data.bankCardAccount) {
                if (fv.IsBankNum($scope.data.bankCardAccount)) {
                    toaster.pop('error', null, "输入正确的银行卡号");
                    return;
                }
            }
            if ($scope.data.bankCardUserPhone) {
                if (fv.IsPhone($scope.data.bankCardUserPhone)) {
                    toaster.pop('error', null, "请输入正确的预留手机号，方便您的客户与您的企业联系”");
                    return;
                }
            }

            if (!$scope.data.longitude) {
                toaster.pop('error', null, "未正确设置联系地址");
                return;
            }
            if (!$scope.isBsnChange) {
                $scope.data.businessScope = JSON.stringify($scope.businessScope)
            }

            $http.post(url, {
                access_token: app.url.access_token,
                id: companyId,
                name: $scope.data.name,
                type: $scope.data.type,
                businessScope: $scope.data.businessScope,
                description: $scope.data.description,
                headUserName: $scope.data.headUserName,
                headUserPhone: $scope.data.headUserPhone,
                manageUserName: $scope.data.manageUserName,
                manageUserPhone: $scope.data.manageUserPhone,
                areaProvince: $scope.data.areaProvince,
                areaCity: $scope.data.areaCity||'',
                address: document.getElementById('areaDetail').value,
                areaCounty: $scope.data.areaCounty||'',
                longtitude: $scope.data.longitude,
                latitude: $scope.data.latitude,
                bankName: $scope.data.bankName,
                bankCardAccount: $scope.data.bankCardAccount,
                bankCardUserName: $scope.data.bankCardUserName,
                bankCardUserPhone: $scope.data.bankCardUserPhone,
                medicalInsurance: $scope.data.medicalInsurance,
                doorService: $scope.data.doorService,
                deliveryNote: $scope.data.deliveryNote,
                businessHours: $scope.data.businessHours,
                contactPhone: $scope.data.contactPhone,
                status: $scope.data.status
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "更新成功");
                    history.go(-1);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            });
        };

        // //企业状态编辑
        $scope.EnableStatus = function() {
            $http.post(app.url.compnMan.enableOrDisableDrugCompany, {
                access_token: app.url.access_token,
                id: companyId,
                status: 1,
                name: $scope.data.name,
                type: $scope.data.type,
                businessScope: $scope.data.businessScope,
                description: $scope.data.description,
                headUserName: $scope.data.headUserName,
                headUserPhone: $scope.data.headUserPhone,
                manageUserName: $scope.data.manageUserName,
                manageUserPhone: $scope.data.manageUserPhone,
                areaProvince: $scope.data.areaProvince,
                areaCity: $scope.data.areaCity,
                areaCounty: $scope.data.areaCounty,
                address: $scope.data.address,
                longtitude: $scope.data.longitude,
                latitude: $scope.data.latitude,
                bankName: $scope.data.bankName,
                bankCardAccount: $scope.data.bankCardAccount,
                bankCardUserName: $scope.data.bankCardUserName,
                bankCardUserPhone: $scope.data.bankCardUserPhone
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '已生效');
                    $scope.data.status = 1;
                    $state.go('app.ComMan.list');
                } else {
                    toaster.pop("danger", null, "更新失败");
                }
            });
        };
        $scope.DisableStatus = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalStatus.html',
                controller: 'ModalCompanyCtrl',
                size: 'sm',
                resolve: {
                    vartId: function() {
                        return companyId;
                    },
                    groupId: function() {
                        return 2;
                    }
                }
            });
        };
        app.controller('ModalCompanyCtrl', function($scope, $state, $uibModalInstance, vartId, groupId, toaster) {
            $scope.modalOk = function() {
                $http.post(app.url.compnMan.enableOrDisableDrugCompany, {
                    access_token: app.url.access_token,
                    id: vartId,
                    status: groupId
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "已失效");
                        $uibModalInstance.close('ok');
                        $state.go('app.ComMan.list');
                        $scope.data.status = 1;
                    }
                });
            };
            $scope.modalCancel = function() {
                $uibModalInstance.close('cancel');
            };
        });


        var geoc = new BMap.Geocoder();

        function G(id) {
            return document.getElementById(id);
        }

        function showPoint(e) {
            G('lat').value = e.point.lat;
            G('lng').value = e.point.lng;
            var p = new BMap.Point(e.point.lng, e.point.lat);
            $scope.data.longitude = e.point.lng; //经度
            $scope.data.latitude = e.point.lat; //经度
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
                    $scope.data.address = _province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                })
            });
        }

        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;
                //获取第一个智能搜索的结果
                G('lng').value = pp.lng;
                G('lat').value = pp.lat;
                $scope.data.longitude = pp.lng; //经度
                $scope.data.latitude = pp.lat; //经度
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp)); //添加标注

            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }


        function initMap() {
            if ($scope.is_show_map) { //显示地图才去加载
                // 百度地图API功能
                // var locals = typeof $scope.data.longitude  == 'undefined' || $scope.data.latitude  == "undefined" ? "深圳市" : $scope.lxdz; // 定义本地地址；
                var lng = $scope.data.longitude || 114.065959;
                var lat = $scope.data.latitude || 22.54859;
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

    }]);
// app.controller('previewModalInstanceCtrl', function ($scope, $modalInstance,article,$sce) {
//     $scope.article=article;
//     $scope.article.content=$sce.trustAsHtml($scope.article.content);
//     $scope.cancel = function() {
//         $modalInstance.dismiss('cancel');
//     };
// });

})();
