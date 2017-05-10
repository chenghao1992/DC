'use strict';
(function() {
    angular.module('app').factory('EditCareInfoFtory', EditCareInfoFtory)

    // 手动注入依赖
    EditCareInfoFtory.$inject = ['$http', '$modal'];

    function EditCareInfoFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(planData, callBack) {

            if (!planData) planData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/editInfo.html';
                    else
                        return 'src/tpl/care/carePlan/editInfo.html';
                }(),
                controller: 'EditCareInfoCtrl',
                size: 'lg',
                resolve: {
                    planData: function() {
                        return planData;
                    }
                }
            });
            modalInstance.result.then(function(planData) {
                if (callBack) {
                    callBack(planData);
                }
            });
        };

    };

    angular.module('app').controller('EditCareInfoCtrl', EditCareInfoCtrl);

    EditCareInfoCtrl.$inject = ['$scope', '$http', '$state', '$modal', '$modalInstance','toaster','planData','$timeout'];

    function EditCareInfoCtrl($scope, $http, $state, $modal, $modalInstance, toaster, planData,$timeout) {
        // console.log(planData);
        // $scope.planData = planData;
        $timeout(function(){
           $scope.showBaidu = 1;
        },500);

        if (planData.id) {
            $scope.planData = {
                id: planData.id,
                name: planData.name,
                diseaseTypeName: planData.diseaseTypeName,
                diseaseTypeId: planData.diseaseTypeId,
                price: (planData.price || 0) / 100,
                priceIf: !planData.price ? 'no' : 'yes',
                executeTime: planData.executeTime,
                executeTimeEver: !planData.executeTime,
                titlePic: planData.titlePic,
                digest: planData.digest,
                content: planData.content,
                tmpType: planData.tmpType,
                helpTimes:planData.helpTimes
            };
        } else {
            $scope.planData = {
                helpTimes:0,
                titlePic: 'http://' + window.location.hostname + '/health/web/src/img/careDefault.jpg',
                tmpType: planData.tmpType,
                executeTimeEver: false,
                priceIf: 'no',
                digest: '为您提供病情跟踪提醒、用药提醒、检查提醒、生活质量追踪、医生调查问题、相关提醒多种贴心健康信息服务。',
                content:'<p>为您提供院外的全程看顾，通过手机智能提醒，反馈康复情况，避免反复去医院复诊。 <p><p>提供的服务：</p><p>1、持续性的跟踪与专业指导，促进疾病的康复</p><p>2、就医提醒：定期提醒，防止疾病的复发或恶化</p><p>3、康复指导：贴心、全面的康复指导，促进患者的康复</p><p>4、疾病知识：通俗易懂的疾病知识普及，有利于疾病的预防</p>'
            };
        }


        //获取金钱区间
        getPriceRange();

        function getPriceRange() {
            $http.post(app.urlRoot + 'group/fee/getGroupFee', {
                access_token: app.url.access_token,
                groupId: app.url.groupId()
            }).then(function(rpn) {
                if (rpn.data.resultCode === 1) {
                    if (rpn.data.data && rpn.data.data.carePlanMax >= 0 && rpn.data.data.carePlanMin >= 0) {
                        $scope.carePlanMax = rpn.data.data.carePlanMax / 100;
                        $scope.carePlanMin = rpn.data.data.carePlanMin / 100;
                    } else {
                        $scope.carePlanMax = 0;
                        $scope.carePlanMin = 0;
                    }

                }
            });
        };

        //选择病种分类
        $scope.chooseType = function() {
            var diseaseModal = new DataBox('data_res', {
                hasCheck: false,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: true,
                self: false,
                cover: false,
                leafDepth: 3,
                selectView: false,
                search: {
                    //url: '',
                    //param: {},
                    // searchDepth: [1],
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parentId',
                        dataSet: 'data'
                    },
                    //keyName: 'keyword',
                    unwind: false
                },
                arrType: [0, 0],
                data: {
                    url: app.url.document.getDiseaseTree
                },
                titles: {
                    main: '选择病种',
                    searchKey: '搜索病种...',
                    label: '已选择病种数'
                },
                fixdata: [],
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                response: diseaseSelected,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    leaf: 'leaf',
                    pid: 'parentId',
                }
            });
        };

        // 确认选择病种
        function diseaseSelected(selected) {
            if (selected && selected[0]) {
                $scope.$apply(function() {
                    $scope.planData.diseaseTypeId = selected[0].id;
                    $scope.planData.diseaseTypeName = selected[0].name;
                })
            }
        };

        // 点击收费时如果价格为0(免费) 将价格置为空
        $scope.funPriceYes = function() {
            if(!$scope.planData.price) {
                $scope.planData.price = '';
            }
        }

        // 移除图片
        $scope.removeImg = function() {
            $scope.planData.titlePic = '';
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.saveDoc = function() {
            if (!checkData()) {
                return;
            }
            pushPlan($scope.planData);
        };

        // 提交
        function pushPlan(planData) {

            var param = planData;
            planData.price = (planData.price || 0) * 100;
            param.access_token = app.url.access_token;
            param.groupId = app.url.groupId();
            if (param.price < 0) {
                param.price = 0;
            }
            if (param.priceIf == 'no') {
                param.price = 0;
            }
            if (param.executeTimeEver) {
                param.executeTime = ''
            }

            $http({
                url: app.urlRoot + 'designer/saveCarePlan',
                method: 'post',
                data: param
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1) {
                    toaster.pop('success', null, '保存成功');

                    if (rep.data.tmpType == 1) {
                        $state.go('app.carePlan', {
                            planId: rep.data.id
                        });
                    }
                    if (rep.data.tmpType == 2) {
                        $state.go('app.followUp', {
                            planId: rep.data.id
                        });
                    }
                    $modalInstance.close(rep.data);
                } else if (rep && rep.resultMsg) {
                    toaster.pop('error', null, rep.resultMsg);
                } else {
                    toaster.pop('error', null, '保存失败');
                    console.error(rep);
                }
            });
        };

        // 校验
        function checkData() {
            var _checkData = $scope.planData;
            if (!_checkData.name) {
                toaster.pop('error', null, '请输入计划名称');
                return false;
            }
            if (_checkData.name.length > 40) {
                toaster.pop('error', null, '计划名称过长');
                return false;
            }
            if (!_checkData.diseaseTypeId) {
                toaster.pop('error', null, '请选择病种');
                return false;
            }
            if (_checkData.tmpType == 1) {
                if (_checkData.priceIf != 'no' && (!_checkData.price || _checkData.price < $scope.carePlanMin || _checkData.price > $scope.carePlanMax)) {
                    toaster.pop('error', null, '请输入正确的价格');
                    return false;
                }
                if (!_checkData.titlePic) {
                    toaster.pop('error', null, '请上传题图');
                    return false;
                }
                if (!_checkData.content) {
                    toaster.pop('error', null, '请输入正文');
                    return false;
                }
            }
            if (!_checkData.executeTime && !_checkData.executeTimeEver) {
                toaster.pop('error', null, '请输入执行时长');
                return false;
            }
            if(_checkData.executeTime<0  && !_checkData.executeTimeEver){
              toaster.pop('error', null, '请填写正确的执行天数');
                return false;  
            }
            if (!_checkData.digest) {
                toaster.pop('error', null, '请输入摘要');
                return false;
            }
            if (_checkData.digest.length > 80) {
                toaster.pop('error', null, '计划摘要过长');
                return false;
            }
            if(_checkData.helpTimes<0){
                toaster.pop('error',null,'请填写正确的求助次数');
                return false;
            }
            return true;

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

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;

        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            // $scope.uploadBoxOpen = true;
            $scope.planData.titlePic = null;
        };
        $scope.progressCallBack = function(up, file) {
            $scope.imgFile = file;
            console.log($scope.imgFile);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            // console.log(up, file, info);
            $scope.$apply(function() {
                $scope.planData.titlePic = file.url;
            });
            $scope.fileList = [];
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            // console.error(up, err, errTip);
            toaster.pop('error', null, errTip);
        };

        // 配置百度编辑器上传后获取的文件url参数
        $scope.config = {
            file: {
                urlParams: ''
            }
        }

    };

})();
