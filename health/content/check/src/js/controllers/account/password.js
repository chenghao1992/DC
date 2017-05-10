'use strict';
(function () {
    app.controller('PasswordCtrl', ['$scope', 'utils', '$http', 'modal',function ($scope, utils, $http, modal) {

        var userId = utils.localData('check_user_id');
        $scope.canSubmit = false;
        var pd = ['oldPassword', 'newPassword', 'newPasswordRepeat'];
        var wt = $scope.$watchGroup(pd, function(newVal, oldVal){
            if(newVal[1] && newVal[1].length < 6){
                $scope.canSubmit = false;
                $scope.textTips = '密码长度不能小于6位！';
            } else if (newVal[1] && newVal[1].length > 18){
                $scope.canSubmit = false;
                $scope.textTips = '密码长度不能大于18位！';
            }else{
                $scope.textTips = '';
                if(newVal[2]){
                    if(newVal[1] !== newVal[2]){
                        $scope.canSubmit = false;
                        $scope.textTips = '两次密码不一致！';
                    }else{
                        $scope.textTips = '';
                        if(newVal[0]){
                            $scope.canSubmit = true;
                        }else{
                            $scope.canSubmit = false;
                        }
                    }
                }
            }
        });
        $scope.updatePW = function(){
            $http.post(app.url.account.updatePassword, {
                access_token: app.url.access_token,
                userId: userId,
                oldPassword: $scope.oldPassword,
                newPassword: $scope.newPassword
            }).then(function(resp) {
                resp = resp.data;
                if (resp.resultCode === 1) {
                    modal.toast.success("修改成功！");
                } else {
                    $scope.textTips = resp.resultMsg;
                };
            });
        };

    }]);

})();
