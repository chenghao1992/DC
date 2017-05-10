/**
 * Created by clf on 2015/11/23.
 */
'use strict';

(function(){
    app.controller('DocSendMsgCtrl',funcDocSendMsgCtrl);
    funcDocSendMsgCtrl.$inject=['$scope', '$timeout','utils','$http','$modal','Upload','toaster','$state','$stateParams'];
    function funcDocSendMsgCtrl($scope, $timeout,utils,$http,$modal,Upload,toaster,$state,$stateParams) {
        var userName=localStorage.getItem('user_name');
        var access_token=localStorage.getItem('access_token');
        $scope.titleLength=0;
        $scope.formData={};
        $scope.formData.patients=[];
        $scope.fontImg=null;
        $scope.fontImgUrl=null;
        $scope.copy_small=null;
        $scope.isSaved=false;
        var um=null;
        //获取七牛上传token和domain
        $http({
            url: serverApiRoot+'vpanfile/getUploadToken',
            method: 'post',
            data: {
                access_token: access_token,
                bucket: 'resource'
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                //初始化编辑器
                um = UM.getEditor('myEditor',{
                    initialFrameWidth:'100%',
                    initialFrameHeight:300,
                    qiniuToken:rep.data.token,
                    qiniuDomain:rep.data.domain
                });
            } else {
                console.error(rep);
            }
        });

        $scope.$on('$destroy', function() {
            um.destroy();
        });

        $scope.$watch('formData.title',function(newValue, oldValue){
            if(newValue!=oldValue){
                if($scope.formData.title){
                    $scope.titleLength=$scope.formData.title.length;
                }
                else{
                    $scope.titleLength=0;
                }
            }
        });

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
            $scope.fontImgUrl=file.url;
            $scope.copy_small=file.url+'?imageView2/3/w/200/h/200';
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

        //发送消息
        $scope.sendMsg=function(){
            var tagsId=[];
            if(!$scope.formData.title){
                toaster.pop('warn','','请填写标题');
                return;
            }
            if(!$scope.fontImgUrl){
                toaster.pop('warn','','请上传题图');
                return;
            }
            var html = um.getContent();
            if(html.length<=0){
                toaster.pop('warn','','请填写正文');
                return;
            }
            if($scope.formData.patients!=null&&$scope.formData.patients.length>0){
                $scope.formData.patients.forEach(function(item,index,array){
                    tagsId.push(item.id);
                });
            }

            $scope.isSaved=true;


            var mptList=[
                {
                    title:$scope.formData.title,
                    pic:$scope.fontImgUrl,
                    content:html
                }
            ];

            var sendMsgParam={
                access_token:app.url.access_token,
                pubId:$stateParams.id,
                userId:localStorage.getItem('user_id'),
                toAll:true,
                sendType:2,
                model:2,
                toNews:true,
                mpt:mptList
            };


            $http({method:'POST',url:app.url.pubMsg.sendMsg, data: JSON.stringify(sendMsgParam), headers:
            {
                "access-token":app.url.access_token,
                "Content-Type":"application/json"
            }}).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    toaster.pop('success','','发送成功,3秒钟后返回历史消息列表');
                    setTimeout(function(){
                        $state.go('app.public_msg.doctor.msg_manage.msg_history',{},{reload:true});
                    },3000);
                }
                else{
                    $scope.isSaved=false;
                    toaster.pop('error','',data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                $scope.isSaved=false;
                toaster.pop('error','','内部接口异常');
            });
        };


        //预览文章
        $scope.preview=function(){
            if(!$scope.formData.title){
                toaster.pop('warn','','请填写标题');
                return;
            }
            if(!$scope.fontImgUrl){
                toaster.pop('warn','','请上传题图');
                return;
            }
            var html = um.getContent();
            if(html.length<=0){
                toaster.pop('warn','','请填写正文');
                return;
            }

            var msg={
                title:$scope.formData.title,
                fontImgUrl:$scope.fontImgUrl,
                content:html,
                time:utils.dateFormat(new Date(),'yyyy-MM-dd'),
                author:userName
            };
            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'previewModalInstanceCtrl',
                windowClass:'docPreModal',
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });
        };
    };

    app.controller('previewModalInstanceCtrl',funcpreviewModalInstanceCtrl);
    funcpreviewModalInstanceCtrl.$inject=['$scope', '$modalInstance','msg','$sce'];
    function funcpreviewModalInstanceCtrl($scope, $modalInstance,msg,$sce) {
        $scope.msg=msg;
        $scope.msg.content=$sce.trustAsHtml($scope.msg.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();
