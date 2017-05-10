'use strict';
(function(){
    app.controller('ContactsList',funcContactsList);
    funcContactsList.$inject=['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', 'Doctor', '$stateParams'];
    function funcContactsList($rootScope, $scope, $state, $timeout, $http, utils, Doctor, $stateParams) {

        var url = app.url.yiliao.searchDoctor, // 后台API路径
            data = null,
            itemId = $scope.itemId || utils.localData('itemId'),
            groupId = utils.localData('curGroupId'),
            curIndex = $stateParams.id.split('/'),
            param = {
                //status: 'C'
            };

        $scope.tipType = curIndex[2];
        var timeStringName = $('#timeStringName');

        if (curIndex[2] == 1) {
            timeStringName.html("加入时间");
        } else if (curIndex[2] == 2) {
            timeStringName.html("申请时间");
        } else if (curIndex[2] == 3) {
            timeStringName.html("邀请时间");
        } else if (curIndex[2] == 4) {
            timeStringName.html("离职时间");
        }

        if(curIndex[0] != 0){
            if (curIndex[1] == '1') {
                param.deptId = curIndex[0];
            } else if (curIndex[1] == '2') {
                param.areaId = curIndex[0].split('_');
            } else if (curIndex[1] == '3') {
                param.packId = curIndex[0];
            } else if (curIndex[1] == '4') {
                param.departmentId = curIndex[0];
                if(curIndex[0] == 'Undefined' && !curIndex[3]){
                    url = app.url.yiliao.getUndistributed;
                    param = {};
                }else{
                    url = app.url.yiliao.getDoctors;
                }
            }
        }

        if(curIndex[2] != '1') {
            param = {};
        }

        if(curIndex[3]){
            url = app.url.yiliao.searchDoctor;
        }

        if(curIndex[0] != 'Undefined' || curIndex[3]){
            if (curIndex[2] == 1) {
                param.status = 'C';
            } else if (curIndex[2] == 2) {
                param.status = 'J';
            } else if (curIndex[2] == 3) {
                param.status = 'I';
            } else if (curIndex[2] == 4) {
                param.status = 'S';
            }
        }

        if (curIndex[1] != '4'){
            if((curIndex[0] == 'Undefined' && curIndex[2] != 1 && !curIndex[3])){
                $('.group-mark').removeClass('mark-focus');
                param.status = null;
            }
        }else{
            if(curIndex.length == 0 || (curIndex[0] == 'Undefined' && curIndex[2] != 1 && !curIndex[3])){
                $('.group-mark').removeClass('mark-focus');
                param.status = null;
            }
        }

        if(curIndex[0] == 'Undefined' && curIndex[1] != '4' && curIndex[2] == '1'){
            param.status = 'C';
        }

        if ($rootScope.pageName !== 'list_pass') {
            utils.localData('page_index', null);
            utils.localData('page_start', null);
            //utils.localData('page_length', null);
            $scope.pageName = 'list_pass';
            //$rootScope.scrollTop = 0;
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
        var search_form = $('#group_search_form');

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
                doctorList = $('#contactsList');
                dTable = doctorList.dataTable({
                    "draw": index,
                    "displayStart": start,
                    "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                    "pageLength": length,
                    "bServerSide": true,
                    "sAjaxSource": url,
                    "destroy": true,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        param.groupId = groupId;
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
                    "processing": true,
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
                        },
                        defaultContent:''
                    }, {
                        "data": "doctor.name",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return '<a class="a-link">' + dt.doctor.name + '</a>';
                        },
                        defaultContent:''
                    }, {
                        "data": "doctor.doctorNum",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
                    }, {
                        "data": "doctor.position",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
                    }, {
                        "data": "doctor.telephone",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
                    }, {
                        "data": "contactWay",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
                    }, {
                        "data": "applyStatus",
                        "orderable": false,
                        "searchable": false,
                        "render": function(set, status, dt) {
                            return set == '1' ? '已通过' : set == '2' ? '待审核' : set == '3' ? '未通过' : set == '7' ? '未认证' : '';
                        },
                        defaultContent:''
                    }, {
                        "data": "inviterName",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
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
                        },
                        defaultContent:''
                    }, {
                        "data": "remarks",
                        "orderable": false,
                        "searchable": false,
                        defaultContent:''
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
        console.log(1212121212);
        initTable();
        $rootScope.initContacsTable=initTable;

    };

})();
