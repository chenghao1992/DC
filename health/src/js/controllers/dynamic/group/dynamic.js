/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('dynamicCtrl', funDynamicCtrl);

    funDynamicCtrl.$inject = ['$scope', '$http', '$state', 'toaster'];

    function funDynamicCtrl($scope, $http, $state, toaster) {
        var curGroupId = localStorage.getItem('curGroupId');
        var getDynamicList = (function() {
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
        })();
        // getDynamicList();
        $scope.toManage = function(item) {
            localStorage.removeItem('curPubMsg');
            localStorage.setItem('curPubMsg', JSON.stringify(item));

            if (item.rtype == 'pub_1') {
                localStorage.setItem('curNameType', '患者动态');
                $state.go('app.dynamic.edit.sendMsg', { id: item.pid});


            } else {
                localStorage.setItem('curNameType', '集团通知');
                $state.go('app.public_msg.group.msg_manage.send_msg', { id: item.pid });

            }

            
        };

    }

})();
