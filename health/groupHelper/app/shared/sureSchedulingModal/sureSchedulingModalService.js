(function() {
    angular.module('app')
        .factory('sureSchedulingModalFactory', ['$http','$modal',function($http,$modal){
            return {
                openModal: openModal,
            };

            //´ò¿ªÄ£Ì¬¿ò
            function openModal(optionsEdit) {
                var modalInstance = $modal.open({
                    templateUrl: './app/shared/sureSchedulingModal/sureSchedulingModalView.html',
                    controller: 'SureSchedulingModalCtrl',
                    windowClass:'sureSchedulingModal',
                    backdrop: 'static',
                    resolve: {
                        optionsEdit:function(){
                            return optionsEdit;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItems) {
                    if(optionsEdit.callback){
                        optionsEdit.callback();
                    }
                });
            }
        }]);
})();
