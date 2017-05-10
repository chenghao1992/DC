(function() {
    angular.module('app')
        .controller('SearchDoctorDialogCtrl', SearchDoctorDialogCtrl)
        .controller('SearchDoctorDialogModalInstanceCtrl', SearchDoctorDialogModalInstanceCtrl);

    SearchDoctorDialogCtrl.$inject = ['$scope', '$uibModal','constants'];

    function SearchDoctorDialogCtrl($scope, $uibModal,constants) {
        $scope.open = function(gId, callback) {
            var modalInstance = $uibModal.open({
                templateUrl: 'searchDoctorDialogBox.html',
                controller: 'SearchDoctorDialogModalInstanceCtrl',
                size: 'xl',
                resolve: {
                    data: {
                        gId: gId
                    }
                }
            });

            modalInstance.result.then(function(returnMsg) {
                if (callback) {
                    callback();
                }
            }, function() {
                if (callback) {
                    callback();
                }
            });

        };

    };

    SearchDoctorDialogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'SearchDoctorDialogFtory', 'toaster', 'data', '$http','constants'];

    function SearchDoctorDialogModalInstanceCtrl($scope, $uibModalInstance, SearchDoctorDialogFtory, toaster, data, $http,constants) {
        var isSearchKW=false;
        $scope.gId = data.gId;
        //checkbox选项
        //$scope.checkStatus = {
        //    isCity: true,
        //    isHospital: false,
        //    isTitle: true
        //};
        //
        //$scope.$watchCollection('checkStatus', function(newValue, oldValue) {
        //    setTimeout(function(){
        //        if(isSearchKW==false){
        //            if (newValue !== oldValue) {
        //                findDocsByCheckBox($scope.checkStatus);
        //            }
        //        }
        //    },100);
        //
        //});
        //findDocsByCheckBox($scope.checkStatus);
        //
        //function findDocsByCheckBox(param) {
        //    $http.post(constants.api.doctor.findDoctors, {
        //        access_token: localStorage['guider_access_token'],
        //        isCity: param.isCity,
        //        isHospital: param.isHospital,
        //        isTitle: param.isTitle,
        //        pageIndex: 0,
        //        pageSize: 9999,
        //        guideOrderId: $scope.gId
        //    }).
        //    success(function(data, status, headers, config) {
        //        if (data.resultCode == 1) {
        //            $scope.rowCollection = data.data.pageData;
        //            $scope.displayedCollection = [].concat($scope.rowCollection);
        //        } else {
        //            toaster.pop('error', null, data.resultMsg);
        //        }
        //    }).
        //    error(function(data, status, headers, config) {
        //        toaster.pop('error', null, data.resultMsg);
        //    });
        //}


        (function getAllDepts() {
            $http.post(constants.api.shared.getAllDepts, {
                access_token: localStorage['guider_access_token'],
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    console.log(data);
                    $scope.dataForTheTree=data.data;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
        })();

        //病种节点选中的时候
        $scope.nodeSelected=function(node){
            $http.post(constants.api.doctor.findDoctorByDept, {
                access_token: localStorage['guider_access_token'],
                deptId:node.id
            }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.rowCollection = data.data;
                        $scope.displayedCollection = [].concat($scope.rowCollection);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', null, data.resultMsg);
                });
        };

        //默认展示所有的医生
        (function findAllDocs(){
            $http.post(constants.api.doctor.findDoctorByDept, {
                access_token: localStorage['guider_access_token'],
            }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.rowCollection = data.data;
                        $scope.displayedCollection = [].concat($scope.rowCollection);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error', null, data.resultMsg);
                });
        })();


        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            console.log($scope.goRunning);
            if ($scope.goRunning)
                $scope.goRunning();
        };

        $scope.clearKeyWord=function(){
            isSearchKW=false;
            $scope.keyWord='';
        };

        //按回车键搜索
        $scope.pressEnter=function($event){
            if($event.keyCode==13){
                $scope.searchByKeyWord();
            }
        };

        $scope.searchByKeyWord=function(){
            //if($scope.keyWord==''){
            //    isSearchKW=false;
            //    $scope.checkStatus = {
            //        isCity: true,
            //        isHospital: false,
            //        isTitle: true
            //    };
            //}
            //else{
            //    isSearchKW=true;
            //    $scope.checkStatus = {
            //        isCity: false,
            //        isHospital: false,
            //        isTitle: false
            //    };

            $http.post(constants.api.doctor.findDoctorsFromKeyWord, {
                access_token: localStorage['guider_access_token'],
                keyWord: $scope.keyWord||'',
                pageIndex: 0,
                pageSize: 9999
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.rowCollection = data.data.pageData;
                    $scope.displayedCollection = [].concat($scope.rowCollection);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                toaster.pop('error', null, data.resultMsg);
            });
            //}
        }
    }

})();
