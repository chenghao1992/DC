"use strict";app.controller("GroupManageCtrl",["$rootScope","$scope","$http","$location","$state","utils","modal",function($rootScope,$scope,$http,$location,$state,utils,modal){$rootScope.isCompany=!0,utils.localData("isCompany","true"),$rootScope.curGroupId=null,$rootScope.rootEnterprise=JSON.parse(localStorage.getItem("company")),null==localStorage.getItem("enterprise_userName")?$rootScope.enterprise_userName=localStorage.getItem("enterprise_telephone"):$rootScope.enterprise_userName=localStorage.getItem("enterprise_userName"),$scope.access_token=localStorage.getItem("access_token"),$scope.company=JSON.parse(localStorage.getItem("company")),$scope.curGroupEnterpriseName=$scope.company.name,$scope.companyName=null,$scope.groupList=null,$http.post(app.url.yiliao.getGroupList,{access_token:$scope.access_token,companyId:$scope.company.id,pageIndex:0,pageSize:200}).success(function(data,status,headers,config){for(var groupList=data.data.pageData,i=0;i<groupList.length;i++)!function(i){var imgUrl=app.url.upload.getCertPath+"?access_token="+$scope.access_token+"&userId="+groupList[i].creator+"&certType="+groupList[i].id;$http.get(imgUrl).success(function(data,status,headers,config){if(1==data.resultCode&&(console.log(data),data.data.length>0))for(var j=0;j<data.data.length;j++)data.data[j].indexOf(groupList[i].id.toString()+"/groupLogo")>-1&&(groupList[i].groupLogoUrl=data.data[j])}).error(function(data,status,headers,config){console.log(data)})}(i);$scope.groupList=groupList,console.log($scope.groupList)}).error(function(data,status,headers,config){console.log(data)}),$scope.linkToInvite=function(){$location.url($location.url()+"/enterprise_setting")},$scope.linkToManageGroup=function(id,name,creator){localStorage.setItem("curGroupEnterpriseName",$scope.curGroupEnterpriseName),localStorage.setItem("curGroupId",id),localStorage.setItem("curGroupName",name),$rootScope.rootGroup.name=name,$rootScope.rootGroup.enterpriseName=$scope.curGroupEnterpriseName,creator&&(localStorage.setItem("group_creator",creator),$scope.datas.user_id=creator,utils.localData("headPicFile",null),$scope.datas.user_headPicFile=null),utils.localData("groupPicFile",null),$scope.datas.groupPicFile=null,id&&$http({url:app.url.yiliao.getGroupCert,method:"post",data:{access_token:app.url.access_token,groupId:id}}).then(function(resp){if(1===resp.data.resultCode){var dt=resp.data.data;$rootScope.user.isInGroup=!0,$rootScope.user.isAdmin=!0,utils.localData("isInGroup","true"),utils.localData("isAdmin","true"),dt.groupCert?dt.group&&dt.group.certStatus&&($rootScope.group.certStatus=dt.group.certStatus,utils.localData("certStatus",dt.group.certStatus)):($rootScope.group.isIdentified=!1,utils.localData("isIdentified",!1),$rootScope.group.certStatus="NC",utils.localData("certStatus","NC")),$rootScope.isCompany=!1,utils.localData("isCompany","false"),$state.go("app.contacts",{},{reload:!0})}else modal.toast.warn(resp.data.resultMsg)},function(resp){modal.toast.warn(resp.data.resultMsg)})},$scope.createGroup=function(){localStorage.removeItem("curGroupId"),localStorage.removeItem("curGroupName"),$state.go("app.groupSettings")}}]);