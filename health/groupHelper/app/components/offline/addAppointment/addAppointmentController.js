(function() {
    angular.module('app')
        .controller('AddAppointmentCtrl', ['$scope','$uibModal','SureDialogFactory', '$uibModalInstance', 'toaster', '$http', 'constants', 'EditBookTimeModal', 'EditRemarModal', 'options','EditCancelInfoModal','SearchOffLineDoctorDialogFactory','Lightbox','orderDetailModalFactory',
            function($scope,$uibModal, SureDialogFactory,$uibModalInstance, toaster, $http, constants, EditBookTimeModal, EditRemarModal, options,EditCancelInfoModal,SearchOffLineDoctorDialogFactory,Lightbox,orderDetailModalFactory) {
                //显示当前的阶段
                $scope.stage=1;
                $scope.doctorInfo={};

                if(options){
                    $scope.doctorInfo=options;
                }

                $scope.orderParam={};
                $scope.orderParam.imagePaths=[];
                $scope.orderParam.isSee='false';

                $scope.patient={};

                //患者信息控件能否输入
                $scope.disableEdit=false;

                //选择生日控件初始状态
                $scope.birthdayOpen=false;

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.toStage1=function(){
                    $scope.stage=1;
                };

                $scope.toStage2=function(){
                    if(!$scope.doctorInfo.id){
                        return toaster.pop('error', null, '请选择医生');
                    }
                    $scope.stage=2;
                };

                $scope.toStage3=function(){
                    if($scope.disableEdit==false){
                        //验证
                        if(!$scope.doctorInfo.id){
                            return toaster.pop('error', null, '请选择医生');
                        }
                        if(!$scope.patient.telephone){
                            return toaster.pop('error', null, '手机号码不能为空');
                        }
                        if(!$scope.patient.userName){
                            return toaster.pop('error', null, '患者姓名不能为空');
                        }
                        if(!$scope.patient.sex){
                            return toaster.pop('error', null, '请选择性别');
                        }
                        if(!$scope.patient.idtype){
                            return toaster.pop('error', null, '请选择证件类型');
                        }
                        if(!$scope.patient.idcard){
                            return toaster.pop('error', null, '证件号码不能为空');
                        }
                        if(!$scope.patient.birthday){
                            return toaster.pop('error', null, '请选择出生日期');
                        }
                        if(!$scope.patient.area){
                            return toaster.pop('error', null, '居住地不能为空');
                        }
                        if(!$scope.patient.relation){
                            return toaster.pop('error', null, '请选择患者关系');
                        }
                        if(!$scope.patient.weight<0){
                            return toaster.pop('error', null, '请填写正确的体重');
                        }
                        if(!$scope.patient.height<0){
                            return toaster.pop('error', null, '请填写正确的身高');
                        }
                    }
                    $scope.stage=3;
                };

                $scope.toStage4=function(){
                    $scope.stage=3;
                };

                // 关闭弹窗
                $scope.close = function() {
                    //第四阶段提交好了，直接关闭
                    if($scope.stage!==4){
                        SureDialogFactory.openModal({
                            title:'提醒',
                            subtitle:'您已填写部分预约信息，关闭会丢失全部填写情况，确定关闭?',
                            btnOk:{
                                title:'确认',
                                className:'text-success'
                            },
                            btnCancel:{
                                title:'取消'
                            },
                            callback:function(status){
                                if(status){
                                    $uibModalInstance.dismiss('cancel');
                                }
                            }
                        });
                    }
                };

                //今天
                $scope.today = function() {
                    $scope.patient.birthday = new Date();
                };

                //清除日期
                $scope.clear = function() {
                    $scope.patient.birthday = null;
                };

                //搜索医生
                $scope.searchOffLineDoc=function(){
                    SearchOffLineDoctorDialogFactory.openModal({
                        callback:function(data){
                            $scope.doctorInfo=data;
                        }
                    });
                };

                $scope.editInfo=true;
                //通过患者的电话号码搜索
                $scope.searchByPatientPhone=function(){
                    if(!$scope.patient.telephone){
                        return toaster.pop('error', null, '请输入手机号码');
                    }
                    var _tel=$scope.patient.telephone;
                    $http.post(constants.api.outLine.getPatientsByTelephone, {
                        access_token:localStorage['groupHelper_access_token'],
                        telephone:$scope.patient.telephone
                    }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            if(data.data&&data.data.length>0){
                                //不能输入
                                $scope.patients=data.data;
                                $scope.patient=data.data[0];
                                $scope.patientId=$scope.patient.id.toString();
                                $scope.editInfo=false;
                                $scope.disableEdit=true;
                                $scope.patient.sex=$scope.patient.sex?$scope.patient.sex.toString():'1';
                                $scope.patient.idtype=$scope.patient.idtype?$scope.patient.idtype.toString():'1';
                            }
                            else{
                                toaster.pop('error', null, '无该患者信息，请直接新增');
                                $scope.patient={};
                                $scope.patient.telephone=_tel;
                                $scope.disableEdit=false;
                                $scope.editInfo=true;
                            }
                        }
                        else{
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error', null, data.resultMsg);
                    });
                };

                //选择患者姓名之后
                $scope.setCurPatient=function(){
                    $scope.patient=$scope.patients.filter(function(item,index,array){
                        return item.id=$scope.patientId;
                    })[0];
                    if($scope.patientId=='new'){
                        $scope.disableEdit=false;
                        $scope.editInfo=true;
                        $scope.patient={};
                    }
                    else{
                        $scope.patient.sex=$scope.patient.sex?$scope.patient.sex.toString():'1';
                        $scope.patient.idtype=$scope.patient.idtype?$scope.patient.idtype.toString():'1';
                        $scope.disableEdit=true;
                        $scope.editInfo=false;
                    }
                };

                // 七牛上传文件过滤
                $scope.qiniuFilters = {
                    mime_types: [ //只允许上传图片和zip文件
                        {
                            title: "Image files",
                            extensions: "jpg,gif,png"
                        }
                    ]
                };

                //当前是上传哪类图片 1为头像，2为病情图片
                var curImgType=1;

                //选择头像文件上传
                $scope.selectFile = function(){
                    if($scope.disableEdit){
                        toaster.pop('error',null,'头像不能修改！');
                    }
                    curImgType=1;
                    $scope.upload();
                };

                //选择病情资料文件上传
                $scope.selectDiseaseImgs=function(){
                    curImgType=2;
                    $scope.upload();
                };

                // 设置七牛上传获取uptoken的参数
                $scope.token = localStorage['groupHelper_access_token'];
                // 选择文件后回调
                $scope.uploaderAdded = function(up, files) {
                    $scope.uploadPercent=0;
                    console.log(up,files);
                };


                // 每个文件上传成功回调
                $scope.uploaderSuccess = function(up, file, info) {
                    $scope.uploadPercent=100;
                    toaster.pop('success',null,'上传成功！');
                    if(curImgType==1){
                        $scope.patient.topPath=file.url;
                    }
                    else if(curImgType==2){
                        $scope.orderParam.imagePaths.push(file.url);
                    }

                };
                // 每个文件上传失败后回调
                $scope.uploaderError = function(up, err, errTip) {
                    if(err.code==-600){
                        toaster.pop('error', null, '文件过大');
                    }
                    else{
                        toaster.pop('error', null, errTip);
                    }
                };

                //上传进度
                $scope.fileUploadProcess=function(up, file){
                    $scope.uploadPercent=file.percent==100?99:file.percent;
                };

                // 放大图片
                $scope.openLightboxModal = function(index) {
                    console.log($scope.orderParam.imagePaths);
                    Lightbox.openModal($scope.orderParam.imagePaths, index);
                };


                //提交按钮的状态
                $scope.submiting=false;
                //提交预约
                $scope.submit=function(){
                    if(!$scope.orderParam.diseaseDesc){
                        return toaster.pop('error', null, '病情描述不能为空');
                    }
                    var _orderParam={
                        diseaseDesc:$scope.orderParam.diseaseDesc,
                        isSee:$scope.orderParam.isSee,
                        seeDoctorMsg:$scope.orderParam.seeDoctorMsg,
                        imagePaths:$scope.orderParam.imagePaths

                    };

                    var _offlineItem;
                    if($scope.doctorInfo.bookTime.id){
                        _offlineItem={
                            id:$scope.doctorInfo.bookTime.id
                        };
                    }
                    else{
                        _offlineItem={
                            doctorId:$scope.doctorInfo.id,
                            hospitalId:$scope.doctorInfo.hospital.id,
                            startTime:$scope.doctorInfo.bookTime.startTime,
                            endTime:$scope.doctorInfo.bookTime.endTime,
                        };

                        _orderParam.price=$scope.doctorInfo.price;
                    }

                    var _patient;
                    if($scope.patient.id){
                        _patient={
                            id:$scope.patient.id
                        }
                    }
                    else{
                        _patient={
                            telephone:$scope.patient.telephone,
                            userName:$scope.patient.userName,
                            sex:$scope.patient.sex,
                            birthday:(new Date($scope.patient.birthday)).getTime(),
                            relation:$scope.patient.relation,
                            area:$scope.patient.area,
                            idcard:$scope.patient.idcard,
                            topPath:$scope.patient.topPath,
                            idtype:parseInt($scope.patient.idtype),
                            height:$scope.patient.height,
                            weight:$scope.patient.weight,
                            marriage:$scope.patient.marriage,
                            professional:$scope.patient.professional
                        };
                    }


                    //禁用提交按钮
                    $scope.submiting=true;
                    //提交预约信息
                    $http.post(constants.api.outLine.takeAppointmentOrder, {
                        access_token:localStorage['groupHelper_access_token'],
                        jsonString:JSON.stringify({
                            offlineItem:_offlineItem,
                            patient:_patient,
                            orderParam:_orderParam
                        })
                    }).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            $scope.submiting=false;
                            toaster.pop('success', null, '预约成功');
                            $scope.stage=4;
                            $scope.orderId=data.data.orderId;
                            $scope.orderNo=data.data.orderNo;
                        }
                        else{
                            $scope.submiting=false;
                            toaster.pop('error', null, data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.submiting=false;
                        toaster.pop('error', null, data.resultMsg);
                    });
                };


                //查看订单详情
                $scope.showOrderDetail=function(){
                    orderDetailModalFactory.openModal({
                        orderId:$scope.orderId
                    });
                    $uibModalInstance.dismiss('cancel');
                }
    }]);
})();
