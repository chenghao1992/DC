(function() {
    angular.module('app')
        .factory('ChatImgSelModalFactory', ChatImgSelModalFactory);


    ChatImgSelModalFactory.$inject = ['$http','$uibModal','constants'];

    function ChatImgSelModalFactory($http,$uibModal,constants) {
        return {
            openChatImgSelModal:openChatImgSelModal,
            findDoctorByDept: findDoctorByDept,
            getDiseaseTree: getDiseaseTree,
            getAllDepts: getAllDepts
        };


        //��ͼƬѡ��ģ̬��
        function openChatImgSelModal(imgs,guideId,size,callback){
            console.log(imgs);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/chatImgSelModal/chatImgSelModalTpl.html',
                controller: 'ChatImgSelModalInstanceCtrl',
                size: size,
                resolve: {
                    images: function () {
                        return imgs;
                    },
                    gId:function(){
                        return guideId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
                callback(selectedItems);
            }, function () {

            });
        }



        function getAllDepts(param) {

            return $http.post(constants.api.shared.getAllDepts, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        function findDoctorByDept(param) {

            return $http.post(constants.api.doctor.findDoctorByDept, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        function getDiseaseTree(param) {

            return $http.post(constants.api.shared.getDiseaseTree, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

    };


    // ��������
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data

            } catch (e) {

                if (e.type === undefined)
                    console.warn('��������û�� data �ֶ�')

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('����ʧ��');
        }


    };
    // ������
    function getListsFailed(error) {

        console.warn('����ʧ��.' + error.data);
    };

})();
