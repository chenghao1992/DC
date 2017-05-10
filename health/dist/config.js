var app=angular.module("app").config(["$controllerProvider","$compileProvider","$filterProvider","$provide","$stateProvider",function($controllerProvider,$compileProvider,$filterProvider,$provide,$stateProvider){app.controller=$controllerProvider.register,app.directive=$compileProvider.directive,app.filter=$filterProvider.register,app.factory=$provide.factory,app.service=$provide.service,app.constant=$provide.constant,app.value=$provide.value,app.urlRoot=serverApiRoot,app.urlFile=uploadApiRoot,app.yiliao="/yiliao/",app.yiliao=serverApiRoot,app.yiyao=medicineApiRoot;app.url={access_token:localStorage.getItem("access_token"),groupId:function(){return localStorage.getItem("curGroupId")},getSMS:serverApiRoot+"sms/randcode/getSMSCode",verifySMS:serverApiRoot+"sms/randcode/verifyCode",login:serverApiRoot+"user/login",logout:serverApiRoot+"user/logout",sendRanCode:serverApiRoot+"user/sendRanCode",loginByCode:serverApiRoot+"user/loginByCode",preResetPassword:serverApiRoot+"user/preResetPassword",resetPassword:serverApiRoot+"user/resetPassword",common:{getGroupHospital:serverApiRoot+"guide/getGroupHospital",getServiceCate:serverApiRoot+"serviceCate/getByGId",setGroupHospital:serverApiRoot+"guide/setGroupHospital",findHospitalByCondition:serverApiRoot+"base/findHospitalByCondition"},admin:{check:{getDoctors:serverApiRoot+"admin/check/getDoctors",getDoctor:serverApiRoot+"admin/check/getDoctor",getArea:serverApiRoot+"admin/check/getArea",getHospitals:serverApiRoot+"admin/check/getHospitals",getDepts:serverApiRoot+"admin/check/getDepts",getTitles:serverApiRoot+"admin/check/getTitles",checked:serverApiRoot+"admin/check/checked",fail:serverApiRoot+"admin/check/fail"}},doctor:{getDoctor:serverApiRoot+"doctor/search",searchs:serverApiRoot+"doctor/searchs",getIntro:serverApiRoot+"doctor/getIntro",getWork:serverApiRoot+"doctor/getWork",getDoctorFile:serverApiRoot+"user/getDoctorFile",addDoctor:serverApiRoot+"recommend/addDoctor",setRecommend:serverApiRoot+"recommend/setRecommend",delDoctor:serverApiRoot+"recommend/delDoctor",getRecommendDocList:serverApiRoot+"recommend/getRecommendDocList",getRecommentDoc:serverApiRoot+"recommend/getRecommentDoc",upWeight:serverApiRoot+"recommend/upWeight",updateRecDocument:serverApiRoot+"document/updateRecDocument"},sms:{sendMsg:serverApiRoot+"sms/randcode/getSMSCode"},feedback:{query:serverApiRoot+"feedback/query",get:serverApiRoot+"feedback/get"},upload:{getCertPath:app.urlFile+"getCertPath",upLoadImg:app.urlFile+"cert",CommonUploadServlet:app.urlFile+"CommonUploadServlet",commonDelFile:app.urlFile+"commonDelFile"},signup:serverApiRoot+"user/register",yiliao:{companyLogin:app.yiliao+"company/user/companyLogin",enterprise_login:app.yiliao+"user/login",login:app.yiliao+"user/login",isAdminOfGroup:app.yiliao+"group/user/isAdminOfGroup",getAllData:app.yiliao+"department/getAllDataById",getDepartments:app.yiliao+"group/getDepartments",getGroupRegion:app.yiliao+"group/getGroupRegion",getServiceType:app.yiliao+"group/getServiceType",getDoctors:app.yiliao+"department/doctor/searchByDeDoctor",searchDoctor:app.yiliao+"group/doctor/searchByGroupDoctor",getUndistributed:app.yiliao+"group/doctor/getUndistributedDoctor",saveDoctor:app.yiliao+"department/doctor/saveDoctorIdBydepartIds",dimission:app.yiliao+"group/doctor/dimission",deleteDoctor:app.yiliao+"department/doctor/deleteByDeDoctor",saveByGroupDoctor:app.yiliao+"group/doctor/saveByGroupDoctor",updateDoctor:app.yiliao+"group/doctor/updateByGroupDoctor",confirmByDoctorApply:app.yiliao+"group/doctor/confirmByDoctorApply",saveByDepart:app.yiliao+"department/saveByDepart",updateByDepart:app.yiliao+"department/updateByDepart",deleteByDepart:app.yiliao+"department/deleteByDepart",fillInfo:app.yiliao+"company/regCompany",verifyEnterprise:serverApiRoot+"company/user/verifyByCuser",getDptSchedule:serverApiRoot+"group/schedule/getOnlines",getSchedule:serverApiRoot+"schedule/getOnlines",getCompany:serverApiRoot+"company/getCompanyById",hasCreateRole:serverApiRoot+"group/hasCreateRole",regGroup:serverApiRoot+"group/regGroup",groupApply:serverApiRoot+"group/groupApply",updateGroupApplyImageUrl:serverApiRoot+"group/updateGroupApplyImageUrl",applyTransfer:serverApiRoot+"group/applyTransfer",groupApplyInfo:serverApiRoot+"group/groupApplyInfo",updateGroupProfit:serverApiRoot+"group/updateGroupProfit",updateGroupConfigAndFee:serverApiRoot+"guide/updateGroupConfigAndFee",getGroupStatusInfo:serverApiRoot+"group/getGroupStatusInfo",getGroupList:serverApiRoot+"group/searchByGroup",getGroupInfo:serverApiRoot+"group/getGroupById",updateGroup:serverApiRoot+"group/updateByGroup",applyjoinCompany:serverApiRoot+"company/applyjoinCompany",verifyByGuser:serverApiRoot+"group/user/verifyByGuser",sendInviteCode:serverApiRoot+"invite/code/sendInviteCode",searchByCompanyUser:serverApiRoot+"company/user/searchByCompanyUser",deleteByCompanyUser:serverApiRoot+"company/user/deleteByCompanyUser",addCompanyUser:serverApiRoot+"company/user/addCompanyUser",getGroupAdmins:serverApiRoot+"group/user/searchByGroup",deleteGroupAdmin:serverApiRoot+"group/user/deleteByGroupUser",addGroupUser:serverApiRoot+"group/user/addGroupUser",getDepDocs:serverApiRoot+"department/doctor/searchByDeDoctor",deleteOnline:serverApiRoot+"group/schedule/deleteOnline",addOnline:serverApiRoot+"group/schedule/addOnline",getRelationShip:serverApiRoot+"group/doctor/getInviteRelationTree",getProfitTree:serverApiRoot+"group/profit/getTree",getProfitList:serverApiRoot+"group/profit/getList",getProfitListByKeyword:serverApiRoot+"group/profit/searchByKeyword",updateProfit:serverApiRoot+"group/profit/updateProfit",updateProfitRelation:serverApiRoot+"group/profit/update",deleteRelation:serverApiRoot+"group/profit/delete",getInviteList:serverApiRoot+"group/doctor/getMyInviteRelationListById",updateByCompany:serverApiRoot+"company/updateByCompany",inviteDoctor:serverApiRoot+"group/stat/inviteDoctor",getDepartmentDoctor:serverApiRoot+"department/doctor/getDepartmentDoctor",patient:serverApiRoot+"group/stat/patient",getMembers:serverApiRoot+"group/stat/patient/member",getTreatmentRecords:serverApiRoot+"group/stat/patient/cureRecord",doctorArea:serverApiRoot+"group/stat/doctorArea",doctorDisease:serverApiRoot+"group/stat/disease",getCharge:serverApiRoot+"group/fee/getGroupFee",setCharge:serverApiRoot+"group/fee/setting",getDocInviteNum:serverApiRoot+"group/stat/invitePatient",getDocInvitePatient:serverApiRoot+"group/stat/invitePatient",getDiseaseTree:serverApiRoot+"group/stat/getDiseaseTree",getUserDetail:serverApiRoot+"user/getUserDetail",findDoctorByGroup:serverApiRoot+"groupSearch/findDoctorByGroup",setResExpert:serverApiRoot+"group/settings/setResExpert",findOnlineDoctorByGroupId:serverApiRoot+"group/doctor/findOnlineDoctorByGroupId",getHasSetPrice:serverApiRoot+"group/doctor/getHasSetPrice",setTaskTimeLong:serverApiRoot+"group/doctor/setTaskTimeLong",setOutpatientPrice:serverApiRoot+"group/doctor/setOutpatientPrice",getDiseaseLabel:serverApiRoot+"groupSearch/findDiseaseByGroup",setDiseaseLabel:serverApiRoot+"group/settings/addSpecialty",saveBatchInvite:serverApiRoot+"group/doctor/saveBatchInvite",findProDoctorByGroupId:serverApiRoot+"groupSearch/findProDoctorByGroupId",searchDoctorByKeyWord:serverApiRoot+"group/doctor/searchDoctorByKeyWord",updateDutyTime:serverApiRoot+"group/settings/updateDutyTime",searchByKeyword:serverApiRoot+"group/profit/searchByKeyword",getDoctorInfoDetails:serverApiRoot+"doctor/getDoctorInfoDetails",submitCert:serverApiRoot+"group/cert/submitCert",getGroupCert:serverApiRoot+"group/cert/getGroupCert",getGroupCerts:serverApiRoot+"group/cert/getGroupCerts",getTypeByParent:serverApiRoot+"article/getTypeByParent",getGroupDoctorListById:serverApiRoot+"group/doctor/getGroupDoctorListById",statDoctor:serverApiRoot+"group/stat/statDoctor",addPatient:serverApiRoot+"doctor/addPatient",getPatients:serverApiRoot+"doctor/getPatients",addPatientTag:serverApiRoot+"doctor/addPatientTag",deletePatientTag:serverApiRoot+"/doctor/deletePatientTag",createDocument:serverApiRoot+"/document/createDocument",getGroupDescInfoById:serverApiRoot+"document/getGoupDescInfoById",getDepartmentRecommendDoctor:serverApiRoot+"department/doctor/getDepartmentRecommendDoctor"},document:{getAllData:app.yiliao+"department/getAllDataById",getDepartmentDoctor:serverApiRoot+"department/doctor/getDepartmentDoctor",getDiseaseTree:serverApiRoot+"base/getDiseaseTree",topArticleUp:serverApiRoot+"article/topArticleUp",topArticleRemove:serverApiRoot+"article/topArticleRemove",findTopArticle:serverApiRoot+"article/findTopArticle",collectArticle:serverApiRoot+"article/collectArticle",topArticle:serverApiRoot+"article/topArticle",addArticle:serverApiRoot+"article/addArticle",findDiseaseTreeForArticle:serverApiRoot+"article/findDiseaseTreeForArticle",findArticleByKeyWord:serverApiRoot+"article/findArticleByKeyWord",getArticleByDisease:serverApiRoot+"article/getArticleByDisease",getDisease:serverApiRoot+"base/getDisease",getArticleById:serverApiRoot+"article/getArticleById",updateArticle:serverApiRoot+"article/updateArticle",findArticleByTag:serverApiRoot+"article/findArticleByTag",collectArticleRemove:serverApiRoot+"article/collectArticleRemove",delArticle:serverApiRoot+"article/delArticle",getArticleByIdWeb:serverApiRoot+"article/getArticleByIdWeb",getArticleByDoctor:serverApiRoot+"article/getArticleByDoctor",viewArticle:serverApiRoot+"article/viewArticle"},knowledge:{getDoctorMedicalKnowledgeList:serverApiRoot+"knowledge/getDoctorMedicalKnowledgeList",getGroupMedicalKnowledgeList:serverApiRoot+"knowledge/getGroupMedicalKnowledgeList",getUrlById:serverApiRoot+"knowledge/getUrlById",updateKnowledge:serverApiRoot+"knowledge/updateKnowledge",getDetailById:serverApiRoot+"knowledge/getDetailById",setTop:serverApiRoot+"knowledge/setTop",cancelTop:serverApiRoot+"knowledge/cancelTop",upKnowledge:serverApiRoot+"knowledge/upKnowledge",addKnowledge:serverApiRoot+"knowledge/addKnowledge",delKnowledgeById:serverApiRoot+"knowledge/delKnowledgeById",addGroupCategory:serverApiRoot+"knowledge/addGroupCategory",delCategoryById:serverApiRoot+"knowledge/delCategoryById",updateCategoryById:serverApiRoot+"knowledge/updateCategoryById",getCategoryList:serverApiRoot+"knowledge/getCategoryList",getKnowledgeListByCategoryId:serverApiRoot+"knowledge/getKnowledgeListByCategoryId",findKnowledgeListByKeys:serverApiRoot+"knowledge/findKnowledgeListByKeys"},dynamic:{deleteDoctorDynamic:serverApiRoot+"dynamic/deleteDoctorDynamic",addDoctorDynamicForWeb:serverApiRoot+"dynamic/addDoctorDynamicForWeb",addDoctorDynamic:serverApiRoot+"dynamic/addDoctorDynamic",addGroupDynamicForWeb:serverApiRoot+"dynamic/addGroupDynamicForWeb",getDoctorDynamicList:serverApiRoot+"dynamic/getDoctorDynamicList",getPatientRelatedDynamicList:serverApiRoot+"dynamic/getPatientRelatedDynamicList",getGroupAndDoctorDynamicListByGroupId:serverApiRoot+"dynamic/getGroupAndDoctorDynamicListByGroupId",getDynamicListByGroupIdForWeb:serverApiRoot+"dynamic/getDynamicListByGroupIdForWeb"},designer:{getDiseaseTypeFromStore:serverApiRoot+"designer/getDiseaseTypeFromStore",getQuestionListFromStore:serverApiRoot+"designer/getQuestionListFromStore"},pubMsg:{getPubListByMid:serverApiRoot+"pub/getByMid",sendMsg:serverApiRoot+"pub/sendMsg",getPubInfo:serverApiRoot+"pub/get",savePubInfo:serverApiRoot+"pub/save",getMsgHistory:serverApiRoot+"pub/msgList",delMsgHistory:serverApiRoot+"pub/delMsg",getMsgPageList:serverApiRoot+"pub/msgPageList"},care:{addFollowUpTemplate:app.yiliao+"pack/followReForm/addFollowUpTemplate",findFollowUpTemplate:app.yiliao+"pack/followReForm/findFollowUpTemplate",deleteFollowUpTemplate:app.yiliao+"pack/followReForm/deleteFollowUpTemplate",getDiseaseTypeTree:serverApiRoot+"group/stat/getDiseaseTypeTree"},yiyao:{c_Group_Goods_select:"/c_Group_Goods.select",c_Group_Goods_create:"/c_Group_Goods.create",c_Group_Goods_creates:"/c_Group_Goods.creates",c_Group_Goods_delete:"/c_Group_Goods.delete"},consult:{addPack:serverApiRoot+"consultation/pack/add",getPackList:serverApiRoot+"consultation/pack/getList",getPackDetail:serverApiRoot+"consultation/pack/getDetail",updatePack:serverApiRoot+"consultation/pack/update",openService:serverApiRoot+"consultation/pack/openService",delPack:serverApiRoot+"consultation/pack/delete",getNotInCurrentPackDoctorIds:serverApiRoot+"consultation/pack/getNotInCurrentPackDoctorIds",getOpenConsultation:serverApiRoot+"consultation/pack/getOpenConsultation"},finance:{gdIncomeList:serverApiRoot+"income/gdIncomeList",gIncomeList:serverApiRoot+"income/gIncomeList",gIncomeListNew:serverApiRoot+"income/gIncomeListNew",setBankDefault:serverApiRoot+"income/setBankDeault",gIncomeDetail:serverApiRoot+"income/gIncomeDetail",gMIncomeDetail:serverApiRoot+"income/gMIncomeDetail",getGroupBanks:serverApiRoot+"pack/bank/getGroupBanks",addGroupBankCard:serverApiRoot+"pack/bank/addGroupBankCard",setBankStatus:serverApiRoot+"pack/bank/setBankStatus",getBanks:serverApiRoot+"pack/bank/getBanks",deleteBankCard:serverApiRoot+"pack/bank/deleteBankCard",downExcel:serverApiRoot+"income/downExcel"},order:{setAppointmentInfo:serverApiRoot+"guide/setAppointmentInfo",getAppointmentInfo:serverApiRoot+"/guide/getAppointmentInfo",getOrderList:serverApiRoot+"pack/order/getOrderList",downOrderList:serverApiRoot+"pack/order/downOrderList"},hospital:{getHospitalLevel:serverApiRoot+"admin/check/getHospitalLevel",getHospitalList:serverApiRoot+"group/hospital/groupHospitalList",findHospitalByCondition:serverApiRoot+"base/findHospitalByCondition",createGroupHospital:serverApiRoot+"group/hospital/createGroupHospital",findDoctorsByCondition:serverApiRoot+"doctor/findDoctorsByCondition",getDetailByGroupId:serverApiRoot+"group/hospital/getDetailByGroupId",updateHospitalRoot:serverApiRoot+"group/hospital/updateHospitalRoot",registerByAdmin:serverApiRoot+"user/registerByAdmin",saveBatchInvite:serverApiRoot+"group/doctor/saveBatchInvite",registerByGroupNotify:serverApiRoot+"user/registerByGroupNotify"},account:{getGuideDoctorList:serverApiRoot+"user/getGuideDoctorList",register:serverApiRoot+"user/register",resetPassword:serverApiRoot+"user/oneKeyReset",updateUserInfo:serverApiRoot+"user/updateGuidInfo",updateStatus:serverApiRoot+"user/updateGuideStatus",updatePassword:serverApiRoot+"user/updatePassword"},drugLibrary:{addDoctorGroupDrugLibGoods:drugFirmsApiRoot+"goods/doctorGroup/addDoctorGroupDrugLibGoods",searchDoctorGroupDrugLibList:drugFirmsApiRoot+"goods/doctorGroup/searchDoctorGroupDrugLibList",deleteDoctorGroupDrugById:drugFirmsApiRoot+"goods/doctorGroup/deleteDoctorGroupDrugById"},community:{findPcTopicList:serverApiRoot+"community/findPcTopicList",findTopicKeyWord:serverApiRoot+"community/findTopicKeyWord",publish:serverApiRoot+"community/publish",getByGroupCircle:serverApiRoot+"community/getByGroupCircle",deleteTopic:serverApiRoot+"community/deleteTopic",findByTopicDetail:serverApiRoot+"community/findByTopicDetail",findByReplyList:serverApiRoot+"community/findByReplyList",deleteReplyId:serverApiRoot+"community/deleteReplyId",deleteTopic:serverApiRoot+"community/deleteTopic",addCircle:serverApiRoot+"community/addCircle",deleteCircle:serverApiRoot+"community/deleteCircle",topCircle:serverApiRoot+"community/topCircle",updateCircle:serverApiRoot+"community/updateCircle",getPubListTopic:serverApiRoot+"community/getPubListTopic",topTopic:serverApiRoot+"community/topTopic",undoTopTopic:serverApiRoot+"community/undoTopTopic",moveTopic:serverApiRoot+"community/moveTopic"}},app.lang={datatables:{translation:{sLengthMenu:"每页 _MENU_ 条",sZeroRecords:"无数据",sProcessing:"<img style='position:fixed;top:30%;left:50%;z-index:10000;height:80px;border:1px solid #aaa;border-radius:6px;box-shadow:0 0 10px rgba(0,0,0,.5)' src=\"src/img/loading.gif\" />",sInfo:"当前第 _START_ - _END_ 条，共 _TOTAL_ 条",sInfoEmpty:"",sInfoFiltered:"(从 _MAX_ 条记录中过滤)",sSearch:"搜索",oPaginate:{sFirst:"<<",sPrevious:"<",sNext:">",sLast:">>"}}}}}]).config(["$translateProvider",function($translateProvider){$translateProvider.useStaticFilesLoader({prefix:"src/l10n/",suffix:".js"}),$translateProvider.preferredLanguage("en"),$translateProvider.useLocalStorage()}]).factory("authorityInterceptor",[function(){var authorityInterceptor={response:function(response){return 1030102!==response.resultCode&&1030101!==response.resultCode&&1030102!==response.data.resultCode&&1030101!==response.data.resultCode||(window.location.href="#/access/signin"),"no permission"==response.data&&app.controller("Interceptor",["$state",function($state){app.state.go("access.404")}]),"no login"==response.data&&app.state.go("access.signin"),response}};return authorityInterceptor}]).config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push("authorityInterceptor"),$httpProvider.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8",$httpProvider.defaults.transformRequest=[function(data){return angular.isObject(data)&&"[object File]"!==String(data)?$.param(data,!0):data}]}]);!function(){angular.module("app").directive("ngEnter",function(){return function(scope,element,attrs){element.bind("keydown keypress",function(event){13===event.which&&(scope.$apply(function(){scope.$eval(attrs.ngEnter)}),event.preventDefault())})}})}(),function(){function funAppFactory($http,$state,toaster,Group){function _ajaxDeal(response){return response&&200==response.status?response.data:(toaster.pop("error",null,status),status)}function _ajaxDealHealth(response){return response=_ajaxDeal(response),response?1!=response.resultCode?(response.resultMsg?toaster.pop("error",null,response.resultMsg):toaster.pop("error",null,"接口出错"),!1):response.data||!0:response}function isServiceGroup(groupId){return $http.post(app.url.common.getServiceCate,{access_token:app.url.access_token,groupId:groupId}).then(function(_data){return _data=_ajaxDealHealth(_data),"5721afe7f95c43d41203d233"==_data.id})}Group.getCurrentOrgInfo();return{ajax:{deal:_ajaxDeal,dealHealth:_ajaxDealHealth},group:{isServiceGroup:isServiceGroup}}}angular.module("app").factory("AppFactory",funAppFactory),funAppFactory.$inject=["$http","$state","toaster","Group"]}();