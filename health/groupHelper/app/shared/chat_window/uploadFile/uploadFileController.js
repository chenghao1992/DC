(function() {
    angular.module('app')
        .controller('UploadFileController', UploadFileController);

    UploadFileController.$inject = ['$scope', '$http', 'toaster', 'FileUploader','constants'];

    function UploadFileController($scope, $http, toaster, FileUploader,constants) {

        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        }

        $scope.token = localStorage['groupHelper_access_token'];
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            // console.log(up, files);
            $scope.data.isLoading = true;
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {

            $http({
                url: file.url + '?imageInfo',
                method: 'get'
            }).then(function(response) {
                var rep = response.data;
                if (!rep.error) {
                    $scope.data.isLoading = false;
                    $scope.data.imgFile = {};
                    $scope.data.imgFile.name = file.name;
                    $scope.data.imgFile.size = file.size;
                    $scope.data.imgFile.url = file.url;
                    $scope.data.imgFile.format = rep.format;
                    $scope.data.imgFile.width = rep.width;
                    $scope.data.imgFile.height = rep.height;
                    $scope.data.imgFile.colorModel = rep.colorModel;
                    $scope.data.imgFile.key = file.id;
                } else {
                    toaster.pop('error', null, rep.error);
                }
                $scope.fileList = [];
            });

        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            $scope.data.isLoading = false;
            console.warn(up, err, errTip);
            toaster.pop('error', null, errTip);
        };
    };

})();
