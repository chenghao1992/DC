'use strict';
(function() {
    angular.module('app').factory('SureDialogFactory', funSureDialogFactory);

    funSureDialogFactory.$inject = ['$uibModal', '$templateCache'];

    function funSureDialogFactory($uibModal, $templateCache) {

        var template = '\
                        <div class="panel panel-default" style="margin-bottom: 0;">\
                            <div class="panel-heading font-bold">{{diolog.title||"标题"}}</div>\
                            <div class="panel-body">\
                                <div class="panel panel-default">\
                                    <div class="panel-heading" style="border-bottom:none">\
                                        <div class="clearfix">\
                                            <i class="txt-warn pull-left thumb-md avatar fa fa-warning"></i>\
                                            <div class="clear">\
                                                <div class="h3 m-t-xs m-b-xs" ng-if="diolog.subtitle">{{diolog.subtitle}}</div>\
                                                <small class="text-muted" ng-if="diolog.content">{{diolog.content||"内容"}}</small>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group">\
                                    <div class="col-md-offset-3 col-md-3">\
                                        <button ng-click="sure()" type="button" class="pull-right w100 btn" ng-class="diolog.btnOk.className?diolog.btnOk.className:\'btn-danger\'">{{diolog.btnOk.title?diolog.btnOk.title:\'删除\'}}</button>\
                                    </div>\
                                    <div class="col-md-3">\
                                        <button ng-click="cancel()" type="button" class="pull-right w100 btn " ng-class="{{diolog.btnCancle.className?diolog.btnCancle.className:\'btn-default\'}}">{{diolog.btnCancle.title?diolog.btnCancle.title:\'取消\'}}</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        ';

        function openModal(diolog) {

            if (!diolog)
                var diolog = {};

            var modalInstance = $uibModal.open({
                template: template,
                controller: 'SureDialogCtrl',
                // windowClass: 'searchDocModal',
                size: 'md',
                resolve: {
                    diolog: function() {
                        return diolog;
                    }
                }
            });

            modalInstance.result.then(function(isSure) {
                if (!diolog.callback) return;
                if (!angular.isFunction(diolog.callback)) return console.warn('callback no a function');
                diolog.callback(isSure);
            });
        };

        return {
            openModal: openModal
        }
    };


    angular.module('app').controller('SureDialogCtrl', funSureDialogCtrl);

    funSureDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'diolog'];

    function funSureDialogCtrl($scope, $uibModalInstance, diolog) {

        // 内容赋值
        $scope.diolog = diolog;

        //点击确定
        $scope.sure = function() {
            $uibModalInstance.close(true);
        };

        //点击取消
        $scope.cancel = function() {
            $uibModalInstance.close(false);
        };
    };

})();
