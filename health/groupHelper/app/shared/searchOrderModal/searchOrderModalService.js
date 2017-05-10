(function() {
    angular.module('app')
        .factory('searchOrderModalFactory', ['$http','$modal',function($http,$modal){
            return {
                openModal: openModal,
            };

            //´ò¿ªÄ£Ì¬¿ò
            function openModal(options) {
                var modalInstance = $modal.open({
                    templateUrl: './app/shared/searchOrderModal/searchOrderModalView.html',
                    controller: 'SearchOrderModalCtrl',
                    windowClass:'searchOrderModal',
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
