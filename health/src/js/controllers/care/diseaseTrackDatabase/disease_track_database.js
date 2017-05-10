/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {

    angular.module('app').controller('diseaseTrackDatabaseCtrl', funDiseaseTrackDatabaseCtrl);

    funDiseaseTrackDatabaseCtrl.$inject = ['$scope', '$http', '$state', 'toaster', 'AddIllnessTrackFtory', '$modal', 'utils', '$timeout'];

    function funDiseaseTrackDatabaseCtrl($scope, $http, $state, toaster, AddIllnessTrackFtory, $modal, utils, $timeout) {
        //生成病种树
        $scope.diseaseName = "全部";
        $scope.pageSize = 10;
        $scope.pageIndex = 1;
        var groupId = app.url.groupId();
        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        //获取七牛上传token和domain
        (function() {
            $http({
                url: serverApiRoot + 'vpanfile/getUploadToken',
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    bucket: 'resource'
                }
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                    //初始化编辑器


                } else {
                    console.error(rep);
                }
            });
        })();
        var contacts = new Tree('lifeQualityLibraryTree', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1, 0],
            data: {
                // url: app.yiliao + 'group/stat/getNewDiseaseTypeTree',
                url: app.url.designer.getDiseaseTypeFromStore,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
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

                if (dts.eq(0).data().info) {
                    treeClick(dts.eq(0).data().info);
                }

            }
        });

        function treeClick(info) {

            $scope.diseaseName = info.name;
            $scope.diseaseId = info.id;
            // console.log($scope.diseaseName);
            $scope.pageIndex = 1;
            $scope.$apply();
            $scope.initTable(info.id);
        }


        // 删除病情跟踪问题
        $scope.deleteQuestionFromStore = function(questionId) {
            console.log(questionId);
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'deleteTrackContentCtrl',
                size: 'md'
            });

            modalInstance.result.then(function(result) {
                if (result) {
                    $http.post(app.urlRoot + 'designer/deleteQuestionFromStore', {
                        access_token: app.url.access_token,
                        questionId: questionId
                    }).then(function(rpn) {
                        rpn = rpn.data;
                        if (rpn && rpn.resultCode == 1) {
                            toaster.pop('success', null, '删除成功');
                            $scope.initTable($scope.diseaseId);
                        } else if (rpn && rpn.resultMsg) {
                            toaster.pop('error', null, rpn.resultMsg);
                        } else {
                            toaster.pop('error', null, '删除出错');
                            console.error(rpn);
                        };
                    });
                }


            });


        };

        $scope.initTable = function(itemId) {
            $http.post(app.url.designer.getQuestionListFromStore, {
                access_token: app.url.access_token,
                groupId: groupId,
                diseaseTypeId: itemId,
                pageSize: $scope.pageSize || 10,
                pageIndex: $scope.pageIndex - 1 || 0
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.surveyList = data.data;
                    $scope.pageTotal = data.data.total;

                } else {
                    toaster.pop('error', null, data.resultMsg);

                }
            }).
            error(function(data) {
                toaster.pop('error', null, "服务器通讯出错");
            });

        }
        $scope.initTable($scope.diseaseId || '');

        // 创建病情跟踪
        $scope.createTrack = function(item, type) {

            var itemObj = {
                "diseaseTypeId": item.diseaseTypeId,
                "diseaseTypeName": item.diseaseTypeName,
                "type": type || item.type || 1,
                "item": item
            };
            var url = '';
            var modalInstance = $modal.open({
                templateUrl: 'eidtTrackModalContent.html',
                controller: 'createTrackCtrl',
                windowClass: 'docModal doc',
                resolve: {
                    item: function() {
                        return itemObj;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                console.log(result);
                if (result) {
                    $scope.initTable($scope.diseaseId || '');
                }

            });

        }
        //选择文件上传
        $scope.selectFile = function() {
            console.log("fds");
            $scope.upload();


        };

        //自动回复
        $scope.editTips = function(question) {
            var tipsData = {
                question: question
            }

            AddIllnessTrackFtory.editTips(tipsData, callBack);

            function callBack(tipsData) {
                getPlanData();
            };
        };

    }

angular.module('app').controller('createTrackCtrl', createTrackCtrl);

createTrackCtrl.$inject = ['$scope', '$timeout', '$modalInstance', 'item', '$sce','$http', 'toaster', '$state', '$modal', 'Lightbox'];

function createTrackCtrl($scope, $timeout, $modalInstance, item, $sce, $http, toaster, $state, $modal, Lightbox) {

    var diseaseTypeId = item.diseaseTypeId;
    $scope.diseaseName = item.diseaseTypeName;
    $scope.itemType = item.type;

    $scope.titleImgs = [];
    var UpadeId = '';
    if (!item.item) {
        //是否是新建且未修改过？
        $scope.isEditNew = true;
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
            }]
        };
    } else {
        if (!item.item.picUrls) {
            item.item.picUrls = [];
        }
        $scope.illnessTrack = item.item;

        $scope.titleImgs = item.item.picUrls;
        UpadeId = item.item.id;
    }
    //放大图片
    $scope.openLightboxModal = function(index) {
        Lightbox.openModal($scope.titleImgs, index);
    };
    //放大选项图片
    $scope.openSingleLightboxModal = function(index, item) {
        Lightbox.openModal(item, 0);
    };
    //新建时选择病种

    $scope.chooseDepartment = function() {
            console.log('df');
            var modalInstance = $modal.open({
                templateUrl: 'chooseIllnessModalContent.html',
                controller: 'chooseIllnessModalCtrl',
                size: 'md',

            });

            modalInstance.result.then(function(result) {
                if (result.isTrue) {
                    diseaseTypeId = result.id;
                    $scope.diseaseName = result.diseaseName;
                }
            });
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

    // 收藏并保存
    $scope.ok = function() {
        if ($scope.totalUploadFilesNum > 1) {
            toaster.pop('waring', null, '图片正常上传，请稍后');
            return;
        }
        // console.log($scope.illnessTrack);=
        var json = {
            name: $scope.illnessTrack.name,
            type: $scope.itemType,
            options: $scope.illnessTrack.options,
            picUrls: $scope.titleImgs
        }
        var param = {};
        if (UpadeId) {
            param = {
                questionId: UpadeId,
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseType: diseaseTypeId,
                jsonData: JSON.stringify(json)
            }
        } else {
            param = {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseType: diseaseTypeId,
                jsonData: JSON.stringify(json)
            }
        }
        if (!diseaseTypeId) {
            toaster.pop('waring', null, '请先选择科室');
            return;
        }

        $http.post(app.urlRoot + 'designer/storeQuestion', param)
            .then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    if (UpadeId) {
                        toaster.pop('success', null, '修改成功');
                    } else {
                        toaster.pop('success', null, '新建成功');
                    }

                    $modalInstance.close(true);

                } else if (rpn && rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '新建错误');
                    console.error(rpn);
                };
            });

    };
    // 取消
    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.multiSelection=false;
    // 七牛上传文件过滤
    $scope.qiniuFilters = {
        mime_types: [ //只允许上传图片
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
            //判断是题图还是选项图 变量为“isHeadTitlePic”表示是上传题图
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
            }

        }
        // $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
    };

    $scope.removeOptionImg = function(item) {
            item.picUrls.splice(0, 1);
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
            if (($scope.selectPicItem != "isHeadTitlePic")) {
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
        if ($scope.titleImgs.length >= 8&& $scope.selectPicItem == 'isHeadTitlePic') {
              toaster.pop('error', null, '最多上传8张题目图片');
            return;
        }
        var info=JSON.parse(info);

        var imageInfo = {};


        getImageInfo(setPicInfo);

        function getImageInfo(callback) {
            $http.get(file.url + '?imageInfo')
                .then(function(rpn) {
                    if (rpn) {
                        imageInfo = rpn.data;
                       
                        callback();
                    }else{
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
                        "picUrls": [file.url+"?xgWidth="+imageInfo.width+"&xgHeight="+imageInfo.height+"&xgFormat="+imageInfo.format+"&xgKey="+info.key]
                    });

                    $scope.isEditNew = false;

                } else {
                    //批量上传一张图，就增一个选项
                    $scope.illnessTrack.options.push({
                        'seq': $scope.illnessTrack.options[$scope.illnessTrack.options.length - 1].seq + 1,
                        'name': '选项名称',
                        'level': '1',
                        'appendQuestions': [],
                        "picUrls": [file.url+"?xgWidth="+imageInfo.width+"&xgHeight="+imageInfo.height+"&xgFormat="+imageInfo.format+"&xgKey="+info.key]
                    });
                }

            } else {
                if ($scope.selectPicItem != "isHeadTitlePic") {


                    $scope.selectPicItem.picUrls[0] = file.url+"?xgWidth="+imageInfo.width+"&xgHeight="+imageInfo.height+"&xgFormat="+imageInfo.format+"&xgKey="+info.key;

                    $scope.selectPicItem.uploadPercent = 100;

                } else {



                    $scope.titleImgs.push(file.url+"?xgWidth="+imageInfo.width+"&xgHeight="+imageInfo.height+"&xgFormat="+imageInfo.format+"&xgKey="+info.key);


                    $scope.titlePicUrlUlPenct = 100;

                }
            }
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            toaster.pop('success', null, '题图上传成功！');
        }




    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {


        toaster.pop('error', null, '题图大于2M，请重新上传');
        if (err.code == '-600') {
            toaster.pop('error', null, '题图大于2M，请重新上传');
        } else {
            toaster.pop('error', null, errTip);
        }
    }
};
angular.module('app').controller('deleteTrackContentCtrl', deleteTrackContentCtrl);

// 手动注入依赖
deleteTrackContentCtrl.$inject = ['$scope', '$modalInstance'];


function deleteTrackContentCtrl($scope, $modalInstance) {

    $scope.ok = function() {
        $modalInstance.close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss(false);
    };
};
angular.module('app').controller('chooseIllnessModalCtrl', funchooseIllnessModalCtrl);

// 手动注入依赖
funchooseIllnessModalCtrl.$inject = ['$scope', '$modalInstance', '$timeout'];


function funchooseIllnessModalCtrl($scope, $modalInstance, $timeout) {
    var groupId = app.url.groupId();
    var diseaseId = '';
    var diseaseName = '';
    $timeout(initTree, 0);

    function initTree() {
        var contacts = new Tree('thisLifeQualityLibraryTree', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1, 0],
            data: {
                url: app.yiliao + 'article/getTypeByParent',
                // url: app.url.designer.getDiseaseTypeFromStore,
                param: {
                    access_token: app.url.access_token,
                    groupId: groupId
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


            }
        });

        function treeClick(info) {

            $scope.diseaseName = info.name;
            diseaseName = info.name;
            $scope.diseaseId = info.id;
            diseaseId = info.id;
            // console.log($scope.diseaseName);
            $scope.$apply();



        }
    }

    $scope.ok = function() {
        var returnInfo = {};
        returnInfo = {
            "id": diseaseId,
            "diseaseName": diseaseName,
            "isTrue": true
        }

        $modalInstance.close(returnInfo);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss(false);
    };
};

})();

