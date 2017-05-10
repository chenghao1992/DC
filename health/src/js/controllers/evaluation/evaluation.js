'use strict';
(function(){
    angular.module('app').controller('Evaluation', Evaluation);
    Evaluation.$inject=['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];
    function Evaluation($rootScope, $scope, $state, $http, utils, $modal, Doctor) {

        $scope.tabs = {};
        $scope.tabs.active = [true, false, false];
        $scope.refresh = [];

        $scope.tabs.byFinance = function(){
            $scope.ofDisease = true;
            setTimeout(function () {
                if(typeof $scope.refresh[0] === 'function'){
                    $scope.refresh[0]();
                }
            }, 50);
        };

        $scope.tabs.byPatient = function(){
            $scope.ofTitle = true;
            if(typeof $scope.refresh[1] === 'function'){
                $scope.refresh[1]();
            }
        };

        $scope.tabs.byDoctor = function(){
            $scope.ofArea = true;
            setTimeout(function () {
                if(typeof $scope.refresh[2] === 'function'){
                    $scope.refresh[2]();
                }
            }, 50);
        };

        ////////////////////////////////////////////////////////////

    };



    angular.module('app').controller('EvaluationByDoctor', EvaluationByDoctor);
    EvaluationByDoctor.$inject=['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];
    function EvaluationByDoctor($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
        var url = app.url.yiliao.inviteDoctor, // 后台API路径
            data = null,
            html = $('html'),
            body = $('body'),
            groupId = utils.localData('curGroupId');

        if ($rootScope.pageName !== 'list_pass') {
            utils.localData('page_index', null);
            utils.localData('page_start', null);
            $rootScope.pageName = 'list_pass';
            $rootScope.scrollTop = 0;
        }

        // 查看邀请列表信息
        $scope.seeInvitationList = function (id) {
            if (id || id == '0') {
                $state.go('app.doctor_list', {id: id}, {reload: false});
            }
        };

        // 查看某一信息
        $scope.seeDetails = function (id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        ////////////////////////////////////////////////////////////

        // 初始化表格
        var doctorList, dTable, keyWord, ipt,
            isSearching = false, _chk, keyword;

        function initTable() {
            var subs = [],name,
                _index,
                _start,
                searchTimes = 0,
                index = 1,
                start = 0,
                length = utils.localData('page_length') * 1 || 20,
                num = 0,
                size = 20,
                idx = 0,
                chk_val = true,
                params = {
                    keyword: keyword,
                };

            var setTable = function () {
                doctorList = $('#evaluationByDoctor');
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        num = 1;
                        idx = index -1;
                        params.access_token = app.url.access_token;
                        params.groupId = groupId;
                        params.showOnJob = chk_val;
                        params.pageIndex = index - 1;
                        params.pageSize = aoData[4]['value'];
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": params,
                            "success": function (resp) {
                                //index = aoData[0]['value'];
                                for (var i = 0; i < resp.data.pageData.length; i++) {
                                    utils.extendHash(resp.data.pageData[i], ["name", "value", "title", "departments", "hospital", "telephone"]);
                                }
                                resp.start = resp.data.start;
                                resp.recordsTotal = resp.data.total;
                                resp.recordsFiltered = resp.data.total;
                                resp.length = resp.data.pageSize;
                                resp.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                $scope.loading = false;
                                fnCallback(resp);
                            }
                        });
                    },
                    //"searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function (nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        var detail_link = $(nRow).find('.detail-link');
                        a_link.click(function(e){
                            var evt = e || window.event;
                            evt.stopPropagation();
                            $scope.seeDetails(aData.id);
                        });
                        /*detail_link.click(function(e){
                            var evt = e || window.event;
                            evt.stopPropagation();
                            //$scope.seeDetails(aData.id);
                            });*/
                        $(nRow).on('click', 'button', function () {
                            //$('.currentRow').removeClass('currentRow');
                            $rootScope.curDoctorId = aData.id;
                            $rootScope.curDoctorName = aData.name;
                            utils.localData('curDoctorId', aData.id);
                            utils.localData('curDoctorName', aData.name);
                            //$scope.seeInvitationList(param.data.id);
                            aData.showOnJob = chk_val;
                            showPop(aData);
                        });
                        num++;
                    },
                    "columns": [{
                        "orderable": false,
                        "render": function (set, status, dt) {
                            return '<span class="text-num">' + (idx * size + num) + '</span>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/></a>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<a class="a-link">' + dt.name + '</a>';
                        }
                    }, {
                        "data": "hospital",
                        "orderable": false
                    }, {
                        "data": "departments",
                        "orderable": false
                    }, {
                        "data": "title",
                        "orderable": false
                    }, {
                        "data": "value",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            return '<button class="detail-link btn btn-primary">查 询</button>';
                        }
                    }]
                });

                /////////////////////////////////////////////////////////////////////

                var wrapper = $('#evaluationByDoctor_filter'),
                    _form = $('<form></form>'),
                    _lb = $('<label class="checkbox i-checks m-r-lg"><i style="position:relative;top:0;width:20px;"></i>只显示在职医生</label>'),
                    _lbl = wrapper.addClass('group-search').children('label').append(_i),
                    _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                    _ipt = _lbl.find('input').attr('placeholder', '按医生姓名 / 电话搜索').attr('autocomplete', 'off'),
                    _timer = 0,
                    _temp = '';

                _chk = $('<input type="checkbox" style="width:auto" checked />');

                wrapper.append(_form);
                _form.append(_lb);
                _lb.prepend(_chk);

                _form.append(_lbl);
                _lbl.html('').append(_ipt).append(_i);

                if(chk_val){
                    _chk.attr('checked', true);
                    chk_val = true;
                }else{
                    _chk.attr('checked', false);
                    chk_val = false;
                }

                _chk.click(function() {
                    if(chk_val){
                        chk_val = false;
                    }else{
                        chk_val = true;
                    }
                    dTable.fnDestroy();
                    setTable();
                });

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

        initTable();

        function showPop(data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'invitedDoctor_list.html',
                controller: 'invitedDoctorList',
                size: 'lg',
                resolve: {
                    item: function() {
                        return data;
                    }
                }
            });
        }
    };

    angular.module('app').controller('invitedDoctorList', invitedDoctorList);
    invitedDoctorList.$inject=['$rootScope', '$scope', '$state', '$http', 'utils', '$modalInstance', 'Doctor', 'item'];
    function invitedDoctorList($rootScope, $scope, $state, $http, utils, $modalInstance, Doctor, item) {
        setTimeout(function() {
            var url = app.url.yiliao.inviteDoctor, // 后台API路径
                data = null,
                html = $('html'),
                body = $('body'),
                groupId = utils.localData('curGroupId'),
                doctorId = ($scope.curDoctorId || $scope.curDoctorId == '0') ? $scope.curDoctorId : utils.localData('curDoctorId'),
                curDoctorName = $scope.curDoctorName || utils.localData('curDoctorName');

            $scope.viewData = {};
            $scope.viewData.curDoctorName = (curDoctorName && curDoctorName.constructor == Array) ? 'XXX' : curDoctorName;

            if ($rootScope.pageName !== 'list_pass') {
                utils.localData('page_index', null);
                utils.localData('page_start', null);
                $rootScope.pageName = 'list_pass';
                $rootScope.scrollTop = 0;
            }

            // 查看某一信息
            $scope.seeDetails = function (id) {
                if (id) {
                    $('#doctor_details').removeClass('hide');
                    $rootScope.winVisable = true;
                    Doctor.addData(id);
                }
            };

            ////////////////////////////////////////////////////////////

            // 初始化表格
            var doctorList, dTable;

            function initTable() {
                var name,
                    _index,
                    _start,
                    isSearch = false,
                    searchTimes = 0,
                    index = utils.localData('page_index') * 1 || 1,
                    start = utils.localData('page_start') * 1 || 0,
                    length = utils.localData('page_length') * 1 || 5;

                var setTable = function () {
                    doctorList = $('#inviteDoctorList');
                    dTable = doctorList.dataTable({
                        "draw": index,
                        "displayStart": start,
                        "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                        "pageLength": length,
                        "bServerSide": true,
                        "sAjaxSource": url,
                        "fnServerData": function (sSource, aoData, fnCallback) {
                            $.ajax({
                                "type": "post",
                                "url": sSource,
                                "dataType": "json",
                                "data": {
                                    access_token: app.url.access_token,
                                    groupId: groupId,
                                    showOnJob: item.showOnJob,
                                    doctorId: doctorId,
                                    pageIndex: index - 1,
                                    pageSize: aoData[4]['value']
                                },
                                "success": function (resp) {
                                    for (var i = 0; i < resp.data.pageData.length; i++) {
                                        utils.extendHash(resp.data.pageData[i], ["name", "hospital", "title", "departments", "telephone", "statusName", "time"]);
                                    }
                                    resp.start = resp.data.start;
                                    resp.recordsTotal = resp.data.total;
                                    resp.recordsFiltered = resp.data.total;
                                    resp.length = resp.data.pageSize;
                                    resp.data = resp.data.pageData;
                                    fnCallback(resp);
                                    $scope.loading = false;
                                }
                            });
                        },
                        "searching": false,
                        "language": app.lang.datatables.translation,
                        "createdRow": function (nRow, aData, iDataIndex) {
                            var a_link = $(nRow).find('.a-link');
                            a_link.click(function (e) {
                                var evt = e || window.event;
                                evt.stopPropagation();
                                $scope.seeDetails(aData.id);
                            });
                        },
                        "columns": [{
                            "orderable": false,
                            "render": function (set, status, dt) {
                                if (dt.headPicFileName) {
                                    var path = dt.headPicFileName;
                                } else {
                                    var path = 'src/img/a0.jpg';
                                }
                                return '<img class="a-link" src="' + path + '"/></a>';
                            },
                            "searchable": false
                        }, {
                            "orderable": false,
                            "searchable": false,
                            "render": function (set, status, dt) {
                                return '<a class="a-link">' + dt.name + '</a>';
                            }
                        }, {
                            "data": "title",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "departments",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "hospital",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "telephone",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "statusName",
                            "orderable": false,
                            "searchable": false
                        }, {
                            "data": "time",
                            "orderable": false,
                            "searchable": false
                        }]
                    });

                    // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                    dTable.off().on('length.dt', function(e, settings, len) {
                        index = 1;
                        start = 0;
                        length = len;
                        dTable.fnDestroy();
                        setTable();
                    }).on('page.dt', function(e, settings) {
                        index = settings._iDisplayStart / length + 1;
                        start = length * (index - 1);
                        dTable.fnDestroy();
                        setTable();
                    });
                };

                setTable();

            }

            initTable();

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        },1);
    };



    angular.module('app').controller('EvaluationByFinace', EvaluationByFinace);
    EvaluationByFinace.$inject=['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];
    function EvaluationByFinace($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
        var groupId = localStorage.getItem('curGroupId');

        var dataTest = [{
            'id': 1,
            'name': '张三',
            'orders': 123,
            'income': 3000
        }, {
            'id': 2,
            'name': '李四',
            'orders': 13,
            'income': 1000
        }, {
            'id': 3,
            'name': '广五',
            'orders': 32,
            'income': 2000
        }];
        var ordersTest = {
            name: '张三',
            income: 3000,
            orders: [{
                'orderId': 10011256644563,
                'orderType': '电话咨询',
                'patientName': '王晓霞',
                'patientPhone': 13913965689,
                'orderTime': '2015-10-13 18:23',
                'orderAmount': 1000,
            }, {
                'orderId': 20011256644563,
                'orderType': '药费',
                'patientName': '李强',
                'patientPhone': 15913965689,
                'orderTime': '2015-10-11 18:23',
                'orderAmount': 2000,
            }]
        }

        // 查看某一信息
        $scope.seeDetails = function(id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        // 初始化表格
        var doctorList, dTable, keyWord, ipt,
            isSearching = false, _chk, keyword;

        function initTable() {
            var subs = [],
                index = 1,
                start = 0,
                length = 10,
                idx = 0,
                size = 50,
                searchTimes = 0,
                chk_val = true,
                num = 0,
                params = {
                    keyword: keyword,
                };

            var setTable = function() {
                dTable = $('#evaluationByFinace').dataTable({
                    "language": app.lang.datatables.translation,
                    "ordering": false,
                    //"searching": false,
                    //"bLengthChange":false,

                    "bAutoWidth": false, //自动计算宽度
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": app.urlRoot + 'group/stat/orderMoney',
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        num = 1;
                        idx = index - 1;

                        params.access_token = app.url.access_token;
                        params.groupId = groupId;
                        params.doctorId = null;
                        params.showOnJob = chk_val;
                        params.pageIndex = index - 1;
                        params.pageSize = aoData[4]['value'];

                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": params,
                            "success": function(resp) {
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                for (var i = 0; i < data.data.length; i++) {
                                    utils.extendHash(data.data[i], ["name", "amount", "hospital", "departments", "title", "money"]);
                                }
                                size = aoData[4]['value'];
                                fnCallback(data);
                            }
                        });
                    },
                    aoColumns: [{
                        "orderable": false,
                        "render": function(set, status, dt) {
                            return '<span class="text-num">' + (idx * size + num) + '</span>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "render": function(set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/></a>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return '<a class="a-link">' + dt.name + '</a>';
                        }
                    }, {
                        data: 'hospital'
                    }, {
                        data: 'departments'
                    }, {
                        data: 'title'
                    }, {
                        data: 'amount'
                    }, {
                        data: 'money',
                        "orderable": true
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-primary'>查 询</button>"
                    }],
                    "createdRow": function(nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function() {
                            $scope.seeDetails(aData.id);
                        });
                        $(nRow).on('click', 'button', function() {
                            aData.showOnJob = chk_val;
                            showPop(aData);
                        });
                        num++;
                    }
                });

                /////////////////////////////////////////////////////////////////////

                var wrapper = $('#evaluationByFinace_filter'),
                    _form = $('<form></form>'),
                    _lb = $('<label class="checkbox i-checks m-r-lg"><i style="position:relative;top:0;width:20px;"></i>只显示在职医生</label>'),
                    _lbl = wrapper.addClass('group-search').children('label').append(_i),
                    _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                    _ipt = _lbl.find('input').attr('placeholder', '按医生姓名 / 电话搜索').attr('autocomplete', 'off'),
                    _timer = 0,
                    _temp = '';

                _chk = $('<input type="checkbox" style="width:auto" checked />');

                wrapper.append(_form);
                _form.append(_lb);
                _lb.prepend(_chk);

                _form.append(_lbl);
                _lbl.html('').append(_ipt).append(_i);

                if(chk_val){
                    _chk.attr('checked', true);
                    chk_val = true;
                }else{
                    _chk.attr('checked', false);
                    chk_val = false;
                }

                _chk.click(function() {
                    if(chk_val){
                        chk_val = false;
                    }else{
                        chk_val = true;
                    }
                    dTable.fnDestroy();
                    setTable();
                });

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

        initTable();

        function showPop(doctorData) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'getOrdersCtrl',
                size: 'lg',
                resolve: {
                    doctorData: function() {
                        return doctorData;
                    }
                }
            });
        };

    };

    angular.module('app').controller('getOrdersCtrl', getOrdersCtrl);
    getOrdersCtrl.$inject=['$scope', '$modalInstance', '$http', 'utils', 'doctorData', 'Doctor'];
    function getOrdersCtrl($scope, $modalInstance, $http, utils, doctorData, Doctor){
        $scope.docName = doctorData.name;
        $scope.docIncome = doctorData.money;

        // 查看某一信息
        $scope.seeDetails = function(id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        // 初始化表格
        function initTable() {
            var index = 1,
                start = 0,
                length = 10;

            var setTable = function() {
                var dTable = $('#ordersTable').dataTable({
                    "language": app.lang.datatables.translation,
                    "ordering": false,
                    "searching": false,
                    //"bLengthChange":false,

                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": app.urlRoot + 'group/stat/orderMoney',
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": {
                                access_token: app.url.access_token,
                                groupId: localStorage.getItem('curGroupId'),
                                doctorId: doctorData.id,
                                showOnJob: doctorData.showOnJob,
                                pageIndex: index - 1,
                                pageSize: aoData[4]['value']
                            },
                            "success": function(resp) {
                                for (var i = 0; i < resp.data.pageData.length; i++) {
                                    utils.extendHash(resp.data.pageData[i], ["orderNo", "name", "statusName", "telephone", "money", "time"]);
                                }
                                var data = {};
                                data.recordsTotal = resp.data.total;
                                data.recordsFiltered = resp.data.total;
                                data.length = resp.data.pageSize;
                                data.data = resp.data.pageData;
                                console.log(resp);
                                console.log(data);
                                for (var i = 0; i < data.data.length; i++) {
                                    utils.extendHash(data.data[i], ["orderNo", "packName", "name", "telephone"]);
                                }
                                fnCallback(data);
                            }
                        });
                    },
                    aoColumns: [{
                        data: 'orderNo',
                        "defaultContent": '',
                        "searchable": false
                    }, {
                        data: 'packName',
                        "searchable": false
                    }, {
                        data: 'name',
                        "orderable": false,
                        "searchable": false
                    }, {
                        data: 'telephone',
                        "searchable": false
                    }, {
                        data: 'time',
                        "render": function(data) { // 返回自定义内容
                            if (data) {
                                return utils.dateFormat(data, 'yyyy年MM月dd日，hh点mm分');
                            }
                            return '';
                        },
                        "orderable": true,
                        "searchable": false
                    }, {
                        data: 'money',
                        "searchable": false
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off().on('page.dt', function(e, settings) {
                    length = settings._iDisplayLength;
                    index = settings._iDisplayStart / length + 1;
                    start = length * (index - 1);
                    dTable.fnDestroy();
                    setTable();
                }).on('length.dt', function(e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                });

            };
            setTable();
        }

        setTimeout(initTable, 0);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }



    angular.module('app').controller('EvaluationByPatient', EvaluationByPatient);
    EvaluationByPatient.$inject=['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];
    function EvaluationByPatient($rootScope, $scope, $state, $http, utils, $modal, Doctor) {
        var access_token = localStorage.getItem('access_token');
        var groupId = localStorage.getItem('curGroupId');


        // 查看某一信息
        $scope.seeDetails = function(id) {
            if (id) {
                $('#doctor_details').removeClass('hide');
                $rootScope.winVisable = true;
                Doctor.addData(id);
            }
        };

        var url = app.url.yiliao.getDocInviteNum, // 后台API路径
            data = null;

        var doctorList, dTable, keyWord, ipt,
            isSearching = false, _chk, keyword;

        function initTable() {
            var subs = [],
                name,
                _index,
                _start,
                searchTimes = 0,
                chk_val = true,
                index = 1,
                start = 0,
                length = 10,
                num = 0,
                size = 50,
                idx = 0,
                params = {
                    keyword: keyword,
                };

            var setTable = function() {
                doctorList = $('#evaluationByPatient');
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        num = 1;
                        idx = index - 1;

                        params.access_token = app.url.access_token;
                        params.groupId = groupId;
                        params.showOnJob = chk_val;
                        params.pageIndex = index - 1;
                        params.pageSize = aoData[4]['value'];
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": params,
                            "success": function(resp) {
                                //index = aoData[0]['value'];
                                resp.start = resp.data.start;
                                resp.recordsTotal = resp.data.total;
                                resp.recordsFiltered = resp.data.total;
                                resp.length = resp.data.pageSize;
                                resp.data = resp.data.pageData;
                                size = aoData[4]['value'];
                                fnCallback(resp);
                            }
                        });
                    },
                    //"searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function(nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function() {
                            if (aData.id) {
                                $scope.seeDetails(aData.id);
                            }
                        });
                        $(nRow).on('click', 'button', function() {
                            aData.showOnJob = chk_val;
                            showPop(aData);
                        });
                        num++;
                    },
                    columns: [{
                        "orderable": false,
                        "render": function(set, status, dt) {
                            return '<span class="text-num">' + (idx * size + num) + '</span>';
                        },
                        "searchable": false
                    }, {
                        "orderable": false,
                        "render": function(set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/></a>';
                        },
                        "searchable": false
                    }, {
                        data: 'name',
                        render: function(data, type, row) {
                            if (row.name == undefined) {
                                return '';
                            } else {
                                return '<a class="a-link">' + data + '</a>';
                            }
                        },
                        "orderable": false,
                        "searchable": false
                    }, {
                        data: 'hospital',
                        render: function(data, type, row) {
                            if (row.hospital == undefined) {
                                return '';
                            } else {
                                return row.hospital;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'departments',
                        render: function(data, type, row) {
                            if (row.departments == undefined) {
                                return '';
                            } else {
                                return row.departments;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'title',
                        render: function(data, type, row) {
                            if (row.title == undefined) {
                                return '';
                            } else {
                                return row.title;
                            }
                        },
                        "orderable": false
                    }, {
                        data: 'value',
                        render: function(data, type, row) {
                            if (row.value == undefined) {
                                return '';
                            } else {
                                return row.value;
                            }
                        },
                        "orderable": false
                    }, {
                        data: null,
                        "defaultContent": "<button class='btn btn-primary'>查 询</button>",
                        "orderable": false
                    }],
                    "order": [
                        [4, "desc"]
                    ]
                });

                /////////////////////////////////////////////////////////////////////

                var wrapper = $('#evaluationByPatient_filter'),
                    _form = $('<form></form>'),
                    _lb = $('<label class="checkbox i-checks m-r-lg"><i style="position:relative;top:0;width:20px;"></i>只显示在职医生</label>'),
                    _lbl = wrapper.addClass('group-search').children('label').append(_i),
                    _i = $('<i ng-show="loaded" class="fa icon-magnifier"></i>'),
                    _ipt = _lbl.find('input').attr('placeholder', '按医生姓名 / 电话搜索').attr('autocomplete', 'off'),
                    _timer = 0,
                    _temp = '';

                _chk = $('<input type="checkbox" style="width:auto" checked />');

                wrapper.append(_form);
                _form.append(_lb);
                _lb.prepend(_chk);

                _form.append(_lbl);
                _lbl.html('').append(_ipt).append(_i);

                if(chk_val){
                    _chk.attr('checked', true);
                    chk_val = true;
                }else{
                    _chk.attr('checked', false);
                    chk_val = false;
                }

                _chk.click(function() {
                    if(chk_val){
                        chk_val = false;
                    }else{
                        chk_val = true;
                    }
                    dTable.fnDestroy();
                    setTable();
                });

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
                    params.keyword = null;
                    setTable();
                });

                _ipt.val(keyWord).trigger('focus');

                function submit() {
                    $scope.searching = true;
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

        initTable();

        function showPop(data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'patientModalContent.html',
                controller: 'PatientCtrl',
                size: 'lg',
                resolve: {
                    item: function() {
                        return data;
                    }
                }
            });
        };
    };

    angular.module('app').controller('PatientCtrl', PatientCtrl);
    PatientCtrl.$inject=['$scope', '$modalInstance', '$http', 'item', '$rootScope', 'Doctor', 'utils'];
    function PatientCtrl($scope, $modalInstance, $http, item, $rootScope, Doctor, utils) {
        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');
        $scope.doctorName = item.name;

        setTimeout(function() {
            var url = app.url.yiliao.getDocInvitePatient, // 后台API路径
                data = null,
                param = {
                    'access_token': access_token,
                    'groupId': curGroupId,
                    showOnJob: item.showOnJob,
                    'doctorId': item.id
                };

            // 查看某一信息
            $scope.seeDetails = function(id) {
                if (id) {
                    $('#doctor_details').removeClass('hide');
                    $rootScope.winVisable = true;
                    Doctor.addData(id);
                }
            };

            ////////////////////////////////////////////////////////////

            // 初始化表格
            var patientList, dTable;

            function initTable() {
                var name,
                    _index,
                    _start,
                    isSearch = false,
                    searchTimes = 0,
                    index = 1,
                    start = 0,
                    length = 5;

                var setTable = function() {
                    patientList = $('#patientsTable');
                    dTable = patientList.dataTable({
                        "draw": index,
                        "displayStart": start,
                        "lengthMenu": [5, 10, 15, 20],
                        "pageLength": length,
                        "bServerSide": true,
                        "sAjaxSource": url,
                        "fnServerData": function(sSource, aoData, fnCallback) {
                            param.pageIndex = index - 1;
                            param.pageSize = aoData[4]['value'];
                            console.log('index is:' + index);
                            $.ajax({
                                "type": "post",
                                "url": sSource,
                                "dataType": "json",
                                "data": param,
                                "success": function(resp) {
                                    for (var i = 0; i < resp.data.pageData.length; i++) {
                                        utils.extendHash(resp.data.pageData[i], ["name", "sex", "ageStr", "statusName", "telephone", "statusName", "time"]);
                                    }
                                    resp.start = resp.data.start;
                                    resp.recordsTotal = resp.data.total;
                                    resp.recordsFiltered = resp.data.total;
                                    resp.length = resp.data.pageSize;
                                    resp.data = resp.data.pageData;
                                    fnCallback(resp);
                                }
                            });
                        },
                        "searching": false,
                        "language": app.lang.datatables.translation,
                        "createdRow": function(nRow, aData, iDataIndex) {
                            var a_link = $(nRow).find('.a-link');
                            a_link.click(function(e) {
                                var evt = e || window.event;
                                evt.stopPropagation();
                                //$scope.seeDetails(aData.id);
                            });
                        },
                        columns: [{
                            "orderable": false,
                            "render": function(set, status, dt) {
                                if (dt.headPicFileName) {
                                    var path = dt.headPicFileName;
                                } else {
                                    var path = 'src/img/a0.jpg';
                                }
                                return '<img class="a-link" src="' + path + '"/>';
                            },
                            "searchable": false
                        }, {
                            data: 'name',
                            "orderable": false,
                            "render": function(set, status, dt) {
                                return '<a class="a-link">' + dt.name + '</a>';
                            },
                            "searchable": false
                        }, {
                            data: 'sex',
                            render: function(data, type, row) {
                                if (row.sex == undefined) {
                                    return '';
                                } else {
                                    if (row.sex == 1) {
                                        return '男';
                                    } else if (row.sex == 2) {
                                        return '女';
                                    } else if (row.sex == 3) {
                                        return '保密';
                                    } else {
                                        return '未知';
                                    }
                                }
                            },
                            "orderable": false,
                            "searchable": false
                        }, {
                            data: 'ageStr',
                            render: function(data, type, row) {
                                if (data == undefined) {
                                    return '';
                                } else {
                                    return data;
                                }
                            },
                            "orderable": false,
                            "searchable": false
                        }, {
                            data: 'telephone',
                            render: function(data, type, row) {
                                if (row.telephone == undefined) {
                                    return '';
                                } else {
                                    return row.telephone;
                                }
                            },
                            "orderable": false,
                            "searchable": false
                        }, {
                            data: 'statusName',
                            "orderable": false,
                            "searchable": false
                        }, {
                            data: 'time',
                            render: function(data, type, row) {
                                if (row.time == undefined) {
                                    return '';
                                } else {
                                    return row.time;
                                }
                            },
                            "orderable": false,
                            "searchable": false
                        }]
                    });

                    // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                    dTable.off().on('length.dt', function(e, settings, len) {
                        index = 1;
                        start = 0;
                        length = len;
                        dTable.fnDestroy();
                        setTable();
                    }).on('page.dt', function(e, settings) {
                        index = settings._iDisplayStart / length + 1;
                        start = length * (index - 1);
                        dTable.fnDestroy();
                        setTable();
                    });
                };

                setTable();

            }

            initTable();

        }, 1);

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
})();
