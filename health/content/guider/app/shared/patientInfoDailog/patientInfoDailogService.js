(function() {
    angular.module('app')
        .factory('PatientInfoDailogFtory', PatientInfoDailogFtory);

    // 手动注入依赖
    PatientInfoDailogFtory.$inject = ['$http','constants'];

    function PatientInfoDailogFtory($http,constants) {
        return {
            getRemarks: getRemarks,
            setRemarks: setRemarks,
            getUserInfo: getUserInfo
        };

        // 获取备注
        function getUserInfo(param) {

            return $http.post(constants.api.order.getUserInfo, param)
                .then(getListsComplete)
                .catch(getListsFailed);

        };

        // 获取备注
        function getRemarks(param) {

            return $http.post(constants.api.shared.getRemarks, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 修改备注
        function setRemarks(param) {

            return $http.post(constants.api.shared.setRemarks, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };
    };


    // 处理数据
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data

            } catch (e) {

                if (e.type === undefined)
                    console.warn('返回数据没有 data 字段')

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('请求失败');
        }


    };
    // 检测错误
    function getListsFailed(error) {

        console.warn('请求失败.' + error.data);
    };

})();
