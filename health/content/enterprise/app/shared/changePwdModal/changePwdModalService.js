(function() {
    angular.module('app')
        .factory('ChangePwdModalFactory', ChangePwdModalFactory);

    ChangePwdModalFactory.$inject = ['$http','$uibModal','constants'];

    function ChangePwdModalFactory($http,$uibModal,constants) {
        return {
            openChangePwdModal:openChangePwdModal
        };

        function openChangePwdModal(size){
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/changePwdModal/changePwdModalTpl.html',
                controller: 'ChangePwdModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function () {
                }, function () {
            });
        }
    };
})();
