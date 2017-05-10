// ============================== signinService.js =================================
(function() {
    angular.module('app')
        .factory('NewPassWordFactory', NewPassWordFactory);

    function NewPassWordFactory($http,constants) {
        return {
            getRanCode: getRanCode
        };
        // 获取数据
        function getRanCode(param) {

            return $http.post(constants.api.shared.sendRanCode, param)
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
