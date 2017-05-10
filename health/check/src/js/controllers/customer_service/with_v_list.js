'use strict';
(function () {
    app.controller('GroupWithVCheck', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal',function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
        var url = app.url.admin.check.getGroupCerts, // 后台API路径
            data = null,
            status = 'A',
            table_id = "list_unCheck",
            type = $stateParams.type,
            page = $stateParams.page.split('_')[1],
            keyword = $stateParams.page.split('_')[2] || '';

        $scope.tabs = {};
        $scope.tabs.active = [false, false, false];

        utils.localData('isEditing', null);

        function setActive(idx){
            for(var i=0; i<$scope.tabs.active.length; i++){
                if(i === idx){
                    $scope.tabs.active[i] = true;
                }else{
                    $scope.tabs.active[i] = false;
                }
            }
        }

        if(type){
            switch (type){
                case 'un_check':
                    setActive(0);
                    table_id = "list_unCheck";
                    break;
                case 'pass':
                    setActive(1);
                    table_id = "list_passed";
                    break;
                case 'no_pass':
                    setActive(2);
                    table_id = "list_noPass";
                    break;
                default:break;
            }
        }

        $scope.tabs.unCheck = function(){
            table_id = "list_unCheck";
            status = 'A';
            if('un_check' !== type){
                keyword = '';
            }
            visit('un_check', page, keyword);
        };
        $scope.tabs.passed = function(){
            table_id = "list_passed";
            status = 'P';
            if('pass' !== type){
                keyword = '';
            }
            visit('pass', page, keyword);
        };
        $scope.tabs.noPass = function(){
            table_id = "list_noPass";
            status = 'NP';
            if('no_pass' !== type){
                keyword = '';
            }
            visit('no_pass', page, keyword);
        };

        if ($rootScope.pageName !== 'list_undone') {
            utils.localData('page_index', null);
            utils.localData('page_start', null);
            $rootScope.pageName = 'list_undone';
            $rootScope.scrollTop = 0;
        }

        // 编辑某一审核信息
        $scope.seeDetails = function (id) {
            if (id) {
                $rootScope.details = {};
                $rootScope.details.id = id;
                if(type){
                    switch (type){
                        case 'un_check':
                            $scope.isCheckingV = true;
                            utils.localData('isCheckingV', true);
                            $state.go('app.check.group.with_v_check_view', {id: id});
                            break;
                        case 'pass':
                            $scope.isCheckingV = false;
                            utils.localData('isCheckingV', false);
                            $state.go('app.check.group.with_v_details_view', {id: id});
                            break;
                        case 'no_pass':
                            $scope.isCheckingV = false;
                            utils.localData('isCheckingV', false);
                            $state.go('app.check.group.with_v_details_view', {id: id});
                            break;
                        default:break;
                    }
                }
            }
        };

        function visit(type, page, keyword){
            var params = {
                type: type
            };
            if(keyword || keyword == '0'){
                params.page = 'page_' + page + '_' + keyword;
            }else{
                params.page = 'page_' + page;
            }
            $state.go('app.check.group.with_v_list', params);
        }

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var with_v_list, dTable, keyWord, setTable, ipt,
            isSearching = false;

        function initTable() {
            var subs = [],
                name,
                _index,
                _start,
                searchTimes = 0,
                //index = utils.localData('page_index') * 1 || 1,
                //start = utils.localData('page_start') * 1 || 0,
                index = page * 1 || 1,
                length = utils.localData('page_length') * 1 || 50,
                start = (index - 1) * length || 0;

            setTable = function () {
                with_v_list = $('#' + table_id);
                dTable = with_v_list.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $http({
                            method: 'post',
                            "url": sSource,
                            "data": {
                                //aoData: JSON.stringify(aoData),
                                status: status,
                                keyword: keyword,
                                pageIndex: index - 1,
                                pageSize: aoData[4]['value'],
                                access_token: app.url.access_token
                            }
                        }).then(function (resp) {
                            var _dt = resp.data.data;
                            //index = aoData[0]['value'];
                            if(_dt && _dt.pageData) {
                                for (var i = 0; i < _dt.pageData.length; i++) {
                                    utils.extendHash(_dt.pageData[i], ["name", "telephone", "remark", "groupCert", "processVTime", "otherGroupCount"]);
                                    utils.extendHash(_dt.pageData[i].groupCert, ["companyName", "createTime"]);
                                }
                                resp.start = _dt.start;
                                resp.recordsTotal = _dt.total;
                                resp.recordsFiltered = _dt.total;
                                resp.length = _dt.pageSize;
                                resp.data = _dt.pageData;
                                fnCallback(resp);

                                // 更新界面中的数据
                                if(type === 'un_check'){
                                    $('#group_check_with_v').html(resp.recordsTotal);
                                    utils.localData('group_check_with_v', resp.recordsTotal);
                                }
                            }else{
                                modal.toast.warn(resp.data.resultMsg);
                            }

                        });
                    },
                    "processing": true,
                    //"searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        if($stateParams.type !== 'uncheck'){
                            setTimeout(function(){
                                var _txtAr = $(nRow).find('.remark-edit .fa').prev();
                                _txtAr.css('height', _txtAr[0].scrollHeight + 2);
                            }, 100);
                        }else{
                            $('#identify_remark').css('display', 'none');
                            $(nRow).find('.remark-edit').parent().remove();
                        }
                        $(nRow).click(aData, function(param, e){
                            var evt = e || window.event;
                            var target = evt.target || evt.srcElement;
                            if(target.nodeName.toLowerCase() === 'textarea'){
                                return;
                            }
                            $rootScope.groupInfo = {
                                groupId: aData.id,
                                name: aData.name,
                                introduction: aData.introduction,
                                logo: aData.groupIconPath,
                                skill: aData.diseaseName
                            };
                            utils.localData('curGroupId', aData.id);
                            $scope.seeDetails(param.data.id);
                        });
                        $(nRow).find('.other-group').click(aData, function(param, e){
                            $state.go('app.group_check_list', {type: param.data.id}, {});
                        });
                        // 备注编辑
                        function edit(e){
                            var evt = e || window.event,
                                that = $(this);
                            evt.stopPropagation();

                            if(that.hasClass('fa-pencil')){
                                var txtAr = that.prev(),
                                    txt = txtAr.val(),
                                    timer = 0;

                                txtAr.attr('disabled', false);
                                txtAr.trigger('focus').trigger('select').blur(function(){
                                    var thiz = $(this);
                                    clearInterval(timer);
                                    setTimeout(function(){
                                        thiz.attr('disabled', true);
                                        that.off();
                                        that.bind('click', e.data, edit);
                                        that.addClass('fa-pencil').removeClass('fa-check');
                                    }, 300);
                                });

                                // 检测是否被编辑
                                timer = setInterval(function(){
                                    if(txt != txtAr.val()){
                                        txtAr.css('height', txtAr[0].scrollHeight + 2);
                                        that.addClass('fa-check').removeClass('fa-pencil');
                                        that.off();

                                        // 点击按钮后才会提交修改
                                        that.click(function(){
                                            clearInterval(timer);
                                            $http({
                                                "method": "post",
                                                "url": app.url.admin.check.updateRemarks,
                                                "data": {
                                                    access_token: app.url.access_token,
                                                    groupId: e.data.id,
                                                    remarks: txtAr.val()
                                                }
                                            }).then(function (resp) {
                                                var _dt = resp.data;
                                                if(_dt.resultCode == '1'){
                                                    that.off();
                                                    that.bind('click', e.data, edit);
                                                    that.addClass('fa-pencil').removeClass('fa-check');
                                                    modal.toast.success('修改成功！');
                                                }
                                            });
                                        });
                                    }else{
                                        that.addClass('fa-pencil').removeClass('fa-check');
                                    }
                                },200);
                            }
                        }

                        $(nRow).find('.remark-edit .fa').bind('click', aData, edit);
                    },
                    "columns": [{
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupIconPath) {
                                var path = dt.groupIconPath;
                            } else {
                                var path = 'src/img/logoDefault.jpg';
                            }
                            return '<a class="group-info"><img src="' + path + '"/></a>';
                        }
                    }, {
                        "data": "name",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.name) {
                                str += '<a class="group-info text-info">' + dt.name + '</a>';
                            }
                            return str;
                        }
                    }, {
                        "data": "groupCert.companyName",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.groupCert && dt.groupCert.companyName) {
                                str += '<span class="text-primary">' + dt.groupCert.companyName + '</span>';
                            }
                            if (dt.groupCert && dt.groupCert.orgCode) {
                                str += '<br/>组织代码：<span>' + dt.groupCert.orgCode + '</span>';
                            }
                            if (dt.otherGroupCount) {
                                str += '<br/>其他认证医生集团： <a class="other-group text-info" href>' + dt.otherGroupCount + '</a> 个';
                            }
                            return str;
                        }
                    }, {
                        "data": "creator",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (dt.groupCert && dt.groupCert.adminName) {
                                str += '<span>' + dt.groupCert.adminName + '</span>';
                            }
                            if (dt.groupCert && dt.groupCert.adminTel) {
                                str += '<br/><span>' + dt.groupCert.adminTel + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "groupCert.createTime",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && dt.groupCert.createTime) {
                                return utils.dateFormat(dt.groupCert.createTime, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
                            }
                        }
                    }, {
                        "data": "processVTime",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set && set.length !== 0) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
                            }
                        }
                    }, {
                        "data": "groupCert.remarks",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (dt.groupCert && dt.groupCert.createTime.length !== 0 && (dt.groupCert.remarks || dt.groupCert.remarks == '0')) {
                                return '<div class="remark-edit"><textarea class="check-remarks" disabled>' + dt.groupCert.remarks + '</textarea><i class="fa fa-pencil"></i></div>';
                            }else{
                                return '<div class="remark-edit"><textarea class="check-remarks" disabled></textarea><i class="fa fa-pencil"></i></div>';
                            }
                        }
                    }]
                });

                switch (type){
                    case 'un_check':
                        var wrapper = $('#list_unCheck_filter');
                        break;
                    case 'pass':
                        var wrapper = $('#list_passed_filter');
                        break;
                    case 'no_pass':
                        var wrapper = $('#list_noPass_filter');
                        break;
                    case 'un_auth':
                        var wrapper = $('#list_unAuth_filter');
                        break;
                    default:break;
                }

                var _form = $('<form></form>'),
                    _lbl = wrapper.addClass('group-search').children('label').append(_i),
                    _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                    _ipt = _lbl.find('input').attr('placeholder', '搜索...').attr('autocomplete', 'off'),
                    _timer = 0,
                    _temp = '';

                wrapper.append(_form);
                _form.append(_lbl);
                _lbl.html('').append(_ipt).append(_i);
                _ipt.focus(function() {
                    _timer = setInterval(function() {
                        var val = $.trim(_ipt.val());
                        if (val) {
                            isSearching = true;
                            _i.removeClass('icon-magnifier').addClass('fa-times-circle');
                            keyWord = _temp = val;
                        } else {
                            isSearching = false;
                            _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                            if (_temp && !val) {
                                $scope.searching = false;
                                keyWord = _temp = '';
                                start = length * (index - 1);
                                keyword = null;
                                dTable.fnDestroy();
                                setTable();
                            }
                        }
                    }, 100);
                });
                _ipt.blur(function() {
                    clearInterval(_timer);
                });
                _i.click(function() {
                    isSearching = false;
                    keyWord = _temp = '';
                    _ipt.trigger('submit');
                    _ipt.val('');
                    _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                    start = length * (index - 1);
                    dTable.fnDestroy();
                    keyword = null;
                    setTable();
                });

                _ipt.val(keyWord).trigger('focus');

                function submit() {
                    $scope.searching = true;
                    keyword = keyWord;
                    dTable.fnDestroy();
                    setTable();
                }

                utils.keyHandler(_ipt, {
                    'key13': submit
                });

                dTable.off().on('draw.dt', function(e, settings) {

                }).on('length.dt', function(e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                    utils.localData('page_length', len);
                }).on('page.dt', function(e, settings) {
                    subs = [];
                    if (!isSearching) {
                        index = Math.floor(settings._iDisplayStart) / length + 1;
                    }
                }).on('search.dt', function(e, settings) {
                    if (isSearching) {
                        index = 1;
                        start = 0;
                    } else {
                        if (searchTimes > 0) {
                            searchTimes = 0;
                            index = _index;
                            start = _start;
                            dTable.fnDestroy();
                            setTable();
                        }
                    }
                });
            };

            setTable();
        }

        var timer = setInterval(function(){
            if(!dTable){
                clearInterval(timer);
                initTable();
            }
        }, 100);

        //initTable();
    }]);
})();
