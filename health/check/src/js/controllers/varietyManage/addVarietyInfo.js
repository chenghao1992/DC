'use strict';
(function() {
    
//品种库管理
angular.module('app').controller('addVarietyInfoCtrl', addVarietyInfoCtrl);
addVarietyInfoCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce'];
function addVarietyInfoCtrl($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce) {
    //初始化参数
    var access_token = app.url.access_token,
     drugCompanyParam = '';
     $scope.drugType=2;
    var groupId = $stateParams.id;
    // $scope.approvalDate = new Date();
    $scope.todayDate = new Date();
    //先加载百度富文本需要的js（百度编辑器的bug）
    $.getScript("../components/ngUmeditor/umeditor/umeditor.min.js", function() {
        $.getScript('../components/ngUmeditor/umeditor/umeditor.config.js', function() {

        })
    });
    //初始化品种组信息
    $scope.InitGoodGroup = function(groupId) {
        $http.post(app.url.VartMan.viewGoodsGroup, {
            access_token: app.url.access_token,
            id: groupId
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.GGData = data.data;
                $scope.packNum='';
                $scope.units='';
                $scope.packUnit='';
                $scope.unitsN='';
                $scope.packUnitN='';
                //百度富文本的一个bug
                $timeout(function () {
                    $scope.timing=0;
                },800);
            }
        }).error(function(e) {
            console.log(e)
        })
    };
    $scope.numInit = function(e) {
        var keyCode = event.keyCode;

        var isNumberCorrect = e ? e.toString().indexOf('.') : -1;

        var dotLength = true;
        if (isNumberCorrect >= 0) {
            if (keyCode == 46) {
                event.returnValue = false;
                return;
            }
            dotLength = e.toString().split('.')[1].length > 1 ? false : true;
        }

        if ((keyCode >= 48 && keyCode <= 57 || keyCode == 46) && dotLength) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }
    $scope.InitGoodGroup(groupId);
    //初始化包装单位
    (function() {
            $http.post(app.url.drug.getAvailUnitList, {
                access_token: app.url.access_token,
                id: groupId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.packUnitList = data.data;
                    //console.log($scope.GGData)
                }
            }).error(function(e) {
                console.log(e)
            });
            //管理类别列表
            function initMngTypeList() {
                $http.post(app.url.VartMan.getAvailManageTypeList, {
                    access_token: app.url.access_token
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        $scope.manageTypes = data.data;
                        //console.log($scope.GGData)
                    }
                }).error(function(e) {
                    console.log(e)
                });
            }
            initMngTypeList();
            //产品类别列表
            function initBizTypeList() {
                $http.post(app.url.VartMan.getAvailBizTypeList, {
                    access_token: app.url.access_token
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        $scope.productTypes = data.data;
                        //console.log($scope.GGData)
                    }
                }).error(function(e) {
                    console.log(e)
                });
            }
            initBizTypeList();
            //查询有效的服药单位列表
            function initAvailDoseList() {
                $http.post(app.url.drug.getAvailDoseList, {
                    access_token: app.url.access_token
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        $scope.AvailDoseList = data.data;
                        //console.log($scope.GGData)
                    }
                }).error(function(e) {
                    console.log(e)
                });

            }
            initAvailDoseList();
        }

    )();
    //剂型*
    (function() {
        $http.post(app.url.VartMan.getAvailFormList, {
            access_token: app.url.access_token,
            valid: 0 // 是否禁用
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.formList = data.data;
                //console.log($scope.GGData)
            }
        }).error(function(e) {
            console.log(e)
        });

    })();

    //选择适应症
    $scope.ChooseIndications = function() {
        var tagsModal = new DataBox('data_res', {
            hasCheck: true,
            allCheck: false,
            leafCheck: false,
            multiple: true,
            allHaveArr: false,
            self: true,
            cover: false,
            leafDepth: 3,
            selectView: true,
            search: {
                searchDepth: [2],
                dataKey: {
                    name: 'name',
                    id: 'id',
                    union: 'parentId',
                    dataSet: 'data'
                },
                unwind: false
            },
            arrType: [0, 0],
            data: {
                url: app.url.document.getDiseaseTree
            },
            titles: {
                main: '选择适应症',
                searchKey: '搜索适应症...',
                label: '已选择适应症'
            },
            icons: {
                arrow: 'fa fa-caret-right/fa fa-caret-down',
                check: 'fa fa-check/fa fa-square',
                root: 'fa fa-hospital-o cfblue',
                branch: 'fa fa-h-square cfblue',
                leaf: 'fa fa-stethoscope dcolor',
                head: 'headPicFileName'
            },
            fixdata: $scope.keywords,
            response: tagsSelected,
            datakey: {
                id: 'id',
                name: 'name',
                sub: 'children'
            },
            info: {
                name: 'name',
                id: 'id',
                leaf: 'leaf'
            }

        });

    };

    function tagsSelected(dt) {
        var str = '';
        $scope.indications = [];
        for (var i = 0; i < dt.length; i++) {
            str += dt[i].name + ',';
            $scope.indications.push(dt[i].id);
        }
        var tagsList = [];
        for (var j = 0; j < dt.length; j++) {
            tagsList.push({ "name": dt[j].name, "id": dt[j].id });
        }
        $timeout(function() {
            $scope.indicationsInfo = str;
            $scope.indicationsListJson = JSON.stringify(tagsList);
        }, 100);
    }
    $scope.drugLists = [];
    //添加一行用法用量
    $scope.addUseLine = function() {
        var obj = {
            "periodNum": '',
            "periodTime": '',
            "times": '',
            "quantity": '',
            "unit": $scope.units,//下拉选择服药单位对应的id
            "method": '',
            "patients": ''
        };
        $scope.drugLists.push(obj);
    };
    //删除一行用法用量
    $scope.deleteUseLine = function(idx) {
        if ($scope.drugLists.length > 1) {
            $scope.drugLists.splice(idx, 1);
        }
    };

    // //获取下拉选择服药单位对应的name
    $scope.unitss=function () {
        var units = document.getElementById('units');
        for(var i = 0; i < units.options.length; i++){
            var opt = units.options[i];
            if (opt.selected) {
                console.log(opt.id);
                $scope.unitsN =opt.id;
            };
        }
    }
    //获取下拉选择包装单位对应的name
    $scope.packUnits=function () {
        var packUnit = document.getElementById('packUnit');
        for(var i = 0; i < packUnit.options.length; i++){
            var opt = packUnit.options[i];
            if (opt.selected) {
                console.log(opt.id);
                $scope.packUnitN =opt.id;
            };
        }
    }

    $scope.required = true;
    $scope.save = function() {
        if(!$scope.drugFormCode){
            toaster.pop('error', null, '品种编码不能够为空！');
            return;
        }else if (!$scope.specification) {
            toaster.pop('error', null, '品种规格不能够为空！');
            return;
        }else if(!/^\d{1,6}(\.\d{1,2})?$/.test($scope.packNum)||$scope.packNum < 0.01){
            toaster.pop('error', null, '包装规格数量必须在0.01~999999.99之间！');
            return;
        }else if (!$scope.units) {
            toaster.pop('error', null, '包装规格中的服药单位未选择！');
            return;
        }else if (!$scope.packUnit) {
            toaster.pop('error', null, '包装规格中的包装单位未选择！');
            return;
        }else if (!$scope.number) {
            toaster.pop('error', null, '品种批准文号不能够为空！');
            return;
        }else if (!$scope.form) {
            toaster.pop('error', null, '品种剂型不能够为空！');
            return;
        }else if (!$scope.manageType) {
            toaster.pop('error', null, '品种管理类别不能够为空！');
            return;
        } else if (!$scope.productType) {
            toaster.pop('error', null, '品种产品类别不能够为空！');
            return;
        }else  if(!$scope.indicationsDes){
            toaster.pop('error', null, '请填写适应症说明！');
            return;
        }else  if(!$scope.generalUsageDes){
            toaster.pop('error', null, '请填写常规用法说明！');
            return;
        }

        var len = $scope.drugLists.length; //用法用量长度
        if(len==0){
            toaster.pop('error', null, '请填写用法用量信息');
            return;
        }else {
            for (var i = 0; i < len; i++) {
                if (!$scope.drugLists[i].patients) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的适用群体未填写');
                    return;
                } else if (!$scope.drugLists[i].periodNum) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法数量未填写');
                    return;
                } else if (!$scope.drugLists[i].periodTime) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法单位未选择');
                    return;
                } else if (!$scope.drugLists[i].times) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法次数未选择');
                    return;
                } else if (!(/^\d{1,2}(\.\d{1})?$/).test($scope.drugLists[i].quantity) || ($scope.drugLists[i].quantity) <0.1) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用量录入值错误，用量录入值必须在”0.1~99.9“之间');
                    return;
                } else if (!$scope.drugLists[i].unit) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用量单位未填写');
                    return;
                }
            }
        }
        //包装规格拼接（3毫升/盒）
        $scope.packSpecification = Number($scope.packNum) + $scope.unitsN + '/' + $scope.packUnitN;
        //是否慢病用药，1：慢病用药,2：非慢病用药
        if($scope.drugType==true){
            $scope.drugType =1;
        }else if($scope.drugType==false){
            $scope.drugType =2;
        }

        var drugFinal = JSON.stringify($scope.drugLists);
        //console.log(drugList1);

        var timestamp2 = Date.parse(new Date($scope.approvalDate));
        //timestamp2 = timestamp2 / 1000;
        // var apvData = parseInt($scope.approvalDate / 1000);
        $scope.manual = document.getElementById('ngUmeditorContainer').innerHTML;//获取百度富文本框内容
        $http.post(app.url.VartMan.addGoods, {
            access_token: app.url.access_token,
            groupId: groupId,
            drugFormCode:$scope.drugFormCode ||'',
            generalName: $scope.GGData.generalName || '',
            specification: $scope.specification || '',
            packSpecification: $scope.packSpecification || '',
            specificationCaption: $scope.specificationCaption || '',
            packUnit: $scope.packUnit || '',
            form: $scope.form || '',
            number: $scope.number || '',
            approvalDate: timestamp2 || '',
            indicationListJson: $scope.indicationsListJson || '',
            pharmacoTypes: $scope.pharmacoTypes || '',
            imageUrl: $scope.titlePic || '',
            manual: $scope.manual || '',
            drugUsage: drugFinal || '',
            source: '0',
            drugType:$scope.drugType ||'',
            manageType: $scope.manageType || '',
            productType: $scope.productType || '',
            indicationsDes:$scope.indicationsDes ||'',
            generalUsageDes:$scope.generalUsageDes ||''
        }).success(function(data) {

            if (data.resultCode == 1) {
                //$scope.GGData=data.data;
                toaster.pop('success', null, "添加成功");
                $state.go('app.VarietyManage.list');
                $scope.isGoodSave = true;
                //console.log($scope.GGData)
            } else {
                toaster.pop('error', null, data.resultMsg);
                $scope.isGoodSave = false;
            }

        }).error(function(e) {
            console.log(e)
        })
    };

    $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
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
        $scope.titlePic = null;
    };
    $scope.progressCallBack = function(up, file) {
        $scope.imgFile = file;
        //console.log($scope.imgFile);
    };
    // 每个文件上传成功回调
    $scope.uploaderSuccess = function(up, file, info) {
        //console.log(up, file, info);
        $scope.$apply(function() {
            $scope.titlePic = file.url;
        });
        $scope.fileList = [];
    };
    // 每个文件上传失败后回调
    $scope.uploaderError = function(up, err, errTip) {
        // console.error(up, err, errTip);
        toaster.pop('error', null, errTip);
    };
    //判断输入的数是否为正数
    $scope.checkIsCorrectNum = function(e, content) {
        // if(!/^\d{1,6}(\.\d{1,2})?$/.test(e)){
        //     toaster.pop('error', null, content+'数量必须在0.01~999999.99之间！');
        // }
     }
        //返回上一页
    $scope.GoBack = function() {
        history.back(-1);
    };


};

})();
