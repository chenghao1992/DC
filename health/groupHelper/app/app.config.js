'use strict';
//=======================================App配置==========================================
(function() {
    var upLoad = '/upload/';
    var imApiRoot = window.imApiRoot || '/';
    var constants = {
        api: {
            shared: {
                // 登录
                signin: serverApiRoot + 'user/login',
                // 登出
                signOut: serverApiRoot + 'user/logout',
                // 获取备注
                getRemarks: serverApiRoot + 'user/getRemarks',
                // 修改备注
                setRemarks: serverApiRoot + 'user/setRemarks',

                // 获取日程
                getSchedules: serverApiRoot + 'pack/orderExpand/getSchedule',

                // 日程记录列表
                scheduleTime: serverApiRoot + 'pack/orderExpand/scheduleTime',
                // 获取全部的病种树
                getDiseaseTree: serverApiRoot + 'base/getDiseaseTree',
                // 根据父节点获取病种
                getDisease: serverApiRoot + 'base/getDisease',
                // 当天日程详情
                scheduleDetail: serverApiRoot + 'pack/orderExpand/scheduleDetail',

                // 基础数据 - 获取所有科室
                getAllDepts: serverApiRoot + 'base/getAllDepts',

                //根据当前查询日期，当天之后尚未进行服务的订单数量
                getNoService: serverApiRoot + 'pack/orderExpand/getNoService',

                //发送验证码
                sendRanCode: serverApiRoot + 'user/sendRanCode',

                //验证验证码
                verifyResetPassword: serverApiRoot + 'user/verifyResetPassword',

                //重置密码
                resetPassword: serverApiRoot + 'user/resetPassword',

                //更新密码
                updatePassword: serverApiRoot + 'user/updatePassword'
            },

            doctor: {
                // 获取个人信息
                getIntro: serverApiRoot + 'doctor/getIntro',
                // 获取个人简介
                basicInfo: serverApiRoot + 'doctor/basicInfo',
                // 获取医生信息－－导医
                doctorInfo: serverApiRoot + 'guide/doctorInfo',
                // 添加医生预约时间
                addDocTime: serverApiRoot + 'guide/addDocTime',
                // 删除医生预约时间
                removeDocTime: serverApiRoot + 'guide/removeDocTime',
                // 医生集团搜索 - 根据病种搜索医生
                findDoctorByDiseaseType: serverApiRoot + 'groupSearch/findDoctorByDiseaseType',
                // 医生集团搜索 - 根据科室搜索医生
                findDoctorByDept: serverApiRoot + 'groupSearch/findDoctorByDept',

                // 专长 - 检查建议
                getCheckSuggest: serverApiRoot + 'base/getCheckSuggest',

                // 诊疗记录 - 诊疗记录修改
                updateCurrecord: serverApiRoot + 'cureRecord/updateCurrecord',

                // 诊疗记录 - 诊疗记录创建
                createCurrecord: serverApiRoot + 'cureRecord/createCurrecord',

                //根据所在市，所在医院，所在科室来筛选医生
                findDoctors: serverApiRoot + 'guide/findDoctorsForWeb',

                //导医为医生添加备注
                addDocRemark: serverApiRoot + 'guide/addDocRemark',

                //通过关键字查找医生（模糊查找）
                findDoctorsFromKeyWord: serverApiRoot + 'guide/findDoctorsFromKeyWord'
            },

            guider: {
                // 咨询订单（导医） - 确定
                confirm: serverApiRoot + 'guide/confirm',

                // 咨询订单（导医） - 导医会话---查看病情详情
                findOrderDiseaseAndRemark: serverApiRoot + 'guide/findOrderDiseaseAndRemark'
            },

            order: {

                // 获取等待接单列表
                waitOrderList: serverApiRoot + 'guide/waitOrderList',

                // 导医接单
                getOrder: serverApiRoot + 'guide/receive',

                // 获取服务中的会话
                chartLists: serverApiRoot + 'guide/groupList',

                // 结束服务
                closeOrder: serverApiRoot + 'guide/endService',

                // 获取病情详情
                getOrderDisease: serverApiRoot + 'guide/orderDisease',

                // 拨打电话
                callByTel: serverApiRoot + 'voip/callByTel',

                // 发送医生预约时间
                appointTime: serverApiRoot + 'guide/appointTime',

                // 历史接单记录（导医端）
                orderList: serverApiRoot + 'guide/orderList',

                // 获取订单备注
                getOrderRemarks: serverApiRoot + 'pack/order/getRemarks',

                // 修改订单备注
                setRemarks: serverApiRoot + 'pack/order/setRemarks',

                // 服务套餐 - 查询套餐
                query: serverApiRoot + 'pack/pack/query',

                // 咨询订单（导医） - 我的订单
                getOrders: serverApiRoot + 'guide/getOrders',

                // 诊疗记录 - 根据患者和医生查找诊疗记录
                findByPatientAndDoctor: serverApiRoot + 'cureRecord/findByPatientAndDoctor',

                // 诊疗记录 - 根据订单查找诊疗记录
                findByOrder: serverApiRoot + 'cureRecord/findByOrder',

                // 订单-会话 - 预约时间
                changeAppointTime: serverApiRoot + 'orderSession/appointTime',

                //指令类型-----type=1:联系不上医生；type=2：医生没时间；type=3：通知已有推荐医生
                sendCardEvent: serverApiRoot + 'guide/sendCardEvent',

                //导医，预约的医生列表接口，状态（未预约，待支付）
                getConsultOrderDoctorList: serverApiRoot + 'guide/getConsultOrderDoctorList',

                //查看病情详情（将患者备注与患者信息合二为一）
                findOrderDiseaseAndRemark: serverApiRoot + 'guide/findOrderDiseaseAndRemark',

                //患者病情资料维护
                modifyPatientInfo: serverApiRoot + 'pack/order/modifyOrder',

                //获取患者发送的IM图片
                getDialogueImg: serverApiRoot + 'guide/getDialogueImg',

                //获取待处理订单
                getGuideNoServiceOrder: serverApiRoot + 'guide/getGuideNoServiceOrder',

                //获取已处理订单
                getGuideAlreadyServicedOrder: serverApiRoot + 'guide/getGuideAlreadyServicedOrder',

                //获取咨询记录通话录音
                getVoiceByOrderId: serverApiRoot + 'cureRecord/getVoiceByOrderId'
            },

            im: {
                // 获取会话消息
                //getMsgList: imApiRoot + 'msg/msgList',
                getMsgList: window.imRoot + 'msg/msgList.action',

                // 发送消息
                //sendMsg:imApiRoot+ 'msg/send',
                sendMsg: window.imRoot + 'convers/send.action',

                // 快捷回复列表
                getQuickReplyList: serverApiRoot + 'pack/fastandReply/getFastandReply',

                // 更新快捷回复
                updateQuickReply: serverApiRoot + 'pack/fastandReply/updateFastandReply',

                // 添加快捷回复
                addQuickReply: serverApiRoot + 'pack/fastandReply/addFastandReply',

                // 删除快捷回复
                removeQuickReply: serverApiRoot + 'pack/fastandReply/deleteFastandReply',

            },

            conference: {
                // 创建电话会议
                createConference: serverApiRoot + 'conference/createConference',

                // 电话会议 - 轮询获取状态
                conferenceGetStatus: serverApiRoot + 'conference/getStatus',

                // 电话会议 - 解散会议
                dismissConference: serverApiRoot + 'conference/dismissConference',

                // 电话会议 - 禁听
                deafConference: serverApiRoot + 'conference/deafConference',

                // 电话会议 - 取消禁听
                unDeafConference: serverApiRoot + 'conference/unDeafConference',

                // 电话会议 - 邀请加入
                inviteMember: serverApiRoot + 'conference/inviteMember',

                // 电话会议 - 退出会议即移出与会者
                removeConference: serverApiRoot + 'conference/removeConference',
            },

            upLoad: {

                // 通用文件上传
                commonUploadServlet: upLoad + 'CommonUploadServlet'
            },

            care: {
                //导医接关怀计划订单
                receiveCareOrder: serverApiRoot + 'guide/receiveCareOrder',

                //查询正在处理中的订单
                getHandleCareOrder: serverApiRoot + 'guide/getHandleCareOrder',

                //标记求助或告警处理完成
                updateCareOrder: serverApiRoot + 'guide/updateCareOrder',

                //获取医生团队
                getDoctorTeam: serverApiRoot + 'guide/getDoctorTeam',

                //获取等待接单列表
                heathWaitOrderList: serverApiRoot + 'guide/heathWaitOrderList',

                //关怀订单详情
                getCareOrderDetail: serverApiRoot + 'guide/getCareOrderDetail',
            },
            outLine: {
                //查询待处理的预约订单
                getAppointmentOrders: serverApiRoot + 'guide/getAppointmentOrders',
                //查看预约订单详情
                getAppointmentDetail: serverApiRoot + 'guide/getAppointmentDetail',
                //提交订单
                submitAppointmentOrder: serverApiRoot + 'guide/submitAppointmentOrder',
                //获取医院列表
                getGroupHospital: serverApiRoot + 'guide/getGroupHospital',
                //根据主键id查找集团id
                getById: serverApiRoot + 'serviceCate/getById',
                // 获取已预约的线下订单
                getAppointmentPaidOrders: serverApiRoot + 'guide/getAppointmentPaidOrders',
                //订单详情
                orderDetail: serverApiRoot + 'pack/order/orderDetail',
                //搜索
                searchAppointmentOrderByKeyword: serverApiRoot + 'guide/searchAppointmentOrderByKeyword',
                //取消订单
                cancelOrder: serverApiRoot + 'pack/order/cancel',
                // 结束服务
                finishService: serverApiRoot + 'orderSession/finishService',
                //开始服务
                beginService: serverApiRoot + 'orderSession/beginService',
                // 按照条件多条件查询搜索订单 - CQY
                getAppointmentListByCondition: serverApiRoot + 'guide/getAppointmentListByCondition',
                // 获取当前时间段每一天是否有预约的结果列表
                getHaveAppointmentListByDate: serverApiRoot + 'guide/getHaveAppointmentListByDate',
                // 获取某一天的有支付预的约订单医生列表
                doctorOfflinesByDate: serverApiRoot + 'guide/doctorOfflinesByDate',
                // 修改名医面对面订单备注
                updateRemark: serverApiRoot + 'pack/order/updateRemark',
                // 查询医生某一天值班的被患者预约情况 按照早中晚分组
                getPatientAppointmentByCondition: serverApiRoot + 'guide/getPatientAppointmentByCondition',
                // 导医修改预约时间
                changeAppointmentTime: serverApiRoot + 'guide/changeAppointmentTime',
                // 查找医生(Web端) 根据搜索框输入的参数值查询博得的医生信息
                findDoctorsFromKeyWord:serverApiRoot+'guide/findDoctorsFromKeyWord',
                //获取医生某一天的排班列表
                getDoctorOneDayOffline:serverApiRoot+'guide/getDoctorOneDayOffline',
                //获取医生在某一时间段是否可预约
                isTimeToAppointment:serverApiRoot+'guide/isTimeToAppointment',
                //根据手机号码获取患者列表
                getPatientsByTelephone:serverApiRoot+'patient/getPatientsByTelephone',
                //医生助手帮患者预约名医面对面订单
                takeAppointmentOrder:serverApiRoot+'guide/takeAppointmentOrder',
                //根据单子病历id获取病历基础数据项
                getIllcaseBaseContentById:serverApiRoot+'illcase/getIllcaseBaseContentById',
                // 修改电子病历信息 或者 新增就医资料
                saveIllCaseTypeContent:serverApiRoot+'illcase/saveIllCaseTypeContent',
            },
            scheduling: {
                // 排班（博德嘉联） - 获取医院列表
                getHospitalList: serverApiRoot + 'doctorSchedule/getHospitalList',
                // 排班（博德嘉联） - 获取医生列表
                getDoctorList: serverApiRoot + 'doctorSchedule/getDoctorList',
                // 排班（博德嘉联） - 删除医生排班信息
                deleteOffline: serverApiRoot + 'doctorSchedule/deleteOffline',
                // 排班（博德嘉联） - 判断医生该时间段是否有被患者预约
                hasAppointment: serverApiRoot + 'doctorSchedule/hasAppointment',
                // 排班（博德嘉联） - 医生在某个时间段内的所有排班信息
                queryDoctorPeriodOfflines: serverApiRoot + 'doctorSchedule/queryDoctorPeriodOfflines',
                // 排班（博德嘉联） - 查询医生排班信息
                getOfflinesForWeb: serverApiRoot + 'doctorSchedule/getOfflinesForWeb',
                // 排班（博德嘉联） - 增加医生排班信息
                addOffline: serverApiRoot + 'doctorSchedule/addOffline'
            },
            substance: {
                // 获取医院列表
                getGroupHospital: serverApiRoot + 'guide/getGroupHospital',
                // 设置医院列表
                setGroupHospital: serverApiRoot + 'guide/setGroupHospital'
            }

        },
        access_token: localStorage.getItem('groupHelper_access_token') || null

    };

    function run($rootScope, $state, $stateParams, editableOptions, $http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        // $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // $http.defaults.headers.post['Web-Agent'] = 'Guider_BDJL/0/PC';
    }

    function config($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

        // $httpProvider.defaults.withCredentials = true;

        //=================================http请求配置========================================
        $httpProvider.defaults.transformRequest = function(obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        };
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Web-Agent': 'Guider_BDJL/0/PC'
        };

        $httpProvider.interceptors.push('authorityInterceptor');
    }

    function authorityInterceptor() {

        var authorityInterceptor = {
            response: function(response) {
                // console.log(response);
                if (response.resultCode === 1030102 || response.resultCode === 1030101 || response.data.resultCode === 1030102 || response.data.resultCode === 1030101) {
                    window.location.href = '#/signin';
                }
                if ('no permission' == response.data) {
                    app.controller('Interceptor', ['$state',
                        function($state) {
                            app.state.go('access.404');
                        }
                    ]);
                }
                if ("no login" == response.data) {
                    app.state.go('access.signin');
                }
                return response;
            }
        };
        return authorityInterceptor;
    };

    angular
        .module('app', [
            'ui.router',
            'ngTouch',
            'ui.bootstrap',
            'ngAnimate',
            'angularFileUpload',
            'xeditable',
            'angularMoment',
            'toaster',
            'treeControl',
            'smart-table',
            'bootstrapLightbox',
            'ngAudio',
            'oc.lazyLoad',
            'ui.select'
        ])
        .run(run)
        .factory('authorityInterceptor', authorityInterceptor)
        .config(config)
        .constant('constants', constants);

    window.app = angular.module('app');

})();
