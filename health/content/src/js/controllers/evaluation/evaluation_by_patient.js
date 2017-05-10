'use strict';

(function() {
    angular.module('app').controller('EvaluationByPatient', EvaluationByPatient);
    
    EvaluationByPatient.$inject = ['$rootScope', '$scope', '$state', '$http', 'utils', '$modal', 'Doctor'];
    
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
                                index = aoData[0]['value'];
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

    PatientCtrl.$inject = ['$scope', '$modalInstance', '$http', 'item', '$rootScope', 'Doctor', 'utils'];
    
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
})()
