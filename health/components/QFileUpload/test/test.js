'use strict';

app.controller('test', ['$scope', '$qupload','$log',
    function($scope, $qupload,$log) {

        $scope.selectFiles = [];

        var start = function(index) {
            $scope.selectFiles[index].progress = {
                p: 0
            };
            $scope.selectFiles[index].upload = $qupload.upload({
                // key: 'group.dev.file.dachentech.com.cn',
                file: $scope.selectFiles[index].file,
                token: '99Mcf4yYPNDOSV2hifjtbu3ixNERafhbcYnCHo69:SQ6hM-DXpSFlHcd5_S4GSuDIf7Q=:eyJzY29wZSI6Imdyb3VwIiwiZGVhZGxpbmUiOjE0NzE0ODcxNTJ9'
            });
            $scope.selectFiles[index].upload.then(function(response) {
                $log.info(response);
            }, function(response) {
                $log.info(response);
            }, function(evt) {
                $scope.selectFiles[index].progress.p = Math.floor(100 * evt.loaded / evt.totalSize);
            });
        };

        $scope.abort = function(index) {
            $scope.selectFiles[index].upload.abort();
            $scope.selectFiles.splice(index, 1);
        };

        $scope.onFileSelect = function($files) {
            var offsetx = $scope.selectFiles.length;
            for (var i = 0; i < $files.length; i++) {
                $scope.selectFiles[i + offsetx] = {
                    file: $files[i]
                };
                start(i + offsetx);
            }
        };
    }
]);
