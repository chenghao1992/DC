'use strict';
(function () {
    app.controller('DocRecommendList', ['$scope', 'utils', '$http', '$modal', 'toaster', '$location', '$state', '$rootScope', '$stateParams', function($scope, utils, $http, $modal, toaster, $location, $state, $rootScope, $stateParams) {

        var access_token = localStorage.getItem('access_token');
        var curGroupId = localStorage.getItem('curGroupId');

        $scope.selectDoctor = function() {
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
                        access_token: access_token,
                        groupId: curGroupId,
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
                        access_token: access_token,
                        groupId: curGroupId
                    }
                },
                async: {
                    url: app.url.yiliao.getDepartmentDoctor,
                    dataKey: {
                        departmentId: 'id'
                    },
                    data: {
                        access_token: access_token,
                        groupId: curGroupId,
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
                        access_token: access_token,
                        groupId: curGroupId,
                        pageIndex: 0,
                        pageSize: 10000,
                        status: 1
                    },
                    icon: 'fa fa-bookmark'
                }],
                response: funAddDoctor,
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
                callback: function() {}
            });
        };

        // 添加医生
        function funAddDoctor(doctorArry) {
            var doctor = doctorArry[0];

            if (!doctor.id) return;

            $http.post(app.url.doctor.addDoctor, {
                access_token: app.url.access_token,
                groupId: curGroupId,
                doctorId: doctor.id
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '添加成功');
                    $scope.funGetDoctorList(1, $scope.pageSize);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });
        };



        // 获取名医列表
        $scope.funGetDoctorList = (function _funGetDoctorList(pageIndex, pageSize) {

            $scope.pageIndex = pageIndex || $scope.pageIndex;
            $scope.pageSize = pageSize || $scope.pageSize;

            $http.post(app.url.doctor.getRecommendDocList, {
                access_token: app.url.access_token,
                isApp: false,
                groupId: curGroupId,
                pageIndex: (pageIndex || $scope.pageIndex) - 1,
                pageSize: pageSize || $scope.pageSize || 10
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {

                    $scope.doctorList = rpn.data.pageData;
                    $scope.page_count = rpn.data.pageCount;

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });
            return _funGetDoctorList;
        })(1, 10);

        // 翻页
        $scope.pageChanged = function() {
            $scope.funGetDoctorList();
        };

        // 推荐或取消推荐
        $scope.funSetRecommend = function(doctor, isRecommend) {

            $http.post(app.url.doctor.setRecommend, {
                access_token: app.url.access_token,
                id: doctor.id,
                isRecommend: isRecommend
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '操作成功');
                    $scope.funGetDoctorList();
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '添加出错');
                    console.error(rpn);
                };
            });

        };

        // 移除推荐名医
        $scope.funRemoveRecommend = function(doctor) {


            var modalInstance = $modal.open({
                templateUrl: 'offlineModalContent.html',
                controller: 'offlineModalContentCtrl',
                size: 'md',
                resolve: {
                    data: function() {
                        return doctor;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                console.log(result);

                if (result) {
                    $http.post(app.url.doctor.delDoctor, {
                        access_token: app.url.access_token,
                        id: doctor.id
                    }).then(function(rpn) {
                        rpn = rpn.data;
                        if (rpn && rpn.resultCode == 1) {
                            toaster.pop('success', null, '移除成功');
                            $scope.funGetDoctorList();
                        } else if (rpn && rpn.resultMsg) {
                            toaster.pop('error', null, rpn.resultMsg);
                        } else {
                            toaster.pop('error', null, '添加出错');
                            console.error(rpn);
                        };
                    });
                }


            });

        };

        // 上移
        $scope.funPutUp = function(doctor) {
            $http.post(app.url.doctor.upWeight, {
                access_token: app.url.access_token,
                id: doctor.id
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '上移成功');
                    $scope.funGetDoctorList();
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '上移出错');
                    console.error(rpn);
                };
            });
        };




    }]);

    angular.module('app')
        .controller('offlineModalContentCtrl', offlineModalContentCtrl);

// 手动注入依赖
    offlineModalContentCtrl.$inject = ['$scope', '$modalInstance', 'data'];


    function offlineModalContentCtrl($scope, $modalInstance, data) {

        $scope.doctor = data;

        $scope.ok = function() {
            $modalInstance.close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss(false);
        };
    };

})();
