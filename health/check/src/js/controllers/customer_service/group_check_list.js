'use strict';
(function () {
    app.controller('GroupCheckList', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal',function ($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal) {
        var url = app.url.admin.check.groupApplyList, // 后台API路径
            data = null,
            status = 'A',
            table_id = "list_unCheck",
            type = $stateParams.type,
            page = $stateParams.page.split('_')[1],
            keyword = $stateParams.page.split('_')[2] || '',
            showMember = false;

        $scope.tabs = {};
        $scope.tabs.active = [false, false, false];

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
                keyword = ' ';
            }
            visit('un_check', page, keyword);
        };
        $scope.tabs.passed = function(){
            table_id = "list_passed";
            status = 'P';
            if('pass' !== type){
                keyword = ' ';
            }
            visit('pass', page, keyword);
        };
        $scope.tabs.noPass = function(){
            table_id = "list_noPass";
            status = 'NP';
            if('no_pass' !== type){
                keyword = ' ';
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
        $scope.seeDetails = function (id,groupId) {
            //$rootScope.scrollTop = body.scrollTop() || html.scrollTop();
            if (id) {
                $rootScope.details = {};
                $rootScope.details.id = id;
                $rootScope.details.groupId=groupId;
                if(type){
                    switch (type){
                        case 'un_check':
                            $state.go('app.check.group.check_view', {id: id});
                            break;
                        case 'pass':
                            if(showMember){
                                $state.go('app.check.group.details_view', {id: id + '/member',groupId:groupId});
                            }else{
                                $state.go('app.check.group.details_view', {id: id,groupId:groupId});
                            }
                            break;
                        case 'no_pass':
                            $state.go('app.check.group.details_view', {id: id});
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
            $state.go('app.check.group.check_list', params);
        }

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var groupList, dTable, keyWord, setTable, ipt,
            isSearching = false;

        function initTable() {
            var subs = [],
                name,
                _index,
                _start,
                isSearch = false,
                searchTimes = 0,
                //index = utils.localData('page_index') * 1 || 1,
                //start = utils.localData('page_start') * 1 || 0,
                index = page * 1 || 1,
                length = utils.localData('page_length') * 1 || 50,
                start = (index - 1) * length || 0,
                params = {
                    keyword: keyword,
                };

            setTable = function () {
                groupList = $('#' + table_id);
                dTable = groupList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        params.access_token = app.url.access_token;
                        params.status = status;
                        params.pageIndex = index - 1;
                        params.pageSize = aoData[4]['value'];
                        $http({
                            "method": "post",
                            "url": sSource,
                            "data": params
                        }).then(function (resp) {
                            var _dt = resp.data.data;
                            //index = aoData[0]['value'];
                            if(_dt && _dt.pageData) {
                                utils.extendHash(_dt.pageData[0], ["groupName", "applyDoctorName", "telephone", "hospitalName", "level", "applyDate", "auditDate", "skip", "memberNum", "groupActive"]);
                                resp.start = _dt.start;
                                resp.recordsTotal = _dt.total;
                                resp.recordsFiltered = _dt.total;
                                resp.length = _dt.pageSize;
                                resp.data = _dt.pageData;
                                fnCallback(resp);

                                if (type === 'un_check') {
                                    $rootScope.isChecking = true;
                                    utils.localData('isChecking', 'true');

                                    // 更新界面中的数据
                                    $('#group_check').html(resp.recordsTotal);
                                    utils.localData('group_check', resp.recordsTotal);
                                }else if (type === 'pass') {
                                    $rootScope.isChecking = false;
                                    utils.localData('isChecking', null);
                                    $rootScope.isPassed = true;
                                    utils.localData('isPassed', true);
                                }else{
                                    $rootScope.isChecking = false;
                                    utils.localData('isChecking', null);
                                    $rootScope.isPassed = false;
                                    utils.localData('isPassed', null);
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
                        $(nRow).click(aData, function(param, e){
                            $rootScope.groupInfo = {
                                groupId: aData.groupId,
                                name: aData.name,
                                introduction: aData.introduction,
                                logo: aData.groupIconPath,
                                skill: aData.diseaseName
                            };
                            /*if(aData.groupId){
                             utils.localData('curId', aData.groupId);
                             $scope.seeDetails(aData.groupId);
                             }else{
                             utils.localData('curId', aData.groupApplyId);
                             $scope.seeDetails(aData.groupApplyId);
                             }*/
                            utils.localData('curId', aData.groupApplyId);
                            $scope.seeDetails(aData.groupApplyId,aData.groupId);
                        });

                        $(nRow).find('.member').click(aData, function(param, e){
                            showMember = true;
                        });
                    },
                    "columns": type === 'un_check' ? [{
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.logoUrl) {
                                var path = dt.logoUrl;
                            } else {
                                var path = 'src/img/logoDefault.jpg';
                            }
                            return '<a class="group-info"><img src="' + path  + '"/></a>';
                        }
                    }, {
                        "data": "groupName",
                        "orderable": false
                    }, {
                        "data": "applyDoctorName",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.title && dt.title) {
                                str += '<br/><span>' + dt.title + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "hospitalName",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.level) {
                                str += '<br/><span>' + dt.level + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "applyDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
                            }
                        }
                    }] : type === 'pass' ? [{
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.logoUrl) {
                                var path = dt.logoUrl;
                            } else {
                                var path = 'src/img/logoDefault.jpg';
                            }
                            return '<a class="group-info"><img src="' + path + '"/></a>';
                        }
                    }, {
                        "data": "groupName",
                        "orderable": false
                    }, {
                        "data": "applyDoctorName",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.title && dt.title) {
                                str += '<br/><span>' + dt.title + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "hospitalName",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.level) {
                                str += '<br/><span>' + dt.level + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "memberNum",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<a class="text-info member" href>' + set + '</a>';
                        }
                    }, {
                        "data": "groupActive",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return set === 'inactive' ? '未激活' : '已激活';
                        }
                    }, {
                        "data": "skip",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return set === 'N' ? '正常' : '已屏蔽';
                        }
                    }, {
                        "data": "auditDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
                            }
                        }
                    }] : [{
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.logoUrl) {
                                var path = dt.logoUrl;
                            } else {
                                var path = 'src/img/logoDefault.jpg';
                            }
                            return '<a class="group-info"><img src="' + path + '"/></a>';
                        }
                    }, {
                        "data": "groupName",
                        "orderable": false
                    }, {
                        "data": "applyDoctorName",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.title && dt.title) {
                                str += '<br/><span>' + dt.title + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "hospitalName",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            var str = '';
                            if (set) {
                                str += '<span>' + set + '</span>';
                            }
                            if (dt.level) {
                                str += '<br/><span>' + dt.level + '</span>';
                            }
                            return str;
                        }
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "applyDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
                            }
                        }
                    }, {
                        "data": "auditDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日，hh点mm分');
                            }else{
                                return '';
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

                /////////////////////////////////////////////////////////////////////

                if(type === 'pass') {
                    var label_a = $('<label class="m-l-lg">集团状态</label>');
                    var label_b = $('<label class="mrl-15">屏蔽状态</label>');
                    var selectEleA = $('<select class="form-control input-sm mrl-10"><option value="">全部</option><option value="active">已激活</option><option value="inactive">未激活</option></select>');
                    var selectEleB = $('<select class="form-control input-sm mrl-10"><option value="">全部</option><option value="N">正常</option><option value="S">已屏蔽</option></select>');

                    wrapper.parent().prev().children().first().append(label_a).append(selectEleA).append(label_b).append(selectEleB);

                    selectEleA.val(params.groupActive);
                    selectEleB.val(params.skip);

                    selectEleA.change(function(){
                        params.groupActive = selectEleA.val();
                        dTable.fnDestroy();
                        setTable();
                    });

                    selectEleB.change(function(){
                        params.skip = selectEleB.val();
                        dTable.fnDestroy();
                        setTable();
                    });
                }

                /////////////////////////////////////////////////////////////////////

                var _form = $('<form></form>'),
                    _lbl = wrapper.addClass('group-search').children('label').append(_i),
                    _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                    _ipt = _lbl.find('input').attr('placeholder', '按医生集团名称 / 负责人姓名 / 联系电话搜索').attr('autocomplete', 'off'),
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
                                //keyword = null;
                                params.keyword = null;
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
                    //keyword = null;
                    params.keyword = null;
                    setTable();
                });

                _ipt.val(keyWord).trigger('focus');

                function submit() {
                    $scope.searching = true;
                    //keyword = keyWord;
                    params.keyword = keyWord;
                    dTable.fnDestroy();
                    setTable();
                }

                utils.keyHandler(_ipt, {
                    'key13': submit
                });

                dTable.off().on('draw.dt', function(e, settings, len) {

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
                        index = Math.floor(settings._iDisplayStart / length) + 1;
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
    }]);
})();
