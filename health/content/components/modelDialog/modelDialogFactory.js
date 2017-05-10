'use strict';


// 调用方法:  $Dialog = 传入的参数
// ModelDialogFactory.open({
//     title: '表',
//     template: '内容',  //自定义模版，设置了覆盖默认模版,
//     scope:'定义scope', //自定义模版才生效
//     subtitle:'子标题', // 默认模版的子标题
//     content:'子标题',  // 默认模版的内容
//     callback: function(result) {  //这里的this 指向 $scope
//         console.log(result);
//     },
//     buttons: [{
//         class:'abc', // 每个按钮样式
//         label: '按钮1', // 调用默认方法，点击后关闭弹窗，回调这个对象到 callback
//     }, {
//         label: '按钮2',
//         callback: function() { // 直接调用这个方法，不关闭弹窗,这里的this 指向 $scope
//             alert(1);
//         }
//     }]
// })


(function() {
    angular.module('app').factory('ModelDialogFactory', funModelDialogFactory);

    funModelDialogFactory.$inject = ['$uibModal', '$templateCache'];

    function funModelDialogFactory($uibModal, $templateCache) {

        function initTpl(centent) {
            var template = '\
                    <div class="panel panel-default">\
                        <div class="panel-heading font-bold">{{$Dialog.title||"标题"}}</div>\
                        <div class="panel-body">' +
                (centent || '\
                                                <div class="panel panel-default">\
                                                     <div class="panel-heading" style="border-bottom:none">\
                                                        <div class="clearfix">\
                                                            <i class="txt-warn pull-left thumb-md avatar fa fa-warning"></i>\
                                                            <div class="clear">\
                                                                <div class="h3 m-t-xs m-b-xs" ng-if="$Dialog.subtitle">{{$Dialog.subtitle}}</div>\
                                                                <small class="text-muted" ng-if="$Dialog.content">{{$Dialog.content||"内容"}}</small>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>') +
                '\
                            <div class="line line-dashed b-b line-lg pull-in"></div>\
                            <div class="form-group text-center">\
                                <button ng-click="button.callback?funClick(button.callback):close(button)" ng-disabled="button.disabled===true?true:false" type="button" ng-class="\'btn btn-default \' + button.class"  ng-repeat="button in $Dialog.buttons">{{button.label}}</button>\
                            </div>\
                        </div>\
                    </div>\
                    ';
            return template;
        };

        function open($Dialog) {

            if (!$Dialog)
                var $Dialog = {};

            var modalInstance = $uibModal.open({
                template: initTpl($Dialog.template || ''),
                controller: 'SureDialogCtrl',
                // windowClass: 'searchDocModal',
                size: 'md',
                resolve: {
                    $Dialog: function() {
                        return $Dialog;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (!$Dialog.callback) return;
                if (!angular.isFunction($Dialog.callback)) return console.warn('callback no a function');
                $Dialog.callback.apply(result.scope, [result.button, result.scope]);
            });
        };

        return {
            open: open
        }
    };


    angular.module('app').controller('SureDialogCtrl', funSureDialogCtrl);

    funSureDialogCtrl.$inject = ['$scope', '$uibModalInstance', '$Dialog'];

    function funSureDialogCtrl($scope, $uibModalInstance, $Dialog) {

        // 内容赋值
        $scope.$Dialog = $Dialog;

        //点击取消
        $scope.close = function(button) {
            $uibModalInstance.close({
                button: button,
                scope: $scope
            });
        };

        $scope.funClick = function(fun) {
            fun.apply($scope, []);
        };
    };

})();
