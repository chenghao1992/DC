'use strict';
(function () {
    app.controller('checkbanderlist', ['$rootScope', '$scope', '$http', 'utils', '$state', 'toaster', '$stateParams','$modal',
        function($rootScope, $scope, $http,utils, $state, toaster, $stateParams,$modal) {
            $scope.page = {
                size: 10,
                index: 1
            };
            $scope.activeTab = [true,false];
            $scope.byBannerCheck=function (e) {
                $scope.datalist=[];
                var pream= e==0 ? {
                    access_token: app.url.access_token,
                    show:'1',
                    delete:'1',
                    pageIndex:0,
                    pageSize:9999
                }:{
                    access_token: app.url.access_token,
                    show:'0',
                    delete:'1',
                    pageIndex:$scope.page.index -1,
                    pageSize:$scope.page.size
                }
                $http.post(app.url.community.bannerList,pream).success(function (data) {
                    if(data.resultCode==1){
                        $scope.datalist=data.data.pageData;
                        e != 0 && !($scope.bannerTotal = data.data.total);
                        //$scope.bannerTotal=data.data.total;
                    }else {
                        toaster.pop('danger',null,data.resultMsg);
                    }
                })
            };
            $scope.funPageSizeChange=function () {
                $scope.page.index=1;
                $scope.byBannerCheck(1);
            };
            $scope.funPageindex=function(){
                $scope.byBannerCheck(1);
            };
            $scope.stopBanner=function (id,type,dataListLenth) {
                if(dataListLenth==1){
                    toaster.pop('danger',null,'至少保留一条');
                    return ;
                }
                if(type==0) {
                    var prem = {
                        access_token: app.url.access_token,
                        id: id,
                        show: 0
                    };
                }else {
                    var prem = {
                        access_token: app.url.access_token,
                        id: id,
                        show: 1
                    };
                };
                $http.post(app.url.community.stopBanner,prem).success(function (data) {
                    if(data.resultCode==1){
                        var msg = type == 0 ? '停用banner成功！' : '启用Banner成功！';
                        var tabType = $scope.activeTab[0] == true ? 0 : 1;
                        toaster.pop('success',null,msg);
                        $scope.byBannerCheck(tabType);

                    }else{
                        toaster.pop('danger',null,data.resultMsg);
                    }
                })
            };
            $scope.upbanner=function(id){
                if(id){
                    var prem={
                        access_token: app.url.access_token,
                        id:id
                    };
                    $http.post(app.url.community.upBanner,prem).success(function (data) {
                        if(data.resultCode==1){
                            toaster.pop('success',null,'上移成功');
                            $scope.byBannerCheck(0);
                        }else {
                            toaster.pop('danger',null,data.resultMsg);
                        }
                    })
                }
            }
            //删除
            $scope.deletedisea = function(item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'deletebanner.html',
                    controller: 'ModaldeleteCtrl',
                    size: 'sm',
                    resolve: {
                        items: function() {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    if(data){
                        $scope.byBannerCheck(1);
                    }
                });

            };
            //预览banner
            $scope.checkdataBanner=function(id){
                //先查询banner详情
                $http.post(app.url.community.querybanner, {
                    access_token: app.url.access_token,
                    id: id
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        var articlePreview = {
                            authorName: '玄关健康中心',
                            title: data.data.title,
                            copyPath: data.data.imgUrl,
                            content: data.data.content,
                            isShow: '0',
                            date: data.data.createTime
                        };
                        var modalInstance = $modal.open({
                            templateUrl: 'bannerModalContent.html',
                            controller: 'bannerModalCtrl',
                            windowClass: 'docPreModal',
                            resolve: {
                                article: function() {
                                    return articlePreview;
                                }
                            }
                        });
                        modalInstance.result.then(function(items) {
                            console.log('关闭');
                        })
                    }
                    else {
                        toaster.pop('error', '', data.resultMsg);
                    }
                }).
                error(function (data, status, headers, config) {
                    toaster.pop('error', '', '服务器繁忙请，稍后再试！');
                });
            }
            //上传banner
            $scope.updataBanner=function (item,itemTime) {
                var modalInstance=$modal.open({
                    animation:true,
                    templateUrl:'updatabannerlContent.html',
                    controller:'BannerditCtrl',
                    size:'lg',
                    backdrop:'static',
                    resolve:{
                        items:function () {
                            return item;
                        },
                        iTime:function(){
                            return itemTime;
                        }
                    }
                });
                modalInstance.result.then(function(items) {
                    if(items==1){
                        var tabType = $scope.activeTab[0] == true ? 0 : 1;
                        $scope.byBannerCheck(tabType);
                    }else{
                        $scope.activeTab[1]=true;
                        $scope.byBannerCheck(1);
                    }


                })
            };
        }
    ]);
    app.controller('ModaldeleteCtrl',['$scope', '$uibModal', '$http', 'items', '$uibModalInstance', 'oaster',function ($scope, $uibModal, $http, items, $uibModalInstance, toaster) {
        $scope.modalOk=function () {
            if(items){
                var prem={
                    access_token: app.url.access_token,
                    id:items
                };
                $http.post(app.url.community.deletebanner,prem).success(function (data) {
                    if(data.resultCode==1){
                        toaster.pop('danger',null,'删除成功');
                        $uibModalInstance.close(data);
                    }else {
                        toaster.pop('danger',null,data.resultMsg);
                    }
                });
            }
        };
        $scope.modalCancel=function () {
            $uibModalInstance.dismiss('data');
        }
    }]);
    app.controller('BannerditCtrl',['$scope','$modal', '$http', 'items', '$uibModalInstance', 'toaster','iTime',function ($scope,$modal, $http, items, $uibModalInstance, toaster,iTime) {
        $scope.titleLength = 0;
        $scope.formData = {};
        $scope.formData.keywords = [];
        $scope.fontImgUrl = null;
        $scope.isSaved = false;
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
                    qiniuDomain: rep.data.domain,
                    maximumWords:10000
                });
                if(items){
                    initEdit();
                }
            } else {
                console.error(rep);
            }
        });
        $scope.$on('$destroy', function() {
            um.destroy();
        });
        //获取文字的长度
        // var getByteLen = function(val) {
        //     var len = 0;
        //     for (var i = 0; i < val.length; i++) {
        //         if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
        //             len += 2;
        //         else
        //             len += 1;
        //     };
        //     return len;
        // };
        //编辑banner先查询banner
        function initEdit() {
            if (items) {
                isEdit = true;
                $http.post(app.url.community.querybanner, {
                    access_token: app.url.access_token,
                    id: items
                }).
                success(function (data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.formData = {
                            title: data.data.title
                        };
                        $scope.fontImgUrl = data.data.imgUrl;
                        articleId = data.data.id;
                        um.setContent(data.data.content);
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
                    var totalLen = 0;
                    var cutTitle = "";
                    for (var j = 0; j < $scope.formData.title.length; j++) {
                        if (totalLen >= 80) {
                            break;
                        } else {
                            totalLen += $scope.formData.title[j];
                            if( totalLen==81 ){
                                break;
                            }
                            cutTitle += $scope.formData.title[j];
                        }
                    }
                    $scope.titleLength = $scope.formData.title;
                    $scope.formData.title = cutTitle;
                    $scope.titleLength = $scope.formData.title.length;
                } else {
                    $scope.titleLength = 0;
                }
            }
        });
        // $scope.$watch('formData.summary', function(newValue, oldValue) {
        //     if (newValue != oldValue) {
        //         if ($scope.formData.summary) {
        //             var totalLen = 0;
        //             var cutSummary = "";
        //             for (var j = 0; j < $scope.formData.summary.length; j++) {
        //                 if (totalLen >= 80) {
        //                     break;
        //                 } else {
        //                     totalLen += getByteLen($scope.formData.summary[j]);
        //                     cutSummary += $scope.formData.summary[j];
        //                 }
        //             }
        //             $scope.summaryLength = getByteLen($scope.formData.summary);
        //             $scope.formData.summary = cutSummary;
        //         } else {
        //             $scope.summaryLength = 0;
        //         }
        //     }
        //
        //
        // });
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
            if(items){toaster.pop('success', null, 'Banner修改图片成功！');}else{toaster.pop('success', null, 'Banner上传图片成功！')}
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
        //保存banner
        $scope.saveDoc = function() {
            if (!$scope.formData.title) {
                toaster.pop('error', null, '请填写标题');
                return ;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('error', null, '请上传banner图');
                return ;
            }
            var html = um.getContent();

            var contentText= um.getContentTxt();
            if (html.length <= 0) {
                toaster.pop('error', null, '请填写正文');
                return ;
            }
            if(contentText.length>10000){
                toaster.pop('error', null, '正文字数超过10000');
                return ;
            }
            if(items){
                $http.post(app.url.community.editBanner,{
                    access_token:app.url.access_token,
                    title:$scope.formData.title,
                    imgUrl:$scope.fontImgUrl,
                    content:html,
                    id:items
                }).success(function (data) {
                    if(data.resultCode==1){
                        toaster.pop('success',null,'更新成功');
                        $uibModalInstance.close('1');
                    }else {
                        toaster.pop('danger',null,'服务器问题');
                    }
                })
            }else {
                $http.post(app.url.community.updataBanner,{
                    access_token:app.url.access_token,
                    title:$scope.formData.title,
                    imgUrl:$scope.fontImgUrl,
                    content:html
                }).success(function (data) {
                    if(data.resultCode==1){
                        toaster.pop('success',null,'上传成功');
                        $uibModalInstance.close('2');
                    }else {
                        toaster.pop('danger',null,'服务器问题');
                    }
                })
            }
        };
        //取消
        $scope.bannerCancel=function () {
            $uibModalInstance.dismiss('data');
        };
        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.formData.title) {
                toaster.pop('error', null, '请填写标题');
                return ;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('error', null, '请上传banner图');
                return ;
            }
            var html = um.getContent();

            var contentText= um.getContentTxt();
            if (html.length <= 0) {
                toaster.pop('error', null, '请填写正文');
                return ;
            }

            if(contentText.length>10000){
                toaster.pop('error', null, '正文字数超过10000');
                return ;
            }
            var isShowImg = '0';
            var articlePreview = {
                authorName: '玄关健康中心',
                title: $scope.formData.title,
                copyPath: $scope.fontImgUrl,
                content: html,
                isShow: isShowImg,
                date: iTime
            };
            var modalInstance = $modal.open({
                templateUrl: 'bannerModalContent.html',
                controller: 'bannerModalCtrl',
                windowClass: 'docPreModal',
                resolve: {
                    article: function() {
                        return articlePreview;
                    }
                }
            });
        };

    }]);
    app.controller('bannerModalCtrl',['$scope', '$modalInstance', 'article', '$sce',function ($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);
})();
