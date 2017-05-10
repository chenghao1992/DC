'use strict';
(function() {

angular.module('app').controller('FeedBack', FeedBack);
FeedBack.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$http', 'utils', '$stateParams','$filter','$sce','Lightbox','$location','ngAudio','toaster','constants'];
function FeedBack($rootScope, $scope, $state, $timeout, $http, utils, $stateParams,$filter,$sce,Lightbox,$location,ngAudio,toaster,constants) {

    $scope.feedback.hasNew=false;
    //$scope.feedbackPolling();
    if(!$stateParams.type){
        $state.go("^.feedback",{type:'doctor'});
        return;
        //$stateParams.type='doctor';
    }

    // 滚动到底部
    $scope.goBottom = function() {
        if (!$state.is('app.operate.feedback'))
            return;
        $location.hash($scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
    };

    //var user = JSON.parse(localStorage['check_user']);
    var user = JSON.parse(localStorage['check_user']);
    $scope.user = user;
    // 设置轮询时间
    var refreshStep = 10000;
    getChatPeopleListPulling();
    var getChatPeopleListTimer = null;

    function getChatPeopleListPulling() {
        $scope.feedback.state[$stateParams.type]=0;
        getChatPeopleListDB();

        if (getChatPeopleListTimer)
            $timeout.cancel(getChatPeopleListTimer);

        // 离开此页退出轮询
        //if (!$state.is('app.operate.feedback'))
        //    return;
        //getChatPeopleListTimer = $timeout(getChatPeopleListPulling, refreshStep);
    }

    // 获取数据
    function getChatPeopleListDB(isUpdateWindowData) {

        $scope.chatPeopleListIsLoading = true;

        var localDB = null;
        var ts = 0;

        if ($scope.chatPeopleListData) {
            localDB = $scope.chatPeopleListData;
            ts = localDB.ts;
        }

        var param = {
            //access_token: localStorage['guider_access_token'],
            //userId: user.id,
            //newData: 1,
            ts: ts
        }

        $http({
            url: app.url.feedback.groupList,
            method: 'post',
            headers: {'access-token': utils.localData('feedback_token_'+$stateParams.type)},
            data: param
        }).then(thenFc)

        function thenFc(response) {
            $scope.chatPeopleListIsLoading = false;
            if(response.data.resultCode!==1)return;
            var d=response.data.data;
            var newData = null;

            // 有更新数据则更新本地数据
            if (d && d.list) {
                utils.localData("feedback_ts_"+$stateParams.type, d.ts);
                //var list= d.list;
                var list= filterChat(d.list);
                if (list.length > 0) {
                    if (localDB) {
                        newData = updateChatPeopleList(list, localDB.list);
                    } else {
                        newData = list;
                    }
                    localDB = {
                        ts: d.ts,
                        list: newData
                    }
                    $scope.chatPeopleListData = localDB;
                }
            }

            if (isUpdateWindowData) {
                $scope.chatPeopleListItemClick($scope.chatPeopleListData.list[0]);
            };

            if (!$scope.windowTarget && localDB && localDB.list) {
                if (localDB.list.length > 0) {
                    $scope.chatPeopleListItemClick(localDB.list[0]);
                };
            };

        }
    }
    function filterChat(list){
        var nList=[];
        for (var i = 0; i < list.length; i++){
            if(/^pub_(\w*)_admin$/.test(list[i].bizType)){
                nList.push(list[i])
            }
        }
        return nList;
    }

    // 合并 对话列表数据库数据，返回合并后的数据
    function updateChatPeopleList(newData, oldData) {

        for (var i = 0; i < newData.length; i++) {
            if ($scope.windowDataListDB && newData[i].groupId == $scope.windowDataListDB.gid) {
                newData[i].unreadCount=0;
                getWindowData(newData[i].groupId, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId)
            }

            for (var j = oldData.length-1; j >=0; j--) {

                if (newData[i].groupId == oldData[j].groupId) {
                    //newData[i].unread = oldData[j].unread + newData[i].unread;
                    oldData.splice(j, 1);
                    break;
                }
            }
        }
        return newData.concat(oldData);

    };

    // 时间格式化
    $scope.formatDate = function(value) {

        var today = new Date().getTime();
        var timeStep = (today - value) / 1000 / 60 / 60 / 24;

        if (timeStep >= 0 && timeStep < 1) {
            return $filter('date')(new Date(value), 'H:mm:ss');
        }

        if (timeStep >= 1 && timeStep <= 2) {
            return '昨天';
        }

        if (timeStep > 2) {
            return $filter('date')(new Date(value), 'yyyy/MM/dd');
        }

    };

    // 点击会话人
    $scope.chatPeopleListItemClick = function(item) {
        //if($scope.windowTarget && item && item.gid==$scope.windowTarget.windowId){
        //    return;
        //}
        $scope.currentOrderItem=item;//用于当前正在接单项高亮

        $scope.$broadcast("clearEdit");
        var localDB = $scope.chatPeopleListData;

        for (var i = 0; i < localDB.list.length; i++) {
            if (item.groupId == localDB.list[i].groupId) {
                localDB.list[i].unreadCount = 0;
                break;
            }
        }

        $scope.chatPeopleListData = localDB;
        // 生成会话对象信息
        if (item) {
            var tempId;
            if(item.groupUsers)
                for (var i = 0; i < item.groupUsers.length; i++) {
                    if (item.groupUsers[i].role==4) {
                        tempId=item.groupUsers[i].id;
                        break;
                    }
                }
            $scope.windowTarget = {
                name: item.name,
                id: tempId,
                pic: item.gpic,
                bizStatus: item.bizStatus,
                windowId: item.groupId,
            }
        } else {
            $scope.windowTarget = {};
        }
        $scope.windowTarget.user={};

        //获取会话对象信息 todo
        $scope.getTargetInfo($scope.windowTarget.id);

        // 更新会话
        $scope.windowDataListDB = null;
        $scope.windowBussiness = null;

        if (item && item.groupId) {
            getWindowData(item.groupId);
            //$scope.getPatientInfo(item.groupId);
            $scope.showDiseaseInfoTab = true;
        } else {
            //右侧栏病情资料隐藏
            $scope.showDiseaseInfoTab = false;
        }

        // 关闭工具箱
        if ($scope.closePop)
            $scope.closePop();

    }

    // 放大图片
    $scope.openLightboxModal = function(item, index) {
        var modalInstance = Lightbox.openModal(item, index);

    };

    /////////////////// 会话内容 /////////////////

    // 获取会话内容-轮询
    //getWindowDataPulling();
    var getWindowDataTimer = null;
    function getWindowDataPulling() {

        if ($scope.windowDataListDB && $scope.windowDataListDB.list) {
            if ($scope.windowDataListDB.list.length > 0) {
                if ($scope.windowTarget) {
                    if ($scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                        $scope.windowDataListDB.gid = $scope.windowTarget.windowId;
                    getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
                };
            }

        }

        // 保持只有一个计时器
        if (getWindowDataTimer)
            $timeout.cancel(getWindowDataTimer);

        // 离开此页退出轮询
        if (!$state.is('order.home'))
            return;

        getWindowDataTimer = $timeout(getWindowDataPulling, refreshStep);
    };

    // 获取会话内容
    function getWindowData(gid, type, msgId) {
        $scope.windowIsLoading = true;

        var param = {
            //userId: user.id,
            groupId: gid,
            cnt: 20
        }


        // 第一次获取
        //if (type && msgId) {
        if (msgId) {
            param.type = type;
            param.msgId = msgId;
        }

        $http({
            url: app.url.feedback.msgList,
            method: 'post',
            headers: {'access-token': utils.localData('feedback_token_'+$stateParams.type),},
            data: param
        }).then(thenFc)

        function thenFc(res) {
            if(res.data.resultCode!==1)return;
            var response=res.data.data;
            //$scope.getConsultDoctorList(gid);
            $scope.windowIsLoading = false;
            $scope.isNoOldData = false;

            // 本地没有数据
            if (!$scope.windowDataListDB) {
                if (gid !== $scope.windowTarget.windowId) {
                    return;
                }
                if (response.msgList) {
                    var localDB = {
                        gid: response.groupId,
                        list: response.msgList
                    };
                    $scope.windowDataListDB = localDB;
                    $scope.windowBussiness = response.bussiness;
                    $scope.goBottom();
                }
            }
            // 本地有数据
            else {
                if (response.msgList) {
                    if (response.msgList.length > 0 && $scope.windowTarget && $scope.windowTarget.windowId) {

                        // 获取新数据
                        if (type == 0) {
                            var index = null;
                            for (var i = 0; i < response.msgList.length; i++) {
                                if (response.msgList[i].msgId == $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId) {
                                    index = i;
                                    break;
                                }
                            }

                            if (index) {
                                for (var j = index + 1; j < response.msgList.length; j++) {
                                    $scope.windowDataListDB.list.push(response.msgList[j]);
                                }
                            } else {

                                for (var j = 0; j < response.msgList.length; j++) {
                                    $scope.windowDataListDB.list.push(response.msgList[j]);
                                }

                            }

                            $scope.windowBussiness = response.bussiness;
                            $scope.windowDataListDB.gid = response.groupId;
                            if ($scope.windowTarget && $scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                                $scope.windowDataListDB.gid = $scope.windowTarget.windowId;
                            $scope.goBottom();
                        }

                        // 获取旧数据
                        else if (type == 1) {

                            $scope.windowDataListDB.list = response.msgList.concat($scope.windowDataListDB.list);
                            $scope.windowBussiness = response.bussiness;
                            $scope.windowDataListDB.gid = response.groupId;
                            if ($scope.windowTarget && $scope.windowTarget.windowId != $scope.windowDataListDB.gid)
                                $scope.windowDataListDB.gid = $scope.windowTarget.windowId;

                            $scope.isOldDataLoading = false;

                        }
                    } else {
                        $scope.isOldDataLoading = false;
                        $scope.isNoOldData = true;
                    }

                }
            }
        }

    }

    // 刷新会话
    $scope.refreshWindowData = function() {
        if ($scope.windowDataListDB && $scope.windowDataListDB.list) {
            if ($scope.windowDataListDB.list.length > 0) {
                getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
            }

        }
    };
    // 获取会话历史数据
    $scope.getWindowOldData = function() {
        if ($scope.isOldDataLoading == true) return;
        $scope.isOldDataLoading = true;
        getWindowData($scope.windowDataListDB.gid, 1, $scope.windowDataListDB.list[0].msgId);
    };

    // 文本内容转换
    $scope.textToHtml = function(content) {
        var results = $scope.faceimgfc(content, 'app/shared/chat_window/faceIcon/filter/faceimages')
        results = $sce.trustAsHtml(results);
        return results;
    };

    // 卡片内容转换
    $scope.contentToHtml = function(content) {
        if(!content)return null;
        var results = content.replace(eval('/\\' + '|' + '\/g'), '<br>');
        results = $sce.trustAsHtml(results);
        return results;
    };

    // 获取语音
    $scope.getAudio = function(key) {

        if (!key) {
            return
        };

        // 点击原来的音频
        if ($scope.audio && $scope.audio.key === key) {

            if ($scope.audio.paused === undefined || $scope.audio.paused) {
                $scope.audio.play();
            } else {
                $scope.audio.pause();
            };

        }
        // 点击新的音频
        else {

            // 停止正在播放的音频
            if ($scope.audio) {
                $scope.audio.restart();
            };

            $http({
                url: imRoot+'file/avthumb.action',
                method: 'post',
                headers: {
                    'access-token': utils.localData('feedback_token_'+$stateParams.type),
                    //'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    bucket: 'message',
                    key: key,
                    format: 'mp3'
                }

            }).then(function(response) {
                if (response.data.resultCode === 1) {
                    checkAudio(qiniuIMRoot + response.data.data.key,0,key);
                    //var _audio_ = ngAudio.load(qiniuIMRoot + response.data.data.key);
                    //_audio_.key = key;
                    //
                    //$scope.audio = _audio_;
                    //
                    //if ($scope.audio.paused === undefined || $scope.audio.paused) {
                    //    $scope.audio.play();
                    //    console.log('play', _audio_)
                    //} else {
                    //    $scope.audio.pause();
                    //    console.log('pause', _audio_)
                    //};
                };

            });
        };
    };

    var audioTimeout;

    function checkAudio(url,times,key){
        audioTimeout && $timeout.cancel(audioTimeout);
        //console.log("checkAudio:"+url+times);
        if(times>2){
            toaster.pop('error', null, "播放失败");
            return;
        }
        $http({
            //url:url+"?ts="+ new Date().getTime(),
            url:url,
            method: 'post',
        }).then(function(response) {
            var _audio_ = ngAudio.load(url);
            _audio_.key = key;

            $scope.audio = _audio_;

            if ($scope.audio.paused === undefined || $scope.audio.paused) {
                $scope.audio.play();
                console.log('play', _audio_)
            } else {
                $scope.audio.pause();
                console.log('pause', _audio_)
            };

        }).catch(function (error) {
            audioTimeout=$timeout(function(){
                checkAudio(url,times+1,key);
            }, 500);
        });
    }

    $scope.thisAudio = function(key) {
        if ($scope.audio && key === $scope.audio.key) {
            return $scope.audio;
        }
    }

    // 编辑框
    $scope.shared = {
        submitEditorDate: submitEditorDate
    };

    // 提交会话内容
    function submitEditorDate(data) {
        var param = {
            access_token:getFeedToken(),
            type: data.type,
            gid: data.windowId
        }

        // 文本
        if (data.type == 1) {
            param.content = data.content;

            // 图片
        } else if (data.type == 2) {

            if (data.uri)
                param.uri = data.uri;

            if (data.format)
                param.format = data.format;
            if (data.key)
                param.key = data.key;

            param.name = data.name;
            param.width = data.width;
            param.height = data.height;
            param.size = data.size;
        }
        return $http({
            url: constants.api.im.sendMsg,
            method: 'post',
            headers: {'access-token': getFeedToken()},
            data: param
        })
        //    .then(thenFc)
        //
        //function thenFc(response) {
        //    getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
        //}
    }
    function getFeedToken(){
        return utils.localData('feedback_token_'+$stateParams.type);
    }

    // 七牛上传文件过滤
    $scope.patientqiniuFilters = {
        mime_types: [ //只允许上传图片和zip文件
            {
                title: "Image files",
                extensions: "jpg,gif,png"
            }
        ]
    };

    $scope.$on("feedback_new_msg", function (e,type) {
        if(type!==$stateParams.type)return;

        getChatPeopleListPulling();
    })

    $scope.getTargetInfo=function(uid){
        var url=$stateParams.type=='store'?app.url.user.getDrugUser:app.url.user.getInfo;
        $http.post(url,{userId:uid,access_token: getFeedToken()})
            .then(function(res){
                if(res.data.resultCode!==1)return;
                $scope.windowTarget.user=res.data.data;
            });
    }
    $scope.getTargetUserGender=function(){
        if(!$scope.windowTarget)return null;
        var s=$scope.windowTarget.user.sex;
        if(s===undefined)return null;
        if(s===1){
            return '男'
        }else if(s===2){
            return '女'
        }else if(s==3){
            return '保密'
        }
    }
    $scope.getTargetUserMainGroup=function(){
        if(!$scope.windowTarget)return null;
        var list=$scope.windowTarget.user.groupList;
        if(!list)return null;
        for(var i=0;i<list.length;i++){
            var g=list[i];
            if(g.groupUser.isMain){
                return g.name;
            }
        }
    }

    //var socket=new WebSocket("ws://192.168.3.7:8090/im/websocket?access_token=b158527438fd4764a821ea3cba04d4ed");
    //socket.onopen= function (e) {
    //    console.log("socket open")
    //    socket.send("12345");
    //}
    //socket.onerror= function (e) {
    //    console.log("socket err"+ e)
    //}
    //socket.onclose= function (e) {
    //    console.log("socket colse")
    //}
    //socket.onmessage= function (e) {
    //    console.log("socket msg"+e);
    //}

};

angular.module('app').directive('reloadImage', reloadImage);
function reloadImage(){
    return{
        controller: function($scope, $element){
        },
        link: function postLink($scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                var src=$(iElement).attr("src")
                    ,defPic="http://default.test.file.dachentech.com.cn/user/default.jpg_small";
                if(src==defPic)return;
                if(src!=iAttrs.ngSrc){
                    $(iElement).attr("src", defPic);
                    return;
                }else{
                    $(iElement).attr("src", defPic);
                    setTimeout(function () {
                        $(iElement).attr("src", iAttrs.ngSrc+"?"+new Date().getTime());
                        //return true;
                    }, 1000);
                }
            });
        }
    }

};

})();
