'use strict';
(function(){
    app.controller('groupDrugLibraryCtrl',funcgroupDrugLibraryCtrl);
    funcgroupDrugLibraryCtrl.$inject=['$rootScope', '$scope', '$http', 'toaster', '$modal','SelectMedicineBoxFactory'];
    function funcgroupDrugLibraryCtrl($rootScope, $scope, $http, toaster, $modal,SelectMedicineBoxFactory) {
        $scope.url = app.url.drugLibrary.searchDoctorGroupDrugLibList;
        $scope.params = {
            groupId: localStorage.getItem('curGroupId'),
            access_token: localStorage.getItem('access_token')
        };


        //setTable($scope.page, $scope.page_size);
        //
        ////获取表格
        //function setTable(page, page_size) {
        //    //var url = app.yiyao + 'api/invoke/' + localStorage.getItem('access_token') + app.url.yiyao.c_Group_Goods_select;
        //    $http.post(app.url.drugLibrary.searchDoctorGroupDrugLibList, {
        //        groupId: localStorage.getItem('curGroupId'),
        //        pageIndex: page,
        //        pageSize: page_size,
        //        access_token: localStorage.getItem('access_token')
        //    }).
        //    then(function(rpn) {
        //
        //        //if (rpn && rpn.data && rpn.data.info_list) {
        //        //    if (rpn.data.info_list.length > 0) {
        //        //        $scope.drugList = rpn.data.info_list;
        //        //        $scope.page_count = rpn.data.total;
        //        //    } else {
        //        //        $scope.drugList = [];
        //        //        $scope.page_count = 0;
        //        //    }
        //        //}
        //    });
        //
        //};



        $scope.openDrugBox = function() {
            var medicineIds=[];
            SelectMedicineBoxFactory.open({
                medicines: [],
                access_token: app.url.access_token,
                callback: function(medicines) {
                    medicines.forEach(function(item) {
                        medicineIds.push(item.id);
                    });
                    $http.post(app.url.drugLibrary.addDoctorGroupDrugLibGoods, {
                        groupId: localStorage.getItem('curGroupId'),
                        access_token: localStorage.getItem('access_token'),
                        ids:medicineIds
                    }).
                    then(function(rpn) {
                        if (rpn.data&&rpn.data.resultCode==1) {
                            toaster.pop('success', null, '添加成功');
                            $scope.params = {
                                groupId: localStorage.getItem('curGroupId'),
                                access_token: localStorage.getItem('access_token'),
                            };
                        } else {
                            toaster.pop('error', null, '添加失败');
                            console.warn(rpn);
                        }
                    });
                }
            });
        }

        $scope.deletePlan = function(id) {
            $http.post(app.url.drugLibrary.deleteDoctorGroupDrugById, {
                groupId: localStorage.getItem('curGroupId'),
                access_token: localStorage.getItem('access_token'),
                id:id
            }).
            then(function(rpn) {
                if (rpn.data&&rpn.data.resultCode==1) {
                    toaster.pop('success', null, '删除成功');
                    $scope.params = {
                        groupId: localStorage.getItem('curGroupId'),
                        access_token: localStorage.getItem('access_token')
                    };
                } else {
                    toaster.pop('error', null, '删除失败');
                    console.warn(rpn);
                }
            });
        };
        //删除
        $scope.delete = function(planId) {
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function(status) {
                if (status == 'ok') {
                    $scope.deletePlan(planId, -1);
                }
            });
        };

    };

    app.controller('delModalInstanceCtrl',funcdelModalInstanceCtrl);
    funcdelModalInstanceCtrl.$inject=['$scope', '$modalInstance', 'toaster', '$http', 'utils'];
    function funcdelModalInstanceCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
})();

