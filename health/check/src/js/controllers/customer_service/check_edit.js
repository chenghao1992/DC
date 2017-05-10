'use strict';
(function () {
    app.controller('CustomerService', ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', 'modal', '$modal', '$timeout','$log',
        function($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, modal, $modal, $timeout,$log) {
            $scope.isPass = true;
            uiLoad.load(JQ_CONFIG.dateTimePicker).then(function() {
                $(".form_datetime").datetimepicker({
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    pickerPosition: "bottom-left",
                    minView: 2,
                    todayBtn: false,
                    language: 'zh-CN'
                });
            });
            $scope.loaded = true;
            $scope.canLoad = true;
            $scope.authError = null;
            $scope.formData = {};
            $scope.viewData = {};
            // $scope.usrPicUrl = $rootScope.curDoctorPic || utils.localData('curDoctorPic');
            $scope.viewData.isDoctor = false;
            $scope.hospital = {};
            $scope.hospital.selected = {};
            $scope.feldsherSelected={};
            $scope.feldsherSelected.selected={};
            var access_level = 0;
            var target = null;

            var id = '';
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

            ////////////////////////////////////////////////////////////

            function setDefaultHospital(hospital) {
                $scope.hospital.selected.id = hospital.id;
                $scope.hospital.selected.name = hospital.name;
            }

            ////////////////////////////////////////////////////////////
            //变更手机号码
            $scope.changeTels=function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'changeTelCtrl.html',
                    controller: 'changeTelCtrl',
                    size: size,
                    resolve: {
                        items: function () {
                            return {
                                userId: $scope.formData.userId
                            }
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    //$scope.selected = selectedItem;
                }, function () {
                    $log.info('取消');
                });
            }

            //添加擅长病种
            $scope.seleteEntity=function(){
                var tagsModal = new DataBox('data_res', {
                    hasCheck: true,
                    allCheck: true,
                    leafCheck: true,
                    multiple: true,
                    allHaveArr: false,
                    self: false,
                    cover: false,
                    leafDepth: 2,
                    selectView: true,
                    search: {
                        searchDepth: [2],
                        dataKey: {
                            name: 'name',
                            id: 'id',
                            union: 'parentId',
                            dataSet: 'data'
                        },
                        unwind: false
                    },
                    arrType:[0,0],
                    data: {
                        url: app.url.document.getDiseaseTree
                    },
                    titles: {
                        main: '选择标签',
                        searchKey: '搜索标签...',
                        label: '已选择标签数'
                    },
                    icons: {
                        arrow: 'fa fa-caret-right/fa fa-caret-down',
                        check: 'fa fa-check/fa fa-square',
                        root: 'fa fa-hospital-o cfblue',
                        branch: 'fa fa-h-square cfblue',
                        leaf: 'fa fa-stethoscope dcolor',
                        head: 'headPicFileName'
                    },
                    fixdata:$scope.formData.keywords,
                    response: tagsSelected,
                    datakey: {
                        id: 'id',
                        name: 'name',
                        sub: 'children'
                    },
                    info: {
                        name: 'name',
                        id: 'id',
                        leaf: 'leaf'
                    }
                });
            }

            function diseaseSelected(dt){
                console.log(dt);
                $scope.formData.selectedType=dt[0];
                $scope.$apply($scope.formData.selectedType);
            }

            function tagsSelected(dt){
                $scope.formData.keywords=dt;
                $scope.$apply($scope.formData.keywords);
                //$scope.skills=[];
                //for(var i=0;i<$scope.formData.keywords.length;i++){
                //    $scope.skills.push($scope.formData.keywords[i]);
                //}
                //$log.log($scope.skills);
            }

            $scope.removeItem = function(item){
                var index = $scope.formData.keywords.indexOf(item);
                $scope.formData.keywords.splice(index,1);
                console.log($scope.formData.keywords);
            };



            // 搜索医院
            $scope.getHospitalOption = (function getHospitalOption(keyWord) {
                $scope.keyWord = keyWord;
                $http.post(app.url.hospital.findHospitalByCondition, {
                    access_token: app.url.access_token,
                    pageIndex: 0,
                    pageSize: 20,
                    keyWord: keyWord || null
                }).
                then(function(rpn) {
                    rpn = rpn.data;
                    if (rpn.resultCode === 1) {
                        $scope.hospitalOption = rpn.data.pageData;
                    } else if (rpn.resultMsg) {
                        modal.toast.error(rpn.resultMsg);
                    } else {
                        modal.toast.error('接口出错');
                    };
                });

                return getHospitalOption;
            })();

            //获取可选医生助手接口
            (function(){
                $http.post(app.url.account.getAvailableFeldsherList, {
                    access_token:app.url.access_token,
                    userType:2
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.feldsherList=data.data.slice(0,300);
                        //$scope.feldsher.selected = $scope.feldsherList[0];
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            })();


            // 获取要审核的医生数据
            $http({
                url: app.url.admin.check.getDoctor,
                data: {
                    id: id,
                    access_token: app.url.access_token
                },
                method: 'POST'
            }).then(function(resp) {
                if (resp.resultMsg === 1) {
                    modal.toast.error('当前医生正在被其他人审核！');
                }
                var dt = resp.data.data;
                $scope.formData = {
                    userId: dt.userId,
                    departments: dt.departments,
                    hospital: dt.hospital,
                    hospitalId: dt.hospitalId,
                    title: dt.title||'请选择职称',
                    telephone:dt.telephone,
                    sex:dt.sex,
                    introduce:dt.introduction,
                    keywords:dt.expertises,
                    skill:dt.skill,
                    deptId: dt.deptId,
                    licenseNum:dt.licenseNum,
                    licenseExpire:dt.licenseExpire,
                    forceQuitApp: true,
                    role: dt.role || null,
                    doctorImg:dt.qRUrl,
                    status:dt.status
                };
                $scope.hospital.selected.name = dt.hospital;
                $scope.hospital.selected.id = dt.hospitalId;

                $scope.feldsherSelected.selected.name = dt.assistantName;
                $scope.feldsherSelected.selected.userId = dt.assistantId;
                $rootScope.telephone=dt.telephone || ' ',
                    $scope.viewData = {
                        name: dt.name || ' ',
                        telephone: dt.telephone || ' ',
                        isDoctor: dt.userType == '3' ? true : false
                    };

                $scope.usrPicUrl = dt.headPicFileName || 'src/img/a0.jpg';

                if (!$scope.viewData.isDoctor) {
                    $scope.viewTitle = '护士认证审核';
                } else {
                    $scope.viewTitle = '医生认证审核';
                }
                getDoctorTitle();
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
                    $scope.viewSrc = $scope.imgs[0];
                } else {
                    $scope.imgs = false;
                }
                if($scope.imgs.length >= 3){
                    $scope.canLoad = false;
                }
            });

            var key = null,
                data = null,
                search = null,
                val = '',
                areaId = [],
                curClickItem;

            // 创建‘医疗机构、科室’数据列表
            function initList(param) {
                $http({
                    url: param.url,
                    data: param.data,
                    method: param.method
                }).then(function(dt) {
                    var route = $('#list_route'),
                        panel = $('#eara_panel'),
                        search = $('#search_input'),
                        lastUl = null;

                    if (dt.data.resultCode !== 1) {
                        var lnks = route.find('a');
                        var w = 0;
                        for (var i = 0; i < lnks.length; i++) {
                            w += lnks.eq(i).width();
                        }
                        if (w > route.width()) {
                            route.animate({
                                "scrollLeft": w - route.width() + 50
                            }, 300);
                        }
                        return;
                    } else {
                        if (dt.data.data.length === 0 && access_level !== 4) {
                            target.find('i').css('visibility', 'hidden');
                            container.find('button[type=submit]').removeClass('disabled');
                            return;
                        }
                    }

                    data = dt.data.data;

                    function makeList(data) {
                        var len = data.length;
                        var ul = $('<ul class="eara-list"></ul>');

                        if (access_level % 2 === 0) {
                            ul.addClass('bg-even');
                        } else {
                            ul.addClass('bg-odd');
                        }
                        ul.data('level', access_level);
                        //ul.className = 'eara-list';
                        for (var i = 0; i < len; i++) {
                            var li = $('<li></li>');
                            li.data(param.key, data[i][param.key]);
                            li.data('name', data[i]['name']);

                            // 点击展开下一层列表
                            li.click(function() {

                                route.find('.route-link').eq(3).remove();
                                search.val('');
                                $(this).parent().nextAll().remove();
                                access_level = $(this).parent().data('level');
                                if (key) {
                                    key = 'code';
                                }

                                // (Link) 选择到的区域路线
                                var link = $('#link_' + access_level);

                                if (link.length > 0) {
                                    link.nextAll().remove();
                                } else {
                                    link = $('<a class="route-link"></a>');
                                    link.attr('id', 'link_' + access_level);
                                }
                                link.html($(this).data('name'));
                                route.append(link);

                                link.data('offsetTop', panel.scrollTop());
                                link.data('offsetLeft', panel.scrollLeft());
                                link.off().on('click', function() {
                                    var top = $(this).data('offsetTop') * 1;
                                    var left = $(this).data('offsetLeft') * 1;
                                    panel.scrollTop(top).scrollLeft(0);
                                });
                                // (End Link)

                                var data_key = $(this).data(param.key);
                                if (access_level % 2 === 0) {
                                    $(this).siblings().removeClass('item-odd');
                                    $(this).addClass('item-odd');
                                } else {
                                    $(this).siblings().removeClass('item-even');
                                    $(this).addClass('item-even');
                                }

                                // (Path) 设置API
                                if (access_level === 3) {
                                    var url = app.url.admin.check.getHospitals;
                                    key = 'id';
                                } else {
                                    var url = param.url;
                                    key = null;
                                }
                                // (End Path)

                                // 最终的目标标签
                                if ((access_level === 4) ||
                                    (param.key !== 'code' && access_level === 2)) {
                                    container.find('button[type=submit]').removeClass('disabled');
                                } else {
                                    container.find('button[type=submit]').addClass('disabled');
                                }

                                target = $(this); // 保存当前被点击的对象

                                if (data_key) {
                                    initList({
                                        url: url,
                                        data: {
                                            id: data_key,
                                            access_token: app.url.access_token
                                        },
                                        method: 'POST',
                                        key: key || param.key
                                    });
                                }

                                if (access_level === 4) {
                                    curClickItem = $(this);
                                }
                                areaId[access_level - 2] = data_key;
                            });

                            var str = '<a class="auto">' +
                                ((access_level === 4) ||
                                (param.key !== 'code' && access_level === 2) ? '' :
                                '<span class="pull-right text-muted">' +
                                '<i class="fa fa-fw fa-angle-right text"></i>' +
                                '</span>') +
                                '<span>' + data[i]['name'] + '</span>' +
                                '</a>';
                            li.html(str);
                            ul.append(li);
                        }

                        if (access_level === 4) {
                            var li = $('<li class="edit-item"></li>');
                            var edit_btn = $('<button type="submit" class="add-btn">添加医院</button>');
                            var edit_ipt = $('<input type="text"/>');
                            var timer = 0,
                                tempKey = '';
                            li.append(edit_btn);
                            ul.append(li);

                            var addData = function() {
                                $http({
                                    url: app.url.admin.check.addHospital,
                                    method: 'post',
                                    data: {
                                        access_token: app.url.access_token,
                                        provinceId: areaId[0],
                                        cityId: areaId[1],
                                        countryId: areaId[2],
                                        name: edit_ipt.val()
                                    }
                                }).then(function(resp) {
                                    if (resp.data.resultCode === 1) {
                                        curClickItem.trigger('click');
                                    } else {
                                        alert(resp.data.resultMsg);
                                    }
                                });

                                edit_btn.off();
                            };
                            var addCancel = function() {
                                edit_btn.removeClass('ok-btn');
                                edit_btn.one('click', editData);
                                edit_ipt.off();
                                edit_ipt.parent().remove();
                                edit_btn.html('添加医院');

                                edit_btn.off();
                                edit_btn.one('click', editData);
                            };

                            var iptFocus = function() {
                                clearInterval(timer);
                                timer = setInterval(function() {
                                    var _key = $.trim(edit_ipt.val());
                                    if (tempKey !== _key && _key) {
                                        edit_btn.off();
                                        edit_btn.one('click', addData);
                                        edit_btn.html('确 定');
                                        tempKey = _key;
                                    } else if (tempKey !== _key && (!_key && _key != '0')) {
                                        edit_btn.off();
                                        edit_btn.html('取 消');
                                        edit_btn.one('click', addCancel);
                                    }
                                }, 100);
                            };

                            var iptBlur = function() {
                                clearInterval(timer);
                                //edit_btn.off();
                            };

                            var editData = function() {
                                $(this).addClass('ok-btn').html('取 消');
                                li.append($('<div></div>').append(edit_ipt));
                                edit_ipt.bind('focus', iptFocus);
                                edit_ipt.bind('blur', iptBlur);
                                edit_btn.one('click', addCancel);
                                edit_ipt.trigger('focus');
                            };

                            edit_btn.one('click', editData);

                        }
                        panel.append(ul);
                        lastUl = panel.find('.eara-list').last();
                    }

                    makeList(data);
                    var isLast = true;

                    search.off().on('keydown', function() {
                        setTimeout(function() {
                            val = search.val();
                            if (!val.match(/\S+/g)) {
                                lastUl.remove();
                                isLast = true;
                                makeList(data);
                                return;
                            }
                            var len = data.length,
                                keys = val.split(/\s+/),
                                isMatched = false,
                                dts = [];

                            for (var i = 0; i < len; i++) {
                                isMatched = true;
                                for (var j = 0; j < keys.length; j++) {
                                    if (data[i].name.search(keys[j]) === -1) {
                                        isMatched = false;
                                    }
                                }
                                if (isMatched) {
                                    dts.push(data[i]);
                                }
                            }
                            if (dts.length !== 0) {
                                if (isLast) {
                                    panel.find('.eara-list').last().remove();
                                }
                                isLast = true;
                                makeList(dts);
                            } else {
                                if (keys.length !== 0) {
                                    lastUl.remove();
                                    isLast = false;
                                } else {
                                    lastUl.remove();
                                    isLast = true;
                                    makeList(data);
                                }
                            }
                        }, 200);
                    });

                    var uls = panel.find('.eara-list');
                    var links = route.find('a');
                    var w1 = 0,
                        w2 = 0;
                    for (var i = 0; i < uls.length; i++) {
                        w1 += uls.eq(i).width();
                    }
                    for (var i = 0; i < links.length; i++) {
                        w2 += links.eq(i).width();
                    }
                    if (w1 > panel.width()) {
                        panel.animate({
                            "scrollLeft": w1 - panel.width() + 25
                        }, 300);
                    }
                    panel.animate({
                        "scrollTop": 0
                    }, 300);
                    if (w2 > panel.width()) {
                        route.animate({
                            "scrollLeft": w2 - panel.width() + 50
                        }, 300);
                    }
                    panel.animate({
                        "scrollTop": 0
                    }, 300);
                });

                access_level++;
            }

            var chooseBtn = $('#chooseBtn');
            var step, firstTime = true;
            // 提交并更新数据
            $scope.saveData = function() {
                $scope.tagsId =[];
                var str = '';
                if(!$scope.viewData.name || !/\S/g.test($scope.viewData.name)){
                    str += '“用户名”、';
                }
                if(!$scope.hospital.selected.name){
                    str += '“医疗机构”、';
                }
                if(!$scope.formData.departments){
                    str += '“科室”、';
                }
                if(!$scope.formData.title){
                    str += '“职称”、';
                }
                if(!$scope.formData.role){
                    str += '“角色标签” ';
                }

                if(str){
                    modal.toast.warn(str.replace(/、$/, '') + '不能为空，请完善相关项！');
                    return;
                }

                modal.confirm(null,'请确认是否保存医生信息？',function(){
                    if (!$scope.feldsherSelected.selected) {
                        modal.toast.warn('请选择医生助手！');
                        return;
                    }

                    if($scope.formData.keywords!=null&&$scope.formData.keywords.length>0){
                        $scope.formData.keywords.forEach(function(item,index,array){
                            $scope.tagsId.push(item.id);
                        });
                    }

                    var formParam = {};
                    $scope.formData.access_token = app.url.access_token;

                    // 选择url，并组装提交参数
                    var url = app.url.admin.check.edit;
                    if($scope.uploading ==true){ //当编辑了头像后保存进行上传，反之不上传
                        $scope.usrPicUrl =$scope.usrPicUrl;
                    }else{
                        $scope.usrPicUrl="";
                    }
                    formParam = {
                        headPicFileName: $scope.usrPicUrl,
                        userId: $scope.formData.userId,
                        name: $scope.viewData.name,
                        title: $scope.formData.title,
                        sex:$scope.formData.sex,
                        introduction:$scope.formData.introduce,
                        expertises: $scope.tagsId,
                        skill:$scope.formData.skill,
                        hospitalId: $scope.hospital.selected.id,
                        hospital: $scope.hospital.selected.name,
                        deptId: $scope.formData.deptId,
                        departments: $scope.formData.departments,
                        licenseExpire: $scope.formData.licenseExpire,
                        licenseNum: $scope.formData.licenseNum,
                        role: $scope.formData.role,
                        forceQuitApp: $scope.formData.forceQuitApp ? 1 : '',
                        access_token: app.url.access_token,
                        assistantId:$scope.feldsherSelected.selected.userId
                    };

                    if ((!formParam.hospitalId && formParam.hospitalId != '0') || formParam.hospitalId == ' ') {
                        modal.toast.warn('医院还未添加，请联系医生确认医院信息！');
                        return;
                    }

                    //saveLicPics($scope.imgs, function(flg){
                    //    if(flg){
                    //        //modal.toast.success('上传成功！');
                    //    }else{
                    //        //modal.toast.error('上传失败！');
                    //    }
                    //});

                    $http.post(url, formParam).then(function(resp) {

                        if (resp.data.resultCode == 1) {
                            window.history.back();
                        } else if(resp.data.resultCode == 0){
                            modal.toast.warn(resp.data.resultMsg);

                        }else {
                            $scope.authError = resp.data.resultMsg;
                        }
                    }, function(x) {
                        $scope.authError = '服务器错误！';
                    });

                    saveLicPics($scope.imgs, function(flg){
                        if(flg){
                            setLickHandle();
                        }
                    });
                });
            };

            var mask = $('<div class="mask"></div>'),
                container = $('#dialog-container'),
                doIt = function() {};

            // 执行操作
            $rootScope.do = function() {
                doIt();
            };

            // 不操作返回
            $scope.return = function() {
                $rootScope.ids = [];
                window.history.back();
            };

            // (Search) 医疗机构搜索
            var hospital = $('#hospital_ipt');
            var departments = $('#departments_ipt');
            hospital.on('focus', function() {
                searchByKey($(this), 'focus', 'hospital', app.url.admin.check.getHospitals);
            }).on('blur', function() {
                searchByKey($(this), 'blur');
            });
            departments.on('focus', function() {
                searchByKey($(this), 'focus', 'depts', app.url.admin.check.getDepts);
            }).on('blur', function() {
                searchByKey($(this), 'blur');
            });

            var doReturn = false,
                curIpt = null,
                isBlured = false;
            $('body').on('mousedown', function(e) {
                var evt = e || window.event;
                var target = evt.target || evt.srcElement;
                if (target.nodeName.toLowerCase() === 'ul' && $(target).hasClass('data-list')) {
                    doReturn = true;
                } else {
                    if (curIpt && target !== curIpt[0]) {
                        doReturn = false;
                        isBlured = true;
                        curIpt.trigger('blur');
                    } else {
                        isBlured = false;
                    }
                }
            });

            function searchByKey(ipt, satus, type, url) {
                var isFocused = false,
                    val = '';

                curIpt = ipt;
                switch (satus) {
                    case 'focus':
                        var dataList = $('<ul class="data-list none"></ul>');

                        ipt.parent().append(dataList);
                        isFocused = true;
                        var len = 0,
                            idx = 0,
                            lis = null,
                            ulHg = 0,
                            liHg = 0,
                            top = 0;

                        $(document).off('keydown').on('keydown', function(e) {
                            var evt = e || window.event;
                            var keyCode = evt.keyCode;
                            var scTop = dataList.scrollTop();

                            if (isFocused) {
                                switch (keyCode) {
                                    case 38: // 向上选择
                                        if (len === 0) return;
                                        if (idx >= 1) {
                                            idx--;
                                        } else {
                                            idx = len - 1;
                                            dataList.scrollTop((len - 1) * liHg);
                                        }
                                        lis.eq(idx).addClass('cur-li').siblings().removeClass('cur-li');
                                        if (liHg * (idx) < scTop) {
                                            top = liHg * (idx);
                                            dataList.scrollTop(top);
                                        }

                                        ipt.val(val = lis.eq(idx).html());
                                        if (type === 'hospital') {
                                            $scope.formData.hospitalId = lis.eq(idx).data('id');
                                            $scope.formData.hospital = lis.eq(idx).html();
                                        } else {
                                            $scope.formData.deptId = lis.eq(idx).data('id');
                                            $scope.formData.departments = lis.eq(idx).html();
                                        }
                                        break;
                                    case 40: // 向下选择
                                        if (len === 0) return;
                                        if (idx < len - 1) {
                                            idx++;
                                        } else {
                                            idx = 0;
                                            dataList.scrollTop(0);
                                        }
                                        lis.eq(idx).addClass('cur-li').siblings().removeClass('cur-li');
                                        if (liHg * (idx + 1) > ulHg + scTop) {
                                            top = liHg * (idx + 1) - ulHg;
                                            dataList.scrollTop(top);
                                        }

                                        ipt.val(val = lis.eq(idx).html());
                                        if (type === 'hospital') {
                                            $scope.formData.hospitalId = lis.eq(idx).data('id');
                                            $scope.formData.hospital = lis.eq(idx).html();
                                        } else {
                                            $scope.formData.deptId = lis.eq(idx).data('id');
                                            $scope.formData.departments = lis.eq(idx).html();
                                        }
                                        break;
                                    case 13: // 回车确认
                                        if (len === 0) return;

                                        ipt.val(val = lis.eq(idx).html());
                                        if (type === 'hospital') {
                                            $scope.formData.hospitalId = lis.eq(idx).data('id');
                                            $scope.formData.hospital = lis.eq(idx).html();
                                        } else {
                                            $scope.formData.deptId = lis.eq(idx).data('id');
                                            $scope.formData.departments = lis.eq(idx).html();
                                        }

                                        setTimeout(function() {
                                            ipt.trigger('blur');
                                            dataList.remove();
                                        }, 200);
                                        break;
                                    default: // 其他按键，正常输入
                                        dataList.scrollTop(0);
                                        idx = 0;
                                        setTimeout(function() {
                                            var v = $.trim(ipt.val());
                                            if (val !== v && /\S+/.test(v)) {
                                                val = v;

                                                $http({
                                                    url: url,
                                                    data: {
                                                        name: val,
                                                        access_token: app.url.access_token
                                                    },
                                                    method: 'POST'
                                                }).then(function(resp) {
                                                    var dt = resp.data.data,
                                                        liStr = '';
                                                    len = dt.length;
                                                    if (len > 0) {
                                                        for (var i = 0; i < len; i++) {
                                                            liStr += '<li data-id="' + dt[i].id + '">' + dt[i].name + '</li>';
                                                        }
                                                        ulHg = dataList.removeClass('none').html(liStr).height();
                                                        lis = dataList.find('li');

                                                        // 点击选择
                                                        lis.on('click', function() {
                                                            if (type === 'hospital') {
                                                                $scope.formData.hospitalId = $(this).data('id');
                                                                $scope.formData.hospital = $(this).html();
                                                            } else {
                                                                $scope.formData.deptId = lis.eq(idx).data('id');
                                                                $scope.formData.departments = $(this).html();
                                                            }

                                                            ipt.val(val = $(this).html());

                                                            setTimeout(function() {
                                                                ipt.trigger('blur');
                                                                dataList.remove();
                                                            }, 200);
                                                        });
                                                        liHg = lis.eq(idx).addClass('cur-li').height();
                                                    } else {
                                                        setTimeout(function() {
                                                            dataList.html('');
                                                            dataList.addClass('none');
                                                        }, 200);
                                                    }
                                                });
                                            } else if (!/\S+/.test(v)) {
                                                val = v;
                                                dataList.html('');
                                                dataList.addClass('none');
                                            }
                                        }, 500);
                                        break;
                                }
                            } else {
                                dataList.remove();
                            }
                        });
                        break;
                    case 'blur':
                        if (!doReturn) {
                            setTimeout(function() {
                                isFocused = false;
                                ipt.siblings().remove();
                                if (!isBlured) {
                                    $(document).off('keydown');
                                }
                                val = '';
                            }, 200);
                        }
                        break;
                    default:
                        break;
                }
            }

            // (End Search)

            $scope.choose = function(idx, txt) {
                var header = $('<div class="list-header"></div>'),
                    route = $('<div id="list_route"></div>'),
                    search = $('<div class="data-search"><div><input id="search_input" type="text"/><i class="fa icon-magnifier"></i></div></div>'),
                    panel = $('<div id="eara_panel"></div>'),
                    dialog = $('#dialog');

                dialog.attr('class', 'col-lg-offset-4 col-lg-4 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 m-dialog animating fade-in-down');
                header.append(route);
                header.append(search);
                access_level = 0;
                container.find('button[type=submit]').addClass('disabled');
                mask.insertBefore(container);
                container.find('.form-content').addClass('def-border').html('').append(header).append(panel);

                // (Url) 根据不同的API做不同的操作
                if (txt === 'hospital') {
                    var url = app.url.admin.check.getArea;
                    var _key = 'code';
                    $rootScope.pop_title = '选择医疗机构';
                } else {
                    var url = app.url.admin.check.getDepts;
                    var _key = 'id';
                    $rootScope.pop_title = '选择科室';
                }
                var param = {
                    url: url,
                    data: {
                        access_token: app.url.access_token
                    },
                    method: 'POST',
                    key: _key
                };
                initList(param);
                // (End Url)

                container.removeClass('none');

                doIt = function() {
                    if (access_level === 5) {
                        $scope.formData.hospitalId = target.data('id');
                        $scope.formData.hospital = target.data('name');
                    } else if (access_level === 3 || access_level === 2) {
                        $scope.formData.deptId = target.data('id');
                        $scope.formData.departments = target.data('name');
                    }
                    access_level = 0;
                    mask.remove();
                    container.addClass('none');
                };
            };

            // 模态框退出
            $rootScope.cancel = function() {
                mask.remove();
                container.addClass('none');
            };

            // 强制退出APP
            $rootScope.forceQuit = function() {
                $scope.formData.forceQuitApp = !$scope.formData.forceQuitApp;
            };

            $scope.preview = function(){
                var imgArr = [], len = $scope.imgs.length;
                for(var i=0; i<len; i++){
                    imgArr.push({url: $scope.imgs[i]});
                }
                $scope.pics = {
                    path: imgArr,
                    curIdx: curIdx,
                    curClass: 'cur'
                };
                $scope.show($scope.pics);
            };

            $scope.removePic = function(dt){
                var evt = dt.e || window.event;
                evt.stopPropagation();
                modal.confirm(null, '确定要删除吗？', function () {
                    $scope.updatePics(dt.src);
                });
            };

            $scope.updatePics = function (url){
                var idx = $scope.imgs.indexOf(url);
                if(idx !== -1){
                    $scope.imgs.splice(idx, 1);
                    if($scope.imgs.length < 3){
                        $scope.canLoad = true;
                    }

                    if($scope.imgs.length === 0){
                        $scope.imgs = false;
                    }else{
                        $scope.viewSrc = $scope.imgs[0];
                        $scope.$apply();
                    }

                    return;     // 删除图片操作,并不立即更新到用户信息

                    saveLicPics($scope.imgs, function(flg){
                        if(flg){
                            setLickHandle();
                            modal.toast.success('删除成功！');
                        }else{
                            modal.toast.error('删除失败！');
                        }
                    });
                }
            };

            function saveLicPics(urls, fun){
                if(!urls || urls.length === 0) urls = '';
                $http.post(app.url.user.addDoctorCheckImage, {
                    access_token: app.url.access_token,
                    userId: $scope.formData.userId,
                    doctorsImage: urls
                }).then(function(resp) {
                    var dt = resp.data;
                    if (dt.resultCode === 1) {
                        fun(true);
                    } else {
                        fun(false);
                    }
                }, function(x) {
                    $scope.authError = '服务器错误！';
                });
            }

            function getDoctorTitle() {
                $http.post(app.url.admin.check.getTitles, {
                    access_token: app.url.access_token
                }).then(function(resp) {
                    var dt = resp.data.data;
                    if (dt.length > 0) {
                        initChosen(dt);
                    } else {
                        $scope.authError = '数据有误！';
                    }
                }, function(x) {
                    $scope.authError = '服务器错误！';
                });
            }


            // 设置角色下拉框值
            /*var select_role = $('#doctor_role');
             select_role.on('change', function(e) {
             $scope.formData['role'] = $(this).val();
             });*/

            // 下拉框 chosen
            function initChosen(dt) {
                var select = $('#doctor_title');
                var len = dt.length;
                var tmp = $('<select></select>');
                var isExist = false;
                for (var i = 0; i < len; i++) {
                    var opt = $('<option>' + dt[i]['name'] + '</option>');
                    if ($scope.formData.title === dt[i]['name']) {
                        isExist = true;
                    }
                    tmp.append(opt);
                }
                if (!isExist) {
                    opt = $('<option>' + $scope.formData.title + '</option>');
                    tmp.prepend(opt);
                }
                if(!$scope.formData.title){
                    $scope.formData.title = null;
                }
                select.html(tmp.html());
                select.on('change', function(e) {
                    $scope.formData['title'] = $(this).val();
                });
                select.val($scope.formData.title);
                //$scope.formData['title'] = select.val();
            }

            /*$scope.$watch($scope.imgs, function(newVal, oldVal, scope){
             setLickHandle();
             });*/

            var curIdx = 0;
            var setLickHandle = function(){
                var preview = $('#gl_preview img');
                var points = $('#gl_point a');
                points.find('img').removeClass('cur-img');
                preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
                points.off().click(function() {
                    var _img = $(this).find('img');
                    preview.attr('src', _img.attr('src'));
                    $scope.viewSrc = _img.attr('src');
                    _img.addClass('cur-img');
                    $(this).siblings().find('img').removeClass('cur-img');
                    curIdx = $scope.imgs.indexOf(_img.attr('src'));
                });
            };

            $timeout(function() {
                setLickHandle();
            }, 500);


            ////////////////////////////////////////////////////////////

            var curFile, progress, imgURL;
            $scope.uploading =false;//点击保存信息后头像不上传
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
                $scope.loaded = false;
            };

            // 文件上传进度
            $scope.progress = function (up, file) {
                $scope[progress] = file.percent;
            };

            // 每个文件上传成功回调
            $scope.uploaderSuccess = function (up, file, info) {
                $scope.loaded = true;
                if (file.url) {
                    if(imgURL.search('licPic') !== -1){     // 证件照
                        if(!$scope.imgs) {
                            $scope.imgs = [];
                        }
                        $scope.imgs.unshift(file.url);
                        if($scope.imgs.length >= 3){
                            $scope.canLoad = false;
                        }
                        $scope.viewSrc = $scope.imgs[0];
                        $scope.$apply();
                        setLickHandle();
                        //saveLicPics($scope.imgs, function(flg){
                        //    if(flg){
                        //        modal.toast.success('上传成功！');
                        //    }else{
                        //        modal.toast.error('上传失败！');
                        //    }
                        //});
                    }else{      // 用户头像
                        $scope[imgURL] = file.url;
                        $scope.uploading =true;//点击保存信息后头像上传
                        $scope.$apply();
                        modal.toast.success('上传成功！');
                    }
                }
            };

            // 每个文件上传失败后回调
            $scope.uploaderError = function (up, err, errTip) {
                modal.toast.error('error', null, errTip);
            };

            ////////////////////////////////////////////////////////////

            $scope.createHospital = function (callback) {
                var modalInstance = $modal.open({
                    template:
                        '<div class="clearfix">\
                            <h4 class="col-xs-12 m-t-lg text-center">添加医院</h4>\
                            <div class="col-xs-12 m-t m-b">\
                                <div class="form-group clearfix m-b-xs">\
                                    <label class="col-xs-3 control-label m-b-none text-right">医院所在省份：</label>\
                                    <div class="col-xs-9">\
                                        <select class="form-control m-b-none" ng-model="_provincesCode" ng-change="getArea(_provincesCode,\'citys\');_cityCode=\'\';_regionCode=\'\'">\
                                            <option value="">请选择</option>\
                                            <option value="{{pro.code}}" ng-repeat="pro in provinces">{{pro.name}}</option>\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group clearfix m-b-xs">\
                                    <label class="col-xs-3 control-label m-b-none text-right">医院所在城市：</label>\
                                    <div class="col-xs-9">\
                                        <select class="form-control m-b-none" ng-model="_cityCode" ng-change="getArea(_cityCode,\'regions\');_regionCode=\'\'" ng-disabled="!_provincesCode">\
                                          <option value="">{{_provincesCode?\'请选择\':\'请先选择省份\'}}</option>\
                                          <option value="{{city.code}}" ng-repeat="city in citys">{{city.name}}</option>\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group clearfix m-b-xs">\
                                    <label class="col-xs-3 control-label m-b-none text-right">医院所在区域：</label>\
                                    <div class="col-xs-9">\
                                        <select class="form-control m-b-none" ng-model="_regionCode" ng-disabled="!_cityCode">\
                                          <option value="">{{_cityCode?\'请选择\':\'请先选择城市\'}}</option>\
                                          <option value="{{region.code}}" ng-repeat="region in regions">{{region.name}}</option>\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group clearfix">\
                                    <label class="col-xs-3 control-label m-b-none text-right">医院名称：</label>\
                                    <div class="col-xs-9">\
                                        <input type="text" class="form-control" placeholder="请输入医院名称" ng-model="_hospitalName">\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group clearfix">\
                                    <label class="col-xs-3 control-label m-b-none text-right">医院等级：</label>\
                                    <div class="col-xs-9">\
                                        <select class="form-control" ng-model="_hospitalLevel">\
                                            <option value="">请先选医院等级</option>\
                                            <option ng-repeat="lv in levels" value="{{lv.level}}">{{lv.level}}</option>\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class="line line-dashed b-b line-lg pull-in"></div>\
                                <div class="form-group">\
                                    <div class="col-xs-offset-3 col-xs-3">\
                                        <button type="submit" class="w100 btn btn-primary" ng-click="addHospital(_provincesCode, _cityCode, _regionCode, _hospitalName, _hospitalLevel)" ng-disabled="!_provincesCode||!_cityCode||!_regionCode||!_hospitalName||!_hospitalLevel">\
                                            添加\
                                        </button>\
                                    </div>\
                                    <div class="col-xs-3">\
                                        <button type="button" class="w100 btn btn-default" ng-click="cancel()">返回</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
                    controller: 'AddHospitalCtrl',
                    size: 'md'
                });

                modalInstance.result.then(function (hospital) {
                    if (setDefaultHospital) setDefaultHospital(hospital);
                });
            };
        }
    ]);

    app.controller('AddHospitalCtrl', ['$http', '$modalInstance', '$scope', 'toaster',function($http, $modalInstance, $scope, toaster) {

        // 获取医院级别
        $http.post(app.url.hospital.getHospitalLevel, {
            access_token: app.url.access_token
        }).then(function(rpn) {
            rpn = rpn.data;
            if (rpn.resultCode === 1) {
                if (rpn.data) {
                    $scope.levels = rpn.data;
                }
            } else if (rpn.resultMsg) {
                toaster.pop('error', null, rpn.resultMsg);
            } else {
                toaster.pop('error', null, '接口出错');
            };
        });

        $scope.levels = [{id:'',level:''}];

        // 添加医院
        $scope.addHospital = function(provinceId, cityId, countryId, name, level) {
            $http.post(app.url.admin.check.addHospital, {
                access_token: app.url.access_token,
                provinceId: provinceId,
                cityId: cityId,
                countryId: countryId,
                name: name,
                level: level
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {
                    toaster.pop('success', null, '添加成功');
                    $modalInstance.close(rpn.data);

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });
        };

        // 获取省,市,区
        $scope.getArea = (function getArea(area_id, area_scope) {

            $http.post(app.url.admin.check.getArea, {
                access_token: app.url.access_token,
                id: area_id
            }).
            then(function(rpn) {
                rpn = rpn.data;
                if (rpn.resultCode === 1) {

                    // 初始化市,区
                    if (!area_scope && !area_id) {
                        $scope.provinces = rpn.data;
                        $scope.citys = null;
                        $scope.regions = null;
                    } else {
                        $scope[area_scope] = rpn.data;
                    }

                } else if (rpn.resultMsg) {
                    toaster.pop('error', null, rpn.resultMsg);
                } else {
                    toaster.pop('error', null, '接口出错');
                };
            });

            return getArea;
        })();

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
    app.controller('changeTelCtrl', ['$scope', '$modalInstance','items','$log','$rootScope','$http','toaster','$modal','modal',function($scope, $modalInstance,items,$log,$rootScope,$http,toaster,$modal,modal) {
        $scope.teleTip ="修改登录手机号后，旧的登录手机号将不可使用";
        $rootScope.changeOK=function(){
            if($scope.modalTelePhone==""|| $scope.modalTelePhone==undefined){
                $scope.teleTip ="请输入手机号码！";
                return false;
            }else{
                if(!(/^\d{11}$/.test($scope.modalTelePhone))){
                    $scope.teleTip ="请输入11位数字！";
                    return false;
                }else{
                    //$modalInstance.dismiss('cancel');^1[3|4|5|7|8]\d{9}$
                    modal.confirm(null,'确定将登录手机号修改为：'+$scope.modalTelePhone+'？',function(){
                        $scope.teleTip ="修改登录手机号后，旧的登陆手机号将不可使用";
                        //修改手机号码
                        $http({
                            url: app.url.user.changeTel,
                            data: {
                                access_token: app.url.access_token,
                                userId:items.userId,
                                telephone: $scope.modalTelePhone
                            },
                            method: 'POST'
                        }).then(function(resp) {
                            if(resp.data.resultCode==1){
                                $modalInstance.dismiss('cancel');
                                toaster.pop('success', null, '登录手机号已修改成功！');
                                $rootScope.telephone = $scope.modalTelePhone;//动态改变tel值
                            }else{
                                toaster.pop('error', null, resp.data.resultMsg);
                            }
                        });
                    },function(){
                        //$rootScope.modalTelePhone=$scope.modalTelePhone;
                    })
                }
            }
        }
        $scope.changeNo=function(){
            $modalInstance.dismiss('cancel');
        }
    }]);
})();
