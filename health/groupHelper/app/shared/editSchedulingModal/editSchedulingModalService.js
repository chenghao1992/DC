(function() {
    angular.module('app')
        .factory('editSchedulingModalFactory', ['$http','$modal', function($http, $modal){
            return {
                openModal: openModal,
            };

            //´ò¿ªÄ£Ì¬¿ò
            function openModal(options) {
                var modalInstance = $modal.open({
                    templateUrl: './app/shared/editSchedulingModal/editSchedulingModalView.html',
                    controller: 'EditSchedulingModalCtrl',
                    windowClass:'editSchedulingModal',
                    backdrop: 'static',
                    resolve: {
                        options:function(){
                            return options;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    if(options.callback){
                        options.callback();
                    }
                });
            }
        }]);
})();
