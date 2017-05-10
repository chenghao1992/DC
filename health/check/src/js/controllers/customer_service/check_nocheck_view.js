'use strict';
(function () {
    app.controller('CheckNoCheckView', ['$scope', '$http', '$state', '$rootScope', '$stateParams','utils', 'modal', 'ModelDialogFactory','$modal',
        function($scope, $http, $state, $rootScope, $stateParams,utils, modal, ModelDialogFactory,$modal) {
            $scope.authError = null;
            $scope.viewData = {};
            $scope.urlType=$stateParams.type;
            $scope.urlIndex=$stateParams.page;
            //$scope.viewData.doctorPortrait = $rootScope.curDoctorPic || utils.localData('curDoctorPic');
            $scope.viewData.isDoctor = false;
            var id = '',
                doctorInfo = {
                    hospital: utils.localData('hospital') || '--',
                    departments: utils.localData('departments') || '--',
                    title: utils.localData('title') || '--'
                };
            if ($scope.details) {
                id = $scope.details.id;
                if (!utils.localData('idVal', id)) {
                    console.error('数据未保存！');
                }
            } else {
                id = utils.localData('idVal');
                if (!id) {
                    console.error('无有效数据！');
                    return;
                }
            }

            // 获取要审核的医生数据
            if (id) {
                $http({
                    url: app.url.admin.check.getDoctor,
                    data: {
                        id: id,
                        access_token: app.url.access_token
                    },
                    method: 'POST'
                }).then(function(dt) {
                    if (dt.data.resultCode !== 1) {
                        $scope.authError = '获取数据失败！';
                        return;
                    }
                    dt = dt.data.data;
                    var date = dt.licenseExpire;
                    if (date) {
                        date = new Date(dt.licenseExpire);
                        var _y = date.getFullYear();
                        var _m = date.getMonth() + 1;
                        var _d = date.getDate();
                    }
                    $scope.viewData = {
                        doctorPortrait: dt.headPicFileName || 'src/img/a0.jpg',
                        origin: dt.source || '--',
                        inviter: dt.inviterName || '--',
                        name: dt.name || '--',
                        userId: dt.userId || '--',
                        doctorNum: dt.doctorNum || '--',
                        hospital: dt.hospital || doctorInfo.hospital || '--',
                        departments: dt.departments || doctorInfo.departments || '--',
                        title: dt.title || doctorInfo.title || '--',
                        telephone: dt.telephone || '--',
                        status: dt.status == 3 ? '未通过' : dt.status == 1 ? '已通过' : '待审核',
                        remark: dt.remark || '--',
                        checker: dt.checker || '--',
                        licenseExpire: date ? _y + ' 年 ' + _m + ' 月 ' + _d + ' 日' : '--',
                        licenseNum: dt.licenseNum || '--',
                        assistantName: dt.assistantName || '--',
                        isDoctor: dt.userType == '3' ? true : false,
                        role: dt.role == '1' ? '医生' : dt.role == '2' ? '护士' : dt.role == '3' ? '其他' : '--',
                        certTime:dt.certTime||'--',
                        checkTime:dt.checkTime||'--',
                        modifyTime:dt.modifyTime||'--',
                        services:dt.services.length!=0?dt.services:['--'],
                        sex: dt.sex == '1' ?  '男' : dt.sex == '2' ?  '女' :'--',
                        group:dt.groupNames.length!=0?dt.groupNames:['--'],
                        introduction: dt.introduction || '--',
                        skill:dt.skill || '--',
                        keywords:dt.expertises
                    };

                    $scope.formData = {
                        access_token: app.url.access_token,
                        name: dt.name || '',
                        userId: dt.userId || '',
                        doctorNum: dt.doctorNum || '',
                        hospital: dt.hospital || '',
                        hospitalId: dt.hospitalId || '',
                        departments: dt.departments || '',
                        deptId: dt.deptId || '',
                        title: dt.title || '',
                        licenseExpire: dt.licenseExpire || '',
                        licenseNum: dt.licenseNum || '',
                        role: dt.role || 0,
                        assistantId: dt.assistantId || '',
                    };
                });

                // 获取要医生证件图片
                $http.get(app.url.user.getDoctorFile + '?' + $.param({
                        doctorId: id,
                        type: 5,
                        access_token: app.url.access_token
                    })).then(function(dt) {
                    dt = dt.data.data;
                    if (dt && dt.length > 0 && dt[0].url !== 'false') {
                        $scope.imgs = [];
                        for (var i = 0; i < dt.length; i++) {
                            $scope.imgs.push(dt[i].url);
                        }
                    } else {
                        $scope.imgs = false;
                    }
                });
            }

            // 不操作返回
            $scope.return = function() {
                // $rootScope.ids = [];
                // window.history.back();
                $rootScope.ids = [];
                // window.history.back();
                var params={
                    type:$scope.urlType,
                    page:$scope.urlIndex,
                    isone:'true'
                };
                $state.go('app.check.doctor.check_list',params);
            };

            // 审核通过
            $scope.checkAsPass = function() {
                var str = '';
                if (!$scope.formData.name) {
                    str += '“用户名”、';
                }
                if (!$scope.formData.hospital) {
                    str += '“医疗机构”、';
                }
                if (!$scope.formData.departments) {
                    str += '“科室”、';
                }
                if (!$scope.formData.title) {
                    str += '“职称”、';
                }
                if (!$scope.formData.role) {
                    str += '“用户角色” ';
                }

                if (str) {
                    modal.toast.warn(str.replace(/、$/, '') + '不能为空，请编辑相关项！');
                    return;
                }

                if (!$scope.formData.hospitalId) {
                    modal.toast.warn('所选医院可能不存在,请通知管理员进行创建！');
                    return;
                }

                // modal.confirm(null, '<span style="padding:0 150px;">是否确认审核通过？</span>', function() {
                //     $http.post(app.url.admin.check.checked, $scope.formData).then(function(resp) {
                //         if (resp.data.resultCode == 1) {
                //             window.history.back();
                //         } else {
                //             modal.toast.warn(resp.data.resultMsg);
                //             $scope.authError = resp.data.resultMsg;
                //         }
                //     }, function(x) {
                //         $scope.authError = '服务器错误！';
                //     });
                // }, null, { OK: '是，审核通过', CANCEL: '取 消' });

                // 确认弹窗
                ModelDialogFactory.open({
                    title: '确认',
                    template: '\
                            <div class="center" style="padding:0 150px;">\
                                <div class="text-lg">是否确认审核通过？</div>\
                                <div>\
                                    <div class="checkbox">\
                                      <label>\
                                        <input type="checkbox" ng-model="sendSMS" ng-init="sendSMS = true">发短信通知用户审核结果\
                                      </label>\
                                    </div>\
                                </div>\
                            </div>\
                        ',
                    callback: function(button, _scope) {

                        if (button.type == 1) {
                            var data = $scope.formData;
                            data.sendSMS = _scope.sendSMS || false;

                            $http.post(app.url.admin.check.checked, data).then(function(resp) {
                                if (resp.data.resultCode == 1) {
                                    window.history.back();
                                } else {
                                    modal.toast.warn(resp.data.resultMsg);
                                    $scope.authError = resp.data.resultMsg;
                                }
                            }, function(x) {
                                $scope.authError = '服务器错误！';
                            });
                        }

                    },
                    buttons: [{
                        type: 1,
                        class: 'col-xs-4 col-xs-offset-1 btn-danger',
                        label: '是，审核通过',
                    }, {
                        type: 0,
                        class: 'col-xs-4 col-xs-offset-2',
                        label: '取消',
                    }]
                })

            };
            //点击发大图片
            $scope.showBigImg=function (url) {
                var modalInstance = $modal.open({
                    templateUrl: 'bigImg.html',
                    controller: 'bigImgCtrl',
                    size:'md',
                    windowClass:'modalClass',
                    resolve: {
                        items:function(){
                            return{
                                url: url
                            }
                        }
                    }
                });
                modalInstance.result.then(function(data){
                    console.log(data);
                });


            }

        }
    ]);
    app.controller("bigImgCtrl",['$scope','$modalInstance','items',function($scope,$modalInstance,items){
        console.log(items.url);
        $scope.url=items.url;

    }])

})();
