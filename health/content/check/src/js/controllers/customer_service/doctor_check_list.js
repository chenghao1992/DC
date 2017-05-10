'use strict';
(function () {
    app.controller('CheckList', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', 'modal', 'ModelDialogFactory',function($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, modal, ModelDialogFactory) {

        var url = app.url.admin.check.getDoctors, // 后台API路径
            data = null,
            status = 2,
            table_id = "list_unCheck",
            type = $stateParams.type,
            page = $stateParams.page.split('_')[1],
            keyword = $stateParams.page.split('_')[2] || '',

            isone=$stateParams.isone; //取消双向绑定重复值
        $scope.isone=isone;
        console.log(page+'33333333')
            // page=$rootScope.details.page.split('_')[1],
            // keyword=$rootScope.details.page.split('_')[2];


        $scope.tabs = {};

        $scope.tabs.active = [false, false, false, false];

        function setActive(idx) {
            for (var i = 0; i < $scope.tabs.active.length; i++) {
                if (i === idx) {
                    $scope.tabs.active[i] = true;
                } else {
                    $scope.tabs.active[i] = false;
                }
            }
        }

        if (type) {
            switch (type) {
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
                case 'un_auth':
                    setActive(3);
                    table_id = "list_unAuth";
                    break;
                default:
                    break;
            }
        }

        $scope.tabs.unCheck = function() {
            table_id = "list_unCheck";
            status = 2;
            if ('un_check' !== type) {
                keyword = '';
                page=1;
            }
            if($scope.isone=='true'){
                $scope.isone=false;
                return ;
            }
            visit('un_check', page, keyword);
        };
        $scope.tabs.passed = function() {
            table_id = "list_passed";
            status = 1;
            if ('pass' !== type) {
                keyword = '';
                page=1;
            }
            if($scope.isone=='true')  {
                $scope.isone=false;
                return ;
            };
            visit('pass', page, keyword);
        };
        $scope.tabs.noPass = function() {
            table_id = "list_noPass";
            status = 3;
            if ('no_pass' !== type) {
                keyword = '';
                page=1;
            };
            if($scope.isone=='true')  {
                $scope.isone=false;
                return ;
            };
            visit('no_pass', page, keyword);
        };
        $scope.tabs.unAuth = function() {
            table_id = "list_unAuth";
            status = 7;
            if ('un_auth' !== type) {
                keyword = '';
                page=1;
            };
            if($scope.isone=='true')  {
                $scope.isone=false;
                return ;
            };
            visit('un_auth', page, keyword);
        };

        if ($rootScope.pageName !== 'list_undone') {
            utils.localData('page_index', null);
            utils.localData('page_start', null);
            //utils.localData('page_length', null);
            $rootScope.pageName = 'list_undone';
            $rootScope.scrollTop = 0;
        }

        // 编辑某一审核信息
        $scope.seeDetails = function(id,index) {
            //$rootScope.scrollTop = body.scrollTop() || html.scrollTop();
            if (id) {
                $rootScope.details = {};
                $rootScope.details.id = id;
                var params={
                    type:type
                };
                params.page = 'page_' + index + '_' + $scope.keyName;
                if (type) {
                    switch (type) {
                        case 'un_check':
                            $state.go('app.check_view',params);
                            break;
                        case 'pass':
                            $state.go('app.check_pass_view',params);
                            break;
                        case 'no_pass':
                            $state.go('app.check_nopass_view',params);
                            break;
                        case 'un_auth':
                            $state.go('app.check_nocheck_view',params);
                            break;
                        default:
                            break;
                    }
                    //$scope.$apply();
                }
            }
        };



        function visit(type, page, keyword) {
            var params = {
                type: type
            };
            if (keyword || keyword == '0') {
                params.page = 'page_' + page + '_' + keyword;
            } else {
                params.page = 'page_' + page;
            }
            $state.go('app.check.doctor.check_list', params);
        }
        $scope.createDoctorAccount = function() {

            var cnt = $('<div class="form-group clear" style="width: 520px; margin-bottom: 0"></div>'),
                label = $('<label class="control-label col-md-2 text-normal">所属集团</label>'),
                div = $('<div class="col-md-10"><i class="ipt-arr fa fa-sort-desc"></i></div>'),
                ipt = $('<input class="form-control" autocomplete="off" placeholder="请输入集团名称"/>');

            cnt.append(label).append(div);
            div.append(ipt);

            utils.searchSuggest(ipt, { name: 'name', id: 'id' }, function(keyword, fun) {
                var size = keyword ? 10000 : 50;
                $http({
                    "method": "post",
                    "url": app.url.yiliao.searchGroup,
                    "data": {
                        access_token: app.url.access_token,
                        applyStatus: 'P',
                        keyword: keyword,
                        pageIndex: 0,
                        pageSize: size
                    }
                }).then(function(resp) {
                    var _dt = resp.data.data;
                    if (_dt && _dt.pageData) {
                        fun.call(null, _dt.pageData);
                    } else {
                        fun.call(null, null);
                    }
                });

                /*if(!/\S/g.test(keyword)){
                 ok_btn.attr('disabled', true);
                 }*/

                if (!$scope.groupId) {
                    ok_btn.attr('disabled', true);
                }

                $scope.groupId = null;
                //ok_btn.attr('disabled', true);
            }, function(dt) {
                $scope.groupId = dt.id;
                $scope.groupName = dt.name;
                if (dt.id && dt.name) {
                    ok_btn.attr('disabled', false);
                }

                //console.log(dt.id);
                //console.log(dt.name);
            });

            // modal.confirm('选择集团', cnt, function() {
            //     $rootScope.reuseDcotorData = null;
            //     if ($scope.groupId && $scope.groupName) {
            //         $state.go('app.check.create_doctor_account', { id: $scope.groupId, name: $scope.groupName });
            //     } else {
            //         modal.toast.warn('请选择一个集团！');
            //     }
            // });

            // 调用弹窗
            ModelDialogFactory.open({
                UIselect: {
                    selectedGroup: null,
                    groups: [],
                    getGroup: function(keyword, _scope) {

                        $http({
                            "method": "post",
                            "url": app.url.yiliao.searchGroup,
                            "data": {
                                access_token: app.url.access_token,
                                applyStatus: 'P',
                                keyword: keyword,
                                pageIndex: 0,
                                pageSize: 20
                            }
                        }).then(function(resp) {
                            var data = resp.data.data;
                            _scope.$Dialog.UIselect.groups = data.pageData;
                        });

                    },
                    funSelect: function($Dialog, $item) {
                        if ($item) {
                            $Dialog.buttons[1].disabled = false;
                        } else {
                            $Dialog.buttons[1].disabled = true;
                        }
                    }
                },
                template: '\
                <div class="w-full">\
                    <div class="form-group clearfix">\
                        <label class="col-xs-3 control-label m-b-none text-right">\
                            所属集团\
                        </label>\
                        <div class="col-xs-7">\
                            <ui-select ng-model="$Dialog.UIselect.selectedGroup" theme="bootstrap" on-select="$Dialog.UIselect.funSelect($Dialog,$item)">\
                                <ui-select-match placeholder="请输入集团名称搜索...">{{$select.selected.name}}</ui-select-match>\
                                <ui-select-choices repeat="group in $Dialog.UIselect.groups" refresh="$Dialog.UIselect.getGroup($select.search,this.$parent)">\
                                    <div ng-if="group.name">\
                                        {{group.name}}\
                                    </div>\
                                </ui-select-choices>\
                            </ui-select>\
                        </div>\
                    </div>\
                </div>\
            ',
                title: '选择集团',
                callback: function(button) {

                    if (button.type === 2 || (!this.$Dialog.UIselect.selectedGroup && button.type != 0)) return;


                    if (button.type == 1) {
                        var params = {
                            id: this.$Dialog.UIselect.selectedGroup.id,
                            name: this.$Dialog.UIselect.selectedGroup.name
                        };
                    } else {
                        var params = {
                            id: 'no',
                            name: 'no'
                        };
                    }

                    $state.go('app.check.create_doctor_account', params);

                },
                buttons: [{
                    type: 0,
                    class: 'btn-danger col-xs-3',
                    label: '创建无集团医生',
                }, {
                    type: 1,
                    class: 'btn-success col-xs-3 col-xs-offset-1',
                    label: '确定',
                    disabled: true
                }, {
                    type: 2,
                    class: 'col-xs-3 col-xs-offset-1',
                    label: '取消'
                }]
            })


            var ok_btn = cnt.parent().parent().next().find('button').first().attr('disabled', true);

        };

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var doctorList, dTable, keyWord, setTable, ipt,
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

            setTable = function() {
                doctorList = $('#' + table_id);
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        $http({
                            method: 'post',
                            "url": sSource,
                            "data": {
                                //aoData: JSON.stringify(aoData),
                                status: status,
                                name: keyword,
                                pageIndex: index - 1,
                                pageSize: aoData[4]['value'],
                                access_token: app.url.access_token
                            }
                        }).then(function(resp) {
                            var _dt = resp.data.data;
                            utils.extendHash(_dt.pageData, ["doctorNum", "title", "hospital", "name", "telephone", "inviterName", "source", "remark", "licenseExpire", "licenseNum", "userId", "departments", "orderTime"]);
                            resp.start = _dt.start;
                            resp.recordsTotal = _dt.total;
                            resp.recordsFiltered = _dt.total;
                            resp.length = _dt.pageSize;
                            resp.data = _dt.pageData;
                            fnCallback(resp);
                            $scope.keyName=keyword;
                            keyword = '';


                            // 更新界面中的数据
                            if (type === 'un_check') {
                                $('#doctor_check').html(resp.recordsTotal);
                                utils.localData('doctor_check', resp.recordsTotal);
                            }
                        });
                    },
                    "processing": true,
                    //"searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function(nRow, aData, iDataIndex) {
                        $(nRow).attr('data-id', aData['userId']).click(aData, function(param, e) {
                            $scope.seeDetails(param.data.userId,index);
                            $('.currentRow').removeClass('currentRow');
                            $rootScope.curRowId = $(this).data('id');
                            $rootScope.curDoctorPic = param.data.headPicFileName || 'src/img/a0.jpg';
                            utils.localData('curDoctorPic', param.data.headPicFileName || 'src/img/a0.jpg');
                        });
                    },
                    "columns": [{
                        "orderable": false,
                        "render": function(set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img src="' + path + '"/>';
                        }
                    }, {
                        "data": "name",
                        "orderable": false
                    }, {
                        "data": "hospital",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "departments",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "title",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "inviterName",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "source",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "orderTime",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            if (set.length !== 0 && set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日, hh点mm分');
                            } else {
                                return '';
                            }
                        }
                    }]
                });

                switch (type) {
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
                    default:
                        break;
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
                _ipt.val(keyword);
                _ipt.focus();
                //  先别删这段屏蔽的代码，- -！
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
                    }, 300);
                });

                // _ipt.change(function() {
                //         var val = $.trim(_ipt.val());
                //         if (_ipt.val()) {
                //             _i.removeClass('icon-magnifier').addClass('fa-times-circle');
                //             keyWord = _temp = _ipt.val();
                //         } else {
                //             _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                //             if (_temp && !_ipt.val()) {
                //                 $scope.searching = false;
                //                 keyWord = _temp = '';
                //                 start = length * (index - 1);
                //                 keyword = null;
                //                 dTable.fnDestroy();
                //                 setTable();
                //             }
                //         }
                //  });

                _ipt.blur(function() {
                    clearInterval(_timer);
                    // _ipt.val("");
                });

                _i.click(function() {
                    isSearching = false;
                    keyWord = _temp = '';
                    _ipt.val('');
                    _ipt.trigger('submit');
                    _ipt.val('');
                    _i.removeClass('fa-times-circle').addClass('icon-magnifier');
                    start = length * (index - 1);
                    dTable.fnDestroy();
                    // keyword = null;
                    setTable();
                });

                // _ipt.val(keyword).trigger('change');
                _ipt.val(keyWord).trigger('focus');

                function submit() {
                    $scope.searching = true;
                    //keyword = keyWord;
                    keyword = _ipt.val();
                    dTable.fnDestroy();
                    setTable();
                    // _ipt.focus()
                }


                // 回车时的事件响应
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

        var timer = setInterval(function() {
            if (!dTable) {
                clearInterval(timer);
                initTable();
            }
        }, 100);
    }]);

})();
