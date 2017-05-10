(function() {
    angular.module('app')
        .controller('AppCtrl', AppCtrl)

    function AppCtrl() {
        app.url = {};
        app.url.access_token = localStorage['groupHelper_access_token'];
    }

})();
