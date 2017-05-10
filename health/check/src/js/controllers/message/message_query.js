'use strict';
(function() {

angular.module('app').controller('MessageQuery', MessageQuery);
MessageQuery.$inject = ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', '$compile'];
function MessageQuery($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, $compile) {

        $scope.formData = {};

        var dTable;

        var param={
            status: 2,
            pageIndex: 0,
            pageSize: 10,
            access_token: app.url.access_token
        };

        function initDocTable() {
            var index = 0,
                length = 10,
                start = 0,
                size = 10;

            var setTable = function () {
                dTable = $('#message_table').DataTable({
                    "language": app.lang.datatables.translation,
                    "searching": false,
                    "sScrollX": "100%",
                    "sScrollXInner": "110%",
                    "destroy": true,
                    "lengthChange": true,
                    "ordering": false,
                    "draw": 1,
                    "pageLength": length,
                    "lengthMenu": [5,10,20,50],
                    "autoWidth" : false,
                    "displayStart": start,
                    "bServerSide": true,
                    "sAjaxSource": app.url.msg.find,
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data":param,
                            //{
                            //    status: 2,
                            //    name: name,
                            //    pageIndex: index,
                            //    pageSize: aoData[4]['value'],
                            //    access_token: app.url.access_token,
                            //    toPhone: $scope.formData.phone,
                            //    content: $scope.formData.content
                            //},
                            "success": function (resp) {
                                if (resp.resultCode === 1) {
                                    var data = {};
                                    data.recordsTotal = resp.data.total;
                                    data.recordsFiltered = resp.data.total;
                                    data.length = resp.data.pageSize;
                                    data.data = resp.data.pageData;
                                    size = aoData[4]['value'];
                                    fnCallback(data);
                                }
                                else{
                                    console.log(resp.resultMsg);
                                }

                            }
                        });
                    },
                    "columns": [
                    {
                        "data": "userid",
                        "orderable": false,
                        "render": function (set, status, dt) {
                            if(dt.userid==undefined){
                                return '';
                            }
                            else{
                                return dt.userid;
                            }
                        }
                    }
                    , {
                            "data": "toPhone",
                            "orderable": false,
                            "render": function (set, status, dt) {
                                if(dt.toPhone==undefined){
                                    return '';
                                }
                                else{
                                    return dt.toPhone;
                                }
                            }
                    }, {
                            "data": "content",
                            "orderable": false,
                            "render": function (set, status, dt) {
                                if(dt.content==undefined){
                                    return '';
                                }
                                else{
                                    return dt.content;
                                }
                            }
                    }, {
                            "data": "createTime",
                            "orderable": false,
                            "render": function (set, status, dt) {
                                if(dt.createTime==undefined){
                                    return '';
                                }
                                else{
                                    return utils.dateFormat(dt.createTime, 'yyyy年MM月dd日，hh点mm分');
                                }
                            }
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                dTable.off('page.dt').on('page.dt', function (e, settings) {
                    index = dTable.page.info().page+1;
                    start = length * (index - 1);
                    param.pageIndex=index-1;
                })
                .on('length.dt', function ( e, settings, len ) {
                    length=len;
                    index = 0;
                    start = 0;
                    param.pageIndex=0;
                    param.pageSize=len;
                });
            };
            setTable();
        }

        initDocTable();

        // 提交并更新数据
        $scope.submit = function () {
            param={
                status: 2,
                pageIndex: 0,
                pageSize: 10,
                access_token: app.url.access_token,
                toPhone:$scope.formData.phone,
                content:$scope.formData.content
            };

            initDocTable();


            // 初始化表格
            //function initTable() {
            //    var name,
            //        _index,
            //        _start,
            //        isSearch = false,
            //        searchTimes = 0,
            //        index = utils.localData('page_index') * 1 || 1,
            //        start = utils.localData('page_start') * 1 || 0,
            //        length = utils.localData('page_length') * 1 || 100;
            //
            //    var setTable = function () {
            //        doctorList = $('#message_table');
            //        dTable = doctorList.dataTable({
            //            "draw": index,
            //            "displayStart": start,
            //            "lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
            //            "pageLength": length,
            //            "bServerSide": true,
            //            "sAjaxSource": app.url.msg.find,
            //            "fnServerData": function (sSource, aoData, fnCallback) {
            //                $http({
            //                    method: 'post',
            //                    "url": sSource,
            //                    "data": {
            //                        status: 2,
            //                        name: name,
            //                        pageIndex: index - 1,
            //                        pageSize: aoData[4]['value'],
            //                        access_token: app.url.access_token,
            //                        toPhone: $scope.formData.phone,
            //                        content: $scope.formData.content
            //                    }
            //                }).then(function (resp) {
            //                    $scope.showResult = true;
            //                    if (resp.data.resultCode === 1) {
            //                        var _dt = resp.data;
            //                        $scope.hasResult = true;
            //                        index = aoData[0]['value'];
            //                        utils.extendHash(_dt.data, ["id", "content", "toPhone", "createTime"]);
            //                        resp.start = _dt.start;
            //                        resp.recordsTotal = _dt.total;
            //                        resp.recordsFiltered = _dt.total;
            //                        resp.length = _dt.pageSize;
            //                        resp.data = _dt.data;
            //                        fnCallback(resp);
            //                    }else{
            //                        $scope.hasResult = false;
            //                    }
            //                });
            //            },
            //            paging: false,
            //            "searching": false,
            //            "language": app.lang.datatables.translation,
            //            "columns": [{
            //                "data": "userid",
            //                "orderable": false,
            //                "searchable": false
            //            }, {
            //                "data": "toPhone",
            //                "orderable": false,
            //                "searchable": false
            //            }, {
            //                "data": "content",
            //                "orderable": false,
            //                "searchable": false
            //            }, {
            //                "data": "createTime",
            //                "orderable": false,
            //                "searchable": false,
            //                "render": function(set, status, dt){
            //                    return utils.dateFormat(dt.createTime, 'yyyy年MM月dd日，hh点mm分');
            //                }
            //            }]
            //        });
            //
            //        // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
            //        dTable.off().on('length.dt', function (e, settings, len) {
            //            index = 1;
            //            start = 0;
            //            length = len;
            //            dTable.fnDestroy();
            //            setTable();
            //            utils.localData('page_length', length);
            //        }).on('page.dt', function (e, settings) {
            //            index = settings._iDisplayStart / length + 1;
            //            start = length * (index - 1);
            //            dTable.fnDestroy();
            //            $rootScope.scrollTop = html.scrollTop() ? 103 : 152;
            //            utils.localData('page_index', index);
            //            utils.localData('page_start', start);
            //            setTable();
            //        });
            //    };
            //
            //    setTable();
            //
            //}
            //
            //initTable();

        };
};

})();
