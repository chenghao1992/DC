'use strict';
(function() {

angular.module('app').controller('patientsCtlr', patientsCtlr);
patientsCtlr.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce'];
function patientsCtlr($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce) {

    var access_token = app.url.access_token;
    $scope.pageSize = 10;
    $scope.pageIndex = 0;
    $scope.isActive = $stateParams.username;
    $scope.patientsData = function (pageIndex, pageSize) {

        $http.post(app.url.group.getRecommendDocList, {
            access_token: app.url.access_token,
            isApp: false,
            groupId: 'platform',
            pageIndex: pageIndex,
            pageSize: pageSize,
            source:'web'
        }).success(function(data) {
            $scope.dortorData = data.data.pageData;
            $scope.totia = data.data;
            //console.log($scope.totia);

        }).error(function(e) {

        })
        //return _patientsData;
    };
    $scope.patientsData( $scope.pageIndex,$scope.pageSize);
    $scope.pageChanged = function(pageIndex, pageSize) {
        $scope.patientsData(pageIndex-1, pageSize);
    };
    //推荐集团列表
    $scope.companyData = function _companyData() {
        $http.post(app.url.group.getGroupRecommendedList, {
            access_token: access_token
        }).success(function(groupdata) {
            $scope.companyGroup = groupdata.data;

        }).error(function(e) {

        })
    }
    $scope.companyData();
    //疾病列表
    $scope.diseaseData = function() {

        $http.post(app.url.group.getCommonDiseases, {
            access_token: access_token,
            pageIndex: 0,
            pageSize: 20

        }).success(function(disedata) {
            $scope.diseaData = disedata.data;
        }).error(function(e) {

        })
    }
    $scope.diseaseData();
    //移除疾病
    $scope.deletedisea = function(item) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'deletediseadome.html',
            controller: 'ModaldeleteCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            $scope.diseaseData();
        }, function() {});

    }
    angular.module('app').controller('ModaldeleteCtrl', ModaldeleteCtrl);
    ModaldeleteCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeleteCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.removeCommonDisease, {
                access_token: access_token,
                diseaseId: items
            }).success(function(data) {
                toaster.pop('success', null, '移除推荐疾病成功');
                $uibModalInstance.close('center');

            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };

    //上移疾病
    $scope.updisea = function(item) {
            $http.post(app.url.group.riseCommonDisease, {
                access_token: access_token,
                diseaseId: item
            }).success(function(data) {
                toaster.pop('success', null, '上移推荐疾病成功');
                $scope.diseaseData();
            })
        }
        //移除推荐集团
    $scope.deletegruop = function(item) {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'deletegruopdome.html',
            controller: 'ModaldeletegruopCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            $scope.companyData();
        }, function() {});
    };
    angular.module('app').controller('ModaldeletegruopCtrl', ModaldeletegruopCtrl);
    ModaldeletegruopCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeletegruopCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.removeGroupRecommended, {
                access_token: access_token,
                groupId: items
            }).success(function(data) {
                toaster.pop('success', null, '移除推荐集团成功');
                $uibModalInstance.close('center');
            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };

    //上移集团
    $scope.riseRegruop = function(item) {
            $http.post(app.url.group.riseRecommendedOfGroup, { access_token: access_token, groupId: item }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '上移集团成功');
                    $scope.companyData();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            })

        }
        //移除推荐医生
    $scope.deletedroder = function(item,pageIndex,pageSize) {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'deletedorterdome.html',
            controller: 'ModaldeletedorterCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                },
                pageidex:function(){
                    return pageIndex;
                },
                pagesize:function(){
                    return pageSize;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            $scope.patientsData(pageIndex,pageSize);
        }, function() {});
    };
    angular.module('app').controller('ModaldeletedorterCtrl', ModaldeletedorterCtrl);
    ModaldeletedorterCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeletedorterCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.delDoctor, {
                access_token: access_token,
                id: items
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '移除推荐医生成功');
                    $uibModalInstance.close('center');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }

            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };


    //推荐医生
    $scope.setdroder = function(item, sum,pageIndex,pageSize) {
            $scope.sum = sum;
            if ($scope.sum == 1) {
                $http.post(app.url.group.setRecommend, {
                    access_token: access_token,
                    id: item,
                    isRecommend: 1

                }).success(function(data) {
                    if (data.resultCode==1) {
                        toaster.pop('success', null, '推荐医生成功');
                        $scope.patientsData(pageIndex,pageSize);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                })
            } else if ($scope.sum == 2) {
                $http.post(app.url.group.setRecommend, {
                    access_token: access_token,
                    id: item,
                    isRecommend: 2
                }).success(function(data) {
                    if (data) {
                        toaster.pop('success', null, '取消推荐医生');
                        $scope.patientsData(pageIndex,pageSize);
                    }
                })
            }

        }
        //上移医生
    $scope.riseReDoctor = function(item,pageIndex,pageSize) {
        $http.post(app.url.group.upWeight, {
            access_token: access_token,
            id: item
        }).success(function(data) {
            toaster.pop('success', null, '上移医生成功');
            $scope.patientsData(pageIndex-1, pageSize);
        })
    }

    function tagsSelected(dt) {
        $scope.keywords = dt;
        $scope.$apply($scope.keywords);
    }
    $scope.removeItem = function(item) {
        var index = $scope.keywords.indexOf(item);
        $scope.keywords.splice(index, 1);
    };


    //推荐集团按钮
    $scope.ChooseCompany = function() {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'myModalPatients.html',
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
            $scope.companyData();
        }, function() {});
    };
    //推荐医生
    $scope.hotdocter = function(pageIndex,pageSize) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalhotdocter.html',
            controller: 'ModalhotdocterCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.items;
                }
                // pageidex:function(){
                //     return pageIndex;
                // },
                // pagesize:function(){
                //     return pageSize;
                // } 

            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            $scope.patientsData(pageIndex,pageSize);
        }, function() {});
    };
    $scope.diseasesview = function(diseaseId) {
        var diseaseId = diseaseId;
        $scope.diseaseId = diseaseId;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'hotyiyao.html',
            controller: 'ModalhotyiyaoCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.diseaseId;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            $scope.diseaseData(0, 10);

        }, function() {});
    };
    $scope.Commondiseases = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'mypatlst.html',
            controller: 'ModalpatlstCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return access_token;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            $scope.diseaseData(0, 10);
        }, function() {});
    }

};
//集团
angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
ModalCompanyCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster', '$rootScope', 'items'];
function ModalCompanyCtrl($scope, $state, $uibModalInstance, $http, toaster, $rootScope, items) {
    $scope.selectedList = [];
    $scope.pageSize = 6;
    $scope.pageIndex = 1;
    $scope.searchName = null;
    $scope.searchgroup = function _searchgroup(pageIndex, pageSize, searchName) {

        $http.post(app.url.group.searchGroupByName, {
            access_token: app.url.access_token,
            name: searchName,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.data = data.data;
            } else {
                toaster.pop('error', null, data.resultMsg);
            }

        })
    };
    $scope.searchgroup($scope.pageIndex - 1, $scope.pageSize, $scope.searchName);
    $scope.pageChanged = function() {
        $scope.searchgroup($scope.pageIndex - 1, $scope.pageSize, $scope.searchName);
    };
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    };

    $scope.singleSelected = function(item) {
        var hasS = false;
        for (var i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == item) {
                $scope.selectedList.splice(i, 1);
                hasS = true;
            }
        }
        if (!hasS) {
            if (item.certState != 9 && item.certState != 1) {
                $scope.selectedList.push(item);
            }

        }

    };
    $scope.modalOk = function() {
        if ($scope.selectedList.length<=0) {
            toaster.pop('error', null, '请选择集团');
            return;
        }
        $http.post(app.url.group.setGroupToRecommended, {
            access_token: app.url.access_token,
            groupId: $scope.selectedList.toString()
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '添加推荐成功');
                $uibModalInstance.close('center');
            } else if (data.resultCode == 0) {

                toaster.pop('error', null, data.resultMsg);
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        })
    };

};
//医生
angular.module('app').controller('ModalhotdocterCtrl', ModalhotdocterCtrl);
ModalhotdocterCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster'];
function ModalhotdocterCtrl($scope, $state, $uibModalInstance, $http, toaster) {
    $scope.pageSize = 6;
    $scope.pageIndex = 1;
    $scope.searchName = null;
    $scope.selectedList = [];
    $scope.ishide=false;
    $scope.searchdor = function(pageIndex, pageSize, keyword) {
        $http.post(app.url.group.searchByKeyword, {
            access_token: app.url.access_token,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: 6
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.dorData = data.data;
                if ($scope.dorData.total == 0) {
                    $scope.ishide=true;
                } else {
                    $scope.ishide=false;
                }
            } else {
                toaster.pop('error', null, data.resultMsg);
            }


        })
    };

    $scope.pageChanged = function() {
        $scope.searchdor($scope.pageIndex - 1, $scope.pageSize, $scope.keyword);
    };

    $scope.modalOk = function() {
         $scope.isSaved=true;
        if ($scope.selectedList.length<=0) {
            toaster.pop('error', null, '请选择医生');
             $scope.isSaved=false;
            return;
        }
        $http.post(app.url.group.addDoctors, {
            access_token: app.url.access_token,
            doctorIds: $scope.selectedList.toString(),
            groupId: 'platform'
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '添加推荐成功');
                $uibModalInstance.close('center');
            } else {
                toaster.pop('error', null, data.resultMsg);
                $scope.isSaved=false;

            }
        })
    };

    $scope.singleSelected = function(item) {
        var hasS = false;
        for (var i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == item) {
                $scope.selectedList.splice(i, 1);
                hasS = true;
            }
        }
        if (!hasS) {
            if (item.certState != 9 && item.certState != 1) {
                $scope.selectedList.push(item);
            }

        }
    };
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    };
};

//疾病介绍
angular.module('app').controller('ModalhotyiyaoCtrl', ModalhotyiyaoCtrl);
ModalhotyiyaoCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster','items'];
function ModalhotyiyaoCtrl($scope, $state, $uibModalInstance, $http, toaster, items) {
    $scope.isshow=true;

    $scope.hotData = (function() {
        $http.post(app.url.group.findById, {
            access_token: app.url.access_token,
            diseaseId: items
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.diseaseData = data.data;
                $scope.introduction1 = $scope.diseaseData.introduction;
                $scope.remark1 = $scope.diseaseData.remark;
                $scope.attention1 = $scope.diseaseData.attention;
                $scope.alias1 = $scope.diseaseData.alias;
            }
        })
    })();

    $scope.$watch('addRemarkStr', function(event) {
        var reg = /，|,|{}/;
        if (reg.test($scope.addRemarkStr)) {
            $scope.addRemark();
        }

    });
    $scope.$watch('addRemarkStr1', function(event) {
        var reg = /，|,|{}/;
        if (reg.test($scope.addRemarkStr1)) {
            $scope.addAlias();
        }

    });
    $scope.romveremark = function(index) {
        $scope.remark.splice(index, 1);
    }
    $scope.romveralias = function(index) {
        $scope.alias.splice(index, 1);
    }
    $scope.addRemark = function() {
        var str = $scope.addRemarkStr;
        str = str.substring(0, str.length - 1);
        $scope.remark.push(str);
        $scope.addRemarkStr = "";
    }
    $scope.addAlias = function() {
        var str = $scope.addAliasStr;
        str = str.substring(0, str.length - 1);
        $scope.alias.push(str);
        $scope.addAliasStr = '';
    }
    $scope.addRemarkEnt = function() {
        $scope.remark.push($scope.addRemarkStr);
        $scope.addRemarkStr = "";
    }
    $scope.addAliasEnt = function() {
        if ($scope.alias.length >= 20) {
            toaster.pop('error', null, '常用名数量不能大于20个');
            $scope.addAliasStr = "";
            return;
        } else {
            $scope.alias.push($scope.addAliasStr);
            $scope.addAliasStr = "";
        }

    }
    $scope.editDiseaseCheck = function() {
        $http.post(app.url.group.findById, {
            access_token: app.url.access_token,
            diseaseId: items
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.diseaseData = data.data;
                $scope.introduction = $scope.diseaseData.introduction;
                $scope.remark = $scope.diseaseData.remark;
                $scope.attention = $scope.diseaseData.attention;
                $scope.alias = $scope.diseaseData.alias;
            }
        })
        $scope.isshow=false;
    }
    $scope.cancelColse = function(items) {
        $scope.isshow=true;
    }
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    }
    $scope.diseaseOk = function() {

        $http.post(app.url.group.setDiseaseInfo, {
            access_token: app.url.access_token,
            diseaseId: items,
            introduction: $scope.introduction,
            remark: $scope.remark.toString(),
            alias: $scope.alias.toString(),
            attention: $scope.attention
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '编辑保存成功');
                $scope.introduction1 = $scope.introduction;
                $scope.remark1 = $scope.diseaseData.remark;
                $scope.attention1 = $scope.attention;
                $scope.alias1 = $scope.diseaseData.alias;
                $scope.isshow=true;
            } else {
                toaster.pop('success', null, data.resultMsg);
            }

        })
    };



};
//疾病
angular.module('app').controller('ModalpatlstCtrl', ModalpatlstCtrl);
ModalpatlstCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce', '$uibModalInstance'];
function ModalpatlstCtrl($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce, $uibModalInstance) {

    $scope.choosetreeDisease = function() {
        var contacts = new Tree('CarePlanLibraryTree', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1, 0],
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
                name: '全部',
                id: null
            },
            events: {
                click: treeClick
            },
            callback: function() {
                var dts = contacts.tree.find('dt');
                // // 默认获取root 全部 的数据
                // $scope.treeLoading = true;
                // if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                //     treeClick(dts.eq(0).data().info);
            }
        });
    }


    $timeout(function() {
        $scope.choosetreeDisease();
    }, 10);


    //点击树获取疾病介绍
    function treeClick(info) {

        $scope.diseaseid = info;
        if (info.leaf) {
            $http.post(app.url.group.getDiseaseAlias, {
                access_token: app.url.access_token,
                diseaseId: $scope.diseaseid.id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.diseaseData = data.data;
                    //console.log($scope.diseaseData);
                }
            })
        } else {
            $timeout(function() {
                $scope.diseaseData = null;
                $scope.diseaseid = null;

            }, 0)

        }
    };


    //搜索疾病树
    $scope.diseaceClick = function() {
        if ($scope.diseaseText == "") {
            $scope.choosetreeDisease();
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
                        keyword: $scope.diseaseText
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
                },
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
    }




    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    }
    $scope.saveThisRadioValue = function(x) {
        if (x) {
            $scope.thisRadio = x;
        } else {
            $scope.thisRadio;
        }

    }
    $scope.modalOk = function() {
        //console.log($scope.thisRadio);
        if ($scope.thisRadio) {
            $http.post(app.url.group.addCommonDisease, {
                access_token: app.url.access_token,
                diseaseId: $scope.diseaseid.id,
                name: $scope.thisRadio
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '添加推荐成功');
                    $uibModalInstance.close('center');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            })
        } else {
            toaster.pop('error', null, '请选择名称');
        }

    }
};

})();
