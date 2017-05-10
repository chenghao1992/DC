'use strict';
(function(){
    app.controller('AreaCtrl', ['$rootScope', '$scope', '$http', '$modal',function ($rootScope, $scope, $http, $modal) {
        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');
        // 路径配置
        require.config({
            paths: {
                echarts: 'http://www.chinamediportal.com/static/health/echarts/dist'
            }
        });

        var _chk, chk_val = true, setTable;

        function initProTable(res) {
            res.data.forEach(function (item, index, array) {
                if (item.id == undefined) {
                    item.name = '其他';
                }
            });

            setTable = function () {

                var provinceTable = $('#provinceTable').DataTable({
                    "language": app.lang.datatables.translation,
                    //"lengthMenu": [100],
                    "destroy": true,
                    "searching": false,
                    "ordering": false,
                    "paging": false,
                    //"bLengthChange": false,
                    data: res.data,
                    columns: [{
                        data: 'name',
                        render: function (data, type, row) {
                            if (row.name == undefined) {
                                return '';
                            } else {
                                return row.name;
                            }
                        }
                    }, {
                        data: 'value',
                        render: function (data, type, row) {
                            if (row.value == undefined) {
                                return '';
                            } else {
                                return row.value;
                            }
                        }
                    }, {
                        "render": function (set, status, dt) {
                            return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                        }
                    }],
                    "createdRow": function (nRow, aData, iDataIndex) {
                        $(nRow).on('click', '#showDetail', function (event) {
                            aData.showOnJob = showOnJob;
                            showDetail(aData);
                            event.stopPropagation();
                        });
                    }
                });

                /////////////////////////////////////////////////////////////////////

                /*var wrapper = $('#provinceTable_length'),
                 _lb = $('<label class="checkbox i-checks" style="padding-left:7px"><i style="position:relative;top:0;width:20px;"></i>只显示在职医生</label>');

                 _chk = $('<input type="checkbox" style="width:auto" checked />');
                 _lb.prepend(_chk);
                 wrapper.append(_lb);
                 _lb.prev().hide();*/

                _chk = $('#province_checkbox');

                if (chk_val) {
                    _chk.attr('checked', true);
                    chk_val = true;
                } else {
                    _chk.attr('checked', false);
                    chk_val = false;
                }

                _chk.off().click(function () {
                    if (chk_val) {
                        chk_val = false;
                        showOnJob = false;
                    } else {
                        chk_val = true;
                        showOnJob = true;
                    }
                    InitChart(eChart);
                    provinceTable.destroy();
                    setTable();
                });
            };

            setTable();
        }


        function initCityTable(res) {
            var cityTable = $('#cityTable').DataTable({
                "destroy": true,
                "ordering": false,
                "searching": false,
                "paging": false,
                "language": app.lang.datatables.translation,
                //"lengthMenu": [100],
                "bLengthChange": false,
                data: res.data,
                columns: [{
                    data: 'name',
                    render: function (data, type, row) {
                        if (row.name == undefined) {
                            return '';
                        } else {
                            return row.name;
                        }
                    }
                }, {
                    data: 'value',
                    render: function (data, type, row) {
                        if (row.value == undefined) {
                            return '';
                        } else {
                            return row.value;
                        }
                    }
                }, {
                    "render": function (set, status, dt) {
                        return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                    }
                }],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click', '#showDetail', function (event) {
                        aData.showOnJob = showOnJob;
                        showDetail(aData);
                        event.stopPropagation();
                    });
                }
            });
        }

        function initDisTable(res) {
            var districtTable = $('#districtTable').DataTable({
                "language": app.lang.datatables.translation,
                "destroy": true,
                "ordering": false,
                "searching": false,
                "paging": false,
                //"lengthMenu": [100],
                "bLengthChange": false,
                data: res.data,
                columns: [{
                    data: 'name',
                    render: function (data, type, row) {
                        if (row.name == undefined) {
                            return '';
                        } else {
                            return row.name;
                        }
                    }
                }, {
                    data: 'value',
                    render: function (data, type, row) {
                        if (row.value == undefined) {
                            return '';
                        } else {
                            return row.value;
                        }
                    }
                }, {
                    "render": function (set, status, dt) {
                        return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                    }
                }],
                "createdRow": function (nRow, aData, iDataIndex) {
                    $(nRow).on('click', '#showDetail', function (event) {
                        aData.showOnJob = showOnJob;
                        showDetail(aData);
                        event.stopPropagation();
                    });
                }
            });
        };

        function showDetail(aData) {
            var modalInstance = $modal.open({
                templateUrl: 'StatisticsOfAreaModalContent.html',
                controller: 'ofarea_docModalInstanceCtrl',
                windowClass: 'modal-70-p',
                resolve: {
                    items: function () {
                        return aData;
                    }
                }
            });
        }

        //对数组进行排序并截取前12个
        function getPre(arr) {
            //arr.sort(function(a,b){
            //    return b.value- a.value;
            //});
            return arr.slice(0, 12);
        }

        var eChart, showOnJob = true;

        var InitChart = function(ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('main'), 'macarons');
            var option;


            $('#cityContent').css('visibility', 'hidden');
            $('#districtContent').css('visibility', 'hidden');

            $http.post(app.url.yiliao.doctorArea, {
                "access_token": access_token,
                "groupId": curGroupId,
                "showOnJob": showOnJob,
                "areaId": "",
                "pageSize": 100,
                "pageIndex": 0
            }).success(function (res) {
                if (res.resultCode == 1) {
                    initProTable(res);
                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },

                        series: [{
                            itemStyle: {
                                normal: {
                                    label: {
                                        // formatter:"{b} : {c}({d}%)",
                                        formatter: "{b} : {c}",
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            name: '省级',
                            type: 'pie',
                            radius: '25%',
                            center: ['50%', '17%'],

                            data: getPre(res.data)
                        }]
                    };

                    // 为echarts对象加载数据
                    myChart.setOption(option, true);
                } else {
                    alert(res.resultMsg);
                }
            }).error(function (reponse) {
                alert(reponse);
            });

            var ecConfig = require('echarts/config');

            myChart.on(ecConfig.EVENT.CLICK, function (param) {
                if (param.data.id == undefined) {
                    return;
                }
                var name = param.name;
                if (param.seriesName == '省级') {
                    document.getElementById('curProvince').innerHTML = param.name;
                    $('#cityContent').css('visibility', 'visible');
                    $('#districtContent').css('visibility', 'hidden');
                    document.getElementById('curCity').innerHTML = '';
                    $http.post(app.url.yiliao.doctorArea, {
                        "access_token": access_token,
                        "groupId": curGroupId,
                        "showOnJob": showOnJob,
                        "areaId": param.data.id,
                        "pageSize": 100,
                        "pageIndex": 0
                    }).success(function (res) {
                        if (res.resultCode == 1) {
                            initCityTable(res);
                            option.series[1] = {
                                itemStyle: {
                                    normal: {
                                        label: {
                                            formatter: "{b} : {c}",
                                            show: true
                                        },
                                        labelLine: {
                                            show: true
                                        }
                                    }
                                },
                                name: '市级',
                                type: 'pie',
                                radius: '25%',
                                center: ['50%', '50%'],
                                data: getPre(res.data)
                            };
                            option.series[2] = {
                                itemStyle: {
                                    normal: {
                                        label: {
                                            formatter: "{b} : {c}",
                                            show: true
                                        },
                                        labelLine: {
                                            show: true
                                        }
                                    }
                                },
                                name: '区级',
                                type: 'pie',
                                radius: '25%',
                                center: ['50%', '85%'],
                                data: []
                            };
                            myChart.setOption(option, true);


                        } else {
                            alert(res.resultMsg);
                        }

                    }).
                    error(function (res) {
                        alert(res);
                    });
                } else if (param.seriesName == '市级') {
                    $('#districtContent').css('visibility', 'visible');
                    document.getElementById('curCity').innerHTML = param.name;
                    $http.post(app.url.yiliao.doctorArea, {
                        "access_token": access_token,
                        "groupId": curGroupId,
                        "showOnJob": showOnJob,
                        "areaId": param.data.id,
                        "pageSize": 100,
                        "pageIndex": 0
                    }).success(function (res) {
                        if (res.resultCode == 1) {
                            initDisTable(res);
                            option.series[2] = {
                                itemStyle: {
                                    normal: {
                                        label: {
                                            formatter: "{b} : {c}",
                                            show: true
                                        },
                                        labelLine: {
                                            show: true
                                        }
                                    }
                                },
                                name: '区级',
                                type: 'pie',
                                radius: '25%',
                                center: ['50%', '85%'],
                                data: getPre(res.data)
                            };
                            myChart.setOption(option, true);
                        } else {
                            alert(res.resultMsg);
                        }

                    }).
                    error(function (res) {
                        alert(res);
                    });
                }
            });
        };

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/pie'
            ],
            function (ec) {
                eChart = ec;
                InitChart(ec);
            });
    }]);


    app.controller('ofarea_docModalInstanceCtrl', ['$rootScope', '$scope', '$state', '$http', 'utils', '$modalInstance', 'items',function ($rootScope, $scope, $state, $http, utils, $modalInstance, items) {
        //console.log(items);
        $scope.rowInfo = items;

        var docsTable, _chk;
        var params;
        if (items.id) {
            params = {
                access_token: app.url.access_token,
                groupId: localStorage.getItem('curGroupId'),
                type: 3,
                showOnJob: $scope.rowInfo.showOnJob,
                typeId: items.id,
                pageIndex: 0,
                pageSize: 10
            };
        } else {
            params = {
                access_token: app.url.access_token,
                groupId: localStorage.getItem('curGroupId'),
                type: 3,
                showOnJob: $scope.rowInfo.showOnJob,
                typeId: '',
                pageIndex: 0,
                pageSize: 10
            };
        }

        function initDocsTable() {
            var index = 0,
                length = 10,
                start = 0,
                size = 10;

            var setTable = function () {
                docsTable = $('#docsTable').DataTable({
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
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        console.log(sSource);
                        $.ajax({
                            "type": "post",
                            "url": sSource,
                            "dataType": "json",
                            "data": params,
                            "success": function (resp) {
                                if (resp.resultCode == 1) {
                                    var data = {};
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
                        "render": function (set, status, dt) {
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
                docsTable.off('page.dt').on('page.dt', function (e, settings) {
                    console.log('分页分页分页');
                    index = docsTable.page.info().page;
                    start = length * (index - 1);
                    console.log(index);
                    console.log(start);
                    params.pageIndex = index;
                })
                    .on('length.dt', function (e, settings, len) {
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

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
