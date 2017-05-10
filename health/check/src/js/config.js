
// (function(){
//     var app=angular.module('app').config(funone).config(funtwo).factory('authorityInterceptor', [function() {
//         var authorityInterceptor = {
//             response: function(response) {
//                 if ('no permission' == response.data) {
//                     app.controller('Interceptor', ['$state',
//                         function($state) {
//                             app.state.go('access.404');
//                         }
//                     ]);
//                 }
//                 if ("1030102" == response.data.resultCode || "1030101" == response.data.resultCode) {
//                     app.state.go('access.signin');
//                 }
//                 return response;
//             }
//         };
//         return authorityInterceptor;
//     }]).config(funthere);
//     funone.$inject=['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider'];
//     function funone($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {
//         // lazy controller, directive and service
//         app.controller = $controllerProvider.register;
//         app.directive = $compileProvider.directive;
//         app.filter = $filterProvider.register;
//         app.factory = $provide.factory;
//         app.service = $provide.service;
//         app.constant = $provide.constant;
//         app.value = $provide.value;
//
//         // API路径集合
//         app.urlRoot = serverApiRoot;
//         //app.urlFile = '/upload/';
//         app.yiliao = '/yiliao/';
//         app.yiliao = serverApiRoot;
//         app.urlFile = uploadApiRoot;
//         app.medicine = medicineApiRoot;
//
//         var common = {
//             list: 'list.iv',
//             save: 'save.iv',
//             edit: 'edit.iv',
//             modify: 'modify.iv',
//             delete: 'batchDelete.iv',
//             find: 'findByIds.iv',
//             view: 'view.iv'
//         };
//
//         function getApi(name, common) {
//             var apis = {};
//             for (var n in common) {
//                 apis[n] = serverApiRoot + name + '/' + common[n];
//             }
//             return apis;
//         }
//
//         app.url = {
//             access_token: localStorage.getItem('check_access_token'),
//             groupId: function() {
//                 return '666666666666666666666666';
//             },
//
//             login: serverApiRoot + 'user/login',
//             logout: serverApiRoot + 'user/logout',
//             admin: {
//                 check: {
//                     getDoctors: serverApiRoot + 'admin/check/getDoctors',
//                     getMembers: serverApiRoot + 'group/doctor/getMembers', // 获取集团下的医生成员
//                     removeDoctors: serverApiRoot + 'group/doctor/removeDoctors', //移出集团下的医生
//                     getDoctorsByKeywork : serverApiRoot + 'admin/check/getDoctorsByKeywork',  //获取医生根据关键字
//                     inviterJoinGroup :serverApiRoot + 'user/inviterJoinGroup',  //平台批量加入医生
//                     checkUserData :serverApiRoot + 'user/checkUserData',     //检查数据
//                     handleFormUpload :serverApiRoot + ' user/handleFormUpload',  //导入文件
//                     getDoctor: serverApiRoot + 'admin/check/getDoctor',
//                     searchByCompany: serverApiRoot + 'company/searchByCompany',
//                     getCompanyById: serverApiRoot + 'company/getCompanyById',
//                     updateByCompany: serverApiRoot + 'company/updateByCompany',
//                     getArea: serverApiRoot + 'admin/check/getArea',
//                     getHospitals: serverApiRoot + 'admin/check/getHospitals',
//                     getDepts: serverApiRoot + 'admin/check/getDepts',
//                     getTitles: serverApiRoot + 'admin/check/getTitles',
//                     checked: serverApiRoot + 'admin/check/checked',
//                     edit: serverApiRoot + 'admin/check/edit',
//                     uncheck: serverApiRoot + 'admin/check/uncheck',
//                     fail: serverApiRoot + 'admin/check/fail',
//                     updateCheckInfo: serverApiRoot + 'doctor/updateCheckInfo',
//                     findDoctorByAuthStatus: serverApiRoot + 'admin/check/findDoctorByAuthStatus',
//                     addHospital: serverApiRoot + 'admin/check/addHospital',
//                     getGroupCert: serverApiRoot + 'group/cert/getGroupCert',
//                     getGroupCerts: serverApiRoot + 'group/cert/getGroupCerts',
//                     getOtherGroupCerts: serverApiRoot + 'group/cert/getOtherGroupCerts',
//                     passCert: serverApiRoot + 'group/cert/passCert',
//                     noPass: serverApiRoot + 'group/cert/noPass',
//                     updateRemarks: serverApiRoot + 'group/cert/updateRemarks',
//                     groupApplyList: serverApiRoot + 'group/applyList',
//                     processGroupApply: serverApiRoot + 'group/processGroupApply',
//                     applyDetail: serverApiRoot + 'group/applyDetail',
//                     activeGroup: serverApiRoot + 'group/activeGroup', // 激活集团
//                     blockGroup: serverApiRoot + 'group/blockGroup', // 屏蔽集团
//                     unBlockGroup: serverApiRoot + 'group/unBlockGroup', // 取消屏蔽集团
//                     generateQRImage:serverApiRoot + 'qr/generateQRImage',
//                 }
//             },
//             feedback: {
//                 query: serverApiRoot + 'feedback/query',
//                 get: serverApiRoot + 'feedback/get',
//                 polling: imRoot + 'msg/poll.action',
//                 groupList: imRoot + 'msg/groupList.action',
//                 msgList: imRoot + 'msg/msgList.action'
//             },
//             user: {
//                 addDoctorCheckImage: serverApiRoot + 'user/addDoctorCheckImage',
//                 getDoctorFile: serverApiRoot + 'user/getDoctorFile',
//                 getInfo: serverApiRoot + 'user/get',
//                 registerByAdmin: serverApiRoot + 'user/registerByAdmin', // 管理员创建医生账号
//                 changeTel: serverApiRoot + 'user/updateTel', // 修改手机号码
//                 getOperationRecord: serverApiRoot + 'user/getOperationRecord' // 获取操作记录
//             },
//             upload: {
//                 getCertPath: app.urlFile + 'getCertPath',
//                 upLoadImg: app.urlFile + 'cert',
//                 CommonUploadServlet: app.urlFile + 'CommonUploadServlet',
//                 commonDelFile: app.urlFile + 'commonDelFile'
//             },
//             order: {
//                 //findOrder: serverApiRoot + 'pack/order/findOrders',
//                 findOrder: serverApiRoot + 'pack/order/getPaidOrders',
//                 getRefundOrders: serverApiRoot + 'pack/order/getRefundOrders',
//                 getRefundDetail: serverApiRoot + 'pack/order/getRefundDetail',
//                 refund: serverApiRoot + 'pack/order/refund',
//                 cancelPaidOrder: serverApiRoot + 'pack/order/cancelPaidOrder',
//                 updateRefundByOrder: serverApiRoot + 'pack/order/updateRefundByOrder',
//                 callByOrder: serverApiRoot + 'voip/callByOrder',
//                 queryOrderByConditions:serverApiRoot+'pack/order/queryOrderByConditions',
//                 getOrderDetail: serverApiRoot + 'pack/order/orderDetail',
//                 getIllCaseByOrderId: serverApiRoot + 'illcase/getIllCaseByOrderId',
//                 cancelOrderByAdmin: serverApiRoot + 'pack/order/cancelOrderByAdmin'
//
//             },
//             //集团管理
//             group:{
//                 //获取所有集团列表
//                 findAllGroup:serverApiRoot + 'groupSearch/findAllGroup',
//                 //获取集团*
//                 getGroupRecommendedList:serverApiRoot +  '/group/getGroupRecommendedList',
//                 //移除集团*
//                 removeGroupRecommended:serverApiRoot + 'group/removeGroupRecommended',
//                 //查找集团*
//                 searchGroupByName:serverApiRoot +  'group/searchGroupByName',
//                 //上移集团*
//                 riseRecommendedOfGroup:serverApiRoot + 'group/riseRecommendedOfGroup',
//                 //设置集团*
//                 setGroupToRecommended:serverApiRoot + 'group/setGroupToRecommended',
//                 //病种树*
//                 getDiseaseTree:serverApiRoot + 'base/getDiseaseTree',
//                 //树的别名*
//                 getDiseaseAlias:serverApiRoot +'diseaseType/getDiseaseAlias',
//                 //获取推荐医生列表*
//                 getRecommendDocList:serverApiRoot +  'recommend/getRecommendDocList',
//                 //增加医生*
//                 addDoctors:serverApiRoot +  'recommend/addDoctors',
//                 //删除医生*
//                 delDoctor:serverApiRoot +  ' recommend/delDoctor',
//                 //推荐/取消推荐名医*
//                 setRecommend:serverApiRoot +  'recommend/setRecommend' ,
//                 //上移*
//                 upWeight:serverApiRoot +   'recommend/upWeight ',
//                 //搜索医生*
//                 searchByKeyword:serverApiRoot +  'recommend/searchByKeyword',
//                 searchByKeywords: serverApiRoot + 'group/searchByKeyword',
//                 //添加疾病*
//                 addCommonDisease:serverApiRoot +  'diseaseType/addCommonDisease',
//                 //获取常见疾病列表*
//                 getCommonDiseases:serverApiRoot +'diseaseType/getCommonDiseases',
//                 //移除疾病*
//                 removeCommonDisease :serverApiRoot +  'diseaseType/removeCommonDisease',
//                 //上移疾病*
//                 riseCommonDisease:serverApiRoot + 'diseaseType/riseCommonDisease',
//                 //查询树*
//                 searchDiseaseTreeByKeyword:serverApiRoot + 'diseaseType/searchDiseaseTreeByKeyword',
//                 //个性化页面
//                 getRecommentDoc:serverApiRoot + 'recommend/getRecommentDoc',
//                 //个性化页面保存
//                 updateRecDocument:serverApiRoot +  'document/updateRecDocument',
//                 //设置疾病
//                 setDiseaseInfo:serverApiRoot +    'diseaseType/setDiseaseInfo',
//                 //获取疾病
//                 findById:serverApiRoot +    'diseaseType/findById',
//
//             },
//             //患教中心
//             document: {
//                 getAllData: app.yiliao + 'department/getAllDataById',
//                 getDepartmentDoctor: serverApiRoot + 'department/doctor/getDepartmentDoctor',
//                 getDiseaseTree: serverApiRoot + 'base/getDiseaseTree',
//                 //上移置顶指定文章
//                 topArticleUp: serverApiRoot + 'article/topArticleUp',
//                 //取消指定文档置顶
//                 topArticleRemove: serverApiRoot + 'article/topArticleRemove',
//                 //获取置顶文章列表（最多5条）
//                 findTopArticle: serverApiRoot + 'article/findTopArticle',
//                 //收藏一个文档，已收藏不做重复收藏操作
//                 collectArticle: serverApiRoot + 'article/collectArticle',
//                 //置顶指定文章，如果已置顶文章大于5，则不置顶并返回提示信息
//                 topArticle: serverApiRoot + 'article/topArticle',
//                 //新建文章
//                 addArticle: serverApiRoot + 'article/addArticle',
//                 //查询病种树并统计对应一级病种文档数量
//                 findDiseaseTreeForArticle: serverApiRoot + 'article/findDiseaseTreeForArticle',
//                 //根据关键字搜索文章标题,获取文章列表
//                 findArticleByKeyWord: serverApiRoot + 'article/findArticleByKeyWord',
//                 //根据病种查出对应范围内文章，返回文章（基本信息）列表，指定查询范围（1：平台，2：集团，3：个体医生），指定创建者ID范围内文章列表
//                 getArticleByDisease: serverApiRoot + 'article/getArticleByDisease',
//                 //根据父节点获取专长，parentId为空查找一级病种
//                 getDisease: serverApiRoot + 'base/getDisease',
//                 //根据ID查询出文章，返回所有基本信息
//                 getArticleById: serverApiRoot + 'article/getArticleById',
//                 //编辑指定ID文章，返回所有基本信息，后台增加一条浏览记录
//                 updateArticle: serverApiRoot + 'article/updateArticle',
//                 //根据标签搜索tag字段,获取文章列表 整个文档对象（包含ＵＲＬ）（查看平台文章时，该用户是否已收藏，后面再做）
//                 findArticleByTag: serverApiRoot + 'article/findArticleByTag',
//                 //删除文章，只能删除useNum为0的所有文章
//                 delArticle: serverApiRoot + 'article/delArticle',
//                 //根据ID查询出文章，返回所有基本信息（web端）
//                 getArticleByIdWeb: serverApiRoot + 'article/getArticleByIdWeb'
//             },
//             //爱心宣教
//             pubMsg: {
//                 //根据集团Id获取该集团下所有公共号
//                 getPubListByMid: serverApiRoot + 'pub/getByMid',
//                 //公共号发送消息(消息只接收json格式)
//                 sendMsg: serverApiRoot + 'pub/sendMsg',
//                 //根据公共号Id获取公共号信息
//                 getPubInfo: serverApiRoot + 'pub/get',
//                 //保存公共号信息
//                 savePubInfo: serverApiRoot + 'pub/save',
//                 //公共号 - 获取消息历史
//                 getMsgHistory: serverApiRoot + 'pub/msgList',
//                 //删除公共号信息
//                 delMsgHistory: serverApiRoot + 'pub/delMsg',
//                 //玄关平台客服所有公共号
//                 getCustomerPub: serverApiRoot + 'pub/getCustomerPub',
//                 //获取消息历史(分页查询)
//                 getMsgPageList: serverApiRoot + 'pub/msgPageList'
//             },
//             //健康科普和患者广告
//             science_ad: {
//                 //根据文档类型获取对应的文档内容分类列表
//                 getContentType: serverApiRoot + 'document/getContentType',
//                 //健康科普
//                 getHealthSienceDocumentType: serverApiRoot + 'document/getHealthSienceDocumentType',
//                 //健康科普文档列表
//                 getHealthSicenceDocumentList:serverApiRoot + 'document/getHealthSicenceDocumentList',
//                 //创建文档（患者广告/健康科普）
//                 createDocument: serverApiRoot + 'document/createDocument',
//                 //获取文档列表
//                 getDocumentList: serverApiRoot + 'document/getDocumentList',
//                 //根据ID浏览文档
//                 viewDocumentDetail: serverApiRoot + 'document/viewDocumentDetail',
//                 //更新文档
//                 updateDocument: serverApiRoot + 'document/updateDocument',
//                 //删除文档
//                 delDocument: serverApiRoot + 'document/delDocument',
//                 //根据ID获取文档信息
//                 getDocumentDetail: serverApiRoot + 'document/getDocumentDetail',
//                 //设置科普文档置顶
//                 setTopScience: serverApiRoot + 'document/setTopScience',
//                 //获取科普置顶文章（按权重排序），不足五条，则补充至五条按浏览量倒序排序
//                 getTopScienceList: serverApiRoot + 'document/getTopScienceList',
//                 //上移或者下移已置顶或者已显示的文档
//                 upOrDownWeight: serverApiRoot + 'document/upOrDownWeight',
//                 //置广告显示或不显示
//                 setAdverShowStatus: serverApiRoot + 'document/setAdverShowStatus',
//             },
//             account: {
//                 //获取导医列表
//                 getGuideDoctorList: serverApiRoot + 'user/getGuideDoctorList',
//                 //注册账户(包括导医和医生助手)
//                 register: serverApiRoot + 'user/register',
//                 //重置密码(包括导医和医生助手)
//                 resetPassword: serverApiRoot + 'user/oneKeyReset',
//                 //更新导医信息
//                 updateUserInfo: serverApiRoot + 'user/updateGuidInfo',
//                 //更改启用信息
//                 updateStatus: serverApiRoot + 'user/updateGuideStatus',
//                 // 修改密码
//                 updatePassword: serverApiRoot + 'user/updatePassword',
//
//
//                 //获取医生助手列表
//                 getFeldsherList:serverApiRoot + 'user/getFeldsherList',
//                 //更新医生助手信息
//                 updateFeldsherInfo:serverApiRoot + 'user/updateFeldsherInfo',
//                 //医生助手启用、禁用(启用：1；禁用：2)
//                 updateFeldsherStatus:serverApiRoot + 'user/updateFeldsherStatus',
//
//                 //获取可用的医生助手列表，医生资格审核时需要获取可用的医生助手列表
//                 getAvailableFeldsherList:serverApiRoot+'user/getAvailableFeldsherList'
//             },
//             msg: {
//                 saveBatchInvite: serverApiRoot + 'group/doctor/saveBatchInvite', // 发短信邀请医生加入集团
//                 registerByGroupNotify: serverApiRoot + 'user/registerByGroupNotify', // 新建账号成功后的通知短信
//                 sendAll: sms + 'sms/sendAll', // 群发短信
//                 sendAllByExt: sms + 'sms/sendAllByExt', // 群发短信
//                 balanceCount: sms + 'sms/balanceCount', // 群发短信
//                 //find: serverApiRoot + 'smsLog/find',    // 短信查询，旧
//                 find: sms + 'sms/find', // 短信查询，新
//                 //删除文案模板
//                 delTpl: serverApiRoot + 'base/deleteCopyWriterTemplateById',
//                 //新增或者更新文案模板
//                 saveMsgTpl: serverApiRoot + 'base/saveMsgTemplate',
//                 //查询或者搜索文案模板（可分页获取）
//                 queryMsgTpl: serverApiRoot + 'base/queryMsgTemplate',
//                 //根据ID文案模板
//                 queryMsgTplById: serverApiRoot + 'base/queryMsgTemplateById'
//             },
//             // 关怀计划
//             care: {
//                 get: serverApiRoot + 'group/fee/get',
//                 // 添加随访计划模板接口
//                 //addFollowUpTemplate: app.yiliao + 'pack/followReForm/addFollowUpTemplate',
//                 addFollowUpTemplate: serverApiRoot + 'pack/followReForm/addFollowUpTemplate',
//                 // 查询单个随访计划模板接口
//                 //findFollowUpTemplate: app.yiliao + 'pack/followReForm/findFollowUpTemplate',
//                 findFollowUpTemplate: serverApiRoot + 'pack/followReForm/findFollowUpTemplate',
//                 // 删除随访计划模板接口
//                 //deleteFollowUpTemplate: app.yiliao + 'pack/followReForm/deleteFollowUpTemplate',
//                 deleteFollowUpTemplate: serverApiRoot + 'pack/followReForm/deleteFollowUpTemplate',
//                 //统计 - 获取有数据的集团病种树
//                 getDiseaseTypeTree: serverApiRoot + 'group/stat/getDiseaseTypeTree',
//                 queryCareTemplate: serverApiRoot + 'pack/care/queryCareTemplate',
//                 queryCareTemplateDetail: serverApiRoot + 'pack/care/queryCareTemplateDetail',
//                 queryCareTemplateItem: serverApiRoot + 'pack/care/queryCareTemplateItem',
//                 saveCareTemplate: serverApiRoot + 'pack/care/saveCareTemplate',
//                 delCareTemplate: serverApiRoot + 'pack/care/delCareTemplate',
//                 findCareTemplateById: serverApiRoot + 'pack/care/findCareTemplateById',
//                 deleteCareTempateByCare: serverApiRoot + 'pack/care/deleteCareTempateByCare',
//                 saveCareTemplateByCare: serverApiRoot + 'pack/care/saveCareTemplateByCare',
//                 queryCareTemplateItemDetailByCare: serverApiRoot + 'pack/care/queryCareTemplateItemDetailByCare',
//                 findFollowUpTemplates: serverApiRoot + 'pack/followReForm/findFollowUpTemplates',
//                 getOrderDetailById: serverApiRoot + 'pack/order/getOrderDetailById',
//             },
//             yiliao: {
//                 getTypeByParent: serverApiRoot + 'article/getTypeByParent',
//                 submitCert: serverApiRoot + 'group/cert/submitCert',
//                 findGroupByKeyWord: serverApiRoot + 'groupSearch/findGroupByKeyWord', // 搜索医生集团
//                 searchGroup: serverApiRoot + 'group/findGroupByKeyword' // 搜索医生集团
//             },
//             finance: {
//                 settleTypeList: serverApiRoot + 'income/settleTypeList', // departed
//                 settleList: serverApiRoot + 'income/settleList', // departed
//                 settleIncome: serverApiRoot + 'income/settleIncome', // departed
//                 settleIncomeList: serverApiRoot + 'income/settleIncomeList', // departed
//                 downExcel: serverApiRoot + 'income/downExcel',
//                 //eDownExcel: medicineApiRoot + 'eIncome/downExcel',
//                 eDownExcel: drugFirmsApiRoot + 'tradeSettle/downExcel',
//
//                 gSettleYMList: serverApiRoot + 'income/gSettleYMList',
//                 dSettleYMList: serverApiRoot + 'income/dSettleYMList',
//                 gSettleMList: serverApiRoot + 'income/gSettleMList',
//                 dSettleMList: serverApiRoot + 'income/dSettleMList',
//                 groupSettle: serverApiRoot + 'income/groupSettle',
//                 doctorSettle: serverApiRoot + 'income/doctorSettle',
//
//                 //settleYMList: drugFirmsApiRoot + 'eIncome/settleYMList',
//                 settleYMList: drugFirmsApiRoot + 'tradeSettle/settleYMList',
//                 //settleMList: drugFirmsApiRoot + 'eIncome/settleMList',
//                 settleMList: drugFirmsApiRoot + 'tradeSettle/settleYMDetail',
//                 //settle: drugFirmsApiRoot + 'eIncome/settle'
//                 settle: drugFirmsApiRoot + 'tradeSettle/execSettle'
//             },
//             //会诊
//             consult: {
//                 //添加会诊包
//                 addPack: serverApiRoot + 'consultation/pack/add',
//                 //获取集团会诊包列表
//                 getPackList: serverApiRoot + 'consultation/pack/getList',
//                 //获取集团会诊包详情
//                 getPackDetail: serverApiRoot + 'consultation/pack/getDetail',
//                 //修改会诊包 以及 添加和删除会诊包医生
//                 updatePack: serverApiRoot + 'consultation/pack/update',
//                 //使用场景：集团进入后台管理系统点击开通会诊服务按钮
//                 openService: serverApiRoot + 'consultation/pack/openService',
//                 //删除集团会诊包
//                 delPack: serverApiRoot + 'consultation/pack/delete',
//                 //获取集团在其他会诊包中的医生ids
//                 getNotInCurrentPackDoctorIds: serverApiRoot + 'consultation/pack/getNotInCurrentPackDoctorIds',
//                 //判断该集团是否有开通会诊包
//                 getOpenConsultation: serverApiRoot + 'consultation/pack/getOpenConsultation',
//                 //搜索医生
//                 getPlatformSelectedDoctors: serverApiRoot + 'consultation/pack/getPlatformSelectedDoctors',
//             },
//             hospital: {
//                 getHospitalLevel: serverApiRoot + 'admin/check/getHospitalLevel', // 获取医院级别
//                 getHospitalList: serverApiRoot + 'group/hospital/groupHospitalList',
//                 findHospitalByCondition: serverApiRoot + 'base/findHospitalByCondition',
//                 createGroupHospital: serverApiRoot + 'group/hospital/createGroupHospital',
//                 findDoctorsByCondition: serverApiRoot + 'doctor/findDoctorsByCondition',
//                 getDetailByGroupId: serverApiRoot + 'group/hospital/getDetailByGroupId',
//                 updateHospitalRoot: serverApiRoot + 'group/hospital/updateHospitalRoot'
//             },
//             drug: {
//                 getAllFormList: drugFirmsApiRoot + 'goods/form/getAllFormList', //查询剂型列表
//                 getAllDoseList: drugFirmsApiRoot + 'goods/dose/getAllDoseList', //查询服药单位列表
//                 getAvailDoseList: drugFirmsApiRoot + 'goods/dose/getAvailDoseList', //查询有效服药单位列表
//                 getAllBizTypeList: drugFirmsApiRoot + 'goods/biztype/getAllBizTypeList', //查询产品列表
//                 getAllManageTypeList: drugFirmsApiRoot + 'goods/managetype/getAllManageTypeList', //查询管理类别数据
//                 getAllPharmacologicalList: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalChildTree', //查询药理类别
//                 getAllUnitList: drugFirmsApiRoot + 'goods/unit/getAllUnitList', //查询包装单位列表
//                 getAvailUnitList: drugFirmsApiRoot + 'goods/unit/getAvailUnitList', //查询有效的包装单位列表
//                 getAllScopeList: drugFirmsApiRoot + 'goods/scope/getAllScopeList ', //查询经营范围列表
//                 getAvailScopeList: drugFirmsApiRoot + 'goods/scope/getAvailScopeList ', //查询有效经营范围列表
//
//                 enableForm: drugFirmsApiRoot + 'goods/form/enableForm', // 启用药剂
//                 disableForm: drugFirmsApiRoot + 'goods/form/disableForm', // 禁用药剂
//                 enableDose: drugFirmsApiRoot + 'goods/dose/enableDose', // 启用服药单位
//                 disableDose: drugFirmsApiRoot + 'goods/dose/disableDose', // 禁用服药单位
//                 enableBizType: drugFirmsApiRoot + 'goods/biztype/enableBizType',
//                 disableBizType: drugFirmsApiRoot + 'goods/biztype/disableBizType',
//                 enableManageType: drugFirmsApiRoot + 'goods/managetype/enableManageType',
//                 disableManageType: drugFirmsApiRoot + 'goods/managetype/disableManageType',
//                 enablePharmacological: drugFirmsApiRoot + 'goods/pharmacological/enablePharmacological',
//                 disablePharmacological: drugFirmsApiRoot + 'goods/pharmacological/disablePharmacological',
//                 enableUnit: drugFirmsApiRoot + 'goods/unit/enableUnit',
//                 disableUnit: drugFirmsApiRoot + 'goods/unit/disableUnit',
//                 enableScope: drugFirmsApiRoot + 'goods/scope/enableScope',
//                 disableScope: drugFirmsApiRoot + 'goods/scope/disableScope',
//
//                 deleteForm: drugFirmsApiRoot + 'goods/form/deleteForm',
//                 deleteDose: drugFirmsApiRoot + 'goods/dose/DeleteDose',
//                 deleteBizType: drugFirmsApiRoot + 'goods/biztype/deleteBizType',
//                 deleteManageType: drugFirmsApiRoot + 'goods/managetype/DeleteManageType',
//                 deletePharmacological: drugFirmsApiRoot + 'goods/pharmacological/deletePharmacological',
//                 deleteUnit: drugFirmsApiRoot + 'goods/unit/DeleteUnit',
//                 deleteScope: drugFirmsApiRoot + 'goods/scope/DeleteScope ',
//
//                 saveForm: drugFirmsApiRoot + 'goods/form/saveForm',
//                 saveDose: drugFirmsApiRoot + 'goods/dose/saveDose',
//                 saveBizType: drugFirmsApiRoot + 'goods/biztype/saveBizType',
//                 saveManageType: drugFirmsApiRoot + 'goods/managetype/saveManageType',
//                 savePharmacological: drugFirmsApiRoot + 'goods/pharmacological/addPharmacological',
//                 saveUnit: drugFirmsApiRoot + 'goods/unit/saveUnit',
//                 saveScope: drugFirmsApiRoot + 'goods/scope/saveScope',
//
//                 getPharmacologicalTree: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalTree',
//                 batchImportGoodsPics: drugFirmsApiRoot + 'goods/batchImportGoodsPics',//品种 - 批量导入品种图片
//                 getGoodsTitleByDrugFormCodes: drugFirmsApiRoot + 'goods/getGoodsTitleByDrugFormCodes',//品种 - 根据品种编码批量查询品种
//
//                 getAllAdvertisements: drugFirmsApiRoot + 'ad/getAllAdvertisements',//药店广告 - 获取所有的广告
//                 addAdvertisement: drugFirmsApiRoot + 'ad/addAdvertisement',//药店广告 - 添加广告
//                 updateAdvertisement: drugFirmsApiRoot + 'ad/updateAdvertisement',//药店广告 - 更新广告
//                 getAdvertisementById: drugFirmsApiRoot + 'ad/getAdvertisementById',//药店广告 - 获取详情广告
//                 getShowAdvertisements: drugFirmsApiRoot + 'ad/getShowAdvertisements',//药店广告 - 显示广告
//                 setTop: drugFirmsApiRoot + 'ad/setTop',//药店广告 - 置顶广告
//                 cancelTop: drugFirmsApiRoot + 'ad/cancelTop',//药店广告 - 取消置顶广告
//                 upAdvertisement: drugFirmsApiRoot + 'ad/upAdvertisement',//药店广告 - 上移广告
//                 deleteAdvertisement: drugFirmsApiRoot + 'ad/deleteAdvertisement',//药店广告 - 上移广告
//
//             },
//             compnMan: {
//                 saveDrugCompany: drugFirmsApiRoot + 'drugCompany/saveDrugCompany',
//                 saveDrugOrg: drugOrgApiRoot + 'drugCompany/saveDrugCompany',
//                 getAllScopeList: drugFirmsApiRoot + 'goods/scope/getAllScopeList',
//                 getDrugCompanyById: drugFirmsApiRoot + 'drugCompany/getDrugCompanyById',
//                 getDrugOrgById: drugOrgApiRoot + 'drugCompany/getDrugCompanyById',
//                 updateByDrugCompany: drugFirmsApiRoot + 'drugCompany/updateByDrugCompany',
//                 updateByDrugOrg: drugOrgApiRoot + 'drugCompany/updateByDrugCompany',
//                 delManager: drugFirmsApiRoot + 'drugCompany/delManager',
//                 searchByDrugCompany: drugFirmsApiRoot + 'drugCompany/searchByDrugCompany',  //药企管理 - 后台获取药店列表
//                 searchByDrugOrg: drugOrgApiRoot + 'drugCompany/searchByDrugCompany',        //药企管理 - 后台获取药企列表
//                 searchAllPAndMDrugCompany: drugOrgApiRoot + 'drugCompany/searchAllPAndMDrugCompany',
//                 enableOrDisableDrugCompany: drugFirmsApiRoot + 'drugCompany/enableOrDisableDrugCompany',
//                 bankMessage: drugFirmsApiRoot + 'wallet/bankMessage' // 新建企业获取银行列表
//             },
//             VartMan: {
//                 // 查询有效的剂型列表
//                 getAvailFormList: drugFirmsApiRoot + 'goods/form/getAvailFormList',
//
//                 addGoods: drugFirmsApiRoot + 'goods/addGoods',
//                 getCheckedGoodsListByCompanyId: drugFirmsApiRoot + 'goods/getCheckedGoodsListByCompanyId',
//                 viewGoodsGroup: drugFirmsApiRoot + 'goods/group/viewGoodsGroup',
//                 getUncheckedGoodsList: drugFirmsApiRoot + 'goods/getUncheckedGoodsList',
//                 //viewGoodsGroup:drugFirmsApiRoot+ 'goods/group/viewGoodsGroup',
//                 addGoodsGroup: drugFirmsApiRoot + 'goods/group/addGoodsGroup',
//                 updateGoodsGroup: drugFirmsApiRoot + 'goods/group/updateGoodsGroup',
//                 deleteGoodsGroup: drugFirmsApiRoot + 'goods/group/deleteGoodsGroup',
//                 getGoodsGroupList: drugFirmsApiRoot + 'goods/group/getGoodsGroupList',
//
//                 //基础数据 - 查询有效的管理类别列表
//                 getAvailManageTypeList: drugFirmsApiRoot + 'goods/managetype/getAvailManageTypeList',
//                 //
//                 getAvailBizTypeList: drugFirmsApiRoot + 'goods/biztype/getAvailBizTypeList',
//
//                 throughTheGoods: drugFirmsApiRoot + 'goods/throughTheGoods',
//                 enableTheGoods: drugFirmsApiRoot + 'goods/enableTheGoods',
//
//                 rejectTheGoods: drugFirmsApiRoot + 'goods/rejectTheGoods',
//                 viewGoods: drugFirmsApiRoot + 'goods/viewGoods',
//                 updateGoods: drugFirmsApiRoot + 'goods/updateGoods',
//                 //viewGoods:drugFirmsApiRoot+ 'goods/viewGoods',
//                 deleteGoods: drugFirmsApiRoot + 'goods/deleteGoods',
//                 disableTheGoods: drugFirmsApiRoot + 'goods/disableTheGoods',
//                 getGoodsListByGroupId: drugFirmsApiRoot + 'goods/getGoodsListByGroupId',
//                 batchImportGoodsList: drugFirmsApiRoot + 'goods/batchImportGoodsList',
//                 //药理类别病种树
//                 getPharmacologicalTree: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalTree',
//                 getWalletRechargePageList: drugFirmsApiRoot + 'wallet/getWalletRechargePageList',
//                 walletRechargeApprove: drugFirmsApiRoot + 'wallet/walletRechargeApprove'
//             },
//             //病情跟踪
//             designer:{
//                 //获取病情问题库病种树
//                 getDiseaseTypeFromStore:serverApiRoot+'designer/getDiseaseTypeFromStore',
//                 //获取病情跟踪问题列表
//                 getQuestionListFromStore:serverApiRoot+'designer/getQuestionListFromStore'
//
//             },
//             // 医患社区
//             community: {
//                 // 查询帖子列表
//                 postQueryList: communityApiRoot + 'topic/query_list',
//                 // 上移帖子
//                 postMoveUp: communityApiRoot + 'topic/moveUp',
//                 // 推荐帖子
//                 postRecommend: communityApiRoot + 'topic/recommend',
//                 // 查询置顶类型
//                 queryTopList: communityApiRoot + 'dataCode/queryList',
//                 // 置顶帖子
//                 postTop: communityApiRoot + 'topic/top',
//                 // 取消置顶
//                 postUnTop: communityApiRoot + 'topic/unTop',
//                 // 获取栏目列表
//                 columns: communityApiRoot + 'column/columns',
//                 // 获取所有栏目列表
//                 allColumns: communityApiRoot + 'column/allColumns',
//                 // 新建栏目
//                 addColumn: communityApiRoot + 'column/addColumn',
//                 // 栏目重命名
//                 columnRename: communityApiRoot + 'column/rename',
//                 // 栏目上移
//                 columnUp: communityApiRoot + 'column/up',
//                 // 停用或启用栏目
//                 columnOnOrOff: communityApiRoot + 'column/onOrOff',
//                 // 标记或取消标记栏目
//                 columnMark: communityApiRoot + 'column/mark',
//                 //获取Banner
//                 bannerList: communityApiRoot + 'banner/queryPage',
//                 //更新banner
//                 editBanner:communityApiRoot + '/banner/update',
//                 //上传Banner
//                 updataBanner:communityApiRoot + 'banner/add',
//                 //上移Banner
//                 upBanner:communityApiRoot + '/banner/up',
//                 //停用Banner/启用Banner
//                 stopBanner:communityApiRoot + '/banner/enable',
//                 //删除Banner
//                 deletebanner: communityApiRoot + '/banner/delete',
//                 querybanner:  communityApiRoot + ' banner/queryById',
//                 //举报审核
//                 checkAuditdel :  communityApiRoot + 'checkAudit/del',
//                 checkAuditaudit :  communityApiRoot + 'checkAudit/audit',
//                 checkAuditlist:  communityApiRoot + 'checkAudit/list',
//                 //帖子审核
//                 deltopicAudit : communityApiRoot + 'topicAudit/del',
//                 audittopicAudit : communityApiRoot + 'topicAudit/audit',
//                 topicAuditlist  : communityApiRoot + 'topicAudit/list',
//                 //评论审核
//                 replyAuditlist : communityApiRoot + 'replyAudit/list',
//                 replyAuditdel :  communityApiRoot + 'replyAudit/del',
//                 replyAuditaudit:  communityApiRoot + 'replyAudit/audit',
//                 getWebTopicDetail : communityApiRoot + ' topic/getWebTopicDetail',
//
//
//                 //获取认证用户
//                 getAuthorList:communityApiRoot+'authUser/list',
//                 //添加认证用户
//                 addAuthor:communityApiRoot+'authUser/add',
//                 //删除认证用户
//                 deleteAuthor:communityApiRoot+'authUser/del',
//                 //web端发表帖子
//                 webPublish:communityApiRoot+'topic/webPublish',
//                 //web端编辑帖子
//                 webEdit:communityApiRoot+'topic/webEdit',
//                 //获取帖子详情
//                 getWebTopicDetail:communityApiRoot+'topic/getWebTopicDetail',
//                 //获取web端发布的帖子列表
//                 getWebTopicList:communityApiRoot+'topic/getWebTopicList',
//                 //web端获取帖子信息（编辑时候用）
//                 getWebTopicSimple:communityApiRoot+'topic/getWebTopicSimple',
//                 //删除帖子
//                 deletePost:communityApiRoot+'topic/delete',
//                 //回复帖子
//                 replyTopic:communityApiRoot+'reply/replyTopic',
//                 //回复评论
//                 replyUser:communityApiRoot+'reply/replyUser',
//                 //获取评论
//                 getReplyList:communityApiRoot+'reply/getReplyList',
//                 //获取主评论详情
//                 getFirstReplyDetail:communityApiRoot+'reply/getFirstReplyDetail',
//                 //获取二级评论
//                 getCommentList:communityApiRoot+'reply/getCommentList',
//             }
//
//         };
//         app.lang = {
//             datatables: {
//                 translation: {
//                     /*<div class="loading">
//                      <i class="glyphicon glyphicon-repeat"></i>
//                      </div>*/
//                     "sLengthMenu": "每页 _MENU_ 条",
//                     "sZeroRecords": "没有找到符合条件的数据",
//                     "sProcessing": "<img style='position:fixed;top:30%;left:50%;z-index:10000;height:80px;border:1px solid #aaa;border-radius:6px;box-shadow:0 0 10px rgba(0,0,0,.5)' src=\"src/img/loading.gif\" />",
//                     "sInfo": "当前第 _START_ - _END_ 条，共 _TOTAL_ 条",
//                     "sInfoEmpty": "没有记录",
//                     "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
//                     "sSearch": "搜索",
//                     "oPaginate": {
//                         "sFirst": "<<",
//                         "sPrevious": "<",
//                         "sNext": ">",
//                         "sLast": ">>"
//                     }
//                 }
//             }
//         }
//     };
//     funtwo.$inject=['$translateProvider'];
//     function funtwo($translateProvider){
//         // 注册一个静态文件加载器，模块会在指定的url中查找翻译词典
//         // url结构为 [prefix][langKey][suffix].
//         $translateProvider.useStaticFilesLoader({
//             prefix: 'src/l10n/',
//             suffix: '.js'
//         });
//         // 设置默认语言
//         $translateProvider.preferredLanguage('en');
//         // 存储默认语言(本地)
//         $translateProvider.useLocalStorage();
//     };
//     funthere.$inject=['$httpProvider'];
//     function funthere($httpProvider){
//         $httpProvider.interceptors.push('authorityInterceptor');
//         $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//         $httpProvider.defaults.transformRequest = [function(data) {
//             return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data, true) : data;
//         }];
//     };
//
//     (function() {
//         angular.module('app').directive('ngEnter', function() {
//             return function(scope, element, attrs) {
//                 element.bind("keydown keypress", function(event) {
//                     if (event.which === 13) {
//                         scope.$apply(function() {
//                             scope.$eval(attrs.ngEnter);
//                         });
//                         event.preventDefault();
//                     }
//                 });
//             };
//         });
//     })();
// })();



var app = angular.module('app').config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider',
        function($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {
            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;

            // API路径集合
            app.urlRoot = serverApiRoot;
            //app.urlFile = '/upload/';
            app.yiliao = '/yiliao/';
            app.yiliao = serverApiRoot;
            app.urlFile = uploadApiRoot;
            app.medicine = medicineApiRoot;

            var common = {
                list: 'list.iv',
                save: 'save.iv',
                edit: 'edit.iv',
                modify: 'modify.iv',
                delete: 'batchDelete.iv',
                find: 'findByIds.iv',
                view: 'view.iv'
            };

            function getApi(name, common) {
                var apis = {};
                for (var n in common) {
                    apis[n] = serverApiRoot + name + '/' + common[n];
                }
                return apis;
            }

            app.url = {
                access_token: localStorage.getItem('check_access_token'),
                groupId: function() {
                    return '666666666666666666666666';
                },

                login: serverApiRoot + 'user/login',
                drugLogin: drugFirmsApiRoot + 'user/login',
                logout: serverApiRoot + 'user/logout',
                admin: {
                    check: {
                        getDoctors: serverApiRoot + 'admin/check/getDoctors',
                        getMembers: serverApiRoot + 'group/doctor/getMembers', // 获取集团下的医生成员
                        removeDoctors: serverApiRoot + 'group/doctor/removeDoctors', //移出集团下的医生
                        getDoctorsByKeywork : serverApiRoot + 'admin/check/getDoctorsByKeywork',  //获取医生根据关键字
                        inviterJoinGroup :serverApiRoot + 'user/inviterJoinGroup',  //平台批量加入医生
                        checkUserData :serverApiRoot + 'user/checkUserData',     //检查数据
                        handleFormUpload :serverApiRoot + ' user/handleFormUpload',  //导入文件
                        getDoctor: serverApiRoot + 'admin/check/getDoctor',
                        searchByCompany: serverApiRoot + 'company/searchByCompany',
                        getCompanyById: serverApiRoot + 'company/getCompanyById',
                        updateByCompany: serverApiRoot + 'company/updateByCompany',
                        getArea: serverApiRoot + 'admin/check/getArea',
                        getHospitals: serverApiRoot + 'admin/check/getHospitals',
                        getDepts: serverApiRoot + 'admin/check/getDepts',
                        getTitles: serverApiRoot + 'admin/check/getTitles',
                        checked: serverApiRoot + 'admin/check/checked',
                        edit: serverApiRoot + 'admin/check/edit',
                        uncheck: serverApiRoot + 'admin/check/uncheck',
                        fail: serverApiRoot + 'admin/check/fail',
                        updateCheckInfo: serverApiRoot + 'doctor/updateCheckInfo',
                        findDoctorByAuthStatus: serverApiRoot + 'admin/check/findDoctorByAuthStatus',
                        addHospital: serverApiRoot + 'admin/check/addHospital',
                        getGroupCert: serverApiRoot + 'group/cert/getGroupCert',
                        getGroupCerts: serverApiRoot + 'group/cert/getGroupCerts',
                        getOtherGroupCerts: serverApiRoot + 'group/cert/getOtherGroupCerts',
                        passCert: serverApiRoot + 'group/cert/passCert',
                        noPass: serverApiRoot + 'group/cert/noPass',
                        updateRemarks: serverApiRoot + 'group/cert/updateRemarks',
                        groupApplyList: serverApiRoot + 'group/applyList',
                        processGroupApply: serverApiRoot + 'group/processGroupApply',
                        applyDetail: serverApiRoot + 'group/applyDetail',
                        activeGroup: serverApiRoot + 'group/activeGroup', // 激活集团
                        blockGroup: serverApiRoot + 'group/blockGroup', // 屏蔽集团
                        unBlockGroup: serverApiRoot + 'group/unBlockGroup', // 取消屏蔽集团
                        generateQRImage:serverApiRoot + 'qr/generateQRImage',
                        getDiseaseLabel: serverApiRoot + 'groupSearch/findDiseaseByGroup'
                    }
                },
                feedback: {
                    query: serverApiRoot + 'feedback/query',
                    get: serverApiRoot + 'feedback/get',
                    polling: imRoot + 'msg/poll.action',
                    groupList: imRoot + 'msg/groupList.action',
                    msgList: imRoot + 'msg/msgList.action'
                },
                user: {
                    addDoctorCheckImage: serverApiRoot + 'user/addDoctorCheckImage',
                    getDoctorFile: serverApiRoot + 'user/getDoctorFile',
                    getInfo: serverApiRoot + 'user/get',
                    registerByAdmin: serverApiRoot + 'user/registerByAdmin', // 管理员创建医生账号
                    changeTel: serverApiRoot + 'user/updateTel', // 修改手机号码
                    getOperationRecord: serverApiRoot + 'user/getOperationRecord', // 获取操作记录
                    getDrugUser: drugFirmsApiRoot + 'drugCompanyEmployee/getEmployee', // 获取操作记录
                },
                upload: {
                    getCertPath: app.urlFile + 'getCertPath',
                    upLoadImg: app.urlFile + 'cert',
                    CommonUploadServlet: app.urlFile + 'CommonUploadServlet',
                    commonDelFile: app.urlFile + 'commonDelFile'
                },
                order: {
                    //findOrder: serverApiRoot + 'pack/order/findOrders',
                    findOrder: serverApiRoot + 'pack/order/getPaidOrders',
                    getRefundOrders: serverApiRoot + 'pack/order/getRefundOrders',
                    getRefundDetail: serverApiRoot + 'pack/order/getRefundDetail',
                    refund: serverApiRoot + 'pack/order/refund',
                    cancelPaidOrder: serverApiRoot + 'pack/order/cancelPaidOrder',
                    updateRefundByOrder: serverApiRoot + 'pack/order/updateRefundByOrder',
                    callByOrder: serverApiRoot + 'voip/callByOrder',
                    queryOrderByConditions:serverApiRoot+'pack/order/queryOrderByConditions',
                    getOrderDetail: serverApiRoot + 'pack/order/orderDetail',
                    getIllCaseByOrderId: serverApiRoot + 'illcase/getIllCaseByOrderId',
                    cancelOrderByAdmin: serverApiRoot + 'pack/order/cancelOrderByAdmin',
                    //查看订单详情
                    orderSimpleInfo:serverApiRoot + 'pack/order/orderSimpleInfo'


                },
                //集团管理
                group:{
                    //获取所有集团列表
                    findAllGroup:serverApiRoot + 'groupSearch/findAllGroup',
                    //获取集团*
                    // getGroupRecommendedList:serverApiRoot +  '/group/getGroupRecommendedList',
                    getGroupRecommendedList:serverApiRoot +  '/group/getRecommends',
                    //移除集团*
                    removeGroupRecommended:serverApiRoot + 'group/removeGroupRecommended',
                    //查找集团*
                    searchGroupByName:serverApiRoot +  'group/searchGroupByName',
                    //上移集团*
                    riseRecommendedOfGroup:serverApiRoot + 'group/riseRecommendedOfGroup',
                    //设置集团*
                    setGroupToRecommended:serverApiRoot + 'group/setGroupToRecommended',
                    //病种树*
                    getDiseaseTree:serverApiRoot + 'base/getDiseaseTree',
                    //树的别名*
                    getDiseaseAlias:serverApiRoot +'diseaseType/getDiseaseAlias',
                    //获取推荐医生列表*
                    getRecommendDocList:serverApiRoot +  'recommend/getRecommendDocList',
                    //增加医生*
                    addDoctors:serverApiRoot +  'recommend/addDoctors',
                    //删除医生*
                    delDoctor:serverApiRoot +  ' recommend/delDoctor',
                    //推荐/取消推荐名医*
                    setRecommend:serverApiRoot +  'recommend/setRecommend' ,
                    //上移*
                    upWeight:serverApiRoot +   'recommend/upWeight ',
                    //搜索医生*
                    searchByKeyword:serverApiRoot +  'recommend/searchByKeyword',
                    searchByKeywords: serverApiRoot + 'group/searchByKeyword',
                    //添加疾病*
                    addCommonDisease:serverApiRoot +  'diseaseType/addCommonDisease',
                    //获取常见疾病列表*
                    getCommonDiseases:serverApiRoot +'diseaseType/getCommonDiseasesForWeb',
                    //移除疾病*
                    removeCommonDisease :serverApiRoot +  'diseaseType/removeCommonDisease',
                    //上移疾病*
                    riseCommonDisease:serverApiRoot + 'diseaseType/riseCommonDisease',
                    //查询树*
                    searchDiseaseTreeByKeyword:serverApiRoot + 'diseaseType/searchDiseaseTreeByKeyword',
                    //个性化页面
                    getRecommentDoc:serverApiRoot + 'recommend/getRecommentDoc',
                    //个性化页面保存
                    updateRecDocument:serverApiRoot +  'document/updateRecDocument',
                    //设置疾病
                    setDiseaseInfo:serverApiRoot +    'diseaseType/setDiseaseInfo',
                    //获取疾病
                    findById:serverApiRoot +    'diseaseType/findById',
                    //编辑集团信息
                    updateByGroup:serverApiRoot +'group/updateByGroup',
                    // 集团转让确认
                    changeAdmin: serverApiRoot + 'group/changeAdmin',
                    //获取集团信息
                    getGroupById:serverApiRoot +'group/getGroupById',
                    searchDoctorByKeyWord: serverApiRoot + 'group/doctor/searchDoctorByKeyWord',
                    getAllData: app.yiliao + 'department/getAllDataById', // 获取自定义组织树
                    getDepartmentDoctor: serverApiRoot + 'department/doctor/getDepartmentDoctor',
                    getUndistributed: app.yiliao + 'group/doctor/getUndistributedDoctor',
                    //获取所有疾病标签
                    getAllLabers:serverApiRoot+'diseaseLaber/labers',
                    //保存疾病标签
                    saveAllLabel:serverApiRoot+'diseaseLaber/save'


                },
                //患教中心
                document: {
                    getAllData: app.yiliao + 'department/getAllDataById',
                    getDepartmentDoctor: serverApiRoot + 'department/doctor/getDepartmentDoctor',
                    getDiseaseTree: serverApiRoot + 'base/getDiseaseTree',
                    //上移置顶指定文章
                    topArticleUp: serverApiRoot + 'article/topArticleUp',
                    //取消指定文档置顶
                    topArticleRemove: serverApiRoot + 'article/topArticleRemove',
                    //获取置顶文章列表（最多5条）
                    findTopArticle: serverApiRoot + 'article/findTopArticle',
                    //收藏一个文档，已收藏不做重复收藏操作
                    collectArticle: serverApiRoot + 'article/collectArticle',
                    //置顶指定文章，如果已置顶文章大于5，则不置顶并返回提示信息
                    topArticle: serverApiRoot + 'article/topArticle',
                    //新建文章
                    addArticle: serverApiRoot + 'article/addArticle',
                    //查询病种树并统计对应一级病种文档数量
                    findDiseaseTreeForArticle: serverApiRoot + 'article/findDiseaseTreeForArticle',
                    //根据关键字搜索文章标题,获取文章列表
                    findArticleByKeyWord: serverApiRoot + 'article/findArticleByKeyWord',
                    //根据病种查出对应范围内文章，返回文章（基本信息）列表，指定查询范围（1：平台，2：集团，3：个体医生），指定创建者ID范围内文章列表
                    getArticleByDisease: serverApiRoot + 'article/getArticleByDisease',
                    //根据父节点获取专长，parentId为空查找一级病种
                    getDisease: serverApiRoot + 'base/getDisease',
                    //根据ID查询出文章，返回所有基本信息
                    getArticleById: serverApiRoot + 'article/getArticleById',
                    //编辑指定ID文章，返回所有基本信息，后台增加一条浏览记录
                    updateArticle: serverApiRoot + 'article/updateArticle',
                    //根据标签搜索tag字段,获取文章列表 整个文档对象（包含ＵＲＬ）（查看平台文章时，该用户是否已收藏，后面再做）
                    findArticleByTag: serverApiRoot + 'article/findArticleByTag',
                    //删除文章，只能删除useNum为0的所有文章
                    delArticle: serverApiRoot + 'article/delArticle',
                    //根据ID查询出文章，返回所有基本信息（web端）
                    getArticleByIdWeb: serverApiRoot + 'article/getArticleByIdWeb'
                },
                //爱心宣教
                pubMsg: {
                    //根据集团Id获取该集团下所有公共号
                    getPubListByMid: serverApiRoot + 'pub/getByMid',
                    //公共号发送消息(消息只接收json格式)
                    sendMsg: serverApiRoot + 'pub/sendMsg',
                    //根据公共号Id获取公共号信息
                    getPubInfo: serverApiRoot + 'pub/get',
                    //保存公共号信息
                    savePubInfo: serverApiRoot + 'pub/save',
                    //公共号 - 获取消息历史
                    getMsgHistory: serverApiRoot + 'pub/msgList',
                    //删除公共号信息
                    delMsgHistory: serverApiRoot + 'pub/delMsg',
                    //玄关平台客服所有公共号
                    getCustomerPub: serverApiRoot + 'pub/getCustomerPub',
                    //获取消息历史(分页查询)
                    getMsgPageList: serverApiRoot + 'pub/msgPageList'
                },
                //健康科普和患者广告
                science_ad: {
                    //根据文档类型获取对应的文档内容分类列表
                    getContentType: serverApiRoot + 'document/getContentType',
                    //健康科普
                    getHealthSienceDocumentType: serverApiRoot + 'document/getHealthSienceDocumentType',
                    //健康科普文档列表
                    getHealthSicenceDocumentList:serverApiRoot + 'document/getHealthSicenceDocumentList',
                    //创建文档（患者广告/健康科普）
                    createDocument: serverApiRoot + 'document/createDocument',
                    //获取文档列表
                    getDocumentList: serverApiRoot + 'document/getDocumentList',
                    //根据ID浏览文档
                    viewDocumentDetail: serverApiRoot + 'document/viewDocumentDetail',
                    //更新文档
                    updateDocument: serverApiRoot + 'document/updateDocument',
                    //删除文档
                    delDocument: serverApiRoot + 'document/delDocument',
                    //根据ID获取文档信息
                    getDocumentDetail: serverApiRoot + 'document/getDocumentDetail',
                    //设置科普文档置顶
                    setTopScience: serverApiRoot + 'document/setTopScience',
                    //获取科普置顶文章（按权重排序），不足五条，则补充至五条按浏览量倒序排序
                    getTopScienceList: serverApiRoot + 'document/getTopScienceList',
                    //上移或者下移已置顶或者已显示的文档
                    upOrDownWeight: serverApiRoot + 'document/upOrDownWeight',
                    //置广告显示或不显示
                    setAdverShowStatus: serverApiRoot + 'document/setAdverShowStatus',
                },
                account: {
                    //获取导医列表
                    getGuideDoctorList: serverApiRoot + 'user/getGuideDoctorList',
                    //注册账户(包括导医和医生助手)
                    register: serverApiRoot + 'user/register',
                    //重置密码(包括导医和医生助手)
                    resetPassword: serverApiRoot + 'user/oneKeyReset',
                    //更新导医信息
                    updateUserInfo: serverApiRoot + 'user/updateGuidInfo',
                    //更改启用信息
                    updateStatus: serverApiRoot + 'user/updateGuideStatus',
                    // 修改密码
                    updatePassword: serverApiRoot + 'user/updatePassword',


                    //获取医生助手列表
                    getFeldsherList:serverApiRoot + 'user/getFeldsherList',
                    //更新医生助手信息
                    updateFeldsherInfo:serverApiRoot + 'user/updateFeldsherInfo',
                    //医生助手启用、禁用(启用：1；禁用：2)
                    updateFeldsherStatus:serverApiRoot + 'user/updateFeldsherStatus',

                    //获取可用的医生助手列表，医生资格审核时需要获取可用的医生助手列表
                    getAvailableFeldsherList:serverApiRoot+'user/getAvailableFeldsherList'
                },
                msg: {
                    saveBatchInvite: serverApiRoot + 'group/doctor/saveBatchInvite', // 发短信邀请医生加入集团
                    registerByGroupNotify: serverApiRoot + 'user/registerByGroupNotify', // 新建账号成功后的通知短信
                    sendAll: sms + 'sms/sendAll', // 群发短信
                    sendAllByExt: sms + 'sms/sendAllByExt', // 群发短信
                    balanceCount: sms + 'sms/balanceCount', // 群发短信
                    //find: serverApiRoot + 'smsLog/find',    // 短信查询，旧
                    find: sms + 'sms/find', // 短信查询，新
                    //删除文案模板
                    delTpl: serverApiRoot + 'base/deleteCopyWriterTemplateById',
                    //新增或者更新文案模板
                    saveMsgTpl: serverApiRoot + 'base/saveMsgTemplate',
                    //查询或者搜索文案模板（可分页获取）
                    queryMsgTpl: serverApiRoot + 'base/queryMsgTemplate',
                    //根据ID文案模板
                    queryMsgTplById: serverApiRoot + 'base/queryMsgTemplateById'
                },
                // 关怀计划
                care: {
                    get: serverApiRoot + 'group/fee/get',
                    // 添加随访计划模板接口
                    //addFollowUpTemplate: app.yiliao + 'pack/followReForm/addFollowUpTemplate',
                    addFollowUpTemplate: serverApiRoot + 'pack/followReForm/addFollowUpTemplate',
                    // 查询单个随访计划模板接口
                    //findFollowUpTemplate: app.yiliao + 'pack/followReForm/findFollowUpTemplate',
                    findFollowUpTemplate: serverApiRoot + 'pack/followReForm/findFollowUpTemplate',
                    // 删除随访计划模板接口
                    //deleteFollowUpTemplate: app.yiliao + 'pack/followReForm/deleteFollowUpTemplate',
                    deleteFollowUpTemplate: serverApiRoot + 'pack/followReForm/deleteFollowUpTemplate',
                    //统计 - 获取有数据的集团病种树
                    getDiseaseTypeTree: serverApiRoot + 'group/stat/getDiseaseTypeTree',
                    queryCareTemplate: serverApiRoot + 'pack/care/queryCareTemplate',
                    queryCareTemplateDetail: serverApiRoot + 'pack/care/queryCareTemplateDetail',
                    queryCareTemplateItem: serverApiRoot + 'pack/care/queryCareTemplateItem',
                    saveCareTemplate: serverApiRoot + 'pack/care/saveCareTemplate',
                    delCareTemplate: serverApiRoot + 'pack/care/delCareTemplate',
                    findCareTemplateById: serverApiRoot + 'pack/care/findCareTemplateById',
                    deleteCareTempateByCare: serverApiRoot + 'pack/care/deleteCareTempateByCare',
                    saveCareTemplateByCare: serverApiRoot + 'pack/care/saveCareTemplateByCare',
                    queryCareTemplateItemDetailByCare: serverApiRoot + 'pack/care/queryCareTemplateItemDetailByCare',
                    findFollowUpTemplates: serverApiRoot + 'pack/followReForm/findFollowUpTemplates',
                    getOrderDetailById: serverApiRoot + 'pack/order/getOrderDetailById',
                },
                yiliao: {
                    getTypeByParent: serverApiRoot + 'article/getTypeByParent',
                    submitCert: serverApiRoot + 'group/cert/submitCert',
                    findGroupByKeyWord: serverApiRoot + 'groupSearch/findGroupByKeyWord', // 搜索医生集团
                    searchGroup: serverApiRoot + 'group/findGroupByKeyword' // 搜索医生集团
                },
                finance: {
                    settleTypeList: serverApiRoot + 'income/settleTypeList', // departed
                    settleList: serverApiRoot + 'income/settleList', // departed
                    settleIncome: serverApiRoot + 'income/settleIncome', // departed
                    settleIncomeList: serverApiRoot + 'income/settleIncomeList', // departed
                    downExcel: serverApiRoot + 'income/downExcel',
                    //eDownExcel: medicineApiRoot + 'eIncome/downExcel',
                    eDownExcel: drugFirmsApiRoot + 'tradeSettle/downExcel',

                    gSettleYMList: serverApiRoot + 'income/gSettleYMList',
                    dSettleYMList: serverApiRoot + 'income/dSettleYMList',
                    gSettleMList: serverApiRoot + 'income/gSettleMList',
                    dSettleMList: serverApiRoot + 'income/dSettleMList',
                    groupSettle: serverApiRoot + 'income/groupSettle',
                    doctorSettle: serverApiRoot + 'income/doctorSettle',

                    //settleYMList: drugFirmsApiRoot + 'eIncome/settleYMList',
                    settleYMList: drugFirmsApiRoot + 'tradeSettle/settleYMList',
                    //settleMList: drugFirmsApiRoot + 'eIncome/settleMList',
                    settleMList: drugFirmsApiRoot + 'tradeSettle/settleYMDetail',
                    //settle: drugFirmsApiRoot + 'eIncome/settle'
                    settle: drugFirmsApiRoot + 'tradeSettle/execSettle'
                },
                //会诊
                consult: {
                    //添加会诊包
                    addPack: serverApiRoot + 'consultation/pack/add',
                    //获取集团会诊包列表
                    getPackList: serverApiRoot + 'consultation/pack/getList',
                    //获取集团会诊包详情
                    getPackDetail: serverApiRoot + 'consultation/pack/getDetail',
                    //修改会诊包 以及 添加和删除会诊包医生
                    updatePack: serverApiRoot + 'consultation/pack/update',
                    //使用场景：集团进入后台管理系统点击开通会诊服务按钮
                    openService: serverApiRoot + 'consultation/pack/openService',
                    //删除集团会诊包
                    delPack: serverApiRoot + 'consultation/pack/delete',
                    //获取集团在其他会诊包中的医生ids
                    getNotInCurrentPackDoctorIds: serverApiRoot + 'consultation/pack/getNotInCurrentPackDoctorIds',
                    //判断该集团是否有开通会诊包
                    getOpenConsultation: serverApiRoot + 'consultation/pack/getOpenConsultation',
                    //搜索医生
                    getPlatformSelectedDoctors: serverApiRoot + 'consultation/pack/getPlatformSelectedDoctors',
                },
                hospital: {
                    getHospitalLevel: serverApiRoot + 'admin/check/getHospitalLevel', // 获取医院级别
                    getHospitalList: serverApiRoot + 'group/hospital/groupHospitalList',
                    findHospitalByCondition: serverApiRoot + 'base/findHospitalByCondition',
                    createGroupHospital: serverApiRoot + 'group/hospital/createGroupHospital',
                    findDoctorsByCondition: serverApiRoot + 'doctor/findDoctorsByCondition',
                    getDetailByGroupId: serverApiRoot + 'group/hospital/getDetailByGroupId',
                    updateHospitalRoot: serverApiRoot + 'group/hospital/updateHospitalRoot'
                },
                drug: {
                    getAllFormList: drugFirmsApiRoot + 'goods/form/getAllFormList', //查询剂型列表
                    getAllDoseList: drugFirmsApiRoot + 'goods/dose/getAllDoseList', //查询服药单位列表
                    getAvailDoseList: drugFirmsApiRoot + 'goods/dose/getAvailDoseList', //查询有效服药单位列表
                    getAllBizTypeList: drugFirmsApiRoot + 'goods/biztype/getAllBizTypeList', //查询产品列表
                    getAllManageTypeList: drugFirmsApiRoot + 'goods/managetype/getAllManageTypeList', //查询管理类别数据
                    getAllPharmacologicalList: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalChildTree', //查询药理类别
                    getAllUnitList: drugFirmsApiRoot + 'goods/unit/getAllUnitList', //查询包装单位列表
                    getAvailUnitList: drugFirmsApiRoot + 'goods/unit/getAvailUnitList', //查询有效的包装单位列表
                    getAllScopeList: drugFirmsApiRoot + 'goods/scope/getAllScopeList ', //查询经营范围列表
                    getAvailScopeList: drugFirmsApiRoot + 'goods/scope/getAvailScopeList ', //查询有效经营范围列表

                    enableForm: drugFirmsApiRoot + 'goods/form/enableForm', // 启用药剂
                    disableForm: drugFirmsApiRoot + 'goods/form/disableForm', // 禁用药剂
                    enableDose: drugFirmsApiRoot + 'goods/dose/enableDose', // 启用服药单位
                    disableDose: drugFirmsApiRoot + 'goods/dose/disableDose', // 禁用服药单位
                    enableBizType: drugFirmsApiRoot + 'goods/biztype/enableBizType',
                    disableBizType: drugFirmsApiRoot + 'goods/biztype/disableBizType',
                    enableManageType: drugFirmsApiRoot + 'goods/managetype/enableManageType',
                    disableManageType: drugFirmsApiRoot + 'goods/managetype/disableManageType',
                    enablePharmacological: drugFirmsApiRoot + 'goods/pharmacological/enablePharmacological',
                    disablePharmacological: drugFirmsApiRoot + 'goods/pharmacological/disablePharmacological',
                    enableUnit: drugFirmsApiRoot + 'goods/unit/enableUnit',
                    disableUnit: drugFirmsApiRoot + 'goods/unit/disableUnit',
                    enableScope: drugFirmsApiRoot + 'goods/scope/enableScope',
                    disableScope: drugFirmsApiRoot + 'goods/scope/disableScope',

                    deleteForm: drugFirmsApiRoot + 'goods/form/deleteForm',
                    deleteDose: drugFirmsApiRoot + 'goods/dose/DeleteDose',
                    deleteBizType: drugFirmsApiRoot + 'goods/biztype/deleteBizType',
                    deleteManageType: drugFirmsApiRoot + 'goods/managetype/DeleteManageType',
                    deletePharmacological: drugFirmsApiRoot + 'goods/pharmacological/deletePharmacological',
                    deleteUnit: drugFirmsApiRoot + 'goods/unit/DeleteUnit',
                    deleteScope: drugFirmsApiRoot + 'goods/scope/DeleteScope ',

                    saveForm: drugFirmsApiRoot + 'goods/form/saveForm',
                    saveDose: drugFirmsApiRoot + 'goods/dose/saveDose',
                    saveBizType: drugFirmsApiRoot + 'goods/biztype/saveBizType',
                    saveManageType: drugFirmsApiRoot + 'goods/managetype/saveManageType',
                    savePharmacological: drugFirmsApiRoot + 'goods/pharmacological/addPharmacological',
                    saveUnit: drugFirmsApiRoot + 'goods/unit/saveUnit',
                    saveScope: drugFirmsApiRoot + 'goods/scope/saveScope',

                    getPharmacologicalTree: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalTree',
                    batchImportGoodsPics: drugFirmsApiRoot + 'goods/batchImportGoodsPics',//品种 - 批量导入品种图片
                    getGoodsTitleByDrugFormCodes: drugFirmsApiRoot + 'goods/getGoodsTitleByDrugFormCodes',//品种 - 根据品种编码批量查询品种

                    getAllAdvertisements: drugFirmsApiRoot + 'ad/getAllAdvertisements',//药店广告 - 获取所有的广告
                    addAdvertisement: drugFirmsApiRoot + 'ad/addAdvertisement',//药店广告 - 添加广告
                    updateAdvertisement: drugFirmsApiRoot + 'ad/updateAdvertisement',//药店广告 - 更新广告
                    getAdvertisementById: drugFirmsApiRoot + 'ad/getAdvertisementById',//药店广告 - 获取详情广告
                    getShowAdvertisements: drugFirmsApiRoot + 'ad/getShowAdvertisements',//药店广告 - 显示广告
                    setTop: drugFirmsApiRoot + 'ad/setTop',//药店广告 - 置顶广告
                    cancelTop: drugFirmsApiRoot + 'ad/cancelTop',//药店广告 - 取消置顶广告
                    upAdvertisement: drugFirmsApiRoot + 'ad/upAdvertisement',//药店广告 - 上移广告
                    deleteAdvertisement: drugFirmsApiRoot + 'ad/deleteAdvertisement',//药店广告 - 上移广告

                },
                compnMan: {
                    saveDrugCompany: drugFirmsApiRoot + 'drugCompany/saveDrugCompany',
                    saveDrugOrg: drugOrgApiRoot + 'drugCompany/saveDrugCompany',
                    getAllScopeList: drugFirmsApiRoot + 'goods/scope/getAllScopeList',
                    getDrugCompanyById: drugFirmsApiRoot + 'drugCompany/getDrugCompanyById',
                    getDrugOrgById: drugOrgApiRoot + 'drugCompany/getDrugCompanyById',
                    updateByDrugCompany: drugFirmsApiRoot + 'drugCompany/updateByDrugCompany',
                    updateByDrugOrg: drugOrgApiRoot + 'drugCompany/updateByDrugCompany',
                    delManager: drugFirmsApiRoot + 'drugCompany/delManager',
                    searchByDrugCompany: drugFirmsApiRoot + 'drugCompany/searchByDrugCompany',  //药企管理 - 后台获取药店列表
                    searchByDrugOrg: drugOrgApiRoot + 'drugCompany/searchByDrugCompany',        //药企管理 - 后台获取药企列表
                    searchAllPAndMDrugCompany: drugOrgApiRoot + 'drugCompany/searchAllPAndMDrugCompany',
                    enableOrDisableDrugCompany: drugFirmsApiRoot + 'drugCompany/enableOrDisableDrugCompany',
                    bankMessage: drugFirmsApiRoot + 'wallet/bankMessage' // 新建企业获取银行列表
                },
                VartMan: {
                    // 查询有效的剂型列表
                    getAvailFormList: drugFirmsApiRoot + 'goods/form/getAvailFormList',

                    addGoods: drugFirmsApiRoot + 'goods/addGoods',
                    getCheckedGoodsListByCompanyId: drugFirmsApiRoot + 'goods/getCheckedGoodsListByCompanyId',
                    viewGoodsGroup: drugFirmsApiRoot + 'goods/group/viewGoodsGroup',
                    getUncheckedGoodsList: drugFirmsApiRoot + 'goods/getUncheckedGoodsList',
                    //viewGoodsGroup:drugFirmsApiRoot+ 'goods/group/viewGoodsGroup',
                    addGoodsGroup: drugFirmsApiRoot + 'goods/group/addGoodsGroup',
                    updateGoodsGroup: drugFirmsApiRoot + 'goods/group/updateGoodsGroup',
                    deleteGoodsGroup: drugFirmsApiRoot + 'goods/group/deleteGoodsGroup',
                    getGoodsGroupList: drugFirmsApiRoot + 'goods/group/getGoodsGroupList',

                    //基础数据 - 查询有效的管理类别列表
                    getAvailManageTypeList: drugFirmsApiRoot + 'goods/managetype/getAvailManageTypeList',
                    //
                    getAvailBizTypeList: drugFirmsApiRoot + 'goods/biztype/getAvailBizTypeList',

                    throughTheGoods: drugFirmsApiRoot + 'goods/throughTheGoods',
                    enableTheGoods: drugFirmsApiRoot + 'goods/enableTheGoods',

                    rejectTheGoods: drugFirmsApiRoot + 'goods/rejectTheGoods',
                    viewGoods: drugFirmsApiRoot + 'goods/viewGoods',
                    updateGoods: drugFirmsApiRoot + 'goods/updateGoods',
                    //viewGoods:drugFirmsApiRoot+ 'goods/viewGoods',
                    deleteGoods: drugFirmsApiRoot + 'goods/deleteGoods',
                    disableTheGoods: drugFirmsApiRoot + 'goods/disableTheGoods',
                    getGoodsListByGroupId: drugFirmsApiRoot + 'goods/getGoodsListByGroupId',
                    batchImportGoodsList: drugFirmsApiRoot + 'goods/batchImportGoodsList',
                    //药理类别病种树
                    getPharmacologicalTree: drugFirmsApiRoot + 'goods/pharmacological/getPharmacologicalTree',
                    getWalletRechargePageList: drugFirmsApiRoot + 'wallet/getWalletRechargePageList',
                    walletRechargeApprove: drugFirmsApiRoot + 'wallet/walletRechargeApprove'
                },
                //病情跟踪
                designer:{
                    //获取病情问题库病种树
                    getDiseaseTypeFromStore:serverApiRoot+'designer/getDiseaseTypeFromStore',
                    //获取病情跟踪问题列表
                    getQuestionListFromStore:serverApiRoot+'designer/getQuestionListFromStore'

                },
                // 医患社区
                community: {
                    // 查询帖子列表
                    postQueryList: communityApiRoot + 'topic/query_list',
                    // 上移帖子
                    postMoveUp: communityApiRoot + 'topic/moveUp',
                    // 推荐帖子
                    postRecommend: communityApiRoot + 'topic/recommend',
                    // 查询置顶类型
                    queryTopList: communityApiRoot + 'dataCode/queryList',
                    // 置顶帖子
                    postTop: communityApiRoot + 'topic/top',
                    // 取消置顶
                    postUnTop: communityApiRoot + 'topic/unTop',
                    // 获取栏目列表
                    columns: communityApiRoot + 'column/columns',
                    // 获取所有栏目列表
                    allColumns: communityApiRoot + 'column/allColumns',
                    // 新建栏目
                    addColumn: communityApiRoot + 'column/addColumn',
                    // 栏目重命名
                    columnRename: communityApiRoot + 'column/rename',
                    // 栏目上移
                    columnUp: communityApiRoot + 'column/up',
                    // 停用或启用栏目
                    columnOnOrOff: communityApiRoot + 'column/onOrOff',
                    // 标记或取消标记栏目
                    columnMark: communityApiRoot + 'column/mark',
                    //获取Banner
                    bannerList: communityApiRoot + 'banner/queryPage',
                    //更新banner
                    editBanner:communityApiRoot + '/banner/update',
                    //上传Banner
                    updataBanner:communityApiRoot + 'banner/add',
                    //上移Banner
                    upBanner:communityApiRoot + '/banner/up',
                    //停用Banner/启用Banner
                    stopBanner:communityApiRoot + '/banner/enable',
                    //删除Banner
                    deletebanner: communityApiRoot + '/banner/delete',
                    querybanner:  communityApiRoot + ' banner/queryById',
                    //举报审核
                    checkAuditdel :  communityApiRoot + 'checkAudit/del',
                    checkAuditaudit :  communityApiRoot + 'checkAudit/audit',
                    checkAuditlist:  communityApiRoot + 'checkAudit/list',
                    //帖子审核
                    deltopicAudit : communityApiRoot + 'topicAudit/del',
                    audittopicAudit : communityApiRoot + 'topicAudit/audit',
                    topicAuditlist  : communityApiRoot + 'topicAudit/list',
                    //评论审核
                    replyAuditlist : communityApiRoot + 'replyAudit/list',
                    replyAuditdel :  communityApiRoot + 'replyAudit/del',
                    replyAuditaudit:  communityApiRoot + 'replyAudit/audit',
                    getWebTopicDetail : communityApiRoot + 'topic/getWebTopicDetail',


                    //获取认证用户
                    getAuthorList:communityApiRoot+'authUser/list',
                    //添加认证用户
                    addAuthor:communityApiRoot+'authUser/add',
                    //删除认证用户
                    deleteAuthor:communityApiRoot+'authUser/del',
                    //web端发表帖子
                    webPublish:communityApiRoot+'topic/webPublish',
                    //web端编辑帖子
                    webEdit:communityApiRoot+'topic/webEdit',
                    //获取帖子详情
                    getWebTopicDetail:communityApiRoot+'topic/getWebTopicDetail',
                    //获取web端发布的帖子列表
                    getWebTopicList:communityApiRoot+'topic/getWebTopicList',
                    //web端获取帖子信息（编辑时候用）
                    getWebTopicSimple:communityApiRoot+'topic/getWebTopicSimple',
                    //删除帖子
                    deletePost:communityApiRoot+'topic/delete',
                    //回复帖子
                    replyTopic:communityApiRoot+'reply/replyTopic',
                    //回复评论
                    replyUser:communityApiRoot+'reply/replyUser',
                    //获取评论
                    getReplyList:communityApiRoot+'reply/getReplyList',
                    //获取主评论详情
                    getFirstReplyDetail:communityApiRoot+'reply/getFirstReplyDetail',
                    //获取二级评论
                    getCommentList:communityApiRoot+'reply/getCommentList',
                }

            };
            app.lang = {
                datatables: {
                    translation: {
                        /*<div class="loading">
                         <i class="glyphicon glyphicon-repeat"></i>
                         </div>*/
                        "sLengthMenu": "每页 _MENU_ 条",
                        "sZeroRecords": "没有找到符合条件的数据",
                        "sProcessing": "<img style='position:fixed;top:30%;left:50%;z-index:10000;height:80px;border:1px solid #aaa;border-radius:6px;box-shadow:0 0 10px rgba(0,0,0,.5)' src=\"src/img/loading.gif\" />",
                        "sInfo": "当前第 _START_ - _END_ 条，共 _TOTAL_ 条",
                        "sInfoEmpty": "没有记录",
                        "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
                        "sSearch": "搜索",
                        "oPaginate": {
                            "sFirst": "<<",
                            "sPrevious": "<",
                            "sNext": ">",
                            "sLast": ">>"
                        }
                    }
                }
            }
        }
    ]).config(['$translateProvider',
    function($translateProvider) {
        // 注册一个静态文件加载器，模块会在指定的url中查找翻译词典
        // url结构为 [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: 'src/l10n/',
            suffix: '.js'
        });
        // 设置默认语言
        $translateProvider.preferredLanguage('en');
        // 存储默认语言(本地)
        $translateProvider.useLocalStorage();
    }
]).factory('authorityInterceptor', [function() {
    var authorityInterceptor = {
        response: function(response) {
            if ('no permission' == response.data) {
                app.controller('Interceptor', ['$state',
                    function($state) {
                        app.state.go('access.404');
                    }
                ]);
            }
            if ("1030102" == response.data.resultCode || "1030101" == response.data.resultCode) {
                app.state.go('access.signin');
            }
            return response;
        }
    };
    return authorityInterceptor;
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authorityInterceptor');
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data, true) : data;
    }];
}]);

(function() {
    angular.module('app').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})();
