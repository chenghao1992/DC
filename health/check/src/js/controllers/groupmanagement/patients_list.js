'use strict';
(function() {

angular.module('app').controller('patientsCtlr', patientsCtlr);
patientsCtlr.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce','modal'];
function patientsCtlr($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce,modal) {

    var access_token = app.url.access_token;
    $scope.patient={
        pageIndex:1,
        pageSize:10
    }

    $scope.company={
        cPageIndex:1,
        cPageSize:10
    }

    $scope.disease={
        dPageIndex:1,
        dPageSize:10
    }
    $scope.pageSize = 10;
    $scope.pageIndex =1;
    $scope.isActive = $stateParams.username;
    $scope.cPageSize = 10;
    $scope.cPageIndex =1;
    $scope.dPageSize = 10;
    $scope.dPageIndex =1;
    var params={},url;
    $scope.patientsData = function (pageIndex, pageSize) {
        //医生
            url=app.url.group.getRecommendDocList;
            params= {
                access_token: app.url.access_token,
                isApp: false,
                groupId: 'platform',
                pageIndex: pageIndex-1,
                pageSize: pageSize,
                source: 'web'
            }


        $http.post(url, params

        ).success(function(data) {
                // $scope.patient.pageIndex=data.data.pageIndex;
                $scope.docData = data.data.pageData;

                console.info($scope.dortorData);
                $scope.totia = data.data;
                console.log($scope.totia);

        }).error(function(e) {

        })
    };
    $scope.patientsData( $scope.patient.pageIndex,$scope.patient.pageSize);
    $scope.pageChanged = function(pageIndex, pageSize) {
        $scope.patientsData(pageIndex, pageSize);
    };
    // 推荐集团列表


    $scope.companyData = function _companyData(cPageIndex,cPageSize) {
        $http.post(app.url.group.getGroupRecommendedList, {
            access_token: access_token,
            pageIndex: cPageIndex-1,
            pageSize: cPageSize
        }).success(function(groupdata) {

            $scope.companyGroup = groupdata.data.pageData;
            $scope.groupTotia = groupdata.data;
        }).error(function(e) {

        })
    }
    $scope.companyData($scope.company.cPageIndex,$scope.company.cPageSize);

    $scope.companyPageChange=function (cPageIndex,cPageSize) {

        $scope.companyData(cPageIndex, cPageSize);
    }
    //疾病列表
    $scope.diseaseData = function(dPageIndex,dPageSize) {

        $http.post(app.url.group.getCommonDiseases, {
            access_token: access_token,
            pageIndex: dPageIndex-1,
            pageSize: dPageSize

        }).success(function(disedata) {
            $scope.diseaData = disedata.data.pageData;
            $scope.diseaTotia = disedata.data;
            console.log($scope.diseaTotia.total);
        }).error(function(e) {

        })
    }
    $scope.diseaseData($scope.disease.dPageIndex,$scope.disease.dPageSize);
    $scope.diseasePageChange=function (dPageIndex,dPageSize) {
        $scope.diseaseData(dPageIndex, dPageSize);
    }
    //移除疾病
    $scope.deletedisea = function(item) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'deletediseadome.html',
            controller: 'ModaldeleteCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function(status) {
            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            if(status=='ok'){
                $scope.diseaseData($scope.disease.dPageIndex, $scope.disease.dPageSize);
            }
            
        }, function() {});

    }
    angular.module('app').controller('ModaldeleteCtrl', ModaldeleteCtrl);
    ModaldeleteCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeleteCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.removeCommonDisease, {
                access_token: access_token,
                diseaseId: items
            }).success(function(data) {
                toaster.pop('success', null, '移除推荐疾病成功');
                $uibModalInstance.close('ok');

            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };

    //上移疾病
    $scope.updisea = function(item,dPageIndex, dPageSize) {
            $http.post(app.url.group.riseCommonDisease, {
                access_token: access_token,
                diseaseId: item
            }).success(function(data) {
                toaster.pop('success', null, '上移推荐疾病成功');
                $scope.diseaseData(dPageIndex, dPageSize);
            })
        }
        //移除推荐集团
    $scope.deletegruop = function(item,cPageIndex,cPageSize) {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'deletegruopdome.html',
            controller: 'ModaldeletegruopCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            // $scope.companyData();
            $scope.companyData($scope.company.cPageIndex,$scope.company.cPageSize);
        }, function() {});
    };
    angular.module('app').controller('ModaldeletegruopCtrl', ModaldeletegruopCtrl);
    ModaldeletegruopCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeletegruopCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.removeGroupRecommended, {
                access_token: access_token,
                groupId: items
            }).success(function(data) {
                toaster.pop('success', null, '移除推荐集团成功');
                $uibModalInstance.close('center');
            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };

    //上移集团
    $scope.riseRegruop = function(item,cPageIndex,cPageSize) {
            $http.post(app.url.group.riseRecommendedOfGroup, { access_token: access_token, groupId: item }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '上移集团成功');
                    // $scope.companyData();
                    $scope.companyData(cPageIndex,cPageSize);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            })

        }
        //移除推荐医生
    $scope.deletedroder = function(item,pageIndex,pageSize) {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'deletedorterdome.html',
            controller: 'ModaldeletedorterCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return item;
                },
                pageidex:function(){
                    return pageIndex;
                },
                pagesize:function(){
                    return pageSize;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            $scope.patientsData(pageIndex,pageSize);
        }, function() {});
    };
    angular.module('app').controller('ModaldeletedorterCtrl', ModaldeletedorterCtrl);
    ModaldeletedorterCtrl.$inject = ['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'toaster'];
    function ModaldeletedorterCtrl($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk = function() {
            $http.post(app.url.group.delDoctor, {
                access_token: access_token,
                id: items
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '移除推荐医生成功');
                    $uibModalInstance.close('center');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }

            })
        };
        $scope.modalCancel = function() {
            $uibModalInstance.close('center');
        };
    };


    //推荐医生
    $scope.setdroder = function(item, sum,pageIndex,pageSize) {
            $scope.sum = sum;
            if ($scope.sum == 1) {
                $http.post(app.url.group.setRecommend, {
                    access_token: access_token,
                    id: item,
                    isRecommend: 1

                }).success(function(data) {
                    if (data.resultCode==1) {
                        toaster.pop('success', null, '推荐医生成功');
                        $scope.patientsData(pageIndex,pageSize);
                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                })
            } else if ($scope.sum == 2) {
                $http.post(app.url.group.setRecommend, {
                    access_token: access_token,
                    id: item,
                    isRecommend: 2
                }).success(function(data) {
                    if (data) {
                        toaster.pop('success', null, '取消推荐医生');
                        $scope.patientsData(pageIndex,pageSize);
                    }
                })
            }

        }
        //上移医生
    $scope.riseReDoctor = function(item,pageIndex,pageSize) {
        $http.post(app.url.group.upWeight, {
            access_token: access_token,
            id: item
        }).success(function(data) {
            toaster.pop('success', null, '上移医生成功');
            $scope.patientsData(pageIndex, pageSize);
        })
    }

    function tagsSelected(dt) {
        $scope.keywords = dt;
        $scope.$apply($scope.keywords);
    }
    $scope.removeItem = function(item) {
        var index = $scope.keywords.indexOf(item);
        $scope.keywords.splice(index, 1);
    };


    //推荐集团按钮
    $scope.ChooseCompany = function() {
        var modalInstance = $modal.open({
            animation: true,
            //templateUrl:'test.html',
            templateUrl: 'myModalPatients.html',
            controller: 'ModalCompanyCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function(status) {
            if(status=='ok'){
                $scope.company.cPageIndex=1;
                $scope.company.cPageSize=10;
                $scope.companyData($scope.company.cPageIndex,$scope.company.cPageSize);
            }

            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            // $scope.companyData();

        }, function() {});
    };
    //推荐医生
    $scope.hotdocter = function(pageIndex,pageSize) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalhotdocter.html',
            controller: 'ModalhotdocterCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.items;
                }
                // pageidex:function(){
                //     return pageIndex;
                // },
                // pagesize:function(){
                //     return pageSize;
                // } 

            }
        });
        modalInstance.result.then(function(status) {
            if(status=='ok'){
                $scope.patient.pageIndex=1;
                $scope.patient.pageSize=10;
                $scope.patientsData($scope.patient.pageIndex,$scope.patient.pageSize);
            }
            
        }, function() {});
    };
    $scope.diseasesview = function(diseaseId) {
        var diseaseId = diseaseId;
        $scope.diseaseId = diseaseId;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'hotyiyao.html',
            controller: 'ModalhotyiyaoCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return $scope.diseaseId;
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.companyId = selectedItem.id;
            $scope.companyName = selectedItem.name;
            // $scope.diseaseData(0, 10);

        }, function() {});
    };
    $scope.Commondiseases = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'mypatlst.html',
            controller: 'ModalpatlstCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return access_token;
                }
            }
        });
        modalInstance.result.then(function(status) {
            // $scope.companyId = selectedItem.id;
            // $scope.companyName = selectedItem.name;
            if(status=='ok'){
                $scope.disease.dPageIndex=1;
                $scope.disease.dPageSize=10;
                $scope.diseaseData($scope.disease.dPageIndex,$scope.disease.dPageSize);
            }

        }, function() {});
    };

    //疾病标签
    $scope.loadLable=function () {
        // $scope.isShow=false;
        $scope.changBoxIsShow=true;
        //点击编辑按钮
        $scope.startChangeLable=function () {
            $scope.changBoxIsShow=false;
        };
        //点击取消编辑按钮
        $scope.changCancel=function () {
            $scope.changBoxIsShow=true;
            // $state.reload();
            getInitialTree();
        }

        //点击提交按钮
        $scope.changeOk=function () {

            var modalInstance=$modal.open({
                animation:true,
                templateUrl:'confirmSubmit.html',
                controller:'confirmSubmitCtrl',
                windowClass:'modalClass',
                size:'sm'

            });

            modalInstance.result.then(function(status){
                if(status=='ok'){
                    $scope.changBoxIsShow=true;
                    //拿到所有最终需要保存的标签
                    $scope.submitLableArr=[];
                    for(var a=0;a<$scope.initialTree.length;a++) {
                        for (var b = 0; b < $scope.initialTree[a].children.length; b++) {
                            for (var c = 0; c < $scope.initialTree[a].children[b].children.length; c++) {
                                if ($scope.initialTree[a].children[b].children[c].isShowPage) {
                                    $scope.submitLableArr.push($scope.initialTree[a].children[b].children[c].id);

                                }

                            }
                        }
                    }
                    console.log($scope.submitLableArr);
                    $http({
                        url:app.url.group.saveAllLabel,//保存需要显示的标签
                        method:'post',
                        data:{
                            access_token: access_token,
                            id:$scope.submitLableArr.toString()
                        }
                    }).success(function(resp){
                        if(resp.resultCode==1){
                            console.log(resp);
                            modal.toast.success('编辑成功！');

                        }

                    })

                }
            })


        }
        //测试树
        // $scope.testTree=[
        //     {
        //         grantName:'内科',
        //         firstChildrens:[
        //             {
        //                 parentName:'种类一',
        //                 secondChildrens:[
        //                     {
        //                         labelName:'疾病一',
        //                         id:'21323'
        //
        //                     },
        //                     {
        //                         labelName:'疾病二',
        //                         id:'212334'
        //
        //                     }
        //
        //                 ]
        //
        //             },
        //             {
        //                 parentName:'种类二',
        //                 secondChildrens:[
        //                     {
        //                         labelName:'疾病一',
        //                         id:'21323'
        //
        //                     },
        //                     {
        //                         labelName:'疾病二',
        //                         id:'212334'
        //
        //                     }
        //
        //                 ]
        //
        //             }
        //
        //         ]
        //     },
        //     {
        //         grantName:'外科',
        //         firstChildrens:[
        //             {
        //                 parentName:'种类一',
        //                 secondChildrens:[
        //                     {
        //                         labelName:'疾病一',
        //                         id:'21323'
        //
        //                     },
        //                     {
        //                         labelName:'疾病二',
        //                         id:'212334'
        //
        //                     }
        //
        //                 ]
        //
        //             },
        //             {
        //                 parentName:'种类二',
        //                 secondChildrens:[
        //                     {
        //                         labelName:'疾病一',
        //                         id:'21323'
        //
        //                     },
        //                     {
        //                         labelName:'疾病二',
        //                         id:'212334'
        //
        //                     }
        //
        //                 ]
        //
        //             }
        //
        //         ]
        //     }
        //
        // ];
        // console.log($scope.testTree);
        //初始化页面信息
        //拿到初始页面时  显示的树
        function getInitialTree() {
            $http.post(
                app.url.group.getAllLabers,
                {access_token: access_token}
            ).success(function (resp) {
                console.log('请求成功');
                //给每个标签添加一个isShowPage属性来判断是否显示在页面上
                for(var a=0;a<resp.data.length;a++){
                    resp.data[a].isShowPage=true;
                    for(var b=0;b<resp.data[a].children.length;b++){
                        resp.data[a].children[b].isShowPage=true;
                        for(var c=0;c<resp.data[a].children[b].children.length;c++){
                            resp.data[a].children[b].children[c].isShowPage=true;
                        }


                    }

                }

                $scope.initialTree=resp.data;
                console.log($scope.initialTree);


            })
        }

        getInitialTree();


        $scope.chooseDisease = function() {
            var contacts = new Tree('CarePlanLibraryTree1', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1],
                data: {
                    url: app.url.group.getDiseaseTree,
                    param: {}
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
                    leaf: 'leaf',
                    parentId:'parentId'
                },
                root: {
                    selectable: false,
                    name: '全部疾病',
                    id: null
                },
                events: {
                    click: treeClick
                }
            });
        };
        $scope.chooseDisease();

        var chooseDiseaseId=[];
        var chooseParentId=[];
        var chooseGrantId=[];
        //此方法用来判断该标签是否已经在数组中存在
        function searchId(idArr,chooseId) {
            for(var i=0;i<idArr.length;i++){
                if(idArr[i]==chooseId){
                    return;
                }

            }
            if(i>=idArr.length){
                idArr.push(chooseId);
            }


        }

        var changBox=document.getElementsByClassName('changBox')[0];
        var changBoxHeight=changBox.scrollHeight;//记录初始高度
        console.info($);
        console.info(changBoxHeight);
        console.info(changBox.scrollTop);
        console.info(changBox.scrollHeight);

        //点击第三层标签 添加到右边
        function treeClick(info) {


            // $scope.isShow=true;
            //info.leaf来判断是不是第三层标签
            if($scope.changBoxIsShow){
                modal.toast.error('您处在非编辑状态');
            }

            if(info&&info.leaf&&!$scope.changBoxIsShow){
                console.log(info)
                $scope.diseaseName = info.name;
                $scope.diseaseId = info.id;//自身ID
                $scope.parentId=info.parentId;//父级ID
                $scope.grantId=$scope.parentId.substr(0,2);//顶级ID
                // console.log($scope.parentId);
                // console.log($scope.grantId);


                searchId(chooseDiseaseId,$scope.diseaseId);
                searchId(chooseParentId,$scope.parentId);
                searchId(chooseGrantId,$scope.grantId);
                // chooseDiseaseId.push($scope.diseaseId);
                // chooseParentId.push($scope.parentId);
                // chooseGrantId.push($scope.grantId);

                //拿到顶级的名字
                $http.post(app.url.group.findById, {
                    access_token: app.url.access_token,
                    diseaseId: $scope.grantId
                }).success(function(data){
                    if(data.resultCode==1){
                        $scope.grantName=data.data.name;
                        console.log($scope.grantName);

                    }

                })
                //拿到父级的名字
                $http.post(app.url.group.findById, {
                    access_token: app.url.access_token,
                    diseaseId:$scope.parentId
                }).success(function(data){
                    if(data.resultCode==1){
                        $scope.parentName=data.data.name;
                        console.log($scope.parentName);

                    }

                });
                var topIndex;
                var middleIndex;
                var initTopLength=$scope.initialTree.length;
                $timeout(function(){
                    for(var k=0;k<initTopLength;k++){
                        //如果第一大类已经存在,则继续查找第二大类
                        if($scope.grantId==$scope.initialTree[k].id){
                            topIndex=k;
                            console.log(topIndex);
                            break;
                        }
                    }


                    //如果第一大类不存在，则在之前的树上添加第一大类
                    if(k>=initTopLength){
                        $scope.initialTree[initTopLength]={
                            id:$scope.grantId,
                            name:$scope.grantName,
                            isShowPage:true,
                            children:[
                                {
                                    id:$scope.parentId,
                                    name:$scope.parentName,
                                    isShowPage:true,
                                    parent:$scope.grantId,
                                    children:[
                                        {
                                            id:$scope.diseaseId,
                                            name:$scope.diseaseName,
                                            parent:$scope.parentId,
                                            isShowPage:true
                                        }
                                    ]
                                }
                            ]
                        }
                        $timeout(function () {
                            var obj =document.getElementById($scope.diseaseId);
                            console.log("offsetTop:"+obj.offsetTop);
                            console.log($(obj).position().top);
                            changBox.scrollTop =obj.offsetTop-50;//使滚动条到最下面

                        },30)


                    }else {//就是第一大类已经存在的情况

                        var middleInitLength=$scope.initialTree[topIndex].children.length;
                        //查看第二大类是否存在，若存在记录标签，若不存在，新建第二大类
                        for(var j=0;j<middleInitLength;j++){
                            if($scope.parentId==$scope.initialTree[topIndex].children[j].id){
                                middleIndex=j;
                                break;

                            }

                        }

                        if(j>=middleInitLength){//第二大类不存在
                            $scope.initialTree[topIndex].isShowPage=true;//防止先存在后删除再添加顶层类不显示
                            $scope.initialTree[topIndex].children[middleInitLength]={
                                id:$scope.parentId,
                                name:$scope.parentName,
                                parent:$scope.grantId,
                                isShowPage:true,
                                children:[
                                    {
                                        id:$scope.diseaseId,
                                        name:$scope.diseaseName,
                                        parent:$scope.parentId,
                                        isShowPage:true
                                    }
                                ]
                            }
                            $timeout(function () {
                                var obj =document.getElementById($scope.diseaseId);
                                console.log("offsetTop:"+obj.offsetTop);
                                console.log($(obj).position().top);
                                changBox.scrollTop =obj.offsetTop-50;//使滚动条到最下面
                            },30)

                        }else {//第二大类存在,在存在的类别下添加第三层标签,判断该标签是否存在，不存在则添加
                            var bottomInitLength=$scope.initialTree[topIndex].children[middleIndex].children.length;
                            for(var n=0;n<bottomInitLength;n++){
                                //存在且已经显示在页面上则不管
                                if($scope.diseaseId==$scope.initialTree[topIndex].children[middleIndex].children[n].id&&$scope.initialTree[topIndex].children[middleIndex].children[n].isShowPage){
                                    modal.toast.error('该疾病标签已存在');
                                    break;
                                }
                            }
                            //不存在则添加
                            if(n>=bottomInitLength){
                                $scope.initialTree[topIndex].isShowPage=true;//防止先存在后删除再添加顶层类不显示
                                $scope.initialTree[topIndex].children[middleIndex].isShowPage=true;
                                var newLable={
                                    id:$scope.diseaseId,
                                    name:$scope.diseaseName,
                                    parent:$scope.parentId,
                                    isShowPage:true
                                }
                                $scope.initialTree[topIndex].children[middleIndex].children.push(newLable);
                                $timeout(function () {
                                        console.info('changBoxHeight:'+changBoxHeight);
                                        console.info("changBox.scrollTop:"+changBox.scrollTop);
                                        console.info("changBox.scrollHeight:"+changBox.scrollHeight);
                                        var obj =document.getElementById($scope.diseaseId);
                                        console.log("offsetTop:"+obj.offsetTop);
                                        console.log($(obj).position().top);
                                        changBox.scrollTop =obj.offsetTop-50;//使滚动条到最下面
                                },30)
                            }


                        }
                    }


                    console.log(chooseDiseaseId);
                    console.log(chooseParentId);
                    console.log(chooseGrantId);
                    console.log($scope.initialTree);

                },500)







            }
        };


        //搜索疾病树
        $scope.searchDiseaceClick = function(searchdiseaseText) {
            //$scope.isshow=true;
            $scope.disb="";
            if (searchdiseaseText == "") {
                $scope.chooseDisease();
            } else {
                var contacts = new Tree('CarePlanLibraryTree1', {
                    hasCheck: false,
                    allCheck: false,
                    multiple: false,
                    allHaveArr: false,
                    self: true,
                    //search: true,
                    arrType: [1, 1, 1],
                    data: {
                        url: app.url.group.searchDiseaseTreeByKeyword,
                        param: {
                            access_token: app.url.access_token,
                            keyword: searchdiseaseText
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
                        leaf: 'leaf',
                        parentId:'parent'
                    },
                    root: {
                        selectable: true,
                        name: '全部',
                        id: null
                    },
                    events: {
                        click: treeClick
                    }

                });
            }
        };

        //点击标签删除
        $scope.removeLable=function (index,label) {
            console.log('标签下标：'+index+',标签名：'+label.name);
            console.log($scope.initialTree);
            label.isShowPage=false;
            var twoId=label.id.substr(0,2);
            for(var x=0;x<$scope.initialTree.length;x++){
                for(var y=0;y<$scope.initialTree[x].children.length;y++){
                    console.log($scope.initialTree[x].children[y].id);

                    // console.log(twoId);
                    if(label.parent==$scope.initialTree[x].children[y].id){//找到了点击的是哪个第二大类
                        for(var m=0;m<$scope.initialTree[x].children[y].children.length;m++){
                            if($scope.initialTree[x].children[y].children[m].isShowPage){//若有一个为true

                                break;
                            }
                        }
                        if(m>=$scope.initialTree[x].children[y].children.length){//所有的都是false
                            $scope.initialTree[x].children[y].isShowPage=false;
                            for(var z=0;z<$scope.initialTree[x].children.length;z++){//第二大类消失后立刻查看对应的第一大类
                                if($scope.initialTree[x].children[z].isShowPage){
                                    break;
                                }
                            }
                            if(z>=$scope.initialTree[x].children.length){
                                $scope.initialTree[x].isShowPage=false;

                            }

                        }

                    }

                    // if($scope.initialTree[x].children[y].parent==$scope.initialTree[x].id){//找到了第一大类
                    //     for(var s=0;s<$scope.initialTree[x].children[y].length;s++){
                    //         if($scope.initialTree[x].children[y].isShowPage){//有一个第二大类显示
                    //             break;
                    //
                    //         }
                    //     }
                    //     if(s>=$scope.initialTree[x].children[y].length){//所有第二大类都不显示
                    //         $scope.initialTree[x].isShowPage=false;
                    //
                    //     }
                    //
                    // }

                    // for(var z=0;z<$scope.initialTree[x].children[y].children.length;z++){
                    //
                    //
                    // }

                }



            }



        }


    }





};
//确定提交
angular.module('app').controller('confirmSubmitCtrl',confirmSubmitCtrl);
confirmSubmitCtrl.$inject=['$scope','$state','$uibModalInstance', '$http','toaster'];
function confirmSubmitCtrl($scope,$state,$uibModalInstance,$http,toaster) {
    $scope.confirmSubmit=function () {
        $uibModalInstance.close('ok');
    };
    $scope.cancelSubmit=function () {
        $uibModalInstance.dismiss('del');
        
    }
    
}
//集团
angular.module('app').controller('ModalCompanyCtrl', ModalCompanyCtrl);
ModalCompanyCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster', '$rootScope', 'items'];
function ModalCompanyCtrl($scope, $state, $uibModalInstance, $http, toaster, $rootScope, items) {
    $scope.selectedList = [];
    $scope.pageSize = 6;
    $scope.pageIndex = 1;
    $scope.searchName = null;
    $scope.searchgroup = function _searchgroup(pageIndex, pageSize, searchName) {

        $http.post(app.url.group.searchGroupByName, {
            access_token: app.url.access_token,
            name: searchName,
            pageIndex: pageIndex,
            pageSize: pageSize
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.data = data.data;
            } else {
                toaster.pop('error', null, data.resultMsg);
            }

        })
    };
    $scope.searchgroup($scope.pageIndex - 1, $scope.pageSize, $scope.searchName);
    $scope.pageChanged = function() {
        $scope.searchgroup($scope.pageIndex - 1, $scope.pageSize, $scope.searchName);
    };
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    };

    $scope.singleSelected = function(item) {
        var hasS = false;
        for (var i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == item) {
                $scope.selectedList.splice(i, 1);
                hasS = true;
            }
        }
        if (!hasS) {
            if (item.certState != 9 && item.certState != 1) {
                $scope.selectedList.push(item);
            }

        }

    };
    $scope.modalOk = function() {
        if ($scope.selectedList.length<=0) {
            toaster.pop('error', null, '请选择集团');
            return;
        }
        $http.post(app.url.group.setGroupToRecommended, {
            access_token: app.url.access_token,
            groupId: $scope.selectedList.toString()
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '添加推荐成功');
                $uibModalInstance.close('ok');
            } else if (data.resultCode == 0) {

                toaster.pop('error', null, data.resultMsg);
            } else {
                toaster.pop('error', null, data.resultMsg);
            }
        })
    };

};
//医生
angular.module('app').controller('ModalhotdocterCtrl', ModalhotdocterCtrl);
ModalhotdocterCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster'];
function ModalhotdocterCtrl($scope, $state, $uibModalInstance, $http, toaster) {
    $scope.pageSize = 6;
    $scope.pageIndex = 1;
    $scope.searchName = null;
    $scope.selectedList = [];
    $scope.ishide=false;
    $scope.searchdor = function(pageIndex, pageSize, keyword) {
        $http.post(app.url.group.searchByKeyword, {
            access_token: app.url.access_token,
            keyword: keyword,
            pageIndex: pageIndex,
            pageSize: 6
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.dorData = data.data;
                if ($scope.dorData.total == 0) {
                    $scope.ishide=true;
                } else {
                    $scope.ishide=false;
                }
            } else {
                toaster.pop('error', null, data.resultMsg);
            }


        })
    };

    $scope.pageChanged = function() {
        $scope.searchdor($scope.pageIndex - 1, $scope.pageSize, $scope.keyword);
    };

    $scope.modalOk = function() {
         $scope.isSaved=true;
        if ($scope.selectedList.length<=0) {
            toaster.pop('error', null, '请选择医生');
             $scope.isSaved=false;
            return;
        }
        $http.post(app.url.group.addDoctors, {
            access_token: app.url.access_token,
            doctorIds: $scope.selectedList.toString(),
            groupId: 'platform'
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '添加推荐成功');
                $uibModalInstance.close('ok');
            } else {
                toaster.pop('error', null, data.resultMsg);
                $scope.isSaved=false;

            }
        })
    };

    $scope.singleSelected = function(item) {
        var hasS = false;
        for (var i = 0; i < $scope.selectedList.length; i++) {
            if ($scope.selectedList[i] == item) {
                $scope.selectedList.splice(i, 1);
                hasS = true;
            }
        }
        if (!hasS) {
            if (item.certState != 9 && item.certState != 1) {
                $scope.selectedList.push(item);
            }

        }
    };
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    };
};

//疾病介绍
angular.module('app').controller('ModalhotyiyaoCtrl', ModalhotyiyaoCtrl);
ModalhotyiyaoCtrl.$inject = ['$scope', '$state', '$uibModalInstance', '$http', 'toaster','items'];
function ModalhotyiyaoCtrl($scope, $state, $uibModalInstance, $http, toaster, items) {
    $scope.isshow=true;

    $scope.hotData = (function() {
        $http.post(app.url.group.findById, {
            access_token: app.url.access_token,
            diseaseId: items
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.diseaseData = data.data;
                $scope.introduction1 = $scope.diseaseData.introduction;
                $scope.remark1 = $scope.diseaseData.remark;
                $scope.attention1 = $scope.diseaseData.attention;
                $scope.alias1 = $scope.diseaseData.alias;
            }
        })
    })();

    $scope.$watch('addRemarkStr', function(event) {
        var reg = /，|,|{}/;
        if (reg.test($scope.addRemarkStr)) {
            $scope.addRemark();
        }

    });
    $scope.$watch('addRemarkStr1', function(event) {
        var reg = /，|,|{}/;
        if (reg.test($scope.addRemarkStr1)) {
            $scope.addAlias();
        }

    });
    $scope.romveremark = function(index) {
        $scope.remark.splice(index, 1);
    }
    $scope.romveralias = function(index) {
        $scope.alias.splice(index, 1);
    }
    $scope.addRemark = function() {
        var str = $scope.addRemarkStr;
        str = str.substring(0, str.length - 1);
        $scope.remark.push(str);
        $scope.addRemarkStr = "";
    }
    $scope.addAlias = function() {
        var str = $scope.addAliasStr;
        str = str.substring(0, str.length - 1);
        $scope.alias.push(str);
        $scope.addAliasStr = '';
    }
    $scope.addRemarkEnt = function() {
        $scope.remark.push($scope.addRemarkStr);
        $scope.addRemarkStr = "";
    }
    $scope.addAliasEnt = function() {
        if ($scope.alias.length >= 20) {
            toaster.pop('error', null, '常用名数量不能大于20个');
            $scope.addAliasStr = "";
            return;
        } else {
            $scope.alias.push($scope.addAliasStr);
            $scope.addAliasStr = "";
        }

    }
    $scope.editDiseaseCheck = function() {
        $http.post(app.url.group.findById, {
            access_token: app.url.access_token,
            diseaseId: items
        }).success(function(data) {
            if (data.resultCode == 1) {
                $scope.diseaseData = data.data;
                $scope.introduction = $scope.diseaseData.introduction;
                $scope.remark = $scope.diseaseData.remark;
                $scope.attention = $scope.diseaseData.attention;
                $scope.alias = $scope.diseaseData.alias;
            }
        })
        $scope.isshow=false;
    }
    $scope.cancelColse = function(items) {
        $scope.isshow=true;
    }
    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    }
    $scope.diseaseOk = function() {

        $http.post(app.url.group.setDiseaseInfo, {
            access_token: app.url.access_token,
            diseaseId: items,
            introduction: $scope.introduction,
            remark: $scope.remark.toString(),
            alias: $scope.alias.toString(),
            attention: $scope.attention
        }).success(function(data) {
            if (data.resultCode == 1) {
                toaster.pop('success', null, '编辑保存成功');
                $scope.introduction1 = $scope.introduction;
                $scope.remark1 = $scope.diseaseData.remark;
                $scope.attention1 = $scope.attention;
                $scope.alias1 = $scope.diseaseData.alias;
                $scope.isshow=true;
            } else {
                toaster.pop('success', null, data.resultMsg);
            }

        })
    };



};
//疾病
angular.module('app').controller('ModalpatlstCtrl', ModalpatlstCtrl);
ModalpatlstCtrl.$inject = ['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce', '$uibModalInstance'];
function ModalpatlstCtrl($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce, $uibModalInstance) {

    $scope.choosetreeDisease = function() {
        var contacts = new Tree('CarePlanLibraryTree', {
            hasCheck: false,
            allCheck: false,
            multiple: false,
            allHaveArr: false,
            self: true,
            search: false,
            arrType: [1, 0],
            data: {
                url: app.url.group.getDiseaseTree,
                param: {}
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
                selectable: false,
                name: '全部',
                id: null
            },
            events: {
                click: treeClick
            },
            callback: function() {
                var dts = contacts.tree.find('dt');
                // // 默认获取root 全部 的数据
                // $scope.treeLoading = true;
                // if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                //     treeClick(dts.eq(0).data().info);
            }
        });
    }


    $timeout(function() {
        $scope.choosetreeDisease();
    }, 10);


    //点击树获取疾病介绍
    function treeClick(info) {

        $scope.diseaseid = info;
        if (info.leaf) {
            $http.post(app.url.group.getDiseaseAlias, {
                access_token: app.url.access_token,
                diseaseId: $scope.diseaseid.id
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.diseaseData = data.data;
                    //console.log($scope.diseaseData);
                }
            })
        } else {
            $timeout(function() {
                $scope.diseaseData = null;
                $scope.diseaseid = null;

            }, 0)

        }
    };


    //搜索疾病树
    $scope.diseaceClick = function() {
        if ($scope.diseaseText == "") {
            $scope.choosetreeDisease();
        } else {
            var contacts = new Tree('CarePlanLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                //search: true,
                arrType: [1, 1, 1],
                data: {
                    url: app.url.group.searchDiseaseTreeByKeyword,
                    param: {
                        access_token: app.url.access_token,
                        keyword: $scope.diseaseText
                    }
                },
                // search: {
                //     searchDepth: [2],
                //     dataKey: {
                //         name: 'name',
                //         id: 'id',
                //         union: 'parentId',
                //         dataSet: 'data'
                //     },
                //     unwind: false
                // },
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
                // callback: function() {
                //     var dts = contacts.tree.find('dt');
                //     // 默认获取root 全部 的数据
                //     // $scope.treeLoading = true;
                //     // if (dts && dts.eq(0) && dts.eq(0).data() && dts.eq(0).data().info)
                //     //     treeClick(dts.eq(0).data().info);
                //     // $scope.treeLoading = false;
                // }
            });
        }
    }




    $scope.modalCancel = function() {
        $uibModalInstance.close('center');
    }
    $scope.saveThisRadioValue = function(x) {
        if (x) {
            $scope.thisRadio = x;
        } else {
            $scope.thisRadio;
        }

    }
    $scope.modalOk = function() {
        //console.log($scope.thisRadio);
        if ($scope.thisRadio) {
            $http.post(app.url.group.addCommonDisease, {
                access_token: app.url.access_token,
                diseaseId: $scope.diseaseid.id,
                name: $scope.thisRadio
            }).success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, '添加推荐成功');
                    $uibModalInstance.close('ok');
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            })
        } else {
            toaster.pop('error', null, '请选择名称');
        }

    }
};


})();
