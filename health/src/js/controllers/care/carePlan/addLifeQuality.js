'use strict';
(function() {
    angular.module('app').factory('AddLifeQualityFtory', AddLifeQualityFtory);

    // 手动注入依赖
    AddLifeQualityFtory.$inject = ['$http', '$modal'];

    function AddLifeQualityFtory($http, $modal) {
        return {
            open: openModel,
            copyLifeQuality: copyLifeQuality
        };

        function openModel(lifeQualityData, callBack) {

            if (!lifeQualityData) lifeQualityData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addLifeQuality/addLifeQuality.html';
                    else
                        return 'src/tpl/care/carePlan/addLifeQuality/addLifeQuality.html';
                }(),
                controller: 'AddLifeQualityCtrl',
                size: 'lg',
                resolve: {
                    lifeQualityData: function() {
                        return lifeQualityData;
                    }
                }
            });
            modalInstance.result.then(function(lifeQualityData) {
                if (callBack)
                    callBack(lifeQualityData);
            });
        };

        // 重复提问
        function copyLifeQuality(repeatAskData, callBack) {
            if (!repeatAskData) repeatAskData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addLifeQuality/repeatAsk.html';
                    else
                        return 'src/tpl/care/carePlan/addLifeQuality/repeatAsk.html';
                }(),
                controller: 'CopyLifeQualityCtrl',
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

    };

    angular.module('app').controller('AddLifeQualityCtrl', AddLifeQualityCtrl);

    AddLifeQualityCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','lifeQualityData'];

    function AddLifeQualityCtrl($scope, $http, $modal, $modalInstance, toaster, lifeQualityData) {
        //预览弹窗
        $scope.lifeQualityCheck = function(lifeScaleId, version) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'lifeQualityCheck.html',
                controller: 'ModallifeQualityCheckCtrl',
                size: 'lg',
                resolve: {
                    lifeid: function() {
                        return lifeScaleId;
                    },
                    version: function() {
                        return version;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                // $scope.companyId = selectedItem.id;
                // $scope.companyName = selectedItem.name;
                // $scope.diseaseData();
            }, function() {});
        };

        $scope.selectItem = {};

        if (lifeQualityData) {
            $scope.selectItem = lifeQualityData.lifeScaleItem;
            $scope.lifeQualityData = lifeQualityData;
        }

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 保存
        $scope.ok = function() {
            if (!$scope.selectItem)
                return toaster.pop('error', null, '请选择生活量表');
            submitLifeQualityData($scope.selectItem);
        };

        // 选择生活量表
        $scope.selectLifeQuality = function(item) {
            $scope.selectItem = {
                lifeScaleId: item.lifeScaleId
            };
        };

        // 提交生活量表
        function submitLifeQualityData(data) {

            var param = {
                access_token: app.url.access_token,
                sendTime: $scope.lifeQualityData.sendTime,
                carePlanId: $scope.lifeQualityData.carePlanId,

                schedulePlanId: $scope.lifeQualityData.schedulePlanId,
                dateSeq: $scope.lifeQualityData.dateSeq,
                jsonData: JSON.stringify({
                    lifeScaleId: data.lifeScaleId
                })
            };

            if ($scope.lifeQualityData.id)
                param.id = $scope.lifeQualityData.id;

            $http.post(app.urlRoot + 'designer/saveLifeScaleItem', param)
                .then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn && rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    } else if (rpn && rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '获取计划数据出错');
                        console.error(rpn);
                    };
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
                    url: app.yiliao + 'group/stat/getNewDiseaseTypeTree',
                    param: {
                        access_token: app.url.access_token,
                        groupId: app.url.groupId(),
                        tmpType: 1,
                        includePlatform: 1
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

        $scope.diseaseTypeId = '';
        $scope.diseaseName = '';
        $scope.pageIndex = 1;
        $scope.pageSize = 10;

        function setTable(diseaseTypeId, pageIndex, pageSize) {

            $http.post(app.yiliao + 'designer/findLifeScaleIncludePlatform', {
                access_token: app.url.access_token,
                groupId: app.url.groupId(),
                diseaseTypeId: diseaseTypeId || $scope.diseaseTypeId || '',
                pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
                pageSize: pageSize || $scope.pageSize || 10
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    $scope.surveyList = rpn.data.pageData;
                    $scope.page_count = rpn.data.total;

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };
        $scope.setTable = setTable;
        $scope.pageChanged = function() {
            setTable();
        };



    };

    angular.module('app').controller('CopyLifeQualityCtrl', CopyLifeQualityCtrl);

    CopyLifeQualityCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','repeatAskData'];
    //量表频率弹窗设置
    function CopyLifeQualityCtrl($scope, $http, $modal, $modalInstance, toaster, repeatAskData) {

        console.log(repeatAskData)
        $scope.thisExecuteTimeOfRepeatList = [];
        $scope.thisExecuteTime = repeatAskData.thisExecuteTime;

        for (var j = 1; j <= repeatAskData.thisExecuteTime; j++) {
            $scope.thisExecuteTimeOfRepeatList.push(j);
        }
        $scope.arraySource = [];
        for (var i = 1; i < 31; i++) {
            $scope.arraySource.push(i);
        }
        $scope.repeatAskData = repeatAskData;
        $scope.repeatAskOption = {};

        $scope.isEnd = true;
        // 设置默认
        function funSetDefault() {
            // $scope.repeatFrequency = {
            //     'repeats': [{
            //         'repeatSeq': 1,
            //         'dateSeq': 1,
            //         'sendTime': (function() {
            //             var splitArry = repeatAskData.sendTime.split(':');
            //             if (splitArry[1] === '00') {
            //                 $scope.result = splitArry[0] + ':30';
            //                 return $scope.result;
            //             } else {
            //                 $scope.result = splitArry[0] - 0 + 1 + ':00';
            //                 return $scope.result;
            //             }
            //             return '09:00'
            //         })()
            //     }]
            // };
            // return $scope.repeatAskOption;
                 $scope.periodNum=1;
                 $scope.periodUnit='天';
                 $scope.durationNum=1;
                 $scope.durationUnit='月';
        }
        funSetDefault();

        // 获取重复问题列表
        (function getReaptList() {
            $http.get(app.urlRoot + 'designer/getRepeatFrequency?access_token='+app.url.access_token+'&careItemId='+repeatAskData.careItem.id)
            .then(function(rpn) {
                rpn = rpn.data;
                if (rpn && rpn.resultCode == 1) {
                    if (rpn.data!=undefined) {
                        $scope.repeatAskOption.repeats = rpn.data;
                        $scope.periodNum=rpn.data.periodNum
                        $scope.periodUnit=rpn.data.periodUnit;
                        $scope.durationNum=rpn.data.durationNum;
                        $scope.durationUnit=rpn.data.durationUnit;
                    } else {
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
            console.log(item)
            console.log(arry)
            console.log($scope.repeatAskOption.repeats)
            // var index = arry.indexOf(item);
            arry.splice(item, 1);
            console.log($scope.repeatAskOption.repeats)
            // $scope.timeFilterArry(null,repeatAskOption.repeats.dateSeq);
            // $scope.$apply();
            // funSetDefault();

        };
        // $scope.removeItem = function(item, arry) {
        //     console.log(item)
        //     console.log(arry)
        //     console.log($scope.repeatAskOption.repeats)
        //     var index = arry.indexOf(item);
        //     arry.splice(index, 1);
        //     console.log($scope.repeatAskOption.repeats)
        //     // $scope.timeFilterArry(null,repeatAskOption.repeats.dateSeq);
        //     // $scope.$apply();
        //     // funSetDefault();
        //     $scope.timeFilterArry(item.sendTime,item.dateSeq);
        // };

        // 添加重复时间
        $scope.addReaptOption = function(filtersJson) {
            var filters = JSON.parse(filtersJson);

            $scope.repeatAskOption.repeats.push({
                'repeatSeq': 1,
                'dateSeq': (function() {
                    if ($scope.repeatAskOption.repeats && $scope.repeatAskOption.repeats.length > 0) {
                        var dateSeq = $scope.repeatAskOption.repeats[$scope.repeatAskOption.repeats.length - 1].dateSeq;
                        return dateSeq;
                    } else {
                        return 1
                    }
                })(),
                'sendTime': (function() {
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
                })()
            });
        };

        $scope.timeFilterArry = function(exception, dateSeq) {
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
            // return JSON.stringify(_resultArry);
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

        // {
        //     'repeats': [{
        //         'repeatSeq': '第?次重复',
        //         'dateSeq': '发送日期',
        //         'sendTime': '发送时间'
        //     }]
        // }


        // 保存
        $scope.ok = function() {

            var json = {
               periodNum:$scope.periodNum,
               periodUnit:$scope.periodUnit,
               durationNum:$scope.durationNum,
               durationUnit:$scope.durationUnit
            };

            $http.post(app.urlRoot + 'designer/saveRepeatFrequency', {
                access_token: app.url.access_token,
                careItemId: repeatAskData.careItem.id,
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

angular.module('app').controller('ModallifeQualityCheckCtrl', ModallifeQualityCheckCtrl);

ModallifeQualityCheckCtrl.$inject = ['$scope', '$stateParams', 'lifeid', 'version','$http','$modalInstance'];

function ModallifeQualityCheckCtrl($scope, $stateParams, lifeid, version, $http, $modalInstance) {
    $scope.groupDomId=app.url.groupId();
    if (lifeid && version) {
        $http.post(app.yiliao + 'designer/findLifeScaleByOne', {
            access_token: app.url.access_token,
            lifeScaleId: lifeid,
            version: version
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                $scope.lifeQualityData = rpn.data;
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();

