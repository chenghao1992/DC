'use strict';

// 首页控制器
app.controller('HomeController', ['$state', '$cookieStore', '$http', '$rootScope', 'utils',
    function ($state, $cookieStore, $http, $rootScope, utils) {
        var date = new Date();
        var _y = date.getFullYear();
        var _M = date.getMonth() + 1;
        var _d = date.getDate();
        var _h = date.getHours();
        var _m = date.getMinutes();
        console.log('欢迎来到 [' + document.title + '], 当前时间是: ' + _y + ' 年 ' + _M + ' 月 ' + _d + ' 日 ' + (_h >= 12 ? ('下午 ' + _h % 12) : ('上午 ' + _h)) + ' 点 ' + _m + ' 分');

        var cookie = $cookieStore.get('username');

        if (!cookie) {
            $state.go('access.signin');
        }
    }
]);