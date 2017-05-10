"use strict";app.controller("enterpriseSigninFormController",["$scope","$http","$state","$cookieStore","utils","$rootScope",function($scope,$http,$state,$cookieStore,utils,$rootScope){var width_pswd,width_code,_remember,smsid="",_isRemembered=utils.localData("enterprise_remember"),_telephone=utils.localData("enterprise_telephone"),_password=utils.localData("enterprise_password");!function(){setTimeout(function(){width_pswd=$("#login_with_pswd"),width_code=$("#login_with_code"),_remember=$("#rememberInfo"),_isRemembered&&(_remember.attr("checked",!0),_isRemembered&&_telephone&&_password&&($scope.enterprise.telephone=_telephone,$scope.enterprise.password=_password,$scope.$apply($scope.enterprise)))},200)}(),$scope.login_with_pswd=!0,$scope.withPSWD=function(){$scope.login_with_pswd=!0,width_pswd.addClass("animating fade-in-right")},$scope.withCODE=function(){$scope.login_with_pswd=!1,width_code.addClass("animating fade-in-right")},$scope.getCode=function(){if(!$scope.user.telephone)return void modal.toast.warn("请填写手机号码！");var timer=0,num=119,btn=$("#login_with_code .get-code"),disabled=document.createAttribute("disabled");btn[0].setAttributeNode(disabled),btn.html('再次获取 (<span id="code_timer" class="text-warning">'+num+"</span>)");var codeTimer=$("#code_timer");timer=setInterval(function(){0===num?(clearInterval(timer),btn[0].removeAttribute("disabled"),btn.html("再次获取"),utils.localData("smsid",null)):num<=100?codeTimer.html("0"+--num):num<=10?codeTimer.html("00"+--num):codeTimer.html(--num)},1e3),$http({url:app.url.sendRanCode,method:"post",data:{phone:$scope.user.telephone,userType:3}}).then(function(response){1===response.data.resultCode?(smsid=response.data.data.smsid,utils.localData("smsid",smsid)):$scope.authError=response.data.resultMsg},function(x){$scope.authError="服务器错误"})},$scope.enterprise={},$scope.authError=null,$scope.login=function(){$scope.authError=null,$http({url:app.url.yiliao.companyLogin,method:"post",data:{telephone:$scope.enterprise.telephone,password:$scope.enterprise.password}}).then(function(response){if(1===response.data.resultCode){$rootScope.curDepartmentId=null,utils.localData("groupPicFile",null),utils.localData("headPicFile",null),utils.localData("curGroupName",null),utils.localData("curGroupId",null),utils.localData("curGroupEnterpriseName",null),utils.localData("groupPicFile",null),$scope.datas.user_headPicFile=null,$scope.datas.groupPicFile=null,$rootScope.rootGroup.name=null,$rootScope.rootGroup.enterpriseName=null,$rootScope.rootEnterprise=null,$rootScope.enterprise_userName=null,$rootScope.isCompany=!0,utils.localData("isCompany","true"),$rootScope.logFromCompany=!0,utils.localData("logFromCompany","true");var _name=response.data.data.user.user.name||" ",_type=$scope.userType["type_"+response.data.data.user.user.userType];console.log(response.data.data.user.user.name);var _id=response.data.data.user.userId;return $scope.datas.user_name=null,utils.localData("user_name",null),$scope.datas.user_type=_type,utils.localData("enterprise_userName",_name),utils.localData("enterprise_type",_type),utils.localData("enterprise_id",_id),_remember.prop("checked")?(utils.localData("enterprise_remember",!0),utils.localData("enterprise_telephone",$scope.enterprise.telephone),utils.localData("enterprise_password",$scope.enterprise.password)):(utils.localData("enterprise_remember",null),utils.localData("enterprise_telephone",null),utils.localData("enterprise_password",null)),app.url.access_token=response.data.data.user.access_token,utils.localData("access_token",app.url.access_token),1==response.data.data.status?(utils.localData("company",null),$state.go("access.Fill_Info")):(utils.localData("company",JSON.stringify(response.data.data.company)),"P"===response.data.data.company.status?$state.go("app.group_manage"):"A"===response.data.data.company.status?$state.go("access.enterprise_verify",{},{reload:!0}):"B"===response.data.data.company.status?$state.go("access.enterprise_verify",{},{reload:!0}):"O"===response.data.data.company.status?$scope.authError="账户已冻结！":"S"===response.data.data.company.status?$scope.authError="账户已停用！":(utils.localData("enterprise_name",null),utils.localData("enterprise_type",null),utils.localData("enterprise_id",null),$scope.authError=data.resultMsg))}$scope.authError="用户名或密码错误",utils.localData("enterprise_name",null),utils.localData("enterprise_type",null),utils.localData("enterprise_id",null)},function(x){$scope.authError="服务器错误",utils.localData("enterprise_name",null),utils.localData("enterprise_type",null),utils.localData("enterprise_id",null)})}}]);