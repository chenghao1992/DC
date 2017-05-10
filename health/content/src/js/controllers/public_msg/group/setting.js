/**
 * Created by clf on 2015/11/24.
 */
'use strict';

(function(){
    app.controller('MsgSettingCtrl',funcMsgSettingCtrl);
    funcMsgSettingCtrl.$inject=['$scope', '$timeout','utils','$http','$modal','Upload','toaster','$state','$stateParams','$rootScope'];
    function funcMsgSettingCtrl($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams,$rootScope) {
        $scope.allowUpload=true;
        var getPubInfo=function(){
            $http.post(app.url.pubMsg.getPubInfo, {
                access_token:app.url.access_token,
                pid:$stateParams.id
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.pubInfo=data.data;
                    //if(data.data.rtype=='pub_3'||data.data.rtype=='pub_1'){
                    //    $scope.allowUpload=false;
                    //    data.data.photourl=$rootScope.groupPicFile;
                    //}
                }
                else{
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error','',data.resultMsg);
            });
        };

        getPubInfo();


        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        //选择文件上传
        $scope.selectFile = function(){
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent=0;
            console.log(up,files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.pubInfo.photourl=file.url;
            $scope.uploadPercent=100;
            toaster.pop('success',null,'封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            if(err.code==-600){
                toaster.pop('error', null, '文件过大');
            }
            else{
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess=function(up, file){
            $scope.uploadPercent=file.percent==100?99:file.percent;
        };

        $scope.save=function(){
            $http.post(app.url.pubMsg.savePubInfo, {
                access_token:app.url.access_token,
                pid:$stateParams.id,
                //name:$scope.pubInfo.name,
                photourl:$scope.pubInfo.photourl,
                note:$scope.pubInfo.note
            }).
            success(function(data, status, hueaders, config) {
                if(data.resultCode==1){
                    toaster.pop('success','','保存成功');
                }
                else{
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error','',data.resultMsg);
            });
        };
    };


})();
