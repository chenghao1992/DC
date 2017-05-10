'use strict';
(function(){
    app.controller('substanceEdit', ['$rootScope', '$scope', '$modal', '$log', '$http', '$state', '$stateParams', 'utils', 'modal', 'Group', 'AppFactory', '$timeout', 'toaster', 'ChooseHospitalsFactory',

        function($rootScope, $scope, $modal, $log, $http, $state, $stateParams, utils, modal, Group, AppFactory, $timeout, toaster, ChooseHospitalsFactory) {

            // 获取当前组织信息
            $scope.currentOrgInfo = Group.getCurrentOrgInfo();

            // 已选择的执业医院
            $scope.currentHospitals = [];

            // 获取已经选择的执业医院
            (function _getCurrentHospitals() {
                $http.post(app.url.common.getGroupHospital, {
                    access_token: localStorage.getItem('access_token'),
                    groupId: $scope.currentOrgInfo.id
                }).then(function(_data) {
                    _data = AppFactory.ajax.dealHealth(_data);
                    if (Array.isArray(_data)) {
                        $scope.currentHospitals = _data;
                        for(var i=0; i<$scope.currentHospitals.length; i++){
                            if( !!$scope.currentHospitals[i].lat && !!$scope.currentHospitals[i].lng){
                                var myGeo = new BMap.Geocoder();
                                var point = new BMap.Point($scope.currentHospitals[i].lng, $scope.currentHospitals[i].lat);
                                // 根据坐标得到地址描述
                                (function(pt,k){
                                    myGeo.getLocation(pt, function(rs){
                                        var addComp = rs.addressComponents;
                                        $timeout(function(){
                                            $scope.currentHospitals[k].address=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                                        },0);
                                    });
                                })(point,i);
                            }
                        }
                    };
                });
            })();


            // 选择医院
            $scope.funOpenDataTree = function(selectedHosputals) {
                ChooseHospitalsFactory.open({
                    data: selectedHosputals,
                    multichoice: true
                }, function(_selectHospitals) {
                    console.log(_selectHospitals);
                    $scope.currentHospitals = _selectHospitals;
                });
            };

            //选择地址
            $scope.selectAdress=function(row){
                var modal = $modal.open({
                    templateUrl: 'selectAddress.html',
                    controller: 'selectAddressInstanceCtrl',
                    size: 'lg',
                    resolve: {
                        item: function() {
                            return row;
                        }
                    }
                });

                modal.result.then(function(item) {
                    row = item;
                }, function() {

                });
            };

            // 移除已选择的医院
            $scope.removeItem = function(item,$event) {
                $event.stopPropagation();
                var index=$scope.currentHospitals.indexOf(item);
                $scope.currentHospitals.splice(index,1);
            };

            // 选择执业医院
            function funSelectedHospitals(arry) {
                $timeout(function() {
                    $scope.currentHospitals = arry;
                }, 100)
            };

            // 保存
            $scope.funSaveData = function(currentHospitals) {
                var modal = $modal.open({
                    templateUrl: 'confirmContent.html',
                    controller: 'confirmModalInstanceCtrl',
                    size: 'sm'
                });

                modal.result.then(function() {
                    if (!currentHospitals || currentHospitals.length < 1) {
                        return toaster.pop('error', null, '请选择执业医院');
                    }

                    var hospitals = [];
                    for (var i = 0; i < currentHospitals.length; i++) {
                        var hospital={
                            id:currentHospitals[i].hospitalId||currentHospitals[i].id,
                            lat:currentHospitals[i].lat,
                            lng:currentHospitals[i].lng,
                            name:currentHospitals[i].name
                        };
                        hospitals.push(hospital);
                    }
                    var hospitalInfo=JSON.stringify({
                        'hospitalInfo':hospitals
                    });
                    $http.post(app.url.common.setGroupHospital, {
                        access_token: localStorage.getItem('access_token'),
                        id: $scope.currentOrgInfo.id,
                        data:hospitalInfo
                    }).then(function(_data) {
                        _data = AppFactory.ajax.dealHealth(_data);
                        if (_data) {
                            toaster.pop('success', null, '设置成功');
                        }
                    });
                }, function() {

                });
            };
        }
    ]);


//地图选择地址模态框
    app.controller('selectAddressInstanceCtrl', ['$scope', '$modalInstance','$http','$timeout','toaster','item', function($scope, $modalInstance, $http,$timeout,toaster,item) {
        var access_token = localStorage.getItem('access_token');
        $scope.hospitalName=item.name;
        var map=null;
        function G(id) {
            return document.getElementById(id);
        }
        setTimeout(function(){
            // 百度地图API功能
            map = new BMap.Map("allmap");    // 创建Map实例
            var marker;
            var geoc = new BMap.Geocoder();

            function myFun(result){
                var cityName = result.name;
                map.setCenter(cityName);
            }
            var _p=new BMap.Point(item.lng, item.lat);
            if(item.lat&&item.lng){
                map.centerAndZoom(_p, 11);  // 初始化地图,设置中心点坐标和地图级别
                marker = new BMap.Marker(_p); // 创建点
                map.addOverlay(marker);    //增加点
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                geoc.getLocation(_p, function(rs){
                    var addComp = rs.addressComponents;
                    $timeout(function(){
                        $scope.longitude=item.lng;
                        $scope.latitude=item.lat;
                        $scope.address=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                    });
                });
            }
            else{
                map.centerAndZoom(_p, 11);  // 初始化地图,设置中心点坐标和地图级别
                var _myCity = new BMap.LocalCity();
                _myCity.get(myFun);
            }

            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件

            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            map.enableInertialDragging();

            map.enableContinuousZoom();

            //var size = new BMap.Size(10, 20);
            //map.addControl(new BMap.CityListControl({
            //    anchor: BMAP_ANCHOR_TOP_LEFT,
            //    offset: size,
            //}));

            function showInfo(e){
                map.removeOverlay(marker);
                marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
                $scope.longitude= e.point.lng;
                $scope.latitude= e.point.lat;
                map.addOverlay(marker);    //增加点
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                geoc.getLocation(e.point, function(rs){
                    var addComp = rs.addressComponents;
                    $timeout(function(){
                        $scope.address=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                    },0);
                });
            }
            map.addEventListener("click", showInfo);


            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : "suggestId"
                    ,"location" : map
                });

            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件

                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                console.log(e);
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace();
            });

            function setPlace(){
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun(){
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    $scope.longitude= pp.lng;
                    $scope.latitude= pp.lat;
                    map.centerAndZoom(pp, 18);
                    var marker=new BMap.Marker(pp);
                    map.addOverlay(marker);    //添加标注
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    geoc.getLocation(pp, function(rs){
                        var addComp = rs.addressComponents;
                        $timeout(function(){
                            $scope.address=addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                        },0);
                    });
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }

        },100);

        $scope.clear=function(){
            $scope.longitude=null;
            $scope.latitude=null;
            $scope.address=null;
            map.clearOverlays();
        };

        $scope.ok = function() {
            item.lat=$scope.latitude;
            item.lng=$scope.longitude;
            item.address=$scope.address;
            $modalInstance.close(item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

//弹出确认提交模态框
    app.controller('confirmModalInstanceCtrl', ['$scope', '$modalInstance','toaster', function ($scope, $modalInstance, toaster) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
