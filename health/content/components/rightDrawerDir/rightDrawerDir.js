'use strict';
(function() {
    angular.module('app').factory('RightDrawerFactory', funRightDrawerFactory);

    funRightDrawerFactory.$inject = ['$http', '$state', '$rootScope', '$compile', '$templateCache', '$timeout'];

    function funRightDrawerFactory($http, $state, $rootScope, $compile, $templateCache, $timeout) {

        var $tampleEl = {};

        // 构建html
        var initEl = function(option) {


            // option = {
            //     thisclass:thisclass,
            //     templateurl:templateurl,
            //     controller:controller,
            //     scope:scope
            // }
            var scope = {};
            if (!option.scope) {
                scope = $rootScope.$new();
            } else {
                scope = option.scope;
            };

            if (option.data) {
                scope.data = option.data;
            }


            var _tpl = '<rightDrawer>\
                                <div class="rightDrawer ' + option.thisclass + '">' + (option.tplContent || '') + '</div>\
                                <div class="rightDrawerMask" ng-click="close()"></div>\
                            </rightDrawer>';

            $tampleEl = angular.element(_tpl);
            if (option.controller) {
                $tampleEl.attr('ng-controller', option.controller);
            } else {
                console.warn('没有定义controller');
            }


            // 将element插入body
            angular.element(document.body).append($tampleEl);
            // 绑定scope
            $tampleEl = $compile($tampleEl)(scope);


            // 延迟添加样式， 避免失去打开的过渡动画
            $timeout(function() {
                $tampleEl.addClass('active');
                // 隐藏背景滚动条
                $('html').addClass('clear');
            }, 100);

            scope.close = function() {
                $tampleEl.removeClass('active');
                $('html').removeClass('clear');
                // 延迟删除dom， 避免失去关闭的过渡动画
                $timeout(function() {
                    scope.$destroy();
                    $tampleEl.remove();
                }, 200);
            };
        };

        // 生成并打开抽屉
        var open = function(option) {
            // 是否通过url引入模版
            if (option.templateurl) {
                $http.get(option.templateurl, {
                    cache: $templateCache
                }).success(function(rpn) {
                    option.tplContent = rpn;
                    initEl(option);
                });
            } else {
                // console.warn('no templateurl');
                // return initEl(option);
                option.tplContent = option.template || '';
                initEl(option);
            }
        };

        return {
            open: open
        };

    };
})();
