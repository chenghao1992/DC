'use strict';
(function() {

angular.module('app').controller('OrderUndo', OrderUndo);
OrderUndo.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'modal', '$modal'];
function OrderUndo($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal) {
    var url = app.url.order.getRefundOrders, // 后台API路径
        data = null,
        html = $('html'),
        body = $('body'),
        name = '',
        phone = '',
        pack = '',
        status = '',
        orderNo = '';

    if ($rootScope.pageName !== 'list_undo') {
        utils.localData('page_index', null);
        utils.localData('page_start', null);
        $rootScope.pageName = 'list_undo';
    }

    // 编辑某一审核信息
    $scope.seeDetails = function(orderId, callback) {
        if (orderId) {
            $http({
                url: app.url.order.callByOrder,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    orderId: orderId
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1 && resp.data.data.resp.respCode === '000000') {
                    modal.toast.success(resp.data.resultMsg);
                    callback.call();
                } else {
                    modal.toast.error(resp.data.resultMsg);
                }
            });
        }
    };

    // 订单查询
    $scope.queryOrder = function() {
        var packType = $('#packType');
        var refundStatus = $('#refundStatus');
        var userName = $('#userName');
        var telephone = $('#telephone');
        var _orderNo = $('#orderNo');

        pack = packType.val() * 1;
        status = refundStatus.val() * 1;

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
        length = utils.localData('page_length') * 1 || 50;

        setTable = function() {
            doctorList = $('#orderList_undo');
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
                    if (pack || pack == 0) {
                        if (pack == 11) {
                            param.orderType = 1;
                            param.packType = 1;
                        } else if (pack == 12) {
                            param.orderType = 1;
                            param.packType = 2;
                        } else {
                            param.orderType = pack;
                        }
                    }
                    if (status || status == 0) {
                        param.refundStatus = status;
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
                        for (var i = 0; i < _dt.pageData.length; i++) {
                            utils.extendHash(_dt.pageData[i], ["doctorVo", "userVo", "doctorGroup", "orderType", "price", "relation", "patientName", "refundStatus", "createTime"]);
                            utils.extendHash(_dt.pageData[i].doctorVo, ["doctorPath", "doctorName"]);
                            utils.extendHash(_dt.pageData[i].userVo, ["userName"]);
                        }
                        resp.start = _dt.start;
                        resp.recordsTotal = _dt.total;
                        resp.recordsFiltered = _dt.total;
                        resp.length = _dt.pageSize;
                        resp.data = _dt.pageData;
                        fnCallback(resp);

                        // 更新界面中的数据if(!status){
                        if(param.refundStatus === 2){
                            $('#order_undo').html(resp.recordsTotal);
                            utils.localData('order_undo', resp.recordsTotal);
                        }
                    });
                },
                "searching": false,
                "language": app.lang.datatables.translation,
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', 'button', aData, function(e) {
                        var _this = $(this);
                        $scope.doIt = function() {
                            $http({
                                url: app.url.order.refund,
                                //url: 'http://120.24.94.126/health/pack/order/updateRefundByOrder?access_token=3f736d7bf77d4639ba3a8100ef06b93f&orderIds[0]=9993',
                                method: 'post',
                                data: {
                                    access_token: app.url.access_token,
                                    orderId: e.data.orderId
                                }
                            }).then(function(resp) {
                                if (resp.resultCode == '1') {
                                    var dt = resp.data;
                                    document.write(resp.data);
                                    //info.innerHTML = dt.html;
                                } else {
                                    alert(resp.resultMsg);
                                }
                                return;
                                if (resp.data.resultCode == '1') {
                                    modal.toast.success(resp.data.data);
                                    _this.parent().prev().html('已取消');
                                    _this.parent().html('已退款');
                                    pop_win.dismiss('cancel');
                                } else {
                                    modal.toast.warn(resp.data.resultMsg);
                                    pop_win.dismiss('cancel');
                                }
                            }, function(resp) {
                                modal.toast.error('服务端请求错误！');
                            });
                        };

                        // 退款操作
                        $scope.refund = function(data) {
                            if (data.payType == 1) {
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
                                        orderId: data.orderId
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
                        }

                        $scope.refund(aData);

                    }).on('click', 'a', aData, function(e) {
                        var _this = $(this);
                        $http({
                            url: app.url.order.getRefundDetail,
                            data: {
                                access_token: app.url.access_token,
                                orderId: e.data.orderId
                            },
                            method: 'post'
                        }).then(function(resp) {
                            if (resp.data.resultCode == '1') {
                                var dts = resp.data.data;
                                for (var i = 0; i < dts.length; i++) {
                                    if (dts[i].amount < 0) {
                                        dts[i].amount = Math.abs(dts[i].amount);
                                    }
                                    if (dts[i].parentDoctorInfo && dts[i].parentDoctorInfo.amount < 0) {
                                        dts[i].parentDoctorInfo.amount = Math.abs(dts[i].parentDoctorInfo.amount);
                                    }
                                    if (dts[i].groupInfo && dts[i].groupInfo.amount < 0) {
                                        dts[i].groupInfo.amount = Math.abs(dts[i].groupInfo.amount);
                                    }
                                }
                                $scope.items = dts;
                                var pop_win = $modal.open({
                                    animation: true,
                                    templateUrl: 'order_refund_details.html',
                                    size: 'xs',
                                    scope: $scope,
                                    resolve: {
                                        item: function() {
                                            return data;
                                        }
                                    }
                                });

                                $scope.exit = function() {
                                    pop_win.dismiss('cancel');
                                };
                            } else {
                                alert(resp.data.resultMsg);
                            }
                        });
                    });
                },
                "columns": [{
                    "data": "orderNo",
                    "orderable": false
                }, {
                    "data": "doctorName",
                    "orderable": false
                }, {
                    "data": "patientName",
                    "orderable": false
                }, {
                    "data": "relation",
                    "orderable": false
                }, {
                    "data": "userName",
                    "orderable": false
                }, {
                    "data": "orderType",
                    "orderable": false,
                    "render": function(data, setting, dt) {
                        if (data == '0') {
                            return '患者报道';
                        } else if (data == '1') {
                            if (dt.packType == '1') {
                                return '图文咨询';
                            } else {
                                return '电话咨询';
                            }
                        } else if (data == '2') {
                            return '患者报道';
                        } else if (data == '4') {
                            return '健康关怀';
                        } else if (data == '5') {
                            return '随访计划';
                        } else if (data == '7') {
                            return '会诊';
                        } else if (data == '3') {
                            return '门诊';
                        } else if (data == '9') {
                            return '名医面对面';
                        } else {
                            return '';
                        }
                    }
                }, {
                    "data": "price",
                    "orderable": false,
                    "render": function(data) {
                        if (data && data > 0) {
                            return data / 100;
                        } else {
                            return '0';
                        }
                    }
                }, {
                    "data": "createTime",
                    "orderable": false,
                    "render": function(data) {
                        if (data && data.length !== 0) {
                            return utils.dateFormat(data, 'yyyy年MM月dd日 hh点mm分');
                        } else {
                            return '--';
                        }
                    }
                }, {
                    "data": "payType",
                    "orderable": false,
                    "render": function(data) {
                        if (data == '1') {
                            return '微信支付';
                        } else if (data == '2') {
                            return '支付宝';
                        } else {
                            return '其它支付';
                        }
                    }
                }, {
                    "data": 'refundStatus',
                    "orderable": false,
                    "render": function(data, d, set) {
                        if (data == '1' || data == '2') {
                            return '待退款';
                        } else if (data == '3') {
                            return '已退款';
                        } else if (data == '4') {
                            return '退款失败';
                        } else {
                            return '';
                        }
                    }
                }, {
                    "data": 'refundStatus',
                    "orderable": false,
                    "render": function(data, d, set) {
                        if (data == '1' || data == '2') {
                            return '<button class="btn btn-danger">去退款</button>';
                        } else if (data == '3' || data == '4') {
                            return '<a class="text-info">查看退款详情</a>';
                        } else {
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

angular.module('app').controller('Refund', Refund);
Refund.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'modal', '$modal'];
function Refund($rootScope, $scope, $state, $timeout, $http, utils, modal, $modal) {

};

})();
