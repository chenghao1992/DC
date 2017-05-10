'use strict';
(function() {

    angular.module('app').controller('navCtrl', navCtrl);
    navCtrl.$inject = ['$scope', '$http', 'utils'];

    function navCtrl($scope, $http, utils) {

    	console.log(1)
        $('#order_undo').html(utils.localData('order_undo'));
    };

})();
