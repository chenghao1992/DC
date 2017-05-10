'use strict';
(function () {
    //医院列表
    app.controller('CompanyListCtrl', ['$rootScope', '$scope', '$state', '$http', '$compile', 'utils', '$modal', 'toaster', '$stateParams',function($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {
        //初始化参数
        var access_token = app.url.access_token,
            drugCompanyParam = '';
        //初始化翻页数据
        $scope.pageSize = 10;
        $scope.pageIndex = 0;
        $scope.keyWord = null;



        if ($stateParams.type == 'enterprise') {
            var url = app.url.compnMan.searchByDrugOrg;
            $scope.pageType = 0;
            $scope.comType = 0;

        } else {
            var url = app.url.compnMan.searchByDrugCompany
            $scope.pageType = 1;
            $scope.comType = 1;
            $('.group-mark').removeClass('mark-focus').eq(1).addClass('mark-focus');
        }

        //初始化药企列表
        $scope.InitTable = function(pageIndex, pageSize, keyWord) {

            var thisPageIndex = localStorage.getItem('ydPageIndex');
            var thisPageSize = localStorage.getItem('ydPageSize');
            var thisTitle = localStorage.getItem('ydPageTitle');
            var thisState = false;
            if (thisPageIndex == null || thisPageIndex == 'null') {
                thisState = true;
            }



            $http.post(url, {
                access_token: app.url.access_token,
                keyword: (thisTitle == null || thisTitle == 'null') ? keyWord : thisTitle,
                pageSize: (thisPageSize == null || thisPageSize == 'null') ? pageSize : thisPageSize,
                pageIndex: (thisPageIndex == null || thisPageIndex == 'null') ? pageIndex : thisPageIndex - 1
            }).success(function(data) {
                if (data.resultCode == 1) {
                    console.log(thisPageIndex);
                    if (!thisState) {
                        $scope.pageIndex = thisPageIndex;
                        $scope.pageSize = thisPageSize;
                        $scope.keyWord = thisTitle == 'null' ? '' : thisTitle;
                    }
                    localStorage.setItem('ydPageIndex', null);
                    localStorage.setItem('ydPageSize', null);
                    localStorage.setItem('ydPageTitle', null);
                    $scope.data = data.data;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(e) {
                console.log(e)
            })
        };
        $scope.InitTable(0, 10, '');

        // 翻页
        $scope.pageChanged = function() {
            $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.keyWord);
        };
        // 跳转到其他页面清空对应的本地存储
        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                if (toState.name.indexOf('ComMan') == -1) {
                    localStorage.setItem('ydPageIndex', null);
                    localStorage.setItem('ydPageSize', null);
                    localStorage.setItem('ydPageTitle', null);
                } else {
                    localStorage.setItem('ydPageIndex', $scope.pageIndex);
                    localStorage.setItem('ydPageSize', $scope.pageSize);
                    localStorage.setItem('ydPageTitle', $scope.keyWord);
                }
            }
        );

        // 切换企业管理/药店管理
        $scope.funPageType = function(type, e) {
            var evt = e || window.event;
            var target = evt.target || evt.srcElement;
            var marks = $('.group-mark');

            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.keyWord = '';

            if (target.nodeName != 'A') {
                if (target.nodeName != 'DIV') {
                    target = target.parentNode.parentNode;
                } else {
                    target = target.parentNode;
                }
            }
            evt.stopPropagation();
            evt.preventDefault();
            marks.removeClass('mark-focus');
            $(target).addClass('mark-focus');
            if ($scope.comType != type) {
                $scope.comType = type;
                $scope.data = {};
            }
            if (type == 0) {

                // $scope.data = {};
                $state.go('app.ComMan.list', { type: 'enterprise' });

            }
            if (type == 1) {
                // $scope.data = {};
                $state.go('app.ComMan.list', { type: 'store' });
            }
            $scope.pageType = type;
        };
    }]);


    app.filter('nospace', function() {
        return function(value) {
            var str = value.replace(/,/g, '');
            return (!value) ? '' : str.replace(/ /g, '');
        };
    });

})();
