(function() {
    angular.module('app')
        .factory('OrderHistoryFactory', OrderHistoryFactory);

    // 手动注入依赖
    OrderHistoryFactory.$inject = ['$http','constants'];

    function OrderHistoryFactory($http,constants) {
        return {
            getWindowData: getWindowData,
            orderList: orderList,
            getOrderDisease: getOrderDisease
        };

        // 获取病情资料
        function getOrderDisease(param) {

            return $http.post(constants.api.order.getOrderDisease, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取历史接单记录
        function orderList(param) {

            return $http.post(constants.api.order.orderList, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取对话内容
        function getWindowData(param) {

            //return $http.post(constants.api.im.getMsgList, param)
            return $http({
                url: constants.api.im.getMsgList,
                method: 'post',
                headers: {
                    'access-token': localStorage['guider_access_token'],
                    //'Content-Type': 'application/json'
                },
                data: param
            })
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
