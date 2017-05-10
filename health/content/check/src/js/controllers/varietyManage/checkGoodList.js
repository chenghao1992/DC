'use strict';
(function() {

//品种审核列表
angular.module('app').controller('VarietyCheckListCtrl', VarietyCheckListCtrl);
VarietyCheckListCtrl.$inject = ['$rootScope', '$scope', '$modal', '$http', 'utils', 'toaster', '$stateParams'];
function VarietyCheckListCtrl($rootScope, $scope, $modal, $http, utils, toaster, $stateParams) {
    //初始化参数
    var access_token = app.url.access_token,
        url = 'http://192.168.3.7/org/goods/getUncheckedGoodsList';

    //初始化翻页数据
    $scope.pageSize = 10;

    var pi = utils.localData('varietyCheckPageIndex');
    var kw = utils.localData('varietyCheckKeyWord');
    $scope.pageIndex = !pi ? 1 : pi;
    $scope.keyWord = kw;

    //初始化品种审核列表
    $scope.InitTable = function(pageIndex, pageSize, keyWord) {
        $scope.pageIndex = pageIndex + 1;
        utils.localData('varietyCheckPageIndex', $scope.pageIndex);
        $http.post(app.url.VartMan.getUncheckedGoodsList, {
            access_token: app.url.access_token,
            keyword: keyWord || '',
            pageSize: pageSize,
            pageIndex: pageIndex,
            source: 0
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.data = data.data;
        
            }
        }).error(function(e) {
            console.log(e)
        })
    };
    $scope.InitTable($scope.pageIndex-1, $scope.pageSize, $scope.keyWord);

    // 保存keyword的值
    $scope.keyWordKeep = function(keyWord) {
        keyWord === '' && !(keyWord = null);
        utils.localData('varietyCheckKeyWord', keyWord);
    }

    // 跳转到其他页面清空对应的本地存储
    $scope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            if (toState.name.indexOf('VarietyManage.check') == -1) {
                utils.localData('varietyCheckPageIndex', null);
                utils.localData('varietyCheckKeyWord', null);
            }
        }
    );

    //翻页
    $scope.pageChanged = function() {
        // pagination分页bug， 当初始pageIndex大于1时会默认执行pageChanged并将pageIndex置为1。
        // 当初始pageIndex大于1，通过pi获取的store值将index赋值期望的值后，务必将pi赋值0，以保证分页正确切换。
        if(pi !== null && pi != 1){
            $scope.pageIndex = pi;
            pi = null;
        }
        utils.localData('varietyCheckPageIndex', $scope.pageIndex);
        $scope.InitTable($scope.pageIndex-1, $scope.pageSize, $scope.keyWord);
    };

};

})();
