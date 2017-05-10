/**
 * Created by clf on 2015/12/4.
 */
(function(){
    app.controller('doctorKnowledgeInfoCtrl',funcdoctorKnowledgeInfoCtrl);
    funcdoctorKnowledgeInfoCtrl.$inject=['$scope', '$timeout', 'utils', '$http', '$modal', 'toaster', '$location', '$state', '$rootScope','$stateParams', '$sce'];
    function funcdoctorKnowledgeInfoCtrl($scope, $timeout, utils, $http, $modal, toaster, $location, $state, $rootScope, $stateParams, $sce) {
        $scope.showTop = false;
        $scope.showQuitTop = false;
        $scope.showEdit = true;
        $scope.showDel = true;
        $scope.isTops = $stateParams.isTop;
        var userId = localStorage.getItem('user_id');
        $scope.isPersonKnowledge = $stateParams.isPersonKnowledge == 'true' ? true : false;
        $scope.isEditBeforeWidthcategoryId=$stateParams.categoryId;
        $scope.isSearchByAllCategory=$stateParams.isSearchByAllCategory;

        if ($scope.isTops == 1) {
            $scope.showTop = false;
            $scope.showQuitTop = true;
        } else if ($scope.isTops == 0) {
            $scope.showTop = true;
            $scope.showQuitTop = false;
        }
        //获取文章的数据
        function getArticleData() {
            $http.post(app.url.knowledge.getDetailById, {
                access_token: app.url.access_token,
                id: $stateParams.id
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.article = {
                        id: data.data.id,
                        url: $sce.trustAsResourceUrl(data.data.url + '?v=' + Date.now())
                    };


                } else {
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        };


        getArticleData();


        //删除文章
        $scope.deleteArticle = function() {
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function(status) {
                if (status == 'ok') {
                    $http.post(app.url.knowledge.delKnowledgeById, {
                        access_token: app.url.access_token,
                        id: $stateParams.id

                    }).
                    success(function(data, status, headers, config) {
                        if (data.resultCode == 1) {
                            toaster.pop('success', null, "删除就医知识成功");
                            $state.go('app.doctorKnowledge.list');
                        } else {
                            console.log(data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        alert(data.resultMsg);
                    });
                }
            }, function() {

            });
        };

        //置顶文章
        $scope.topArticle = function() {
            $http.post(app.url.knowledge.setTop, {
                access_token: app.url.access_token,
                id: $stateParams.id || '',
                bizId: userId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    if (data.data.status == false) {
                        toaster.pop('error', '', data.data.msg);
                    } else {
                        toaster.pop('success', null, "置顶成功");
                        $scope.showTop = false;
                        $scope.showQuitTop = true;
                        //  window.opener.reflashData();
                        //toaster.pop('success','','置顶成功');
                    }
                } else {
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        };

        //取消置顶
        $scope.quitTopArticle = function() {
            $http.post(app.url.knowledge.cancelTop, {
                access_token: app.url.access_token,
                id: $stateParams.id || '',
                bizId: userId
            }).
            success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    if (data.data.status == false) {
                        toaster.pop('error', '', data.data.msg);
                    } else {
                        toaster.pop('success', null, "取消置顶成功");
                        $scope.showTop = true;
                        $scope.showQuitTop = false;
                        //    window.opener.reflashData();
                        // toaster.pop('success','','取消置顶成功');
                    }
                } else {
                    alert(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                console.log(data.resultMsg);
            });
        };

        //编辑文章
        $scope.editArticle = function() {
            $state.go('app.doctorKnowledge.edit', { id: $stateParams.id, categoryId: $stateParams.categoryId, isPersonKnowledge: $stateParams.isPersonKnowledge });
            // $state.go('edit_health_science',{id:$scope.article.id},{'reload':true});
            //  $state.go('edit_health_science',{id:$scope.article.id},{'reload':true});
        };
    };

})();

(function(){
    app.controller('delModalInstanceCtrl',funcdelModalInstanceCtrl);
    funcdelModalInstanceCtrl.$inject=['$scope', '$modalInstance', 'toaster', '$http', 'utils'];
    function funcdelModalInstanceCtrl($scope, $modalInstance, toaster, $http, utils) {
        $scope.ok = function() {
            $modalInstance.close('ok');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();

