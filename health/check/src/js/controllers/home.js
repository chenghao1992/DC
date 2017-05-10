'use strict';

// 首页控制器
app.controller('HomeController', ['$state', '$cookieStore', '$http', '$rootScope', 'utils',
    function ($state, $cookieStore, $http, $rootScope, utils) {
        var date = new Date();
        var _y = date.getFullYear();
        var _M = date.getMonth() + 1;
        var _d = date.getDate();
        var _h = date.getHours();
        var _m = date.getMinutes();
        console.log('欢迎来到 [' + document.title + '], 当前时间是: ' + _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ' + (_h >= 12 ? ('下午 ' + _h % 12) : ('上午 ' + _h)) + ' 点 ' + _m + ' 分');

        var cookie = $cookieStore.get('username');

        if (!cookie) {
            //$state.go('access.signin');
        }

        // 初始化页面数据
        var urls = [
            app.url.admin.check.getDoctors
            //app.url.admin.check.findDoctorByAuthStatus,
            //app.url.feedback.query
        ];

        function setNumbers() {
            var dt, n=0;
            function setDoctorCheckNum(status){
                var param = {
                    status: status,
                    pageIndex: 0,
                    pageSize: 1,
                    access_token: app.url.access_token
                };

                $http({
                    url: urls[n++],
                    method: 'post',
                    data: param
                }).then(function (resp) {
                    if (param.status === 2) {
                        $('#doctor_check').html(resp.data.data.total);                  // 医生资格审核，待审核
                        utils.localData('doctor_check', resp.data.data.total);
                        //setDoctorCheckNum('A');
                    } else if (param.status === 2) {
                        $('#group_check').html(resp.data.data.total);                   // 医生集团审核，待审核
                        utils.localData('group_check', resp.data.data.total);
                        //setDoctorCheckNum('A');
                    } else if (param.status === 3) {
                        $('#group_check_with_v').html(resp.data.data.total);            // 集团加V认证，待审核
                        utils.localData('group_check_with_v', resp.data.data.total);
                    }
                });
            }

            setDoctorCheckNum(2);

            var url = [
                app.url.order.findOrder,
                app.url.order.getRefundOrders,
            ];

            function setOrderNum(n) {
                var dt = {
                    pageIndex: 0,
                    pageSize: 5,
                    payType: 2,
                    access_token: app.url.access_token
                };
                if (n === 0) {
                    dt.orderStatus = 3;
                }else{
                    dt.refundStatus = 2;
                }
                $http({
                    url: url[n],
                    method: 'post',
                    data: dt
                }).then(function (resp) {
                    if (resp.data.resultCode === 1) {
                        if (n === 0) {
                            $('#order_done').html(resp.data.data.total);  // 已支付订单
                            utils.localData('order_done', resp.data.data.total);
                            setOrderNum(1);
                        } else {
                            $('#order_undo').html(resp.data.data.total);  // 待退款订单
                            utils.localData('order_undo', resp.data.data.total);
                        }
                    }
                });
            }

            setOrderNum(0);


            var group_url = [
                app.url.admin.check.groupApplyList,
                app.url.admin.check.getGroupCerts
            ];
            //  更新“医生集团认证”数据
            function getGroupCheckNum(i){
                var param = {
                    access_token: app.url.access_token,
                    status: 'A',
                    pageIndex: 0,
                    pageSize: 1
                };

                $http({
                    url: group_url[i],
                    method: 'post',
                    data: param
                }).then(function (resp) {
                    var _dt = resp.data.data;
                    if (i === 0) {
                        $('#group_check').html(_dt.total);                  // 集团未审核
                        utils.localData('group_check', _dt.total);
                        getGroupCheckNum(1);
                    }else{
                        $('#group_check_with_v').html(_dt.total);           // 集团加V未审核
                        utils.localData('group_check_with_v', _dt.total);
                    }
                });
            }

            getGroupCheckNum(0);
        }
        setTimeout(setNumbers, 300);
        clearInterval($rootScope.timer);        // 避免重复计时
        $rootScope.timer = setInterval(setNumbers, 60000);          // 一分钟刷新一次界面数据
    }
]);