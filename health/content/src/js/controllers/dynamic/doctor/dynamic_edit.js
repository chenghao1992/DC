/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('doctorDynamicEditCtrl', funDynamicSendMsgCtrl);

    funDynamicSendMsgCtrl.$inject = ['$scope', '$http', '$state', 'toaster','$stateParams','$modal'];

    function funDynamicSendMsgCtrl($scope, $http, $state, toaster,$stateParams,$modal) {
        var curGroupId = localStorage.getItem('curGroupId');
          

       
    }

})();
