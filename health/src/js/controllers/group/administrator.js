'use strict';
(function(){
    app.controller('AdminCtrl',funcAdminCtrl);
    funcAdminCtrl.$inject = ['$rootScope', '$scope', '$modal', '$log', '$http', '$stateParams'];
    function funcAdminCtrl($rootScope, $scope, $modal, $log, $http, $stateParams){
            //$rootScope.isCompany = false;
            var doctorId = localStorage.getItem('user_id');
            var access_token = localStorage.getItem('access_token');
            var enterprise_doc_id = localStorage.getItem('enterprise_id');
            var curGroupId = localStorage.getItem('curGroupId');
            $scope.adminstrators = [];
            $scope.adminDocId = [];
            $scope.getAdmins = function () {
                $http.post(app.url.yiliao.getGroupAdmins, {
                    "access_token": access_token,
                    "objectId": curGroupId,
                    "status": "C",
                    "pageSize": 100,
                    "pageIndex": 0
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if (data.data.pageData.length > 0) {
                            $scope.adminstrators = data.data.pageData;
                            console.log(data.data.pageData);
                        }

                    }
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
            };
            $scope.getAdmins();


            //判断能不能删除
            $scope.isDel = function (adminstrator) {
                if (adminstrator.doctor.doctorId == doctorId) {
                    return false;
                }
                else if (adminstrator.rootAdmin == 'root') {
                    return false;
                }
                else {
                    return true;
                }
            }

            $scope.removeRow = function (adminstrator) {
                // if (localStorage.getItem('group_creator') == null) {
                //   if (index == 0) {
                //     toaster.pop('error','','不能删除创建者');
                //     return;
                //   }
                // }
                var removeModal = $modal.open({
                    templateUrl: 'removeModalContent.html',
                    controller: 'removeModalInstanceCtrl',
                    size: 'sm',
                    resolve: {
                        item: function () {
                            return adminstrator;
                        }
                    }
                });

                removeModal.result.then(function (status) {
                    if (status == 'ok') {
                        var index = $scope.adminstrators.indexOf(adminstrator);
                        if (index !== -1) {
                            $scope.adminstrators.splice(index, 1);
                        }
                    }
                }, function () {
                    $log.info('removeModal dismissed at: ' + new Date());
                });
            };


            var modalInstance;
            $scope.transferTo = function () {
                modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'inviteDocToManageModalContent.html',
                    controller: 'inviteDocToManageModalCtrl',
                    size: 'md',
                    resolve: {
                        item: function () {
                            return doctorId;
                        }
                    }
                });
            };



    }
})();

(function(){
    app.controller('inviteDocToManageModalCtrl',funcInviteCtrl);
    funcInviteCtrl.$inject=['$scope', '$rootScope', '$modalInstance', '$http', 'item', 'modal', 'utils', 'toaster'];
    function funcInviteCtrl($scope, $rootScope, $modalInstance, $http, item, modal, utils, toaster) {
        $scope.reInvite = 0;
        $scope.account = {};
        var groupId = localStorage.getItem('curGroupId');

        $scope.confirm = function (status) {
            //$http({
            //  url: app.url.yiliao.applyTransfer,
            //  method: 'post',
            //  data: {
            //    access_token: app.url.access_token,
            //    groupId: groupId,
            //    inviteUserId: item,
            //    confirmUserId: $scope.selectedDoctorId
            //  }
            //}).then(function (resp) {
            //  if (resp.data.resultCode == '1') {
            //    modal.toast.success('转让成功！');
            //    $modalInstance.dismiss('cancel');
            //  } else {
            //    $scope.authError = resp.data.resultMsg;
            //  }
            //});
            $http({
                url: app.url.yiliao.addGroupUser,
                method: 'post',
                data: {
                    "access_token": app.url.access_token,
                    "objectId": groupId,
                    "doctorId": $scope.selectedDoctorId,
                    "telephone": $scope.selectedDoctorTelephone,
                    "againInvite": status === 1 ? 1 : null
                }
            }).then(function (resp) {
                if (resp.data.resultCode === 1) {
                    if (resp.data.data.status == 2) {
                        $scope.reInvite = 1;
                        $scope.authError = resp.data.data.msg;
                        if (resp.data.data.note) {
                            $scope.reInvite = 0;
                            toaster.pop('success', '', '邀请成功');
                            $modalInstance.close('ok');
                        }
                    }
                    else {
                        $scope.reInvite = 0;
                        $scope.authError = resp.data.data.msg;
                        toaster.pop('success', '', '邀请成功');
                        $modalInstance.close('ok');
                    }

                } else {
                    $scope.authError = resp.data.resultMsg;
                    $scope.reInvite = 0;
                }
            }, function (x) {
                console.error(x.statusText);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function setDoctor(dt) {
            $scope.selectedDoctorId = dt[0].id;
            $scope.selectedDoctorTelephone = dt[0].telephone;
            $scope.selectedDoctorName = dt[0].name;
            $scope.authError = false;
            $scope.$apply();
        }

        $scope.selectDoctor = function () {
            // 创建通讯录列表数据
            var databox = new DataBox('data_res', {
                hasCheck: true,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: true,
                self: false,
                cover: false,
                selectView: false,
                arrType: [1, 0, 0],
                search: {
                    url: app.url.yiliao.searchDoctorByKeyWord,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        keyword: 'name',
                        pageSize: 10000,
                        pageIndex: 0
                    },
                    dataKey: {
                        name: 'doctor.name',
                        id: 'doctorId',
                        union: 'departmentId',
                        dataSet: 'data.pageData'
                    },
                    keyName: 'keyword',
                    unwind: false
                },
                data: {
                    url: app.url.yiliao.getAllData,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId
                    }
                },
                async: {
                    url: app.url.yiliao.getDepartmentDoctor,
                    dataKey: {
                        departmentId: 'id'
                    },
                    data: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        status: 'C',
                        type: 1
                    },
                    dataName: '',
                    target: {
                        data: '',
                        dataKey: {
                            id: 'id',
                            name: 'name',
                        }
                    }
                },
                titles: {
                    main: '选择接收集团的医生',
                    searchKey: '医生姓名',
                    label: '已选择医生'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-user-md dcolor',
                    head: 'headPicFileName'
                },
                root: {
                    selectable: false,
                    name: utils.localData('curGroupName'),
                    id: 0
                },
                extra: [{
                    name: '未分配',
                    id: 'idx_0',
                    parentId: 0,
                    subList: [],
                    url: app.url.yiliao.getUndistributed,
                    dataName: 'pageData',
                    target: {
                        data: 'doctor',
                        dataKey: {
                            id: 'doctorId',
                            name: 'name'
                        }
                    },
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        pageIndex: 0,
                        pageSize: 10000
                    },
                    icon: 'fa fa-bookmark'
                }],
                response: setDoctor,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'subList'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'parentId',
                    dpt: 'departments',
                    telephone: 'telephone',
                    description: 'description',
                    param: 'param',
                    icon: 'icon',
                    url: 'url',
                    isExtra: 'isExtra',
                    target: 'target'
                },
                callback: function () {
                }
            });
        };
    }

})();

(function(){
    //弹出删除管理员模态框
    app.controller('removeModalInstanceCtrl',funcRemoveCtrl);
    funcRemoveCtrl.$inject=['$scope', '$modalInstance', 'item', '$http', 'toaster'];
    function funcRemoveCtrl($scope, $modalInstance, item, $http, toaster){
        $scope.item = item;
        $scope.ok = function () {
            $http.post(app.url.yiliao.deleteGroupAdmin, {
                access_token: app.url.access_token,
                ids: item.id
            }).
            success(function (data, status, headers, config) {
                if (data.resultCode == 1) {
                    toaster.pop('success', '', '删除成功');
                    $modalInstance.close('ok');
                }
                else {
                    toaster.pop('error', '', '删除失败');
                    $modalInstance.close('false');
                }
            }).
            error(function (data, status, headers, config) {
                toaster.pop('error', '', '删除失败');
                console.log(data);
                $modalInstance.close('false');
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
})();


