// 'use strict';
(function() {
    angular.module('app').factory('AddIllnessTrackFtory', AddIllnessTrackFtory);

    // 手动注入依赖
    AddIllnessTrackFtory.$inject = ['$http', '$modal'];

    function AddIllnessTrackFtory($http, $modal) {
        return {
            selectBox: selectBox,
            illnessTrackLibrary: illnessTrackLibrary,
            createIllnessTrack: createIllnessTrack,
            triggerMsg: triggerMsg,
            repeatAsk: repeatAsk,
            editTips: editTips,
            copyMsg: copyMsg
        };

        // 选择添加方式
        function selectBox(illnessTrackData, callBack) {
            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/selectBox.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/selectBox.html';
                }(),
                controller: 'AddIllnessTrackSelectCtrl',
                size: 'md',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    },
                    callBack: function() {
                        return callBack || {};
                    }
                }
            });
            modalInstance.result.then(function() {
                $modalInstance.dismiss('cancel');
            });
        };
        // 创建病情跟踪
        function createIllnessTrack(illnessTrackData, callBack) {
            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/createIllnessTrack.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/createIllnessTrack.html';
                }(),
                controller: 'CreateIllnessTrackCtrl',
                windowClass: 'docModal doc',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    }
                }
            });

            modalInstance.result.then(function(illnessTrackData) {
                if (callBack)
                    callBack(illnessTrackData);
            });
        };
        // 打开病情跟踪库
        function illnessTrackLibrary(illnessTrackData, callBack) {

            if (!illnessTrackData) illnessTrackData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/illnessTrackLibary.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/illnessTrackLibary.html';
                }(),
                controller: 'AddIllnessTrackLibraryCtrl',
                size: 'lg',
                resolve: {
                    illnessTrackData: function() {
                        return illnessTrackData;
                    }
                }
            });
            modalInstance.result.then(function(illnessTrackData) {
                if (callBack)
                    callBack(illnessTrackData);
            });
        };
        // 触发消息
        function triggerMsg(triggerMsgData, callBack) {
            if (!triggerMsgData) triggerMsgData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/addTriggerMsg.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/addTriggerMsg.html';
                }(),
                controller: 'AddTriggerMsgCtrl',
                size: 'lg',
                resolve: {
                    triggerMsgData: function() {
                        return triggerMsgData;
                    }
                }
            });
            modalInstance.result.then(function(triggerMsgData) {
                if (callBack)
                    callBack(triggerMsgData);
            });
        };
        // 重复提问
        function repeatAsk(repeatAskData, callBack) {
            if (!repeatAskData) repeatAskData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/repeatAsk.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/repeatAsk.html';
                }(),
                controller: 'RepeatAskCtrl',
                size: 'lg',
                resolve: {
                    repeatAskData: function() {
                        return repeatAskData;
                    }
                }
            });
            modalInstance.result.then(function(repeatAskData) {
                if (callBack)
                    callBack(repeatAskData);
            });
        };
        // 小帖士
        function editTips(tipsData, callBack) {
            if (!tipsData) tipsData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addIllnessTrack/editTips.html';
                    else
                        return 'src/tpl/care/carePlan/addIllnessTrack/editTips.html';
                }(),
                controller: 'EditTipsCtrl',
                size: 'md',
                resolve: {
                    tipsData: function() {
                        return tipsData;
                    }
                }
            });
            modalInstance.result.then(function(tipsData) {
                if (callBack)
                    callBack(tipsData);
            });
        };
        // 复制病情跟踪
        function copyMsg(item) {


            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    return 'src/tpl/care/carePlan/addIllnessTrack/copyMsg.html';
                }(),
                controller: 'copyMsgCtrl',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function(item) {
                if (callBack)
                    callBack(item);
            });
        };



    };

    angular.module('app').controller('AddIllnessTrackSelectCtrl', AddIllnessTrackSelectCtrl);

    AddIllnessTrackSelectCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','AddIllnessTrackFtory', 'illnessTrackData', 'callBack'];

    function AddIllnessTrackSelectCtrl($scope, $http, $modal, $modalInstance, toaster, AddIllnessTrackFtory, illnessTrackData, callBack) {

        // 创建病情跟踪
        $scope.create = function() {

            AddIllnessTrackFtory.createIllnessTrack(illnessTrackData, _callBack);

            function _callBack(illnessTrackData) {
                callBack();
            };

            $modalInstance.dismiss('cancel');

        };

        // 创建病情跟踪
        $scope.openLibary = function() {

            AddIllnessTrackFtory.illnessTrackLibrary(illnessTrackData, _callBack);

            function _callBack(illnessTrackData) {
                callBack();
            };

            $modalInstance.dismiss('cancel');

        };
    };

    angular.module('app').controller('CreateIllnessTrackCtrl', CreateIllnessTrackCtrl);

    CreateIllnessTrackCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','illnessTrackData','editableThemes','editableOptions', 'Lightbox'];

    function CreateIllnessTrackCtrl($scope, $http, $modal, $modalInstance, toaster, illnessTrackData, editableThemes, editableOptions, Lightbox) {

        editableThemes.bs3.inputClass = 'input-xs';
        editableThemes.bs3.buttonsClass = 'btn-xs';
        editableOptions.theme = 'bs3';


        $scope.illnessTrackData = illnessTrackData;

        $scope.titleImgs = illnessTrackData.question ? illnessTrackData.question.picUrls : [];

        //放大图片
        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.titleImgs, index);
        };
        //放大选项图片
        $scope.openSingleLightboxModal = function(index, item) {
            Lightbox.openModal(item, 0);
        };
        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };
        //选择文件上传
        $scope.selectFile = function(e) {
            if ($scope.titleImgs >= 8) {
                return;
            }
            //判断是批量上传选项图还是其它上传方式  变量为“isUploadTotalPic”表示是批量上传
            if (e == 'uploadTotalPics') {
                $scope.selectPicItem = 'isUploadTotalPic';
            } else {
                //判断是题图还是选项图
                if (e != "isHeadTitlePic") {
                    $scope.selectPicItem = e;

                    if (!$scope.selectPicItem.picUrls) {
                        $scope.selectPicItem.picUrls = [];
                    }
                } else {
                    $scope.selectPicItem = 'isHeadTitlePic';

                    $scope.titleImgs = $scope.titleImgs || [];

                }
            }





            $scope.upload();
        };
        $scope.removeItemImg = function(item) {
            $scope.titleImgs.splice(item, 1)
        }

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            if ($scope.selectPicItem == "isUploadTotalPic") {
                $scope.uploadTotalPicsPercent = 0;
            } else {
                if ($scope.selectPicItem != "isHeadTitlePic") {

                    $scope.selectPicItem.uploadPercent = file.percent == 100 ? 99 : file.percent;
                } else {
                    $scope.titlePicUrlUlPenct = file.percent == 100 ? 99 : file.percent;
                    //$scope.titleImgs[0].titlePicUrlUlPenct= file.percent == 100 ? 99 : file.percent;
                }
            }
        };

        $scope.removeOptionImg = function(item) {
                item.picUrls = [];
                item.uploadPercent = 0;
            }
            // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            //获取上传文件的个数，以便在保存的时候不会出现文件未全部上传完成就可以保存
            $scope.totalUploadFilesNum = files.length;
            $scope.titlePicUrlUlPenct = 0;
            if ($scope.selectPicItem == "isUploadTotalPic") {
                $scope.uploadTotalPicsPercent = 0;
            } else {
                if ($scope.selectPicItem != "isHeadTitlePic") {
                    $scope.selectPicItem.uploadPercent = 0;
                }

            }

            //console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            //minus 1 every thime  the files had uploaded success
            $scope.totalUploadFilesNum--;
            //上传文件超过8张就不能再上传了
            if ($scope.titleImgs) {
                if ($scope.titleImgs.length >= 8 && $scope.selectPicItem == 'isHeadTitlePic') {
                    toaster.pop('error', null, '最多上传8张题目图片');
                    return;
                }
            }
            var info = JSON.parse(info);
            var imageInfo = {};
            getImageInfo(setPicInfo);

            function getImageInfo(callback) {
                $http.get(file.url + '?imageInfo')
                    .then(function(rpn) {
                        if (rpn) {
                            imageInfo = rpn.data;

                            callback();
                        } else {
                            console.log("something happened unexpected");
                        }


                    });

            }

            function setPicInfo() {
                if ($scope.selectPicItem == 'isUploadTotalPic') {
                    $scope.isEditNew = false;
                    if ($scope.isEditNew) {
                        $scope.illnessTrack.options = [];
                        //批量上传一张图，就增一个选项
                        $scope.illnessTrack.options.push({
                            'seq': $scope.illnessTrack.options.length + 1,
                            'name': '选项名称',
                            'level': '1',
                            'appendQuestions': [],
                            "picUrls": [file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key]
                        });
                        $scope.isEditNew = false;
                    } else {
                        //批量上传一张图，就增一个选项
                        $scope.illnessTrack.options.push({
                            'seq': $scope.illnessTrack.options[$scope.illnessTrack.options.length - 1].seq + 1,
                            'name': '选项名称',
                            'level': '1',
                            'appendQuestions': [],
                            "picUrls": [file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key]
                        });
                    }

                } else {
                    if ($scope.selectPicItem != "isHeadTitlePic") {
                        $scope.selectPicItem.picUrls[0] = file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key;
                        $scope.selectPicItem.uploadPercent = 100;

                    } else {
                        $scope.titleImgs.push(file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key);
                        $scope.titlePicUrlUlPenct = 100;

                    }
                }
                $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
                toaster.pop('success', null, '题图上传成功！');
            }

        };
        // 取消
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {



            toaster.pop('error', null, '题图大于2M，请重新上传');
            if (err.code == '-600') {
                toaster.pop('error', null, '题图大于2M，请重新上传');
            } else {
                toaster.pop('error', null, errTip);
            }
        };

        if (illnessTrackData.question) {
            $scope.illnessTrack = illnessTrackData.question;
        } else {
            $scope.illnessTrack = {
                // 'id': '', //修改时传入
                'name': '题目名称',
                'options': [{
                    'seq': '1', //序号
                    'name': '选项名称',
                    'level': '1', //级别(1:正常、2:异常、3:危险)
                    'appendQuestions': [],
                    "picUrls": []
                }, {
                    'seq': '2', //序号
                    'name': '选项名称',
                    'level': '1', //级别(1:正常、2:异常、3:危险)
                    'appendQuestions': [],
                    "picUrls": []
                }],
                "picUrls": $scope.titleImgs || []
            };
            $scope.isEditNew = true;
        }


        // 添加选项
        $scope.addOption = function() {
            $scope.illnessTrack.options.push({
                'seq': $scope.illnessTrack.options[$scope.illnessTrack.options.length - 1].seq + 1,
                'name': '选项名称',
                'level': '1',
                'appendQuestions': [],
                "picUrls": []
            });
        };

        // 删除元素
        $scope.removeItem = function(item, arry) {
            var index = arry.indexOf(item);
            arry.splice(index, 1);

        };

        // 添加追加问题
        $scope.addAppendQuestion = function(option) {
            if (!option.appendQuestions)
                option.appendQuestions = [];
            option.appendQuestions.push({
                // 'seq': function() {
                //     if (option.appendQuestions.length > 0)
                //         return option.appendQuestions[option.appendQuestions.length - 1].seq + 1
                //     return 1;
                // }(),
                'name': '追加题目名称',
                'options': [{
                    // 'seq': '1',
                    'name': '选项名称'
                }, {
                    // 'seq': '2',
                    'name': '选项名称'
                }]
            });
        };

        // 添加追加问题的选项
        $scope.addAppendOption = function(question) {
            question.options.push({
                // 'seq': '2',
                'name': '选项名称'
            });
        };

        // 复制追加问题
        $scope.copyAppendQuestion = function(question, questions) {
            var index = questions.indexOf(question);
            questions.splice(index + 1, 0, {
                // 'seq': '',
                'name': question.name,
                'options': function() {
                    return angular.copy(question.options);
                }()
            })
        };

        // 选择选项
        $scope.optionChange = function(option, arry) {
            var index = arry.indexOf(option.levelName);
            option.level = index + 1;
        };

        // 互换item
        $scope.exchangeItem = function(moveItem, replaceItem, arry) {
            var mIndex = arry.indexOf(moveItem),
                rIndex = arry.indexOf(replaceItem)

            arry.splice(rIndex, 1, moveItem);
            arry.splice(mIndex, 1, replaceItem);

        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            if ($scope.totalUploadFilesNum > 1) {
                toaster.pop('waring', null, '图片正常上传，请稍后');
                return;
            }


            var data = $scope.illnessTrack;
            if (!data)
                return toaster.pop('error', null, '数据有问题');
            if (!data.name)
                return toaster.pop('error', null, '请输入题目名称');
            if (!data.options || data.options.length < 2)
                return toaster.pop('error', null, '可选项不能少于两项');
            for (var i = 0; i < data.options.length; i++) {
                if (!data.options[i].name)
                    return toaster.pop('error', null, '选项名称不能为空');
                var questions = data.options[i].appendQuestions;
                if (questions && questions.length > 0)
                    for (var j = 0; j < questions.length; j++) {
                        if (!questions[j].name)
                            return toaster.pop('error', null, '请输入题目名称');
                        if (!questions[j].options || questions[j].options.length < 2)
                            return toaster.pop('error', null, '可选项不能少于两项');
                        for (var k = 0; k < questions[j].options.length; k++) {
                            if (!questions[j].options[k].name)
                                return toaster.pop('error', null, '选项名称不能为空');
                        }
                    }
            }
            // 创建
            if (!illnessTrackData.question)
                submitReplyData();
            else
                updateIllnessTrackQuestion();
        };

        // 收藏并保存
        $scope.collect = function() {

            var json = {
                name: $scope.illnessTrack.name,
                options: $scope.illnessTrack.options
            }

            var param = {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseType: illnessTrackData.diseaseTypeId,

                jsonData: JSON.stringify(json)
            }
            $http.post(app.urlRoot + 'designer/storeQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '收藏成功');

                        if (!illnessTrackData.question)
                            submitReplyData();
                        else
                            updateIllnessTrackQuestion();

                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '收藏错误');
                        console.error(rpn);
                    };
                });

        };

        // 修改病情跟踪
        function updateIllnessTrackQuestion() {

            var json = {
                'name': $scope.illnessTrack.name,
                'repeatAsk': $scope.illnessTrack.repeatAsk,
                // 'sourceId': '有啥传啥，其他字段一样',
                'options': $scope.illnessTrack.options,
                'picUrls': $scope.titleImgs
            }

            var param = {
                access_token: app.url.access_token,
                questionId: $scope.illnessTrack.id,
                sendTime: $scope.illnessTrackData.sendTime,
                jsonData: JSON.stringify(json)
            }

            $http.post(app.urlRoot + 'designer/updateIllnessTrackQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '修改成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };

        // 创建病情跟踪
        function submitReplyData() {
            console.log("test" + $scope.illnessTrack);
            var json = {
                'name': $scope.illnessTrack.name,
                'repeatAsk': $scope.illnessTrack.repeatAsk,
                // 'sourceId': '有啥传啥，其他字段一样',
                'options': $scope.illnessTrack.options,
                'picUrls': $scope.titleImgs
            }
            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.illnessTrackData.sendTime,
                carePlanId: $scope.illnessTrackData.carePlanId,

                schedulePlanId: $scope.illnessTrackData.schedulePlanId,
                dateSeq: $scope.illnessTrackData.dateSeq,
                jsonData: JSON.stringify(json)
            }

            if ($scope.illnessTrackData.id)
                param.id = $scope.illnessTrackData.id;

            $http.post(app.urlRoot + 'designer/saveIllnessTrack', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        console.log(rpn);
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
                });
        };
    };

    angular.module('app').controller('AddIllnessTrackLibraryCtrl', AddIllnessTrackLibraryCtrl);

    AddIllnessTrackLibraryCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','illnessTrackData'];

    function AddIllnessTrackLibraryCtrl($scope, $http, $modal, $modalInstance, toaster, illnessTrackData) {

        $scope.illnessTrackData = illnessTrackData;
        //预览弹窗
        $scope.modelCheckIlless = function(item) {
            var items = item;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'illnessTrackLibaryCheck.html',
                controller: 'ModalillnessTrackLibaryCtrl',
                size: 'lg',
                resolve: {
                    itemid: function() {
                        return items
                    }
                }

            });
        };

        //生成病种树
        function setTree() {
            var contacts = new Tree('lifeQualityLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1, 0],
                data: {
                    url: app.yiliao + 'designer/getDiseaseTypeTree4Q',
                    param: {
                        access_token: app.url.access_token,
                        carePlanId: illnessTrackData.carePlanId
                    }
                },
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'department',
                    leaf: 'leaf'
                },
                root: {
                    selectable: true,
                    name: '全部',
                    id: null
                },
                events: {
                    click: treeClick
                },
                callback: function() {
                    var dts = contacts.tree.find('dt');
                    // 默认获取root 全部 的数据
                    if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                        treeClick(dts.eq(0).data().info);
                }
            });
        };

        setTimeout(setTree, 0);

        function treeClick(info) {
            $scope.diseaseName = info.name;
            setTable(info.id);
        };

        $scope.diseaseTypeId = null;
        $scope.pageIndex = 1;
        $scope.pageSize = 5;

        function setTable(diseaseTypeId, pageIndex, pageSize) {

            $http.post(app.yiliao + 'designer/getQuestionList', {
                access_token: app.url.access_token,
                carePlanId: illnessTrackData.carePlanId,
                diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || 0
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    $scope.countData = rpn.data;

                    var start = $scope.pageSize * ($scope.pageIndex - 1),
                        end = $scope.pageIndex * $scope.pageSize;
                    $scope.illnessTrack = $scope.countData.slice(start, end);
                    $scope.page_count = rpn.data.length;

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };

        $scope.setTable = setTable;
        $scope.pageChanged = function() {
            var start = $scope.pageSize * ($scope.pageIndex - 1),
                end = $scope.pageIndex * $scope.pageSize;
            $scope.illnessTrack = $scope.countData.slice(start, end);
        };

        $scope.selectArry = [];

        // 选择
        $scope.selectItem = function(item) {

            var index = $scope.selectArry.indexOf(item);
            if (index === -1)
                $scope.selectArry.push(item);
            else
                $scope.selectArry.splice(index, 1);

        };

        // 是否已选择
        $scope.isSelect = function(item) {

            var arry = $scope.selectArry;
            for (var i = 0; i < arry.length; i++) {
                if (arry[i].qId === item.qId)
                    return true;
            }
            return false;
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function() {

            if (!$scope.selectArry || $scope.selectArry.length < 1)
                return toaster.pop('error', null, '请选择问题');

            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.illnessTrackData.sendTime,
                carePlanId: $scope.illnessTrackData.carePlanId,

                schedulePlanId: $scope.illnessTrackData.schedulePlanId,
                dateSeq: $scope.illnessTrackData.dateSeq,
                jsonData: JSON.stringify($scope.selectArry)
            }

            $http.post(app.urlRoot + 'designer/batchSaveQuestion', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '添加失败');
                        console.error(rpn);
                    };
                });

        };

    };

    angular.module('app').controller('AddTriggerMsgCtrl', AddTriggerMsgCtrl);

    AddTriggerMsgCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','triggerMsgData'];

    function AddTriggerMsgCtrl($scope, $http, $modal, $modalInstance, toaster, triggerMsgData) {

        $scope.triggerMsgData = {
            careItemId: triggerMsgData.careItemId
        };
        if (!triggerMsgData.triggerMsgs) {
            $scope.triggerMsgData.triggerMsgs = []
            if ($scope.triggerMsgData.triggerMsgs.length < 1) {
                $scope.triggerMsgData.triggerMsgs.push('患者恢复的很好，请放心！')
                $scope.triggerMsgData.triggerMsgs.push('您回复程度很好，请放心！')
                $scope.triggerMsgData.triggerMsgs.push('患者出现异常，请及时处理！')
                $scope.triggerMsgData.triggerMsgs.push('您的情况出现异常，建议咨询医生。')
                $scope.triggerMsgData.triggerMsgs.push('患者出现危险项，请马上联系患者处理。')
                $scope.triggerMsgData.triggerMsgs.push('您的情况出现异常，建议咨询医生。')
            }
        } else {
            $scope.triggerMsgData.triggerMsgs = []
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor1)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient1)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor2)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient2)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindDoctor3)
            $scope.triggerMsgData.triggerMsgs.push(triggerMsgData.triggerMsgs.remindPatient3)
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            for (var i = 0; i < $scope.triggerMsgData.triggerMsgs.length; i++) {
                if (!$scope.triggerMsgData.triggerMsgs[i])
                    return toaster.pop('error', null, '请填完每个提醒');
            }

            $http.post(app.urlRoot + 'designer/saveTriggerMsg', {
                access_token: app.url.access_token,
                careItemId: $scope.triggerMsgData.careItemId,
                triggerMsgs: $scope.triggerMsgData.triggerMsgs
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });


        };
    };

    angular.module('app').controller('RepeatAskCtrl', RepeatAskCtrl);

    RepeatAskCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','repeatAskData'];

    function RepeatAskCtrl($scope, $http, $modal, $modalInstance, toaster, repeatAskData) {


        $scope.thisExecuteTimeOfRepeatList = [];
        $scope.thisExecuteTime = repeatAskData.thisExecuteTime;
        for (var j = 1; j <= repeatAskData.thisExecuteTime; j++) {
            $scope.thisExecuteTimeOfRepeatList.push(j);
        }
        $scope.repeatAskData = repeatAskData;
        $scope.repeatAskOption = {};

        $scope.isEnd = true;

        $scope.endCondition = {
            'continueDays': '1',
            'level': '1' //级别(1:正常、2:异常、3:危险)
        };

        // 设置默认
        function funSetDefault() {
            $scope.repeatAskOption = {
                'repeats': [{
                    'repeatSeq': 1,
                    'dateSeq': 1,
                    'sendTime': (function() {
                        var splitArry = repeatAskData.sendTime.split(':');
                        if (splitArry[1] === '00') {
                            $scope.result = splitArry[0] + ':30';
                            return $scope.result;
                        } else {
                            $scope.result = splitArry[0] - 0 + 1 + ':00';
                            return $scope.result;
                        }
                        return '09:00'
                    })()
                }]

            };
            return $scope.repeatAskOption;
            // console.log(this.repeats.dateSeq);

        }

        // var myTest=funSetDefault();
        // console.log(myTest);
        // 获取重复问题列表
        (function getReaptList() {
            $http.post(app.urlRoot + 'designer/getRepeatAsk', {
                access_token: app.url.access_token,
                questionId: repeatAskData.question.id
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    if (rpn.data) {
                        $scope.endCondition = rpn.data.endCondition;

                        if (rpn.data.repeats && rpn.data.repeats.length > 0) {
                            $scope.repeatAskOption.repeats = rpn.data.repeats;

                        } else {
                            funSetDefault();
                        }
                    }else{
                        funSetDefault();
                    }
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '获取出错');
                    console.error(rpn);
                };
            });
        })();

        // 删除元素
        $scope.removeItem = function(item, arry) {
            var index = arry.indexOf(item);
            arry.splice(index, 1);
        };

        // 添加重复时间
        $scope.addReaptOption = function(filtersJson) {
            console.log(1111111)

            var filters = JSON.parse(filtersJson);

            $scope.repeatAskOption.repeats.push({
                'repeatSeq': 1,
                'dateSeq': function() {
                    if ($scope.repeatAskOption.repeats && $scope.repeatAskOption.repeats.length > 0) {
                        var dateSeq = $scope.repeatAskOption.repeats[$scope.repeatAskOption.repeats.length - 1].dateSeq;
                        return dateSeq;
                    } else {
                        return 1
                    }
                }(),
                'sendTime': function() {
                    if ($scope.repeatAskOption.repeats && $scope.repeatAskOption.repeats.length > 0) {
                        var prevTime = $scope.repeatAskOption.repeats[$scope.repeatAskOption.repeats.length - 1].sendTime,
                            splitArry = prevTime.split(':'),
                            result = null;

                        function nextTime(_splitArry) {
                            if (_splitArry[1] === '00') {
                                _splitArry = [_splitArry[0], '30'];
                            } else {
                                _splitArry = [_splitArry[0] - 0 + 1 + '', '00'];
                            }
                            return _splitArry;
                        };

                        splitArry = nextTime(splitArry);


                        for (var i = 0; i < filters.length; i++) {
                            if (splitArry[0] + ':' + splitArry[1] == filters[i]) {
                                splitArry = nextTime(filters[i].split(':'));
                            }
                        }

                        result = splitArry[0] + ':' + splitArry[1];

                        return result;

                    } else {
                        return '09:00'
                    }
                }()
            });
        };

        $scope.timeFilterArry = function(exception, dateSeq) {
            console.log(exception)
            console.log(dateSeq);
            var _repeats = angular.copy($scope.repeatAskOption.repeats),
                _resultArry = [];

            // 过滤第一天的发送时间
            if (dateSeq == 1)
                _resultArry = [repeatAskData.sendTime];

            for (var i = 0; i < _repeats.length; i++) {
                if (exception != _repeats[i].sendTime && dateSeq == _repeats[i].dateSeq)
                    _resultArry.push(_repeats[i].sendTime)
            }
            return JSON.stringify(_resultArry);
        };


        // 选择选项
        $scope.optionChange = function(option, arry) {
            var index = arry.indexOf(option.levelName);
            option.level = index + 1;
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            var json = {
                repeats: $scope.repeatAskOption.repeats
            };

            if ($scope.isEnd)
                json.endCondition = $scope.endCondition;

            $http.post(app.urlRoot + 'designer/saveRepeatAsk', {
                access_token: app.url.access_token,
                questionId: repeatAskData.question.id,
                jsonData: JSON.stringify(json)
            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });
        };
    };

    angular.module('app').controller('EditTipsCtrl', EditTipsCtrl);

    EditTipsCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','tipsData'];

    function EditTipsCtrl($scope, $http, $modal, $modalInstance, toaster, tipsData) {
        // console.log(tipsData);

        $scope.options = [];
        $scope.tipsData = [{
            'seq': '',
            'name': ''
        }];

        if (tipsData.question.id) {
            $scope.tipsData = [];
            for (var i = 0; i < tipsData.question.options.length; i++) {
                $scope.options.push({
                    'seq': tipsData.question.options[i].seq,
                    'name': tipsData.question.options[i].name
                });
                if (tipsData.question.options[i].tips) {
                    $scope.tipsData.push({
                        'seq': tipsData.question.options[i].seq,
                        'tips': tipsData.question.options[i].tips
                    });
                }

            }
        };

        if ($scope.tipsData.length < 1) {
            $scope.tipsData.push({
                'seq': tipsData.question.options[0].seq,
                'tips': ''
            });
        };

        // // 过滤已选择的选项
        // $scope.filterOption = function(seq) {
        //     var arry = [];

        //     for (var k = 0; k < $scope.options.length; k++) {
        //         arry.push($scope.options[k])
        //     };

        //     result = arry.filter(function(item, index) {
        //         if (item.seq == seq)
        //             return true;
        //         for (var j = 0; j < $scope.tipsData.length; j++) {
        //             if (item.seq == $scope.tipsData[j].seq) {
        //                 return false;
        //             }
        //         }
        //         return true;
        //     });

        //     return result;
        // };

        // 标记选项是否已被选择
        $scope.funSelectedOption = function(seq) {
            var array = $scope.options;
            for (var i = 0; i < array.length; i++) {
                if (array[i].seq == seq) {
                    array[i].isSelected = true;
                } else {

                    array[i].isSelected = false;

                    for (var j = 0; j < $scope.tipsData.length; j++) {
                        if (array[i].seq == $scope.tipsData[j].seq) {
                            array[i].isSelected = true;
                        }
                    }

                }
            }
            console.log($scope.options, $scope.tipsData)
        };


        // 添加提示
        $scope.addTip = function() {
            $scope.tipsData.push({
                'seq': '',
                'tips': ''
            });

            // 标记是否已选择
            $scope.funSelectedOption($scope.tipsData[$scope.tipsData.length - 1]);
            console.log($scope.options, $scope.tipsData)
        };

        // 移除提示
        $scope.removeTip = function(index) {
            $scope.tipsData.splice(index, 1)
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {

            for (var i = 0; i < $scope.tipsData.length; i++) {
                if (!$scope.tipsData[i].tips)
                    return toaster.pop('error', null, '请填写好每个选项的提示');
            };

            var json = {
                'options': $scope.tipsData
            }

            $http.post(app.urlRoot + 'designer/saveTips', {
                access_token: app.url.access_token,
                questionId: tipsData.question.id,
                jsonData: JSON.stringify(json)

            }).then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');
                    $modalInstance.close(rpn.data);
                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '保存出错');
                    console.error(rpn);
                };
            });
        };
    };

    angular.module('app').controller('ModalillnessTrackLibaryCtrl', ModalillnessTrackLibaryCtrl);

    ModalillnessTrackLibaryCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','itemid'];
    
    function ModalillnessTrackLibaryCtrl($scope, $http, $modal, $modalInstance, toaster, itemid) {

        // var jsonData={"name":"我是小病情表","options":[{"level":1,"name":"什么","seq":1,"$$hashKey":"object:225","appendQuestions":[{"name":"ddfsdffadf","options":[{"name":"选项名称","$$hashKey":"object:273","seq":1},{"name":"选项名称","$$hashKey":"object:274","seq":2}],"seq":1}]},{"level":3,"name":"不知道","seq":2,"$$hashKey":"object:226"},{"level":2,"name":"什么东西啊","seq":3,"$$hashKey":"object:227"},{"level":1,"name":"选项名称","seq":4,"$$hashKey":"object:228"},{"appendQuestions":[{"name":"问答的福田","options":[{"name":"不不不不","seq":1,"$$hashKey":"object:262"},{"name":"顶顶顶顶","seq":2,"$$hashKey":"object:263"},{"name":"啊啊啊啊","seq":3,"$$hashKey":"object:264"}],"seq":1}],"level":1,"name":"选项名称","seq":5,"$$hashKey":"object:229"}]}
        // $scope.illnessTrack=jsonData;
        $http.post(app.urlRoot + 'designer/getQuestionFromStore', {
            access_token: app.url.access_token,
            qid: itemid
        }).then(function(rpn) {
            if (rpn.data.resultCode == 1) {
                $scope.illnessTrack = rpn.data.data;
            } else {
                toaster.pop('error', null, '服务器错误');
            }
        });
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    angular.module('app').controller('copyMsgCtrl', funCopyMsgCtrl);

    funCopyMsgCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','item'];

    function funCopyMsgCtrl($scope, $http, $modal, $modalInstance, toaster, item) {

        // 保存
        $scope.ok = function() {
                $http.post(app.urlRoot + 'designer/copyIllnessTrack', {
                    access_token: app.url.access_token,
                    sendTime: '',
                    carePlanId: '',
                    schedulePlanId: '',
                    dateSeq: '',
                    questionIds: ''

                }).then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '复制成功');
                        $modalInstance.close(rpn.data);
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
    };


})();
