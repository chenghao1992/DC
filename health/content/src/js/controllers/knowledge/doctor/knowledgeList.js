/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('doctorKnowledgeListCtrl', funGroupKnowledgeListCtrl);

    funGroupKnowledgeListCtrl.$inject = ['$scope', '$http', '$state', '$modal', 'toaster', '$stateParams','$rootScope','$timeout'];

    function funGroupKnowledgeListCtrl($scope, $http, $state, $modal, toaster, $stateParams,$rootScope,$timeout) {
        var curGroupId = localStorage.getItem('curGroupId');
        //location.href=location.href+'?showGroupKnowledge='+$rootScope.showGroupKnowledge;
        $scope.hasGroupId=localStorage.getItem('curGroupId')?true:false;
        var userId = localStorage.getItem('user_id');
        //获取是否编辑过的参数
        $scope.isPersonKnowledgeEdit = ($stateParams.isPersonKnowledge == 'true' ? true : false);
        $scope.isEditBeforeWidthcategoryId = $stateParams.isEditBeforeWidthcategoryId;
        $scope.isSearchByAllCategory = $stateParams.isSearchByAllCategory == 'true' ? true : false;
       if($scope.isEditBeforeWidthcategoryId){
                $scope.carActiveId=$scope.isEditBeforeWidthcategoryId;
            }else{
                if(!$scope.isPersonKnowledgeEdit){
                    $scope.carActiveId="allCarg";
                }else{
                    $scope.carActiveId="perCargId";
                }
                
            }
       // console.log($scope.isPersonKnowledgeEdit);
        $scope.isPersonKnowledge = false;
        $scope.isNum = 1;
        $scope.pageSize = 10;
        $scope.pageIndex = 1;
        //判断分页是在哪个条件下的翻转
        $scope.whichType = 1;
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
        if($scope.hasGroupId){
            $scope.getCategoryList();
        }
        

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
                groupId: curGroupId||'1',
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10,
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.konwledgeList = data.data.pageData;
                    $scope.pageTotal = data.data.total;
                    $scope.searchTypeIndex = 1;
                    $scope.whichType = 1;
                    $scope.isPersonKnowledge = false;
                    if (data.data.total == 0) {
                        //toaster.pop('error', null, "没有找到符合条件的数据");

                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);


                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };


        //获取医生个人就医知识列表
        $scope.getDoctorMedicalKnowledgeList = function() {
            $scope.carActiveId="perCargId";
            $scope.isSearchByAllCategory = false;
            $http.post(app.url.knowledge.getDoctorMedicalKnowledgeList, {
                access_token: app.url.access_token,
                doctorId: userId,
                authorType: 0,
                groupId: curGroupId,
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10,
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.konwledgeList = data.data.pageData;
                    $scope.isPersonKnowledge = true;
                    $scope.pageTotal = data.data.total;
                    $scope.whichType = 2;
                    // if($scope.isNum!=1){
                    //     $scope.isPersonKnowledge=true;
                    // }else{
                    //     $scope.isPersonKnowledge=false;
                    // }
                    // $scope.isNum=2;
                    if (data.data.total == 0) {
                       // toaster.pop('error', null, "没有找到相关的个人文章");

                    }


                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        // $scope.getDoctorMedicalKnowledgeList();


        //删除就医知识
        $scope.deleteKnowledge = function(item) {
            var modalInstance = $modal.open({
                templateUrl: 'deletedoctorKlgContentHtml.html',
                controller: 'deletedoctorKlgContentCtrl',
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
                        id: item.id

                    }).
                    success(function(data) {
                        if (data.resultCode == 1) {
                            if (!data.data.status) {
                                toaster.pop('war', null, data.data.msg);
                                return;
                            }

                            toaster.pop('success', null, "删除就医知识成功");
                            $scope.getDoctorMedicalKnowledgeList();

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

        //根据关键字搜索文章
        $scope.findKnowledgeListByKeys = function() {

            $http.post(app.url.knowledge.findKnowledgeListByKeys, {
                access_token: app.url.access_token,
                keywords: $scope.keyword || '',
                groupId: curGroupId,
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.konwledgeList = data.data.pageData;
                    $scope.whichType = 3;
                    $scope.pageTotal = data.data.total;
                    if (data.data.total == 0) {
                       // toaster.pop('error', null, "没有找到符合条件的数据");

                    }
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
            if (item.id) {
                var thisItem = item.id;
                $scope.carActiveId=item.id;
            } else {
                var thisItem = item;
                $scope.carActiveId=item;
            }

            $http.post(app.url.knowledge.getKnowledgeListByCategoryId, {
                access_token: app.url.access_token,
                categoryId: thisItem,
                pageIndex: $scope.pageIndex - 1 || 0,
                pageSize: $scope.pageSize || 10
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.konwledgeList = data.data.pageData;
                    $scope.isPersonKnowledge = false;
                    $scope.whichType = 4;
                    $scope.pageTotal = data.data.total;

                    $scope.actItem = item;
                    if (data.data.total == 0) {
                       // toaster.pop('error', null, "没有找到符合条件的数据");

                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        //判读进来的是个人编辑后的打开的，还是第一次或者点其它分类进来的，加载人个或全部就医知识
        //$timeout(function(){
        //    if ($scope.isSearchByAllCategory) {
        //        if($rootScope.showGroupKnowledge){
        //            $scope.getGroupMedicalKnowledgeList();
        //        }
        //    } else {
        //        if ($scope.isPersonKnowledgeEdit) {
        //            $scope.getDoctorMedicalKnowledgeList();
        //
        //        } else {
        //            if (!$scope.isEditBeforeWidthcategoryId) {
        //                if($rootScope.showGroupKnowledge){
        //                    $scope.getGroupMedicalKnowledgeList();
        //                }
        //            } else {
        //                $scope.getKnowledgeListByCategoryId($scope.isEditBeforeWidthcategoryId);
        //            }
        //        }
        //    }
        //},0);
        (function() {

            if($stateParams.showGroupKnowledge==="false"){
                $scope.getDoctorMedicalKnowledgeList();
            }
            else{
                if ($scope.isSearchByAllCategory) {
                    $scope.getGroupMedicalKnowledgeList();
                } else {
                    if ($scope.isPersonKnowledgeEdit) {
                        $scope.getDoctorMedicalKnowledgeList();
                    } else {
                        if (!$scope.isEditBeforeWidthcategoryId) {
                            $scope.getGroupMedicalKnowledgeList();
                        } else {
                            $scope.getKnowledgeListByCategoryId($scope.isEditBeforeWidthcategoryId);
                        }
                    }
                }
            }

        })();


        //设置就医知识为置顶
        $scope.setTop = function(item) {

            $http.post(app.url.knowledge.setTop, {
                access_token: app.url.access_token,
                id: item.id || '',
                bizId: userId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "置顶成功");
                    $scope.getDoctorMedicalKnowledgeList();
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
                bizId: userId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "取消置顶成功");
                    $scope.getDoctorMedicalKnowledgeList();
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
                bizId: userId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "上移成功");
                    $scope.getDoctorMedicalKnowledgeList();
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });
        };
        $scope.pageChange = function() {
            if ($scope.whichType == 1) {
                $scope.getGroupMedicalKnowledgeList();
            } else if ($scope.whichType == 2) {
                $scope.getDoctorMedicalKnowledgeList()
            } else if ($scope.whichType == 3) {
                $scope.findKnowledgeListByKeys();
            } else if ($scope.whichType == 4) {
                console.log($scope.actItem.id);
                $scope.getKnowledgeListByCategoryId($scope.actItem);
            }
        }
        $scope.toEditDoctorKnowledge = function(item) {
            if ($scope.isPersonKnowledge) {
                $state.go('app.doctorKnowledge.edit', { id: item.id, categoryId: item.categoryId, isPersonKnowledge: true, isTop: item.isTop, isSearchByAllCategory: $scope.isSearchByAllCategory });
            } else {
                $state.go('app_doctorKnowledge_info', { id: item.id, categoryId: item.categoryId, isPersonKnowledge: false, isTop: item.isTop, isSearchByAllCategory: $scope.isSearchByAllCategory });
            }
            //          if ($scope.isPersonKnowledge) {
            //     $state.go('app.doctorKnowledge.edit', { id: item.id, categoryId: item.categoryId,isPersonKnowledge:true });
            // }else{
            //     $state.go('app.doctorKnowledge.edit', { id: item.id, categoryId: item.categoryId,isPersonKnowledge:false });
            // }

        }

    }
})();
(function(){
    app.controller('deleteGroupCategoryCtrl',funcdeleteGroupCategoryCtrl);
    funcdeleteGroupCategoryCtrl.$inject=['$scope', '$modalInstance', 'toaster', '$http', 'item'];
    function funcdeleteGroupCategoryCtrl($scope, $modalInstance, toaster, $http, item) {
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
    };

})();
(function(){
    app.controller('addGroupCategoryCtrl',funcaddGroupCategoryCtrl);
    //$scope.Category = Category;
    funcaddGroupCategoryCtrl.$inject=['$scope', '$modalInstance', 'toaster', '$http', 'item'];
    function funcaddGroupCategoryCtrl($scope, $modalInstance, toaster, $http, item) {
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
    };

})();
angular.module('app').controller('deletedoctorKlgContentCtrl', deletedoctorKlgContentCtrl);

// 手动注入依赖
deletedoctorKlgContentCtrl.$inject = ['$scope', '$modalInstance', 'data'];


function deletedoctorKlgContentCtrl($scope, $modalInstance, data) {

    $scope.doctor = data;
    console.log(data);
    $scope.ok = function() {
        $modalInstance.close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss(false);
    };
};
