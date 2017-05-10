'use strict';
(function () {
    app.controller('CreateDoctorAccount', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal', '$modal', '$compile',function($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal, $modal, $compile) {
        var id = $stateParams.id,
            name = $stateParams.name;

        $scope.groupId = id || '666666666666666666666666';
        $scope.groupName = name || '';

        $scope.hospital = {};

        if ($rootScope.reuseDcotorData) {
            $scope.hospital.selected = {};
            $scope.hospital.selected.id = $rootScope.reuseDcotorData.id || null;
            $scope.hospital.selected.name = $rootScope.reuseDcotorData.name || null;
            $scope.deptId = $rootScope.reuseDcotorData.deptId || null;
            $scope.department = $rootScope.reuseDcotorData.department || null;
            $scope.title = $rootScope.reuseDcotorData.title || null;
        }


        ////////////////////////////////////////////////////////////

        function setDefaultHospital(hospital) {
            $scope.hospital.selected.id = hospital.id;
            $scope.hospital.selected.name = hospital.name;
        }

        ////////////////////////////////////////////////////////////

        // 搜索医院
        $scope.getHospitalOption = (function getHospitalOption(keyWord) {
            $scope.keyWord = keyWord;
            $http.post(app.url.hospital.findHospitalByCondition, {
                access_token: app.url.access_token,
                pageIndex: 0,
                pageSize: 20,
                keyWord: keyWord || null
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {
                    $scope.hospitalOption = rpn.data.pageData;
                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });

            return getHospitalOption;
        })();

        ////////////////////////////////////////////////////////////

        $scope.createHospital = function() {
            var modalInstance = $modal.open({
                template: '<div class="clearfix">\
                    <h4 class="col-xs-12 m-t-lg text-center">添加医院</h4>\
                    <div class="col-xs-12 m-t m-b">\
                        <div class="form-group clearfix m-b-xs">\
                            <label class="col-xs-3 control-label m-b-none text-right">医院所在省份：</label>\
                            <div class="col-xs-9">\
                                <select class="form-control m-b-none" ng-model="_provincesCode" ng-change="getArea(_provincesCode,\'citys\');_cityCode=\'\';_regionCode=\'\'">\
                                    <option value="">请选择</option>\
                                    <option value="{{pro.code}}" ng-repeat="pro in provinces">{{pro.name}}</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class="line line-dashed b-b line-lg pull-in"></div>\
                        <div class="form-group clearfix m-b-xs">\
                            <label class="col-xs-3 control-label m-b-none text-right">医院所在城市：</label>\
                            <div class="col-xs-9">\
                                <select class="form-control m-b-none" ng-model="_cityCode" ng-change="getArea(_cityCode,\'regions\');_regionCode=\'\'" ng-disabled="!_provincesCode">\
                                  <option value="">{{_provincesCode?\'请选择\':\'请先选择省份\'}}</option>\
                                  <option value="{{city.code}}" ng-repeat="city in citys">{{city.name}}</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class="line line-dashed b-b line-lg pull-in"></div>\
                        <div class="form-group clearfix m-b-xs">\
                            <label class="col-xs-3 control-label m-b-none text-right">医院所在区域：</label>\
                            <div class="col-xs-9">\
                                <select class="form-control m-b-none" ng-model="_regionCode" ng-disabled="!_cityCode">\
                                  <option value="">{{_cityCode?\'请选择\':\'请先选择城市\'}}</option>\
                                  <option value="{{region.code}}" ng-repeat="region in regions">{{region.name}}</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class="line line-dashed b-b line-lg pull-in"></div>\
                        <div class="form-group clearfix">\
                            <label class="col-xs-3 control-label m-b-none text-right">医院名称：</label>\
                            <div class="col-xs-9">\
                                <input type="text" class="form-control" placeholder="请输入医院名称" ng-model="_hospitalName">\
                            </div>\
                        </div>\
                        <div class="line line-dashed b-b line-lg pull-in"></div>\
                        <div class="form-group clearfix">\
                            <label class="col-xs-3 control-label m-b-none text-right">医院等级：</label>\
                            <div class="col-xs-9">\
                                <select class="form-control" ng-model="_hospitalLevel">\
                                    <option value="">请先选医院等级</option>\
                                    <option ng-repeat="lv in levels" value="{{lv.level}}">{{lv.level}}</option>\
                                </select>\
                            </div>\
                        </div>\
                        <div class="line line-dashed b-b line-lg pull-in"></div>\
                        <div class="form-group">\
                            <div class="col-xs-offset-3 col-xs-3">\
                                <button type="submit" class="w100 btn btn-primary" ng-click="addHospital(_provincesCode, _cityCode, _regionCode, _hospitalName, _hospitalLevel)" ng-disabled="!_provincesCode||!_cityCode||!_regionCode||!_hospitalName||!_hospitalLevel">\
                                    添加\
                                </button>\
                            </div>\
                            <div class="col-xs-3">\
                                <button type="button" class="w100 btn btn-default" ng-click="cancel()">返回</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>',
                controller: 'AddHospitalCtrl',
                size: 'md',
                resolve: {
                    item: function() {
                        return $scope.hospital;
                    }
                }
            });

            modalInstance.result.then(function(hospital) {
                if (setDefaultHospital) setDefaultHospital(hospital);
            });
        };

        ////////////////////////////////////////////////////////////

        var key = null,
            data = null,
            search = null,
            val = '',
            areaId = [],
            curClickItem,
            access_level = 0,
            target = null;

        // 创建‘科室’数据列表
        function initList(param) {
            $http({
                url: param.url,
                data: param.data,
                method: param.method
            }).then(function(dt) {
                var route = $('#list_route'),
                    panel = $('#eara_panel'),
                    search = $('#search_input'),
                    lastUl = null;

                if (dt.data.resultCode !== 1) {
                    var lnks = route.find('a');
                    var w = 0;
                    for (var i = 0; i < lnks.length; i++) {
                        w += lnks.eq(i).width();
                    }
                    if (w > route.width()) {
                        route.animate({
                            "scrollLeft": w - route.width() + 50
                        }, 300);
                    }
                    return;
                } else {
                    if (dt.data.data.length === 0 && access_level !== 4) {
                        target.find('i').css('visibility', 'hidden');
                        container.find('button[type=submit]').removeClass('disabled');
                        return;
                    }
                }

                data = dt.data.data;

                function makeList(data) {
                    var len = data.length;
                    var ul = $('<ul class="eara-list"></ul>');

                    if (access_level % 2 === 0) {
                        ul.addClass('bg-even');
                    } else {
                        ul.addClass('bg-odd');
                    }
                    ul.data('level', access_level);
                    //ul.className = 'eara-list';
                    for (var i = 0; i < len; i++) {
                        var li = $('<li></li>');
                        li.data(param.key, data[i][param.key]);
                        li.data('name', data[i]['name']);

                        // 点击展开下一层列表
                        li.click(function() {

                            route.find('.route-link').eq(3).remove();
                            search.val('');
                            $(this).parent().nextAll().remove();
                            access_level = $(this).parent().data('level');
                            if (key) {
                                key = 'code';
                            }

                            // (Link) 选择到的区域路线
                            var link = $('#link_' + access_level);

                            if (link.length > 0) {
                                link.nextAll().remove();
                            } else {
                                link = $('<a class="route-link"></a>');
                                link.attr('id', 'link_' + access_level);
                            }
                            link.html($(this).data('name'));
                            route.append(link);

                            link.data('offsetTop', panel.scrollTop());
                            link.data('offsetLeft', panel.scrollLeft());
                            link.off().on('click', function() {
                                var top = $(this).data('offsetTop') * 1;
                                var left = $(this).data('offsetLeft') * 1;
                                panel.scrollTop(top).scrollLeft(0);
                            });
                            // (End Link)

                            var data_key = $(this).data(param.key);
                            if (access_level % 2 === 0) {
                                $(this).siblings().removeClass('item-odd');
                                $(this).addClass('item-odd');
                            } else {
                                $(this).siblings().removeClass('item-even');
                                $(this).addClass('item-even');
                            }

                            // (Path) 设置API
                            if (access_level === 3) {
                                var url = app.url.admin.check.getHospitals;
                                key = 'id';
                            } else {
                                var url = param.url;
                                key = null;
                            }
                            // (End Path)

                            // 最终的目标标签
                            if ((access_level === 4) ||
                                (param.key !== 'code' && access_level === 2)) {
                                container.find('button[type=submit]').removeClass('disabled');
                            } else {
                                container.find('button[type=submit]').addClass('disabled');
                            }

                            target = $(this); // 保存当前被点击的对象

                            if (data_key) {
                                initList({
                                    url: url,
                                    data: {
                                        id: data_key,
                                        access_token: app.url.access_token
                                    },
                                    method: 'POST',
                                    key: key || param.key
                                });
                            }

                            if (access_level === 4) {
                                curClickItem = $(this);
                            }
                            areaId[access_level - 2] = data_key;
                        });

                        var str = '<a class="auto">' +
                            ((access_level === 4) ||
                            (param.key !== 'code' && access_level === 2) ? '' :
                            '<span class="pull-right text-muted">' +
                            '<i class="fa fa-fw fa-angle-right text"></i>' +
                            '</span>') +
                            '<span>' + data[i]['name'] + '</span>' +
                            '</a>';
                        li.html(str);
                        ul.append(li);
                    }

                    panel.append(ul);
                    lastUl = panel.find('.eara-list').last();
                }

                makeList(data);
                var isLast = true;

                search.off().on('keydown', function() {
                    setTimeout(function() {
                        val = search.val();
                        if (!val.match(/\S+/g)) {
                            lastUl.remove();
                            isLast = true;
                            makeList(data);
                            return;
                        }
                        var len = data.length,
                            keys = val.split(/\s+/),
                            isMatched = false,
                            dts = [];

                        for (var i = 0; i < len; i++) {
                            isMatched = true;
                            for (var j = 0; j < keys.length; j++) {
                                if (data[i].name.search(keys[j]) === -1) {
                                    isMatched = false;
                                }
                            }
                            if (isMatched) {
                                dts.push(data[i]);
                            }
                        }
                        if (dts.length !== 0) {
                            if (isLast) {
                                panel.find('.eara-list').last().remove();
                            }
                            isLast = true;
                            makeList(dts);
                        } else {
                            if (keys.length !== 0) {
                                lastUl.remove();
                                isLast = false;
                            } else {
                                lastUl.remove();
                                isLast = true;
                                makeList(data);
                            }
                        }
                    }, 200);
                });

                var uls = panel.find('.eara-list');
                var links = route.find('a');
                var w1 = 0,
                    w2 = 0;
                for (var i = 0; i < uls.length; i++) {
                    w1 += uls.eq(i).width();
                }
                for (var i = 0; i < links.length; i++) {
                    w2 += links.eq(i).width();
                }
                if (w1 > panel.width()) {
                    panel.animate({
                        "scrollLeft": w1 - panel.width() + 25
                    }, 300);
                }
                panel.animate({
                    "scrollTop": 0
                }, 300);
                if (w2 > panel.width()) {
                    route.animate({
                        "scrollLeft": w2 - panel.width() + 50
                    }, 300);
                }
                panel.animate({
                    "scrollTop": 0
                }, 300);
            });

            access_level++;
        }

        var mask = $('<div class="mask"></div>'),
            container = $('#dialog-container'),
            doIt = function() {};

        // 执行操作
        $rootScope.do = function() {
            doIt();
        };

        // 模态框退出
        $rootScope.cancel = function() {
            mask.remove();
            container.addClass('none');
        };

        // 返回
        $scope.goBack = function() {
            window.history.back();
        };

        $scope.selectDepts = function() {
            var header = $('<div class="list-header"></div>'),
                route = $('<div id="list_route"></div>'),
                search = $('<div class="data-search hide"><div><input id="search_input" type="text"/><i class="fa icon-magnifier"></i></div></div>'),
                panel = $('<div id="eara_panel"></div>'),
                dialog = $('#dialog');

            dialog.attr('class', 'col-lg-offset-4 col-lg-4 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 m-dialog animating fade-in-down');
            header.append(route);
            header.append(search);
            access_level = 0;
            container.find('button[type=submit]').addClass('disabled');
            mask.insertBefore(container);
            container.find('.form-content').addClass('def-border').html('').append(header).append(panel);

            var param = {
                url: app.url.admin.check.getDepts,
                data: {
                    access_token: app.url.access_token
                },
                method: 'POST',
                key: 'id'
            };

            initList(param);
            container.removeClass('none');

            doIt = function() {
                if (access_level === 3 || access_level === 2) {
                    $scope.deptId = target.data('id');
                    $scope.department = target.data('name');
                }
                access_level = 0;
                mask.remove();
                container.addClass('none');
            };
        };

        ////////////////////////////////////////////////////////////

        $scope.formData = {};

        // 获取职称数据
        (function() {
            $http.post(app.url.admin.check.getTitles, {
                access_token: app.url.access_token
            }).then(function(resp) {
                var dt = resp.data.data;
                if (dt.length > 0) {
                    initChosen(dt);
                } else {
                    $scope.authError = '数据有误！';
                }
            }, function(x) {
                $scope.authError = '服务器错误！';
            });
        })();

        // 下拉框 chosen
        function initChosen(dt) {
            var select = $('#doctor_title');
            var len = dt.length;
            var tmp = $('<select></select>');
            var isExist = false;
            var opt;
            for (var i = 0; i < len; i++) {
                opt = $('<option>' + dt[i]['name'] + '</option>');
                tmp.append(opt);
            }
            if (!isExist && $scope.title) {
                opt = $('<option>' + $scope.title + '</option>');
                tmp.prepend(opt);
            } else if (!isExist) {
                opt = $('<option value="0">请选择职称</option>');
                tmp.prepend(opt);
            }
            select.html(tmp.html());
            select.on('change', function(e) {
                if ($(this).val() != 0) {
                    $scope.formData['title'] = $(this).val();
                } else {
                    $scope.formData['title'] = null;
                    $scope.FillInfoForm.$invalid = true;
                    $scope.$apply();
                }
            });
        }

        ////////////////////////////////////////////////////////////

        function clearData() {
            $rootScope.reuseDcotorData = {
                name: $scope.hospital.selected.name,
                id: $scope.hospital.selected.id,
                deptId: $scope.deptId,
                department: $scope.department,
                title: $scope.title
            };
            $state.reload();
            $scope.$apply();
        }

        // 提交资料
        $scope.submitInfo = function() {

            // 创建无集团的医生账号
            var params = {
                access_token: app.url.access_token,
                name: $scope.userName,
                telephone: $scope.telephone,
                'doctor.departments': $scope.department,
                'doctor.deptId': $scope.deptId,
                'doctor.hospital': $scope.hospital.selected.name,
                'doctor.hospitalId': $scope.hospital.selected.id,
                'doctor.title': $scope.title,
                headPicFileName: $scope.usrPicUrl,
                platform: 2,
                joinGroup: false
            };

            // 创建有集团的医生账号
            if ($scope.groupId != 'no' && $scope.groupName != 'no') {
                params.groupId = $scope.groupId;
                params.joinGroup = true;
            }

            $http({
                url: app.url.user.registerByAdmin,
                method: 'post',
                data: params
            }).then(function(resp) {
                $scope.do_or_not = function() {
                    $scope.willSendMsg = !$scope.willSendMsg;
                }
                if (resp.data.resultCode === 1) {
                    if (resp.data.data.status === 0) {

                        var div = $('<div></div>');
                        var str = '<p class="text-success">新建成功！</p><br/><p class="text-normal">用户可以使用手机号登录app，<br/>密码默认为空，通过“找回密码”重置登录密码。<br/><br/><label class="checkbox i-checks">' +
                            '<input type="checkbox" name="do_or_not" ng-init="willSendMsg=true" ng-click="do_or_not()" checked><i></i>发送短信通知用户</label></p>';

                        div.html(str);

                        modal.prompt(null, div, function() {
                            // 发送通知短信
                            if ($scope.willSendMsg) {
                                $http({
                                    url: app.url.msg.registerByGroupNotify,
                                    method: 'post',
                                    data: {
                                        access_token: app.url.access_token,
                                        phone: $scope.telephone
                                    }
                                }).then(function(resp) {
                                    if (resp.data.resultCode === 1) {
                                        modal.toast.success('通知短信发送成功！');
                                    } else {
                                        modal.toast.error('通知短信发送失败！');
                                    }
                                });
                            }
                            clearData();
                        });

                        $compile(div.contents())($scope);

                    } else if (resp.data.data.status === 2) {

                        // 创建有集团的医生账号
                        if (params.joinGroup) {

                            modal.confirm(null, '该手机号已注册，是否发送短信邀请医生加入集团？', function() {
                                // 发送邀请短信
                                $http({
                                    url: app.url.msg.saveBatchInvite,
                                    method: 'post',
                                    data: {
                                        access_token: app.url.access_token,
                                        groupId: $scope.groupId,
                                        telepNumsOrdocNums: $scope.telephone,
                                        ignore: true
                                    }
                                }).then(function(resp) {
                                    if (resp.data.resultCode === 1) {
                                        modal.toast.success('邀请短信发送成功！');
                                    } else {
                                        modal.toast.error('邀请短信发送失败！');
                                    }
                                    clearData();
                                });
                            }, function() {
                                clearData();
                            }, { OK: '是，发送', CANCEL: '不，谢谢' });

                        }
                        // 创建无集团的医生账号
                        else {
                            modal.prompt(null, '该手机号已注册过，请重新输入新的手机号码', function() {
                                clearData();
                            });
                        }

                    } else if (resp.data.data.status === 3) {
                        modal.prompt(null, '该医生已在集团内，不需要再次邀请。', function() {
                            clearData();
                        });
                    }
                } else {
                    //$scope.authError = resp.data.resultMsg;
                    modal.toast.error(resp.data.resultMsg);
                }
            }, function(resp) {
                //$scope.authError = resp.data.resultMsg;
                modal.toast.error(resp.data.resultMsg);
            });
        };

        ////////////////////////////////////////////////////////////

        var curFile, progress, imgURL;
        $scope.selectFile = function(model) {
            $scope.upload();
            progress = model + 'Progress';
            imgURL = model + 'Url';
        };
        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;

        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadBoxOpen = true;
        };
        // 文件上传进度
        $scope.progress = function(up, file) {
            $scope[progress] = file.percent;
        };

        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            if (file.url) {
                $scope[imgURL] = file.url;
                $scope.$apply();
            }

            file.result = '上传成功！';
            modal.toast.success('上传成功！');
        };

        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            modal.toast.error('error', null, errTip);
        };
    }]);

    app.controller('AddHospitalCtrl', ['$http', '$modalInstance', '$scope', 'toaster', 'item',function($http, $modalInstance, $scope, toaster, item) {

        // 获取医院级别
        $http.post(app.url.hospital.getHospitalLevel, {
            access_token: app.url.access_token
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                if (rpn.data) {
                    $scope.levels = rpn.data;
                }
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        $scope.levels = [{ id: '', level: '' }];

        // 添加医院
        $scope.addHospital = function(provinceId, cityId, countryId, name, level) {
            $http.post(app.url.admin.check.addHospital, {
                access_token: app.url.access_token,
                provinceId: provinceId,
                cityId: cityId,
                countryId: countryId,
                name: name,
                level: level
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {
                    toaster.pop('success', null, '添加成功');
                    $modalInstance.close(rpn.data);
                    item.selected = {};
                    item.selected.id = rpn.data.id;
                    item.selected.name = rpn.data.name;
                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };

        // 获取省,市,区
        $scope.getArea = (function getArea(area_id, area_scope) {

            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: area_id
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    // 初始化市,区
                    if (!area_scope && !area_id) {
                        $scope.provinces = rpn.data;
                        $scope.citys = null;
                        $scope.regions = null;
                    } else {
                        $scope[area_scope] = rpn.data;
                    }

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });

            return getArea;
        })();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
