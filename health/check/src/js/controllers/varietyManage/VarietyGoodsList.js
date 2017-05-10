'use strict';
(function() {

//品种库管理
angular.module('app').controller('VarietyGoodsListCtrl', VarietyGoodsListCtrl);
VarietyGoodsListCtrl.$inject = ['$rootScope','$scope','$modal','$http','utils','toaster','$stateParams'];
function VarietyGoodsListCtrl($rootScope,$scope,$modal,$http,utils,toaster,$stateParams) {
    //初始化参数
    var access_token=app.url.access_token,
        url='http://192.168.3.7/org/goods/getGoodsListByGroupId';

    var groupId=$stateParams.groupId;

    //初始化翻页数据
    $scope.pageSize = 10;
    $scope.pageIndex = 0;
    $scope.keyword = null;
    //初始化药企列表
    $scope.InitTable=function(pageIndex,pageSize,keyWord){
        $http.post(app.url.VartMan.getGoodsListByGroupId, {
            access_token:app.url.access_token,
            keyword:keyWord,
            pageSize:pageSize,
            pageIndex:pageIndex,
            groupId:groupId,
            source:0
        }).success(function(data) {
            if(data.resultCode==1){
                $scope.data=data.data;
                console.log($scope.data);
            }
        }).error(function(e){
            console.log(e)
        })
    };
    $scope.InitTable(0,10,'');

    //翻页
    $scope.pageChanged=function(){
        $scope.InitTable($scope.pageIndex-1, $scope.pageSize, $scope.keyWord);
    };


};

})();
