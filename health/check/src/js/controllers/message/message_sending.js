'use strict';
(function() {

/**
 * 短信发送
 */
angular.module('app').controller('MsgSendingCtrl', MsgSendingCtrl);
MsgSendingCtrl.$inject = ['$scope', '$timeout','utils','$http','$modal','modal','$interval'];
function MsgSendingCtrl($scope, $timeout,utils,$http,$modal,modal,$interval) {
    var txtLt = $('#invite_phone_list'),
        keys = [],
        numbers = [],
        tmpKey = keys,
        timer = 0,
        tmr = 0,
        that = null,
    //phone = /^(13[0-9]|15[0-3]|15[5-9]|170|180|182|18[5-9])([0-9]{8})$/,
    //phone = /^(1)([0-9]{10})$/,
        phone = /^(13[0-9]|14[57]|15[0-9]|17[0678]|18[0-9])[0-9]{8}$/,
        target = null,
        curEle,
        ipt = $(),
        numberEles = [],
        index = 0;


    $scope.inviteSucceed = false;

    // 获取可用短信量
    $http({
        "method": "post",
        "url": app.url.msg.balanceCount,
        "data": {
            access_token: app.url.access_token
        }
    }).then(function(resp) {
        var _dt = resp.data;
        if(_dt.resultCode == '1'){
            $scope.msg_total = _dt.data;
        }
    });

    function editFocus(e) {
        var evt = e || window.event;
        evt.stopPropagation();
        if (curEle !== $(this)) {
            $interval.cancel(tmr);
            var temp = $(this).html();
            var thiz = curEle = $(this);

            tmr = $interval(function() {
                var _val = thiz.html();
                if (temp !== _val) {
                    temp = _val;
                    if (!phone.test(_val)) {
                        thiz.parent().addClass('btn-warning');
                    } else {
                        var _idx = keys.indexOf(_val);
                        if (_idx === -1) {
                            keys[e.data] = _val;
                            numberEles[e.data] = thiz.parent(); // 加入到集合，供后面匹配使用
                        } else {
                            blink(numberEles[_idx], thiz.parent());
                        }
                        thiz.parent().removeClass('btn-warning');
                    }

                    if($scope.str_length) $scope.can_send = true;
                }
            }, 50);
        }
    }

    function blink(eleA, eleB) {
        //return;
        var n = 6;
        var t = setInterval(function() {
            if (n % 2) {
                eleA.addClass('btn-danger');
                eleB.addClass('btn-danger');
            } else {
                eleA.removeClass('btn-danger');
                eleB.removeClass('btn-danger');
            }
            if (n-- === 0) clearInterval(t);
        }, 100);
    }

    // input聚焦后的相关处理
    function iptFocus(e) {
        var evt = e || window.event;
        evt.stopPropagation();
        if (curEle !== $(this)) {
            $interval.cancel(tmr);
            $interval.cancel(timer);
            var temp = $(this).val();
            var thiz = curEle = $(this);
            timer = $interval(function() {
                var _val = ipt.val();
                if (temp !== _val) {
                    temp = _val;
                    if (phone.test(_val)) {
                        var span = $('<span class="label-btn btn-success"></span>');
                        var b = $('<b contenteditable="true">' + _val + '</b>');
                        var ie = $('<i class="fa fa-times"></i>');
                        var idx = keys.indexOf(_val);
                        span.prepend(b);
                        span.prepend(ie);
                        span.insertBefore(ipt);
                        ipt.val('');

                        keys.push(_val); // 加入到集合，供后面匹配使用
                        numberEles.push(span); // 加入到集合，供后面匹配使用

                        if (idx !== -1) {
                            blink(numberEles[idx], span); // 有相同的号码时闪烁
                        }

                        ie.on('click', index, function(e) {
                            keys[e.data] = null;
                            $(this).parent().remove();
                        });
                        b.on('click', index, editFocus);

                        index++;

                        if($scope.str_length) $scope.can_send = true;
                    }
                }
            }, 50);
        }
    }

    function createIpt() {
        ipt = $('<input maxlength="11" class="num-input" />');
        txtLt.append(ipt);
        ipt.on('focus', iptFocus);
        ipt.trigger('focus');
    }

    txtLt.trigger('focus').blur(function() {
        $interval.cancel(tmr);
    });

    txtLt.click(function(e) {
        var evt = e || window.event;
        evt.stopPropagation();
        target = evt.target || evt.srcElement;
        if (ipt && ipt.length) {
            ipt.trigger('focus');
        } else {
            if (target === $(this)[0]) {
                createIpt(); // 嵌入一个input元素，用于输入
            }
        }
    });

    // 捕获粘贴事件
    txtLt.on('paste', function(e) {
        var clipboardData = (event.clipboardData || window.clipboardData); // 获取剪贴板对象
        var nums = clipboardData.getData("text"); // 获取剪贴板文本
        var marks = nums.split(/\d+/);
        var idxs = [];

        marks.splice(0, 1);
        //console.log(marks);

        nums = nums.split(/\D+/);
        if (!nums[0].match(/\d/)) {
            nums.splice(0, 1);
        }
        if (!nums[nums.length - 1].match(/\d/)) {
            nums.splice(nums.length - 1, 1);
        }

        if (nums.length > 0) {
            nums = utils.unique(nums, idxs);
        }

        for (var i = idxs.length - 1; i >= 0; i--) {
            marks.splice(idxs[i], 1);
        }

        if (ipt) ipt.remove();

        // 为每个数字创建一个标签
        for (var i = 0; i < nums.length; i++) {
            if (!phone.test(nums[i])) {
                var span = $('<span class="label-btn btn-success btn-warning"></span>');
            } else {
                var span = $('<span class="label-btn btn-success"></span>');
            }

            var b = $('<b contenteditable="true">' + nums[i] + '</b>');
            var name = marks[i].trim();
            if (/\S/.test(name)) {
                var m = $('<span>( ' + marks[i].trim() + ' )</span>');
            } else {
                var m = $('<span></span>');
            }
            var ie = $('<i class="fa fa-times"></i>');
            span.prepend(m);
            span.prepend(b);
            span.prepend(ie);
            txtLt.append(span);

            keys.push(nums[i]); // 加入到集合，供后面匹配使用
            numberEles.push(span); // 加入到集合，供后面匹配使用

            ie.bind('click', index, function(e) {
                keys[e.data] = null;
                $(this).parent().remove();
            });
            b.on('click', index, editFocus);
            b.on('paste', function(e) {
                var evt = e || window.event;
                evt.stopPropagation();
                var clipboardData = (event.clipboardData || window.clipboardData),
                    keys = clipboardData.getData("text");
                $(this).html();
            });

            index++;
        }
        $interval.cancel(timer);
        createIpt(); // 粘贴后嵌入一个input元素，用于输入
    });

    $scope.send = function() {
        $interval.cancel(tmr);
        $interval.cancel(timer);

        numbers = [];

        for (var i = 0; i < index; i++) {
            if (phone.test(keys[i])) {
                numbers.push(keys[i]); // 有效的号码集合
            }
        }

        if (numbers.length > 0) {
            numbers = utils.unique(numbers);
        }

        if (numbers.length === 0) {
            var v = ipt.val();
            if (v && v.length > 0 && /\S/g.test(v)) {
                modal.toast.warn('手机号码格式不正确！');
            } else {
                modal.toast.warn('手机号码格式不正确！');
            }
            return;
        }

        modal.confirm(null, '请确认是否发送！', function(){
            $scope.can_send = false;
            $http({
                "method": "post",
                "url": app.url.msg.sendAll,
                "data": {
                    access_token: app.url.access_token,
                    tel: numbers,
                    content: txt_a.val()
                }
            }).then(function(resp) {
                var _dt = resp.data;
                if(_dt.resultCode == '1'){
                    modal.toast.success('发送成功！');
                    $scope.msg_total -= $scope.msg_num;
                }else{
                    modal.toast.success('发送失败！');
                }
            });
        });
    };

    var txt_a = $('#msg_input'), timer_a;
    $scope.msg_total = '(不限)';
    $scope.str_length = 0;
    $scope.can_send = false;
    $scope.msg_num = 0;

    // 19968-40869

    // textarea聚焦后的相关处理
    function txtAreaFocus(e) {
        var evt = e || window.event;
        evt.stopPropagation();
        if (curEle !== $(this)) {
            $interval.cancel(timer_a);
            var temp = $(this).val();
            var thiz = curEle = $(this), lng = 0, n = 1;
            timer_a = $interval(function() {
                var _val = txt_a.val();
                if (temp !== _val) {
                    //$scope.str_length = utils.getBinLength(_val);
                    $scope.str_length = _val.length;
                    $scope.msg_num = Math.ceil($scope.str_length / 70);
                    if($scope.str_length){
                        $scope.can_send = true;
                    }else{
                        $scope.can_send = false;
                    }
                    temp = _val;
                }
            }, 50);
        }
    }
    txt_a.on('focus', txtAreaFocus);
    txt_a.on('blur', function(){
        $interval.cancel(timer_a);
    });

    $scope.clear = function() {
        $interval.cancel(tmr);
        $interval.cancel(timer);
        txtLt.html('');
        keys = [];
        numbers = [];
        numberEles = [];
        createIpt();
    };
};

})();