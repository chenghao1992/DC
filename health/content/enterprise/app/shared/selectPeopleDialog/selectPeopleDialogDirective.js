(function() {
    angular.module('app')
        .directive('selectPeopleDialog', selPeopleDialog);

    function selPeopleDialog() {
        return {
            scope: {
                open: '=',
                goRunning: '=',
                func: '=',
            },
            templateUrl: 'app/shared/selectPeopleDialog/selectPeopleDialogView.html',
            controller: 'SelectPeopleDialogCtrl',
        }
    }
})();
