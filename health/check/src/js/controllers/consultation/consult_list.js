/**
 * Created by clf on 2016/1/14.
 */
'use strict';
(function () {
    app.controller('ConsultListCtrl', ['$scope','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams',function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams) {
        var curGroupId='666666666666666666666666';

        getPackList();

        function getPackList(){
            $http.post(app.url.consult.getPackList, {
                access_token:app.url.access_token,
                groupId:curGroupId,
                pageIndex:0,
                pageSize:9999
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.data=data.data.pageData;
                }
                else{
                    toaster.pop('error',null,data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error',null,data.resultMsg);
            });
        }



        $scope.deletePack=function(_id){
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function (status) {
                if(status=='ok'){
                    $http.post(app.url.consult.delPack, {
                        access_token:app.url.access_token,
                        consultationPackId:_id
                    }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            toaster.pop('success',null,'删除成功');
                            getPackList();
                        }
                        else{
                            toaster.pop('error',null,data.resultMsg||'当前会诊包中有医生');
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error',null,data.resultMsg);
                    });
                }
            }, function () {

            });
        };
    }]);

    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance','toaster','$http','utils',function ($scope, $modalInstance,toaster,$http,utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();
