(function() {
    angular.module('app')
        .controller('AppCtrl', AppCtrl)

    function AppCtrl() {
        app.url = {};
        app.url.access_token = localStorage['guider_access_token'];
    }

})();
