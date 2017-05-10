'use strict';
(function () {
    app.controller('CheckPassView', ['$scope', '$http', '$state', '$rootScope','$modal', '$stateParams','utils', 'modal',
        function($scope, $http, $state, $rootScope,$modal, $stateParams,utils, modal) {
            $scope.authError = null;
            $scope.viewData = {};
            $scope.urlType=$stateParams.type;
            $scope.urlIndex=$stateParams.page;
            //$scope.viewData.doctorPortrait = $rootScope.curDoctorPic || utils.localData('curDoctorPic');
            $scope.viewData.isDoctor = false;
            console.log('进来了')
            var id ="";
            console.log($rootScope.details);
            console.log($scope.details);
            if ($scope.details) {
                id = $scope.details.id;
                if (!utils.localData('idVal', id)) {
                    console.error('数据未保存！');
                }
            }
            else {
                id = utils.localData('idVal');
                console.log(id)
                // id=$rootScope.details.id;
                if (!id) {
                    console.error('无有效数据！');
                    return;
                }
            }

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
                    // 要显示的数据
                    $scope.viewData = {
                        doctorPortrait: dt.headPicFileName || 'src/img/a0.jpg',
                        origin: dt.source || '--',
                        inviter: dt.inviterName || '--',
                        name: dt.name || '--',
                        userId: dt.userId || '--',
                        doctorNum: dt.doctorNum || '--',
                        hospital: dt.hospital || '--',
                        departments: dt.departments || '--',
                        sex: dt.sex == '1' ?  '男' : dt.sex == '2' ?  '女' :'--',
                        introduction: dt.introduction || '--',
                        keywords:dt.expertises ,
                        skill:dt.skill || '--',
                        title: dt.title || '--',
                        telephone: dt.telephone || '--',
                        status: dt.status == 3 ? '未通过' : dt.status == 1 ? '已通过' : '待审核',
                        remark: dt.remark || '--',
                        checker: dt.checker || '--',
                        licenseExpire: date ? _y + ' 年 ' + _m + ' 月 ' + _d + ' 日' : '--',
                        licenseNum: dt.licenseNum || '--',
                        isDoctor: dt.userType == '3' ? true : false,
                        userType: dt.userType,
                        Qurl:dt.qRUrl,
                        assistantName:dt.assistantName || '--',
                        role: dt.role == '1' ? '医生' : dt.role == '2' ? '护士' : dt.role == '3' ? '其他' : '--',
                        group:dt.groupNames.length!=0?dt.groupNames:['--'],
                        certTime:dt.certTime||'--',
                        checkTime:dt.checkTime||'--',
                        modifyTime:dt.modifyTime||'--',
                        services:dt.services.length!=0?dt.services:['--']
                    }


                });
                // console.log($scope.viewData.Qurl);
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
            // 获取要审核的医生数据

            // 反审核
            $scope.revCheck = function() {
                modal.confirm("确定要对该医生反审核吗？", "<div class='col text-left'><span class='orangered'>注意：</span>如果对医生反审核，请相应修改以下位置，以避免<br>用户进入到被屏蔽的医生主页</div><div class='col text-left'>1.患者端主页Banner的跳转按钮</div><div class='col text-left'>2.患者端主页的推荐医生</div>", function(){
                    $http({
                        url: app.url.admin.check.uncheck,
                        data: {
                            access_token: app.url.access_token,
                            userId: $scope.viewData.userId
                        },
                        method: 'POST'
                    }).then(function(dt) {
                        if (dt.data.resultCode === 1) {
                            modal.toast.success('反审核成功！');
                            window.history.back();
                        }else{
                            $scope.authError = '获取数据失败！';
                            return;
                        }
                    });
                });
            };

            //操作记录
            $scope.operatingRecord=function(){
                var modalInstance = $modal.open({
                    templateUrl: 'operatingRecord.html',
                    controller: 'operatingRecordCtrl',
                    size:'lg',
                    resolve: {
                        items:function(){
                            return{
                                userId: $scope.viewData.userId
                            }
                        }
                    }
                });
            }

            // 返回
            $scope.return = function() {
                 $rootScope.ids = [];
                // window.history.back();
                if($scope.urlIndex){
                    var params={
                        type:$scope.urlType,
                        page:$scope.urlIndex,
                        isone:'true'
                    };
                    $state.go('app.check.doctor.check_list',params);
                }else {
                    window.history.back();
                }

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
            };


            // 缩略图为动态生成，要延迟后执行相关操作
            // $scope.imgIsShow=true;
            // setTimeout(function() {
            //     var preview = $('#gl_preview img');
            //     var points = $('#gl_point a');
            //     // preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
            //     points.click(function() {
            //         // console.log(1111)
            //         $('#gl_preview').show();
            //         var _img = $(this).find('img');
            //         preview.attr('src', _img.attr('src'));
            //         _img.addClass('cur-img');
            //         $(this).siblings().find('img').removeClass('cur-img');
            //     });
            //
            //     preview.click(function () {
            //         // console.log(2222)
            //         $('#gl_preview').hide();
            //     })
            // }, 500);
        }
    ]);
    app.controller("bigImgCtrl",['$scope','$modalInstance','items',function($scope,$modalInstance,items){
        console.log(items.url);
        $scope.url=items.url;



    }])

    app.controller('operatingRecordCtrl', ['$scope', '$modalInstance','$log','$rootScope','$http','items',function($scope, $modalInstance,$log,$rootScope,$http,items) {
        $scope.pageSize = 10;
        $scope.pageIndex = 0;
        $scope.keyWord = null;
        $scope.userId =items.userId;
        $scope.InitTable=function(pageIndex, pageSize, keyWord){
            $http.post(app.url.user.getOperationRecord, {
                access_token: app.url.access_token,
                id: $scope.userId,
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


})();
