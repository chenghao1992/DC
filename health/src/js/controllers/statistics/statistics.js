'use strict';

(function(){
    app.controller('StatisticCtrl', ['$rootScope', '$scope', '$modal',function ($rootScope, $scope, $modal) {

        $scope.tabs = {};
        $scope.tabs.active = [true, false, false];

        $scope.refresh = [];

        $scope.tabs.byDisease = function(){
            $scope.ofDisease = true;
            setTimeout(function () {
                if(typeof $scope.refresh[0] === 'function'){
                    $scope.refresh[0]();
                }
            }, 50);
        };

        $scope.tabs.byTitle = function(){
            $scope.ofTitle = true;
            if(typeof $scope.refresh[1] === 'function'){
                $scope.refresh[1]();
            }
        };

        $scope.tabs.byArea = function(){
            $scope.ofArea = true;
            setTimeout(function () {
                if(typeof $scope.refresh[2] === 'function'){
                    $scope.refresh[2]();
                }
            }, 50);
        };

    }]);


    app.controller('StatisticsOfDisease', ['$rootScope', '$scope', '$state', '$http', 'utils', '$modal',function($rootScope, $scope, $state, $http, utils, $modal) {
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
            setTable = function(){
                var level_0_table = $('#level_0_table').DataTable({
                    "language": app.lang.datatables.translation,
                    "lengthMenu": [100],
                    //"bLengthChange": false,
                    "destroy": true,
                    "searching": false,
                    "paging": false,
                    "ordering": false,
                    data: res.data,
                    columns: [{
                        data: 'name',
                        render: function(data, type, row) {
                            if (row.name == undefined) {
                                return '';
                            } else {
                                return row.name;
                            }
                        }
                    }, {
                        data: 'value',
                        render: function(data, type, row) {
                            if (row.value == undefined) {
                                return '';
                            } else {
                                return row.value;
                            }
                        }
                    }, {
                        "render": function(set, status, dt) {
                            return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                        }
                    }],
                    "createdRow": function(nRow, aData, iDataIndex) {
                        $(nRow).on('click', '#showDetail', function(event) {
                            aData.showOnJob = showOnJob;
                            showDetail(aData);
                            event.stopPropagation();
                        });
                    }
                });

                /////////////////////////////////////////////////////////////////////

                _chk = $('#level_0_checkbox');

                if (chk_val) {
                    _chk.attr('checked', true);
                    chk_val = true;
                } else {
                    _chk.attr('checked', false);
                    chk_val = false;
                }

                function refresh() {
                    if (chk_val) {
                        chk_val = false;
                        showOnJob = false;
                    } else {
                        chk_val = true;
                        showOnJob = true;
                    }
                    InitChart(eChart);
                    level_0_table.destroy();
                    //setTable();
                }

                _chk.off().click(function () {
                    refresh();
                });

                $scope.$parent.refresh[0] = function () {
                    InitChart(eChart);
                    level_0_table.destroy();
                };
            };

            setTable();
        }


        function initCityTable(res) {
            var level_1_table = $('#level_1_table').DataTable({
                "destroy": true,
                "ordering": false,
                "searching": false,
                "paging": false,
                "language": app.lang.datatables.translation,
                //"lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "bLengthChange": false,
                data: res.data,
                columns: [{
                    data: 'name',
                    render: function(data, type, row) {
                        if (row.name == undefined) {
                            return '';
                        } else {
                            return row.name;
                        }
                    }
                }, {
                    data: 'value',
                    render: function(data, type, row) {
                        if (row.value == undefined) {
                            return '';
                        } else {
                            return row.value;
                        }
                    }
                }, {
                    "render": function(set, status, dt) {
                        return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                    }
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', '#showDetail', function(event) {
                        aData.showOnJob = showOnJob;
                        showDetail(aData);
                        event.stopPropagation();
                    });
                }
            });
        }

        function initDisTable(res) {
            var level_2_table = $('#level_2_table').DataTable({
                "language": app.lang.datatables.translation,
                "destroy": true,
                "ordering": false,
                "searching": false,
                "paging": false,
                //"lengthMenu": [5, 10, 15, 20, 30, 40, 50, 100],
                "bLengthChange": false,
                data: res.data,
                columns: [{
                    data: 'name',
                    render: function(data, type, row) {
                        if (row.name == undefined) {
                            return '';
                        } else {
                            return row.name;
                        }
                    }
                }, {
                    data: 'value',
                    render: function(data, type, row) {
                        if (row.value == undefined) {
                            return '';
                        } else {
                            return row.value;
                        }
                    }
                }, {
                    "render": function(set, status, dt) {
                        return '<button id="showDetail" class="btn btn-xs btn-primary">查 询</button>';
                    }
                }],
                "createdRow": function(nRow, aData, iDataIndex) {
                    $(nRow).on('click', '#showDetail', function(event) {
                        aData.showOnJob = showOnJob;
                        showDetail(aData);
                        event.stopPropagation();
                    });
                }
            });
        };

        function showDetail(aData) {
            console.log(aData);

            var modalInstance = $modal.open({
                templateUrl: 'StatisticeOfDiseaseContent.html',
                controller: 'statistics_of_disease_docModalInstanceCtrl',
                windowClass: 'modal-70-p',
                resolve: {
                    items: function() {
                        return aData;
                    }
                }
            });
        }

        //截取前12个
        function getPre(arr) {
            //arr.sort(function(a,b){
            //    return b.value- a.value;
            //});
            return arr.slice(0, 12);
        }

        var eChart, showOnJob = true;

        var InitChart = function(ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('disease_level'), 'macarons');
            var option;

            $('#level_1_content').css('visibility', 'hidden');
            $('#level_2_content').css('visibility', 'hidden');
            $http.post(app.url.yiliao.doctorDisease, {
                "access_token": access_token,
                "groupId": curGroupId,
                "showOnJob": showOnJob,
                "diseaseId": "",
                "pageSize": 100,
                "pageIndex": 0
            }).
            success(function(res) {
                console.log(res);

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
                            radius: '22%',
                            center: ['50%', '17%'],
                            data: res.data
                            //data: getPre(res.data)
                        }]
                    };

                    // 为echarts对象加载数据
                    myChart.setOption(option, true);
                } else {
                    alert(res.resultMsg);
                }
            }).
            error(function(reponse) {
                alert(reponse);
            });

            var ecConfig = require('echarts/config');

            myChart.on(ecConfig.EVENT.CLICK, function(param) {
                if (param.seriesName == '省级') {
                    $('#level_2_content').css('visibility', 'hidden');
                    document.getElementById('disease_level_1').innerHTML = '';
                    $http.post(app.url.yiliao.doctorDisease, {
                        "access_token": access_token,
                        "groupId": curGroupId,
                        "showOnJob": showOnJob,
                        "diseaseId": param.data.diseaseId,
                        "pageSize": 100,
                        "pageIndex": 0
                    }).success(function(res) {
                        if (res.resultCode == 1) {
                            if (res.data.length == 0) {
                                return;
                            }
                            document.getElementById('disease_level_0').innerHTML = param.name;
                            $('#level_1_content').css('visibility', 'visible');
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
                                radius: '22%',
                                center: ['50%', '50%'],
                                data: res.data
                                //data: getPre(res.data)
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
                                radius: '22%',
                                center: ['50%', '85%'],
                                data: []
                            };
                            myChart.setOption(option, true);


                        } else {
                            alert(res.resultMsg);
                        }

                    }).
                    error(function(res) {
                        alert(res);
                    });
                } else if (param.seriesName == '市级') {

                    $http.post(app.url.yiliao.doctorDisease, {
                        "access_token": access_token,
                        "groupId": curGroupId,
                        "showOnJob": showOnJob,
                        "diseaseId": param.data.diseaseId,
                        "pageSize": 100,
                        "pageIndex": 0
                    }).success(function(res) {
                        if (res.resultCode == 1) {
                            if (res.data.length == 0) {
                                return;
                            }
                            document.getElementById('disease_level_1').innerHTML = param.name;
                            $('#level_2_content').css('visibility', 'visible');
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
                                radius: '22%',
                                center: ['50%', '85%'],
                                data: res.data
                                //data: getPre(res.data)
                            };
                            myChart.setOption(option, true);
                        } else {
                            alert(res.resultMsg);
                        }

                    }).
                    error(function(res) {
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
            function(ec) {
                eChart = ec;
                InitChart(ec);
            });
    }]);


    app.controller('statistics_of_disease_docModalInstanceCtrl', ['$rootScope', '$scope', '$state', '$http', 'utils', '$modalInstance', 'items',function($rootScope, $scope, $state, $http, utils, $modalInstance, items) {
        //console.log(items);
        $scope.rowInfo = items;

        var docsTable;

        var params = {
            access_token: app.url.access_token,
            groupId: localStorage.getItem('curGroupId'),
            type: 1,
            showOnJob: $scope.rowInfo.showOnJob,
            typeId: items.diseaseId,
            pageIndex: 0,
            pageSize: 10
        };

        function initDocsTable() {
            var index = 0,
                length = 10,
                start = 0,
                size = 10;

            var setTable = function() {
                docsTable = $('#docsTableDisease').DataTable({
                    "language": app.lang.datatables.translation,
                    "searching": false,
                    "destroy": true,
                    "lengthChange": true,
                    "ordering": false,
                    "draw": index,
                    "pageLength": length,
                    "lengthMenu": [5, 10, 20, 50],
                    "bLengthChange": false,
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

                    function refresh() {
                        if(chk_val){
                            chk_val = false;
                            showOnJob = false;
                        }else{
                            chk_val = true;
                            showOnJob = true;
                        }
                        titleTable.destroy();
                        getTitleData();
                    }

                    _chk.off().click(function () {
                        refresh();
                    });

                    $scope.$parent.refresh[1] = function () {
                        titleTable.destroy();
                        getTitleData();
                    };
                }
            );
        };
    }]);


    app.controller('statistics_of_title_docModalInstanceCtrl', ['$rootScope', '$scope', '$state', '$http', 'utils', '$modalInstance', 'items',function($rootScope, $scope, $state, $http, utils, $modalInstance, items) {
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

                function refresh() {
                    if (chk_val) {
                        chk_val = false;
                        showOnJob = false;
                    } else {
                        chk_val = true;
                        showOnJob = true;
                    }
                    InitChart(eChart);
                    provinceTable.destroy();
                    //setTable();
                }

                _chk.off().click(function () {
                    refresh();
                });

                $scope.$parent.refresh[2] = function () {
                    InitChart(eChart);
                    provinceTable.destroy();
                };
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
