'use strict';
(function() {

//新建生活量表
angular.module('app').controller('editQuestionsOfLifeCtrl', editQuestionsOfLifeCtrl);

editQuestionsOfLifeCtrl.$inject = ['$scope', '$state', '$http', 'toaster', '$stateParams', 'editableThemes','editableOptions', 'ChooseDepartmentFactory', 'Lightbox'];

function editQuestionsOfLifeCtrl($scope, $state, $http, toaster, $stateParams, editableThemes, editableOptions, ChooseDepartmentFactory, Lightbox) {

    editableThemes.bs3.inputClass = 'input-xs';
    editableThemes.bs3.buttonsClass = 'btn-xs';
    editableOptions.theme = 'bs3';
    $scope.titleImgs = [];
    //   $scope.qiniuMultiSelection=true;

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
    $scope.selectFile = function(e, t) {
        // console.log($scope.qiniuMultiSelection);
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

        e.splice(index, 1);
        e.uploadPenct = 0;
    }
    $scope.removeOptionImg = function(item) {
            item.picUrls.splice(0, 1);
            item.uploadPenct = 0;
        }
        // 设置七牛上传获取uptoken的参数
    $scope.token = app.url.access_token;
    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {
        //获取上传文件的个数，以便在保存的时候不会出现文件未全部上传完成就可以保存
        $scope.totalUploadFilesNum = files.length;
        // $scope.titlePicUrlUlPenct = 0;
        // if ($scope.selectPicItem != "isHeadTitlePic") {
        //     $scope.selectPicItem.uploadPercent = 0;
        // }
        //console.log(up, files);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        $scope.totalUploadFilesNum--;
        //上传文件超过8张就不能再上传了
        if ($scope.itemTitle && $scope.selectPicItem != "isUploadTotalPic" && $scope.selectPicItem == 'isHeadTitlePic') {
            if ($scope.itemTitle.picUrls.length >= 8) {
                toaster.pop('error', null, '最多上传8张题目图片');
                return;
            }
        }


        $scope.uploadTotalPicsPercent = 0;
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
                    $scope.lifeQualityData.questions[$scope.isUploadTotalImages].options = [];
                    $scope.lifeQualityData.questions[$scope.isUploadTotalImages].options.push({
                        name: '请点击输入选项名称',
                        score: 0,
                        picUrls: [file.url + "?xgWidth=" + imageInfo.width + "&xgHeight=" + imageInfo.height + "&xgFormat=" + imageInfo.format + "&xgKey=" + info.key]
                    });
                    $scope.isEditNew = false;
                } else {
                    //批量上传一张图，就增一个选项
                    $scope.lifeQualityData.questions[$scope.isUploadTotalImages].options.push({
                        name: '请点击输入选项名称',
                        score: 0,
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

    if ($stateParams.lifeScaleId && $stateParams.version) {

        $http.post(app.yiliao + 'designer/findLifeScaleByOne', {
            access_token: app.url.access_token,
            lifeScaleId: $stateParams.lifeScaleId,
            version: $stateParams.version
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                $scope.lifeQualityData = rpn.data;
                $scope.isDiseaseDisable = true;


            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    }
    // } else {
    //     $scope.isEditNew = true;
    // }

    $scope.lifeQualityData = {
        // lifeScaleId:'',
        groupId: app.url.groupId(),
        // title: '量表计划',
        // desc: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        // diseaseTypeId: 'd1',
        // diseaseName: '病中医',
        questions: [{
            name: '问题题目1',
            options: [{
                name: '请点击输入选项名称',
                score: 0,
                picUrls: []
            }, {
                name: '请点击输入选项名称',
                score: 0,
                picUrls: []
            }],
            picUrls: []

        }],
        scores: [{
            // leftScore: 3,
            // rigthScore: 40,
            // showInfo: '信息信息信息信息信息信息信息信息信息信息信息信息信息'
        }]
    };


    // {
    //     'title': '题库标题 ',
    //     'desc': '描述 ',
    //     'diseaseTypeId': '病种ID',
    //     'groupId': '集团ID',
    //     'lifeScaleId': '量表ID',
    //     'questions': [{
    //         'seq': '排序',
    //         'name': '名称',
    //         'options': [{
    //             'seq': '排序',
    //             'name': '选项名称',
    //             'score': '分数'
    //         }]
    //     }],
    //     'scores': [{
    //         'leftScore': '最小值',
    //         'rigthScore': '最大值',
    //         'showInfo': '描述',
    //         'ifSmsDoctor': '是否发送短信通知',
    //         'showLeve':'showLeve'
    //     }]
    // }


    // 选择科室
    $scope.chooseDepartment = function() {

        ChooseDepartmentFactory.open(callback);

        function callback(department) {
            $scope.lifeQualityData.diseaseTypeId = department.departmentLable;
            $scope.lifeQualityData.diseaseName = department.departmentLableName;
        }
    };


    // 添加选项
    $scope.addOption = function(qIndex) {
        $scope.lifeQualityData.questions[qIndex].options.push({
            name: '请点击输入选项名称',
            score: 0
        });
    };
    // 删除选项
    $scope.removeOption = function(qIndex, oIndex) {
        $scope.lifeQualityData.questions[qIndex].options.splice(oIndex, 1);
    };

    // 添加问题
    $scope.addQuestion = function() {
        $scope.lifeQualityData.questions.push({
            name: '问题题目' + ($scope.lifeQualityData.questions.length + 1),
            options: [{
                name: '请点击输入选项名称',
                score: 0,
                picUrls: []
            }, {
                name: '请点击输入选项名称',
                score: 0,
                picUrls: []
            }],
            picUrls: []
        });
    };
    // 复制问题
    $scope.copyQyestiong = function(qIndex, item) {

        var name = '问题题目' + qIndex + 1;
        var picUrls = [];
        if (item.name) {
            name = item.name;
        }

        if (item.picUrls) {
            picUrls = item.picUrls;
        }


        var _copyItem_ = {
            name: name,
            options: [],
            picUrls: picUrls
        };
        for (var i = 0; i < item.options.length; i++) {
            _copyItem_.options[i] = {
                name: item.options[i].name || '请点击输入选项名称',
                score: item.options[i].score || 0,
                picUrls: item.options[i].picUrls || []
            };
        };
        $scope.lifeQualityData.questions.splice(qIndex + 1, 0, _copyItem_);
    };
    // 删除问题
    $scope.removeQuestion = function(qIndex) {
        $scope.lifeQualityData.questions.splice(qIndex, 1);
    };
    // 向上移动问题
    $scope.putUpQuestion = function(qIndex) {
        var _copyItem_ = $scope.lifeQualityData.questions[qIndex - 1];
        $scope.lifeQualityData.questions[qIndex - 1] = $scope.lifeQualityData.questions[qIndex];
        $scope.lifeQualityData.questions[qIndex] = _copyItem_;
    };
    // 向下移动问题
    $scope.putDownQuestion = function(qIndex) {
        var _copyItem_ = $scope.lifeQualityData.questions[qIndex + 1];
        $scope.lifeQualityData.questions[qIndex + 1] = $scope.lifeQualityData.questions[qIndex];
        $scope.lifeQualityData.questions[qIndex] = _copyItem_;
    };

    // 只能输入正整数
    $scope.onlyNbr = function(nbr) {

        if (nbr === null || nbr === undefined || nbr < 0) {
            toaster.pop('error', null, '请输入正确的分数');
            return 0;
        }
        return nbr;
    };

    // 分数区间
    $scope.getPiontRange = function() {

        var _min_ = 0,
            _max_ = 0,
            _arry_ = [];

        // 复制一份，避免影响源对象
        angular.copy($scope.lifeQualityData.questions, _arry_);

        for (var i = 0; i < _arry_.length; i++) {
            var _options_ = _arry_[i].options;
            _options_.sort(function(a, b) {
                return a.score - b.score;
            });
            _min_ = _min_ + (_options_[0].score - 0);
            _max_ = _max_ + (_options_[_options_.length - 1].score - 0);
        };
        return {
            min: _min_,
            max: _max_
        }

    };

    // 添加结果显示信息
    $scope.addAnswerInfo = function() {
        $scope.lifeQualityData.scores.push({});
    };
    // 移除结果显示信息
    $scope.removeAnswerInfo = function(index) {
        $scope.lifeQualityData.scores.splice(index, 1);
    };

    // 保存编辑
    $scope.saveEdit = function() {
        if ($scope.totalUploadFilesNum > 1) {
            toaster.pop('waring', null, '图片正常上传，请稍后');
            return;
        }
        var _checkData_ = $scope.lifeQualityData;

        // 没通过校验
        if (!checkData(_checkData_)) return;
        _checkData_.questions.picUrls = $scope.titleImgs;

        _checkData_ = JSON.stringify(_checkData_);


        // 'designer/saveLifeScale'
        $http.post(app.yiliao + 'designer/lifeScale/save', {
            access_token: app.url.access_token,
            jsonData: _checkData_
        }).
        then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                toaster.pop('success', null, '保存成功');
                $state.go('app.care_plan.lifeQualityLibrary');
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
        };

        if (!_checkData_.title) {
            toaster.pop('error', null, '请填写生活量表标题');
            return false;
        };

        if (!_checkData_.desc) {
            toaster.pop('error', null, '请填写生活量表简介');
            return false;
        };

        if (!_checkData_.questions || _checkData_.questions.length < 1) {
            toaster.pop('error', null, '请添加题目');
            return false;
        };

        for (var i = 0; i < _checkData_.questions.length; i++) {
            if (!_checkData_.questions[i].name) {
                toaster.pop('error', null, '请填写Q' + (i + 1) + '题目');
                return false;
            } else {
                for (var j = 0; j < _checkData_.questions[i].options.length; j++) {
                    if (!_checkData_.questions[i].options[j].name) {
                        toaster.pop('error', null, '请填写Q' + (i + 1) + '的第' + (j + 1) + '选项名称');
                        return false;
                    } else if (_checkData_.questions[i].options[j].score === '') {
                        toaster.pop('error', null, '请填写Q' + (i + 1) + '的第' + (j + 1) + '选项分数');
                        return false;
                    } else if (_checkData_.questions[i].options[j].score < 0) {
                        toaster.pop('error', null, '选项分数不能为少于0');
                        return false;
                    };
                };
            };
        };

        var piontRange = $scope.getPiontRange(),
            piontSteo = piontRange.max - piontRange.min,
            record = 0;

        for (var k = 0; k < _checkData_.scores.length; k++) {
            if (!_checkData_.scores[k].showInfo) {
                toaster.pop('error', null, '请填写答案设置的信息');
                return false;
            } else if (_checkData_.scores[k].leftScore === '' ||
                _checkData_.scores[k].rigthScore === '' ||
                _checkData_.scores[k].leftScore > _checkData_.scores[k].rigthScore ||
                _checkData_.scores[k].leftScore < piontRange.min ||
                _checkData_.scores[k].rigthScore > piontRange.max) {

                toaster.pop('error', null, '请正确填写答案设置的得分区域');
                return false;
            };

            record = record + (_checkData_.scores[k].rigthScore - _checkData_.scores[k].leftScore);
        };

        if (_checkData_.scores.length > 1 && piontSteo != (record + (_checkData_.scores.length - 1))) {
            toaster.pop('error', null, '请正确填写答案设置的得分区域');
            return false;
        } else if (_checkData_.scores.length === 1 && piontSteo != record) {
            toaster.pop('error', null, '请正确填写答案设置的得分区域');
            return false;
        };


        if (!_checkData_.groupId) {
            toaster.pop('error', null, '集团ID不能为空');
            return false;
        };


        if ($scope.getPiontRange().max >= 10000) {
            console.log($scope.getPiontRange.max);
            toaster.pop('error', null, '最大分数不能超过9999');
            return false;
        };

        return true;

    };

};

})();
