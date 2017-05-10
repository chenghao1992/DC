/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('dynamicSettingCtrl', funDynamicSettingCtrl);

    funDynamicSettingCtrl.$inject = ['$scope', '$http', '$state', 'toaster'];

    function funDynamicSettingCtrl($scope, $http, $state, toaster) {
        var curGroupId = localStorage.getItem('curGroupId');
        var curPid = localStorage.getItem('curPid');
        console.log(curPid);
        $scope.allowUpload = true;
        (function() {
        	console.log('dsfs');
        	//调用添加就医知识接口    
            $http.post(app.url.pubMsg.getPubInfo, {
                access_token: app.url.access_token,
                pid: curPid

            }).
            success(function(data) {
                if (data.resultCode == 1) {
                  $scope.pubInfo = data.data;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });

         
        })();

        


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
        $scope.selectFile = function() {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent = 0;
            console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.pubInfo.photourl = file.url;
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            if (err.code == -600) {
                toaster.pop('error', null, '题图大于2M，请重新上传');
            } else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };

        $scope.save = function() {
            $http.post(app.url.pubMsg.savePubInfo, {
                access_token: app.url.access_token,
                pid: curPid,
                //name:$scope.pubInfo.name,
                photourl: $scope.pubInfo.photourl,
                note: $scope.pubInfo.note
            }).
            success(function(data, status, hueaders, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', '', '保存成功');
                } else {
                    toaster.pop('error', '', data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', '', data.resultMsg);
            });
        };

    }

})();
