'use strict';
(function(){
    app.controller('StatisticsOfTitle', ['$rootScope', '$scope', '$state', '$http', 'utils', '$modal',function($rootScope, $scope, $state, $http, utils, $modal) {

        var showOnJob = true;

        //获取职称统计数据
        function getTitleData(){
            $http.post(app.urlRoot + 'group/stat/title', {
                access_token: localStorage.getItem('access_token'),
                groupId: localStorage.getItem('curGroupId'),
                showOnJob: showOnJob,
                "pageSize": 100,
                "pageIndex": 0
            }).
            success(function(data) {
                console.log(data);
                if (data.resultCode === 1) {
                    if (data.data.length < 1) {
                        return $scope.error = '无数据';
                    }
                    //如果是没有职称则显示[其他]
                    for (var i = data.data.length - 1; i >= 0; i--) {
                        if (data.data[i].name == '') {
                            data.data[i].name = '未认证';
                        }
                    };
                    setData(data.data);
                } else {
                    console.log(data);
                    $scope.error = '获取错误';
                }
            }).
            error(function(data) {
                console.log(data);
            });
        }

        getTitleData();

        function showDetail(aData) {
            var modalInstance = $modal.open({
                templateUrl: 'StatisticsOfTitleModalContent.html',
                controller: 'statistics_of_title_docModalInstanceCtrl',
                windowClass: 'modal-70-p',
                resolve: {
                    items: function() {
                        return aData;
                    }
                }
            });
        }

        var _chk, chk_val = true;

        //设置图表
        function setData(data) {
            require.config({
                paths: {
                    echarts: 'http://www.chinamediportal.com/static/health/echarts/dist'
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/pie'
                ],
                function(ec) {
                    var myChart = ec.init(document.getElementById('titleType'), 'macarons');
                    var option = {
                        // title : {
                        //     text: '各病种医生统计',
                        //     //subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        series: [{
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: data,
                            itemStyle: {
                                normal: {
                                    label: {
                                        formatter: "{b} : {c} ({d}%)"
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            dataFilter: function(argument) {
                                console.log(argument)
                            }
                        }]
                    };
                    myChart.setOption(option);
                    var titleTable = $('#statisticsOfTitle').DataTable({
                        "language": app.lang.datatables.translation,
                        "ordering": false,
                        "searching": false,
                        "paging": false,
                        //"bLengthChange":false,
                        "lengthMenu": [100],

                        data: data,
                        columns: [
                            //{ data: 'id' },
                            {
                                data: 'name'
                            }, {
                                data: 'value'
                            }, {
                                "render": function(set, status, dt) {
                                    return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                                }
                            }
                        ],
                        "createdRow": function(nRow, aData, iDataIndex) {
                            $(nRow).on('click', '#showDetail', function(event) {
                                aData.showOnJob = showOnJob;
                                showDetail(aData);
                                event.stopPropagation();
                            });
                        }
                    });

                    /////////////////////////////////////////////////////////////////////
                    var wrapper = $('#statisticsOfTitle_length'),
                        _lb = $('<label class="checkbox i-checks" style="padding-left:7px"><i style="position:relative;top:0;width:20px;"></i>只显示在职医生</label>');

                    _chk = $('<input type="checkbox" style="width:auto" checked />');
                    _lb.prepend(_chk);
                    wrapper.append(_lb);
                    _lb.prev().hide();

                    _chk = $('#statistics_checkbox');

                    if(chk_val){
                        _chk.attr('checked', true);
                        chk_val = true;
                    }else{
                        _chk.attr('checked', false);
                        chk_val = false;
                    }

                    _chk.off().click(function() {
                        if(chk_val){
                            chk_val = false;
                            showOnJob = false;
                        }else{
                            chk_val = true;
                            showOnJob = true;
                        }
                        titleTable.destroy();
                        getTitleData();
                    });
                }
            );
        };
    }]);


    app.controller('statistics_of_title_docModalInstanceCtrl', ['$rootScope', '$scope', '$state', '$http', 'utils', $modalInstance, items,function($rootScope, $scope, $state, $http, utils, $modalInstance, items) {
        //console.log(items);
        $scope.rowInfo = items;

        var docsTable, _chk;

        var params;
        if (items.name == '未认证') {
            params = {
                access_token: app.url.access_token,
                groupId: localStorage.getItem('curGroupId'),
                type: 2,
                showOnJob: $scope.rowInfo.showOnJob,
                typeId: '',
                pageIndex: 0,
                pageSize: 10
            };
        } else {
            params = {
                access_token: app.url.access_token,
                groupId: localStorage.getItem('curGroupId'),
                type: 2,
                showOnJob: $scope.rowInfo.showOnJob,
                typeId: items.name,
                pageIndex: 0,
                pageSize: 10
            };
        }


        function initDocsTable() {
            var index = 0,
                length = 10,
                start = 0,
                size = 10,
                chk_val = true;

            var setTable = function() {
                docsTable = $('#docsTableTitle').DataTable({
                    "language": app.lang.datatables.translation,
                    "searching": false,
                    "destroy": true,
                    "lengthChange": true,
                    "ordering": false,
                    "draw": index,
                    "pageLength": length,
                    "lengthMenu": [5, 10, 20, 50],
                    "autoWidth": false,
                    "displayStart": start,
                    "bServerSide": true,
                    "sAjaxSource": app.url.yiliao.statDoctor,
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        console.log(sSource);
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": params,
                            "success": function(resp) {
                                if (resp.resultCode == 1) {
                                    var data = {};
                                    console.log(resp.data);
                                    data.recordsTotal = resp.data.total;
                                    data.recordsFiltered = resp.data.total;
                                    data.length = resp.data.pageSize;
                                    data.data = resp.data.pageData;
                                    size = aoData[4]['value'];
                                    fnCallback(data);
                                } else {
                                    console.log(resp.resultMsg);
                                }
                            }
                        });
                    },
                    "columns": [{
                        "render": function(set, status, dt) {
                            if (dt.headPicFileName) {
                                var path = dt.headPicFileName;
                            } else {
                                var path = 'src/img/a0.jpg';
                            }
                            return '<img class="a-link" src="' + path + '"/></a>';
                        }
                    }, {
                        "data": "name",
                        "defaultContent": ''
                    }, {
                        "data": "doctorNum",
                        "defaultContent": ''
                    }, {
                        "data": "title",
                        "defaultContent": ''
                    }, {
                        "data": "telephone",
                        "defaultContent": ''
                    }, {
                        "data": "remarks",
                        "defaultContent": ''
                    }]
                });

                // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
                docsTable.off('page.dt').on('page.dt', function(e, settings) {
                    console.log('分页分页分页');
                    index = docsTable.page.info().page;
                    start = length * (index - 1);
                    console.log(index);
                    console.log(start);
                    params.pageIndex = index;
                })
                    .on('length.dt', function(e, settings, len) {
                        length = len;
                        index = 0;
                        start = 0;
                        params.pageIndex = 0;
                        params.pageSize = len;
                    });
            };
            setTable();
        }

        setTimeout(initDocsTable, 0);

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
