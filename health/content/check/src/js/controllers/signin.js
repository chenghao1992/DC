'use strict';

// 登录控制器
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils', '$timeout',
  function($scope, $http, $state, $cookieStore, utils, $timeout) {
    $scope.user = {};
    $scope.authError = null;
    var _remember = $('#rememberInfo');
    var _isRemembered = utils.localData('check_user_remember');
    var _telephone = utils.localData('check_user_telephone');
    var _password = utils.localData('check_user_password');

    // 延迟200毫秒后初始化一些数据
    $timeout(function() {
        if (_isRemembered) {
            _remember.attr('checked', true);
            if (_isRemembered && _telephone && _password) {
                $scope.user.telephone = _telephone;
                $scope.user.password = _password;
                $scope.$apply($scope.user);
                $scope.$apply($scope.password);
            }
        }
    }, 200);

    $scope.login = function() {
      $scope.authError = null;
      $http.post(app.url.login, {
        telephone: $scope.user.telephone,
        password: $scope.user.password,
        userType: 4
      }).then(function(response) {
        if (response.data.resultCode === 1) {
          var _name = response.data.data.user.name;
          var _type = $scope.userType['type_' + response.data.data.user.userType];
          var _userId=response.data.data.userId;
          $scope.datas.check_user_name = _name;
          $scope.datas.check_user_type = _type;
          utils.localData('check_user', JSON.stringify( response.data.data.user));
          utils.localData('check_user_name', _name);
          utils.localData('check_user_type', _type);
          utils.localData('check_user_id',_userId);

          if(_remember.prop("checked")){
            utils.localData('check_user_remember', true);
            utils.localData('check_user_telephone', $scope.user.telephone);
            utils.localData('check_user_password', $scope.user.password);
          }else{
            utils.localData('check_user_remember', null);
            utils.localData('check_user_telephone', null);
            utils.localData('check_user_password', null);
          }

          utils.setCookie('a', response.data.data.access_token);
          app.url.access_token = response.data.data.access_token;
          $scope.token= response.data.data.access_token;
          utils.localData('check_access_token', app.url.access_token);

          var days = 1;
          var exp = new Date();
          exp.setTime(exp.getTime() + 30 * 1000);
          $cookieStore.put('check_username', escape($scope.user.name) + ';expires=' + exp.toGMTString());
          $scope.loginFeedback();
          $state.go('app.home');
        } else {
          $scope.authError = '用户名或密码错误';
        }
      }, function(x) {
        $scope.authError = '服务器错误';
      });
    };
  }
]);