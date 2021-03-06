/**
 * Created by clf on 2015/12/4.
 */
'use strict';
(function () {
    app.controller('DrugADArticleCtrl', ['$scope', '$timeout','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams','$sce',function($scope, $timeout,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,$sce) {
        $scope.showTop=false;
        $scope.showQuitTop=false;
        $scope.showEdit=true;
        $scope.showDel=true;

        //获取文章的数据
        function getArticleData(){
            $http.post(app.url.drug.getAdvertisementById, {
                access_token:app.url.access_token,
                id:$stateParams.id
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.article={
                        id:data.data.id,
                        url:$sce.trustAsResourceUrl(data.data.url+'?v='+Date.now())
                    };

                    if(data.data.weight>0){
                        $scope.showTop=false;
                        $scope.showQuitTop=true;
                    }
                    else if(data.data.weight<=0){
                        $scope.showTop=true;
                        $scope.showQuitTop=false;
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
                    $http.post(app.url.drug.deleteAdvertisement, {
                        access_token:app.url.access_token,
                        id:$stateParams.id
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

        //显示文章
        $scope.topArticle=function(){
            $http.post(app.url.drug.setTop, {
                access_token:app.url.access_token,
                id:$scope.article.id,
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        toaster.pop('error','',data.data.msg);
                    }
                    else{
                        $scope.showTop=false;
                        $scope.showQuitTop=true;
                        window.opener.reflashData();
                        toaster.pop('success','','显示成功');
                    }
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        };

        //取消置顶
        $scope.quitTopArticle=function(){
            $http.post(app.url.drug.cancelTop, {
                access_token:app.url.access_token,
                id:$scope.article.id,
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    if(data.data.status==false){
                        toaster.pop('error','',data.data.msg);
                    }
                    else{
                        $scope.showTop=true;
                        $scope.showQuitTop=false;
                        window.opener.reflashData();
                        toaster.pop('success','','取消显示成功');
                    }
                }
                else{
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        };


        //编辑文章
        $scope.editArticle=function(){
            $state.go('edit_drug_ad',{id:$scope.article.id},{'reload':true});
        };
    }]);

    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance','toaster','$http','utils',function ($scope, $modalInstance,toaster,$http,utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();
