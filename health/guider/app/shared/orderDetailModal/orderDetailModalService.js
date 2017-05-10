(function() {
    angular.module('app')
        .factory('orderDetailModalFactory', ['$http','$modal',function($http,$modal){
            return {
                openModal: openModal,
            };

            //´ò¿ªÄ£Ì¬¿ò
            function openModal(options) {
                var modalInstance = $modal.open({
                    templateUrl: './app/shared/orderDetailModal/orderDetailModalView.html',
                    controller: 'OrderDetailModalCtrl',
                    size:'lg',
                    //windowClass:'searchOrderModal',
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
