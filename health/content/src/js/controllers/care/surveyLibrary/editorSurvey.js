'use strict';
//调查表列表
(function() {

angular.module('app').controller('EditorSurveyCtrl', EditorSurveyCtrl);

EditorSurveyCtrl.$inject = ['$scope', '$state', '$http', 'toaster', 'editableThemes', 'editableOptions', 'ChooseDepartmentFactory', '$stateParams', 'Lightbox'];

function EditorSurveyCtrl($scope, $state, $http, toaster, editableThemes, editableOptions, ChooseDepartmentFactory, $stateParams, Lightbox) {
    editableThemes.bs3.inputClass = 'input-xs';
    editableThemes.bs3.buttonsClass = 'btn-xs';
    editableOptions.theme = 'bs3';


    // 图片上传start
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


    // 七牛上传文件过滤
    $scope.qiniuFilters = {
        mime_types: [ //只允许上传图片和zip文件
            {
                title: "Image files",
                extensions: "jpg,gif,png"
            }
        ]
    };
    //放大图片
    $scope.openLightboxModal = function(targetItem, index) {
        Lightbox.openModal(targetItem, index);
    };
    //放大选项图片
    $scope.openSingleLightboxModal = function(index, item) {
        Lightbox.openModal(item, 0);
    };
    //上传进度
    $scope.fileUploadProcess = function(up, file) {
        if ($scope.selectPicItem == "isUploadTotalPic") {
            $scope.uploadTotalPicsPercent = 0;
        } else {
            if ($scope.selectPicItem != "isHeadTitlePic") {

                $scope.selectPicItem.uploadPenct = file.percent == 100 ? 99 : file.percent;
            } else {
                $scope.itemTitle.uploadPenct = file.percent == 100 ? 99 : file.percent;
            }
        }


        // $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
    };
    //选择文件上传
    $scope.selectFile = function(e, t) {

        //判断是题图还是选项图
        //判断是批量上传选项图还是其它上传方式  变量为“isUploadTotalPic”表示是批量上传
        if (e == 'uploadTotalPics') {
            $scope.selectPicItem = 'isUploadTotalPic';
            $scope.isUploadTotalImages = t;
        } else {
            if (e != "isHeadTitlePic") {
                $scope.selectPicItem = e;
                e.uploadPenct = 0;
                if (!e.picUrls) {
                    e.picUrls = [];
                }
            } else {
                if (!t.picUrls) {
                    t.picUrls = [];
                }
                t.uploadPenct = 0;
                $scope.selectPicItem = 'isHeadTitlePic';
                $scope.itemTitle = t;
            }
        }


        $scope.upload();
    };
    $scope.removeItemImg = function(e, index) {
        e.uploadPenct = 0;
        e.splice(index, 1);

    }
    $scope.removeOptionImg = function(item) {
            item.picUrls.splice(0, 1);
            item.uploadPenct = 0;
        }
        // 设置七牛上传获取uptoken的参数
    $scope.token = app.url.access_token;
    // // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        //获取上传文件的个数，以便在保存的时候不会出现文件未全部上传完成就可以保存
        $scope.totalUploadFilesNum = files.length;
        //     $scope.titlePicUrlUlPenct = 0;
        //     if ($scope.selectPicItem != "isHeadTitlePic") {
        //         $scope.selectPicItem.uploadPercent = 0;
        //     }
        //     //console.log(up, files);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        $scope.totalUploadFilesNum--;
        //上传文件超过8张就不能再上传了
        if ($scope.itemTitle) {
            if ($scope.itemTitle.picUrls.length >= 8 && $scope.selectPicItem == 'isHeadTitlePic') {
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
            if ($scope.selectPicItem == "isUploadTotalPic") {
                $scope.isEditNew = false;
                if ($scope.isEditNew) {
                    $scope.surveyData.questions[$scope.isUploadTotalImages].options = [];
                    //批量上传一张图，就增一个选项
                    $scope.surveyData.questions[$scope.isUploadTotalImages].options.push({
                        name: '请点击输入选项名称',
                        piont: 0,
                        picUrls: [file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key]
                    });
                    $scope.isEditNew = false;
                } else {
                    //批量上传一张图，就增一个选项
                    $scope.surveyData.questions[$scope.isUploadTotalImages].options.push({
                        name: '请点击输入选项名称',
                        piont: 0,
                        picUrls: [file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key]
                    });
                }



            } else {
                if ($scope.selectPicItem != "isHeadTitlePic") {
                    $scope.selectPicItem.picUrls[0] = file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key;
                    $scope.selectPicItem.uploadPenct = 100;
                } else {
                    $scope.itemTitle.picUrls.push(file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key);
                    $scope.itemTitle.uploadPenct = 100;
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
    };

    // 图片上传end
    if ($stateParams.surveyId && $stateParams.version) {
        $http.post(app.yiliao + 'designer/findSurveyByOne', {
            access_token: app.url.access_token,
            surveyId: $stateParams.surveyId,
            version: $stateParams.version
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                $scope.surveyData = rpn.data;
                $scope.isDiseaseDisable = true;
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    } else {
        $scope.isEditNew = true;
    }

    $scope.surveyData = {
        groupId: app.url.groupId(),
        // title: '调查表计划',
        // desc: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        // diseaseTypeId: 'd1',
        // diseaseName: '泌尿科',
        // questions: [{
        //     id: 'q1',
        //     type: 1,
        //     name: '选择题',
        //     options: [{
        //         id: 'o1',
        //         title: '不能进食',
        //         isAddRemark: true,
        //     }, {
        //         id: 'o2',
        //         title: '能进食',
        //         isAddRemark: false,
        //     }]
        // }, {
        //     id: 'q2',
        //     type: 2,
        //     name: '填空题'
        // }, {
        //     id: 'q3',
        //     type: 3,
        //     name: '问答题'
        // }]
        questions: []
    };

    // {
    //     'title': '题库标题 ',
    //     'desc': '描述 ',
    //     'diseaseTypeId': '病种ID',
    //     'groupId': '集团ID',
    //     'surveyId': '调查表ID',
    //     'questions': [{
    //         'seq': '排序',
    //         'type': '类型',
    //         'name': '名称',
    //         'options': [{
    //             'seq': '排序',
    //             'name': '选项名称',
    //             'isAddRemark': '是否在选项后增加填空框'
    //         }]
    //     }]
    // }


    // 选择科室
    $scope.chooseDepartment = function() {

        ChooseDepartmentFactory.open(callback);

        function callback(department) {
            $scope.surveyData.diseaseTypeId = department.departmentLable;
            $scope.surveyData.diseaseName = department.departmentLableName;
        }
    };


    // 添加选项
    $scope.addOption = function(qIndex) {
        $scope.surveyData.questions[qIndex].options.push({
            name: '请点击输入选项名称',
            piont: 0
        });
    };
    // 删除选项
    $scope.removeOption = function(qIndex, oIndex) {
        $scope.surveyData.questions[qIndex].options.splice(oIndex, 1);
    };
    // 添加问题
    $scope.addQuestion = function(type) {
        if (type === 1)
            $scope.surveyData.questions.push({
                name: '选择题',
                type: 1,
                options: [{
                    name: '请点击输入选项名称'
                }, {
                    name: '请点击输入选项名称'
                }]
            });

        else
            $scope.surveyData.questions.push({
                name: type === 2 ? '填空题' : '问答题',
                type: type
            });
    };
    // 复制问题
    $scope.copyQyestiong = function(qIndex, item) {

        var name = '问题题目' + qIndex + 1;
        var picUrls = [];
        if (item.name) {
            name = item.name;
        };
        if (item.picUrls) {
            picUrls = item.picUrls;
        }
        var _copyItem_ = {
            name: name,
            type: item.type,
            picUrls: picUrls
        };

        if (item.options) {
            _copyItem_.options = [];
            for (var i = 0; i < item.options.length; i++) {
                _copyItem_.options[i] = {
                    name: item.options[i].name || '请点击输入选项名称',
                    isAddRemark: item.options[i].isAddRemark || null,
                    picUrls: item.options[i].picUrls || []
                };
            };
        };
        $scope.surveyData.questions.splice(qIndex + 1, 0, _copyItem_);

    };
    // 删除问题
    $scope.removeQuestion = function(qIndex) {
        $scope.surveyData.questions.splice(qIndex, 1);
    };
    // 向上移动问题
    $scope.putUpQuestion = function(qIndex) {
        var _copyItem_ = $scope.surveyData.questions[qIndex - 1];
        $scope.surveyData.questions[qIndex - 1] = $scope.surveyData.questions[qIndex];
        $scope.surveyData.questions[qIndex] = _copyItem_;
    };
    // 向下移动问题
    $scope.putDownQuestion = function(qIndex) {
        var _copyItem_ = $scope.surveyData.questions[qIndex + 1];
        $scope.surveyData.questions[qIndex + 1] = $scope.surveyData.questions[qIndex];
        $scope.surveyData.questions[qIndex] = _copyItem_;
    };
    // 保存编辑
    $scope.saveEdit = function() {
        if ($scope.totalUploadFilesNum > 1) {
            toaster.pop('waring', null, '图片正常上传，请稍后');
            return;
        }
        var _checkData_ = $scope.surveyData;

        // 没通过校验
        if (!checkData(_checkData_)) return;

        _checkData_ = JSON.stringify(_checkData_);

        $http.post(app.yiliao + 'designer/saveSurvey', {
            access_token: app.url.access_token,
            jsonData: _checkData_
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                toaster.pop('success', null, '保存成功');
                $state.go('app.care_plan.surveyLibrary');
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

    };
    // 保存校验
    function checkData(_checkData_) {

        if (!_checkData_.diseaseTypeId) {
            toaster.pop('error', null, '请选择科室');
            return false;
        }

        if (!_checkData_.title) {
            toaster.pop('error', null, '请填写调查表标题');
            return false;
        }

        if (!_checkData_.desc) {
            toaster.pop('error', null, '请填写调查表简介');
            return false;
        }

        if (!_checkData_.questions || _checkData_.questions.length < 1) {
            toaster.pop('error', null, '请添加题目');
            return false;
        }

        for (var i = 0; i < _checkData_.questions.length; i++) {
            if (!_checkData_.questions[i].name) {
                toaster.pop('error', null, '请填写Q' + (i + 1) + '题目');
                return false;
            };
        };

        if (!_checkData_.groupId) {
            toaster.pop('error', null, '集团ID不能为空');
            return false;
        }

        return true;

    };
};

})();
