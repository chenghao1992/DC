/**
 * Created by Mcp on 2016/5/26.
 */
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};
var chatWebSocket,chatWsInterval;
(function() {
    angular.module('app')
        .controller('MainCtrl', MainCtrl);

    // 手动注入依赖
    MainCtrl.$inject = ['$scope','$state'];

    // 登录控制器
    function MainCtrl($scope,$state) {

        function initWs() {
            if(!$state.includes('app'))return;
            if (chatWebSocket)chatWebSocket.close();
            var tk = localStorage['enterprise_access_token'],
                url = imWsRoot + "websocket?access_token=" + tk;
            chatWebSocket = new WebSocket(url);
            chatWebSocket.onopen= function (e) {
                //console.log("web socket open:",e);
                if(!chatWsInterval)chatWsInterval=setInterval(function(){
                    chatWebSocket.send("ping");
                },40000);
            }
            chatWebSocket.onmessage = function (e) {
                //console.log("web socket msg:",e);
                var obj = JSON.parse(e.data);
                if (obj.cmd == "message" ) {
                    $scope.$broadcast("order_new_msg");
                    //$scope.$apply(function(){
                    //    $scope.feedback.state[type]=1;
                    //    checkFeedbackState();
                    //});
                    //$scope.$broadcast("feedback_new_msg",type);
                }else if( obj.cmd == "event"){
                    $scope.$broadcast("order_new_event");
                }
            }
            chatWebSocket.onerror=function(e){
                //console.log("web socket err:",e);
            }
            chatWebSocket.onclose=function(e){
                //console.log("web socket close:",e);
                if(chatWsInterval){
                    clearInterval(chatWsInterval);
                    chatWsInterval=null;
                }
                if(e.code==1006)return;
                initWs();
            }
        }

        initWs();
    }
})();
