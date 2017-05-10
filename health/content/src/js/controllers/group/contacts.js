'use strict';
(function(){
    app.controller('Contacts',funcContactsCtrl);
    funcContactsCtrl.$inject=['$rootScope', '$scope', '$state', '$http', '$compile', 'utils', 'modal', 'Group','$stateParams'];
    function funcContactsCtrl($rootScope, $scope, $state, $http, $compile, utils, modal, Group,$stateParams) {
        //$state.go('app.relationship.list', null, {reload: true})
        //Group.getData();
        // $state.reload();
        // console.log('test');
        var data = null,
            cnt_list = $('#cnt_list'),
            items = cnt_list.find('.list-group-item'),
            dt = null,
            groupId = utils.localData('curGroupId'),
            dataURL = app.url.yiliao.getDepartments;

        $scope.loading = true;
        $rootScope.loaded = true;
        $rootScope.isSearching = false;
        $rootScope.memberNotInGroup = true;

        ////////////////////////////////////////////////////////////



        var beReturn = false;
        Group.handle(groupId, function(group) {
            if (group.isBlocked === 'S' && $rootScope.roleX) {
                $state.go('app.group_in_blocked_status');
                beReturn = true;
            }
        });

        if(beReturn) return;

        ////////////////////////////////////////////////////////////

        var statusType = 1;

        $scope.getFilterData = function (type, e) {
            var evt = e || window.event;
            var target = evt.target || evt.srcElement;
            var marks = $('.group-mark');

            if(target.nodeName != 'A'){
                if(target.nodeName != 'DIV'){
                    target = target.parentNode.parentNode;
                }else{
                    target = target.parentNode;
                }
            }
            evt.stopPropagation();
            evt.preventDefault();
            marks.removeClass('mark-focus');
            $(target).addClass('mark-focus');

            statusType = type;

            if(type == '1'){

                $state.go('app.contacts.list', {id: ids.join('_') + '/' + itemType + '/' + statusType}, {reload: false});
            }else{
                $state.go('app.contacts.list', {id: ids.join('_') + '/' + itemType + '/' + statusType + '/nav'}, {reload: false});
            }

            //return;
            switch (type){
                case 1:
                    $scope.memberNotInGroup = true;
                    break;
                case 2:
                case 3:
                case 4:
                    $scope.memberNotInGroup = false;
                    break;
                default: break;
            }
        };

        ////////////////////////////////////////////////////////////

        function getNumber(url, param, fun) {
            $http({
                url: url,
                method: 'post',
                data: param
            }).then(function (resp) {
                if (resp.data.resultCode === 1 && resp.data.data) {
                    fun(resp.data.data.total)
                }
            }, function (x) {
                console.error(x.statusText);
            });
        }

        ////////////////////////////////////////////////////////////

        var canEdit = true;
        var itemType = utils.localData('itemType') * 1 || 1;
        $scope.showType = itemType || 1;

        $scope.changeType = function () {
            itemType = $scope.showType * 1;
            statusType = 1;
            utils.localData('itemType', itemType);
            $('.group-mark').removeClass('mark-focus').eq(0).addClass('mark-focus');
            switch (itemType){
                case 1:
                    canEdit = false;
                    dataURL = app.url.yiliao.getDepartments;
                    loadTree();

                    setTimeout(function () {
                        getNumber(app.url.yiliao.searchDoctor, {
                            access_token: app.url.access_token,
                            groupId: groupId,
                            deptId: 'Undefined',
                            status: 'C'
                        }, function (n) {
                            if(n != null && n != undefined){
                                $('#doctor_undistributed').html(n);
                            }
                        });
                    }, 200);

                    break;
                case 2:
                    canEdit = false;
                    dataURL = app.url.yiliao.getGroupRegion;
                    loadTree();
                    getNumber(app.url.yiliao.searchDoctor, {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        areaId: 'Undefined',
                        status: 'C'
                    }, function (n) {
                        if(n != null && n != undefined){
                            $('#doctor_undistributed').html(n);
                        }
                    });
                    break;
                case 3:
                    canEdit = false;
                    dataURL = app.url.yiliao.getServiceType;
                    loadTree();
                    getNumber(app.url.yiliao.searchDoctor, {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        packId: 'Undefined',
                        status: 'C'
                    }, function (n) {
                        if(n != null && n != undefined){
                            $('#doctor_undistributed').html(n);
                        }
                    });
                    break;
                case 4:
                    canEdit = true;
                    dataURL = app.url.yiliao.getAllData;
                    loadTree();
                    getNumber(app.url.yiliao.getUndistributed, {
                        access_token: app.url.access_token,
                        groupId: groupId
                    }, function (n) {
                        if(n != null && n != undefined){
                            $('#doctor_undistributed').html(n);
                        }
                    });
                    break;
                default: break;
            }
        };

        ////////////////////////////////////////////////////////////

        var contacts;

        var loadTree = function () {
            // 创建通讯录列表数据
            contacts = new Tree('cnt_list', {
                hasCheck: false,
                allCheck: false,
                multiple: false,
                allHaveArr: false,
                self: true,
                search: false,
                arrType: [1,1,0],
                //extra: true,
                data: {
                    url: dataURL,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId
                    }
                },
                async: false,
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check',
                    root: 'fa fa-hospital-o dcolor',
                    branch: 'fa fa-h-square dcolor',
                    leaf: 'fa fa-h-square dcolor',
                    head: 'headPicFileName'
                },
                root: {
                    selectable: true,
                    name: utils.localData('curGroupName'),
                    id: 0
                },
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'subList'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'parentId',
                    description: 'description',
                    isExtra: 'isExtra'
                },
                extra: [{
                    // + '<b class="badge bg-danger pull-right" id="doctor_undistributed">0</b>
                    name: (itemType == 1 ? '未分配科室' : itemType == 2 ? '未分配区域' : itemType == 3 ? '未开启服务' : '已加入,未分配'),
                    id: 'Undefined',
                    subList: [],
                    icon: 'fa fa-bookmark'
                }],
                /*extra: [{
                 name: '已申请，待审核<b class="badge bg-success pull-right" id="doctor_asked">5</b>',
                 id: 'idx_3',
                 subList: [],
                 icon: 'fa fa-flag'
                 },{
                 name: '已邀请，待医生验证<b class="badge bg-info pull-right" id="doctor_invited">374</b>',
                 id: 'idx_2',
                 subList: [],
                 icon: 'fa fa-clock-o'
                 },{
                 name: '已加入，未分配组织<b class="badge bg-warning pull-right" id="doctor_undistributed">6009</b>',
                 id: 'idx_1',
                 subList: [],
                 icon: 'fa fa-bookmark'
                 },{
                 name: '已解除<b class="badge bg-danger pull-right" id="doctor_quit">36</b>',
                 id: 'idx_0',
                 subList: [],
                 icon: 'fa fa-ban'
                 }],*/
                events: {
                    click: forward,
                    mouseenter: enter,
                    mouseleave: leave
                },
                callback: function () {
                    $scope.toCurPage();
                    //return;
                    //ReInitStatusList();
                }
            });
        };

        //loadTree();
        $scope.changeType();

        $rootScope.toCurPage = function(){
            if ($scope.curDepartmentId) {
                var dts = contacts.getTree().find('dt');
                for (var i = 0; i < dts.length; i++) {
                    if (dts.eq(i).data('info') && dts.eq(i).data('info').id === $scope.curDepartmentId) {
                        if(!$rootScope.isSearching) {
                            dts.eq(i).trigger('click');
                        }
                        break;
                    }
                }
            } else {
                var curDepartment = cnt_list.find('.cnt-list-warp').first();
                if(!$rootScope.isSearching){
                    curDepartment.find('dt').eq(0).trigger('click');
                }
            }
        };

        var iAdd, iEdit, iDelete;

        //重新刷新列表；
        function ReInitStatusList(n) {
            var idx = 5;
            while (idx--) {
                if(n){
                    idx = n;
                }

                if (idx === 2) {

                    var numEle = $('#doctor_invited').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'I'
                    }, numEle);
                } else if (idx === 3) {
                    var numEle = $('#doctor_quit').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'S'
                    }, numEle);
                } else if (idx === 4) {
                    var numEle = $('#doctor_normal').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'C'
                    }, numEle);
                } else if (idx === 0) {

                    var numEle = $('#doctor_asked').html('0');
                    _getData(app.url.yiliao.searchDoctor, {
                        status: 'J'
                    }, numEle);
                }

                if(n){
                    break;
                }
            }
        }
        $rootScope.ReInitStatusList=ReInitStatusList;
        ReInitStatusList();

        // 设置列表数目
        function _getData(url, param, target) {
            var dt = {
                access_token: app.url.access_token,
                groupId: groupId
            };
            $.extend(dt, param);
            $http({
                url: url,
                method: 'post',
                data: dt
            }).then(function (resp) {
                if (resp.data.resultCode === 1 && resp.data.data) {
                    target.html(resp.data.data.total);
                    if(param.status === 'J'){
                        if(resp.data.data.total === 0){
                            $rootScope.hasUncheckedMumber = false;
                        }
                    }
                } else {
                    console.warn("编辑失败！");
                }
            }, function (x) {
                console.error(x.statusText);
            });
        }

        function enter(info) {
            if(info.isExtra || !canEdit) return;
            $scope.curIndex = null;
            var cur_div = contacts.treeWrapper.find('.back-line');

            if(info.id != '0' && itemType == 4) {
                iEdit = $('<i class="pos-edit fa fa-pencil-square-o"></i>');
                iDelete = $('<i class="pos-delete fa fa-trash-o"></i>');
                $(this).append(iEdit).append(iDelete);
            }

            if(info.pid == '0' || info.id == '0'){
                $rootScope.curDepartmentId = info.id || info.id == '0' ? info.id : null;
                utils.localData('curDepartmentId', $scope.curDepartmentId);
                iAdd = $('<i class="pos-add fa fa-plus"></i>');
                $(this).append(iAdd);
                iAdd.click(function (e) {
                    var evt = e || window.event;
                    evt.stopPropagation();
                    $state.go('app.contacts.list.add');
                });
            }

            if(info.id != '0' && itemType == 4){
                iEdit.click(function (e) {
                    var evt = e || window.event;
                    evt.stopPropagation();
                    $rootScope.targetDepartmentParentId = info.pid;
                    $rootScope.targetDepartmentId = info.id;
                    $rootScope.targetDepartmentName = info.name;
                    $rootScope.targetDepartmentDescription = info.description;
                    $state.go('app.contacts.list.edit');
                });

                iDelete.click(function (e) {
                    var evt = e || window.event;
                    evt.stopPropagation();
                    $rootScope.targetDepartmentId = info.id;
                    $rootScope.targetDepartmentName = info.name;
                    //$state.go('app.contacts.list.delete');
                    var htmlStr =
                        '<div class="clearfix">' +
                        '<i class="txt-warn pull-left thumb-md avatar fa fa-warning"></i>'+
                        '<div class="clear">' +
                        '<div class="h4 m-t-xs m-b-xs text-left text-primary">'+ info.name +'</div>'+
                        '<small class="text-muted">若该组织下含有医生，您先将其移走或删除。您确定要移除该组织吗？</small>'+
                        '</div>' +
                        '</div>' +
                        '</div>';

                    // 移除组织
                    modal.confirm('移除组织', htmlStr, function(){
                        $http({
                            url: app.url.yiliao.deleteByDepart,
                            method: 'post',
                            data: {
                                access_token: app.url.access_token,
                                ids: $scope.targetDepartmentId
                            }
                        }).then(function (resp) {
                            if (resp.data.resultCode === 1) {
                                $state.go('app.contacts.list', {}, {reload: true});
                            } else {
                                console.warn("移除失败！");
                                modal.toast.error(resp.data.resultMsg);
                            }
                        }, function (x) {
                            console.error(x.statusText);
                        });
                    });
                });
            }
        }

        function leave(info) {
            if(info.isExtra || !canEdit) return;
            $scope.curIndex = null;
            if(info.pid == '0' || info.id == '0'){
                iAdd.remove();
            }
            if(info.id != '0' && itemType == 4) {
                iEdit.remove();
                iDelete.remove();
            }
        }

        var ids = [];
        function forward(info) {
            //if(info.id == '0') return;
            $scope.curIndex = null;
            //cnt_list.find('.cur-line').removeClass('cur-line');
            //this.addClass('cur-line');

            $rootScope.isSearching = false;

            ids = [];

            if(itemType == 2 && info.id != '0') {
                if (info.id % 10000 > 0) {
                    ids.push((info.id - (info.id * 1 % 10000 + '')) + '');
                }
                if (info.id % 100 > 0) {
                    ids.push((info.id - (info.id * 1 % 100 + '')) + '');
                }
            }

            ids.push(info.id);

            //$rootScope.itemId = info.id || info.id == '0' ? info.id : null;
            $rootScope.itemId = ids;
            utils.localData('itemId', ids);
            //console.log(utils.localData('curDepartmentId'));
            //ReInitStatusList();

            $state.go('app.contacts.list', {id: ids.join('_') + '/' + itemType + '/' + statusType}, {reload: false});

        }

        // 添加组织
        $scope.addUnit = function () {
            //console.log($scope.curDepartmentId);
            $state.go('app.contacts.list.add');
        };

        // 邀请医生
        $scope.invite = function () {
            $state.go('app.contacts.list.invite');
        };

        // 新建医生
        $scope.addDoctor = function () {
            $state.go('app.create_doctor_account');
        };

        // 编辑组织
        $scope.editUnit = function () {
            if ($rootScope.obj['id']) {
                $rootScope.details = $rootScope.obj;
                setStatus(status_false);
                $state.go('app.org.edit');
            }
        };

        var mask = $('<div class="mask"></div>');
        var container = $('#dialog-container');
        var dialog = $('#dialog');
        var doIt = function () {
        };

        // 执行操作
        $rootScope.do = function () {
            doIt();
        };

        // 模态框退出
        $rootScope.cancel = function () {
            mask.remove();
            container.addClass('none');
        };

        // 不操作返回
        $scope.return = function () {
            $rootScope.ids = [];
            setStatus(status);
            window.history.back();
        };

        function setSearchBar() {
            //return;
            var keyIpt = $('#key_ipt');
            /*var table_warp = search_form.appendTo(wrapper.children(".row:nth-child(1)")
             .children(".col-sm-6:nth-child(1)").next());*/


            var timer = 0,
                tmpKey = 'not empty!!!!!!!!!!',
                curLine = $('.cur-line'),
                curBkLine = $('.cur-back-line');

            keyIpt.val($rootScope.keyword);
            keyIpt.focus(function() {
                if ($('.cur-line').length !== 0) {
                    curLine = $('.cur-line');
                    curBkLine = $('.cur-back-line');
                }
                //curLine.removeClass('cur-line');
                //curBkLine.removeClass('cur-back-line');
                timer = setInterval(function() {
                    var val = $.trim(keyIpt.val());
                    $rootScope.keyword = val;
                    if (tmpKey !== val && /\S+/.test(val)) {
                        $rootScope.keyword = tmpKey = val;
                        //$rootScope.isSearching = true;
                        /*                if (curBkLine.length === 0) {
                         curLine = $('.cur-line');
                         curBkLine = $('.cur-back-line');
                         }
                         curLine.removeClass('cur-line');
                         curBkLine.removeClass('cur-back-line');
                         $rootScope.keyword = tmpKey = val;
                         $rootScope.isSearching = true;
                         utils.localData('tmpKey', tmpKey);
                         $rootScope.loaded = false;
                         $state.go('app.contacts.list', {id: tmpKey}, {reload: false});*/
                    } else if (!val && val != '0') {
                        $rootScope.loaded = true;
                        tmpKey = 'not empty!!!!!!!!!!';
                        $rootScope.isSearching = false;
                    }
                }, 100);
            });
            keyIpt.blur(function() {

                //$scope.back();
            });

            if ($rootScope.keyword) {
                keyIpt.trigger('focus');
            }

            $scope.back = function () {
                $rootScope.isSearching = false;
                clearInterval(timer);
                window.history.back();

                /*$state.go('app.contacts.list', {
                 id: $rootScope.curDepartmentId
                 }, {
                 reload: false
                 });*/
            };

            $scope.submit = function() {
                var val = $.trim(keyIpt.val());
                $rootScope.keyword = tmpKey = val;
                if(!tmpKey && tmpKey != '0'){
                    modal.toast.warn('请输入搜索关键字!');
                    return;
                }
                $rootScope.isSearching = true;
                utils.localData('tmpKey', tmpKey);
                $rootScope.loaded = false;
                $state.go('app.contacts.search', {
                    key: tmpKey + '_' + new Date().getTime()
                }, {
                    reload: false
                });
            };
        }

        setSearchBar();
    };

})();

