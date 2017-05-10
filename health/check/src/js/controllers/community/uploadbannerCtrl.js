'use strict';
(function () {
    app.controller('BannerditCtrl', ['$scope', '$timeout', 'utils', '$http', '$modal', 'Upload', 'toaster', '$state', '$stateParams', '$sce','$log','$rootScope','modal',function($scope, $timeout, utils, $http, $modal, Upload, toaster, $state, $stateParams, $sce,$log,$rootScope,modal) {
        $scope.titleLength = 0;
        $scope.summaryLength = 0;
        $scope.formData = {};
        $scope.formData.keywords = [];
        $scope.fontImg = null;
        $scope.fontImgUrl = null;
        $scope.isSaved = false;
        $scope.formData.isShowImg = false;
        var isEdit = false;
        var articleId = null;
        var um = null;
        //获取七牛上传token和domain
        $http({
            url: serverApiRoot + 'vpanfile/getUploadToken',
            method: 'post',
            data: {
                access_token: app.url.access_token,
                bucket: 'resource'
            }
        }).then(function(response) {
            var rep = response.data;
            if (rep && rep.resultCode == 1 && rep.data && rep.data.token && rep.data.domain) {
                //初始化编辑器
                um = UM.getEditor('myEditor', {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 300,
                    qiniuToken: rep.data.token,
                    qiniuDomain: rep.data.domain
                });
                initEdit();
            } else {
                console.error(rep);
            }
        });

        $scope.$on('$destroy', function() {
            um.destroy();
        });

        //获取文字的长度
        var getByteLen = function(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                    len += 2;
                else
                    len += 1;
            };
            return len;
        };

        //编辑文章
        function initEdit() {
            if ($stateParams.id) {
                isEdit = true;
                $http.post(app.url.science_ad.getDocumentDetail, {
                    access_token: app.url.access_token,
                    id: $stateParams.id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.formData = {
                            title: data.data.title
                        };
                        $scope.fontImgUrl = data.data.copyPath;
                        $scope.formData.isShowImg = data.data.isShowImg == 1 ? true : false;
                        articleId = data.data.id;
                        $scope.isShow =data.data.isShow;//获取患者广告的显示和不显示状态
                        um.setContent(data.data.content);
                        if(data.data.isRecommend==0){
                            $scope.radioState =0;
                        }else{
                            $scope.radioState =1;
                            $scope.homePage= {};
                            $scope.homes =false; //输入框隐藏
                            $scope.deletehome=true; //删除按钮出现
                            if(data.data.recommendDetails.recommendType==1){
                                $scope.jituan_yisheng =1;
                                $scope.works='集团主页';
                                $scope.homePage =data.data.recommendDetails.groupName;
                                $scope.id =data.data.recommendDetails.groupId;

                            }else{
                                $scope.jituan_yisheng =2;
                                $scope.works='医生主页';
                                $scope.homePage=data.data.recommendDetails.doctorName;
                                $scope.id=data.data.recommendDetails.doctorId;
                            }
                        }

                    }
                    else {
                        alert(data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    alert(data.resultMsg);
                });
            }
        }

        $scope.$watch('formData.title', function(newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.title) {
                    // var totalLen = 0;
                    // var cutTitle = "";
                    // for (var j = 0; j < $scope.formData.title.length; j++) {
                    //     if (totalLen >= 50) {
                    //         break;
                    //     } else {
                    //         totalLen += getByteLen($scope.formData.title[j]);
                    //         if( totalLen==51 ){
                    //             break;
                    //         }
                    //         cutTitle += $scope.formData.title[j];
                    //     }
                    // }
                    // $scope.titleLength = getByteLen($scope.formData.title);
                    // $scope.formData.title = cutTitle;
                    $scope.titleLength = $scope.formData.title.length;
                } else {
                    $scope.titleLength = 0;
                }
            }
        });
        $scope.$watch('formData.summary', function(newValue, oldValue) {
            if (newValue != oldValue) {
                if ($scope.formData.summary) {
                    var totalLen = 0;
                    var cutSummary = "";
                    for (var j = 0; j < $scope.formData.summary.length; j++) {
                        if (totalLen >= 80) {
                            break;
                        } else {
                            totalLen += getByteLen($scope.formData.summary[j]);
                            cutSummary += $scope.formData.summary[j];
                        }
                    }
                    $scope.summaryLength = getByteLen($scope.formData.summary);
                    $scope.formData.summary = cutSummary;
                } else {
                    $scope.summaryLength = 0;
                }
            }


        });


        // 七牛上传文件过滤
        $scope.qiniuFilters = {
            mime_types: [ //只允许上传图片和zip文件
                {
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }
            ]
        };

        //选择文件上传
        $scope.selectFile = function() {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent = 0;
            console.log(up, files);
        };
        // 每个文件上传成功回调
        $scope.uploaderSuccess = function(up, file, info) {
            $scope.fontImgUrl = file.url;
            $scope.copy_small = file.url + '?imageView2/3/w/200/h/200';
            $scope.uploadPercent = 100;
            toaster.pop('success', null, '封面修改成功！');
        };
        // 每个文件上传失败后回调
        $scope.uploaderError = function(up, err, errTip) {
            if (err.code == -600) {
                toaster.pop('error', null, '文件过大');
            } else {
                toaster.pop('error', null, errTip);
            }
        };

        //上传进度
        $scope.fileUploadProcess = function(up, file) {
            $scope.uploadPercent = file.percent == 100 ? 99 : file.percent;
        };

        //保存文章
        $scope.saveDoc = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            if ($scope.radioState==1) {
                if($scope.save ==true && $scope.homePage !=undefined){

                }else{
                    toaster.pop('warn', '', '请填写主页信息');
                    return;
                }
            }
            var html = um.getContent();
            if (html.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }

            $scope.isSaved = true;
            var isShowImg = $scope.formData.isShowImg == false ? 0 : 1;
            if (isEdit == true) {
                if($scope.radioState==1){//是否创建广告
                    if($scope.jituan_yisheng==1){//集团类型
                        $scope.docParam ={
                            access_token: app.url.access_token,
                            id: articleId,
                            isRecommend:$scope.radioState,
                            'recommendDetails.recommendType':$scope.jituan_yisheng,
                            'recommendDetails.groupId':$scope.id,
                            groupName:$scope.homePage,
                            title: $scope.formData.title,
                            copyPath: $scope.fontImgUrl,
                            isShowImg: isShowImg,
                            content: html,
                            isShow: $scope.isShow
                        }
                    }else if($scope.jituan_yisheng==2){//医生类型
                        $scope.docParam ={
                            access_token: app.url.access_token,
                            id: articleId,
                            isRecommend:$scope.radioState,
                            'recommendDetails.recommendType':$scope.jituan_yisheng,
                            'recommendDetails.doctorId':$scope.id,
                            doctorName :$scope.homePage,
                            title: $scope.formData.title,
                            copyPath: $scope.fontImgUrl,
                            isShowImg: isShowImg,
                            content: html,
                            isShow: $scope.isShow
                        }
                    }else{

                    }
                }else{
                    $scope.docParam ={
                        access_token: app.url.access_token,
                        id: articleId,
                        isRecommend:$scope.radioState,
                        //'recommendDetails.recommendType':$scope.jituan_yisheng,
                        //'recommendDetails.doctorId':$scope.homePage.doctorId,
                        //doctorName :$scope.homePage.name,
                        title: $scope.formData.title,
                        copyPath: $scope.fontImgUrl,
                        isShowImg: isShowImg,
                        content: html,
                        isShow: $scope.isShow
                    }
                }
                $http({
                    url: app.url.science_ad.updateDocument,
                    method: 'post',
                    "data":$scope.docParam
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        if ($state.includes('app.document.edit_patient_ad')) {
                            toaster.pop('success', '', '保存成功,3秒钟后返回患者广告条列表');
                            setTimeout(function() {
                                $state.go('app.document.patient_ad', {}, {
                                    reload: true
                                });
                            }, 3000);
                        } else if ($state.includes('edit_patient_ad')) {
                            toaster.pop('success', '', '保存成功,3秒钟后返回文章');
                            window.opener.reflashData();
                            setTimeout(function() {
                                $state.go('patient_ad_article', {
                                    id: $stateParams.id
                                }, {
                                    reload: true
                                });
                            }, 3000);
                        }
                    } else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }else {
                //创建广告
                if($scope.radioState==1){//是否创建广告
                    if($scope.jituan_yisheng==1){//集团类型
                        $scope.docParam ={
                            access_token: app.url.access_token,
                            documentType: 1,
                            isRecommend:$scope.radioState,
                            'recommendDetails.recommendType':$scope.jituan_yisheng,
                            'recommendDetails.groupId':$scope.id,
                            groupName:$scope.homePage,
                            title: $scope.formData.title,
                            copyPath: $scope.fontImgUrl,
                            isShowImg: isShowImg,
                            content: html
                        }
                    }else if($scope.jituan_yisheng==2){//医生类型
                        $scope.docParam ={
                            access_token: app.url.access_token,
                            documentType: 1,
                            isRecommend:$scope.radioState,
                            'recommendDetails.recommendType':$scope.jituan_yisheng,
                            'recommendDetails.doctorId':$scope.id,
                            doctorName :$scope.homePage,
                            title: $scope.formData.title,
                            copyPath: $scope.fontImgUrl,
                            isShowImg: isShowImg,
                            content: html
                        }
                    }else{

                    }
                }else{
                    $scope.docParam ={
                        access_token: app.url.access_token,
                        documentType: 1,
                        isRecommend:$scope.radioState,
                        //'recommendDetails.recommendType':$scope.jituan_yisheng,
                        //'recommendDetails.doctorId':$scope.homePage.doctorId,
                        //doctorName :$scope.homePage.name,
                        title: $scope.formData.title,
                        copyPath: $scope.fontImgUrl,
                        isShowImg: isShowImg,
                        content: html
                    }
                }
                $http({
                    url: app.url.science_ad.createDocument,
                    method: 'post',
                    "data":$scope.docParam
                }).success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', '', '保存成功,3秒钟后返回患者广告条列表');
                        setTimeout(function() {
                            $state.go('app.document.patient_ad', {}, {
                                reload: true
                            });
                        }, 3000);
                    } else {
                        $scope.isSaved = false;
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.isSaved = false;
                    toaster.pop('error', '', data.resultMsg);
                });
            }

        };

        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var html = um.getContent();
            if (html.length <= 0) {
                toaster.pop('warn', '', '请填写正文');
                return;
            }
            // var isShowImg = $scope.formData.isShowImg == false ? 0 : 1;
            var isShowImg = '0';
            var articlePreview = {
                authorName: '玄关健康中心',
                title: $scope.formData.title,
                copyPath: $scope.fontImgUrl,
                content: html,
                isShow: isShowImg,
                date: Date.now()
            };

            var modalInstance = $modal.open({
                templateUrl: 'previewModalContent.html',
                controller: 'previewModalInstanceCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function() {
                        return articlePreview;
                    }
                }
            });

        };
        //集团主页、医生主页-------------------------------------------------------
        // $scope.jituan_yisheng ='1';
        // $scope.homes=true;
        // $scope.deletehome=false;
        // $scope.states =[];
        // $scope.works="集团主页";
        // $scope.save =true;//验证后面的保存
        // $scope.placeholder="请输入集团主页";
        // //监听输入框值的变化
        // $scope.$watch('homePage', function(newValue, oldValue) {
        //     if(newValue !=oldValue){
        //         $scope.states =[];
        //     }
        // });
        // //监听下拉框值
        // $scope.$watch('jituan_yisheng', function(newValue, oldValue) {
        //     if (newValue == 1) {
        //         $scope.placeholder="请输入集团主页";
        //         $scope.statesJ =[];
        //     }else if(newValue == 2){
        //         $scope.statesY =[];
        //         $scope.placeholder="请输入医生主页";
        //     }else{
        //         $scope.states =$scope.statesJ;
        //         $scope.placeholder="请输入集团主页";
        //     }
        //
        // });
        // //监听radio值
        // $scope.radioState =0;
        // $scope.$watch('radioState', function(newValue, oldValue) {
        //     if (newValue == true) {
        //         $scope.radioState =1;
        //     }else if(newValue == false){
        //         $scope.radioState =0;
        //     }else{}
        //
        // });
        // //清楚主页输入框信息
        // //$scope.cleanInput=function(){
        // //    $scope.homePage ='';
        // //}
        // //搜索按钮事件
        // $scope.homeSearch=function(){
        //     if( $scope.jituan_yisheng ==1 && $scope.homePage !=''){
        //         //获取集团信息
        //         $scope.statesJ=[];
        //         $http({
        //             url: app.url.group.searchByKeywords,
        //             method: 'post',
        //             data: {
        //                 access_token: app.url.access_token,
        //                 keyword:$scope.homePage,
        //                 type:1
        //             }
        //         }).then(function(response) {
        //             for(var i=0;i<response.data.data.length;i++){
        //                 $scope.statesJ.push({"name":response.data.data[i].name,"id":response.data.data[i].id});
        //             }
        //             $scope.states = $scope.statesJ;
        //         });
        //     }else if( $scope.jituan_yisheng ==2 && $scope.homePage !=''){
        //         //获取医生信息
        //         $scope.statesY=[];
        //         $http({
        //             url: app.url.group.searchByKeywords,
        //             method: 'post',
        //             data: {
        //                 access_token: app.url.access_token,
        //                 keyword:$scope.homePage,
        //                 type:2
        //             }
        //         }).then(function(response) {
        //             for(var i=0;i<response.data.data.length;i++){
        //                 $scope.statesY.push({"name":response.data.data[i].name,"id":response.data.data[i].id});
        //             }
        //             $scope.states = $scope.statesY;
        //         });
        //     }else{}
        // }
        // $scope.changes=function(){
        //     $scope.save =false;//验证后面的保存
        // }
        // //选择值
        // $scope.changeValue=function(name,id){
        //     $scope.homePage =name;//集团、医生name
        //     $scope.id =id; //集团、医生id
        //     $scope.homes =false; //输入框隐藏
        //     $scope.deletehome=true; //删除按钮出现
        //     $scope.save =true;//验证后面的保存
        // }
        // //鼠标悬浮增加样式
        // $scope.bgColor=function(index){
        //     $('.homePupUl').find('li').css({'background-color' :''})
        //     $('.homePupUl').find('li').eq(index).css({'background-color' :'#ccc'})
        // }
        // //删除按钮事件
        // $scope.deleteHome=function(size){
        //     modal.confirm(null,'确定是否删除？',function(){
        //         $scope.$apply(function(){
        //             $scope.deletehome=false;
        //             $scope.homes=true;
        //             $scope.homePage='';
        //             $scope.save =false;
        //             $scope.states=[];
        //         })
        //
        //     },function(){
        //         $log.log("取消删除");
        //     })
        // }
    }]);


    app.controller('previewModalInstanceCtrl', ['$scope', '$modalInstance', 'article', '$sce',function($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);


})();
