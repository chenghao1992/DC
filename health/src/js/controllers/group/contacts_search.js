'use strict';
(function(){
    app.controller('ContactsSearch',funcContactsSearch);
    funcContactsSearch.$inject=['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'Doctor', '$stateParams'];
    function funcContactsSearch($rootScope, $scope, $state, $timeout, $http, utils, Doctor, $stateParams) {

        var url = app.url.yiliao.getDoctors,
            groupId = utils.localData('curGroupId');


        if ($rootScope.isSearching) {
            var param = {};
            url = app.url.yiliao.searchDoctor;
            param['groupId'] = groupId;
            param['keyword'] = $rootScope.keyword;
        }

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
        var doctorList, dTable;

        function initTable() {
            var name,
                _index,
                _start,
                isSearch = false,
                searchTimes = 0,
                index = 1,
                start = 0,
                length = utils.localData('page_length') * 1 || 10;

            var setTable = function() {
                doctorList = $('#searchList');
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        if(!param) return;
                        param.pageIndex = index - 1;
                        param.pageSize = aoData[4]['value'];
                        param.access_token = app.url.access_token;
                        $http({
                            "method": "post",
                            "url": sSource,
                            "data": param
                        }).then(function(resp) {
                            resp = resp.data.data;
                            for (var i = 0; i < resp.pageData.length; i++) {
                                utils.extendHash(resp.pageData[i], ["doctor", "contactWay", "remarks", "departmentFullName", "applyStatusName", "inviterName", "updatorDate"]);
                                utils.extendHash(resp.pageData[i].doctor, ["name", "departments", "position", "doctorNum", "skill", "introduction", "telephone"]);
                            }
                            resp.start = resp.start;
                            resp.recordsTotal = resp.total;
                            resp.recordsFiltered = resp.total;
                            resp.length = resp.pageSize;
                            resp.data = resp.pageData;
                            fnCallback(resp);
                            $scope.loading = false;
                            $rootScope.loaded = true;
                        });
                    },
                    //"processing": true,
                    "searching": false,
                    "language": app.lang.datatables.translation,
                    "createdRow": function(nRow, aData, iDataIndex) {
                        var a_link = $(nRow).find('.a-link');
                        a_link.click(function() {
                            $scope.seeDetails(aData.doctorId);
                        });
                    },
                    "columns": [{
                        "orderable": false,
                        "render": function(set, status, dt) {
                            if (dt.doctor && dt.doctor.headPicFilePath) {
                                var path = dt.doctor.headPicFilePath;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/>';
                        }
                    }, {
                        "data": "doctor.name",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return '<a class="a-link">' + dt.doctor.name + '</a>';
                        }
                    }, {
                        "data": "departmentFullName",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "doctor.position",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "doctor.telephone",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "contactWay",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "applyStatus",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return set == '1' ? '已通过' : set == '2' ? '待审核' : set == '3' ? '未通过' : set == '7' ? '未认证' : '';
                        }
                    }, {
                        "data": "inviterName",
                        "orderable": false,
                        "searchable": false
                    }, {
                        "data": "updatorDate",
                        "orderable": false,
                        "searchable": false,
                        "render": function (set, status, dt) {
                            if (set) {
                                return utils.dateFormat(set, 'yyyy年MM月dd日');
                            }else{
                                return '';
                            }
                        }
                    }, {
                        "data": "status",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return set == 'C' ? '集团成员' : set == 'I' ? '已邀请,待验证' : set == 'J' ? '已申请,待审核' : set == 'S' ? '已解除' : '';
                        }
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off().on('init.dt', function() {
                    doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
                }).on('length.dt', function(e, settings, len) {
                    index = 1;
                    start = 0;
                    length = len;
                    dTable.fnDestroy();
                    setTable();
                    utils.localData('page_length', len);
                }).on('page.dt', function(e, settings) {
                    index = settings._iDisplayStart / length + 1;
                    start = length * (index - 1);
                    dTable.fnDestroy();
                    utils.localData('page_index', index);
                    utils.localData('page_start', start);
                    setTable();
                });
            };

            setTable();
        }

        initTable();

    };

})();

