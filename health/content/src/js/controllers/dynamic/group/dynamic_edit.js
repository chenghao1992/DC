/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('dynamicEditCtrl', funDynamicEditCtrl);

    funDynamicEditCtrl.$inject = ['$scope', '$http', '$state', 'toaster'];

    function funDynamicEditCtrl($scope, $http, $state, toaster) {
        var curGroupId = localStorage.getItem('curGroupId');
        

        $scope.curPubName=localStorage.getItem("curNameType")+JSON.parse(localStorage.getItem('curPubMsg')).nickName;

    }

})();
