(function() {
    angular.module('app')
        .factory('SearchOffLineDoctorDialogFactory', SearchOffLineDoctorDialogFactory);

    // 手动注入依赖

    SearchOffLineDoctorDialogFactory.$inject = ['$http','constants','$uibModal'];

    function SearchOffLineDoctorDialogFactory($http,constants,$uibModal) {
        return {
            openModal: openModal
        };

        //打开模态框
        function openModal(options) {
            var modalInstance = $uibModal.open({
                templateUrl: './app/components/offline/searchOffLineDoctorDialog/searchOffLineDoctorDialogView.html',
                controller: 'SearchOffLineDoctorDialogModalInstanceCtrl',
                size: 'xl',
                resolve: {
                    options:options
                }
            });

            modalInstance.result.then(function (data) {
                if(options.callback){
                    options.callback(data);
                }
            });
        }
    };
})();
