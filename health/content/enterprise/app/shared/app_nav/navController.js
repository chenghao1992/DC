// ============================== appNavController.js =================================
(function() {
    angular.module('app')
        .controller('AppNavCtrl', AppNavCtrl);

    // 手动注入依赖
    AppNavCtrl.$inject = ['$scope', '$state', 'AppNavFactory', '$timeout', '$rootScope','ChangePwdModalFactory','toaster','constants'];

    // 登录控制器
    function AppNavCtrl($scope, $state, AppNavFactory, $timeout, $rootScope,ChangePwdModalFactory,toaster,constants) {

        $scope.user = JSON.parse(localStorage['enterprise_user']);
        var userId= $scope.user.id;

        // 路由改变
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                // console.log(event, toState, toParams, fromState, fromParams);
                $scope.isopen = false;
            });
        window.onbeforeunload=function(){
            return '';
        };

        $scope.signOut = function() {

            var param = {
                access_token: localStorage['enterprise_access_token']
            }

            // 退出登录
            AppNavFactory
                .signOut(param)
                .then(thenFc);

            function thenFc(response) {
                if (response.data.resultMsg) {
                    console.log(response.data.resultMsg);
                }
                localStorage.removeItem('enterprise_user');
                localStorage.removeItem('enterprise_access_token');
                // localStorage.removeItem('guider_access_token');

                $state.go('signin');
            }
        };

        if (!localStorage['enterprise_user'])
            return $scope.signOut();

        $scope.user = JSON.parse(localStorage['enterprise_user']);


        //修改密码
        $scope.openChangePwdModal=function(){
            ChangePwdModalFactory.openChangePwdModal('md');
        };

    };

})();
