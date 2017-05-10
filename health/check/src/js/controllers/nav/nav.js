'use strict';
(function() {

angular.module('app').controller('navCtrl', navCtrl);
navCtrl.$inject = ['$scope', '$http', 'utils'];
function navCtrl($scope, $http, utils) {
        $('#order_undo').html(utils.localData('order_undo'));
};

})();