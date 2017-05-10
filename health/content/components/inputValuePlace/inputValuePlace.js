'use strict';
(function() {
    angular.module('app').directive('inputValuePlace', funInputValuePlace);

    funInputValuePlace.$inject = []

    function funInputValuePlace() {

        return function(scope, element, attrs) {
            element.bind('keypress', function(event) {
                var _long = (attrs.inputValuePlace-0);
                if (this.value && this.value.length > _long) {
                    var value = this.value.toString();
                    this.value = value.substring(0, _long);
                }
            });
        }
    }
})();
