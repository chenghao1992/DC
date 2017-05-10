
(function() {
    angular.module('app').controller('ChatCtrl', chatCtrl);

    // 手动注入依赖
    chatCtrl.$inject = ['$scope', '$interval', '$timeout', '$filter', '$sce', '$anchorScroll', '$location', '$state', 'Lightbox', '$http', 'ngAudio', 'ChatFactory', 'toaster', 'ChatImgSelModalFactory'
        , 'constants','AppFactory'];

    // 订单首页控制器
    function chatCtrl($scope, $interval, $timeout, $filter, $sce, $anchorScroll, $location, $state, Lightbox, $http, ngAudio, ChatFactory, toaster, ChatImgSelModalFactory
        , constants,AppFactory) {
        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
        $scope.qiniuIMRoot = qiniuIMRoot;
        $scope.isShowWait = false;
        $scope.access_token = localStorage['enterprise_access_token'];
        $scope.currentOrderItem = null;

        // 滚动到底部
        $scope.goBottom = function() {
            if (!$state.is('app.chat')||$scope.windowDataListDB.list.length==0)
                return;
            $location.hash($scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
        };

        // 获取用户数据
        var user = JSON.parse(localStorage['enterprise_user']);
        $scope.user = user;

        // 设置轮询时间
        var refreshStep = 10000;

        ////////////////////// 会话列表///////////////////////

        $scope.$on("order_new_msg", function (e,type) {
            getChatPeopleListPulling();
        })
        // 获取会话列表数据-轮询
        getChatPeopleListPulling();
        var getChatPeopleListTimer = null;

        function getChatPeopleListPulling() {
            getChatPeopleListDB();

            if (getChatPeopleListTimer)
                $timeout.cancel(getChatPeopleListTimer);

            // 离开此页退出轮询
            if (!$state.is('app.chat')){
                chatWebSocket.close();
            }

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
                //access_token: $scope.access_token,
                //userId: user.id,
                //newData: 1,
                ts: ts
            }
            $http({
                url: constants.api.im.groupList,
                method: 'post',
                headers: {'access-token': $scope.access_token},
                data: param
            }).then(thenFc)

            function thenFc(response) {

                $scope.chatPeopleListIsLoading = false;
                if(response.data.resultCode!==1)return;
                var d=response.data.data;
                var newData = null;

                if (d && d.list) {
                    localStorage.setItem("enterprise_ts", d.ts);
                    var list= d.list;
                    //var list= filterChat(d.list);
                    if (list.length > 0) {
                        if (localDB) {
                            newData = updateChatPeopleList(list, localDB.list);
                        } else {
                            newData = list;
                        }
                        newData.sort(chatSorter);
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

        $scope.$on("order_new_event", function (e,type) {
            getEventList();
        })
        var eventTs=0;
        getEventList();
        // 获取指令
        function getEventList() {
            var param = {
                ts: eventTs
            }
            $http({
                url: constants.api.im.eventList,
                method: 'post',
                headers: {'access-token': $scope.access_token},
                data: param
            }).then(thenFc)

            function thenFc(response) {

                if(response.data.resultCode!==1)return;
                var d=response.data.data;
                eventTs= d.ts;
                if (d && d.list) {
                    //localStorage.setItem("enterprise_ts", d.ts);
                    var list= d.list,i;
                    for(i=0;i<list.length;i++){
                        handleEvent(list[i]);
                    }
                }
            }
        }
        function handleEvent(event){
            if(event.eventType=='36'){
                var gid=event.param.groupId,mid=event.param.msgId,curItem=$scope.currentOrderItem,db=$scope.windowDataListDB;
                if(!curItem|| curItem.groupId!==gid||!db)return;
                for(var i=db.list.length-1;i>=0;i--){
                    var msg=db.list[i];
                    if(msg.msgId===mid){
                        msg.isRetract=1;
                        break;
                    }
                }
            }
        }

        function chatSorter(a,b){
            var topDiff= b.top- a.top;
            if(topDiff==0){
                return b.updateStamp- a.updateStamp;
            }
            return b.top- a.top;
        }


        // 合并 对话列表数据库数据，返回合并后的数据
        function updateChatPeopleList(newData, oldData) {

            for (var i = 0; i < newData.length; i++) {
                notifyMe(newData[i]);
                if ($scope.windowDataListDB && newData[i].groupId == $scope.windowDataListDB.gid) {
                    var lst=$scope.windowDataListDB.list;
                    getWindowData(newData[i].groupId, 0, lst.length?lst[lst.length - 1].msgId:0);
                    setCurrentChatItem(newData[i])
                }

                for (var j = 0; j < oldData.length; j++) {

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
            setCurrentChatItem(item)

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
                        if (item.groupUsers[i].userType == 1) {
                            tempId = item.groupUsers[i].id;
                            break;
                        }
                    }
                $scope.windowTarget = {
                    name: item.name,
                    id: tempId,
                    pic: item.gpic,
                    bizStatus: item.bizStatus,
                    windowId: item.groupId
                };
            } else {
                $scope.windowTarget = {};
            }

            // 更新会话
            $scope.windowDataListDB = null;
            $scope.windowBussiness = null;

            if (item && item.groupId) {
                getWindowData(item.groupId);
                $scope.showDiseaseInfoTab = true;
            } else {
                //右侧栏病情资料隐藏
                $scope.showDiseaseInfoTab = false;
            }

            // 关闭工具箱
            if ($scope.closePop)
                $scope.closePop();

        }

        function setCurrentChatItem(chatGroup){
            $scope.currentOrderItem=chatGroup;
            makeGroupUserMap();
        }
        /////////////////// 会话周边功能 ////////////////

        // 放大图片
        $scope.openLightboxModal = function(item, index) {
            var modalInstance = Lightbox.openModal(item, index);

        };

        /////////////////// 会话内容 /////////////////

        // 获取会话内容-轮询
        //getWindowDataPulling();
        //var getWindowDataTimer = null;
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
            if (!$state.is('app.chat'))
                return;

            getWindowDataTimer = $timeout(getWindowDataPulling, refreshStep);
        };

        // 获取会话内容
        function getWindowData(gid, type, msgId) {
            $scope.windowIsLoading = true;

            var param = {
                access_token: $scope.access_token,
                userId: user.userId,
                groupId: gid,
                cnt: 20
            }


            // 第一次获取
            //if (type && msgId) {
            if (msgId) {
                param.type = type;
                param.msgId = msgId;
            }

            ChatFactory
                .getWindowData(param)
                .then(thenFc)

            function thenFc(response) {
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
                                var lst=$scope.windowDataListDB.list,
                                    msgId=lst.length?lst[lst.length - 1].msgId:0;
                                for (var i = 0; i < response.msgList.length; i++) {
                                    if (response.msgList[i].msgId == msgId) {
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
            return AppFactory.urlify(results);
        };

        // 卡片内容转换
        $scope.contentToHtml = function(content) {
            if(content===undefined)return "*empty*";
            var results = content.replace(eval('/\\' + '|' + '\/g'), '<br>');
            results = $sce.trustAsHtml(results);
            return results;
        };

        // 结束服务
        $scope.closeOrder = function(id) {

            if (!id)
                return console.warn('缺少会话id');

            $scope.closeOrderIsLoading = true;

            var param = {
                access_token: $scope.access_token,
                gid: id
            }

            ChatFactory
                .closeOrder(param)
                .then(thenFc)

            function thenFc(response) {
                $scope.closeOrderIsLoading = false;
                $scope.targetInfo=null;
                console.log('成功结束订单:' + id);

                getChatPeopleListDB();
            }

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
                    url: imRoot + 'file/avthumb.action',
                    method: 'post',
                    headers: {
                        'access-token': $scope.access_token,
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
                        //} else {
                        //    $scope.audio.pause();
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
                access_token: $scope.access_token,
                type: data.type,
                fromUserId: data.user.id,
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
            ChatFactory.sendMsg(param)
            //    .then(thenFc)
            //
            //function thenFc(response) {
            //    getWindowData($scope.windowDataListDB.gid, 0, $scope.windowDataListDB.list[$scope.windowDataListDB.list.length - 1].msgId);
            //}
        }

        $scope.openLightboxModal2 = function(index) {
            var modalInstance = Lightbox.openModal($scope.patientInfo.diseaseImgs, index, {
                templateUrl: 'app/components/order/lightboxModal.html'
            });

            modalInstance.result.then(function(selectedItem) {
                console.log(selectedItem);
                if (selectedItem) {
                    $scope.patientInfo.diseaseImgs = $scope.patientInfo.diseaseImgs.filter(function(item, index, array) {
                        return item != selectedItem;
                    });
                    console.log($scope.patientInfo.diseaseImgs);
                    $scope.savePatientInfo();
                }
            }, function() {

            });
        };


        // 七牛上传文件过滤
        $scope.patientqiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        $scope.maxSelect = function(arry) {
            var result = 0,
                max = 8;
            if (arry && arry.length > 0) {
                if (arry.length >= 8) {
                    result = 0;
                } else {
                    result = max - arry.length;
                };
            } else {
                result = max;
            };
            return result;
        };

        //选择患者上传的图片
        $scope.selectChatImg = function() {
            ChatImgSelModalFactory.openChatImgSelModal($scope.patientInfo.diseaseImgs, $scope.windowTarget.windowId, 'lg', function(selectedItems) {
                $scope.patientInfo.diseaseImgs = selectedItems;
                console.log(selectedItems);
                $scope.savePatientInfo();
            });
        }

        $scope.onCreateGroup=function(data) {
            //if(data.type===1){
            //}
            if(!data||!data.type)return;
            var item={
                bizType:data.rtype,
                groupId:data.gid,
                name:data.gname,
                gpic:data.gpic,
                groupUsers:data.userList,
                type:data.type,
            };
            $scope.chatPeopleListItemClick(item);
        }

        function makeGroupUserMap(){
            $scope.userMap={};
            var it=$scope.currentOrderItem
                , u,i;
            if(!it||!it.groupUsers)return;
            for(i in it.groupUsers){
                u=it.groupUsers[i];
                $scope.userMap[u.id]=u;
            }
        }

        function copyTextToClipboard(text) {
            var textArea = document.createElement("textarea");

            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
            document.body.removeChild(textArea);
        }
        $scope.menuOptions= function (item) {
            var arr=[];
            arr.push(["复制", function ($itemScope) {
                copyTextToClipboard(item.content);
            }]);
            if($scope.user.userId==item.fromUserId){
                arr.push(["撤回", function ($itemScope) {
                    ChatFactory.retractMsg(item)
                        .then(function(res){
                        });
                }]);
            }
            return arr;
        }

        function requestNotify(){
            if (!("Notification" in window))return;
            if (Notification.permission === "granted")return;
            if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                    }
                });
            }
        }
        requestNotify();

        //function isPageHidden(){
        //    return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
        //}

        function notifyMe(chatGroup) {
            //if(ifvisible.now())return;
            if(document.hasFocus())return;
            if (!("Notification" in window))return;
            if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                var notification = new Notification(chatGroup.name,{body:chatGroup.lastMsgContent,icon:chatGroup.gpic,tag:chatGroup.groupId});
                notification.onclick = function (e) {
                    window.focus();
                    var i=$scope.currentOrderItem;
                    if(i&& i.groupId!==chatGroup.groupId){
                        $scope.chatPeopleListItemClick(chatGroup);
                        $scope.$apply();
                    }
                    this.close();
                }
                $timeout(function(){
                    notification.close();
                },3000);
            }
        }
    };

    angular.module('app').controller('LightboxCtrl', function($scope, Lightbox) {
        $scope.removeChatImg = function(removeChatImg) {
            Lightbox.closeModal(removeChatImg);
        }
    });

})();
