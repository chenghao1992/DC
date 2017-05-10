'use strict';
(function() {

//品种库管理
angular.module('app').controller('addGoodGroupCtrl', addGoodGroupCtrl);
addGoodGroupCtrl.$inject = ['$rootScope', '$scope', '$state', '$modal', '$http', 'utils', 'toaster', '$stateParams', '$timeout'];
function addGoodGroupCtrl($rootScope, $scope, $state, $modal, $http, utils, toaster, $stateParams, $timeout) {
    //初始化参数
    var access_token = app.url.access_token,
        drugCompanyParam = '';
    //初始化翻页数据
    $scope.pageSize = 10;
    $scope.pageIndex = 0;
    $scope.keyWord = null;

    //保存品种库
    $scope.save = function() {
        if (!$scope.generalName) {
            toaster.pop('error', null, "通用名称不能为空");
            return;
        }
        if (!$scope.manufacturer) {
            toaster.pop('error', null, "生产厂家不能为空");
            return;

        }
        if (!$scope.manufacturer2) {
            toaster.pop('error', null, "厂家简称不能为空");
            return;
        }
        if (!$scope.pharmacoTypes || $scope.pharmacoTypes=='[]') {
            toaster.pop('error', null, "请选择药理类别");
            return;
        }
        var thisTradeName = '';
        var thisGeneralName = '';
        if ($scope.tradeName) {
            thisTradeName = makePy($scope.tradeName)[0];
        }
        if ($scope.generalName) {
            thisGeneralName = makePy($scope.generalName)[0];
        }
        var abbr = thisTradeName+ '/' + thisGeneralName;

        $http.post(app.url.VartMan.addGoodsGroup, {
            access_token: app.url.access_token,
            generalName: $scope.generalName,
            tradeName: $scope.tradeName || '',
            manufacturer: $scope.manufacturer || '',
            manufacturer2: $scope.manufacturer2 || '',
            pharmacoTypes: $scope.pharmacoTypes || '',
            companyId: $scope.companyId,
            abbr: abbr || ''
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "保存成功");
                $state.go('app.VarietyManage.list');
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        });
    };

    //返回上一页
    $scope.GoBack = function() {
        history.back(-1);
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
                // searchDepth: [0],
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
                leaf: 'leaf'
            }
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
            $scope.pharmacoTypes = JSON.stringify(PhTypes);
            $scope.pharmacoTypesKeys = PhTypes;
        }, 100);

    }

    //选择药理类别
    $scope.ChoosePharmacoTypes1 = function() {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'mySelectfPharmacoTypes.html',
            controller: 'selectfPharmacoTypesCtrl',
            windowClass: 'searchDocModal',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.pharmacoTypes = selectedItem;

        }, function() {});
    };





    //请选择所属企业
    $scope.ChooseCompany = function() {

        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'myModalCompany.html',
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
            $scope.companyName = selectedItem.name;
        }, function() {});
    };

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


angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
ModalCompanyCtrl.$inject = ['$scope', '$modalInstance', '$http', 'items'];
function ModalCompanyCtrl($scope, $modalInstance, $http, items) {
    //初始化药企列表
    (function() {
        $http.post(app.url.compnMan.searchAllPAndMDrugCompany, {
            access_token: app.url.access_token
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.companyList = data.data;
                $scope.orderType = 'name';
            }
        });
    })();
    $scope.selected = {
        item: $scope.companyList
    };

    $scope.modalOk = function() {
        $modalInstance.close($scope.selected.item);
    };

    $scope.modalCancel = function() {
        $modalInstance.close('cancel');
    };
};
angular.module('app').controller('selectfPharmacoTypesCtrl', selectfPharmacoTypesCtrl);
selectfPharmacoTypesCtrl.$inject = ['$scope', '$modalInstance', '$http', 'items'];
function selectfPharmacoTypesCtrl($scope, $modalInstance, $http, items) {

    $scope.my_tree = {};
    //当前选中的病种id
    var currentTreeId;
    //文档树的数据
    $scope.my_data = [];
    $scope.PharmocologiCalTypes = [];

    function clone(myObj) {
        var newObj = {};
        newObj.label = myObj.name;
        //newObj.label=myObj.name+'('+myObj.count+')';
        newObj.id = myObj.id;

        if (myObj.children != undefined && myObj.children[0].leaf === false) {
            newObj.children = [];
            for (var i in myObj.children) {
                newObj.children[i] = clone(myObj.children[i]);
            }
        }
        return newObj;
    }
    //这里要获取病种树的数据
    var getTreeData = function() {
        $http.post(app.url.document.getDiseaseTree, {
            access_token: app.url.access_token
        }).success(function(data, status, headers, config) {
            if (data.resultCode == 1) {
                console.log(data.data);
                var source = {
                    count: data.data.total,
                    name: '全部病种'
                };
                source.children = data.data;
                var result = clone(source);
                var eArray = new Array();
                eArray[0] = result;
                $scope.my_data = eArray;
                $scope.isTreeLoaded = true;
            } else {
                console.log(data.resultMsg);
            }
        }).error(function(data, status, headers, config) {
            alert(data.resultMsg);
        });
    };

    getTreeData();

    //点击文档树节点
    $scope.my_tree_handler = function(branch) {
        currentTreeId = branch.id;
        $http.post(app.url.drug.getAllPharmacologicalList, {
            access_token: localStorage.getItem('check_access_token'),
            diseaseId: currentTreeId
        }).then(function(resp) {
            if (resp.data.resultCode === 1) {
                $scope.pharmacologicalData = resp.data.data;
                console.log(resp.data);
            } else {
                console.log(resp.data.resultMsg);
            }
        });
    };
    $scope.addPharmocologiCalType = function(item) {
        console.log(item.index);
        $scope.PharmocologiCalTypes.push(item);
        //if(!item.isOpen){
        //
        //    $scope.PharmocologiCalTypes.push(item);
        //    //item.isOpen=true;
        //    console.log($scope.PharmocologiCalTypes)
        //
        //}else{
        //    //item.isOpen=false;
        //
        //}


    };
    $scope.removeItem = function(index) {
        $scope.PharmocologiCalTypes.splice(index, 1);
    };
    $scope.modalOk = function() {
        $scope.PharmocologiCalTypesSelected = $scope.PharmocologiCalTypes;
        $modalInstance.close($scope.PharmocologiCalTypesSelected);
    };

    $scope.modalCancel = function() {
        $modalInstance.close('cancel');
    };
};

})();
