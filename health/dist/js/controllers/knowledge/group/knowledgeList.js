"use strict";function deleteKnowledgeContentCtrl($scope,$modalInstance,data){$scope.doctor=data,console.log(data),$scope.ok=function(){$modalInstance.close(!0)},$scope.cancel=function(){$modalInstance.dismiss(!1)}}!function(){function funGroupKnowledgeListCtrl($scope,$http,$state,$modal,toaster,$stateParams){var curGroupId=localStorage.getItem("curGroupId");$scope.pageSize=10,$scope.pageIndex=1,$scope.searchTypeIndex=1,$scope.isEditBeforeWidthcategoryId=$stateParams.isEditBeforeWidthcategoryId,$scope.isSearchByAllCategory="true"==$stateParams.isSearchByAllCategory,$scope.isEditBeforeWidthcategoryId?$scope.carActiveId=$scope.isEditBeforeWidthcategoryId:$scope.carActiveId="allCarg",$scope.getCategoryList=function(){$http.post(app.url.knowledge.getCategoryList,{access_token:app.url.access_token,groupId:curGroupId}).success(function(data){1==data.resultCode&&($scope.categoryList=data.data)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})},$scope.findAllKnowledge=function(){$scope.isSearchByAllCategory=!0,$scope.getGroupMedicalKnowledgeList()},$scope.getCategoryList(),$scope.toDetails=function(item){$state.go("app_groupKnowledge_info",{id:item.id,categoryId:item.categoryId,isTop:item.isTop,isSearchByAllCategory:$scope.isSearchByAllCategory})},$scope.deleteKnowledge=function(item){var modalInstance=$modal.open({templateUrl:"deleteKnowledgeContent.html",controller:"deleteKnowledgeContentCtrl",size:"md",resolve:{data:function(){return item}}});modalInstance.result.then(function(result){result&&$http.post(app.url.knowledge.delKnowledgeById,{access_token:app.url.access_token,id:item.id,groupId:curGroupId}).success(function(data){1==data.resultCode?(toaster.pop("success",null,"删除就医知识成功"),$scope.getGroupMedicalKnowledgeList()):toaster.pop("error",null,data.resultMsg)}).error(function(data){})})},$scope.addGroupCategory=function(item){var modalInstance=$modal.open({templateUrl:"addGroupCategory.html",controller:"addGroupCategoryCtrl",windowClass:"docPreModal",resolve:{item:function(){return item}}});modalInstance.result.then(function(){$scope.getCategoryList()},function(){})},$scope.deleteGroupCategory=function(item){var modalInstance=$modal.open({templateUrl:"deleteGroupCategory.html",controller:"deleteGroupCategoryCtrl",windowClass:"docPreModal",resolve:{item:function(){return item}}});modalInstance.result.then(function(){$scope.getCategoryList()},function(){})},$scope.getGroupMedicalKnowledgeList=function(){$scope.carActiveId="allCarg",$scope.isSearchByAllCategory=!0,$http.post(app.url.knowledge.getGroupMedicalKnowledgeList,{access_token:app.url.access_token,groupId:curGroupId,pageIndex:$scope.pageIndex-1||0,pageSize:$scope.pageSize||10}).success(function(data){if(1==data.resultCode){if($scope.konwledgeList=data.data.pageData,$scope.pageTotal=data.data.total,$scope.searchTypeIndex=1,0==data.data.total)return}else toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})},$scope.pageChanged=function(){1==$scope.searchTypeIndex?$scope.getGroupMedicalKnowledgeList():2==$scope.searchTypeIndex?$scope.findKnowledgeListByKeys():3==$scope.searchTypeIndex&&$scope.getKnowledgeListByCategoryId($scope.itemThis)},$scope.findKnowledgeListByKeys=function(){return $scope.keyword?void $http.post(app.url.knowledge.findKnowledgeListByKeys,{access_token:app.url.access_token,keywords:$scope.keyword||"",groupId:curGroupId,pageIndex:$scope.pageIndex-1||0,pageSize:$scope.pageSize||10}).success(function(data){1==data.resultCode?(0==data.data.total,$scope.konwledgeList=data.data.pageData,$scope.pageTotal=data.data.total,$scope.searchTypeIndex=2):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")}):void toaster.pop("info",null,"请输入搜索关键字")},$scope.getKnowledgeListByCategoryId=function(item){$scope.isSearchByAllCategory=!1;var thisCagId="";$scope.isEditBeforeWidthcategoryId?(thisCagId=item,$scope.isEditBeforeWidthcategoryId=null,$scope.carActiveId=item):($scope.itemThis=item,thisCagId=$scope.itemThis.id,$scope.carActiveId=$scope.itemThis.id),$http.post(app.url.knowledge.getKnowledgeListByCategoryId,{access_token:app.url.access_token,categoryId:thisCagId||"",pageIndex:$scope.pageIndex-1||0,pageSize:$scope.pageSize||10}).success(function(data){1==data.resultCode?(0==data.data.total,$scope.konwledgeList=data.data.pageData,$scope.pageTotal=data.data.total,$scope.searchTypeIndex=3):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})},function(){if($scope.isSearchByAllCategory)$scope.getGroupMedicalKnowledgeList(),$scope.isEditBeforeWidthcategoryId=null;else if($scope.isEditBeforeWidthcategoryId){console.log($scope.isEditBeforeWidthcategoryId);var tId=$scope.isEditBeforeWidthcategoryId;$scope.getKnowledgeListByCategoryId(tId)}else $scope.getGroupMedicalKnowledgeList()}(),$scope.setTop=function(item){$http.post(app.url.knowledge.setTop,{access_token:app.url.access_token,id:item.id||"",bizId:curGroupId}).success(function(data){1==data.resultCode?(toaster.pop("success",null,"置顶成功"),$scope.getGroupMedicalKnowledgeList()):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})},$scope.cancelTop=function(item){$http.post(app.url.knowledge.cancelTop,{access_token:app.url.access_token,id:item.id||"",bizId:curGroupId}).success(function(data){1==data.resultCode?(toaster.pop("success",null,"取消置顶成功"),$scope.getGroupMedicalKnowledgeList()):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})},$scope.upKnowledge=function(item){$http.post(app.url.knowledge.upKnowledge,{access_token:app.url.access_token,id:item.id||"",bizId:curGroupId}).success(function(data){1==data.resultCode?(toaster.pop("success",null,"上移成功"),$scope.getGroupMedicalKnowledgeList()):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,"服务器通讯出错")})}}angular.module("app").controller("groupKnowledgeListCtrl",funGroupKnowledgeListCtrl),funGroupKnowledgeListCtrl.$inject=["$scope","$http","$state","$modal","toaster","$stateParams"]}(),app.controller("deleteGroupCategoryCtrl",function($scope,$modalInstance,toaster,$http,item){$scope.item=item,$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope["delete"]=function(){localStorage.getItem("curGroupId");$http.post(app.url.knowledge.delCategoryById,{access_token:app.url.access_token,id:item.id}).success(function(data){1==data.resultCode?(toaster.pop("success",null,"分类删除成功"),$modalInstance.close("cancel")):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,data.resultMsg)})}}),app.controller("addGroupCategoryCtrl",function($scope,$modalInstance,toaster,$http,item){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.item=item,$scope.category=item.name;var editType={},message="";$scope.add=function(){var curGroupId=localStorage.getItem("curGroupId");return $scope.category?void(item?(editType=app.url.knowledge.updateCategoryById,message="分类更新成功",$http.post(editType,{access_token:app.url.access_token,groupId:curGroupId,name:$scope.category,id:item.id||""}).success(function(data){1==data.resultCode?(toaster.pop("success",null,message),$modalInstance.close("cancel")):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,data.resultMsg)})):(editType=app.url.knowledge.addGroupCategory,message="分类添加成功",$http.post(editType,{access_token:app.url.access_token,groupId:curGroupId,name:$scope.category}).success(function(data){1==data.resultCode?(toaster.pop("success",null,message),$modalInstance.close("cancel")):toaster.pop("error",null,data.resultMsg)}).error(function(data){toaster.pop("error",null,data.resultMsg)}))):void toaster.pop("info",null,"请先输入分类名！")}}),angular.module("app").controller("deleteKnowledgeContentCtrl",deleteKnowledgeContentCtrl),deleteKnowledgeContentCtrl.$inject=["$scope","$modalInstance","data"];