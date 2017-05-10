(function() {
    angular.module('app')
        .factory('addAppointmentFactory', ['$http','$modal',function($http,$modal){
            return {
                openModal: openModal,
            };

            //��ģ̬��
            function openModal(options) {
                var modalInstance = $modal.open({
                    templateUrl: './app/components/offline/addAppointment/addAppointmentView.html',
                    controller: 'AddAppointmentCtrl',
                    size:'lg',
                    backdrop: 'static',
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
