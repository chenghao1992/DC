// ============================== signinController.js =================================
(function() {
    angular.module('app')
        .controller('SigninCtrl', SigninCtrl);

    // 手动注入依赖
    SigninCtrl.$inject = ['$scope', '$state', 'SigninFactory', 'constants'];

    // 登录控制器
    function SigninCtrl($scope, $state, SigninFactory, constants) {

        $scope.isSingnin = false;
        $scope.signin = function() {

            $scope.signinForm.userName.isNull = false;
            $scope.signinForm.userPassWord.isNull = false;
            $scope.signinForm.isError = false;
            $scope.signinError='';

            if (!$scope.userName) {
                console.log($scope.signinForm.userName)
                return $scope.signinForm.userName.isNull = true;
            }

            if (!$scope.userPassWord) {
                return $scope.signinForm.userPassWord.isNull = true;
            }

            if (!$scope.signinForm.$valid) {
                return $scope.signinForm.isError = true;
            }

            $scope.isSingnin = true;

            var param = {
                telephone: $scope.userName,
                password: $scope.userPassWord,
                userType: 10
            }

            SigninFactory
                .getData(param)
                .then(thenFc)

            function thenFc(response) {
                if (response.resultCode === 1) {
                    localStorage['enterprise_access_token'] = response.data.access_token;
                    //localStorage["enterprise_user"] = JSON.stringify(response.data.user);
                    $scope.userId=response.data.userId;
                    //return $state.go('app.chat');
                    $scope.getUserInfo();

                } else if (response.resultMsg) {

                    $scope.signinError = response.resultMsg;
                    $scope.signinForm.isError = true;
                }

                return $scope.isSingnin = false;
            }
        };

        $scope.getUserInfo=function(){
            var param = {
                access_token:localStorage['enterprise_access_token'],
                userId: $scope.userId
            }

            SigninFactory
                .getUserInfo(param)
                .then(thenFc);
            function thenFc(response){
                if (response.resultCode === 1) {

                    localStorage["enterprise_user"] =JSON.stringify( response.data);
                    return $state.go('app.chat');

                } else if (response.resultMsg) {

                    $scope.signinError = response.resultMsg;
                    $scope.signinForm.isError = true;
                }

                return $scope.isSingnin = false;
            }
        }
    };

})();
