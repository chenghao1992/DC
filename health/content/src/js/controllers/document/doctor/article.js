/**
 * Created by clf on 2015/11/6.
 */
'use strict';
(function() {

angular.module('app').controller('DoctorArticleCtrl', DoctorArticleCtrl);

DoctorArticleCtrl.$inject = ['$scope', '$timeout','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams','$sce'];

function DoctorArticleCtrl($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$sce) {
    $scope.showEdit=false;
    $scope.showDel=false;
    $scope.showCollect=false;
    $scope.showRCollect=false;
    $scope.articleNoFound=false;

    var curGroupId=localStorage.getItem('curGroupId');
    var userId=localStorage.getItem('user_id');

    var getArticleParam={
        access_token:app.url.access_token,
        articleId:$stateParams.id,
        createType:$stateParams.createType
    };

    if($stateParams.id==6){
        getArticleParam.createrId=curGroupId;
    }

    //获取文章的数据
    function getArticleData(){
        $http.post(app.url.document.getArticleByIdWeb, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:$stateParams.createType
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data){
                        $scope.article={
                            id:data.data.id,
                            url:$sce.trustAsResourceUrl(data.data.url+'?v='+Date.now())
                        };

                        if(data.data.collect==2){
                            $scope.showEdit=true;
                            $scope.showDel=true;
                        }
                        if(data.data.collect==0){
                            $scope.showCollect=true;
                        }
                        if(data.data.collect==1){
                            $scope.showRCollect=true;
                        }
                    }
                    else{
                        $scope.articleNoFound=true;
                    }

                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    };

    getArticleData();

    //删除文章
    $scope.deleteArticle=function(){
        var modalInstance = $modal.open({
            templateUrl: 'delModalContent.html',
            controller: 'delModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (status) {
            if(status=='ok'){
                $http.post(app.url.document.delArticle, {
                    access_token:app.url.access_token,
                    articleId:$stateParams.id
                }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            window.opener.reflashData();
                            window.close();
                        }
                        else{
                            console.log(data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        alert(data.resultMsg);
                    });
            }
        }, function () {

        });
    };


    //收藏
    $scope.collectArticle=function(){
        $http.post(app.url.document.collectArticle, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:3,
            createrId:userId
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data=="false"){
                        toaster.pop('success','','收藏失败');
                        $scope.showCollect=true;
                        $scope.showRCollect=false;
                    }
                    else if(data.data=="true"){
                        window.opener.reflashData();
                        toaster.pop('success','','收藏成功');
                        $scope.showCollect=false;
                        $scope.showRCollect=true;
                    }
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
    };

    //取消收藏
    $scope.removeCollect=function(){
        $http.post(app.url.document.collectArticleRemove, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:3
        }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    window.opener.reflashData();
                    toaster.pop('success','','取消收藏成功');
                    $scope.showCollect=true;
                    $scope.showRCollect=false;
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
    };


    //编辑文章
    $scope.editArticle=function(){
        $state.go('doctor_edit_article',{id:$scope.article.id,createType:$stateParams.createType},{'reload':true});
    };
};

angular.module('app').controller('delModalInstanceCtrl', delModalInstanceCtrl);
delModalInstanceCtrl.$inject = ['$scope', '$modalInstance','toaster','$http','utils'];
function delModalInstanceCtrl($scope, $modalInstance,toaster,$http,utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

})();