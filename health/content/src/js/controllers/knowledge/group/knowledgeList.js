/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('groupKnowledgeListCtrl', funGroupKnowledgeListCtrl);

    funGroupKnowledgeListCtrl.$inject = ['$scope', '$http', '$state', '$modal', 'toaster', '$stateParams'];

    function funGroupKnowledgeListCtrl($scope, $http, $state, $modal, toaster, $stateParams) {
        var curGroupId = localStorage.getItem('curGroupId');
        $scope.pageSize = 10;
        $scope.pageIndex = 1;
        //判断分页是在哪个条件下的翻转
        $scope.searchTypeIndex = 1;

        $scope.isEditBeforeWidthcategoryId = $stateParams.isEditBeforeWidthcategoryId;
        $scope.isSearchByAllCategory = $stateParams.isSearchByAllCategory == 'true' ? true : false;
        if($scope.isEditBeforeWidthcategoryId){
            $scope.carActiveId=$scope.isEditBeforeWidthcategoryId;
        }else{
            $scope.carActiveId="allCarg";
        }
        
        //获取分类列表
        $scope.getCategoryList = function funGetCategoryList() {

            $http.post(app.url.knowledge.getCategoryList, {
                access_token: app.url.access_token,
                groupId: curGroupId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.categoryList = data.data;
                } else {

                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        $scope.findAllKnowledge = function() {

            $scope.isSearchByAllCategory = true;
            $scope.getGroupMedicalKnowledgeList();
        }
        $scope.getCategoryList();
        $scope.toDetails = function(item) {
                // body...
                // $state.go('app.groupKnowledge.info', { id: item.id, categoryId: item.categoryId });
                $state.go('app_groupKnowledge_info', { id: item.id, categoryId: item.categoryId, isTop: item.isTop, isSearchByAllCategory: $scope.isSearchByAllCategory });
            }
            //删除就医知识
        $scope.deleteKnowledge = function(item) {
            var modalInstance = $modal.open({
                templateUrl: 'deleteKnowledgeContent.html',
                controller: 'deleteKnowledgeContentCtrl',
                size: 'md',
                resolve: {
                    data: function() {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function(result) {

                if (result) {
                    //调用删除就医知识接口    
                    $http.post(app.url.knowledge.delKnowledgeById, {
                        access_token: app.url.access_token,
                        id: item.id,
                        groupId: curGroupId
                    }).
                    success(function(data) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, "删除就医知识成功");
                            $scope.getGroupMedicalKnowledgeList();
                            //$state.reload();

                        } else {
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data) {
                        //toaster.pop('error', null, data.resultMsg);
                        // alert(data.resultMsg);
                    });
                }


            });


        };
        //新增就医知识分类
        $scope.addGroupCategory = function(item) {

            var modalInstance = $modal.open({
                templateUrl: 'addGroupCategory.html',
                controller: 'addGroupCategoryCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function() {
                //刷新分类列表
                $scope.getCategoryList();
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //新增就医知识分类
        $scope.deleteGroupCategory = function(item) {
            var modalInstance = $modal.open({
                templateUrl: 'deleteGroupCategory.html',
                controller: 'deleteGroupCategoryCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function() {
                //刷新分类列表
                $scope.getCategoryList();
            }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //获取集团就医知识列表
        $scope.getGroupMedicalKnowledgeList = function() {
            $scope.carActiveId="allCarg";
            $scope.isSearchByAllCategory = true;
            $http.post(app.url.knowledge.getGroupMedicalKnowledgeList, {
                access_token: app.url.access_token,
                groupId: curGroupId,
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10,
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.konwledgeList = data.data.pageData;
                    $scope.pageTotal = data.data.total;
                    $scope.searchTypeIndex = 1;
                    if (data.data.total == 0) {
                      //  toaster.pop('error', null, "没有找到符合条件的数据");
                        return;
                    }

                } else {
                    toaster.pop('error', null, data.resultMsg);


                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };



        $scope.pageChanged = function() {
                if ($scope.searchTypeIndex == 1) {
                    $scope.getGroupMedicalKnowledgeList();
                } else if ($scope.searchTypeIndex == 2) {
                    $scope.findKnowledgeListByKeys();
                } else if ($scope.searchTypeIndex == 3) {
                    $scope.getKnowledgeListByCategoryId($scope.itemThis);
                }

            }
            //根据关键字搜索文章
        $scope.findKnowledgeListByKeys = function() {
            if (!$scope.keyword) {
                toaster.pop('info', null, "请输入搜索关键字");
                return;
            }


            $http.post(app.url.knowledge.findKnowledgeListByKeys, {
                access_token: app.url.access_token,
                keywords: $scope.keyword || '',
                groupId: curGroupId,
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10,
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    if (data.data.total == 0) {
                      //  toaster.pop('error', null, "没有找到符合条件的数据");
                    }
                    $scope.konwledgeList = data.data.pageData;
                    $scope.pageTotal = data.data.total;
                    $scope.searchTypeIndex = 2;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        //根据分类ID获取文章列表
        $scope.getKnowledgeListByCategoryId = function(item) {
            $scope.isSearchByAllCategory = false;
            var thisCagId = '';
            if ($scope.isEditBeforeWidthcategoryId) {
                thisCagId = item;
                $scope.isEditBeforeWidthcategoryId = null;
                $scope.carActiveId=item;
            } else {
                $scope.itemThis = item;
                thisCagId = $scope.itemThis.id;
                $scope.carActiveId=$scope.itemThis.id;
            }
          

            $http.post(app.url.knowledge.getKnowledgeListByCategoryId, {
                access_token: app.url.access_token,
                categoryId: thisCagId || '',
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10,
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    if (data.data.total == 0) {
                       // toaster.pop('error', null, "没有找到符合条件的数据");

                    }
                    $scope.konwledgeList = data.data.pageData;
                    $scope.pageTotal = data.data.total;
                    $scope.searchTypeIndex = 3;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        //根据分类是否已经选过调不同的分类就医知识
        (function() {
            if ($scope.isSearchByAllCategory) {
                $scope.getGroupMedicalKnowledgeList();
                $scope.isEditBeforeWidthcategoryId = null;
            } else {
                if ($scope.isEditBeforeWidthcategoryId) {
                    console.log($scope.isEditBeforeWidthcategoryId);
                    var tId = $scope.isEditBeforeWidthcategoryId;
                    $scope.getKnowledgeListByCategoryId(tId);

                } else {
                    $scope.getGroupMedicalKnowledgeList();
                }
            }


        })()

        //设置就医知识为置顶
        $scope.setTop = function(item) {

            $http.post(app.url.knowledge.setTop, {
                access_token: app.url.access_token,
                id: item.id || '',
                bizId: curGroupId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "置顶成功");
                    $scope.getGroupMedicalKnowledgeList();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        //取消就医知识为置顶
        $scope.cancelTop = function(item) {

            $http.post(app.url.knowledge.cancelTop, {
                access_token: app.url.access_token,
                id: item.id || '',
                bizId: curGroupId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "取消置顶成功");
                    $scope.getGroupMedicalKnowledgeList();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        //上移已经置顶的就医知识
        $scope.upKnowledge = function(item) {

            $http.post(app.url.knowledge.upKnowledge, {
                access_token: app.url.access_token,
                id: item.id || '',
                bizId: curGroupId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "上移成功");
                    $scope.getGroupMedicalKnowledgeList();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };

    }
})();
app.controller('deleteGroupCategoryCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'item',function($scope, $modalInstance, toaster, $http, item) {
    //$scope.Category = Category;
    $scope.item = item;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var curGroupId = localStorage.getItem('curGroupId');

        $http.post(app.url.knowledge.delCategoryById, {
            access_token: app.url.access_token,
            id: item.id
        }).
        success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, "分类删除成功");
                $modalInstance.close('cancel');
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        }).
        error(function(data) {
            toaster.pop('error', null, data.resultMsg);
            // alert(data.resultMsg);
        });

    };
}]);
app.controller('addGroupCategoryCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'item',function($scope, $modalInstance, toaster, $http, item) {
    //$scope.Category = Category;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.item = item;
    $scope.category = item.name;
    var editType = {};
    var message = '';
    $scope.add = function() {

        var curGroupId = localStorage.getItem('curGroupId');
        if (!$scope.category) {
            toaster.pop('info', null, "请先输入分类名！");
            return;
        }
        //判断是更新，还是新增
        if (!item) {
            editType = app.url.knowledge.addGroupCategory;
            message = '分类添加成功';
            $http.post(editType, {
                access_token: app.url.access_token,
                groupId: curGroupId,
                name: $scope.category
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, message);
                    $modalInstance.close('cancel');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });
        } else {
            editType = app.url.knowledge.updateCategoryById;
            message = '分类更新成功';
            $http.post(editType, {
                access_token: app.url.access_token,
                groupId: curGroupId,
                name: $scope.category,
                id: item.id || ""
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, message);
                    $modalInstance.close('cancel');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });
        }




    };
}]);

angular.module('app').controller('deleteKnowledgeContentCtrl', deleteKnowledgeContentCtrl);

// 手动注入依赖
deleteKnowledgeContentCtrl.$inject = ['$scope', '$modalInstance', 'data'];


function deleteKnowledgeContentCtrl($scope, $modalInstance, data) {

    $scope.doctor = data;
    console.log(data);
    $scope.ok = function() {
        $modalInstance.close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss(false);
    };
};
