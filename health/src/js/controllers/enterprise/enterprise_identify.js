'use strict';
(function() {

angular.module('app').controller('EnterpriseIdentify', EnterpriseIdentify);
EnterpriseIdentify.$inject = ['$rootScope', '$scope', '$http', '$timeout', '$state', 'utils', 'Group', 'modal'];
    function EnterpriseIdentify($rootScope, $scope, $http, $timeout, $state, utils, Group, modal) {

        var groupId = utils.localData('curGroupId'),
            userId;

        $scope.viewData = {};
        $scope.formData = {};
        $scope.isIdentified = true;
        $scope.isIdentifying = false;

        Group.handle(groupId, function(group){

            userId = group.user.id;

            switch (group.status.certStatus){
                case 'NC':
                    $scope.isIdentified = false;
                    $scope.isIdentifying = false;
                    break;
                case 'A':
                    $scope.isIdentified = true;
                    $scope.isIdentifying = true;
                    $scope.waitting = true;
                    $scope.notPass = false;
                    $scope.pass = false;
                    break;
                case 'NP':
                    $scope.isIdentified = true;
                    $scope.isIdentifying = true;
                    $scope.waitting = false;
                    $scope.notPass = true;
                    $scope.pass = false;
                    break;
                case 'P':
                    $scope.isIdentified = true;
                    $scope.isIdentifying = true;
                    $scope.waitting = false;
                    $scope.notPass = false;
                    $scope.pass = true;
                    break;
                default: break;
            }

            if($scope.isIdentified && $scope.isIdentifying){
                $http({
                    url: app.url.yiliao.getGroupCert,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        groupId: $scope.groupId || utils.localData('curGroupId')
                    }
                }).then(function(resp) {
                    if (resp.data.resultCode === 1) {
                        if (resp.data.data && resp.data.data.groupCert) {
                            $scope.companyName = resp.data.data.groupCert.companyName;
                            $scope.orgCode = resp.data.data.groupCert.orgCode;
                            $scope.license = resp.data.data.groupCert.license;
                            $scope.corporation = resp.data.data.groupCert.corporation;
                            $scope.businessScope = resp.data.data.groupCert.businessScope;
                            $scope.accountName = resp.data.data.groupCert.accountName;
                            $scope.openBank = resp.data.data.groupCert.openBank;
                            $scope.bankAcct = resp.data.data.groupCert.bankAcct;
                            $scope.adminName = resp.data.data.groupCert.adminName;
                            $scope.idNo = resp.data.data.groupCert.idNo;
                            $scope.adminTel = resp.data.data.groupCert.adminTel;
                            $scope.idImage = resp.data.data.groupCert.idImage;
                            $scope.orgCodeImage = resp.data.data.groupCert.orgCodeImage;
                            $scope.licenseImage = resp.data.data.groupCert.licenseImage;
                            $scope.remarks = resp.data.data.groupCert.remarks;
                        }else{
                            modal.toast.warn('未提交认证资料！');
                        }
                    } else {
                        $scope.authError = resp.data.resultMsg;
                    }
                }, function(resp) {
                    $scope.authError = resp.data.resultMsg;
                });

                $scope.closeTipWin = function(){
                    $('#btn_close').parents('.idfy-result').remove();
                };
            }
        });

        $scope.identify = function() {
            $scope.isIdentified = false;
            $scope.isIdentifying = true;
        };

        // 提交认证资料
        $scope.submitInfo = function() {
            $http({
                url: app.url.yiliao.submitCert,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    groupId: groupId || utils.localData('curGroupId'),
                    doctorId: userId || utils.localData('user_id'),
                    companyName: $scope.companyName,
                    orgCode: $scope.orgCode,
                    license: $scope.license,
                    corporation: $scope.corporation,
                    businessScope: $scope.businessScope,
                    accountName: $scope.accountName,
                    openBank: $scope.openBank,
                    bankAcct: $scope.bankAcct,
                    adminName: $scope.adminName,
                    idNo: $scope.idNo,
                    adminTel: $scope.adminTel,
                    idImage: $scope.usrPicUrl,
                    orgCodeImage: $scope.orgCodePicUrl,
                    licenseImage: $scope.licPicUrl
                }
            }).then(function(resp) {
                if (resp.data.resultCode === 1) {
                    $scope.isIdentifying = false;
                    $scope.isIdentified = true;

                    $scope.waitting = true;
                    $scope.notPass = false;

                    Group.set('status.certStatus', 'A');

                    $state.reload();
                } else {
                    $scope.authError = resp.data.resultMsg;
                }
            }, function(resp) {
                $scope.authError = resp.data.resultMsg;
            });
        };

        var curFile, progress, imgURL;
        $scope.selectFile = function (model) {
            $scope.upload();
            progress = model + 'Progress';
            imgURL = model + 'Url';
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;

        // 选择文件后回调
        $scope.uploaderAdded = function (up, files) {
            $scope.uploadBoxOpen = true;
        };

        // 文件上传进度
        $scope.progress = function (up, file) {
            $scope[progress] = file.percent;
        };

        // 每个文件上传成功回调
        $scope.uploaderSuccess = function (up, file, info) {
            if (file.url) {
                $scope[imgURL] = file.url;
                $scope.$apply();
            }

            file.result = '上传成功！';
            modal.toast.success('上传成功！');
        };

        // 每个文件上传失败后回调
        $scope.uploaderError = function (up, err, errTip) {
            modal.toast.error('error', null, errTip);
        };
};

})();
