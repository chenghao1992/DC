'use strict';
(function() {
    angular.module('app').factory('addTextDomeFtory', AddSurveyFtory);
    // 手动注入依赖
    AddSurveyFtory.$inject = ['$http', '$modal'];
    function AddSurveyFtory($http, $modal) {
        return {
            open: openModel
        };

        function openModel(surveyData, callBack) {

            if (!surveyData) surveyData = {};

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: function() {
                    var isChack = window.location.href.indexOf('/check/');
                    if (isChack != -1)
                        return '../src/tpl/care/carePlan/addText.html';
                    else
                        return 'src/tpl/care/carePlan/addText.html';
                }(),
                controller: 'AddSurveyTextCtrl',
                size: 'lg',
                resolve: {
                    surveyData: function() {
                        return surveyData;
                    }
                }
            });
            modalInstance.result.then(function(surveyData) {
                if (callBack)
                    callBack(surveyData);
            });
        };

    };
    angular.module('app').controller('AddSurveyTextCtrl', AddSurveyTextCtrl);

    AddSurveyTextCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','surveyData'];

    function AddSurveyTextCtrl($scope, $http, $modal, $modalInstance, toaster, surveyData) {
        //初始化
        $scope.selectItemIscheck=true;
        $scope.selectItemGroupID=app.url.groupId();
        $scope.search={keyword:''};
        $scope.stItems=null;
        $scope.selectItem = {};
        //按钮切换
        if (surveyData) {
            if(surveyData.surveyItem){
                var test=surveyData.surveyItem.fromTypeId;
                if(test==1){
                    $scope.selectItemIscheck=false;
                }
            }
            $scope.selectItem = surveyData;
            $scope.surveyData = surveyData;
        }
        //健康科普
        $scope.funTextkepu=function(){
            $scope.selectItemIscheck=true;
            $scope.pageIndex = 1
            setTree();
            $scope.selectItem.lifeScaleId=null;
        };
        //就医知识
        $scope.funTextzhishi=function(){
            $scope.selectItemIscheck=false;
            $scope.pageIndex = 1
            setTree();
            $scope.selectItem.lifeScaleId=null;

        };
        function setTree() {
            var textUrl,param;
            if($scope.selectItemIscheck==true){
                textUrl=app.yiliao+'document/getHealthSienceDocumentType';
                param={
                    access_token: app.url.access_token,
                }
            }else {
                textUrl=app.yiliao+'knowledge/getCategoryList';
                param={
                    access_token: app.url.access_token,
                    groupId: app.url.groupId(),
                }
            }
            var contacts = new Tree('lifeTexeLibraryTree', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1, 0],
                data: {
                    url: textUrl,
                    param: param
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
                    code:'code'
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
        //点击树获取内容
        function treeClick(iTems) {
            $scope.search.keyword="";
            $scope.stItems=iTems;
            $scope.pageIndex=1;
            setTable(iTems);
        };
        //查询
        $scope.queryReportList=function(textContent){
            $scope.search.keyword=textContent;
            $scope.ischeckDoc=true;
            setTable('');
        };
        $scope.cancel=function(){
            $modalInstance.dismiss('cancel');
        }
        $scope.diseaseTypeId = '';
        $scope.diseaseName = '';
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        //表内容
        function setTable(iTems, pageIndex, pageSize) {
            if($scope.selectItemIscheck==false){
                //是否是医生社区的查询
                var textUrl;
                if(iTems.id){
                        textUrl=app.yiliao+'knowledge/getKnowledgeListByCategoryId';
                }else {
                    if($scope.ischeckDoc==true){
                        textUrl=app.yiliao+'knowledge/findKnowledgeListByKeys';
                    }else {
                        textUrl=app.yiliao + 'knowledge/getGroupMedicalKnowledgeList';
                    }
                }
                $http.post(textUrl, {
                    access_token: app.url.access_token,
                    groupId: app.url.groupId(),
                    keywords: $scope.search.keyword ||"",
                    diseaseTypeId: iTems.id || $scope.diseaseTypeId || '',
                    categoryId:iTems.id || $scope.diseaseTypeId || '',
                    pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
                    pageSize: pageSize || $scope.pageSize || 10
                }).
                then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn.resultCode === 1) {
                        $scope.surveyList = rpn.data.pageData;
                        $scope.page_count = rpn.data.total;
                        if($scope.page_count==0){
                            toaster.pop('error',null,'未找到相关的文章');
                            return ;
                        }
                    } else if (rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '接口出错');
                    };
                });
            }else{
                var textUrl=app.yiliao+'document/getHealthSicenceDocumentList';
                $http.get(textUrl,{params:{
                    access_token: app.url.access_token,
                    kw:$scope.search.keyword|| '',
                    contentType:iTems.code || $scope.stItems.code ||'',
                    pageIndex: pageIndex - 1 || $scope.pageIndex - 1 || 0,
                    pageSize: pageSize || $scope.pageSize || 10
                }}).then(function(rpn){
                    rpn = rpn.data;
                    if (rpn.resultCode === 1) {
                        if(rpn.data){
                            $scope.surveyList = rpn.data.pageData;
                            $scope.page_count = rpn.data.total;
                        }else{
                            toaster.pop('error',null,'未找到相关的文章');
                        }

                    } else if (rpn.resultMsg) {
                        toaster.pop('error', null, rpn.resultMsg);
                    } else {
                        toaster.pop('error', null, '接口出错');
                    };
                })
            }
        };
        //保存推荐文章
        $scope.ok = function() {
             // if(!$scope.selectItem.lifeScaleId) {
             //    return toaster.pop('error',null,'请选择文章')
             // }
            //console.log($scope.selectItem.lifeScaleId);
            //console.log($scope.surveyData);
            submitsurveyData($scope.selectItem.lifeScaleId);
        };
        //点击事件
        $scope.selectLifeQuality = function(item) {
            $scope.selectItem = {
                lifeScaleId: item
            };
        };
        $scope.setTable = setTable;
        //提交文章，
        function submitsurveyData(data){
            var param={};
            if($scope.selectItemIscheck==true){ //判断是否是健康社区还是医生社区
                if(data){ //判断是编辑还是新增加
                    param={
                        access_token: app.url.access_token,
                        sendTime: $scope.surveyData.sendTime,
                        carePlanId: $scope.surveyData.carePlanId,
                        schedulePlanId: $scope.surveyData.schedulePlanId,
                        dateSeq: $scope.surveyData.dateSeq,
                        jsonData: JSON.stringify({
                            'documentId':data.id,
                            'fromTypeId':0,
                            'title':data.title,
                            'picUrl':data.copy,
                            'url':data.url
                        })
                    }
                }else{
                    if(!$scope.surveyData.surveyItem){ //是否选择了文章
                        return toaster.pop('error',null,'请选择文章');
                    }
                    param={
                        access_token: app.url.access_token,
                        sendTime: $scope.surveyData.sendTime,
                        carePlanId: $scope.surveyData.carePlanId,
                        schedulePlanId: $scope.surveyData.schedulePlanId,
                        dateSeq: $scope.surveyData.dateSeq,
                        jsonData: JSON.stringify({
                            'documentId':$scope.surveyData.surveyItem.documentId,
                            'fromTypeId':$scope.surveyData.surveyItem.fromTypeId,
                            'title':$scope.surveyData.surveyItem.title,
                            'picUrl':$scope.surveyData.surveyItem.picUrl,
                            'url':$scope.surveyData.surveyItem.url
                        })
                    }
                }
            }else{
                if(data){
                    param={
                        access_token: app.url.access_token,
                        sendTime: $scope.surveyData.sendTime,
                        carePlanId: $scope.surveyData.carePlanId,
                        schedulePlanId: $scope.surveyData.schedulePlanId,
                        dateSeq: $scope.surveyData.dateSeq,
                        jsonData: JSON.stringify({
                            'documentId':data.id,
                            'fromTypeId':1,
                            'title':data.title,
                            'picUrl':data.copy,
                            'url':data.url
                        })
                    }
                }else{
                    if(!$scope.surveyData.surveyItem){ //是否选择了文章
                        return toaster.pop('error',null,'请选择文章');
                    }
                    param={
                        access_token: app.url.access_token,
                        sendTime: $scope.surveyData.sendTime,
                        carePlanId: $scope.surveyData.carePlanId,
                        schedulePlanId: $scope.surveyData.schedulePlanId,
                        dateSeq: $scope.surveyData.dateSeq,
                        jsonData: JSON.stringify({
                            'documentId':$scope.surveyData.surveyItem.documentId,
                            'fromTypeId':$scope.surveyData.surveyItem.fromTypeId,
                            'title':$scope.surveyData.surveyItem.title,
                            'picUrl':$scope.surveyData.surveyItem.picUrl,
                            'url':$scope.surveyData.surveyItem.url
                        })
                    }
                }

            }
            if ($scope.surveyData.id)
                param.id = $scope.surveyData.id;
            $http.post(app.yiliao+'designer/saveDocumentItem',param)
                .success(function(rpn){
                    if (rpn.resultCode == 1) {
                        toaster.pop('success', null, '添加成功');
                        $modalInstance.close(rpn.data);
                    }else {
                        toaster.pop('success', null, '请选择文章');
                    }
                })
        }
        //预览文章
        $scope.surveyCheck = function(lifeScaleId) {
            var itemType;
            if($scope.selectItemIscheck==true){
                 itemType=1;
            }else{
                 itemType=2;
            }
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'addTextDomeChickCtrl.html',
                controller: 'ModalSurveyTextChickCtrl',
                size: 'lg',
                resolve: {
                    itemId: function() {
                        return lifeScaleId;
                    },
                    itemType:function(){
                        return itemType;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
            }, function() {});
        };
        //分页
        $scope.setTable = function (a,pageindex,pagesize) {
            $scope.ischeckPage=true;
            setTable($scope.stItems,pageindex,pagesize);
        }
        $scope.pageChanged = function() {
            setTable($scope.stItems);
        };
    }
    
angular.module('app').controller('ModalSurveyTextChickCtrl', ModalSurveyTextChickCtrl);

ModalSurveyTextChickCtrl.$inject = ['$scope', '$http', '$modal', '$modalInstance','toaster','itemId', 'itemType'];

function ModalSurveyTextChickCtrl($scope, $http, $modal, $modalInstance, toaster,itemId,itemType){
    var textUrl;
    if(itemType==1){
        textUrl=app.yiliao+'document/getDocumentDetail';
    }else {
        textUrl=app.yiliao+'knowledge/getDetailById';
    }

    //knowledge/getDetailById  文章预览（集团）
    //document/getDocumentDetail 文章预览（平台）

    $http.post(textUrl,{
        access_token: app.url.access_token,
        id:itemId

    }).success(function(rpn){
        if (rpn.resultCode === 1) {
            $scope.surveyData = rpn.data;
            console.log($scope.surveyData);
        } else if (rpn.resultMsg) {
            toaster.pop('error', null, rpn.resultMsg);
        } else {
            toaster.pop('error', null, '接口出错');
        };
    })
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();
