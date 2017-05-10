/**
 * Created by clf on 2015/11/24.
 */
'use strict';

(function(){
    app.controller('PublicMsgListCtrl',funcPublicMsgListCtrl);
    funcPublicMsgListCtrl.$inject=['$scope','$http','$state','$rootScope'];
    function funcPublicMsgListCtrl($scope,$http,$state,$rootScope) {
        var curGroupId=localStorage.getItem('curGroupId');
        var getPublicMsgList=function(){
            $http.post(app.url.pubMsg.getPubListByMid, {
                access_token:app.url.access_token,
                mid:curGroupId
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    //data.data.forEach(function(item,index,array){
                    //    if(item.rtype=='pub_3'||item.rtype=='pub_1'){
                    //        item.photourl=$rootScope.groupPicFile;
                    //    }
                    //    else{
                    //        if(item.photourl&&item.photourl.indexOf('/cert/')==0){
                    //            item.photourl=location.protocol+'//'+location.hostname+':8081'+item.photourl;
                    //        }
                    //    }
                    //});
                    $scope.pub_msg_list=data.data;
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        };

        getPublicMsgList();

        $scope.toManage=function(item){
            localStorage.removeItem('curPubMsg');
            localStorage.setItem('curPubMsg',JSON.stringify(item));

            if(item.rtype=='pub_1'){
                localStorage.setItem('curNameType','患者动态');
            }else{
                localStorage.setItem('curNameType','医院动态');
            }

            $state.go('app.public_msg.group.msg_manage.send_msg',{id:item.pid});
        };
    };
})();

