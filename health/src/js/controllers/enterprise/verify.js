'use strict';
(function() {
    
// 公司申请控制器
angular.module('app').controller('verifyCtrl', verifyCtrl);
verifyCtrl.$inject = ['$scope','$http','$state'];
  function verifyCtrl($scope,$http,$state) {
    var company = JSON.parse(localStorage.getItem('company'));
    console.log(company);
    if(company.checkRemarks){
        $scope.problem = company.checkRemarks;
    }
    $scope.verifyState = company.status;
};

})();

