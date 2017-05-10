(function() {
    angular.module('app')
        .factory('ChangePwdModalFactory', ChangePwdModalFactory);

    // 手动注入依赖

    ChangePwdModalFactory.$inject = ['$http','$uibModal','constants'];

    function ChangePwdModalFactory($http,$uibModal,constants) {
        return {
            openChangePwdModal:openChangePwdModal
        };

        //打开图片选择模态框
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
