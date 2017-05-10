// ============================== orderService.js =================================
(function() {
    angular.module('app').factory('ChatFactory', ChatFactory);

    // 手动注入依赖
    ChatFactory.$inject = ['$http','constants','AppFactory'];

    function ChatFactory($http,constants,AppFactory) {
        return {
            getOrderList: getOrderList,
            getOrder: getOrder,
            getChatPeopleList: getChatPeopleList,
            getWindowData: getWindowData,
            closeOrder: closeOrder,
            sendMsg: sendMsg,
            getOrderDisease: getOrderDisease,
            callByTel: callByTel,
            savePatientInfo:savePatientInfo,
            findOrderDisease:findOrderDisease,
            retractMsg:retractMsg,
        };

        // 获取病情资料
        function getOrderDisease(param) {

            return $http.post(constants.api.order.getOrderDisease, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 拨打电话
        function callByTel(param) {

            return $http.post(constants.api.order.callByTel, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 获取订单列表
        function getOrderList(param) {

            return $http.post(constants.api.order.waitOrderList, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 接单
        function getOrder(param) {

            return $http.post(constants.api.order.getOrder, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 获取对话人列表
        function getChatPeopleList(param) {

            return $http.post(constants.api.order.chartLists, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 获取对话内容
        function getWindowData(param) {

            //return $http.post(constants.api.im.getMsgList, param)
            return $http({
                url: constants.api.im.getMsgList,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                    //'Content-Type': 'application/json'
                },
                data: param
            })
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 结束服务
        function closeOrder(param) {

            return $http.post(constants.api.order.closeOrder, param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        // 发送消息
        function sendMsg(param) {

            //return $http.post(constants.api.im.sendMsg, param)
            return $http({
                url: constants.api.im.sendMsg,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                },
                data: param
            })
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        //自动保存患者资料
        function savePatientInfo(param){
            return $http.post('savePatientInfo',param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        //获取患者病历（右边栏）
        function findOrderDisease(param){
            return $http.post(constants.api.order.findOrderDiseaseAndRemark,param)
                .then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

        //撤回
        function retractMsg(item){
            return $http({
                url: constants.api.im.retractMsg,
                method: 'post',
                headers: {
                    'access-token': localStorage['enterprise_access_token'],
                },
                data: {
                    msgId:item.msgId,
                    gid:item.groupId,
                }
            }).then(AppFactory.getListsComplete)
                .catch(AppFactory.getListsFailed);
        }

    }

    angular.module('app').directive('reloadImage', function(){
        return{
            controller: function($scope, $element){
            },
            link: function postLink($scope, iElement, iAttrs) {
                iElement.bind('error', function() {
                    var src=$(iElement).attr("src")
                        ,defPic="http://default.test.file.dachentech.com.cn/user/default.jpg_small";
                    if(src==defPic)return;
                    if(src!=iAttrs.ngSrc){
                        $(iElement).attr("src", defPic);
                        return;
                    }else{
                        $(iElement).attr("src", defPic);
                        setTimeout(function () {
                            $(iElement).attr("src", iAttrs.ngSrc+"?"+new Date().getTime());
                            //return true;
                        }, 1000);
                    }
                });
            }
        }

    });
    angular.module('app').directive('chatMsg', function(){
        return{
            scope:{
                showMsgMenu:"=",
                chatMsg:"="
            },
            controller: function($scope, $element){
            },
            link: function postLink($scope, iElement, attrs) {
                iElement.bind('contextmenu', function(event) {
                    event.preventDefault();
                    $scope.showMsgMenu($scope.chatMsg);
                });
            }
        }

    });

})();
