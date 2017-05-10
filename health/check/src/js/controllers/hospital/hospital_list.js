'use strict';
(function() {

//医院列表
angular.module('app').controller('HospitalListCtrl', HospitalListCtrl);
HospitalListCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', '$compile', 'utils', '$modal', 'toaster', '$stateParams'];
function HospitalListCtrl($rootScope, $scope, $state, $http, $compile, utils, $modal, toaster, $stateParams) {

    var _groupId = app.url.groupId();


    $scope.pageSize = 20;
    $scope.pageIndex = 1;
    $scope.keyWord = null;

    // 翻页
    $scope.pageChanged = function() {
        $scope.setTable($scope.pageIndex, $scope.pageSize, $scope.keyWord);
    };


    // 设置列表
    $scope.setTable = (function SetTable(pageIndex, pageSize, keyWord) {

        if (pageIndex)
            $scope.pageIndex = pageIndex;
        if (pageSize)
            $scope.pageSize = pageSize;

        $scope.keyWord = keyWord;

        $http.post(app.url.hospital.getHospitalList, {
            access_token: app.url.access_token,
            pageIndex: $scope.pageIndex - 1,
            pageSize: $scope.pageSize,
            keyWord: $scope.keyWord || null

        }).

        then(function(rpn) {
            rpn = rpn.data;

            if (rpn.resultCode === 1) {

                $scope.hospitalList = rpn.data.pageData;
                $scope.page_count = rpn.data.total;

            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        return SetTable;
    })();
    //查看医院弹出框

    $scope.openHospitalInfoModal=function(itemId){
            var modalInstance = $modal.open({
                templateUrl: 'ModalHospitalInfo.html',
                controller: 'HospitalInfoCtrl',
                size: 'lg',
                resolve: {
                    itemId: function () {
                        return itemId;
                    }
                }
            });
        modalInstance.result.then(function (returnValue) {
                if(returnValue=='ok'){
                    test();
                }
            }, function () {
        });
    };
};
angular.module('app').controller('HospitalInfoCtrl', HospitalInfoCtrl);
HospitalInfoCtrl.$inject = ['$scope','$state', '$modalInstance','toaster','$http','utils','itemId','searchDoctorModalFactory'];
function HospitalInfoCtrl($scope,$state, $modalInstance,toaster,$http,utils,itemId,searchDoctorModalFactory) {
    $http.post(app.url.hospital.getDetailByGroupId, {
        access_token: app.url.access_token,
        id:itemId
    }).
    then(function(rpn) {
        rpn = rpn.data;

        if (rpn.resultCode === 1) {
            $scope.hospitalInfos = rpn.data;
        } else if (rpn.resultMsg) {
            toaster.pop('error', null, rpn.resultMsg);
        }

    });

    // 选择管理员
    $scope.addAdmin = function(hospitalId,doctors) {
        $modalInstance.dismiss('cancel');
        var options = {
            apiUrl: app.url.hospital.findDoctorsByCondition,
            apiParams:{
                access_token:app.url.access_token
            },
            selectType: 0,
            doctors: doctors || [],
            callback: callback
        };
        searchDoctorModalFactory.openModal(options);

        function callback(list) {
            $http.post(app.url.hospital.updateHospitalRoot,{
                access_token: app.url.access_token,
                hospitalId:hospitalId,
                doctorId:list[0].userId
            }).then(function (rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {
                    $scope.hospitalInfos = rpn.data;
                    toaster.pop('success', null, rpn.resultMsg);
                    $state.reload();

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                }
            });
            $scope.admin = list[0];

        }
    };
    $scope.ok = function() {
        $modalInstance.dismiss('ok');

    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();
