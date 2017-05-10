// ============================== navService.js =================================
(function() {
    angular.module('app')
        .factory('AppNavFactory', AppNavFactory);

    // 手动注入依赖
    AppNavFactory.$inject = ['$http', '$state','constants'];

    function AppNavFactory($http, $state,constants) {
        return {
            signOut: _signOut,
        };
        // 获取数据
        function _signOut(param) {
            return $http.post(constants.api.shared.signOut, param)
                .then(getDataComplete)
                .catch(getDataFailed);

            // 处理数据
            function getDataComplete(response) {

                return response;
            };
            // 检测错误
            function getDataFailed(error) {
                console.error('请求失败.' + error.data);
            };
        };

    }

})();
