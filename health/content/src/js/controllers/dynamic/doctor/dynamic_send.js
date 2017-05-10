/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('doctorDynamicSendMsgCtrl', funDoctorDynamicSendMsgCtrl);

    funDoctorDynamicSendMsgCtrl.$inject = ['$scope', '$http', '$state', 'toaster', '$stateParams', '$modal'];

    function funDoctorDynamicSendMsgCtrl($scope, $http, $state, toaster, $stateParams, $modal) {
        var curGroupId = localStorage.getItem('curGroupId');
        var curPid = $stateParams.id;
        $scope.isSend=false;

        localStorage.setItem('curPid', curPid);
        var um = null;
        $scope.token = app.url.access_token;


        //新增集团动态
        $scope.addDoctorDynamicForWeb = function() {
            //参数校对
            var html = um.getContent();
            if (!$scope.title) {
                toaster.pop('info', null, "请填写标题");
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('info', null, "请上传题图");
                return;
            }
            if (!html) {
                toaster.pop('info', null, "请填写正文");
                return;
            }
            //调用添加就医知识接口    
            $http.post(app.url.dynamic.addDoctorDynamicForWeb, {
                access_token: app.url.access_token,
                title: $scope.title || '',
                contentUrl: $scope.fontImgUrl || '',
                content: html || ''

            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.isSend=true;
                    toaster.pop('success', '', '发送成功,3秒钟后返回历史消息列表');
                    setTimeout(function() {
                        $state.go('app.doctorDynamic.edit.msgHistory', {}, { reload: true });
                    }, 3000);


                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });
        }



        //选择文件上传
        $scope.selectFile = function() {
            
            $scope.upload();
            $scope.dynamicErrorMessage='题图大于2M，请重新上传';
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent = 0;

        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.fontImgUrl = file.url;
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
             toaster.pop('error', null, '题图大于2M，请重新上传'); 
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
        //获取七牛上传token和domain
        (function() {
            //获取七牛上传token和domain
            $http({
                url: serverApiRoot + 'vpanfile/getUploadToken',
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    bucket: 'resource'
                }
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                    //初始化编辑器
                    um = UM.getEditor('myEditor', {
                        initialFrameWidth: '100%',
                        initialFrameHeight: 300,
                        qiniuToken: rep.data.token,
                        qiniuDomain: rep.data.domain
                    });
                } else {
                    console.error(rep);
                }
            });
        })();
        $scope.$on('$destroy', function() {
            um.destroy();
        });
        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var html = um.getContent();
            if (!html) {
                toaster.pop('info', null, "请填写正文");
                return;
            }
            //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
            //var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
            var firstParagraph = um.getContentTxt().slice(0, 100);
            var articlePreview = {
                title: $scope.title,
                fontImgUrl: $scope.fontImgUrl,
                content: html
            };

            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'doctorPreviewModalInstanceCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function() {
                        return articlePreview;
                    }
                }
            });
        };
    }

angular.module('app').controller('doctorPreviewModalInstanceCtrl', doctorPreviewModalInstanceCtrl);

doctorPreviewModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'article', '$sce'];

function doctorPreviewModalInstanceCtrl($scope, $modalInstance, article, $sce) {
    $scope.article = article;
    $scope.article.content = $sce.trustAsHtml($scope.article.content);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
})();
