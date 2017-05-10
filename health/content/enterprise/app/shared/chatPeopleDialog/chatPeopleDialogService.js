(function() {
    angular.module('app')
        .factory('ChatPeopleDialogFactory', ChatPeopleDialogFactory);

    // 手动注入依赖
    ChatPeopleDialogFactory.$inject = ['$http','$uibModal','constants','AppFactory'];

    function ChatPeopleDialogFactory($http,$uibModal,constants,AppFactory) {
        return {
            openModal:openModal,
            removePerson:_removePerson,
            changeGroupName:_changeGroupName,
            setGroupTop:setGroupTop,
        };

        function openModal(doctorId, gId,type,callback) {
            var data = {};
            data.gId = gId;
            data.type = type;

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

        function _removePerson(param) {
            return $http({
                url: constants.api.im.delGroupUser,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                },
                data: param
            }).then(AppFactory.getListsComplete).catch(AppFactory.getListsFailed);
        };
        function _changeGroupName(param) {
            return $http({
                url: constants.api.im.changeGroupName,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                },
                data: param
            }).then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        };
        function setGroupTop(param) {
            return $http({
                url: constants.api.im.groupTop,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                },
                data: param
            }).then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        };


        //// 检测错误
        //function getListsFailed(error) {
        //
        //    console.warn('请求失败.' + error.data);
        //};
        //
        //// 处理数据
        //function getListsComplete(response) {
        //
        //    var reData = response.data;
        //    if (reData.resultCode === 1) {
        //        try {
        //            return reData.data
        //        } catch (e) {
        //            if (e.type === undefined)
        //                console.warn('返回数据没有 data 字段')
        //            console.warn(e);
        //        }
        //    } else if (reData.resultMsg) {
        //        console.warn(reData.resultMsg);
        //        toaster.pop('error',null,reData.resultMsg);
        //    } else {
        //        console.warn('请求失败');
        //    }
        //
        //};

    };



})();
