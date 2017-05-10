'use strict';

(function(){
    app.controller('MsgManCtrl',funcMsgManCtrl);
    funcMsgManCtrl.$inject=['$scope','$http','$stateParams'];
    function funcMsgManCtrl($scope,$http,$stateParams) {
        $scope.curPubName='集团通知_'+JSON.parse(localStorage.getItem('curPubMsg')).nickName;

    }
})();

