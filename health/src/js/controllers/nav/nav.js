(function () {
    app.controller('navCtrl', ['$rootScope', '$scope', '$http', 'utils', '$state', 'Group', 'toaster', 'AppFactory',
        function ($rootScope, $scope, $http, utils, $state, Group, toaster, AppFactory) {

            var groupId = $scope.groupId || utils.localData('curGroupId');

            // 获取当前组织信息
            //$scope.currentOrgInfo = Group.getCurrentOrgInfo();

            if (utils.localData('has_more_group') === 'true') {
                $scope.has_more_group = true;
            } else {
                $scope.has_more_group = false;
            }

            if (utils.localData('userStatus') === '1') {
                $scope.userStatus = true;
            } else {
                $scope.userStatus = false;
            }
            //眼科医院，判断是不是需要显示眼科医生助手
            (function () {
                $http.get(app.url.care.getGroupId).then(function (data) {
                    if (data.data.resultCode == 1) {
                        if (groupId == data.data.data) {
                            $scope.isEyeGroup = true;
                        } else {
                            $scope.isEyeGroup = false;
                        }

                    }
                })
            })();
            $scope.user = {};
            $scope.isBlocked = false;
            $scope.showIt = true;
            $rootScope.showGroupKnowledge = true;

            Group.handle(groupId, function (group) {

                // 获取当前组织信息
                $scope.currentOrgInfo = group;

                // 是否博徳嘉联
                if ($scope.currentOrgInfo) {
                    AppFactory.group.isServiceGroup($scope.currentOrgInfo.id).then(function (_data) {
                        if (_data) {
                            $scope.isServiceGroup = true;
                        } else {
                            $scope.isServiceGroup = false;
                        }
                    });
                }

                //$scope.user.name = group.user.name || utils.localData('user_name');
                if (group.isBlocked === 'S') {
                    $scope.isBlocked = true;
                } else {
                    $scope.isBlocked = false;
                }
                if ($scope.isBlocked && $rootScope.roleX) {
                    if (group.user.status === "3") {
                        $state.go('app.group_in_blocked_status'); // 跳转到集团异常页面
                    }
                } else if ($state.current.url == '/group_in_blocked_status') {
                    if (!$rootScope.roleX) {
                        $state.go('app.invite_list', null, {
                            reload: false
                        });
                    } else {
                        if (group.user.status === "3" && group.status.applyStatus === 'P') {
                            $state.go('app.contacts', null, {
                                reload: false
                            });
                        }
                    }
                }
                if (!group.name) {
                    $scope.un_reg = true;
                    $scope.un_check = false;
                    $rootScope.un_check = false;
                    $scope.user.isInGroup = false;
                    $scope.user.isAdmin = false;
                    $scope.isSysAdmin = false; // 是否为管理员
                    $rootScope.isSysAdmin = false;
                    $rootScope.isActive = false;

                    $scope.datas.user_headPicFile = (utils.localData('headPicFile') || 'src/img/a0.jpg');

                    return;
                }
                // 用户头像
                if (group.user.headPic) {
                    $scope.datas.user_headPicFile = group.user.headPic;
                } else {
                    $scope.datas.user_headPicFile = 'src/img/a0.jpg';
                }

                // 记录用户状态（3-集团管理员，2-集团成员，1-集团外医生）
                switch (group.user.status) {
                    case '1':
                        $scope.user.isInGroup = false;
                        $scope.user.isAdmin = false;
                        $rootScope.isSysAdmin = false;
                        break;
                    case '2':
                        $scope.user.isInGroup = true;
                        $scope.user.isAdmin = false;
                        $rootScope.isSysAdmin = false;
                        break;
                    case '3':
                        $scope.user.isAdmin = true;
                        $scope.user.isInGroup = true;
                        $rootScope.isSysAdmin = true;

                        var userStatus = utils.localData('userStatus');
                        if (userStatus != '1') {
                            //$rootScope.notAvailable = true;
                        }

                        break;
                    default:
                        break;
                }


                if ($scope.isBlocked) {
                    $rootScope.showGroupKnowledge = false;
                }

                if (!$rootScope.roleX) {
                    $scope.user.isInGroup = true;
                    $scope.user.isAdmin = false;
                    $rootScope.isSysAdmin = true;
                    $scope.showIt = true;
                }


                // 集团是否激活
                switch (group.status.active) {
                    case 'active':
                        $rootScope.isActive = true;
                        group.status.applyStatus = 'P';
                        break;
                    case 'inactive':
                        $rootScope.isActive = false;
                        if (group.status.applyStatus === undefined) {
                            group.status.applyStatus = 'P';
                        }
                        break;
                    default:
                        $rootScope.isActive = true;
                        break;
                }

                // 集团审核状态
                switch (group.status.applyStatus) {
                    case 'P':
                        $scope.un_reg = false;
                        $scope.un_check = false;
                        $rootScope.un_check = false;
                        $scope.pass = true;
                        $scope.step_apply = true
                        $scope.step_check = true;
                        $scope.step_active = true;
                        $scope.step_status = true;
                        break;
                    case 'NP':
                        $scope.un_reg = false;
                        $scope.un_check = false;
                        $rootScope.un_check = false;
                        $scope.step_apply = true
                        $scope.step_check = true;
                        $scope.step_active = false;
                        $scope.no_pass = true;
                        $scope.step_status = false
                        break;
                    case 'A':
                        $scope.un_reg = false;
                        $scope.un_check = true;
                        $rootScope.un_check = true;
                        $scope.step_apply = true;
                        $scope.step_check = true;
                        $scope.step_active = false;
                        $scope.step_status = true;
                        break;
                    default:
                        $scope.un_reg = true;
                        $rootScope.un_check = false;
                        $scope.step_apply = true;
                        $scope.step_check = true;
                        $scope.step_active = false;
                        $scope.step_status = true;
                        //logoImg = $scope.groupLogoUrl = utils.localData('headPicFile') || 'src/img/logoDefault.jpg';
                        break;
                }

                $scope.datas.groupPicFile = group.logo; // 设置集团LOGO

            });


            // 是否有资格创建集团
            $http({
                url: app.url.yiliao.hasCreateRole,
                method: 'post',
                data: {
                    access_token: app.url.access_token,
                    doctorId: utils.localData('user_id')
                }
            }).then(function (resp) {
                if (resp.data.resultCode == '1') {
                    if (resp.data.data === true) {
                        $rootScope.canCreateGroup = true;
                    } else {
                        $rootScope.canCreateGroup = false;
                    }
                }
            });

            $scope.group = {};
            $scope.user.name = $scope.datas.user_name || utils.localData('user_name');
            //$scope.isRootAdmin = $scope.isRootAdmin || utils.localData('isRootAdmin') === 'true';
            $rootScope.roleX = $rootScope.roleX || utils.localData('roleX') === 'true';
            $scope.user.userId = $scope.datas.user_id || utils.localData('user_id');
            //$scope.group.isIdentified = $scope.group.isIdentified || utils.localData('isIdentified');

            if ($scope.group.isIdentified === true || $scope.group.isIdentified === 'true') {
                $scope.group.isIdentified = true;
            } else {
                $scope.group.isIdentified = false;
            }

            // 设置栏目标签
            setTimeout(function () {
                var nav_li = $('.nav > li > .nav-item');
                for (var i = 0; i < nav_li.length; i++) {
                    nav_li.eq(i).attr('id', 'id_' + i);
                }
                $('#' + utils.localData('curLiId')).addClass('nav-cur-item').parent().parent().parent().addClass('active');
                nav_li.click(function () {
                    nav_li.removeClass('nav-cur-item');
                    $(this).addClass('nav-cur-item');
                    utils.localData('curLiId', $(this).attr('id'));
                });

                $http({
                    url: app.url.yiliao.searchDoctor,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        status: 'J'
                    }
                }).then(function (resp) {
                    if (resp.data.resultCode === 1 && resp.data.data) {
                        if (resp.data.data.total > 0) {
                            $rootScope.hasUncheckedMumber = true;
                        } else {
                            $rootScope.hasUncheckedMumber = false;
                        }
                    }
                }, function (x) {
                    console.error(x.statusText);
                });
            }, 200);


        }
    ]);

})();