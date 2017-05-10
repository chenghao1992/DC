'use strict';
(function(){
    app.controller('ChargeCtrl',funcCharCtrl);
    funcCharCtrl.$inject=['$scope', '$http', '$modal', 'modal', '$log', 'Group', '$compile', 'utils', 'AppFactory','toaster'];
    function funcCharCtrl($scope, $http, $modal, modal, $log, Group, $compile, utils, AppFactory, toaster) {
        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');

        // 获取当前组织信息
        $scope.currentOrgInfo = Group.getCurrentOrgInfo();
        $scope.openAppointment = 'true';

        // 是否博徳嘉联
        if ($scope.currentOrgInfo && $scope.currentOrgInfo.id) {
            AppFactory.group.isServiceGroup($scope.currentOrgInfo.id)
                .then(function(_data) {
                    if (_data) {
                        $scope.isServiceGroup = true;
                    } else {
                        $scope.isServiceGroup = false;
                    }
                });
        }


        var profits_tips = $('#charge_tips'),
            charge_tips = $('#charge_tips'),
            bankAccount_tips = $('#bankAccount_tips'),
            txt_profits = profits_tips.html(),
            txt_charges = charge_tips.html(),
            txt_account = bankAccount_tips.html(),
            profits = [
                'appointmentParentProfit',
                'appointmentGroupProfit',
                'clinicParentProfit',
                'clinicGroupProfit',
                'textParentProfit',
                'textGroupProfit',
                'phoneParentProfit',
                'phoneGroupProfit',
                'carePlanParentProfit',
                'carePlanGroupProfit',
                'consultationParentProfit',
                'consultationGroupProfit',
                'chargeItemParentProfit',
                'chargeItemGroupProfit'
            ],
            charges = [
                'charge.appointmentMin',
                'charge.appointmentMax',
                'charge.clinicMin',
                'charge.clinicMax',
                'charge.textMin',
                'charge.textMax',
                'charge.phoneMin',
                'charge.phoneMax',
                'charge.carePlanMin',
                'charge.carePlanMax',
                'charge.consultationMin',
                'charge.consultationMax',
                'charge.chargeItemMin',
                'charge.chargeItemMax'
            ],
            account = [
                'account.bankId',
                'account.subBank',
                'account.bankNo',
                'account.userRealName',
                'account.personNo',
                'account.bankName'
            ],
            watch_profit,
            watch_charge,
            watch_account,
            profitInfo = [],
            priceInfo = [],
            bankInfo = [],
            profitInfoChanged = false,
            priceInfoChanged = false,
            bankInfoChanged = false,
            canSubmitProfit = false,
            canSubmitPrice = false,
            canSubmitBank = false;

        $scope.account = {};
        //$scope.account.bankName = '12233333366666';

        // 获取及初始化相关数据
        (function() {
            getGroupProfits() // 获取集团抽成数据
            getPriceInfo(); // 获取价格范围数据
            getBankList(); // 获取银行列表
            getBankInfo(); // 获取银行卡信息
        })();

        var bank_name_ipt = $('#bank_name_ipt'),
            ulEle = $('<ul></ul>').addClass('bank-name-list none'),
            isFocus = false,
            isEdit = false,
            idx = 0,
            n = 1,
            sclHeight = 0,
            cur_item = $();

        ulEle.insertAfter(bank_name_ipt);

        function insertSelectItems(dt, key) {
            var len = dt.length;
            ulEle.html('');
            for (var i = 0; i < len; i++) {
                var str = dt[i]['bankName'];
                if (key) {
                    var keys = key.split(/\s+/g),
                        lng = keys.length;
                    for (var j = 0; j < lng; j++) {
                        str = str.replace(new RegExp(keys[j], 'ig'), '<span>' + keys[j] + '</span>');
                    }
                }
                var li = $('<li data-id="' + dt[i]['id'] + '" data-name="' + dt[i]['bankName'] + '">' + str + '</li>');
                ulEle.append(li);

                li.off().click(function(e) {
                    isFocus = false;
                    $scope.account.bankId = $(this).data('id');
                    $scope.account.bankName = $(this).data('name');
                    bank_name_ipt.val($scope.account.bankName);
                    ulEle.addClass('none');
                });
            }

            cur_item = ulEle.children().first().addClass('cur-item');
        }

        // 银行列表下拉框 chosen
        function initChosen(dt) {

            function mUp(evt) {
                var prev_item = cur_item.prev(),
                    lis = ulEle.children(),
                    ulHeight = ulEle.height(),
                    sclTop = ulEle.scrollTop();

                evt.preventDefault();
                if (prev_item.length > 0) {
                    cur_item.removeClass('cur-item');
                    cur_item = prev_item.addClass('cur-item');
                }

                idx = lis.index(cur_item);

                if (idx * 30 < (ulHeight * (n - 1)) && sclTop > idx * 30) {
                    sclHeight -= ulHeight;
                    ulEle.scrollTop(sclHeight);
                    n--;
                }
            }

            function mDown(evt) {
                var next_item = cur_item.next(),
                    lis = ulEle.children(),
                    ulHeight = ulEle.height();

                evt.preventDefault();
                if (next_item.length > 0) {
                    cur_item.removeClass('cur-item');
                    cur_item = next_item.addClass('cur-item');
                }

                idx = lis.index(cur_item);

                if ((idx) * 30 >= ulHeight * n) {
                    sclHeight += ulHeight;
                    ulEle.scrollTop(sclHeight);
                    n++;
                }
            }

            function confirm() {
                idx = 0;
                n = 1;
                sclHeight = 0;

                isFocus = false;
                $scope.account.bankId = cur_item.data('id');
                $scope.account.bankName = cur_item.data('name');
                bank_name_ipt.val($scope.account.bankName);
                setTimeout(function() {
                    ulEle.addClass('none');
                }, 60);
                //idx = lis.index(cur_item);
            }

            utils.keyHandler(bank_name_ipt, {
                'key13': confirm, // 回车确认
                'key38': mUp, // 向上选择
                'key40': mDown // 向下选择
            });

            var timer, tempKey

            bank_name_ipt.on('focus', function() {
                timer = setInterval(function() {
                    var _key = $.trim(bank_name_ipt.val());

                    if (!/\S/.test(_key)) {
                        var ln = dt.length;
                        if (tempKey === _key) {
                            if (ln > 0) ulEle.removeClass('none');

                        } else {
                            if (len > 0) ulEle.removeClass('none');
                            insertSelectItems(dt, _key); // 默认选择列表
                        }

                        tempKey = _key;
                    } else {

                        var len = 0;
                        if (tempKey === _key) {
                            if (len > 0) ulEle.removeClass('none');
                        } else {
                            var data = utils.queryByKey(dt, _key, false, false, ['bankName']); // 模糊检索相关字段
                            len = data.length;
                            if (len > 0) ulEle.removeClass('none');
                            insertSelectItems(data, _key); // 检索后的选择列表
                        }

                        tempKey = _key;
                    }

                }, 50);
            });

            bank_name_ipt.on('blur', function() {
                clearInterval(timer);
                tempKey = '';
                if (!isFocus) {
                    ulEle.addClass('none');
                }
            });
            ulEle.on('mousedown', function() {
                isFocus = true;
            });
            ulEle.on('mouseup', function() {
                isFocus = false;
            });
        }

        // 获取集团抽成数据
        function getGroupProfits() {
            $http({
                url: app.url.yiliao.getGroupInfo,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    id: curGroupId
                }
            }).then(function(resp) {
                if (resp.data.resultCode == '1') {
                    monitorOfProfitInfo();
                    if (!resp.data.data || !resp.data.data.config) return;
                    $scope.openAppointment = resp.data.data.config.openAppointment + '';
                    $scope.textParentProfit = resp.data.data.config.textParentProfit;
                    $scope.textGroupProfit = resp.data.data.config.textGroupProfit;
                    $scope.phoneParentProfit = resp.data.data.config.phoneParentProfit;
                    $scope.phoneGroupProfit = resp.data.data.config.phoneGroupProfit;
                    $scope.carePlanParentProfit = resp.data.data.config.carePlanParentProfit;
                    $scope.carePlanGroupProfit = resp.data.data.config.carePlanGroupProfit;
                    $scope.clinicParentProfit = resp.data.data.config.clinicParentProfit;
                    $scope.clinicGroupProfit = resp.data.data.config.clinicGroupProfit;
                    $scope.consultationParentProfit = resp.data.data.config.consultationParentProfit;
                    $scope.consultationGroupProfit = resp.data.data.config.consultationGroupProfit;

                    // 博徳嘉联
                    $scope.appointmentGroupProfit = resp.data.data.config.appointmentGroupProfit || 5;
                    $scope.appointmentParentProfit = resp.data.data.config.appointmentParentProfit || 5;
                    $scope.chargeItemGroupProfit = resp.data.data.config.chargeItemGroupProfit || 5;
                    $scope.chargeItemParentProfit = resp.data.data.config.chargeItemParentProfit || 5;
                } else {
                    console.error('更新抽成比例出错：' + resp.data.resultMsg);
                }
            });
        }

        // 获取银行列表
        function getBankList() {
            $http({
                url: app.url.finance.getBanks,
                method: 'post',
                data: {
                    access_token: app.url.access_token
                }
            }).then(function(resp) {
                if (resp.data.resultCode == '1') {
                    initChosen(resp.data.data);
                }
            });
        }

        // 获取银行卡信息
        function getBankInfo() {
            $http({
                url: app.url.finance.getGroupBanks,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: curGroupId
                }
            }).then(function(resp) {
                monitorOfBankInfo();
                if (!resp.data.data || !resp.data.data.length > 0) {
                    return;
                }
                $scope.account.bankName = resp.data.data[0].bankName;
                $scope.account.bankId = resp.data.data[0].id;
                $scope.account.subBank = resp.data.data[0].subBank;
                $scope.account.bankNo = resp.data.data[0].bankNo;
                $scope.account.userRealName = resp.data.data[0].userRealName;
                $scope.account.personNo = resp.data.data[0].personNo;
                bankInfo.push($scope.account.bankId, $scope.account.subBank, $scope.account.bankNo,
                    $scope.account.userRealName, $scope.account.personNo, $scope.account.bankName);

                //monitorOfBankInfo();
            });
        }

        var tips_mark, texts = [],
            tip_text_a = '',
            tip_text_b = '',
            n_idx;

        function monitorOfProfitInfo() {
            watch_profit = $scope.$watchGroup(profits, function(newValue, oldValue) {
                if (texts.length === 0) {
                    var len = newValue.length / 2;
                    for (var i = 0; i < len; i++) {
                        texts.push($('#charge_tips_' + (i + 1)).html());
                    }
                }
                var n = 7;
                while (n--) {
                    tips_mark = $('#charge_tips_' + (n + 1));
                    if (((newValue[2 * n + 1] !== undefined) && isNaN(newValue[2 * n + 1] * 1)) || ((newValue[2 * n] !== undefined) && isNaN(newValue[2 * n] * 1))) {
                        tip_text_a = '抽成比例必须为纯数字！';
                        tips_mark.addClass('text-danger').html(tip_text_a);
                        n_idx = n;
                        break;
                    } else {
                        if ((newValue[2 * n + 1] * 1) > 100 || (newValue[2 * n] * 1) > 100) {
                            tip_text_a = '单个抽成比例不能大于100%！';
                            tips_mark.addClass('text-danger').html(tip_text_a);
                            n_idx = n;
                            break;
                        } else if ((newValue[2 * n + 1] * 1) < 0 || (newValue[2 * n] * 1) < 0) {
                            tip_text_a = '单个抽成比例不能小于0！';
                            tips_mark.addClass('text-danger').html(tip_text_a);
                            n_idx = n;
                            break;
                        } else {
                            if ((newValue[2 * n + 1] * 1) + (newValue[2 * n] * 1) > 100) {
                                tip_text_a = '集团与上级抽成比例之和不能大于100%！';
                                tips_mark.addClass('text-danger').html(tip_text_a);
                                n_idx = n;
                                break;
                            } else {
                                if (tip_text_b && n_idx === n) {
                                    tips_mark.addClass('text-danger').html(tip_text_b);
                                } else {
                                    tip_text_a = '';
                                    if (n_idx === n) {
                                        tips_mark.removeClass('text-danger').html(texts[n]);
                                        tip_text_b = '';
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        function monitorOfPriceInfo() {
            watch_charge = $scope.$watchGroup(charges, function(newValue, oldValue) {
                if (texts.length === 0) {
                    var len = newValue.length / 2;
                    for (var i = 0; i < len; i++) {
                        texts.push($('#charge_tips_' + (i + 1)).html());
                    }
                }
                var n = 7;
                while (n--) {
                    tips_mark = $('#charge_tips_' + (n + 1));
                    if (n == 2) {
                        $scope.charge.textMin = Math.round($scope.charge.textMin);
                        $scope.charge.textMax = Math.round($scope.charge.textMax);
                    } else if (n == 3) {
                        $scope.charge.phoneMin = Math.round($scope.charge.phoneMin);
                        $scope.charge.phoneMax = Math.round($scope.charge.phoneMax);
                    } else if (n == 4) {
                        $scope.charge.carePlanMin = Math.round($scope.charge.carePlanMin);
                        $scope.charge.carePlanMax = Math.round($scope.charge.carePlanMax);
                    }

                    if (n == 3) {
                        if ((newValue[2 * n + 1] * 1) <= 0 || (newValue[2 * n] * 1) <= 0) {
                            tip_text_b = '电话咨询价格需大于0！';
                            tips_mark.addClass('text-danger').html(tip_text_b);
                            n_idx = n;
                            break;
                        } else if ((newValue[2 * n + 1] * 1) < (newValue[2 * n] * 1)) {
                            tip_text_b = '最低价不能大于最高价！';
                            tips_mark.addClass('text-danger').html(tip_text_b);
                            n_idx = n;
                            break;
                        } else {
                            if ((newValue[2 * n + 1] * 1) > 1000000) {
                                tip_text_b = '最高价不能大于1,000,000！';
                                tips_mark.addClass('text-danger').html(tip_text_b);
                                n_idx = n;
                                break;
                            } else {
                                if (tip_text_a && n_idx === n) {
                                    tips_mark.addClass('text-danger').html(tip_text_a);
                                } else {
                                    tip_text_b = '';
                                    if (n_idx === n) {
                                        tips_mark.removeClass('text-danger').html(texts[n]);
                                        tip_text_a = '';
                                    }
                                }
                            }
                        }
                    } else {
                        if ((newValue[2 * n + 1] * 1) < 0 || (newValue[2 * n] * 1) < 0) {
                            tip_text_b = '价格不能小于0！';
                            tips_mark.addClass('text-danger').html(tip_text_b);
                            n_idx = n;
                            break;
                        } else if ((newValue[2 * n + 1] * 1) < (newValue[2 * n] * 1)) {
                            tip_text_b = '最低价不能大于最高价！';
                            tips_mark.addClass('text-danger').html(tip_text_b);
                            n_idx = n;
                            break;
                        } else {
                            if ((newValue[2 * n + 1] * 1) > 1000000) {
                                tip_text_b = '最高价不能大于1,000,000！';
                                tips_mark.addClass('text-danger').html(tip_text_b);
                                n_idx = n;
                                break;
                            } else {
                                if (tip_text_a && n_idx === n) {
                                    tips_mark.addClass('text-danger').html(tip_text_a);
                                } else {
                                    tip_text_b = '';
                                    if (n_idx === n) {
                                        tips_mark.removeClass('text-danger').html(texts[n]);
                                        tip_text_a = '';
                                    }
                                }
                            }
                        }
                    }
                }

                $compile(tips_mark)($scope);

                if (!canSubmitProfit || !canSubmitPrice || !canSubmitBank) {
                    $scope.settingsForm.$invalid = true;
                }

                // 检测价格范围有没有改动
                var len = newValue.length;
                for (var i = 0; i < len; i++) {
                    if (newValue[i] !== priceInfo[i]) {
                        priceInfoChanged = true;
                        break;
                    } else {
                        priceInfoChanged = false;
                    }
                }
            });
        }

        function monitorOfBankInfo() {
            watch_account = $scope.$watchGroup(account, function(newValue, oldValue) {
                if (newValue[2] !== undefined && isNaN(newValue[2])) {
                    bankAccount_tips.addClass('text-danger').html('卡号必须为纯数字！');
                    $scope.settingsForm.$invalid = true;
                    canSubmitBank = false;
                } else if ((newValue[0] === undefined || isNaN(newValue[0])) && oldValue[0] !== undefined) {
                    //$scope.settingsForm.$invalid = true;
                    //bankAccount_tips.addClass('text-danger').html('必须选择所属银行！');
                } else {
                    if (newValue[2] !== undefined && (newValue[2].length != 16 && newValue[2].length != 19)) {
                        $scope.settingsForm.$invalid = true;
                        canSubmitBank = false;
                        bankAccount_tips.addClass('text-danger').html('卡号长度必须为16或19位！');
                    } else {
                        bankAccount_tips.removeClass('text-danger').html(txt_account);
                        canSubmitBank = true;
                    }
                }

                if (!canSubmitProfit || !canSubmitPrice || !canSubmitBank) {
                    $scope.settingsForm.$invalid = true;
                }

                // 检测银行卡信息有没有改动
                var len = newValue.length;
                for (var i = 0; i < len; i++) {
                    if (newValue[i] !== bankInfo[i]) {
                        bankInfoChanged = true;
                        break;
                    } else {
                        bankInfoChanged = false;
                    }
                }
            });
        }

        // 更新银行卡号
        $scope.updateBankAccount = function() {
            if (!bankInfoChanged) return;

            bankInfoChanged = false;

            $http({
                url: app.url.finance.addGroupBankCard,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: curGroupId,
                    bankNo: $scope.account.bankNo,
                    bankName: $scope.account.bankName,
                    bankId: $scope.account.bankId,
                    subBank: $scope.account.subBank,
                    userRealName: $scope.account.userRealName,
                    personNo: $scope.account.personNo,
                    //isDefault: $scope.account.isDefault,
                }
            }).then(function(resp) {
                if (resp.data.resultCode == '1') {
                    modal.toast.success('银行卡号更新成功！');
                } else {
                    modal.toast.warn(resp.data.resultMsg);
                }
            });
        };

        var txt_profits = $('#charge_tips_b').html();

        function validate(dt, id, fun) {
            var profits_tips = $('#' + id);
            var a = dt.a,
                b = dt.b;
            if (((a !== undefined) && isNaN(a * 1)) || ((b !== undefined) && isNaN(b * 1))) {
                profits_tips.addClass('text-danger').html('抽成比例必须为纯数字！');
            } else {
                if ((a * 1) > 100 || (b * 1) > 100) {
                    profits_tips.addClass('text-danger').html('单个抽成比例不能大于100%！');
                } else if ((a * 1) < 0 || (b * 1) < 0) {
                    profits_tips.addClass('text-danger').html('单个抽成比例不能小于0！');
                    $scope.settingsForm.$invalid = true;
                } else {
                    if ((a * 1) + (b * 1) > 100) {
                        profits_tips.addClass('text-danger').html('集团与上级抽成比例之和不能大于100%！');
                        $scope.settingsForm.$invalid = true;
                    } else {
                        profits_tips.removeClass('text-danger');
                        fun(dt.p);
                    }
                }
            }
        }

        function saveData(param) {
            $http.post(app.url.yiliao.updateGroupConfigAndFee, param).success(function(data) {
                if (data.resultCode === 1) {
                    modal.toast.success('保存成功！');
                } else {
                    modal.toast.error(data.resultMsg);
                }
            }).error(function(data) {
                $scope.authError = data.resultMsg;
            });
        }

        //修改集团财务数据
        $scope.updateProfits = function(type) {

            if (tip_text_a != '' || tip_text_b != '') {
                modal.toast.warn('数据格式错误，请修正！');
                return;
            }

            var params = {
                access_token: app.url.access_token,
                groupId: curGroupId,
            };

            switch (type) {
                case 1:
                    var _p_k = $scope.appointmentGroupProfit;
                    var _p_l = $scope.appointmentParentProfit;
                    var _p_l_a = $scope.charge.appointmentDefault;
                    var _p_l_b = $scope.charge.appointmentMin;
                    var _p_l_c = $scope.charge.appointmentMax;

                    _p_l_b = isNaN(_p_l_b) ? 0 : _p_l_b;
                    _p_l_c = isNaN(_p_l_c) ? 0 : _p_l_c;

                    params.type = 1;
                    params.openAppointment = $scope.openAppointment;
                    params.appointmentGroupProfit = _p_k * 1;
                    params.appointmentParentProfit = _p_l * 1;
                    params.appointmentDefault = _p_l_a * 100;
                    params.appointmentMin = _p_l_b * 100;
                    params.appointmentMax = _p_l_c * 100;

                    saveData(params);

                    break;
                case 2:
                    var _p_a = $scope.textGroupProfit;
                    var _p_b = $scope.textParentProfit;
                    var _p_b_a = $scope.charge.textMin;
                    var _p_b_b = $scope.charge.textMax;

                    _p_b_a = isNaN(_p_b_a) ? 0 : _p_b_a;
                    _p_b_b = isNaN(_p_b_b) ? 0 : _p_b_b;

                    params.type = 2;
                    params.textGroupProfit = _p_a * 1;
                    params.textParentProfit = _p_b * 1;
                    params.textMin = _p_b_a * 100;
                    params.textMax = _p_b_b * 100;

                    saveData(params);

                    break;
                case 3:
                    var _p_c = $scope.phoneGroupProfit;
                    var _p_d = $scope.phoneParentProfit;
                    var _p_d_a = $scope.charge.phoneMin;
                    var _p_d_b = $scope.charge.phoneMax;

                    _p_d_a = isNaN(_p_d_a) ? 0 : _p_d_a;
                    _p_d_b = isNaN(_p_d_b) ? 0 : _p_d_b;

                    params.type = 3;
                    params.phoneGroupProfit = _p_c * 1;
                    params.phoneParentProfit = _p_d * 1;
                    params.phoneMin = _p_d_a * 100;
                    params.phoneMax = _p_d_b * 100;

                    saveData(params);

                    break;
                case 4:
                    var _p_e = $scope.carePlanGroupProfit;
                    var _p_f = $scope.carePlanParentProfit;
                    var _p_f_a = $scope.charge.carePlanMin;
                    var _p_f_b = $scope.charge.carePlanMax;

                    _p_f_a = isNaN(_p_f_a) ? 0 : _p_f_a;
                    _p_f_b = isNaN(_p_f_b) ? 0 : _p_f_b;

                    params.type = 4;
                    params.carePlanGroupProfit = _p_e * 1;
                    params.carePlanParentProfit = _p_f * 1;
                    params.carePlanMin = _p_f_a * 100;
                    params.carePlanMax = _p_f_b * 100;

                    saveData(params);

                    break;
                case 5:
                    var _p_m = $scope.chargeItemGroupProfit;
                    var _p_n = $scope.chargeItemParentProfit;

                    params.type = 5;
                    params.chargeItemGroupProfit = _p_m * 1;
                    params.chargeItemParentProfit = _p_n * 1;

                    saveData(params);

                    break;
                case 6:
                    var _p_g = $scope.clinicGroupProfit;
                    var _p_h = $scope.clinicParentProfit;

                    params.type = 6;
                    params.clinicGroupProfit = _p_g * 1;
                    params.clinicParentProfit = _p_h * 1;

                    saveData(params);

                    break;
                case 7:
                    var _p_i = $scope.consultationGroupProfit;
                    var _p_j = $scope.consultationParentProfit;

                    params.type = 7;
                    params.consultationGroupProfit = _p_i * 1;
                    params.consultationParentProfit = _p_j * 1;

                    saveData(params);

                    break;
                default:
                    break;
            }
        };

        //提交按钮事件
        $scope.submit = function() {
            return;
            if (!profitInfoChanged && !priceInfoChanged && !bankInfoChanged) {
                modal.toast.warn('未任变更何数据，无需再次保存！');
            }

            $scope.updateProfits(curGroupId);
            $scope.updateCharges();
            $scope.updateBankAccount();
        };

        $scope.updateCharges = function() {
            if (!priceInfoChanged) return;

            priceInfoChanged = false;

            $http.post(app.url.yiliao.setCharge, {
                'access_token': access_token,
                'groupId': curGroupId,
                'textMin': $scope.charge.textMin * 100,
                'textMax': $scope.charge.textMax * 100,
                'phoneMin': $scope.charge.phoneMin * 100,
                'phoneMax': $scope.charge.phoneMax * 100,
                'carePlanMin': $scope.charge.carePlanMin * 100,
                'carePlanMax': $scope.charge.carePlanMax * 100
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    modal.toast.success('价格范围修改成功');
                } else {
                    modal.toast.error(data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                modal.toast.error('价格范围修改失败');
            });
        };

        $scope.charge = {
            textMin: 0,
            textMax: 0,
            phoneMin: 0,
            phoneMax: 0,
            carePlanMin: 0,
            carePlanMax: 0,
            appointmentMin: 500,
            appointmentMax: 20000,
            appointmentDefault: 2000
        };

        function getPriceInfo() {
            $http.post(app.url.yiliao.getCharge, {
                'access_token': access_token,
                'groupId': curGroupId
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    monitorOfPriceInfo();
                    if (data.data) {
                        $scope.charge = {
                            textMin: data.data.textMin / 100,
                            textMax: data.data.textMax / 100,
                            phoneMin: data.data.phoneMin / 100,
                            phoneMax: data.data.phoneMax / 100,
                            //clinicMin: data.data.clinicMin/100,
                            //clinicMax: data.data.clinicMax/100,
                            carePlanMin: data.data.carePlanMin / 100,
                            carePlanMax: data.data.carePlanMax / 100,
                            appointmentMin: data.data.appointmentMin / 100 || 500,
                            appointmentMax: data.data.appointmentMax / 100 || 20000,
                            appointmentDefault: data.data.appointmentDefault / 100 || 2000
                        };
                    }
                } else {
                    modal.toast.warn(data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                modal.toast.error(data.resultMsg);
            });
        }
    };

})();

(function(){
    //弹出确认模态框
    app.controller('updateModalInstanceCtrl',funcUpdateCtrl);
    funcUpdateCtrl.$inject=['$scope', '$modalInstance', '$http'];
    function funcUpdateCtrl($scope, $modalInstance, $http) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();

