'use strict';
(function() {

    //品种库管理
    angular.module('app').controller('editVarietyInfoCtrl', editVarietyInfoCtrl);
    editVarietyInfoCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce'];

    function editVarietyInfoCtrl($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce) {
        //初始化参数
        var access_token = app.url.access_token;
        var vartId = $stateParams.vartId;
        //先加载百度富文本需要的js（百度编辑器的bug）
        $.getScript("../components/ngUmeditor/umeditor/umeditor.min.js", function() {
            $.getScript('../components/ngUmeditor/umeditor/umeditor.config.js', function() {

            })
        });
        //初始化品种组信息
        $scope.InitGoodGroup = function(vartId) {
            $http.post(app.url.VartMan.viewGoods, {
                access_token: app.url.access_token,
                id: vartId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $timeout(function () {
                        $scope.Data = data.data;
                        $scope.titlePic = $scope.Data.imageUrl;

                        //拆分packSpecification字段
                        $scope.Data.specificat = $scope.Data.packSpecification.split('/');
                        $scope.Data.unitsN = $scope.Data.specificat[0].replace(/\d+/g,'').replace('.','');//服药单位
                        $scope.Data.packNum = $scope.Data.specificat[0].replace(/[^\d.]/g,'');//数量
                        $scope.Data.packUnitN =$scope.Data.specificat[1];//包装单位

                        for(var i=0;i<$scope.AvailDoseList.length;i++){
                             if($scope.AvailDoseList[i]['name']==$scope.Data.unitsN){
                                 $scope.Data.units =$scope.AvailDoseList[i]['id'];
                             }
                        }
                        //是否慢病用药，1：慢病用药,2：非慢病用药
                        if($scope.Data.drugType==1){
                            $scope.Data.drugType =true;
                        }else if($scope.Data.drugType==2 || $scope.Data.drugType==undefined){
                            $scope.Data.drugType =false;
                        }
                        if ($scope.Data.approvalDate) {
                            var timestamp = $scope.Data.approvalDate;
                            var d = new Date(timestamp); //根据时间戳生成的时间对象
                            var date1 = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
                            $scope.dt = date1;
                        }
                        var str = '';
                        for (var i = 0; i < $scope.Data.pharmacoTypes.length; i++) {
                            str += $scope.Data.pharmacoTypes[i].name + ',';
                        }
                        $scope.pharmacoTypesText = str;
                        //百度富文本的一个bug
                        $timeout(function () {
                            $scope.timing=0;
                        },800);
                        //$scope.umeditor.replaceHtml($scope.Data.manual || '');
                        //document.getElementById('ngUmeditorContainer').innerHTML=$scope.Data.manual;
                    },300);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(e) {})
        };
        //初始化包装单位
        function initNormalData(callback) {

            initAvailDoseList();
            initAvailFormList();
            initUnitList();
            initMngTypeList();
            initBizTypeList();

            callback();

        }
        initNormalData(function() {
            $scope.InitGoodGroup(vartId);
        });

        function initUnitList() {
            $http.post(app.url.drug.getAvailUnitList, {
                access_token: app.url.access_token

            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.packUnitList = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });
        }

        //管理类别列表
        function initMngTypeList() {
            $http.post(app.url.VartMan.getAvailManageTypeList, {
                access_token: app.url.access_token
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.manageTypes = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });
        }

        //产品类别列表
        function initBizTypeList() {
            $http.post(app.url.VartMan.getAvailBizTypeList, {
                access_token: app.url.access_token
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.productTypes = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });
        }
        //查询有效的服药单位列表
        function initAvailDoseList() {
            $http.post(app.url.drug.getAvailDoseList, {
                access_token: app.url.access_token
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.AvailDoseList = data.data;
                }
            }).error(function(e) {
                console.log(e)
            });

        }
        //查询有效的剂型*
        function initAvailFormList() {
            $http.post(app.url.VartMan.getAvailFormList, {
                access_token: app.url.access_token

            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.formLists = data.data;


                }
            }).error(function(e) {
                console.log(e)
            });
        }

        //添加一行用法用量
        $scope.addUseLine = function() {
            var obj = {
                "periodNum": '1',
                "periodTime": '天',
                "times": '',
                "quantity": '',
                "unit": $scope.Data.units,
                "method": '',
                "patients": ''
            };
            $scope.Data.drugUsegeList.push(obj);
        };
        //删除一行用法用量
        $scope.deleteUseLine = function(idx) {
            if ($scope.Data.drugUsegeList.length > 1) {
                $scope.Data.drugUsegeList.splice(idx, 1);
            }
        };

        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        //获取下拉选择服药单位对应的name
        $scope.unitss=function () {
            var units = document.getElementById('units');
                for(var i = 0; i < units.options.length; i++){
                    var opt = units.options[i];
                    if (opt.selected) {
                        console.log(opt.id);
                        $scope.Data.unitsN =opt.id;
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
                   $scope.Data.packUnitN =opt.id;
               };
           }
       }
        //判断输入的数是否为正数
        $scope.checkIsCorrectNum = function(e, content) {
            // if(!/^\d{1,2}(\.\d{1})?$/.test(e)){
            //     toaster.pop('error', null, content+'数量必须在0.01~999999.99之间！');
            // }
        }
        //输入最多两位小数点，不能为负数
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
        //更新品种信息
        $scope.update = function() {
            if(!$scope.Data.drugFormCode){
                toaster.pop('error', null, '品种编码未填写！');
                return;
            }else if (!$scope.Data.specification) {
                toaster.pop('error', null, '品种规格不能够为空！');
                return;
            }else if(!/^\d{1,6}(\.\d{1,2})?$/.test($scope.Data.packNum)||$scope.Data.packNum < 0.01){
                toaster.pop('error', null, '包装规格数量必须在0.01~999999.99之间！');
                return;
            }else if(!$scope.Data.units){
                toaster.pop('error', null, '包装规格中的服药单位未选择！');
                return;
            }else if (!$scope.Data.packUnit) {
                toaster.pop('error', null, '包装规格中的包装单位未选择！');
                return;
            }else if (!$scope.Data.number) {
                toaster.pop('error', null, '品种批准文号不能够为空！');
                return;
            }else if (!$scope.Data.form) {
                toaster.pop('error', null, '品种剂型不能够为空！');
                return;
            }else if (!$scope.Data.manageType) {
                toaster.pop('error', null, '品种管理类别不能够为空！');
                return;
            } else if (!$scope.Data.productType) {
                toaster.pop('error', null, '品种产品类别不能够为空！');
                return;
            }else if(!$scope.Data.indicationsDes){
                toaster.pop('error', null, '请填写适应症说明！');
                return;
            }else if(!$scope.Data.generalUsageDes){
                toaster.pop('error', null, '请填写常规用法说明！');
                return;
            }
            for (var i = 0, len = $scope.Data.drugUsegeList.length; i < len; i++) {
                if (!$scope.Data.drugUsegeList[i].patients) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的适用群体未填写');
                    return;
                } else if (!$scope.Data.drugUsegeList[i].periodNum) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法数量未填写');
                    return;
                } else if (!$scope.Data.drugUsegeList[i].periodTime) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法单位未选择');
                    return;
                } else if (!$scope.Data.drugUsegeList[i].times) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法次数未选择');
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用法次数未选择');
                    return;
                } else if (!(/^\d{1,2}(\.\d{1})?$/).test($scope.Data.drugUsegeList[i].quantity) ||($scope.Data.drugUsegeList[i].quantity) <0.1) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用量录入值错误，用量录入值必须在”0.1~99.9“之间');
                    return;
                } else if (!$scope.Data.drugUsegeList[i].unit) {
                    toaster.pop('error', null, '用法用量第' + (i + 1) + '行中的用量单位未填写');
                    return;
                }
            }
            var drugFinal = JSON.stringify($scope.Data.drugUsegeList);
            var apvData = (Date.parse(new Date($scope.Data.approvalDate)));
            //包装规格拼接（3毫升/盒）
            $scope.Data.packSpecification = Number($scope.Data.packNum) + $scope.Data.unitsN + '/' + $scope.Data.packUnitN;
            //是否慢病用药，1：慢病用药,2：非慢病用药
            if($scope.Data.drugType==true){
                $scope.Data.drugType =1;
            }else if($scope.Data.drugType==false){
                $scope.Data.drugType =2;
            }

            $http.post(app.url.VartMan.updateGoods, {
                access_token: app.url.access_token,
                id: vartId || '',
                groupId: $scope.Data.groupId || '',
                drugFormCode:$scope.Data.drugFormCode ||'',
                generalName: $scope.Data.generalName || '',
                specification: $scope.Data.specification || '',
                specificationCaption: $scope.Data.specificationCaption || '',
                packSpecification: $scope.Data.packSpecification || '',
                packUnit: $scope.Data.packUnit || '',
                form: $scope.Data.form || '',
                number: $scope.Data.number || '',
                approvalDate: apvData || '',
                indications: $scope.Data.indications || '',
                indicationListJson: $scope.indicationListJson || '',
                pharmacoTypes: $scope.Data.pharmacoTypes || '',
                imageUrl: $scope.titlePic || '',
                manual: $scope.Data.manual || '',
                drugUsage: drugFinal || '',
                source: '0',
                manageType: $scope.Data.manageType || '',
                drugType:$scope.Data.drugType ||'',
                productType: $scope.Data.productType || '',
                indicationsDes:$scope.Data.indicationsDes ||'',
                generalUsageDes:$scope.Data.generalUsageDes ||''
            }).success(function(data) {
                if (data.resultCode == 1) {
                    //$scope.GGData=data.data;
                    toaster.pop('success', null, "更新成功");
                    $state.go('app.VarietyManage.list');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(e) {
                console.log(e)
            })
        };

        //编辑弹窗内容
        angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
        ModalCompanyCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'vartId', 'groupId', 'specification', 'packSpecification'];

        function ModalCompanyCtrl($scope, $state, $uibModalInstance, vartId, groupId, specification, packSpecification) {
            //确定就禁用
            $scope.specification = specification;
            $scope.packSpecification = packSpecification;
            $scope.modal1 = function() {
                $http.post(app.url.VartMan.disableTheGoods, {
                    access_token: app.url.access_token,
                    id: vartId,
                    groupId: groupId
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "禁用成功");
                        $uibModalInstance.close('ok');
                        $state.reload();
                        // $scope.Data.valid=1;
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).error(function(e) {
                    console.log(e)
                })
            };
            //取消
            $scope.modalCancel = function() {
                $uibModalInstance.close('cancel');
            };



        };
        //确定就删除
        angular.module('app').controller('ModaldeleteCompanyCtrl', ModaldeleteCompanyCtrl);
        ModaldeleteCompanyCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'vartId', 'groupId', 'specification', 'packSpecification', 'tradeName', 'generalName'];

        function ModaldeleteCompanyCtrl($scope, $state, $uibModalInstance, vartId, groupId, specification, packSpecification, tradeName, generalName) {
            $scope.specification = specification;
            $scope.packSpecification = packSpecification;
            $scope.tradeName = tradeName;
            $scope.generalName = generalName;
            $scope.modalOk = function() {
                $http.post(app.url.VartMan.deleteGoods, {
                    access_token: app.url.access_token,
                    id: vartId,
                    groupId: groupId
                }).success(function(data) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "删除成功");
                        $uibModalInstance.close('ok');
                        $state.go('app.VarietyManage.list');
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).error(function(e) {
                    console.log(e)
                })
            };
            $scope.modalCancel = function() {
                $uibModalInstance.close('cancel');
            };
        };
        //删除品种
        $scope.delete = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalDelete.html',
                controller: 'ModaldeleteCompanyCtrl',
                size: 'lg',
                resolve: {
                    vartId: function() {
                        return vartId;
                    },
                    groupId: function() {
                        return $scope.Data.groupId;
                    },
                    specification: function() {
                        return $scope.Data.specification;
                    },
                    packSpecification: function() {
                        return $scope.Data.packSpecification;
                    },
                    tradeName: function() {
                        return $scope.Data.tradeName;
                    },
                    generalName: function() {
                        return $scope.Data.generalName;
                    }

                }
            });
        };
        //禁用品种
        $scope.disable = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModeldesete.html',
                controller: 'ModalCompanyCtrl',
                size: 'lg',
                resolve: {
                    vartId: function() {
                        return vartId;
                    },
                    groupId: function() {
                        return $scope.Data.groupId;
                    },
                    specification: function() {
                        return $scope.Data.specification;
                    },
                    packSpecification: function() {
                        return $scope.Data.packSpecification;
                    }
                }
            });
        };
        //启用品种
        $scope.enabledGood = function() {
            $http.post(app.url.VartMan.enableTheGoods, {
                access_token: app.url.access_token,
                id: vartId,
                groupId: $scope.Data.groupId
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "启用成功");
                    //$scope.Data.stateAudit=2;
                    $scope.Data.valid = 0;
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(e) {
                console.log(e)
            })
        };
        //选择适应症
        $scope.ChooseIndications = function() {
            var tagsModal = new DataBox('data_res', {
                hasCheck: true,
                allCheck: false,
                leafCheck: false,
                multiple: true,
                allHaveArr: false,
                self: true,
                cover: true,
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
                    main: '选择类别',
                    searchKey: '搜索类别...',
                    label: '已选择类别'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                fixdata: $scope.Data.indicationsList,
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
            for (var i = 0; i < dt.length; i++) {
                str += dt[i].name + ',';
            }
            $scope.Data.indicationsText = str;


            var tagsList = [];
            for (var j = 0; j < dt.length; j++) {
                tagsList.push({ "name": dt[j].name, "id": dt[j].id });
            }
            $timeout(function() {
                $scope.indicationsInfo = str;
                $scope.indicationListJson = JSON.stringify(tagsList);
            }, 100);
        }

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };
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
        //返回上一页
        $scope.GoBack = function() {
            history.back(-1);
        }
    };

})();
