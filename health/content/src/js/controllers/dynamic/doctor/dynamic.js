/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('dynamicCtrl', funDynamicCtrl);

    funDynamicCtrl.$inject = ['$scope', '$http', '$state', 'toaster'];

    function funDynamicCtrl($scope, $http, $state, toaster) {
        var curGroupId = localStorage.getItem('curGroupId');
        var getDynamicList = function() {
            $http.post(app.url.pubMsg.getPubListByMid, {
                access_token: app.url.access_token,
                mid: curGroupId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.dynamicList = data.data;
                } else {
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        }
        getDynamicList();

    }

})();
