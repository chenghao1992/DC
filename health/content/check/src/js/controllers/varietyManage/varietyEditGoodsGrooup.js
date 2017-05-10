'use strict';
(function() {

//品种库管理
angular.module('app').controller('EditGoodsGroupCtrl', EditGoodsGroupCtrl);
EditGoodsGroupCtrl.$inject = ['$rootScope', '$scope', '$modal', '$state', '$http', 'utils', 'toaster', '$stateParams', '$timeout'];
function EditGoodsGroupCtrl($rootScope, $scope, $modal, $state, $http, utils, toaster, $stateParams, $timeout) {
    //初始化参数
    var access_token = app.url.access_token,
        drugCompanyParam = '';



    var id = $stateParams.id;
    //初始化翻页数据
    $scope.pageSize = 10;
    $scope.pageIndex = 0;
    $scope.keyWord = null;


    //初始化编辑内容
    $scope.ShowGoodsList = function(id) {
        $http.post(app.url.VartMan.viewGoodsGroup, {
            access_token: app.url.access_token,
            id: id
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.GoodData = data;
                $scope.pharmacoTypes = $scope.GoodData.data.pharmacoTypes;
                $scope.pharmacoTypesText = $scope.GoodData.data.pharmacoTypesText;
                $scope.GoodData.data.pharmacoTypes = JSON.stringify($scope.GoodData.data.pharmacoTypes);
                $scope.pharmacoTypesKeys = $scope.pharmacoTypes;
            }
        }).error(function(e) {
            console.log(e)
        })
    };

    $scope.ShowGoodsList(id);

    //返回上一页
    $scope.GoBack = function() {
        history.back(-1);
    };

    //update
    $scope.Update = function() {
        if (!$scope.GoodData.data.generalName) {
            toaster.pop('error', null, "通用名称不能为空");
            return;
        }
        if (!$scope.GoodData.data.manufacturer) {
            toaster.pop('error', null, "生产厂家不能为空");
            return;

        }
        if (!$scope.GoodData.data.manufacturer2) {
            toaster.pop('error', null, "厂家简称不能为空");
            return;
        }
        if ($scope.GoodData.data.pharmacoTypes=='[]') {
            toaster.pop('error', null, "请选择药理类别");
            return;
        }
        var thisTradeName = '';
        var thisGeneralName = '';
        if ($scope.GoodData.data.tradeName) {
            thisTradeName = makePy($scope.GoodData.data.tradeName)[0];
        }
        if ($scope.GoodData.data.generalName) {
            thisGeneralName = makePy($scope.GoodData.data.generalName)[0];
        }
        var abbr = thisTradeName + '/' + thisGeneralName;
        // var abbr = makePy($scope.GoodData.data.tradeName)[0] + '/' + makePy($scope.GoodData.data.generalName)[0];

        $http.post(app.url.VartMan.updateGoodsGroup, {
            access_token: app.url.access_token,
            id: id,
            generalName: $scope.GoodData.data.generalName || '',
            manufacturer: $scope.GoodData.data.manufacturer || '',
            tradeName: $scope.GoodData.data.tradeName || '',
            pharmacoTypes: $scope.GoodData.data.pharmacoTypes || '',
            manufacturer2: $scope.GoodData.data.manufacturer2 || '',
            companyId: $scope.companyId,
            abbr: abbr || ''
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "更新成功");
                $state.go('app.VarietyManage.list');
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        });
    };

    //delete
    $scope.Delete = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalDelete.html',
            controller: 'ModalDeleteCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return id;
                },
                strName: function() {
                    return $scope.GoodData.data.generalName;
                },
                tabName: function() {
                    return $scope.GoodData.data.tradeName;
                }
            }
        });
    };



    //选择类别标签
    $scope.ChoosePharmacoTypes = function() {
        var tagsModal = new DataBox('data_res', {
            hasCheck: true,
            allCheck: false,
            leafCheck: false,
            multiple: true,
            allHaveArr: false,
            self: true,
            cover: false,

            selectView: true,
            search: {
                // searchDepth: [2],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data'
                },
                unwind: false
            },
            arrType: [0, 0],
            data: {
                url: app.url.VartMan.getPharmacologicalTree + "?access_token=" + app.url.access_token
            },
            titles: {
                main: '选择药理类别',
                searchKey: '搜索药理类别...',
                label: '已选择药理类别'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            },
            fixdata: $scope.pharmacoTypesKeys,
            response: tagsSelected,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                parentId: 'parentId'
            }
            //},
            //callback: function(tree) {
            //    $(".secondLevel").closest(".cnt-list-warp").remove();
            //}
        });

    };

    function tagsSelected(dt) {
        var str = '';
        var PhTypes = [];
        if (dt.length > 0) {
            for (var i = 0; i < dt.length; i++) {
                PhTypes[i] = { name: dt[i].name, id: dt[i].id }
            }
        }
        for (var n = 0; n < dt.length; n++) {
            if (n == 0) {
                str = dt[n].name;
            } else {
                str += ',' + dt[n].name;
            }
        }

        $timeout(function() {
            $scope.pharmacoTypesText = str;
            $scope.GoodData.data.pharmacoTypes = JSON.stringify(PhTypes);
            $scope.pharmacoTypesKeys = PhTypes;
        }, 100);

    }
    //请选择所属企业
    $scope.ChooseCompany = function() {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalCompanySelect.html',
            controller: 'ModalCompanyCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.GoodData.data.companyName = selectedItem.name;

        }, function() {});
    };

    //返回值:拼音首字母串数组
    $scope.makePy = function(str) {
        $scope.makePy = function(str) {
            var arrResult = new Array(); //保存中间结果的数组
            if (str) {
                for (var i = 0, len = str.length; i < len; i++) {
                    var ch = str.charAt(i);

                    arrResult.push(checkCh(ch));
                }
            }
            var item = mkRslt(arrResult)[0].toString();
            return item.toUpperCase();
        };

    };
};

angular.module('app').controller('ModalDeleteCtrl', ModalDeleteCtrl);
ModalDeleteCtrl.$inject = ['$scope', '$uibModalInstance', '$http', 'items', 'toaster', '$state', 'strName', 'tabName'];
function ModalDeleteCtrl($scope, $uibModalInstance, $http, items, toaster, $state, strName, tabName) {
    $scope.strName = strName;
    $scope.tabName = tabName;


    $scope.deletemodalCancel = function() {
        $uibModalInstance.close('cancel');
    };
    $scope.deletemodalOk = function() {
        $http.post(app.url.VartMan.deleteGoodsGroup, {
            access_token: app.url.access_token,
            id: items
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "删除成功");
                $uibModalInstance.close('cancel1');
                $state.go('app.VarietyManage.list');
            } else {
                toaster.pop('error', null, data.resultMsg);
                //$modalInstance.close('cancel1');
            }
        });
    }
};
angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
ModalCompanyCtrl.$inject = ['$scope', '$uibModalInstance', '$http', 'items', 'toaster', '$state'];
function ModalCompanyCtrl($scope, $uibModalInstance, $http, items, toaster, $state) {
    //初始化药企列表
    (function() {
        $http.post(app.url.compnMan.searchAllPAndMDrugCompany, {
            access_token: app.url.access_token
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.companyList = data.data;
                $scope.order = 'name';
            }
        });
    })();
    $scope.selected = {
        item: $scope.companyList
    };

    $scope.modalOk = function() {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.modalCancel = function() {
        $uibModalInstance.close('cancel');
    };
};
})();
