(function() {
    angular.module('app')
        .directive('chatPeopleDialog', chatPeopleDialog);

    function chatPeopleDialog() {
        return {
            scope: {
                open: '=',
                goRunning: '=',
            },
            templateUrl: 'app/shared/chatPeopleDialog/chatPeopleDialogView.html',
            controller: 'ChatPeopleDialogCtrl',
        }
    }
})();
