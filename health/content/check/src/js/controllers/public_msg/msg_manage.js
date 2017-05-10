'use strict';
(function() {

angular.module('app').controller('MsgManCtrl', MsgManCtrl);
MsgManCtrl.$inject = ['$scope', '$http', '$stateParams'];
function MsgManCtrl($scope,$http,$stateParams) {

    $scope.curPubName=JSON.parse(localStorage.getItem('curPubMsg')).name;
};

})();