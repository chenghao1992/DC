'use strict';
(function () {
    app.controller('communityNavCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams',
        function($rootScope, $scope, $http, utils, $state, toaster, $stateParams) {

            $scope.topTypeList = []; // 置顶类型

            // nav一级菜单展开项
            $scope.status = {
                open1: false,
                open2: false,
                open3: false
            }

            // 判断一级菜单是否展开
            if( $state.includes('app.community.list') ) {
                $scope.status.open1 = true;
            }
            if( $state.includes('app.community.banner') || $state.includes('app.community.column') ) {
                $scope.status.open2 = true;
            }
            if( $state.includes('app.community.checkPost') || $state.includes('app.community.checkComment') || $state.includes('app.community.checkReport') ) {
                $scope.status.open3 = true;
            }

            // 获取栏目列表(显示所有栏目、包括已隐藏的)
            $scope.funGetColumnList = function() {
                $http.post(app.url.community.allColumns, {
                    access_token: app.url.access_token
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.columnList = data.data;
                        if(!$stateParams.id && $state.includes('app.community.list')) {
                            $state.go('app.community.list', {id: data.data[0].id});
                            $stateParams.id = data.data[0].id;
                        }
                        $scope.curColumn = $stateParams.id;
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            // 获取置顶类型 (父controller暴露的对象子controller可以直接用)
            $scope.funGetTopType = function() {
                $http.post(app.url.community.queryTopList, {
                    access_token: app.url.access_token,
                    typeCode: 2
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.topTypeList = data.data;
                    } else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', '', "服务器繁忙，请稍后再试！");
                });
            }

            $scope.funGetColumnList();  // 获取栏目列表(显示所有栏目、包括已隐藏的)
            $scope.funGetTopType(); // 获取置顶类型

            // 栏目跳转
            $scope.funGoColumn = function(id) {
                $scope.curColumn = id;
                $state.go('app.community.list', {id: id});
            }
        }
    ]);

})();
