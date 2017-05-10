// ============================== signinService.js =================================
(function() {
    angular.module('app')
        .factory('SigninFactory', SigninFactory);

    function SigninFactory($http,constants) {
        return {
            getData: getData,
            getUserInfo:getUserInfo,
        };
        // 获取数据
        function getData(param) {

            return $http.post(constants.api.enterprise.signin.signIn, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {
                return response.data;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        };
        // 获取数据
        function getUserInfo(param) {

            return $http.post(constants.api.enterprise.signin.getLoginInfo, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {
                return response.data;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        };
    }

})();
