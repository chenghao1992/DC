'use strict';
(function() {

angular.module('app').controller('OrderDone', OrderDone);
OrderDone.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'modal', '$modal', 'toaster'];
function OrderDone($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal, toaster) {
    var url = app.url.order.findOrder, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        type = '',
        pack = '',
        status = '',
        name = '',
        phone = '',
        orderNo = '';

    if ($rootScope.pageName !== 'list_done') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        $rootScope.pageName = 'list_done';
    }
    // 编辑某一审核信息
    // $scope.seeDetails = function(orderId, callback) {
    //     if (orderId) {
    //         $http({
    //             url: app.url.order.callByOrder,
    //             method: 'post',
    //             data: {
    //                 access_token: app.url.access_token,
    //                 orderId: orderId
    //             }
    //         }).then(function(resp) {
    //             if (resp.data.resultCode === 1 && resp.data.data.resp.respCode === '000000') {
    //                 modal.toast.success(resp.data.resultMsg);
    //                 callback.call();
    //             } else {
    //                 modal.toast.error(resp.data.resultMsg);
    //             }
    //         });
    //     }
    // };
    //编辑订单
    // 订单信息弹窗
    //  订单详情显示
    $scope.seeDetails = function(datalis){
        console.log(datalis);
        var modal=$modal.open({
            animation: true,
            templateUrl:'order_info.html',
            controller:'orderinfoCtlr',
            keyboard:false,
            backdrop:'static',
            size:'lg',
            resolve: {
                items:function(){
                    return{
                        orderId: datalis.orderId
                    }
                }
            }

        });
        modal.result.then(function(state){
            console.log(state);
        })
    }

    // 订单查询
    $scope.queryOrder = function() {
        var orderType = $('#orderType');
        var orderStatus = $('#orderStatus');
        var userName = $('#userName');
        var telephone = $('#telephone');
        var _orderNo = $('#orderNo');

        if (userName.val()) {
            name = userName.val();
        } else {
            name = null;
        }
        if (telephone.val()) {
            phone = telephone.val();
        } else {
            phone = null;
        }

        if (_orderNo.val()) {
            orderNo = _orderNo.val();
            console.log(orderNo);
        } else {
            orderNo = null;
        }

        type = orderType.val() * 1 || '';//订单类型

        status = orderStatus.val() * 1 || '';//订单状态

        dTable.fnDestroy();
        index = 1;
        start = 0;
        setTable();
    };

    ////////////////////////////////////////////////////////////

    // 初始化表格
    var doctorList, dTable, setTable, index, start, length;

    function initTable() {
        index = utils.localData('page_index') * 1 || 1;
        start = utils.localData('page_start') * 1 || 0;
        length = utils.localData('page_length') * 1 || 20;

        setTable = function() {
            doctorList = $('#orderList_done');
            dTable = doctorList.dataTable({
                "draw": index,
                "displayStart": start,
                "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "pageLength": length,
                "bServerSide": true,
                "sAjaxSource": url,
                "fnServerData": function(sSource, aoData, fnCallback) {
                    var param = {
                        pageIndex: index - 1,
                        pageSize: aoData[4]['value'],
                        access_token: app.url.access_token
                    };
                    if (type || type === 0) {
                        if (type == '11') {
                            param.packType = 1;
                        } else if (type == '13') {
                            param.packType = 2;
                        }else if(type=='8'){
                            param.packType = 12;
                        }
                        else{
                            param.orderType = type;
                        }
                    }
                    if (status || status === 0) {
                        param.orderStatus = status;
                    }
                    if (name) {
                        param.userName = name;
                    }
                    if (phone) {
                        param.telephone = phone;
                    }
                    if (orderNo) {
                        param.orderNo = orderNo;
                    }
                    $http({
                        "method": "post",
                        "url": sSource,
                        "data": param
                    }).then(function(resp) {
                        var _dt = resp.data.data;
                        if(_dt.pageData.length === 0 && index > 1){
                            dTable.fnDestroy();
                            index --;
                            start -= length;
                            setTable();
                            return;
                        }
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["doctorVo", "userVo", "doctorGroup", "money", "relation", "patientName", "orderStatus", "refundStatus", "payTime", "orderType", "orderNo"]);
                            utils.extendHash(_dt.pageData[i].doctorVo, ["doctorPath", "doctorName"]);
                            utils.extendHash(_dt.pageData[i].userVo, ["userName"]);
                        }
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据
                        if (!status && param.orderStatus === 3) {
                            $('#order_done').html(resp.recordsTotal);
                            utils.localData('order_done', resp.recordsTotal);
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', aData, function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var _this = $(this);
                        $scope.doIt = function() {
                            $http({
                                url: app.url.order.cancelPaidOrder,
                                method: 'post',
                                data: {
                                    access_token: app.url.access_token,
                                    orderIds: e.data.orderId
                                }
                            }).then(function(resp) {
                                if (resp.data.resultCode == '1') {
                                    _this.parent().prev().html('已取消');
                                    _this.parent().html('');
                                    pop_win.dismiss('cancel');
                                   if(aData.price=="0" || aData.price==0||aData.orderType==12||aData.orderType=='12'){
                                       toaster.pop({
                                           'type': 'success',
                                           'title': '取消订单成功！',
                                           'bodyOutputType': 'template'
                                       });
                                   }else{
                                       toaster.pop({
                                           'type': 'success',
                                           'body': 'toaster.html',
                                           'title': '取消订单成功！',
                                           //'bodyOutputType': 'trustedHtml',
                                           'bodyOutputType': 'template'
                                       });
                                   }

                                } else {
                                    modal.toast.warn(resp.data.resultMsg);
                                    pop_win.dismiss('cancel');
                                }
                            }, function(resp) {
                                modal.toast.error('服务端请求错误！');
                                pop_win.dismiss('cancel');
                            });
                        };

                        // 退款操作
                        $rootScope.refund = function() {
                            if (aData.payType == 1) {
                                var frm_str = '<iframe id="frm_pop" style="width: 480px;height:120px;border:none;"></iframe>';
                                modal.confirm('退款确认', '此操作将直接退款，无需输入密码！<br/><span class="text-info">确定要退款吗？</span>', function() {
                                    doRefund();
                                });
                            } else {
                                var frm_str = '<iframe id="frm_pop" style="width: 980px;height:680px;border:none;"></iframe>';
                                doRefund();
                            }

                            function doRefund() {
                                $http({
                                    url: app.url.order.refund,
                                    data: {
                                        access_token: app.url.access_token,
                                        orderId: aData.orderId
                                    },
                                    method: 'post'
                                }).then(function(resp) {
                                    if (resp.data.resultCode == '1') {
                                        if (aData.payType == 1) {
                                            modal.prompt('退款操作', frm_str, function() {
                                                dTable.fnDestroy();
                                                setTable();
                                            });
                                        } else {
                                            modal.confirm('退款操作', frm_str, function() {
                                                dTable.fnDestroy();
                                                setTable();
                                            });
                                        }
                                        var frm = document.getElementById('frm_pop');
                                        frm.contentWindow.document.write(resp.data.data);
                                    } else {
                                        alert(resp.data.resultMsg);
                                    }
                                });
                            }
                        };

                        $scope.exit = function() {
                            pop_win.dismiss('cancel');
                        };

                        var pop_win = $modal.open({
                            animation: true,
                            template: '<div class="modal-body text-center text-lg">确认取消订单？</div><div class="modal-footer"><div class="col-md-offset-3 col-md-3"><button class="btn btn-default w100" type="button" ng-click="exit()">不取消</button></div><div class="col-md-3"><button class="btn btn-danger w100" type="button" ng-click="doIt()">取消订单</button></div></div>',
                            //controller: 'Refund',
                            size: 'xs',
                            scope: $scope,
                            resolve: {
                                item: function() {
                                    return data;
                                }
                            }
                        });
                    });
                    $(nRow).click(aData,function(e){//点击每一行查看详情
                        e.preventDefault();
                        e.stopPropagation();
                        $scope.seeDetails(aData);
                    })
                },
                "columns": [{
                    "data": "orderNo",
                    "orderable": false
                }, {
                    "data": "doctorVo.doctorName",
                    "orderable": false
                }, {
                    "data": "patientName",
                    "orderable": false
                }, {
                    "data": "relation",
                    "orderable": false
                }, {
                    "data": "userVo.userName",
                    "orderable": false
                }, {
                    "data": "orderType",
                    "orderable": false,
                    "render": function(data, setting, dt) {
                        if (data == '1') {
                            if (dt.packType == '1') {
                                return '图文咨询';
                            } else {
                                return '电话咨询';
                            }
                        } else if (data == '2') {
                            return '患者报道';
                        } else if (data == '3') {
                            return '门诊';
                        } else if (data == '4') {
                            return '健康关怀';
                        } else if (data == '7') {
                            return '会诊';
                        } else if (data == '9') {
                            return '名医面对面';
                        }else if(data=='12'){
                            return '积分问诊';

                        }
                        else{
                            return ''
                        }
                    }
                }, {
                    "data": "money",
                    "orderable": false,
                    "render": function(data) {
                        if (data && data > 0) {
                            return data / 100;
                        } else {
                            return '0';
                        }
                    }
                }, {
                    "data": 'payTime' ,   //createTime
                    "orderable": true,
                    "render": function(data) {
                        if (data && data.length !== 0) {
                            return utils.dateFormat(data, 'yyyy年MM月dd日 hh点mm分');
                        } else {
                            return " ";
                        }

                    }
                }, {
                    // "data": "payType",
                    'data':'payTypeName',
                    "orderable": false,
                    "render": function(data) {
                        // console.log(data);
                        // if (data == '1') {
                        //     return '微信支付';
                        // } else if (data == '2') {
                        //     return '支付宝';
                        // } else {
                        //     return '无';
                        // }
                        return data
                    }
                }, {
                    "data": "orderStatus",
                    "orderable": false,
                    "render": function(data) {
                        if (data == '1') {
                            return '待预约';
                        } else if (data == '2') {
                            return '待支付';
                        } else if (data == '3') {
                            return '已支付';
                        } else if (data == '4') {
                            return '已完成';
                        } else {
                            return '已取消';
                        }
                    }
                }, {
                    "data": 'orderStatus',
                    "orderable": false,
                    "render": function(data, d, set) {
                        if (data == '4') {
                            return '<button class="btn btn-info">取消订单</button>';
                        } else if(data=='3') {
                            return '<button class="btn btn-info">取消订单</button>';
                        }else{
                            return '';
                        }
                    }
                }]
            });

            // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            dTable.off().on('init.dt', function() {

            }).on('length.dt', function(e, settings, len) {
                index = 1;
                start = 0;
                length = len;
                utils.localData('page_length', length);
            }).on('page.dt', function(e, settings) {
                index = settings._iDisplayStart / length + 1;
                start = length * (index - 1);
                utils.localData('page_index', index);
                utils.localData('page_start', start);
            });
        };

        setTable();

    }

    initTable();

};
//订单详情
angular.module('app').controller('orderinfoCtlr',orderinfoCtlr);
    orderinfoCtlr.$inject= ['$scope','$http','$modal', 'toaster','$modalInstance','items'];
    function orderinfoCtlr($scope,$http,$modal, toaster,$modalInstance,items) {
        $scope.imgList=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://avatar.dev.file.dachentech.com.cn/o_1b15u8t5d1r9o18u61i0il2b1nv524'];
       // $scope.imgList=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','https://farm6.staticflickr.com/5830/20552523531_e1efec8d49_k.jpg','https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_b.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg'];
        console.log(items.orderId);
        (function(){
            if(items){
                var prams={
                    access_token:app.url.access_token,
                    orderId:items.orderId
                    // orderId:22203
                    // orderId:22376


                }
                $http.post(app.url.order.orderSimpleInfo,prams).success(function(data){
                    var orderData=data.data;
                    console.log(orderData);
                    if(data.resultCode==1){
                        $scope.orderInfo={
                            // imgList:'aaaaaa',
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


                    // $scope.drugSugges=[];
                    // console.log($scope.orderInfo.recipeDetailViews instanceof Array);
                    // console.log($scope.orderInfo.recipeDetailViews.length);
                    // $scope.orderInfo.recipeDetailViews.forEach(function (item,index) {
                    //     console.log(index+':'+item);
                    //     var mySuggess=item.goodsTitle+'(用法用量：'+item.doseMothod+','+item.periodNum+item.periodUnit+item.periodTimes+'次，每次'+item.doseQuantity+item.doseUnit+')';
                    //     $scope.drugSugges.push(mySuggess);
                    //
                    // })
                    //
                    // $scope.drugSugges=$scope.drugSugges.length==0?'--':$scope.drugSugges;
                    //
                    // console.log($scope.drugSugges)
                    //


                    // 测试数据
                    // $scope.orderInfo.checkSuggestNames=["态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般"];
                    // $scope.orderInfo.pics=['http://doctor.test.file.dachentech.com.cn/ae5475d4a8c4440badddc48e85d2cddb','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg']
                    // $scope.orderInfo.hopeHelp='病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病'
                    // $scope.orderInfo.diseaseDesc='病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度病情描述是不是年纪小蝴蝶结的红包等你进度居多那就和大家巴登巴登你进度'
                    // $scope.orderInfo.evaluation=["态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般"]
                    // $scope.orderInfo.drugPics=['http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg','http://img06.tooopen.com/images/20161106/tooopen_sy_185050549459.jpg']
                    // $scope.orderInfo.drugNames=["态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般","态度很好", "回复比较慢", "一般"];

                    $scope.imgIsShow=typeof $scope.orderInfo.pics=='undefined';
                    console.info($scope.imgIsShow);

                })




            }
        })();
        $scope.orderOK = function () {
            $modalInstance.dismiss('cancel');
        };
        //点击查看大图
        $scope.funByimg=function(imgList,index){
            var modalInstance=$modal.open({
                animation: true,
                templateUrl: 'showImage.html',
                controller: 'orderimgShowCtlr',
                windowClass: 'order-detail-img',
                resolve: {
                    imgItem: function () {
                        return {
                            imgId: imgList,
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
//图片信息
angular.module('app').controller('orderimgShowCtlr',orderimgShowCtlr);
    orderimgShowCtlr.$inject=['$scope','$modalInstance','imgItem'];
    function orderimgShowCtlr($scope,$modalInstance,imgItem){
        $scope.active = imgItem.imgindex;
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
