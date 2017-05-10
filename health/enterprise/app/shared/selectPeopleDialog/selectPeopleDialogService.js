(function() {
    angular.module('app')
        .factory('SelectPeopleDialogFactory', SelectPeopleDialogFactory);

    // 手动注入依赖
    SelectPeopleDialogFactory.$inject = ['$http','$uibModal','constants','AppFactory'];

    function SelectPeopleDialogFactory($http,$uibModal,constants,AppFactory) {
        return {
            openModal:openModal,
            createChat:createChat,
            addPerson:addPerson,
        };

        function openModal(doctorId, gId,type,callback) {
            var data = {};
            data.gId = gId;
            data.type = type;

            var size = '';


            var modalInstance = $uibModal.open({
                templateUrl: 'selectPeopleDialogBox.html',
                controller: 'SelectPeopleDialogModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    doctorId: doctorId,
                    data: data,
                    goRunning:null
                }
            });

            modalInstance.result.then(function (returnMsg) {
                if(callback){
                    callback();
                }
            }, function () {

            });
        };

        // 拨打电话
        //function callByTel(param) {
        //
        //    return $http.post(constants.api.order.callByTel, param)
        //        .then(AppFactory.getListsComplete)
        //        .catch(AppFactory.getListsFailed);
        //};
         //创建会话组
        function createChat(param) {

            return $http({
                url: constants.api.im.createGroup,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                    //'Content-Type': 'application/json'
                },
                data: param
            }).then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        };
         //创建会话组
        function addPerson(param) {

            return $http({
                url: constants.api.im.addGroupUser,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                    //'Content-Type': 'application/json'
                },
                data: param
            }).then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        };


    };

})();
