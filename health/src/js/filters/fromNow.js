'use strict';

/* Filters */
// need load the moment.js to use this filter.
(function () {
    angular.module('app')
        .filter('fromNow', function() {
            return function(date) {
                return moment(date).fromNow();
            }
        });
})();
