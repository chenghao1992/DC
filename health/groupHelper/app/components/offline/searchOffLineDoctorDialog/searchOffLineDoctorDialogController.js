(function() {
    angular.module('app')
        .controller('SearchOffLineDoctorDialogModalInstanceCtrl', SearchOffLineDoctorDialogModalInstanceCtrl);

    SearchOffLineDoctorDialogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'toaster', 'options', '$http','constants','EditDocAppointmentFactory'];

    function SearchOffLineDoctorDialogModalInstanceCtrl($scope, $uibModalInstance, toaster, options, $http,constants,EditDocAppointmentFactory) {

        findDocsByCheckBox();

        function findDocsByCheckBox() {
            $http.post(constants.api.outLine.findDoctorsFromKeyWord, {
                access_token: localStorage['groupHelper_access_token'],
                keyWord:'',
                queryType:1,
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
        }

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        //清除关键字
        $scope.clearKeyWord=function(){
            $scope.keyWord=null;
        };

        //按回车键搜索
        $scope.pressEnter=function($event){
            if($event.keyCode==13){
                $scope.searchByKeyWord();
            }
        };

        //搜索
        $scope.searchByKeyWord=function(){
            $http.post(constants.api.doctor.findDoctorsFromKeyWord, {
                access_token: localStorage['groupHelper_access_token'],
                queryType:1,
                keyWord: $scope.keyWord,
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
        };

        //医生详情
        $scope.editDocAppointment=function(item){
            EditDocAppointmentFactory.openModal({
                doctorId:item.doctorId,
                price:item.appointmentPrice,
                callback:function(data){
                    if(options.callback){
                        options.callback(data);
                    }
                }
            });
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
