'use strict';
/* Controllers */
(function(){
    angular.module('app').controller('AppCtrl',AppCtrl);
    AppCtrl.$inject=['$rootScope', '$scope', '$translate', '$localStorage', '$window', '$http', '$state', '$cookieStore', 'utils','$timeout'];
    function AppCtrl($rootScope, $scope, $translate, $localStorage, $window, $http, $state, $cookieStore, utils,$timeout){
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
        app.state = $state;
        // config
        $scope.app = {
            name: '玄关健康平台',
            version: '1.0.0',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 8,
                navbarHeaderColor: 'bg-black',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-black',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        }

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch('app.settings', function() {
            if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                $scope.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = $scope.app.settings;
        }, true);
        // angular translate
        $scope.lang = {
            isopen: false
        };
        $scope.langs = {
            //en: 'English',
            zh_CN: '中文（简体）'
        };
        $scope.userType = {
            type_1: '患者',
            type_2: '医助',
            type_3: '医生',
            type_4: '客服'
        };
        $scope.datas = {
            check_user_name: utils.localData('check_user_name') || ' ',
            check_user_type: utils.localData('check_user_type') || ' ',
            doctor_check: utils.localData('doctor_check') || 0,
            group_check: utils.localData('group_check') || 0,
            group_check_with_v: utils.localData('group_check_with_v') || 0,
            v_order_notexception: utils.localData('v_order_notexception') || 0,
            v_order_notall: utils.localData('v_order_notall') || 0,
            v_order_ingexception: utils.localData('v_order_ingexception') || 0,
            v_order_ingall: utils.localData('v_order_ingall') || 0,
            v_order_pass: utils.localData('v_order_pass') || 0,
            v_order_cancel: utils.localData('v_order_cancel') || 0,
            feedback_undo: utils.localData('feedback_undo') || 0,
            order_done: utils.localData('order_done') || 0,
            order_undo: utils.localData('order_undo') || 0,
        };

        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
        $scope.setLang = function(langKey, $event) {
            // set the current lang
            $scope.selectLang = $scope.langs[langKey];
            // You can change the language during runtime
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
        };

        // 设置默认语言为中文
        $scope.selectLang = $scope.langs['zh_CN'];
        $translate.use('zh_CN');
        $scope.app.ui = {};
        var uiInit = $scope.app.ui.init = function() {
            $http.get('src/api/nav_items').then(function(resp) {
                if (resp.data.datalist) {
                    $scope.app.ui.items = resp.data.datalist;
                };
            });
        };
        //uiInit();

        // 用户退出
        $scope.logout = function() {
            $http.get(app.url.logout + '?' + $.param({
                    access_token: app.url.access_token
                })).then(function(response) {
                if (response.statusText === 'OK') {
                    $cookieStore.remove('username');

                    // 清除某些与当前账号相关的数据
                    // localStorage.clear();
                    // utils.localData('doctor_check', null);

                    $state.go('access.signin');
                } else {
                    console.log("Logout: " + response.statusText);
                }
            }, function(x) {
                console.log("Logout: " + x.statusText);
            });
        };
        $scope.token= utils.localData('check_access_token');

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        //反馈轮询
        var feedbackUserMap={doctor:3,patient:1,company:10,doctor_bd:3,patient_bd:1,assistant:2,store:11}
            ,key_ts="feedback_ts_"
            ,key_token='feedback_token_'
            ;
        $scope.feedback={
            state:{},
            hasNew:false
        };
        //clearFeedbackCache('doctor');
        //clearFeedbackCache('patient');
        //clearFeedbackCache('company');
        function clearFeedbackCache(type){
            utils.localData(key_token+type,null);
            utils.localData(key_ts+type,null);
        }
        $scope.feedbackPolling=function(){
            if(feedPollingTimer){
                $timeout.cancel(feedPollingTimer);
            }
            if(!$state.includes('app.operate.feedback'))return;
            //feedPollingTimer =$timeout($scope.feedbackPolling,10000);
            pullType('doctor');
            pullType('company');
            pullType('patient');
            pullType('doctor_bd');
            pullType('patient_bd');
            pullType('assistant');
            pullType('store');
        }
        //pullType('doctor');
        //pullType('company');
        //pullType('patient');
        $scope.loginFeedback= function () {
            if(!utils.localData('check_user_id'))return;
            loginType('doctor');
            loginType('company');
            loginType('patient');
            loginType('doctor_bd');
            loginType('patient_bd');
            loginType('assistant');
            loginType('store');
        }

        $scope.loginFeedback();   // 接口访问报错(#405)，暂注释掉(2016/6/6)

        function pullType(type){
            var tk=utils.localData(key_token+type);
            if(!tk){
                loginType(type);
            }else{
                $http({
                    url: app.url.feedback.polling,
                    method: 'post',
                    headers: {'access-token': tk,},
                    data: {ts_msg:utils.localData(key_ts+type)}
                }).then(function(res){
                    var d=res.data;
                    if(d.resultCode === 1){
                        $scope.feedback.state[type]=d.data.hasNewMsg;
                        checkFeedbackState();
                        if(d.data.hasNewMsg===1){
                            $scope.$broadcast("feedback_new_msg",type);
                        }
                    }else{
                        if(d.resultCode===30000){
                            $timeout(function () {
                                loginType(type);
                            },40000)
                        }
                    }
                });
            }
        }
        function clearWsInterval(type){
            if(feedWsInterval[type]){
                clearInterval(feedWsInterval[type]);
                delete feedWsInterval[type];
            }
        }
        function wsType(type) {
            var oldWs = feedWebSockets[type],
                tk = utils.localData(key_token + type),
                //url=imRoot.replace("http://","ws://") +"websocket?access_token="+tk;
                url=imWsRoot +"websocket?access_token="+tk;
            if (oldWs)oldWs.close();
            try{
                var ws = new WebSocket(url);
                feedWebSockets[type]=ws;
                ws.onopen= function (e) {
                    //console.log("web socket open:",e);
                    if(!feedWsInterval[type])feedWsInterval[type]=setInterval(function(){
                        ws.send("ping");
                    },40000);
                }
                ws.onmessage= function (msg) {
                    var obj=JSON.parse(msg.data);
                    if(obj.cmd=="message"){
                        $scope.$apply(function(){
                            $scope.feedback.state[type]=1;
                            checkFeedbackState();
                        });
                        $scope.$broadcast("feedback_new_msg",type);
                    }
                }
                ws.onerror=function(e){
                    //console.log("web socket err:",e);
                }
                ws.onclose=function(e){
                    //console.log("web socket close:",e);
                    clearWsInterval(type);
                    if(e.code==1006)return;
                    wsType(type);
                }
            }catch (e){
                console.warn(e.message);
            }
        }
        function loginType(type){
            var url= type=="store"?app.url.drugLogin:app.url.login;
            $http.post(url, {
                telephone: getLoginPhone(type), //13751132072   '18620366451':'13751132072'
                password: '123456',
                userType: feedbackUserMap[type]
            }).then(function(response){
                if(response.data.resultCode === 1){
                    console.log("反馈登录成功"+type);
                    utils.localData(key_token+type,response.data.data.access_token);
                    pullType(type);
                    wsType(type);
                }else{
                    console.log("反馈登录失败"+type+":"+response.data.resultMsg);
                    utils.localData(key_token+type,null);
                }
            },function(x){
                utils.localData(key_token+type,null);
            });
        }
        function getLoginPhone(type){
            if(type=="doctor_bd"||type=="patient_bd"){
                return "10000000002"
            }
            return "10000000001"
        }
        function  checkFeedbackState(){
            if($state.includes('app.operate.feedback'))
                return;
            var s=$scope.feedback.state;
            if(s['doctor']||s['patient']||s['company']){
                $scope.feedback.hasNew=true;
            }else {
                $scope.feedback.hasNew=false;
            }
        }
        //$scope.feedbackPolling();

        //是否在导航栏显示短信模板的入口。
        function checkHost(){
            var hostname=location.hostname;
            if(hostname==='192.168.3.7'||hostname==='120.24.94.126'||hostname=='localhost'||hostname==='test.mediportal.com.cn'){
                return true;
            }
            else{
                return false;
            }
        }
        $scope.isShowMsg=checkHost();
    }
    var feedPollingTimer;
    var feedWebSockets=[],feedWsInterval=[];
})()
// angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$translate', '$localStorage', '$window', '$http', '$state', '$cookieStore', 'utils','$timeout',
//     function($rootScope, $scope, $translate, $localStorage, $window, $http, $state, $cookieStore, utils,$timeout) {
//
//         // add 'ie' classes to html
//         var isIE = !!navigator.userAgent.match(/MSIE/i);
//         isIE && angular.element($window.document.body).addClass('ie');
//         isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
//         app.state = $state;
//         // config
//         $scope.app = {
//             name: '玄关健康平台',
//             version: '1.0.0',
//             // for chart colors
//             color: {
//                 primary: '#7266ba',
//                 info: '#23b7e5',
//                 success: '#27c24c',
//                 warning: '#fad733',
//                 danger: '#f05050',
//                 light: '#e8eff0',
//                 dark: '#3a3f51',
//                 black: '#1c2b36'
//             },
//             settings: {
//                 themeID: 8,
//                 navbarHeaderColor: 'bg-black',
//                 navbarCollapseColor: 'bg-white-only',
//                 asideColor: 'bg-black',
//                 headerFixed: true,
//                 asideFixed: false,
//                 asideFolded: false,
//                 asideDock: false,
//                 container: false
//             }
//         }
//
//         // save settings to local storage
//         if (angular.isDefined($localStorage.settings)) {
//             $scope.app.settings = $localStorage.settings;
//         } else {
//             $localStorage.settings = $scope.app.settings;
//         }
//         $scope.$watch('app.settings', function() {
//             if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
//                 // aside dock and fixed must set the header fixed.
//                 $scope.app.settings.headerFixed = true;
//             }
//             // save to local storage
//             $localStorage.settings = $scope.app.settings;
//         }, true);
//         // angular translate
//         $scope.lang = {
//             isopen: false
//         };
//         $scope.langs = {
//             //en: 'English',
//             zh_CN: '中文（简体）'
//         };
//         $scope.userType = {
//             type_1: '患者',
//             type_2: '医助',
//             type_3: '医生',
//             type_4: '客服'
//         };
//         $scope.datas = {
//             check_user_name: utils.localData('check_user_name') || ' ',
//             check_user_type: utils.localData('check_user_type') || ' ',
//             doctor_check: utils.localData('doctor_check') || 0,
//             group_check: utils.localData('group_check') || 0,
//             group_check_with_v: utils.localData('group_check_with_v') || 0,
//             v_order_notexception: utils.localData('v_order_notexception') || 0,
//             v_order_notall: utils.localData('v_order_notall') || 0,
//             v_order_ingexception: utils.localData('v_order_ingexception') || 0,
//             v_order_ingall: utils.localData('v_order_ingall') || 0,
//             v_order_pass: utils.localData('v_order_pass') || 0,
//             v_order_cancel: utils.localData('v_order_cancel') || 0,
//             feedback_undo: utils.localData('feedback_undo') || 0,
//             order_done: utils.localData('order_done') || 0,
//             order_undo: utils.localData('order_undo') || 0,
//         };
//
//         $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
//         $scope.setLang = function(langKey, $event) {
//             // set the current lang
//             $scope.selectLang = $scope.langs[langKey];
//             // You can change the language during runtime
//             $translate.use(langKey);
//             $scope.lang.isopen = !$scope.lang.isopen;
//         };
//
//         // 设置默认语言为中文
//         $scope.selectLang = $scope.langs['zh_CN'];
//         $translate.use('zh_CN');
//         $scope.app.ui = {};
//         var uiInit = $scope.app.ui.init = function() {
//             $http.get('src/api/nav_items').then(function(resp) {
//                 if (resp.data.datalist) {
//                     $scope.app.ui.items = resp.data.datalist;
//                 };
//             });
//         };
//         //uiInit();
//
//         // 用户退出
//         $scope.logout = function() {
//             $http.get(app.url.logout + '?' + $.param({
//                 access_token: app.url.access_token
//             })).then(function(response) {
//                 if (response.statusText === 'OK') {
//                     $cookieStore.remove('username');
//
//                     // 清除某些与当前账号相关的数据
//                     // localStorage.clear();
//                     // utils.localData('doctor_check', null);
//
//                     $state.go('access.signin');
//                 } else {
//                     console.log("Logout: " + response.statusText);
//                 }
//             }, function(x) {
//                 console.log("Logout: " + x.statusText);
//             });
//         };
//         $scope.token= utils.localData('check_access_token');
//
//         function isSmartDevice($window) {
//             // Adapted from http://www.detectmobilebrowsers.com
//             var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
//             // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
//             return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
//         }
//
//         //反馈轮询
//         var feedbackUserMap={doctor:3,patient:1,company:10,doctor_bd:3,patient_bd:1,assistant:2}
//             ,key_ts="feedback_ts_"
//             ,key_token='feedback_token_'
//             ;
//         $scope.feedback={
//             state:{},
//             hasNew:false
//         };
//         //clearFeedbackCache('doctor');
//         //clearFeedbackCache('patient');
//         //clearFeedbackCache('company');
//         function clearFeedbackCache(type){
//             utils.localData(key_token+type,null);
//             utils.localData(key_ts+type,null);
//         }
//         $scope.feedbackPolling=function(){
//             if(feedPollingTimer){
//                 $timeout.cancel(feedPollingTimer);
//             }
//             if(!$state.includes('app.operate.feedback'))return;
//             //feedPollingTimer =$timeout($scope.feedbackPolling,10000);
//             pullType('doctor');
//             pullType('company');
//             pullType('patient');
//             pullType('doctor_bd');
//             pullType('patient_bd');
//             pullType('assistant');
//         }
//         //pullType('doctor');
//         //pullType('company');
//         //pullType('patient');
//         $scope.loginFeedback= function () {
//             if(!utils.localData('check_user_id'))return;
//             loginType('doctor');
//             loginType('company');
//             loginType('patient');
//             loginType('doctor_bd');
//             loginType('patient_bd');
//             loginType('assistant');
//         }
//
//         $scope.loginFeedback();   // 接口访问报错(#405)，暂注释掉(2016/6/6)
//
//         function pullType(type){
//             var tk=utils.localData(key_token+type);
//             if(!tk){
//                 loginType(type);
//             }else{
//                 $http({
//                     url: app.url.feedback.polling,
//                     method: 'post',
//                     headers: {'access-token': tk,},
//                     data: {ts_msg:utils.localData(key_ts+type)}
//                 }).then(function(res){
//                     var d=res.data;
//                     if(d.resultCode === 1){
//                         $scope.feedback.state[type]=d.data.hasNewMsg;
//                         checkFeedbackState();
//                         if(d.data.hasNewMsg===1){
//                             $scope.$broadcast("feedback_new_msg",type);
//                         }
//                     }else{
//                         if(d.resultCode===30000){
//                             $timeout(function () {
//                                 loginType(type);
//                             },40000)
//                         }
//                     }
//                 });
//             }
//         }
//         function clearWsInterval(type){
//             if(feedWsInterval[type]){
//                 clearInterval(feedWsInterval[type]);
//                 delete feedWsInterval[type];
//             }
//         }
//         function wsType(type) {
//             var oldWs = feedWebSockets[type],
//                 tk = utils.localData(key_token + type),
//                 //url=imRoot.replace("http://","ws://") +"websocket?access_token="+tk;
//                 url=imWsRoot +"websocket?access_token="+tk;
//             if (oldWs)oldWs.close();
//             try{
//                 var ws = new WebSocket(url);
//                 feedWebSockets[type]=ws;
//                 ws.onopen= function (e) {
//                     //console.log("web socket open:",e);
//                     if(!feedWsInterval[type])feedWsInterval[type]=setInterval(function(){
//                         ws.send("ping");
//                     },40000);
//                 }
//                 ws.onmessage= function (msg) {
//                     var obj=JSON.parse(msg.data);
//                     if(obj.cmd=="message"){
//                         $scope.$apply(function(){
//                             $scope.feedback.state[type]=1;
//                             checkFeedbackState();
//                         });
//                         $scope.$broadcast("feedback_new_msg",type);
//                     }
//                 }
//                 ws.onerror=function(e){
//                     //console.log("web socket err:",e);
//                 }
//                 ws.onclose=function(e){
//                     //console.log("web socket close:",e);
//                     clearWsInterval(type);
//                     if(e.code==1006)return;
//                     wsType(type);
//                 }
//             }catch (e){
//                 console.warn(e.message);
//             }
//         }
//         function loginType(type){
//             $http.post(app.url.login, {
//                 telephone: getLoginPhone(type), //13751132072   '18620366451':'13751132072'
//                 password: '123456',
//                 userType: feedbackUserMap[type]
//             }).then(function(response){
//                 if(response.data.resultCode === 1){
//                     console.log("反馈登录成功"+type);
//                     utils.localData(key_token+type,response.data.data.access_token);
//                     pullType(type);
//                     wsType(type);
//                 }else{
//                     console.log("反馈登录失败"+type+":"+response.data.resultMsg);
//                     utils.localData(key_token+type,null);
//                 }
//             },function(x){
//                 utils.localData(key_token+type,null);
//             });
//         }
//         function getLoginPhone(type){
//             if(type=="doctor_bd"||type=="patient_bd"){
//                 return "10000000002"
//             }
//             return "10000000001"
//         }
//         function  checkFeedbackState(){
//             if($state.includes('app.operate.feedback'))
//                 return;
//             var s=$scope.feedback.state;
//             if(s['doctor']||s['patient']||s['company']){
//                 $scope.feedback.hasNew=true;
//             }else {
//                 $scope.feedback.hasNew=false;
//             }
//         }
//         //$scope.feedbackPolling();
//
//         //是否在导航栏显示短信模板的入口。
//         function checkHost(){
//             var hostname=location.hostname;
//             if(hostname==='192.168.3.7'||hostname==='120.24.94.126'||hostname=='localhost'){
//                 return true;
//             }
//             else{
//                 return false;
//             }
//         }
//         $scope.isShowMsg=checkHost();
//     }
// ]);
// var feedPollingTimer;
// var feedWebSockets=[],feedWsInterval=[];