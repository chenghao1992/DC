'use strict';
(function() {

angular.module('app').controller('hospitalInfoCtrl', hospitalInfoCtrl);
hospitalInfoCtrl.$inject = ['$scope', '$state', '$http','toaster', '$stateParams','$timeout', 'searchDoctorModalFactory'];
function hospitalInfoCtrl($scope, $state, $http,toaster, $stateParams,$timeout, searchDoctorModalFactory) {


    var hospitalId=$stateParams.hospitalId;
    //获取医院信息
    $http.post(app.url.hospital.getDetailByGroupId, {
        access_token: app.url.access_token,
        id:hospitalId
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
                    $state.reload();
                    $timeout(function () {
                        toaster.pop('success', null, "管理员已修改成功！");
                    }, 100);
                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                }
            });

        }

    };
};

})();
