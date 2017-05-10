(function() {
    angular.module('app')
        .factory('ChangePwdModalFactory', ChangePwdModalFactory);

    // �ֶ�ע������

    ChangePwdModalFactory.$inject = ['$http','$uibModal','constants'];

    function ChangePwdModalFactory($http,$uibModal,constants) {
        return {
            openChangePwdModal:openChangePwdModal
        };

        //��ͼƬѡ��ģ̬��
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
