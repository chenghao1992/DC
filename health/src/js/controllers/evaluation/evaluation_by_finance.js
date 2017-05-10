'use strict';
(function() {

angular.module('app').controller('EvaluationByFinace', EvaluationByFinace);

    EvaluationByFinace.$inject = ['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];

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
                            console.log(resp);
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

getOrdersCtrl.$inject = ['$scope', '$modalInstance', '$http', 'utils', 'doctorData', 'Doctor'];

function getOrdersCtrl($scope, $modalInstance, $http, utils, doctorData, Doctor) {
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
};

})();
