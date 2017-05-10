'use strict';
(function() {

    //品种库管理
    angular.module('app').controller('VarietyManageListCtrl', VarietyManageListCtrl);
    VarietyManageListCtrl.$inject = ['$rootScope', '$scope', '$modal', '$http', '$state', 'utils', 'Upload', 'toaster', '$location', '$stateParams'];

    function VarietyManageListCtrl($rootScope, $scope, $modal, $http, $state, utils, Upload, toaster, $location, $stateParams) {
        //初始化参数
        var access_token = app.url.access_token,
            drugCompanyParam = '';
        //先加载百度富文本需要的js
        $.getScript("../components/ngUmeditor/umeditor/umeditor.min.js", function() {
            $.getScript('../components/ngUmeditor/umeditor/umeditor.config.js', function() {

            })
        });
        //初始化翻页数据
        $scope.pageSize = 10;
        var pi = utils.localData('varietyManagePageIndex');
        var kw = utils.localData('varietyManageKeyWord');
        $scope.pageIndex = !pi ? 1 : pi;
        $scope.keyWord = kw;

        //初始化药企列表
        $scope.InitTable = function(pageIndex, pageSize, startDate, endDate, keyWord) {
            var startDate = Date.parse(new Date(startDate));
            var endDate = Date.parse(new Date(endDate));
            $scope.pageIndex = pageIndex + 1;
            utils.localData('varietyManagePageIndex', $scope.pageIndex);
            $http.post(app.url.VartMan.getGoodsGroupList, {
                access_token: app.url.access_token,
                keyword: keyWord,
                startTime: startDate || '',
                endTime: ((endDate / 1000) + (24 * 60 * 60)) * 1000 || '',
                pageSize: pageSize,
                pageIndex: pageIndex
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.data = data.data;
                }
            }).error(function(e) {
                console.log(e)
            })
        };
        $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);

        // 保存keyword的值
        $scope.keyWordKeep = function(keyWord) {
            keyWord === '' && !(keyWord = null);
            utils.localData('varietyManageKeyWord', keyWord);
        }

        // 跳转到其他页面清空对应的本地存储
        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                if (toState.name.indexOf('VarietyManage') == -1 || toState.name.indexOf('VarietyManage.check') > -1) {
                    utils.localData('varietyManagePageIndex', null);
                    utils.localData('varietyManageKeyWord', null);
                }
            }
        );
        //导入品种成功后，页面自动刷新
        $rootScope.$on('someEvent', function(event, data) {
            // $state.reload();
            $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);
        });

        //翻页
        $scope.pageChanged = function() {
            // pagination分页bug， 当初始pageIndex大于1时会默认执行pageChanged并将pageIndex置为1。
            // 当初始pageIndex大于1，通过pi获取的store值将index赋值期望的值后，务必将pi赋值0，以保证分页正确切换。
            if (pi !== null && pi != 1) {
                $scope.pageIndex = pi;
                pi = null;
            }
            utils.localData('varietyManagePageIndex', $scope.pageIndex);
            // $location.search({pi : $scope.pageIndex});
            $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);
        };

        $scope.ShowVartInfoDetails = function(item) {
            if (!item.id) {
                return;
            }
            if (item.isOpen) {
                item.isOpen = false;
                return;
            }

            if (item.VartInfo) {
                if (item.VartInfo.length == 0) {
                    item.isOpen = true;
                    return
                }
            }
            $http.post(app.url.VartMan.getGoodsListByGroupId, {
                access_token: app.url.access_token,
                keyword: '',
                groupId: item.id,
                source: 0
            }).success(function(data) {
                if (data.resultCode == 1) {
                    $scope.isAll = 3;
                    item.VartInfo = data.data;
                    item.isOpen = true;
                    $scope.allOpen = 0;
                }
            }).error(function(e) {
                console.log(e)
            });
            $scope.isAllOpen = false;
        };




        //批量导入品种
        $scope.upLoadFiles = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalUploadFiles.html',
                controller: 'ModalUploadFilesCtrl',
                size: '',
                resolve: {
                    items: function() {
                        return $scope.items;
                    },
                    Upload: Upload
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.companyId = selectedItem;
                if (selectedItem == 'true') {
                    $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);
                }
                $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);
            }, function() {
                $scope.InitTable($scope.pageIndex - 1, $scope.pageSize, $scope.startDate, $scope.endDate, $scope.keyWord);
            });


        };


    };

    angular.module('app').filter('cut', cut);

    function cut() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf('');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    };
    angular.module('app').controller('ModalUploadFilesCtrl', ModalUploadFilesCtrl);
    ModalUploadFilesCtrl.$inject = ['$scope', '$modalInstance', '$rootScope', '$modal', 'utils', 'toaster', '$http', 'items', '$state', 'Upload'];

    function ModalUploadFilesCtrl($scope, $modalInstance, $rootScope, $modal, utils, toaster, $http, items, $state, Upload) {
        $scope.selected = {
            item: $scope.companyList
        };
        $scope.isLoadError = false;
        //图片上传
        $scope.$watch('excleFile', function(files) {
            goUpload(files);
        });


        //这边是多文件上传
        function goUpload(files) {
            if (files != null) {
                var isAllow = false;
                var fileTypes = ['xls', 'xlsx'];
                fileTypes.forEach(function(item, index, array) {
                    if (files.name.split('.').slice(-1)[0] == item) {
                        isAllow = true;
                    }
                });
                if (!isAllow) {
                    toaster.pop('error', null, '文件类型不支持');
                    return;
                } else {
                    upload(files);
                }

            }
        }

        function upload(file) {
            $scope.isLoadError = false;
            $scope.isUploadingBreedFile = true;
            file.upload = Upload.upload({
                url: app.url.VartMan.batchImportGoodsList + '?access_token=' + app.url.access_token,
                file: file,
                fields: {
                    path: 'care'
                }
            });
            file.upload.success(function(response) {
                if (response.resultCode == 1) {
                    toaster.pop('success', null, response.resultMsg);
                    $modalInstance.close('true');
                    $rootScope.$emit('someEvent', 1);

                } else if (response.resultCode == 0) {
                    $scope.isLoadError = true;
                    $scope.errorNum = response.data;
                    $scope.errorList = response.data.errorList;

                } else {
                    toaster.pop('info', null, response.resultMsg);
                    $modalInstance.close('cancel');
                }
                $scope.isUploadingBreedFile = false;
                //$state.reload();
            });
            file.upload.error(function(response) {
                toaster.pop('error', null, response);
            });
            // $scope.modalCancel('cancel');
        }



        //导入品种图片
        $scope.openUploadImagesModal = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalUploadImagesFiles.html',
                controller: 'ModalUploadImagesFilesCtrl',
                size: 'lg'
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.modalOk = function() {

            $modalInstance.close($scope.selected.item);

        };

        $scope.modalCancel = function() {
            $modalInstance.close('cancel');
        };
    };
    angular.module('app').controller('ModalUploadImagesFilesCtrl', ModalUploadImagesFilesCtrl);
    ModalUploadImagesFilesCtrl.$inject = ['$scope', '$modalInstance', 'toaster', '$http', '$state'];

    function ModalUploadImagesFilesCtrl($scope, $modalInstance, toaster, $http, $state) {
        $scope.autoStart = 'false';
        // 配置七牛
        (function funSetQiniu() {

            // 七牛上传文件过滤
            $scope.qiniuFilters = {
                mime_types: [ //只允许上传图片和zip文件
                    {
                        title: "Image files",
                        extensions: "jpg,png,bmp,jpeg"
                    }
                ]
            };


            // 设置七牛上传获取uptoken的参数
            $scope.token = app.url.access_token;
            $scope.imageLists = [];
            $scope.fileList = [];

            $scope.uploadedImageLists = [];
            $scope.imageCount = 0; //初始化图片数量，做上传进度。
            $scope.isImagesUpLoading = false; //是否正在上传图片中。。true:是，false：否
            $scope.isImageUploaded = {};
            $scope.repeatImagesNum = {};
            $scope.isFirst = true;
            $scope.hideUploadBtn = false;
            //共添加了多少张图片
            $scope.countOfMatchImages = $scope.fileList.length;

            $scope.removeAllImage = function() {
                    $scope.fileList = [];
                    $scope.countOfMatchImages = 0;
                    $scope.isImageUploaded = {};
                }
                // 选择文件后回调
            $scope.uploaderAdded = function(up, files) {
                 $scope.countOfMatchImages = $scope.fileList.length;
                $scope.hideUploadBtn = false;

                var listLength = $scope.fileList.length - 1;
                $scope.countOfImagesUploaded = 0;
                var temp = $scope.fileList.length - files.length - 1;
                for (var i = 0; i < $scope.fileList.length; i++) {
                    if ($scope.fileList[i].size > 1024 * 1024 * 2) {
                        $scope.fileList.splice(i, 1);
                        toaster.pop('error', null, '上传的图片大小不允许超过2M!');
                    }
                    if (temp >= 0) {
                        if (i > temp) {
                            if (!$scope.isImageUploaded[$scope.fileList[i].name]) {
                                $scope.isImageUploaded[$scope.fileList[i].name] = $scope.fileList[i].name;
                                $scope.fileList[i].isRepeat = 1;
                            } else {
                                $scope.fileList[i].isRepeat = 2;

                            }
                        }

                    } else {
                        $scope.isImageUploaded[$scope.fileList[i].name] = $scope.fileList[i].name;
                        $scope.fileList[i].isRepeat = 1;
                    }

                }
                if (temp == 0 && $scope.fileList.length == 2) {
                    if ($scope.fileList[0].name == $scope.fileList[1].name) {
                        $scope.fileList.splice(1, 1);
                        $scope.countOfMatchImages--;

                    }
                }
                //删除重复的图片isRepeat=2表示重复
                for (var i = 0; i < $scope.fileList.length; i++) {
                    if ($scope.fileList[i].isRepeat == 2) {
                        $scope.fileList.splice(i, 1);
                        i--;
                         $scope.countOfMatchImages--;

                    }

                }

                if ($scope.fileList.length > 50) {
                    toaster.pop('error', null, '一次导入最多允许选择50张图片！');
                    $scope.$apply(function() {
                        $scope.fileList.splice(50, $scope.fileList.length - 50);

                    });
                }


                $scope.isImagesUpLoading = false;

                funInitImage(files, getGoodsTitleByDrugFormCodes);
            };

            //处理图选中后的图片，转化为base64   
            function funInitImage(files, callback) {
                plupload.each(files, function(file) {

                    // 预览 图片
                    (function() {
                        previewImage(file, function(imgsrc) {
                            $scope.$apply(function() {
                                $scope.imageLists.push(imgsrc); //保存图片base64地址，然后预览

                            })
                        })
                    })();

                    function previewImage(file, callback) { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                        if (!file || !/image\//.test(file.type)) return; //确保文件是图片

                        var fileData = [];
                        fileData[0] = file.name.split(".")[0];
                        file.drugFormCode = file.name.split(".")[0];
                        // file.isBreedMatch = file.name;//匹配结果

                        if (file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                            var fr = new mOxie.FileReader();
                            fr.onload = function() {

                                fileData[1] = fr.result;
                                file.imageLocalurl = fr.result;
                                callback(fileData);
                                fr.destroy();
                                fr = null;
                            };
                            fr.readAsDataURL(file.getSource());
                        } else {
                            var preloader = new mOxie.Image();
                            preloader.onload = function() {
                                preloader.downsize(300, 300); //先压缩一下要预览的图片,宽300，高300
                                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                                fileData[1] = imgsrc;
                                file.imageLocalurl = imgsrc;

                                callback && callback(fileData); //callback传入的参数为预览图片的url
                                preloader.destroy();
                                preloader = null;
                            };
                            preloader.load(file.getSource());
                        }
                    }
                });
                callback && callback();
            }

            $scope.countOfImagesUploaded = 0;
            //匹配图片是否有对应的品种信息方法体
            function getGoodsTitleByDrugFormCodes() {
                var drugFormCodesJson = [];
                for (var i = 0, length = $scope.fileList.length; i < length; i++) {
                    drugFormCodesJson.push($scope.fileList[i].drugFormCode);
                }
                $http.post(app.url.drug.getGoodsTitleByDrugFormCodes, {
                    access_token: app.url.access_token,
                    drugFormCodes: drugFormCodesJson
                }).success(function(data) {
                    for (var i = 0, length = $scope.fileList.length; i < length; i++) {
                        if (data.data[i]) {
                            if ($scope.fileList[i].isBreedMatch == '上传成功') {
                                $scope.fileList[i].isBreedMatch = '上传成功';
                            } else {
                                $scope.fileList[i].isBreedMatch = data.data[i];


                            }

                        } else {
                            $scope.fileList[i].isBreedMatch = false;
                        }
                    }
                });
            }

            // 每个文件上传成功回调
            $scope.uploaderSuccess = function(up, file, info) {

                $scope.isImagesUpLoading = true;
                var fileInfo = {};
                fileInfo.drugFormCode = file.name.split(".")[0];
                fileInfo.imageUrl = file.url;
                $scope.uploadedImageLists = [];
                $scope.uploadedImageLists.push(fileInfo)

                //图片数量超过50张时，禁止继续上传更新；
                if ($scope.imageCount >= 50) {
                    return;
                }
                var thisImagesListsJson = JSON.stringify($scope.uploadedImageLists);
                $http.post(app.url.drug.batchImportGoodsPics, {
                    access_token: app.url.access_token,
                    replaceOldPic: $scope.isOverWrite == true ? 1 : 0,
                    drugFormCodePicJson: thisImagesListsJson
                }).success(function(data) {
                    if (data.data.statusList[0].status == 0) {
                        file.isBreedMatch = '上传成功';
                        $scope.countOfImagesUploaded++;
                        $scope.imageCount++;
                    }


                });

            };
            $scope.removeImage = function(index) {
                if ($scope.fileList[index].isRepeat == 1) {
                    delete $scope.isImageUploaded[$scope.fileList[index].name]
                }
                $scope.fileList.splice(index, 1);
                $scope.imageCount--;
                 $scope.countOfMatchImages--;

            }

            // 每个文件上传失败后回调
            $scope.uploaderError = function(up, err, errTip) {
                // console.error(up, err, errTip);
                toaster.pop('error', null, errTip);
            };
            // 上传全部上传后回调
            $scope.uploaderComplete = function() {
                $scope.countOfMatchImages = $scope.fileList.length;
                if ($scope.fileList.length > 0) {
                    toaster.pop('success', null, '图片导入完成');

                }
                $scope.hideUploadBtn = false;

                // $modalInstance.close('cancel');
            };
            //  每个文件上传前回调
            $scope.uploaderBefore = function(up, file) {
                $scope.upLoadedFinished = false;
                $scope.hideUploadBtn = true;
            };
        })();


        $scope.modalCancel = function() {
            $modalInstance.close('cancel');
        };
    };

})();
