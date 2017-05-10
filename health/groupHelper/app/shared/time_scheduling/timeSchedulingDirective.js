(function() {
    angular.module('app')
        .directive('timeScheduling', timeScheduling);

    function timeScheduling() {
        return {
            scope: {
                open: '=',
                minuteStep: '@',
                hourStep: '@',
                minDate: '@',
                maxDate: '@',
                options: '@',
                callBack: '='
            },
            templateUrl: 'app/shared/time_scheduling/timeSchedulingView.html',
            controller: 'TimeSchedulingCtrl'
        }
    }

})();
