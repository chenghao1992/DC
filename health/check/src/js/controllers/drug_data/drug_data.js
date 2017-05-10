/**
 * Created by clf on 2016/5/23.
 */

app.controller('DrugDataCtrl', ['$rootScope', '$scope', '$modal','$http','$timeout','toaster',
    function($rootScope, $scope, $modal,$http,$timeout,toaster) {
        $scope.currentType='getAllFormList';
        $scope.isShowPharmacological=false;

        //树的数据的加载情况
        $scope.isTreeLoaded=false;

        //当前选中的病种id
        var currentTreeId;

        $scope.my_tree = tree = {};

        //文档树的数据
        $scope.my_data=[];

        $scope.checkModel = {
            Form:true,
            Unit:false,
            Dose:false,
            ManageType:false,
            BizType:false,
            Scope:false,
            Pharmacological:false
        };


        //获取基础数据分类数据
        $scope.getTypeData=function(apiName){
            $scope.currentType=apiName;
            if(apiName=='getAllPharmacologicalList'){
                $scope.isShowPharmacological=true;
            }
            else{
                $scope.isShowPharmacological=false;
                $http.post(app.url.drug[apiName], {
                    access_token: localStorage.getItem('check_access_token'),
                }).then(function(resp) {
                    if(resp.data.resultCode===1){
                        $scope.data=resp.data.data;
                    }
                    else{
                        toaster.pop('error', null, resp.data.resultMsg);
                    }
                });
            }

        };

        $scope.getTypeData('getAllFormList');


        //更改启用/禁用状态
        $scope.setStatus=function(item){
            var setStatusApi=null;
            if(item.valid===0){
                switch($scope.currentType){
                    case 'getAllFormList':
                        setStatusApi='disableForm';
                        break;
                    case 'getAllUnitList':
                        setStatusApi='disableUnit';
                        break;
                    case 'getAllDoseList':
                        setStatusApi='disableDose';
                        break;
                    case 'getAllManageTypeList':
                        setStatusApi='disableManageType';
                        break;
                    case 'getAllBizTypeList':
                        setStatusApi='disableBizType';
                        break;
                    case 'getAllScopeList':
                        setStatusApi='disableScope';
                        break;
                    case 'getAllPharmacologicalList':
                        setStatusApi='disablePharmacological';
                        break;

                }
            }
            else{
                switch($scope.currentType){
                    case 'getAllFormList':
                        setStatusApi='enableForm';
                        break;
                    case 'getAllUnitList':
                        setStatusApi='enableUnit';
                        break;
                    case 'getAllDoseList':
                        setStatusApi='enableDose';
                        break;
                    case 'getAllManageTypeList':
                        setStatusApi='enableManageType';
                        break;
                    case 'getAllBizTypeList':
                        setStatusApi='enableBizType';
                        break;
                    case 'getAllScopeList':
                        setStatusApi='enableScope';
                        break;
                    case 'getAllPharmacologicalList':
                        setStatusApi='enablePharmacological';
                        break;
                }

            }

            $http.post(app.url.drug[setStatusApi], {
                access_token: localStorage.getItem('check_access_token'),
                id:item.id
            }).then(function(resp) {
                if(resp.data.resultCode===1){
                    if(resp.data.data=='false'){
                        toaster.pop('error', null, '服务器异常');
                    }
                    else{
                        if(item.valid==1){
                            item.valid=0;
                        }
                        else{
                            item.valid=1;
                        }
                    }

                }
                else{
                    toaster.pop('error', null, resp.data.resultMsg);
                }
            });
        };

        //删除数据
        $scope.deletePack=function(item){
            var modal = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'deleteModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modal.result.then(function() {
                var deleteApi=null;
                switch($scope.currentType){
                    case 'getAllFormList':
                        deleteApi='deleteForm';
                        break;
                    case 'getAllUnitList':
                        deleteApi='deleteUnit';
                        break;
                    case 'getAllDoseList':
                        deleteApi='deleteDose';
                        break;
                    case 'getAllManageTypeList':
                        deleteApi='deleteManageType';
                        break;
                    case 'getAllBizTypeList':
                        deleteApi='deleteBizType';
                        break;
                    case 'getAllScopeList':
                        deleteApi='deleteScope';
                        break;
                    case 'getAllPharmacologicalList':
                        deleteApi='deletePharmacological';
                        $http.post(app.url.drug[deleteApi], {
                            access_token: localStorage.getItem('check_access_token'),
                            id:item.id
                        }).then(function(resp) {
                            if(resp.data.resultCode===1){
                                $http.post(app.url.drug.getAllPharmacologicalList, {
                                    access_token: localStorage.getItem('check_access_token'),
                                    id:currentTreeId
                                }).then(function(resp) {
                                    if(resp.data.resultCode===1){
                                        $scope.pharmacologicalData=resp.data.data;
                                        getTreeData();
                                        return;
                                    }
                                    else{
                                        toaster.pop('error', null, resp.data.resultMsg);
                                    }
                                });

                            }
                            else{
                                toaster.pop('error', null, resp.data.resultMsg);
                            }
                        });
                        return;
                }

                $http.post(app.url.drug[deleteApi], {
                    access_token: localStorage.getItem('check_access_token'),
                    id:item.id
                }).then(function(resp) {
                    if(resp.data.resultCode===1){
                        $scope.getTypeData($scope.currentType);
                    }
                    else{
                        toaster.pop('error', null, resp.data.resultMsg);
                    }
                });
            }, function() {

            });
        };

        //添加数据
        $scope.addDate=function(){
            var modal = $modal.open({
                templateUrl: 'addDrugDataModalContent.html',
                controller: 'AddDrugDataModalCtrl',
                size: 'md',
                resolve: {
                    inputData: function() {
                        return {currentType:$scope.currentType,currentTreeId:currentTreeId};
                    }
                }
            });

            modal.result.then(function() {
                if($scope.currentType!=='getAllPharmacologicalList'){
                    $scope.getTypeData($scope.currentType);
                }
                else{
                    $http.post(app.url.drug.getAllPharmacologicalList, {
                        access_token: localStorage.getItem('check_access_token'),
                        id:currentTreeId
                    }).then(function(resp) {
                        if(resp.data.resultCode===1){
                            $scope.pharmacologicalData=resp.data.data;
                            toaster.pop('success', null, '添加成功');
                            getTreeData();
                        }
                        else{
                            toaster.pop('error', null, resp.data.resultMsg);
                        }
                    });
                }

            }, function() {

            });
        };


        function clone(myObj){
            var newObj={};
            newObj.label=myObj.name;
            newObj.id=myObj.id;
            if(myObj.children!=undefined){
                newObj.children=[];
                for(var i in myObj.children){
                    newObj.children[i]=clone(myObj.children[i]);
                }
            }
            return newObj;
        }

        //function clone(myObj){
        //    var newObj={};
        //    newObj.label=myObj.name;
        //    //newObj.label=myObj.name+'('+myObj.count+')';
        //    newObj.id=myObj.id;
        //
        //    if(myObj.children!=undefined&&myObj.children[0].leaf===false){
        //        newObj.children=[];
        //        for(var i in myObj.children){
        //            newObj.children[i]=clone(myObj.children[i]);
        //        }
        //    }
        //    return newObj;
        //}


        //这里要获取病种树的数据
        var getTreeData=function(){
            $scope.isTreeLoaded=false;
            $http.post(app.url.drug.getPharmacologicalTree, {
                access_token:app.url.access_token
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    console.log(data.data);
                    var source={
                        name:'全部病种',
                        id:0,
                    };
                    //每次保存完后(正常情况就应该跳转到上一次目录，而不是总目录下)
                    if($scope.level!=1 && $scope.level!= undefined){
                        $scope.selects=$scope.label;
                    }else {
                        $scope.selects='全部病种';

                    }
                    source.children=data.data;
                    var result=clone(source);
                    var eArray=new Array();
                    eArray[0]=result;
                    $scope.my_data=eArray;
                    $scope.isTreeLoaded=true;
                }
                else{
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        };

        getTreeData();
        $rootScope.$on('drug_data_add', function(e, d) {
            var saveApi=null;
            switch($scope.currentType){
                case 'getAllFormList':
                    saveApi='saveForm';
                    break;
                case 'getAllUnitList':
                    saveApi='saveUnit';
                    break;
                case 'getAllDoseList':
                    saveApi='saveDose';
                    break;
                case 'getAllManageTypeList':
                    saveApi='saveManageType';
                    break;
                case 'getAllBizTypeList':
                    saveApi='saveBizType';
                    break;
                case 'getAllScopeList':
                    saveApi='saveScope';
                    break;
                case 'getAllPharmacologicalList':
                    if(currentTreeId==null){
                        return toaster.pop('error', null, '请选择节点');;
                    }
                    saveApi='savePharmacological';
                    $http.post(app.url.drug[saveApi], {
                        access_token: localStorage.getItem('check_access_token'),
                        parent: currentTreeId,
                        name:d.name,
                        //valid: d.valid
                    }).then(function(resp) {
                        if(resp.data.resultCode===1){
                            $http.post(app.url.drug.getAllPharmacologicalList, {
                                access_token: localStorage.getItem('check_access_token'),
                                id:currentTreeId
                            }).then(function(resp) {
                                if(resp.data.resultCode===1){
                                    $scope.pharmacologicalData=resp.data.data;
                                    getTreeData();
                                }
                                else{
                                    toaster.pop('error', null, resp.data.resultMsg);
                                }
                            });
                            $rootScope.$emit('emptyIput', 0);
                        }
                        else{
                            toaster.pop('error', null, resp.data.resultMsg);
                        }
                    });
                    return;
            }
            $http.post(app.url.drug[saveApi], {
                access_token: localStorage.getItem('check_access_token'),
                name: d.name,
                valid:d.valid
            }).then(function(resp) {
                if(resp.data.resultCode===1){
                    $scope.getTypeData($scope.currentType);
                }
                else{
                    toaster.pop('error', null, resp.data.resultMsg);
                }
            });
        });

        //点击文档树节点
        $scope.my_tree_handler = function(branch) {
            //if(branch.level==3){
                console.log(branch);
                currentTreeId=branch.id;
                $scope.level=branch.level;//树状级别
                $scope.label=branch.label; //
                $http.post(app.url.drug.getAllPharmacologicalList, {
                    access_token: localStorage.getItem('check_access_token'),
                    id:currentTreeId
                }).then(function(resp) {
                    if(resp.data.resultCode===1){
                        $scope.pharmacologicalData=resp.data.data;
                        localStorage.getItem('check_access_token')
                    }
                    else{
                        toaster.pop('error', null, resp.data.resultMsg);
                    }
                });
            //}
            //else{
            //    currentTreeId=null;
            //}
        };
        $scope.my_tree_handler({id:0,name:'全部病种'});


    }
]);


//新增数据弹窗
app.controller('AddDrugDataModalCtrl', ['$rootScope','$scope', '$modalInstance','$http','$timeout','toaster','inputData', function($rootScope,$scope, $modalInstance, $http,$timeout,toaster,inputData) {
    $scope.checkStatus=true;
    $scope.inputData=inputData;

    $scope.getTypeData=function(apiName){
        if(apiName=='getAllPharmacologicalList'){
            $scope.isShowPharmacological=true;
        }
        else{
            $scope.isShowPharmacological=false;
            $http.post(app.url.drug[apiName], {
                access_token: localStorage.getItem('check_access_token'),
            }).then(function(resp) {
                if(resp.data.resultCode===1){
                    $scope.data=resp.data.data;
                }
                else{
                    toaster.pop('error', null, resp.data.resultMsg);
                }
            });
        }

    };


    $scope.save=function(){
        if($scope.dataName.length<=0){
            return;
        }
        else{
            var saveApi=null;
            switch(inputData.currentType){
                case 'getAllFormList':
                    saveApi='saveForm';
                    break;
                case 'getAllUnitList':
                    saveApi='saveUnit';
                    break;
                case 'getAllDoseList':
                    saveApi='saveDose';
                    break;
                case 'getAllManageTypeList':
                    saveApi='saveManageType';
                    break;
                case 'getAllBizTypeList':
                    saveApi='saveBizType';
                    break;
                case 'getAllScopeList':
                    saveApi='saveScope';
                    break;
                case 'getAllPharmacologicalList':
                    if(inputData.currentTreeId==null){
                        return toaster.pop('error', null, '请选择节点');;
                    }
                    saveApi='savePharmacological';
                    $http.post(app.url.drug[saveApi], {
                        access_token: localStorage.getItem('check_access_token'),
                        parent:inputData.currentTreeId,
                        name:$scope.dataName,
                        //valid:$scope.checkStatus?0:1
                    }).then(function(resp) {
                        if(resp.data.resultCode===1){
                            $modalInstance.close();
                        }
                        else{
                            toaster.pop('error', null, resp.data.resultMsg);
                        }
                    });
                    return;
            }
            $http.post(app.url.drug[saveApi], {
                access_token: localStorage.getItem('check_access_token'),
                name:$scope.dataName,
                valid:$scope.checkStatus?0:1
            }).then(function(resp) {
                if(resp.data.resultCode===1){
                    $modalInstance.close();
                }
                else{
                    toaster.pop('error', null, resp.data.resultMsg);
                }
            });
        }
    };
    $scope.saveAndAdd = function() {
        if($scope.dataName.length<=0){
            return;
        }
        else{
            var outData={
                name:$scope.dataName,
                valid:$scope.checkStatus?0:1
            };
            $rootScope.$emit('drug_data_add', outData);
            //添加成功后清空输入框
            $rootScope.$on('emptyIput', function(e, d) {
                if(d==0){
                    $scope.dataName='';
                }else {

                }
            })
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);

//弹出确认删除模态框
app.controller('deleteModalInstanceCtrl', ['$scope', '$modalInstance','item', function ($scope, $modalInstance,item) {
    $scope.item=item;
    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
