'use strict';
(function () {

    angular.module('app').controller('OrderDoneListCtlr', OrderDoneListCtlr);
    OrderDoneListCtlr.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'modal', '$modal', 'toaster'];
    function OrderDoneListCtlr($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal, toaster) {
        var groupId = app.url.groupId(); //获取集团ID
        $scope.search = {
            size: 5,    //页面
            index: 1,     //第几页
            count: 0,  //总数量
            userName: "",    // 用户患者姓名
            Status: '全部',    //订单状态
            orderType: '全部', // 订单类型
            ordernumber: ''  ,    //单号
            searchType:false
        } // 初始化页面
        $scope.orderdoneList=function(){
            $scope.bigloading=true;   //加载loading
            var parms={
                access_token: app.url.access_token,
                pageIndex:$scope.search.index-1,
                pageSize:$scope.search.size,
                groupId:groupId
            };
            if($scope.search.searchType==true){
                if($scope.search.Status!='全部'){
                    parms.orderStatus=$scope.search.Status;
                } if( $scope.search.orderType!='全部'){
                    parms.packType=$scope.search.orderType;
                } if($scope.search.ordernumber!=''){
                    parms.orderNo=$scope.search.ordernumber;
                } if($scope.search.userName!=''){
                    parms.userName=$scope.search.userName;
                }
            }
            $http.post(app.url.order.findOrder,parms).success(function(data){
                $scope.btnloading=false;  //按钮
                $scope.bigloading=false;
                if(data.resultCode==1){
                    $scope.orderDataList=data.data.pageData;
                    $scope.search.count=data.data.total;
                }else {
                    toaster.pop('error',null,'网络异常');
                }
            }).error(function(data){
                $scope.btnloading=false;
                toaster.pop('error',null,data);
            });
        } // 获取数据
        $scope.orderdoneList();
        //订单信息弹窗
        $scope.funByorderShow=function(id) {
            // return ;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'order_info.html',
                controller: 'orderinfoCtlr',
                size: 'lg',
                backdrop:'static',
                resolve: {
                    items: function () {
                        return {
                            orderId: id
                        }
                    }
                }

            });
            modalInstance.result.then(function(stats) {
                console.log(stats);
            });

        }
        //页面数量显示事件
        $scope.funGetOrderList=function(){
            $scope.search.index=1;
            $scope.orderdoneList();
        }
        // 分页事件
        $scope.funBychange=function(){
            $scope.orderdoneList();
        }
        //查询事件
        $scope.queryOrder=function(){
            $scope.search.searchType=true;
            $scope.btnloading=true;
            $scope.search.index=1;
            $scope.orderdoneList();
        }
    }

    angular.module('app').controller('orderinfoCtlr',orderinfoCtlr);
    orderinfoCtlr.$inject=['$http','$scope','$modalInstance','$modal','items','toaster'];
    function orderinfoCtlr($http,$scope,$modalInstance,$modal,items,toaster){
        $scope.imgList=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','https://farm6.staticflickr.com/5830/20552523531_e1efec8d49_k.jpg','https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_b.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg'];
        //$scope.imgList=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg'];
        (function(){
            if(items){
                var prams={
                    access_token:app.url.access_token,
                    groupId:app.url.groupId(),
                    orderId:items.orderId
                    // orderId:22026
                    // orderId:22376
                }
                $http.post(app.url.order.orderSimpleInfo,prams).success(function(data){
                    var orderData=data.data;
                    console.log(orderData);
                    if(data.resultCode==1){
                        $scope.orderInfo={
                            orderStatus:orderData.orderStatus||'--',
                            disease:orderData.disease||'--',
                            diseaseDuration:orderData.diseaseDuration||'--',
                            diseaseDesc:orderData.diseaseDesc||'--',
                            drugInfo:orderData.drugInfo||'--',
                            drugNames:orderData.drugNames,
                            drugPics:orderData.drugPics,
                            hopeHelp:orderData.hopeHelp||'--',
                            pics:orderData.pics,
                            checkSuggestNames:orderData.checkSuggestNames.length!=0?orderData.checkSuggestNames:['--'],
                            recipeDetailViews:orderData.recipeDetailViews,
                            evaluation:orderData.evaluation.length!=0?orderData.evaluation:['--'],
                            orderType:orderData.orderType
                        }
                    }else {
                        toaster.pop('error',null,data.resultMsg);
                    }

                    if($scope.orderInfo.orderStatus==3){
                        if($scope.orderInfo.orderType==1){
                            $scope.orderInfo.orderStatus='已支付,等待医生回答';
                        }else {
                            $scope.orderInfo.orderStatus='已支付';
                        }
                    }else if($scope.orderInfo.orderStatus==4){
                        $scope.orderInfo.orderStatus='已完成';
                    }else if($scope.orderInfo.orderStatus==5){
                        $scope.orderInfo.orderStatus='已取消';
                    }else {
                        $scope.orderInfo.orderStatus='--';
                    }

                    // 测试数据
                    // $scope.orderInfo.checkSuggestNames=["态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般"]
                    // $scope.orderInfo.pics=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg']
                    // $scope.orderInfo.hopeHelp='病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病'
                    // $scope.orderInfo.diseaseDesc='病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度'
                    // $scope.orderInfo.evaluation=["态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般"]


                    $scope.imgIsShow=typeof $scope.orderInfo.pics=='undefined';
                    console.info($scope.imgIsShow);

                    // $scope.drugSugges=[];
                    // console.log($scope.orderInfo.recipeDetailViews instanceof Array);
                    // console.log($scope.orderInfo.recipeDetailViews.length);
                    // $scope.orderInfo.recipeDetailViews.forEach(function (item,index) {
                    //     console.log(index+':'+item);
                    //     item.doseMothod=item.doseMothod?item.doseMothod:'';
                    //     var mySuggess=item.goodsTitle+'(用法用量：'+item.doseMothod+','+item.periodNum+item.periodUnit+item.periodTimes+'次，每次'+item.doseQuantity+item.doseUnit+')';
                    //     $scope.drugSugges.push(mySuggess);
                    //
                    // })
                    //
                    // $scope.drugSugges=$scope.drugSugges.length==0?'--':$scope.drugSugges;

                }).error(function(resp){
                    console.info(resp);
                })
            }

        })();



        $scope.orderOK = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.funByimg=function(imglist,index){
            var modalInstance=$modal.open({
                animation: true,
                templateUrl: 'showImage.html',
                controller: 'orderimgShowCtlr',
                windowClass: 'order-detail-img',
                resolve: {
                    imgItem: function () {
                        return {
                            imgId: imglist,
                            imgindex:index
                        }
                    }
                }
            });
            modalInstance.result.then(function(stats){
                console.log(stats);
            })
        }

    };

    angular.module('app').controller('orderimgShowCtlr',orderimgShowCtlr);
    orderimgShowCtlr.$inject=['$scope','$modalInstance','imgItem'];
    function orderimgShowCtlr($scope,$modalInstance,imgItem){
        $scope.active = imgItem.index;
        $scope.noWrapSlides = false;
        var slides = $scope.slides = [];
        var currIndex = 0;
        var addSlide = function() {
            for (var i = 0; i < imgItem.imgId.length; i++) {
                slides.push({
                    image: imgItem.imgId[i],
                    id: currIndex++
                });
                if(imgItem.imgindex==i){
                    slides[i].active=true;
                }
            }
        };
        addSlide();
        $scope.cancel = function() {
            $modalInstance.close('cancel');
        };


    }
})();
