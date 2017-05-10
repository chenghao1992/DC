'use strict';
(function () {
    angular.module('app').factory('AddCareCheckRemindFtory', AddCareCheckRemindFtory);

    // 手动注入依赖
    AddCareCheckRemindFtory.$inject = ['$http', '$modal'];

    function AddCareCheckRemindFtory($http, $modal) {
        return {
            open: openModel
        };
        
        function openModel(chenckData, callBack) {

            if (!chenckData) chenckData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function () {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addCheckRemind.html';
                    else
                        return 'src/tpl/care/carePlan/addCheckRemind.html';
                }(),
                controller: 'AddCareCheckRemindCtrl',
                size: 'md',
                resolve: {
                    chenckData: function () {
                        return angular.copy(chenckData);
                    }
                }
            });
            modalInstance.result.then(function (chenckData) {
                if (callBack)
                    callBack(chenckData);
            });
        };

    };

    angular.module('app').controller('AddCareCheckRemindCtrl', AddCareCheckRemindCtrl);

    AddCareCheckRemindCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance', 'toaster', 'chenckData'];

    function AddCareCheckRemindCtrl($scope, $http, $modal, $modalInstance, toaster, chenckData) {

        $scope.chenckData = chenckData || {};
        $scope.isSelectedAll = [];
        $scope.selected = [];
        $scope.uploadselected = [];
        $scope.parentData = [];
        $scope.chenckData.checkItem = {
            forwardDays: function () {
                if (chenckData && chenckData.checkItem && chenckData.checkItem.forwardDays)
                    return chenckData.checkItem.forwardDays;
                return 1;
            }(),
            reminders: function () {
                if (chenckData && chenckData.checkItem && chenckData.checkItem.reminders)
                    return chenckData.checkItem.reminders;
                return '';
            }(),
            checks: function () {
                if (chenckData && chenckData.checkItem && chenckData.checkItem.checks) {
                    var id=chenckData.checkItem.checks[0].id;
                    getCheckData(id);
                    $scope.selected=chenckData.checkItem.checks[0].concernedItemIds;
                    return chenckData.checkItem.checks;
                } else {
                    return [];
                }
            }(),
        };

        // 取消
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function () {

            submitCheckData($scope.chenckData)
        };

        function submitCheckData(data) {

            if (data.checkItem.forwardDays < 1)
                return toaster.pop('error', null, '请输入正确的提前时间');
            if (!data.checkItem.reminders)
                return toaster.pop('error', null, '请输入提醒内容');
            if (data.checkItem.checks.length < 1)
                return toaster.pop('error', null, '请添加检查项');

            if ($scope.selected.length > 0) {
                data.checkItem.checks[0].concernedItemIds = $scope.selected;
             

            }
            var param = {
                access_token: app.url.access_token,
                sendTime: data.sendTime,
                carePlanId: data.carePlanId,
                schedulePlanId: data.schedulePlanId,
                dateSeq: data.dateSeq,
                jsonData: JSON.stringify(data.checkItem)
            }

            if (data.id)
                param.id = data.id;

            $http.post(app.urlRoot + 'designer/saveCheckItem', param)
                .then(function (rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        rpn.data.chenckList = data.checkItem.concernedItemIds;
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };

        // 删除检验项
        $scope.removePick = function (index) {
            $scope.chenckData.checkItem.checks.splice(index, 1);
            $scope.parentData = [];
        };
      
        //checkbox添加，删除相关
        $scope.updateSelected = function (item, $event) {
            var checkbox = $event.target;
            var action = checkbox.checked ?
                'add' :
                'remove';
            if (action == 'add' && $scope.selected.indexOf(item.id) == -1) {
                $scope.selected.push(item.id);


            }
            if (action == 'remove' && $scope.selected.indexOf(item.id) != -1) {
                $scope.selected.splice($scope.selected.indexOf(item.id), 1);

            }

        }

        //全选订单
        $scope.selectAll = function ($event) {
            var checkbox = $event.target;
            var action = checkbox.checked ?
                'add' :
                'remove';
            for (var i = 0; i < $scope.parentData.length; i++) {
                var entity = $scope.parentData[i];
                $scope.updateSelected(entity, $event);
            }

        };
        //判断单个checkbox是否选中
        $scope.isSelected = function (item) {
                return $scope.selected.indexOf(item.id) >= 0;
            }
            //是否全选
        $scope.isSelectedAll = function () {
            // console.log($scope.parentData);
            if ($scope.parentData == null) {
                return false;
            }
            return $scope.selected.length === $scope.parentData.length;
        }
            // 添加检验项
        $scope.pickData = function () {
            var databox = new DataBox('data_res', {
                hasCheck: false,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: true,
                self: false,
                cover: false,
                selectView: false,
                arrType: [0, 0, 0, 0],
                search: {
                    url: app.urlRoot + 'base/searchCheckSuggest',
                    param: {
                        access_token: app.url.access_token,
                        text: 'text',
                        pageSize: 10000,
                        pageIndex: 0
                    },
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parent',
                        dataSet: 'data'
                    },
                    keyName: 'text',
                    unwind: false,
                    unLayered: true
                },
                data: {
                    url: app.urlRoot + 'base/getCheckSuggest',
                    param: {
                        access_token: app.url.access_token,
                        parentId: 0
                    }
                },
                async: {
                    url: app.urlRoot + 'base/getCheckSuggest',
                    dataKey: {
                        parentId: 'id'
                    },
                    data: {
                        access_token: app.url.access_token,
                    },
                    dataName: '',
                    target: {
                        data: '',
                        dataKey: {
                            id: 'id',
                            name: 'name'
                        }
                    }
                },
                titles: {
                    main: '添加检查',
                    searchKey: '检查名称',
                    label: '已选择检查'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-user-md dcolor',
                    head: 'headPicFileName'
                },
                fixdata: [],
                response: makeList,
                datakey: {
                    id: 'id',
                    name: 'name',
                    leaf: 'leaf'
                },
                info: {
                    name: 'name',
                    id: 'id'
                }
            });
        };
      
        //获取详细指标
        function getCheckData(id) {
            $http.get(app.urlRoot + 'base/getCheckSuggestItemList/' + id + '?access_token=' + app.url.access_token).then(function (data) {
                if (data.data.resultCode == 1) {
                    if (data.data.data && data.data.data.length > 0) {
                        $scope.parentData = data.data.data;
                    }
                } else {
                    toaster.pop('error', null, '获取单项指标列表失败');
                }

            })
        }

        function makeList(arry) {
            for (var i = 0; i < arry.length; i++) {
                $scope.$apply(function () {
                    $scope.chenckData.checkItem.checks.push({
                        id: arry[i].id,
                        name: arry[i].name
                    })
                });
            }
            var id = $scope.chenckData.checkItem.checks[0].id;
            delete $scope.chenckData.checkItem.checks[0].$$hashKey;
            //新增各项指标
            getCheckData(id);
        };

    };

})();