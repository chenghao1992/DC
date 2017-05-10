/**
 * Created by clf on 2016/3/28.
 */
(function() {
    angular.module('app')
        .factory('searchDoctorModalFactory', ['$http','$modal',function($http,$modal){
            return {
                openModal: openModal,
            };

            //´ò¿ªÄ£Ì¬¿ò
            function openModal(options) {
                var modalInstance = $modal.open({
                    templateUrl: '../components/searchDoctorModal/searchDoctorModalView.html',
                    controller: 'SearchDoctorModalCtrl',
                    windowClass:'searchDocModal',
                    resolve: {
                        options:function(){
                            return options;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItems) {
                    if(options.callback){
                        options.callback(selectedItems);
                    }
                });
            }
        }]);
})();
