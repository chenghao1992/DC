'use strict';
(function () {
    app.controller('DoctorPersonalProfileCtrl', ['$scope', 'utils', '$http', '$modal', 'toaster', '$location', '$state', '$rootScope', '$stateParams',function($scope, utils, $http, $modal, toaster, $location, $state, $rootScope, $stateParams) {
        $scope.isSaved = false;
        $scope.isShow=false;
        $scope.name=$stateParams.name;
        console.log($scope.name);
        //编辑H5
        function getData() {
            $http.post(app.url.group.getRecommentDoc, {
                access_token: app.url.access_token,
                recommendId: $stateParams.id
            }).
            success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    if(data.data){
                        $scope.isShow = data.data.isShow == 1;
                        $scope.umeditor.replaceHtml(data.data.content);
                    }
                }
                else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function (data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        }
        getData();

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
            if (err.code == -600) {
                toaster.pop('error', null, '文件过大');
            } else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };

        $scope.config={
            file:{
                urlParams:'?imageView2/3/w/800/h/800'
            }
        };

        //保存文章
        $scope.save = function() {
            if ($scope.content.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }
            $scope.isSaved = true;
            var isShow = $scope.isShow == true ? 1 : 2;

            $http.post(app.url.group.updateRecDocument, {
                access_token: app.url.access_token,
                recommendDoctId:$stateParams.id,
                content: $scope.content,
                isShow:isShow,
                doctorName:$scope.name
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    var idtext=1;
                    toaster.pop('success', '', '保存成功,3秒钟后返回');
                    setTimeout(function() {
                        $state.go('app.patients_list',{username:1});
                    }, 3000);

                } else {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                $scope.isSaved = false;
                toaster.pop('error', '', data.resultMsg);
            });
        };

        //预览文章，并不保存
        $scope.toPreview = function() {
            if ($scope.content.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }

            var articlePreview = {
                content: $scope.content,
                isShow: $scope.isShow
            };

            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'previewModalInstanceCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function() {
                        return articlePreview;
                    }
                }
            });

        };
    }]);
    app.controller('previewModalInstanceCtrl', ['$scope', '$modalInstance', 'article', '$sce',function($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);

})();
