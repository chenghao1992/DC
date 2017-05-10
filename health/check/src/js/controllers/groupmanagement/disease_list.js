/**
 * Created by Administrator on 2016/7/22.
 */
'use strict';
(function() {

angular.module('app').controller('MydiseaseCtrl', MydiseaseCtrl);
MydiseaseCtrl.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams', '$modal','toaster'];
function MydiseaseCtrl($rootScope, $scope, $state, $timeout, $http, utils, $stateParams, $modal, toaster) {
    $scope.isshow=false;

    $scope.chooseDisease = function() {
        var contacts = new Tree('CarePlanLibraryTree', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1],
            data: {
                url: app.url.group.getDiseaseTree,
                param: {}
            },
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                pid: 'department',
                leaf: 'leaf'
            },
            root: {
                selectable: false,
                name: '全部疾病',
                id: null
            },
            events: {
                click: treeClick
            }
        });
    };
    $scope.chooseDisease();
    //点击树获取疾病介绍
    function treeClick(info) {
        $scope.disb = info.leaf;
        $scope.diseaseid = info.id;
        if (info) {
            $http.post(app.url.group.findById, {
                access_token: app.url.access_token,
                diseaseId: info.id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.diseaseData = data.data;
                    $scope.introduction = $scope.diseaseData.introduction;
                    $scope.remark = $scope.diseaseData.remark;
                    $scope.attention = $scope.diseaseData.attention;
                    $scope.alias = $scope.diseaseData.alias;
                    if ($scope.findid) {
                        if ($scope.findid != info.id) {
                            toaster.pop('error', null, '请先保存');
                            $scope.findid = "";
                            return;
                        }
                    }


                }
            })
        }
    };


    //搜索疾病树
    $scope.searchDiseaceClick = function(searchdiseaseText) {
        //$scope.isshow=true;
        $scope.disb="";
        if (searchdiseaseText == "") {
            $scope.chooseDisease();
        } else {
            var contacts = new Tree('CarePlanLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                //search: true,
                arrType: [1, 1, 1],
                data: {
                    url: app.url.group.searchDiseaseTreeByKeyword,
                    param: {
                        access_token: app.url.access_token,
                        keyword: searchdiseaseText
                    }
                },
                // search: {
                //     searchDepth: [2],
                //     dataKey: {
                //         name: 'name',
                //         id: 'id',
                //         union: 'parentId',
                //         dataSet: 'data'
                //     },
                //     unwind: false
                // },
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'department',
                    leaf: 'leaf'
                },
                root: {
                    selectable: true,
                    name: '全部',
                    id: null
                },
                events: {
                    click: treeClick
                }
                // callback: function() {
                //     var dts = contacts.tree.find('dt');
                //     // 默认获取root 全部 的数据
                //     // $scope.treeLoading = true;
                //     // if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                //     //     treeClick(dts.eq(0).data().info);
                //     // $scope.treeLoading = false;
                // }
            });
        }
    };

    // $scope.$watch('addRemarkStrText', function(){
    //     var  reg=/，|,|{}/;
    //    if(reg.test($scope.addRemarkStrText)){
    //         $scope.addRemarkEnt();
    //    }

    // });
    // $scope.$watch('addaliaskText', function(){
    //     var  reg=/，|,|{}/;
    //    if(reg.test($scope.addaliaskText)){
    //         $scope.addaliasEnt();
    //    }

    // });
    $scope.romveremark = function(index) {
        $scope.myremark.splice(index, 1);
    };
    $scope.romvealias = function(index) {
        $scope.myalias.splice(index, 1);
    };
    $scope.addRemarkEnt = function() {
        $scope.myremark.push($scope.addRemarkStrText);
        $scope.addRemarkStrText = "";
    };
    $scope.addaliasEnt = function() {

        if ($scope.myalias.length >= 20) {
            toaster.pop('error', null, '常用名数量不能大于20个');
            $scope.addaliaskText = "";
            return;
        }
        if ($scope.addaliaskText == "") {
            toaster.pop('error', null, '请输入常用名');
            return;
        }
        $scope.myalias.push($scope.addaliaskText);
        $scope.addaliaskText = '';


    };
    $scope.myeditDisease = function(id) {
        $scope.findid = id;
        $scope.seveDisease = id;
        $http.post(app.url.group.findById, {
            access_token: app.url.access_token,
            diseaseId: id
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.diseDatacheck=data.data;
                $scope.username = data.data.name;
                $scope.myintroduction = $scope.diseDatacheck.introduction;
                $scope.myremark = $scope.diseDatacheck.remark;
                $scope.myattention = $scope.diseDatacheck.attention;
                $scope.myalias = $scope.diseDatacheck.alias;
                $scope.aliasTemp = $scope.myalias;
                $scope.remarkTemp = $scope.myremark;
                $scope.isshow=true;
               
            }
        })

    };
    $scope.modalCancel = function() {
        $scope.findid = "";
        $scope.isshow=false;
    };
    $scope.diseaseOk = function() {
        $http.post(app.url.group.setDiseaseInfo, {
            access_token: app.url.access_token,
            diseaseId: $scope.seveDisease,
            introduction: $scope.myintroduction,
            remark: $scope.myremark.toString() || "",
            alias: $scope.myalias.toString() || "",
            attention: $scope.myattention
        }).success(function(data) {
            if (data.resultCode == 1) {
                //$scope.diseaseData=data.data;
                toaster.pop('success', null, '编辑保存成功');
                $scope.introduction = $scope.myintroduction;
                $scope.remark = $scope.myremark;
                $scope.attention = $scope.myattention;
                $scope.alias = $scope.myalias;
                $scope.findid = "";
                $scope.isshow=false;
            } else {
                toaster.pop('success', null, data.resultMsg);
            }

        })
    };
};

})();
