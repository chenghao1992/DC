// 'use strict';
(function () {
    app.controller('GroupCheckEditview', ['$scope', '$http', '$state', '$rootScope', 'utils', '$stateParams', 'modal','$modal','toaster', function($scope, $http, $state, $rootScope, utils, $stateParams, modal,$modal,toaster) {

        var groupId, applyId, showMember = false,
            keyword = '',
            type = 'un_check';
        $scope.isPass = true;
        $scope.authError = null;
        $scope.formData = {};
        $scope.viewData = {};

        $scope.btnName = '屏 蔽';
        $scope.btnNameActive = '设为已激活';
        console.log($stateParams.id);
        if ($stateParams.id) {
            var curId = $stateParams.id.split('/')[0] || utils.localData('curId');
            applyId = curId;//集团申请记录ID
            groupId=$stateParams.groupId;//集团ID
            if ($stateParams.id.split('/')[1] === 'member') {
                showMember = true;
            }
        }

        $scope.isChecking = $scope.isChecking || utils.localData('isChecking') === 'true';
        $scope.isPassed = $scope.isPassed || utils.localData('isPassed') === 'true';

        $scope.tabs = {};

        if (showMember) {
            $scope.tabs.active = [false, true];
        } else {
            $scope.tabs.active = [true, false];
        }



        // 获取审核集团信息,用来展示的信息
        var getGroupInfo = function() {
            if (curId) {
                $http({
                    url: app.url.admin.check.applyDetail,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        //集团申请记录id
                        groupApplyId: applyId
                    }
                }).then(function(resp) {
                    console.log("applyId:"+applyId);
                    console.log("curId:"+curId);
                    if (resp.data.resultCode === 1) {
                        var dt = resp.data.data;
                        groupId = dt.groupId;
                        $scope.formData.groupID=dt.groupId;
                        $scope.isActive = dt.groupActive === 'active' ? true : false;

                        $scope.hasIdentified = true;
                        // 公司信息
                        $scope.viewData.groupName = dt.groupName;
                        $scope.viewData.groupId=dt.groupId;
                        $scope.viewData.introduction = dt.introduction || '';
                        $scope.viewData.logoUrl = dt.logoUrl || 'src/img/logoDefault.jpg';
                        $scope.viewData.doctorName = dt.doctorName;
                        $scope.viewData.telephone = dt.telephone;
                        $scope.viewData.hospitalName = dt.hospitalName;
                        $scope.viewData.level = dt.level;
                        $scope.viewData.departments = dt.departments;
                        $scope.viewData.title = dt.title;
                        $scope.viewData.licenseNum = dt.licenseNum;
                        $scope.viewData.licenseExpire = dt.licenseExpire;
                        $scope.viewData.auditMsg = dt.auditMsg;
                        $scope.viewData.adminName = dt.adminName;
                        $scope.viewData.memberNum = dt.memberNum;
                        $scope.viewData.groupImgText = dt.qRUrl; //集团二维码
                        $scope.viewData.activeStatus = dt.groupActive === 'inactive' ? '未激活' : '已激活';
                        // $scope.viewData.auditDate=new Date(dt.auditDate).toLocaleString();
                        $scope.isBlocked = dt.skip === 'S' ? true : false;
                        $scope.doctorId=dt.doctorId;
                        //时间格式化
                        $scope.viewData.auditDate=new Date(dt.auditDate);
                        $scope.viewData.auditDate=$scope.viewData.auditDate.format("yyyy-MM-dd hh:mm:ss");

                        if ($scope.isBlocked) {
                            $scope.btnName = '取消屏蔽';
                        }
                        if (dt.imageUrls && dt.imageUrls.length > 0) {
                            $scope.imgs = [];
                            for (var i = 0; i < dt.imageUrls.length; i++) {
                                $scope.imgs.push(dt.imageUrls[i]);
                            }
                        } else {
                            $scope.imgs = false;
                        }
                    } else {
                        $scope.authError = resp.data.resultMsg;
                    }
                }, function(resp) {
                    $scope.authError = resp.data.resultMsg;
                });
            }
        };
        // 格式化时间
        Date.prototype.format = function(fmt) {
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }

        $scope.myBlocked=$scope.isBlocked?'已屏蔽' : '未屏蔽';
        //跳转到医生详情
        $scope.toDoctorDetail=function () {
            var params={
                type:'pass'
                // page:1
            };
            $rootScope.details = {};
            //设置全局变量来传递参数
            $rootScope.details.id=$scope.doctorId;
            // $rootScope.details.name='ch';
            console.log(params)
            $state.go('app.check_pass_view',params);
        }


        //获取擅长病种
        function getGroupDisease() {
            $http.post(app.url.admin.check.getDiseaseLabel, {
                access_token: app.url.access_token,
                docGroupId: groupId
                // access_token: localStorage.getItem('access_token'),
                // docGroupId: localStorage.getItem('curGroupId')
            }).success(function(data) {
                console.log('groupId:'+groupId);
                if (data.data.length >= 0) {
                    $scope.loading = false;
                    data.data.map(function(e) {
                        e.id = e.diseasesId;
                        e.name = e.diseasesName;
                        delete e.diseasesId;
                        delete e.diseasesName;
                        return e;
                    });
                    // $scope.dataDom = data.data.length==0?[{name:1}]:data.data;
                    $scope.dataDom = data.data;
                    console.log($scope.dataDom instanceof Array)
                    console.log($scope.dataDom)
                } else {
                    $scope.loading = false;
                }
                // setEditor();
            }).error(function(data) {
                console.error(data);
            });
        }
        //获取初始显示信息
        getGroupDisease()
        getGroupInfo();
        //增加变更负责人
        $scope.transferTo = function() {

                modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'peopleTransfer.html',
                    controller: 'peopleTransfer',
                    size: 'md',
                    resolve: {
                        item: function() {
                            return {
                                groupId:$scope.viewData.groupId,
                                groupName:$scope.viewData.groupName
                            }
                        }
                    }
                });
                modalInstance.result.then(function (myParams) {
                    if(!myParams) return
                    $state.reload();
                    // console.log(myParams.selectedDoctorName)
                    // if(myParams.selectedDoctorName){
                    //     $scope.viewData.doctorName=myParams.selectedDoctorName;
                    // }
                })


        };


        //增加集团信息编辑
        $scope.groupEdit=function () {
            var modalInstance = $modal.open({
                templateUrl: 'groupEdit.html',
                controller: 'groupEditCtrl',
                size:'lg',
                backdrop:false,
                resolve: {
                    items:function(){
                        return{
                            groupId: $scope.viewData.groupId,
                            applyId: applyId
                        }
                    }
                }
            });

            modalInstance.result.then(function (status) {
                if (status == 'ok'){
                    //点击保存后重新刷新页面
                    getGroupDisease();
                    // getGroupInfo();
                    $http.post(app.url.group.getGroupById,
                        {
                            access_token:app.url.access_token,
                            id:$scope.viewData.groupId
                        }
                    ).success(function (resp) {
                        console.log("hello")
                        if(resp.resultCode==1){
                            console.log(resp.data);
                            var dt = resp.data;
                            $scope.viewData.groupName = dt.name;
                            $scope.viewData.introduction = dt.introduction || '';
                            $scope.viewData.logoUrl = dt.logoUrl || 'src/img/logoDefault.jpg';

                        }
                    })
                }
                
            })
        }


        console.log("$scope.doctorId:"+$scope.doctorId);
        //增加操作记录
        $scope.operatingRecord=function(){
            var modalInstance = $modal.open({
                templateUrl: 'operatingRecord.html',
                controller: 'operatingRecordCtrl',
                size:'lg',
                resolve: {
                    items:function(){
                        return{
                            groupId: $scope.viewData.groupId
                        }
                    }
                }
            });
        }

        function replacePos(strObj, pos, replacetext) {
            var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length);
            return str;
        }


        setTimeout(function() {
            var preview = $('#gl_preview img');
            var points = $('#gl_point a');
            preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
            points.click(function() {
                var _img = $(this).find('img');
                preview.attr('src', _img.attr('src'));
                _img.addClass('cur-img');
                $(this).siblings().find('img').removeClass('cur-img');
            });
        }, 500);

        // 提交并更新数据
        $scope.submit = function() {
            var modalInstance = $modal.open({
                templateUrl: 'delModalContent.html',
                controller: 'delModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function (status) {
                if (status == 'ok') {
                    var chk_pass = $('#pass'),
                        formParam = {},
                        remark = $('.check-items input:checked').siblings('span'),
                        isPass = true;

                    if (remark.length > 0) {
                        $scope.formData.remark = remark.html();
                    } else {
                        $scope.formData.remark = $scope.viewData.remarkNopass;
                    }
                    $scope.formData.access_token = app.url.access_token;

                    // 选择url，并组装提交参数
                    formParam = {
                        access_token: app.url.access_token,
                        id: curId
                    };

                    var url = app.url.admin.check.processGroupApply;

                    if (chk_pass.prop('checked')) {
                        formParam.status = 'P';
                        isPass = true;
                    } else {
                        formParam.auditMsg = $scope.formData.remark;
                        formParam.status = 'NP';
                        isPass = false;
                    }

                    $http.post(url, formParam).then(function(resp) {
                        if (resp.data.resultCode === 1) {
                            window.history.back();
                        } else {
                            $scope.authError = resp.data.resultMsg;
                        }
                    }, function(x) {
                        $scope.authError = '服务器错误！';
                    });
                }
            });
        }


        // 不操作返回
        $scope.return = function() {
            $rootScope.ids = [];
            //$state.go('app.company_check_list_undone');
            window.history.back();
        };

        setTimeout(function() {
            var chk_pass = $('#pass');
            var chk_nopass = $('#nopass');
            var is = $('.required-items i');
            var ipts = $('.required-items input');
            var btn = $('form button[type=submit]');
            var other = $('#other_remark');
            var txtr = $('#remarkNopass');
            var timer_a, timer_b;

            chk_nopass.change(function() {
                if (chk_nopass.prop('checked')) {
                    is.addClass('none');
                    ipts.removeAttr('required');
                    if (!other.prop('checked')) {
                        btn.removeAttr('disabled');
                    }
                    if (!timer_a) {
                        timer_a = setInterval(function() {
                            if (other.prop('checked')) {
                                if (/\S/g.test(txtr.val())) {
                                    btn.removeAttr('disabled');
                                } else {
                                    btn.attr('disabled', true);
                                    clearInterval(timer_b);
                                    if (!timer_b) {
                                        timer_b = setInterval(function() {
                                            if (/\S/g.test(txtr.val())) {
                                                btn.removeAttr('disabled');
                                            } else {
                                                btn.attr('disabled', true);
                                            }
                                        }, 200);
                                    }
                                }
                            } else {
                                clearInterval(timer_b);
                                timer_b = null;
                                btn.removeAttr('disabled');
                            }
                        }, 200);
                    }
                } else {
                    clearInterval(timer_a);
                    timer_a = null;
                }
            });
            chk_pass.change(function() {
                clearInterval(timer_a);
                clearInterval(timer_b);
                timer_a = timer_b = null;
                if (chk_pass.prop('checked')) {
                    btn.removeAttr('disabled');
                    is.removeClass('none');
                }
            });
        }, 500);

        //////////////////////////////////////////////////////////////////////////

        // 激活集团
        $scope.active = function() {
            modal.confirm(null, '请确认是否要激活当前集团？', function() {
                $scope.hasActivated = true;
                $http({
                    "method": "post",
                    "url": app.url.admin.check.activeGroup,
                    "data": {
                        access_token: app.url.access_token,
                        groupApplyId: applyId
                    }
                }).then(function(resp) {
                    if (resp.data.resultCode == 1) {
                        $scope.btnNameActive = '已激活';
                        modal.toast.success('激活成功！');
                    } else {
                        $scope.hasActivated = false;
                        modal.toast.error(resp.data.resultMsg);
                    }
                });
            }, null, {
                OK: '是，激活',
                CANCEL: '不，谢谢'
            });
        };

        $scope.isBlocked = false;


        $scope.block = function() {
            if($scope.btnName =='屏 蔽'){ //屏蔽时弹框确认，取消屏蔽时不弹框
                modal.confirm("确定要对该集团进行屏蔽吗？", "<div class='col text-left'><span class='orangered'>注意：</span>如果屏蔽集团，请相应修改以下位置，以避免<br>用户进入到被屏蔽的集团主页</div><div class='col text-left'>1.患者端主页Banner的跳转按钮</div><div class='col text-left'>2.患者端主页的推荐集团</div>", function() {
                    $scope.isVisiting = true;
                    if (!$scope.isBlocked) {
                        var url = app.url.admin.check.blockGroup;
                    } else {
                        var url = app.url.admin.check.unBlockGroup;
                    }

                    $http({
                        "method": "post",
                        "url": url,
                        "data": {
                            access_token: app.url.access_token,
                            groupId: groupId
                        }
                    }).then(function(resp) {
                        if (resp.data.resultCode == 1) {
                            if (!$scope.isBlocked) {
                                $scope.btnName = '取消屏蔽';
                                modal.toast.success('已屏蔽！');
                            } else {
                                $scope.btnName = '屏 蔽';
                                modal.toast.success('已取消屏蔽！');
                            }
                            $scope.isBlocked = !$scope.isBlocked;
                            $scope.myBlocked=$scope.isBlocked?'已屏蔽' : '未屏蔽';

                        }
                        $scope.isVisiting = false;
                    });
                })
            }else{
                $scope.isVisiting = true;
                if (!$scope.isBlocked) {
                    var url = app.url.admin.check.blockGroup;
                } else {
                    var url = app.url.admin.check.unBlockGroup;
                }

                $http({
                    "method": "post",
                    "url": url,
                    "data": {
                        access_token: app.url.access_token,
                        groupId: groupId
                    }
                }).then(function(resp) {
                    if (resp.data.resultCode == 1) {
                        if (!$scope.isBlocked) {
                            $scope.btnName = '取消屏蔽';
                            modal.toast.success('已屏蔽！');
                        } else {
                            $scope.btnName = '屏 蔽';
                            modal.toast.success('已取消屏蔽！');
                        }
                        $scope.isBlocked = !$scope.isBlocked;
                        $scope.myBlocked=$scope.isBlocked?'已屏蔽' : '未屏蔽';
                    }
                    $scope.isVisiting = false;
                });
            }

        };
        //获取集团下的成员

        if (!$scope.isChecking){
            $scope.check={
                isOne:false,
                numberlsit:0
            }
            $scope.page={
                index:1,
                size:10,
                status:"",
                keyword:'',
                groupid:$scope.formData.groupID
            }
            $scope.initTable=function(){
                var params={
                    access_token: app.url.access_token,
                    groupId: $scope.formData.groupID ||groupId,
                    name:$scope.page.keyword,
                    pageIndex:$scope.page.index-1,
                    pageSize:$scope.page.size,
                    status:$scope.page.status
                }
                $http.post(app.url.admin.check.getMembers,params).success(function(data){
                    if(data.resultCode==1){
                        $scope.groupDoctorList=data.data.pageData;
                        for(var i in $scope.groupDoctorList){
                            $scope.groupDoctorList[i].isCheckOne=false;
                        }
                        $scope.page.totle=data.data.total;
                    }else{
                        modal.toast.error("系统异常");
                    }
                });
            }
            setInterval($scope.initTable(),500);
            //添加医生
            $scope.addByGroup=function(){
                var modalInstance = $modal.open({
                    templateUrl: 'addModalByGroup.html',
                    controller: 'addModalInstanceCtrl',
                    backdrop:'static',
                    size: 'lg',
                    resolve:{
                        idlist:$scope.formData,
                        items:$scope.viewData
                    }
                });
                modalInstance.result.then(function (result) {

                },function(reason){  //撤销，点击其他关闭窗口执行
                    $scope.page.index=1;
                    $scope.initTable();
                })
            }

            $scope.allSelected = function(e) {
                if(e==true){
                    for(var i=0 ; i< $scope.groupDoctorList.length;i++){
                        $scope.groupDoctorList[i].isCheckOne=true;
                        $scope.check.numberlsit= $scope.groupDoctorList.length;
                    }
                }
                else {
                    for(var i=0 ; i< $scope.groupDoctorList.length;i++){
                        $scope.groupDoctorList[i].isCheckOne=false;
                        $scope.check.numberlsit=0;
                    }
                }
            };
            $scope.singleSelected = function(item) {
                if(item.isCheckOne == false){
                    item.isCheckOne = false;
                    $scope.check.numberlsit--;
                }
                if(item.isCheckOne == true) {
                    item.isCheckOne = true;
                    $scope.check.numberlsit++;
                }
            };
            //全选删除
            $scope.delAllGroup=function(){
                if($scope.check.numberlsit==0){
                    return toaster.pop('error',null,'请勾选需要移出的集团成员！');
                }
                var model=$modal.open({
                    templateUrl:'delAllGrouplist.html',
                    controller:'delAllGrouplistCtrl',
                    size:'sm',
                    resolve:{
                        idlist:$scope.check.numberlsit
                    }
                });
                model.result.then(function(data){
                    if(data=="ok"){
                        $http.post(app.url.admin.check.removeDoctors,{
                            access_token: app.url.access_token,
                            groupId:  $scope.formData.groupID,
                            doctorIds:groupList().join(',')
                        }).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,"删除成功");
                                $scope.initTable();
                                $scope.check.isOne=false;
                            }else if(data.resultCode==0) {
                                toaster.pop('error',null,'包含集团创建人，不能移除');
                            }else{
                                toaster.pop('error',null,data.resultMsg);
                            }

                        })
                    }
                })
            }
            //单个删除
            $scope.delGrouplist=function(item){
                var modalInstance = $modal.open({
                    templateUrl: 'delModalByGroup.html',
                    controller: 'delModalGrouplistCtrl',
                    size: 'sm',
                    resolve:{
                        items:item
                    }
                });
                modalInstance.result.then(function (status) {
                    if(status=="ok"){
                        $http.post(app.url.admin.check.removeDoctors,{
                            access_token: app.url.access_token,
                            groupId: $scope.formData.groupID,
                            doctorIds:item.userId
                        }).success(function(data){
                            if(data.resultCode==1){
                                toaster.pop('info',null,"删除成功");
                                $scope.initTable();
                            }else if(data.resultCode==0){
                                toaster.pop('error',null,'集团创建人不能被移出集团');
                            }
                        })
                    }else {
                        modal.toast.error(status);
                    }
                })

            }
            //回车查询
            $scope.funByDor=function(){
                $scope.page.index=1;
                $scope.initTable();
            }
            //页面显示条数
            $scope.funBySize=function(){
                $scope.page.index=1;
                $scope.initTable();
            }
            //审核状态
            $scope.funStatus=function(){
                $scope.page.index=1;
                $scope.initTable()
            }
            //清除搜索
            $scope.clerFunByDor=function(){
                $scope.page.keyword="";
                $scope.initTable();
            }
            //翻页
            $scope.funPageindex=function(){
                $scope.initTable();
            }
            var groupList=function(){
                var checkList = [];
                for(var i=0 ; i< $scope.groupDoctorList.length;i++){
                    if( $scope.groupDoctorList[i].isCheckOne==true) {
                        checkList.push( $scope.groupDoctorList[i].userId);
                    }
                }
                return checkList;
            }
        }

    }
    ]);
// 增加变更负责人
    app.controller('peopleTransfer',funcGroupTransfer);
    funcGroupTransfer.$inject=['$scope', '$rootScope', '$modalInstance', '$http', 'item', 'modal', 'utils','$modal'];
    function funcGroupTransfer($scope, $rootScope, $modalInstance, $http, item, modal, utils,$modal) {
        $scope.account = {};
        var groupId = item.groupId;
        var groupName=item.groupName;
        console.log('groupId:'+groupId)

        $scope.confirm = function() {
            var modalInstance = $modal.open({
                templateUrl: 'confirm.html',
                controller: 'confirmCtrl',
                windowClass:'modalClass',
                size:'md',
                backdrop:true,
                resolve: {
                    items:function(){
                        return{

                            name:$scope.selectedDoctorName
                        }
                    }
                }
            });

            modalInstance.result.then(function (myParams) {
                console.log(myParams.doctorName)
                if (myParams.status == 'ok'){
                    var myParams={
                        selectedDoctorName:myParams.doctorName
                    }
                    $http({
                        url: app.url.group.changeAdmin,
                        method: 'post',
                        data: {
                            access_token: app.url.access_token,
                            groupId: groupId,
                            receiverId:$scope.selectedDoctorId

                        }
                    }).then(function(resp) {
                        if (resp.data.resultCode == '1') {
                            modal.toast.success('变更成功！');
                            $modalInstance.close('del');



                        } else {
                            $scope.authError = resp.data.resultMsg;
                        }
                    });

                }
            })


        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        function setDoctor(dt) {
            if (item === dt[0].id) {
                $scope.authError = '不能转让给自己！';
                return;
            }
            $scope.selectedDoctorId = dt[0].id;
            $scope.selectedDoctorName = dt[0].name;
            $scope.authError = false;
            $scope.$apply();
        }

        $scope.selectDoctor = function() {
            // 创建通讯录列表数据
            var databox = new DataBox('data_res', {
                hasCheck: true,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: true,
                self: false,
                cover: false,
                selectView: false,
                arrType: [1, 0, 0],
                search: {
                    url: app.url.group.searchDoctorByKeyWord,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        keyword: 'name',
                        pageSize: 10000,
                        pageIndex: 0,
                        doctorStatus:'C'

                },
                    dataKey: {
                        name: 'doctor.name',
                        id: 'doctorId',
                        union: 'departmentId',
                        dataSet: 'data.pageData'
                    },
                    keyName: 'keyword',
                    unwind: false
                },
                data: {
                    url: app.url.group.getAllData,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId
                    }
                },
                async: {
                    url: app.url.group.getDepartmentDoctor,
                    dataKey: {
                        departmentId: 'id'
                    },
                    data: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        status: 'C',
                        type: 1
                    },
                    dataName: '',
                    target: {
                        data: '',
                        dataKey: {
                            id: 'id',
                            name: 'name'
                        }
                    }
                },
                titles: {
                    main: '选择医生',
                    searchKey: '医生姓名',
                    label: '已选择医生'
                },
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-user-md dcolor',
                    head: 'headPicFileName'
                },
                root: {
                    selectable: false,
                    name: groupName,//拿取当前集团的名称
                    id: 0
                },
                extra: [{
                    name: '未分配',
                    id: 'idx_0',
                    parentId: 0,
                    subList: [],
                    url: app.url.group.getUndistributed,
                    dataName: 'pageData',
                    target: {
                        data: 'doctor',
                        dataKey: {
                            id: 'doctorId',
                            name: 'name'
                        }
                    },
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId,
                        pageIndex: 0,
                        pageSize: 10000
                    },
                    icon: 'fa fa-bookmark'
                }],
                response: setDoctor,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'subList'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    pid: 'parentId',
                    dpt: 'departments',
                    description: 'description',
                    param: 'param',
                    icon: 'icon',
                    url: 'url',
                    isExtra: 'isExtra',
                    target: 'target'
                },
                callback: function() {}
            });
        };

    };


 //确认是否更改集团负责人
    app.controller('confirmCtrl',['$scope','items','$modalInstance',function ($scope,items,$modalInstance) {
        $scope.selectName=items.name;
        console.log($scope.selectName);
        var myParams={
            status:'ok',
            doctorName:$scope.selectName
        }
        $scope.confirmChange=function () {
            $modalInstance.close(myParams);
        }

        $scope.cancleChange=function () {
            $modalInstance.dismiss('del');
        }
        
    }])
//增加集团信息编辑
    app.controller("groupEditCtrl",['$scope', '$modalInstance','$log','$rootScope','$http','utils', 'uiLoad', 'JQ_CONFIG','modal','items','$timeout',function ($scope, $modalInstance,$log,$rootScope,$http,utils, uiLoad, JQ_CONFIG,modal,items,$timeout) {
        $scope.groupId=items.groupId;
        $scope.applyId=items.applyId;
        console.log($scope.groupId);
        console.log($scope.applyId);
        $scope.viewData = {};

        $scope.initialGroupIfo=function (groupId) {
            console.log('执行了')
            if(groupId){
                $http({
                    url: app.url.group.getGroupById,
                    method: 'post',
                    data: {
                        access_token: app.url.access_token,
                        id: groupId
                    }
                }).then(function (resp) {
                    if(resp.data.resultCode === 1){
                        var dt = resp.data.data;
                        console.log(dt);
                        $scope.test=55555
                        $scope.viewData.logoUrl = dt.logoUrl || 'src/img/logoDefault.jpg';
                        $scope.viewData.groupName = dt.name;
                        $scope.viewData.introduction = dt.introduction || '';
                        $scope.usrPicUrl=$scope.viewData.logoUrl;
                        console.log($scope.viewData)
                    }else {
                        $scope.authError = resp.data.resultMsg;
                    }
                    
                }), function(resp) {
                    $scope.authError = resp.data.resultMsg;
                }
            }
            
            if(groupId){
                //获取擅长病种
                $http.post(app.url.admin.check.getDiseaseLabel, {
                    access_token: app.url.access_token,
                    docGroupId: groupId
                    // access_token: localStorage.getItem('access_token'),
                    // docGroupId: localStorage.getItem('curGroupId')
                }).success(function(data) {
                    console.log('groupId:'+groupId);
                    if (data.data.length >= 0) {
                        $scope.loading = false;
                        data.data.map(function(e) {
                            e.id = e.diseasesId;
                            e.name = e.diseasesName;
                            delete e.diseasesId;
                            delete e.diseasesName;
                            return e;
                        });
                        // $scope.dataDom = data.data.length==0?[{name:1}]:data.data;
                        $scope.dataDom = data.data;
                        console.log($scope.dataDom instanceof Array)
                        console.log($scope.dataDom)
                    } else {
                        $scope.loading = false;
                    }
                    setEditor();
                }).error(function(data) {
                    console.error(data);
                });



            }

            // 添加擅长病种
            var pickData = function() {
                console.log("pickData")
                console.log(DataBox)
                var databox = new DataBox('data_res', {
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
                        url: '',
                        param: {},
                        searchDepth: [1],//这个参数很重要  不要随便注释
                        dataKey: {
                            name: 'name',
                            id: 'id',
                            union: 'parentId',
                            dataSet: 'data.data'
                        },
                        keyName: 'keyword',
                        unwind: false
                    },
                    arrType: [1, 1, 0],
                    data: {
                        url: app.url.group.getDiseaseTree
                    },
                    titles: {
                        main: '选择病种',
                        searchKey: '搜索病种...',
                        label: '已选择病种数'
                    },
                    icons: {
                        arrow: 'fa fa-caret-right/fa fa-caret-down',
                        check: 'fa fa-check/fa fa-square',
                        root: 'fa fa-hospital-o cfblue',
                        branch: 'fa fa-h-square cfblue',
                        leaf: 'fa fa-stethoscope dcolor',
                        head: 'headPicFileName'
                    },
                    fixdata: $scope.dataDom,
                    response: makeList,
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
            };

            //遍历dom
            function makeList(data) {
                console.log("makeList")
                console.log(data)
                $scope.dataDom = data;
                $scope.$apply($scope.dataDom);
            }

            function setEditor() {
                console.log("setEditor")
                // 修改
                $scope.addData = function() {
                    console.log("addData")
                    pickData();
                };

                // 保存
                $scope.saveData = function() {
                    console.log("saveData")
                    var ids = [];
                    //更改数组每个元素的属性名称
                    //if (!$scope.dataDom || $scope.dataDom.length === 0) return;

                    $scope.dataDom.forEach(function(item, index, array) {
                        ids.push(item.id);
                    });
                    //设置擅长病种
                    $http.post(app.yiliao + 'group/settings/setSpecialty', {
                        'access_token': app.url.access_token,
                        'docGroupId': groupId,
                        'specialtyIds': ids
                    }).
                    success(function(data) {
                        if (data.resultCode === 1) {
                            $scope.result = true;
                            // modal.toast.success('擅长病种保存成功！');
                        } else {
                            $scope.result = false;
                            modal.toast.error('擅长病种保存失败！');
                        }
                    }).
                    error(function(data) {
                        console.error('保存擅长病种:' + data);
                    });
                };

                $scope.removeItem = function(item) {
                    var index = $scope.dataDom.indexOf(item);
                    $scope.dataDom.splice(index, 1);
                };
            }


        }

        $scope.initialGroupIfo($scope.groupId);

//////////////////////////////////////////////////////////////////////////

        // 上传图片
        $scope.usrPicUrl=$scope.viewData.logoUrl;
        console.log($scope.viewData);
        $scope.loaded = true;
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


        //保存和取消
        $scope.myCancel=function () {
            $modalInstance.dismiss('del');
        }
        $scope.ok=function(){
            console.log("ok")
            console.log($scope.viewData.introduction);

            $scope.saveGroupIfo=function () {
                var url=app.url.group.updateByGroup;
                var groupParams={};
                groupParams={
                    access_token:app.url.access_token,
                    id:$scope.groupId,
                    name:$scope.viewData.groupName,
                    introduction:$scope.viewData.introduction,
                    logoUrl:$scope.usrPicUrl
                
                }
                if(!$scope.viewData.groupName){
                    modal.toast.error("集团名称不能为空")
                }else if(!$scope.viewData.introduction){
                    modal.toast.error("集团简介不能为空")

                }else if(!$scope.usrPicUrl){
                    modal.toast.error("集团logo不能为空")
                }else {
                    $http.post(url,groupParams).then(function (resp) {
                        console.log(resp);
                        // $scope.initialGroupIfo($scope.applyId,$scope.groupId);
                        // location.reload();
                        $scope.saveData();
                        //更新病种树是异步的  要设置延迟
                        $timeout(function () {
                            modal.toast.success("集团信息编辑成功")
                            $modalInstance.close("ok");
                        },50)

                    })
                }

                
            }

            $scope.saveGroupIfo();
        }

    }])

//增加操作记录
    app.controller('operatingRecordCtrl', ['$scope', '$modalInstance','$log','$rootScope','$http','items',function($scope, $modalInstance,$log,$rootScope,$http,items) {
        $scope.pageSize = 10;
        $scope.pageIndex = 0;
        $scope.keyWord = null;
        $scope.groupId =items.groupId;
        $scope.InitTable=function(pageIndex, pageSize, keyWord){
            $http.post(app.url.user.getOperationRecord, {
                access_token: app.url.access_token,
                id: $scope.groupId,
                pageIndex: pageIndex,
                pageSize: pageSize,
                keyword: keyWord
            }).then(function(rpn) {
                $scope.data =rpn.data.data;
            });
        }
        $scope.InitTable(0,10,'');
        // 翻页
        $scope.pageChanged = function () {
            $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.keyWord);
        };
        //取消
        $scope.recordCancel=function(){
            $modalInstance.dismiss('cancel');
        }
        //清除搜索
        $scope.clearKW=function(){
            $scope.keyWord='';
        }
        //$scope.itemaaa="证书照片：【<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,】</a>改为【<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,<a class='mblue' target='_blank' href='http://avatar.dev.file.dachentech.com.cn/o_1aqr58m5ekvb1l3e1koqkea11cr9'>链接,】</a>"
    }])


//删除弹窗（屏蔽）
    app.controller('delModalInstanceCtrl', ['$scope', '$modalInstance',function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close('ok');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
//添加医生（主窗口）
    app.controller('addModalInstanceCtrl',['$scope', '$modalInstance','$http','$modal','toaster','idlist','items',function($scope, $modalInstance,$http,$modal,toaster,idlist,items){
        $scope.addGroupData=items;
        $scope.isShowLoad=false;
        $scope.isShowSaved=false;
        $scope.page={
            index:1,
            size:10,
            keyword:'',
            totle:''
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.funByDotdor=function(){
            if(!$scope.page.keyword){
                return toaster.pop('error',null,"请输入关键字搜索");
            }
            $scope.isShowLoad=true;
            $scope.check={
                isOne:false,
                numberlsit:0
            };
            var prames={
                access_token: app.url.access_token,
                keyword:$scope.page.keyword,
                pageIndex:$scope.page.index-1,
                pageSize:$scope.page.size ||10
            };
            $http.post(app.url.admin.check.getDoctorsByKeywork,prames).success(function(data){
                $scope.isShowLoad=false;
                if(data.resultCode==1){
                    $scope.isShowSaved=true;
                    $scope.dataGroupList=data.data.pageData;
                    for(var i in $scope.dataGroupList){
                        $scope.dataGroupList[i].isCheckTwo=false;
                    }
                    $scope.page.totle=data.data.total;
                }
            });
        }
        $scope.funPageindex=function(){
            $scope.funByDotdor();
        }
        $scope.allSelected = function(e) {
            if(e==true){
                for(var i=0 ; i< $scope.dataGroupList.length;i++){
                    $scope.dataGroupList[i].isCheckTwo=true;
                    $scope.check.numberlsit= $scope.dataGroupList.length;
                }
            }
            else {
                for(var i=0 ; i< $scope.dataGroupList.length;i++){
                    $scope.dataGroupList[i].isCheckTwo=false;
                    $scope.check.numberlsit=0;
                }
            }
        };
        $scope.singleSelected = function(item) {
            if(item.isCheckTwo == false){
                item.isCheckTwo = false;
                $scope.check.numberlsit--;
            }
            if(item.isCheckTwo == true) {
                item.isCheckTwo = true;
                $scope.check.numberlsit++;
            }
        };
        var groupList=function(){
            var checkList = [];
            for(var i=0 ; i<$scope.dataGroupList.length;i++){
                if($scope.dataGroupList[i].isCheckTwo==true) {
                    checkList.push( $scope.dataGroupList[i].doctorId);
                }
            }
            return checkList;
        }
        $scope.funBySize=function(){
            if(!$scope.page.keyword){
                return ;
            }
            $scope.page.index=1;
            $scope.funByDotdor();
        }
        $scope.ok=function(){
            if( $scope.check.numberlsit==0){
                return toaster.pop('error',null,"请选择医生");
            }
            var modalInstance = $modal.open({
                templateUrl: 'addGroupModallist.html',
                controller: 'addGroupModallistCtlr',
                size: 'sm',
                resolve:{
                    items:$scope.addGroupData
                }
            });
            modalInstance.result.then(function (status) {
                if(status=='ok'){
                    $http.post(app.url.admin.check.inviterJoinGroup,{
                        access_token: app.url.access_token,
                        groupId:$scope.addGroupData.groupId,
                        doctorIds:groupList().join(',')
                    }).success(function(data){
                        if(data.resultCode==1){
                            toaster.pop('info',null,'添加医生成功');
                            //$modalInstance.close("ok");
                            $scope.funByDotdor();
                        }else{
                            toaster.pop('error',null,data.resultMsg);
                        }
                    })
                }
            })
        }
    }]);

//删除医生(报angular依赖错误，所有就和多选删除分开写了方法)
    app.controller('delModalGrouplistCtrl',['$scope','$modalInstance', '$http','$stateParams','items',function($scope,$modalInstance, $http,$stateParams,items){
        $scope.items={
            list:items,
        };
        $scope.ok=function(){
            $modalInstance.close("ok");
        };
        $scope.cancel=function(){
            $modalInstance.dismiss('del');
        }
    }]);
    app.controller('delAllGrouplistCtrl',['$scope','$http','$modalInstance','idlist',function($scope,$http,$modalInstance,idlist){
        $scope.listlength=idlist;
        $scope.ok=function(){
            $modalInstance.close("ok");
        };
        $scope.cancel=function(){
            $modalInstance.dismiss('del');
        }
    }])
//集团添加医生(确认窗口)
    app.controller('addGroupModallistCtlr',['$scope','$modalInstance','items',function($scope,$modalInstance,items){
        $scope.groupDataList=items;
        $scope.cancel=function () {
            $modalInstance.dismiss('del');
        }
        $scope.ok=function(){
            $modalInstance.close("ok");
        }
    }])

})();
