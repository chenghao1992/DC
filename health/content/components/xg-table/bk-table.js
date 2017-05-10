(function() {

    angular.module('app')
        .directive('bkTable', funBkTable);

    funBkTable.$inject = ['$filter', '$http'];

    function funBkTable($filter, $http) {
        return {
            restrict: 'AE',
            template: '<div>' +
            '<div style="margin: 10px;display: inline-block;" ng-show="showLengthMenu">' +
            '<label for="p_num">每页</label>' +
            '<select id="p_num" style="width: 50px;height: 30px;border-color:#CFD1D2;margin-left: 5px;margin-right: 5px;" ng-model="itemPerPage" >' +
            '<option ng-repeat="item in lengthMenu track by $index" value="{{item}}">{{item}}</option>' +
            '</select>' +
            '<span>条</span>' +
            '</div>' +
            '<div class="input-group" ng-show="searching" style="width: 300px;float: right;margin-top: 7px;margin-right: 5px;">' +
            '<input type="search"  class="form-control ng-pristine ng-untouched ng-valid" placeholder="搜索" ng-enter="search()" ng-model="searchText">' +
            '<span class="input-group-btn">' +
            '<button class="btn btn-default" type="button"  ng-click="search()">搜索</button>' +
            '</span>' +
            '</div>' +
            '<ng-transclude></ng-transclude>' +
            '<div ng-show="data.length>0">' +
            '<span style="display: inline-block; margin-top:10px;margin-left: 5px;">当前第 {{startItem}} - {{endItem}} 条，共 {{totalItems}} 条</span>' +
            '<pagination style="margin:10px 0;float: right" total-items="totalItems" ng-change="pageChanged()" items-per-page="itemPerPage" ng-model="currentPage" max-size="maxSize" class="pagination-sm" boundary-links="true" first-text="首页" last-text="尾页" previous-text="<" next-text=">"></pagination>' +
            '</div>' +
            '<p ng-hide="data.length>0" style="height:50px;line-height:50px;margin-left: 10px;">没有数据</p>' +
            '<div style="clear:both;"></div>' +
            '</div>',
            scope: {
                lengthMenu: '=',
                searching: '=',
                url: '=',
                params: '=',
                searchUrl: '=?',
                searchParams: '=?',
                searchKey: '=?',
                outputData:'='
            },
            transclude: true,
            link: function($scope, element, attr) {
                $scope.itemPerPage = 10;
                $scope.showLengthMenu = false;
                $scope.maxSize = 5;
                if ($scope.lengthMenu && Array.isArray($scope.lengthMenu)) {
                    var isNum = true;
                    $scope.lengthMenu.forEach(function(item, index, array) {
                        if (typeof item !== 'number') {
                            isNum = false;
                        }
                    });
                    if (isNum == true) {
                        // console.log($scope.lengthMenu[0]);
                        $scope.itemPerPage = $scope.lengthMenu[0].toString();
                        $scope.showLengthMenu = true;

                    }
                }


                $scope.$watch('itemPerPage', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var filteredData = $filter('filter')($scope.data, $scope.searchText);
                        init(filteredData);
                    }
                });


                $scope.$watch('params', function(newValue, oldValue) {
                    // console.log($scope.params);

                    if (newValue !== oldValue) {

                        init();
                    }
                });

                $scope.search = function() {
                    $scope.currentPage = 0;
                    getData($scope.currentPage, $scope.itemPerPage);
                };

                init();

                function init() {
                    $scope.currentPage = 0;
                    getData($scope.currentPage, $scope.itemPerPage);
                };

                function getData(pageIndex, pageSize) {
                    $scope.data=[];
                    if ($scope.searchKey) {
                        delete $scope.params[$scope.searchKey];
                    }
                    if ($scope.searchText) {
                        $scope.params.pageIndex = pageIndex;
                        $scope.params.pageSize = pageSize;
                        $scope.params[$scope.searchKey] = $scope.searchText;
                        $http.post($scope.searchUrl, $scope.params).then(function(rpn) {
                            if (rpn.data.resultCode === 1) {
                                if(rpn.data.data){
                                    $scope.outputData=angular.copy(rpn.data.data.pageData);
                                    $scope.data = rpn.data.data.pageData;

                                    $scope.totalItems = rpn.data.data.total;

                                    $scope.startItem = pageIndex * pageSize + 1;
                                    $scope.endItem = (pageIndex + 1) * pageSize > $scope.totalItems ? $scope.totalItems : (pageIndex + 1) * pageSize;
                                }

                            } else {
                                console.log(rpn.data.resultMsg);
                            }
                        });
                    } else {
                        $scope.params.pageIndex = pageIndex;
                        $scope.params.pageSize = pageSize;
                        $http.post($scope.url, $scope.params).then(function(rpn) {
                            if (rpn.data.resultCode === 1) {
                                if(rpn.data.data){
                                    $scope.outputData=angular.copy(rpn.data.data.pageData);
                                    $scope.data = rpn.data.data.pageData;
                                    $scope.totalItems = rpn.data.data.total;

                                    $scope.startItem = pageIndex * pageSize + 1;
                                    $scope.endItem = (pageIndex + 1) * pageSize > $scope.totalItems ? $scope.totalItems : (pageIndex + 1) * pageSize;
                                }
                            } else {
                                console.log(rpn.data.resultMsg);
                            }
                        });
                    }

                }

                $scope.pageChanged = function() {
                    getData($scope.currentPage - 1, $scope.itemPerPage);
                };
            }
        };
    };
})();
