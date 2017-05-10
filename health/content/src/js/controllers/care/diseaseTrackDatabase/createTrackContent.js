'use strict';
(function() {
angular.module('app').controller('createTrackContentCtrl', createTrackContentCtrl);

createTrackContentCtrl.$inject = ['$scope', '$sce', '$http', 'toaster', '$state','$modal'];

function createTrackContentCtrl($scope, $sce, $http, toaster, $state, $modal) {
var item='';
    var diseaseTypeId = item.diseaseTypeId ||'';
    $scope.diseaseName = item.diseaseTypeName||'';
    console.log(item.diseaseTypeId);
    var UpadeId = '';

    if (!item.item) {
        $scope.illnessTrack = {
            // 'id': '', //修改时传入
            'name': '题目名称',
            'options': [{
                'seq': '1', //序号
                'name': '选项名称',
                'level': '1', //级别(1:正常、2:异常、3:危险)
                'appendQuestions': []
            }, {
                'seq': '2', //序号
                'name': '选项名称',
                'level': '1', //级别(1:正常、2:异常、3:危险)
                'appendQuestions': []
            }]
        };
    } else {
        $scope.illnessTrack = item.item;
        UpadeId = item.item.id;
    }

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
            'appendQuestions': []
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

    //选择文件上传
    $scope.selectFile = function() {
        $scope.upload();
    };

    // 设置七牛上传获取uptoken的参数
    $scope.token = app.url.access_token;
    // 选择文件后回调
    $scope.uploaderAdded = function(up, files) {

        $scope.uploadPercent = 0;
        //console.log(up, files);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        $scope.fontImgUrl = file.url;
        $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
        $scope.uploadPercent = 100;
        toaster.pop('success', null, '封面修改成功！');
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



    // 收藏并保存
    $scope.ok = function() {
        // console.log($scope.illnessTrack);=
        var json = {
            name: $scope.illnessTrack.name,
            options: $scope.illnessTrack.options,
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
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

};

})();