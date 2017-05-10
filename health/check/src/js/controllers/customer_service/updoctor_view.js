'use strict';
(function () {
    //主控制器
    app.controller('upDoctorViewCtlr',upDoctorViewCtlr);
    upDoctorViewCtlr.$inject=['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$state', '$stateParams', '$sce','Upload'];
    function upDoctorViewCtlr($scope, $timeout, utils, $http, $modal, toaster, $state, $stateParams, $sce,Upload){
        $scope.document={
            isSaved:false,   //添加按钮
            isShow:false,     //进度条显示
            documentBtn:'选择需要导入的文件',   //btn按钮
            documentDoc:'', //文件
            nubmer:0,   //进度条数值
            excleFile:true,  //文件监听格式
            goTO:true,   //返回按钮
            search:false
        };
        $scope.docItem={};
        $scope.$watch('excleFile',function (files) {
            goUpload (files);
        });
        $scope.goToDocter=function(){
            if($scope.document.isSaved==true){
                $scope.docItem=null;
                $scope.docItemName='';
                $scope.document.documentBtn='选择需要导入的文件';
                $scope.document.isSaved=false;
            }else {
                $state.go('app.check.doctor.check_list',{type:'pass',page:'page_undefined'});
            }
        }
        //查询文件是否是正确格式。
        function goUpload(files) {
            if (files != null) {
                var isAllow = false;
                var fileTypes = ['xls','xlsx'];
                fileTypes.forEach(function(item, index, array) {
                    if (files.name.split('.').slice(-1)[0] == item) {
                        isAllow = true;
                        $scope.docItem=files;
                        var text=$scope.docItem.name;
                        if(text.length>20){
                            $scope.docItemName=text.substr(0,20)+'...';
                        }else {
                            $scope.docItemName=text;
                        }
                        $scope.document.isSaved=true;
                        $scope.document.documentBtn='重新选择文件';
                    }
                });
                if (!isAllow) {
                    toaster.pop('error', null, '文件类型不支持');
                    return;
                }
            }
        }
        //检验字符Json
        function checkJson(str){

            try{
                JSON.parse(str)
                return true
            }
            catch(e) {
                return false;
            }
        }
        //上传事件(检验文件内容)
        $scope.upload=function(){
            var file=$scope.docItem;
            $scope.document.isShow=false;
            $scope.document.isSaved=false;
            $scope.document.excleFile=false;
            $scope.document.goTO=false;
            $scope.document.search=true;
            file.upload=Upload.upload({
                url:app.url.admin.check.checkUserData+'?access_token='+app.url.access_token,
                data:{
                    access_token:app.url.access_token
                },
                file:file
            });
            file.upload.then(function (response) {
                $scope.document.search=false;
                if(response.data.resultCode==1){
                    $scope.checkDocter(file)

                }else if(response.data.resultCode==0){
                    var errorList=response.data.resultMsg;
                    if(checkJson(errorList)){
                        var errorJosn=errorList;
                        errorJosn=JSON.parse(errorJosn);
                        $scope.errorDocter(errorJosn);
                    }else {
                        toaster.pop('error',null,errorList);
                        $scope.document.isShow=false;
                        $scope.document.isSaved=true;
                        $scope.document.excleFile=true;
                        $scope.document.goTO=true;
                    }
                }else {
                    toaster.pop('error',null,response.data.resultMsg);
                }
            },function(respon){

            },function(evt){

            })
        };
        window.onbeforeunload = function(){
            if($scope.document.isSaved==true ||$scope.document.isShow==true){
                return '您确定要离开本页面吗？';
            }
        };
        //导入文件
        $scope.checkDocter=function(file){
            var modelDome=$modal.open({
                templateUrl: 'checkModelDocter.html',
                controller: 'checkModelDocterCtrl',
                size: 'sm',
                backdrop:'static'
            });
            modelDome.result.then(function(status){
                if(status=='ok'){
                    $scope.document.documentDoc=file;
                    $scope.document.isSaved=false;
                    $scope.document.isShow=true;
                    $scope.document.excleFile=false;
                    $scope.document.goTO=false;
                    file.upload=Upload.upload({
                        url:app.url.admin.check.handleFormUpload+'?access_token='+app.url.access_token,
                        data:{
                            access_token:app.url.access_token
                        },
                        file: file
                    });
                    file.upload.then(function (response) {
                        if(response.data.resultCode==1){
                            $scope.dataListGroup=response.data.data;
                            $scope.passDocter($scope.dataListGroup);
                            file.progress=100;
                        }else {
                            toaster.pop('error',null,response.data.resultMsg)
                        }
                    },function(repst){

                    },function(evt){
                        file.progress = Math.min(99, parseInt(99.0 * evt.loaded / evt.total));
                    })
                }else {
                    $scope.document.isSaved=true;
                    $scope.document.goTO=true;
                    $scope.document.excleFile=true;
                    $scope.document.isShow=false;
                }
            })
        }
        //文件里内容错误输出
        $scope.errorDocter=function(items){
            var modelDome=$modal.open({
                templateUrl: 'errorModelDocter.html',
                controller: 'errorModelDocterCtrl',
                size: 'lg',
                backdrop:'static',
                resolve:{
                    item:function(){
                        return items;
                    }
                }
            })
            modelDome.result.then(function(status){
                if(status=='ok'){
                    //$scope.document.search=false;
                    $scope.document.isShow=false;
                    $scope.document.isSaved=true;
                    $scope.document.excleFile=true;
                    $scope.document.goTO=true;
                }
            })
        }
        //正确提示
        $scope.passDocter=function(items){
            var modelDome=$modal.open({
                templateUrl:'passModelDocter.html',
                controller:'passModelDocterCtrl',
                size:'sm',
                backdrop:'static',
                resolve:{
                    item:items
                }
            })
            modelDome.result.then(function(status){
                if(status=='ok'){
                    $state.reload();
                }
            })
        }
    };
    //文本检查
    app.controller('checkModelDocterCtrl',checkModelDocterCtrl);
    checkModelDocterCtrl.$inject=['$scope','$modalInstance'];
    function checkModelDocterCtrl($scope,$modalInstance){
        $scope.ok=function(){
            $modalInstance.close('ok');
        }
        $scope.cancel=function(){
            $modalInstance.close('error');
        }
    };
    //错误文件显示
    app.controller('errorModelDocterCtrl',errorModelDocterCtrl);
    errorModelDocterCtrl.$inject=['$scope','$modalInstance','item'];
    function errorModelDocterCtrl($scope,$modalInstance,item){

        $scope.errorListData=item;

        $scope.ok=function(){
            $modalInstance.close('ok');
        }
        $scope.cancel=function(){
            $modalInstance.close('ok');
        }
    };
    //成功后提示
    app.controller('passModelDocterCtrl',passModelDocterCtrl);
    passModelDocterCtrl.$inject=['$scope','$modalInstance','item'];
    function passModelDocterCtrl($scope,$modalInstance,item){
        $scope.listData=item;
        $scope.ok=function(){
            $modalInstance.close('ok');
        }
    };
})();
