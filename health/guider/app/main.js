/**
 * Created by Mcp on 2016/5/26.
 */
var orderWebSocket,orderWsInterval;
(function() {
    angular.module('app')
        .controller('MainCtrl', MainCtrl);

    // 手动注入依赖
    MainCtrl.$inject = ['$scope','$state'];

    // 登录控制器
    function MainCtrl($scope,$state) {

        function initWs() {
            if(!$state.includes('order'))return;
            if (orderWebSocket)orderWebSocket.close();
            var tk = localStorage['guider_access_token'],
                url = imWsRoot + "websocket?access_token=" + tk;
            orderWebSocket = new WebSocket(url);
            orderWebSocket.onopen= function (e) {
                //console.log("web socket open:",e);
                if(!orderWsInterval)orderWsInterval=setInterval(function(){
                    orderWebSocket.send("ping");
                },40000);
            }
            orderWebSocket.onmessage = function (e) {
                //console.log("web socket msg:",e);
                var obj = JSON.parse(e.data);
                if (obj.cmd == "message" || obj.cmd == "event") {
                    $scope.$broadcast("order_new_msg");
                    //$scope.$apply(function(){
                    //    $scope.feedback.state[type]=1;
                    //    checkFeedbackState();
                    //});
                    //$scope.$broadcast("feedback_new_msg",type);
                }
            }
            orderWebSocket.onerror=function(e){
                //console.log("web socket err:",e);
            }
            orderWebSocket.onclose=function(e){
                //console.log("web socket close:",e);
                if(orderWsInterval){
                    clearInterval(orderWsInterval);
                    orderWsInterval=null;
                }
                if(e.code==1006)return;
                initWs();
            }
        }

        initWs();
    }
})();
