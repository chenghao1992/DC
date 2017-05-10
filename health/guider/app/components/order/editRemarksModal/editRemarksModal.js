(function() {
    angular.module('app')
        .factory('EditRemarModal', EditRemarModal);

    function EditRemarModal($uibModal) {

        var template = '\
        <div>\
            <div class="text-center m-t-md">写备注</div>\
            <div class="p-md">\
                <textarea ng-model="data.remark" class="form-control" rows="6" placeholder="特殊情况需要备注或通知患者可以在此输入……"></textarea>\
            </div>\
            <div class="text-center">\
                <div>\
                  <label class="i-checks">\
                    <input type="checkbox" ng-model="data.isSend"><i></i> 以短信形式发给患者\
                  </label>\
                </div>\
                <div class="m-t-sm m-b-md">\
                    <button class="btn m-b-xs w-xs btn-success" ng-click="ok(data)">确定</button>\
                    <button class="btn m-b-xs w-xs btn-default" ng-click="cancel()">返回</button>\
                </div>\
            </div>\
        </div>\
        ';

        function open(option) {

            if (!option || !option.data) {
                option = {
                    data: ''
                }
            }

            var modalInstance = $uibModal.open({
                template: template,
                controller: 'EditRemarModalCtrl',
                keyboard: false,
                size: 'md',
                resolve: {
                    data: option.data
                }

            });

            modalInstance.result.then(function(data) {
                if (option.callback) {
                    option.callback(data);
                }
            });
        };

        return {
            open: open
        }

    };

    angular.module('app')
        .controller('EditRemarModalCtrl', EditRemarModalCtrl)

    function EditRemarModalCtrl($scope, $modalInstance, data) {
        $scope.data = data || '';

        //点击取消
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        // 确定
        $scope.ok = function(data) {
            $modalInstance.close(data);
        };
    };

})();
