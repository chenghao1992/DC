/**
 * Created by clf on 2015/11/6.
 */
'use strict';
(function() {

app.controller('GroupArticleCtrl', function($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$sce) {
    $scope.showCollect=false;
    $scope.showRCollect=false;
    $scope.showEdit=false;
    $scope.showDel=false;
    $scope.articleNoFound=false;

    //当前集团id
    var curGroupId=localStorage.getItem('curGroupId');

    //获取文章的数据
    function getArticleData(){
        $http.post(app.url.document.getArticleByIdWeb, {
            access_token:app.url.access_token,
            articleId:$stateParams.id,
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data){
                    $scope.article={
                        id:data.data.id,
                        url:$sce.trustAsResourceUrl(data.data.url+'?v='+Date.now())
                    };
                    if(data.data.collect==2){
                        $scope.showDel=true;
                        $scope.showEdit=true;
                    }
                    else if(data.data.collect==1){
                        if(data.data.groupId.indexOf(curGroupId)>-1){
                            $scope.showDel=true;
                            $scope.showRCollect=false;
                            $scope.showEdit=true;
                        }
                        else{
                            $scope.showDel=false;
                            $scope.showRCollect=true;
                            $scope.showEdit=false;
                        }
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
            console.log(data.resultMsg);
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
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                if(data.data=="false"){
                    toaster.pop('success','','收藏失败');
                    $scope.showCollect=true;
                    $scope.showRCollect=false;
                }
                else if(data.data=="true"){
                    toaster.pop('success','','收藏成功');
                    window.opener.reflashData();
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
            createType:2,
            createrId:curGroupId
        }).
        success(function(data, status, headers, config) {
            if(data.resultCode==1){
                toaster.pop('success','','取消收藏成功');
                window.opener.reflashData();
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
        $state.go('group_edit_article',{id:$scope.article.id},{'reload':true});
    };
});

app.controller('delModalInstanceCtrl', function ($scope, $modalInstance,toaster,$http,utils) {
    $scope.ok = function() {
        $modalInstance.close('ok');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

})();