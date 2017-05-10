'use strict';
(function () {
    app.controller('columnCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', '$modal', 'toaster','$stateParams',
        function($rootScope, $scope, $http, utils, $state, $modal, toaster, $stateParams) {

            $scope.page = {
                size: 10,
                index: 1
            };
            $scope.columnTotal = 0;
            $scope.activeTab = [true,false];
            var funRefreshNav = $scope.$parent.$parent.funGetColumnList;
            // 切换栏目
            $scope.funChangeColumn = function(e) {
                $scope.columnList = [];
                var param = e == 0 ? {
                    access_token: app.url.access_token,
                    enable: e,
                    pageIndex: 0,
                    pageSize: 99999
                } : {
                    access_token: app.url.access_token,
                    enable: e,
                    pageIndex: $scope.page.index - 1,
                    pageSize: $scope.page.size
                };

                $http.post(app.url.community.columns, param).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.columnList = data.data.pageData;
                        if($scope.columnList === null) {
                            $scope.columnList = [];
                        }
                        e != 0 && !($scope.columnTotal = data.data.total);
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 改变分页数(只有停用的有分页)
            $scope.funPageSizeChange = function() {
                $scope.page.index = 1;
                $scope.funChangeColumn(1); // 只有已停用的页面有分页
            }

            // 分页页数选择
            $scope.pageChange = function() {
                $scope.funChangeColumn(1); // 只有已停用的页面有分页
            }

            // 标记或取消标记栏目
            $scope.markColumn = function(column) {
                $http.post(app.url.community.columnMark, {
                    access_token: app.url.access_token,
                    id: column.id,
                    sign: column.sign == 0 ? 1 : 0
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode == 1) {
                        var msg = column.sign == 0 ? '取消标记栏目成功！' : '标记栏目成功！';
                        var tabType = $scope.activeTab[0] == true ? 0 : 1;
                        toaster.pop('success', '', msg);
                        funRefreshNav(); // 更新nav
                        $scope.funChangeColumn(tabType);
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 启用或停用栏目
            $scope.enableColumn = function(column, e) {
                $http.post(app.url.community.columnOnOrOff, {
                    access_token: app.url.access_token,
                    id: column.id,
                    enable: e
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode == 1) {
                        var msg = e == 0 ? '启用栏目成功！' : '停用栏目成功！';
                        var tabType = $scope.activeTab[0] == true ? 0 : 1;
                        toaster.pop('success', '', msg);
                        funRefreshNav(); // 更新nav
                        $scope.funChangeColumn(tabType);
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 上移栏目
            $scope.upColumn = function(column) {
                $http.post(app.url.community.columnUp, {
                    access_token: app.url.access_token,
                    id: column.id
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode == 1) {
                        toaster.pop('success', '', '上移栏目成功！');
                        funRefreshNav(); // 更新nav
                        $scope.funChangeColumn(0); // 只有已启用的页面有上移操作
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 新增栏目
            $scope.funNewColumn = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'addColumn.html',
                    controller: 'addColumnModalCtrl',
                    size: 'md'
                });

                modalInstance.result.then(function(addObj) {
                    if (addObj.status == 'ok') {
                        $http.post(app.url.community.addColumn, {
                            access_token: app.url.access_token,
                            name: addObj.columnName
                        }).
                        success(function(data, status, headers, config) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', '', '新增栏目成功！');
                                funRefreshNav(); // 更新nav

                                // 新增默认跳到未启用页
                                if($scope.activeTab[0] == true) {
                                    $scope.activeTab[1] = true;
                                    $scope.page.index = 1;
                                } else {
                                    $scope.page.index = 1;
                                    $scope.funChangeColumn(1);
                                }
                            } else {
                                toaster.pop('error', '', data.resultMsg);
                            }
                        }).
                        error(function(data, status, headers, config) {
                            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                        });
                    }
                });
            }

            // 编辑栏目
            $scope.editColumn = function(column) {
                var modalInstance = $modal.open({
                    templateUrl: 'addColumn.html',
                    controller: 'editColumnModalCtrl',
                    size: 'md',
                    resolve: {
                        editColumn: function() {
                            return column;
                        }
                    }
                });

                modalInstance.result.then(function(editObj) {
                    if (editObj.status == 'ok') {
                        $http.post(app.url.community.columnRename, {
                            access_token: app.url.access_token,
                            id: column.id,
                            name: editObj.columnName
                        }).
                        success(function(data, status, headers, config) {
                            if (data.resultCode == 1) {
                                toaster.pop('success', '', '编辑栏目成功！');
                                funRefreshNav(); // 更新nav
                                var tabType = $scope.activeTab[0] == true ? 0 : 1;
                                $scope.funChangeColumn(tabType);
                            } else {
                                toaster.pop('error', '', data.resultMsg);
                            }
                        }).
                        error(function(data, status, headers, config) {
                            toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                        });
                    }
                });
            }
        }
    ]);

    app.controller('addColumnModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils',function($scope, $modalInstance, toaster, $http, utils) {
        $scope.titleLength = 0;
        $scope.columnTitle = "新建栏目";
        $scope.columnName = '';

        $scope.funGetLength = function(){
            if($scope.columnName){
                $scope.titleLength = $scope.columnName.length;
            } else {
                $scope.titleLength = 0;
            }
        };

        $scope.ok = function() {
            var addObj = {
                columnName: $scope.columnName.trim(),
                status: 'ok'
            }
            $modalInstance.close(addObj);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

    app.controller('editColumnModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'utils', 'editColumn',function($scope, $modalInstance, toaster, $http, utils, editColumn) {
        $scope.columnName = editColumn.name;
        $scope.titleLength = 0;
        $scope.columnTitle = "编辑栏目";

        $scope.funGetLength = function(){
            if($scope.columnName){
                $scope.titleLength = $scope.columnName.length;
            } else {
                $scope.titleLength = 0;
            }
        };
        $scope.funGetLength();

        $scope.ok = function() {
            var editObj = {
                columnName: $scope.columnName.trim(),
                status: 'ok'
            }
            $modalInstance.close(editObj);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();

