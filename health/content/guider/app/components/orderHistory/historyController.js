(function() {
    angular.module('app')
        .controller('orderHistoryCtrl', orderHistoryCtrl);

    // 手动注入依赖
    orderHistoryCtrl.$inject = ['$scope', 'OrderHistoryFactory', '$sce', '$location', 'Lightbox','DoctorInfoDailogFtory','constants','$http'];

    // 订单记录控制器
    function orderHistoryCtrl($scope, OrderHistoryFactory, $sce, $location, Lightbox,DoctorInfoDailogFtory,constants,$http) {

        // 滚动到底部
        $scope.goBottom = function() {
            if($scope.windowDataListDB.list&&$scope.windowDataListDB.list.length>0){
                $location.hash($scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
            }
        };

        // 放大图片
        $scope.openLightboxModal = function(item, index) {
            Lightbox.openModal(item, index);
        };

        // 获取用户数据
        var user = JSON.parse(localStorage['user']);
        $scope.user = user;

        // 获取订单记录
        getOrderList(0);

        $scope.pageIndex=0;

        $scope.dayList=[];
        function getOrderList(pageIndex) {

            $scope.getOrderListIsLoading = true;

            $http.post(constants.api.order.getCustomerWorkDate, {
                access_token: localStorage['guider_access_token'],
                pageSize:15,
                pageIndex:pageIndex
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.getOrderListIsLoading = false;
                    if(data.data.pageData){
                        $scope.dayList = $scope.dayList.concat(data.data.pageData);
                        if(($scope.pageIndex+1)==data.data.pageCount){
                            $scope.isNoMoreOrderList=true;
                        }
                    }

                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });


            ////原来的接口
            //var param = {
            //    access_token: localStorage['guider_access_token'],
            //    count: 100
            //}

            //if (startTime)
            //    param.startTime = startTime


            //OrderHistoryFactory
            //    .orderList(param)
            //    .then(thenFc)
            //
            //function thenFc(response) {
            //
            //    $scope.getOrderListIsLoading = false;
            //    if (!startTime) {
            //
            //        $scope.orderList = response;
            //        if (response)
            //            if (response.length > 0)
            //                $scope.chatPeopleListItemClick(response[0].orderList[0]);
            //
            //    } else {
            //
            //        $scope.orderList = $scope.orderList.concat(response);
            //        if (response)
            //            if (response.length < 1)
            //                $scope.isNoMoreOrderList = true;
            //    }
            //
            //}
        }

        //获取更多
        $scope.getMoreOrderList=function(){
            if($scope.isNoMoreOrderList){
                return;
            }
            getOrderList($scope.pageIndex++);
        };

        //点击头部
        $scope.headerClick=function(item){
            $scope.getOrderListItemIsLoading=true;
            //alert(2343);
            //item.open=true;
            //console.log(item.open);
            if(!item.open){
                $http.post(constants.api.order.getDayRecords, {
                    access_token: localStorage['guider_access_token'],
                    dateTime:item.dateTime
                }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            $scope.getOrderListItemIsLoading=false;
                            if(data.data&&data.data.pageData&&data.data.pageData.length>0){
                                item.chatList=data.data.pageData;
                            }

                        }
                        else{
                            console.log(data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data.resultMsg);
                    });
            }
        };

        // 点击会话人
        $scope.chatPeopleListItemClick = function(item) {


            // 生成会话对象信息
            $scope.windowTarget = {
                name: item.name,
                id: item.userId,
                pic: item.headPicFileName,
                windowId: item.gid
            }

            // 获取会话对象信息
            $scope.getTargetInfo($scope.windowTarget.gid);

            // 更新会话
            $scope.windowDataListDB = null;
            $scope.windowBussiness = null
            getWindowData(item.gid);

        }


        /////////////////// 会话周边功能 ////////////////

        // 获取病情资料
        $scope.getTargetInfo = function(gid) {
            $scope.targetInfoView = {};
            $scope.targetInfoView.isLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                gid: gid
            }

            OrderHistoryFactory
                .getOrderDisease(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.targetInfoView.isLoading = false;
                $scope.targetInfo = response;
            }
        }

        // 获取会话内容
        function getWindowData(gid, type, msgId) {

            $scope.windowIsLoading = true;

            var param = {
                access_token: localStorage['guider_access_token'],
                userId: user.id,
                groupId: gid,
                cnt: 20
            }

            // 第一次获取
            if (type && msgId) {
                param.type = type;
                param.msgId = msgId;
            }

            OrderHistoryFactory
                .getWindowData(param)
                .then(thenFc)

            function thenFc(response) {


                $scope.windowIsLoading = false;
                $scope.isNoOldData = false;

                // 本地没有数据
                if (!$scope.windowDataListDB && response&&response.msgList) {
                    var localDB = {
                        gid: response.groupId,
                        list: response.msgList
                    };
                    $scope.windowDataListDB = localDB;
                    $scope.windowBussiness = response.bussiness;
                    $scope.goBottom();
                }
                // 本地有数据
                else {
                    if (response&&response.msgList) {

                        if (response.msgList.length > 0) {

                            // 获取新数据
                            if (type == 0) {
                                var index = null;
                                for (var i = 0; i < response.msgList.length; i++) {
                                    if (response.msgList[i].msgId == $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId) {
                                        index = i;
                                        break;
                                    }
                                }

                                if (index) {
                                    for (var j = index + 1; j < response.msgList.length; j++) {
                                        $scope.windowDataListDB.list.push(response.msgList[j]);
                                    }
                                }
                                $scope.windowBussiness = response.bussiness;
                                $scope.windowDataListDB.gid = response.groupId;
                                $scope.goBottom();
                            }

                            // 获取旧数据
                            else if (type == 1) {

                                $scope.windowDataListDB.list = response.msgList.concat($scope.windowDataListDB.list);
                                $scope.windowBussiness = response.bussiness;
                                $scope.windowDataListDB.gid = response.groupId;

                                $scope.isOldDataLoading = false;

                            }
                        } else {
                            $scope.isOldDataLoading = false;
                            $scope.isNoOldData = true;
                        }

                    }

                }

            }
        }

        $scope.refreshWindowData = function() {
            if ($scope.windowDataListDB && $scope.windowDataListDB.list) {
                if ($scope.windowDataListDB.list.length > 0) {
                    getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
                }

            }
        }

        $scope.getWindowOldData = function() {
            if ($scope.isOldDataLoading == true) return;
            $scope.isOldDataLoading = true;
            if($scope.windowDataListDB.list&&$scope.windowDataListDB.list.length>0){
                getWindowData($scope.windowDataListDB.gid, 1, $scope.windowDataListDB.list[0].msgId);
            }
        }

        // 文本内容转换
        $scope.textToHtml = function(content) {
            var results = $scope.faceimgfc(content, '/health/web/guider/app/shared/chat_window/faceIcon/filter/faceimages');
            results=results.replace('\n','<br>');
            results = $sce.trustAsHtml(results);
            return results;
        };

        // 卡片内容转换
        $scope.contentToHtml = function(content) {
            var results = content.replace(eval('/\\' + '|' + '\/g'), '<br>');
            results = $sce.trustAsHtml(results);
            return results;
        };

        // 消息时间转换
        //$scope.msgFormatDate = function(value) {
        //    var time;
        //    var today = new Date().getTime();
        //    var timeStep = (today - value) / 1000 / 60 / 60 / 24;
        //
        //    if (timeStep >= 0 / 60 / 24 && timeStep < 1) {
        //        return time = '今天 ' + $filter('date')(new Date(value), 'h:mm');
        //    }
        //
        //    if (timeStep >= 1 && timeStep <= 2) {
        //
        //        return time = '昨天 ' + $filter('date')(new Date(value), 'MM-dd HH:mm');
        //
        //    }
        //
        //    if (timeStep > 2) {
        //        return time = $filter('date')(new Date(value), 'MM-dd HH:mm');
        //    }
        //
        //};

        //显示医生信息
        $scope.showDocInfo=function(doctorId,gid){
            DoctorInfoDailogFtory.openModal(doctorId, gid,1,null);
        }

    }
})();
