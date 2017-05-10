'use strict';
(function() {
angular.module('app').controller('CarePlanCtrl', CarePlanCtrl);

CarePlanCtrl.$inject = ['$scope', '$http', '$log', 'toaster','$modal','$stateParams', 'addTextDomeFtory', 'EditCareInfoFtory', 'AddCareRemindFtory', 'AddMedicationFtory', 'AddSurveyFtory', 'AddCareCheckRemindFtory', 'AddLifeQualityFtory', 'AddCheckDocReplyFtory', 'AddIllnessTrackFtory'];

function CarePlanCtrl($scope, $http,$log, toaster, $modal, $stateParams,addTextDomeFtory,EditCareInfoFtory, AddCareRemindFtory,AddMedicationFtory,AddSurveyFtory, AddCareCheckRemindFtory, AddLifeQualityFtory, AddCheckDocReplyFtory, AddIllnessTrackFtory) {

    // 设置七牛上传获取uptoken的参数
    $scope.token = app.url.access_token;

    if ($stateParams.planId) {
        getPlanData();
    };
    function getPlanData() {
        $http.post(app.urlRoot + 'designer/findCarePlan', {
            access_token: app.url.access_token,
            carePlanId: $stateParams.planId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                // console.log(rpn.data);
                $scope.planData = rpn.data;
                //执行时长 
                $scope.thisExecuteTime=rpn.data.executeTime;

            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取计划数据出错');
                console.error(rpn);
            };
        });
    };

    // 获取问题的序号
    $scope.getQuestionIndex = function(id, ids) {
        for (var i = 0; i < ids.length; i++) {
            if (ids[i] == id)
                return i;
        }
        return null;
    };

    // 添加日程项目
    $scope.addSchedulePlan = function() {
        $scope.planData.schedulePlans.push({
            dateSeq: function() {
                if (!$scope.planData.schedulePlans || $scope.planData.schedulePlans.length < 1)
                    return 1;
                return $scope.planData.schedulePlans[$scope.planData.schedulePlans.length - 1].dateSeq + 1;
            }()
        })
    };

    // 获取可选择天数
    $scope.dateSeqS = function(max, except, pre, next) {

        var _max = max,
            _min = 1;

        // if (next && max > next)
        //     _max = next;
        // if (pre && _min < pre)
        //     _min = pre;

        var _arry = [];
        for (var i = _min; i <= _max; i++) {
            _arry.push(i);
        };


        var _dateSeqS = [];
        for (var k = 0; k < $scope.planData.schedulePlans.length; k++) {
            _dateSeqS.push($scope.planData.schedulePlans[k].dateSeq);
        };

        var _result = [];
        _result = _arry.filter(function(item) {
            if (item == except)
                return true;
            if (_dateSeqS.indexOf(item) == -1)
                return true;
        });

        return _result;
    };

    // 修改日程天数
    $scope.changeSeq = function(schedulePlanId, dateSeq) {
        if (!schedulePlanId)
            return;
        $http.post(app.urlRoot + '/designer/updateDateSeq', {
            access_token: app.url.access_token,
            schedulePlanId: schedulePlanId,
            dateSeq: dateSeq
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                toaster.pop('success', null, '设置成功');
                getPlanData();
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取计划数据出错');
                console.error(rpn);
            };
        });
    };

    // 撤消日程
    $scope.deleteSchedulePlan = function(schedulePlanId, index) {
        $http.post(app.urlRoot + 'designer/deleteSchedulePlan', {
            access_token: app.url.access_token,
            schedulePlanId: schedulePlanId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                toaster.pop('success', null, '撤消成功');
                getPlanData();
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取计划数据出错');
                console.error(rpn);
            };
        });
    };

    // 编辑计划资料
    $scope.openEdit = function() {

        var planData = {}
        if (!$scope.planData) {
            planData.tmpType = 1;
        } else {
            planData = $scope.planData;
        }

        EditCareInfoFtory.open(planData, callBack);

        function callBack(planData) {
            // console.log(planData);
            $scope.planData = planData;
        };
    };

    // 删除关怀项
    $scope.deleteCareItem = function(careItemId) {
        $http.post(app.urlRoot + 'designer/deleteCareItem', {
            access_token: app.url.access_token,
            careItemId: careItemId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                toaster.pop('success', null, '删除成功');
                getPlanData();
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '获取计划数据出错');
                console.error(rpn);
            };
        });
    };
    // 添加其他提醒
    $scope.addRemind = function(dateSeq, schedulePlanId, remindId, sendTime, content) {

        var remindData = {
            id: remindId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            tmpType: 1,
            OtherRemind: {
                content: content || ''
            }

        };
        AddCareRemindFtory.open(remindData, callBack);

        function callBack(remindData) {
            getPlanData();
        };
    };

    // 添加用药
    $scope.addMedication = function(schedulePlan, medicationId, sendTime, medicalInfos) {
        //console.log(schedulePlan);
        //console.log(medicalInfos);

        // 如果点击的是添加
        if (!medicationId) {

            var _medication = funGetMedicationInDay(schedulePlan);

            // 判断当天是否已经添加了用药
            if (_medication) {
                medicationId = _medication.id;
                sendTime = medicationId.sendTime;
                medicalInfos = _medication.medicalCare.medicalInfos;
            }

        }

        var medication = {
            id: medicationId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: schedulePlan.dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlan.id || null,
            MedicalCare: {
                medicalInfos: medicalInfos || []
            }
        }

        AddMedicationFtory.open(medication, callBack);

        function callBack(medication) {
            getPlanData();
        };
    };

    // 获取当天的用药
    function funGetMedicationInDay(schedulePlan) {
        var careItems = schedulePlan.careItems;
        if (!careItems) return null;
        for (var i = 0; i < careItems.length; i++) {
            if (careItems[i].type == 20) {
                return careItems[i];
            }
        }
        return null;
    };

    // 添加检查检验项
    $scope.addCheckRemind = function(dateSeq, schedulePlanId, checkId, sendTime, checkItem) {

        var checkData = {
            id: checkId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            checkItem: checkItem || {}
        }

        AddCareCheckRemindFtory.open(checkData, callBack);

        function callBack(checkRemind) {
            getPlanData();
        };
    };

    // 添加检查检验项医生回复
    $scope.addCheckDocReply = function(careItemId, doctorReply) {

        var checkData = {
            careItemId: careItemId,
            doctorReply: doctorReply
        }

        AddCheckDocReplyFtory.open(checkData, callBack);

        function callBack(checkRemind) {
            getPlanData();
        };

    };

    // 添加生活量表
    $scope.addLifeQuality = function(dateSeq, schedulePlanId, lifeScaleId, sendTime, lifeScaleItem) {

        var lifeQualityData = {
            id: lifeScaleId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            tmpType: 1,
            lifeScaleItem: lifeScaleItem
        }

        AddLifeQualityFtory.open(lifeQualityData, callBack);

        function callBack(lifeQualityData) {
            getPlanData();
        };
    };

    // 生活量表重复
    $scope.copyLifeQuality = function(careItem, sendTime) {

        var repeatAskData = {
            careItem: careItem,
            sendTime: sendTime,
            thisExecuteTime:$scope.thisExecuteTime
        }

        AddLifeQualityFtory.copyLifeQuality(repeatAskData, callBack);

        function callBack(repeatAskData) {
            getPlanData();
        };
    };
    //推荐文章
    $scope.addText=function(dateSeq, schedulePlanId, surveyId, sendTime, surveyItem,documentItem){
        var addTextData={
            id: surveyId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            tmpType: 1,
            surveyItem: documentItem
        };
        addTextDomeFtory.open(addTextData,callBack);

        function callBack(addTextData) {
            getPlanData();
        };
    };

    // 添加调查表
    $scope.addSurvey = function(dateSeq, schedulePlanId, surveyId, sendTime, surveyItem) {
        var surveyData = {
            id: surveyId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            tmpType: 1,
            surveyItem: surveyItem
        }

        AddSurveyFtory.open(surveyData, callBack);

        function callBack(surveyData) {
            getPlanData();
        };
    };
    // 添加病情跟踪
    $scope.addIllnessTrack = function(dateSeq, schedulePlanId, lifeScaleId, sendTime, question) {

        var illnessTrackData = {
            id: lifeScaleId || null,
            carePlanId: $scope.planData.id || null,
            dateSeq: dateSeq,
            sendTime: sendTime || '09:00',
            schedulePlanId: schedulePlanId || null,
            diseaseTypeId: $scope.planData.diseaseTypeId
        }

        if (question) {
            illnessTrackData.question = angular.copy(question);
            AddIllnessTrackFtory.createIllnessTrack(illnessTrackData, callBack);
        } else {
            AddIllnessTrackFtory.selectBox(illnessTrackData, callBack);
        }

        function callBack(illnessTrackData) {
            getPlanData();
        };
    };

    // 添加病情跟踪触发消息
    $scope.addTtriggerMsg = function(careItemId, triggerMsgs) {

        var triggerMsgData = {
            careItemId: careItemId,
            triggerMsgs: triggerMsgs || ''
        }

        AddIllnessTrackFtory.triggerMsg(triggerMsgData, callBack);

        function callBack(triggerMsgData) {
            getPlanData();
        };
    };

    // 病情跟踪问题重复提问
    $scope.repeatAsk = function(question, sendTime) {
        console.log(22222)
        var repeatAskData = {
            question: question,
            sendTime: sendTime,
            thisExecuteTime:$scope.thisExecuteTime
        }

        AddIllnessTrackFtory.repeatAsk(repeatAskData, callBack);

        function callBack(repeatAskData) {
            getPlanData();
        };
    };

    // 病情跟踪问题小贴士
    $scope.editTips = function(question) {
        var tipsData = {
            question: question
        }

        AddIllnessTrackFtory.editTips(tipsData, callBack);

        function callBack(tipsData) {
            getPlanData();
        };
    };
    // 复制病情跟踪
    $scope.copyMsg = function(schedulePlanId, item, questions) {
        console.log(questions.length);
        var questionIds = [];
        for (var i = 0; i < questions.length; i++) {
         
                questionIds.push(questions[i].id);
          

        }
      
        var item = {
            "item": item,
            "schedulePlanId": schedulePlanId,
            "questionIds": questionIds,
            "carePlanId": $stateParams.planId,
            "thisExecuteTime":$scope.thisExecuteTime,
            "questionLength":questions.length||0
        }
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'copyMsgModalContent.html',
            controller: 'copyMsgContentCtrl',
            size: 'md',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function(item) {
            getPlanData();
        });

        // AddIllnessTrackFtory.copyMsg(item);

        // function callBack(item) {
        //     getPlanData();
        // };
    };

    // 删除病情跟踪问题
    $scope.removeIllnessTrackQuestion = function(questionId) {

        $http.post(app.urlRoot + 'designer/deleteIllnessTrackQuestion', {
            access_token: app.url.access_token,
            questionId: questionId
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                toaster.pop('success', null, '删除成功');
                getPlanData();
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '删除出错');
                console.error(rpn);
            };
        });
    };

    // 移动病情跟踪问题
    $scope.moveIllnessTrack = function(careItemId, index, direction) {
        $http.post(app.urlRoot + 'designer/moveQuestion', {
            access_token: app.url.access_token,
            careItemId: careItemId,
            location: index,
            direction: direction
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn && rpn.resultCode == 1) {
                toaster.pop('success', null, '移动成功');
                getPlanData();
            } else if (rpn && rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '移动出错');
                console.error(rpn);
            };
        });
    };


};

angular.module('app').controller('copyMsgContentCtrl', funCopyMsgCtrl);

funCopyMsgCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','item'];

function funCopyMsgCtrl($scope, $http, $modal, $modalInstance, toaster, item) {
    $scope.thisExecuteTimeList=[];
    $scope.thisExecuteTime=item.thisExecuteTime;
    for(var j=1;j<=item.thisExecuteTime;j++){
        $scope.thisExecuteTimeList.push(j);
    }
    $scope.questionLength=item.questionLength;
    $scope.dateSeq = '1';
    $scope.hourData=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
    $scope.sendTimeHour = '09';
    $scope.sendTimeMin = '00';
    // 保存
    $scope.ok = function() {
            $http.post(app.urlRoot + 'designer/copyIllnessTrack', {
                access_token: app.url.access_token,
                sendTime: $scope.sendTimeHour + ":" + $scope.sendTimeMin,
                carePlanId: item.carePlanId,
                schedulePlanId: item.schedulePlanId,
                dateSeq: $scope.dateSeq,
                questionIds: item.questionIds

            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '复制成功');
                    $modalInstance.close(true);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '复制出错');
                };
            });
        }
        // 取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}

})();
