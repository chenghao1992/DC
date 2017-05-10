/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('doctorKnowledgeAddCtrl', funDoctorKnowledgeAddCtrl);

    funDoctorKnowledgeAddCtrl.$inject = ['$scope', '$http', '$state', 'toaster', 'utils', '$stateParams', '$modal'];

    function funDoctorKnowledgeAddCtrl($scope, $http, $state, toaster, utils, $stateParams, $modal) {
        var curGroupId = localStorage.getItem('curGroupId');
        var userId = localStorage.getItem('user_id');
        var authorDate = {};
        var um = null;
        $scope.titleLength = $scope.title;

        $scope.isGroup = false;
        $scope.isShow = false;
        $scope.$on('$destroy', function() {
            um.destroy();
        });

        $scope.isPersonKnowledge=$stateParams.isPersonKnowledge=='true'?true:false;
        //设置莫认分类
        (function() {
            //调用添加就医知识接口    
            $http.post(app.url.knowledge.getCategoryList, {
                access_token: app.url.access_token,
                groupId: curGroupId
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    $scope.selectedType = data.data[data.data.length - 1];

                }
            }).
            error(function(data) {
                toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });
        })();

        //获取七牛上传token和domain
        (function() {
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


                } else {
                    console.error(rep);
                }
            });
        })();
        //添加就医知识
        $scope.saveKnowledge = function() {
                //参数校对

                var html = um.getContent();
                //标题个数不能超过64个字
                if (!$scope.title) {
                    toaster.pop('warn', '', '请填写标题');
                    return;
                }
                if (!$scope.selectedType) {
                    toaster.pop('info', null, '请选择分类');
                    return;
                }
                if (!$scope.fontImgUrl) {
                    toaster.pop('info', null, '请上传题图');
                    return;
                }
                if (!html) {
                    toaster.pop('warn', null, "请填写正文");
                    return;
                }
                // if(!$scope.summary){
                //     toaster.pop('info', null, '请选择摘要');
                //     return;
                // }
                //createrType=2?creater=集团id createrType=3?creater=当前用户id
                if ($scope.createrType == 2) {
                    $scope.creater = curGroupId;
                } else if ($scope.createrType == 3) {
                    $scope.creater = curGroupId;
                }
                //console.log($scope.selectedAuthorId);
                //调用添加就医知识接口    
                $http.post(app.url.knowledge.addKnowledge, {
                    access_token: app.url.access_token,
                    title: $scope.title || '',
                    isShow: $scope.isShow ? 1 : 0,
                    copy: $scope.fontImgUrl || '',
                    author: userId,
                    authorName: $scope.selectedAuthorName || '',
                    categoryId: $scope.selectedType.id || '',
                    description: $scope.summary || '',
                    content: html || '',
                    createrType: 3 || '',
                    creater: userId || ''
                }).
                success(function(data) {
                    if (data.resultCode == 1) {
                        toaster.pop('success', null, "添加就医知识成功");
                        $state.go('app.doctorKnowledge.list', {isPersonKnowledge:true}, { reload: true });

                    } else {
                        toaster.pop('error', null, data.resultMsg);
                    }
                }).
                error(function(data) {
                    toaster.pop('error', null, data.resultMsg);
                    // alert(data.resultMsg);
                });
            }
            //选择分类
        $scope.chooseType = function() {
            var diseaseModal = new DataBox('data_res', {
                hasCheck: false,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: false,
                self: false,
                cover: false,
                leafDepth: 1,
                selectView: false,
                search: {
                    //url: '',
                    //param: {},
                    // searchDepth: [1],
                    dataKey: {
                        name: 'name',
                        id: 'id',
                        union: 'parentId',
                        dataSet: 'data'
                    },
                    //keyName: 'keyword',
                    unwind: false
                },
                arrType: [0, 0],
                data: {
                    url: app.url.knowledge.getCategoryList + '?access_token=' + app.url.access_token + '&&groupId=' + curGroupId
                },
                titles: {
                    main: '选择分类',
                    searchKey: '搜索分类...',
                    label: '已选择分类'
                },
                fixdata: [],
                icons: {
                    arrow: 'fa fa-caret-right/fa fa-caret-down',
                    check: 'fa fa-check/fa fa-square',
                    root: 'fa fa-hospital-o cfblue',
                    branch: 'fa fa-h-square cfblue',
                    leaf: 'fa fa-stethoscope dcolor',
                    head: 'headPicFileName'
                },
                response: diseaseSelected,
                datakey: {
                    id: 'id',
                    name: 'name',
                    sub: 'children'
                },
                info: {
                    name: 'name',
                    id: 'id',
                    leaf: 'leaf',
                    pid: 'parentId',
                }
            });
        };

        function diseaseSelected(dt) {
            $scope.selectedType = dt[0];
            $scope.$apply($scope.selectedType);
        }
        //选择作者
        $scope.chooseAuthor = function() {
            var authorModal = new DataBox('data_res', {
                hasCheck: true,
                allCheck: true,
                leafCheck: true,
                multiple: false,
                allHaveArr: true,
                arrType: [1, 0],
                data: {
                    url: app.url.yiliao.getAllData,
                    param: {
                        access_token: app.url.access_token,
                        groupId: curGroupId
                    }
                },
                search: {
                    url: app.url.yiliao.searchDoctorByKeyWord,
                    param: {
                        access_token: app.url.access_token,
                        groupId: curGroupId,
                        keyword: 'name',
                        pageSize: 10000,
                        pageIndex: 0
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
                async: {
                    url: app.url.yiliao.getDepartmentDoctor,
                    dataKey: {
                        departmentId: 'id'
                    },
                    data: {
                        access_token: app.url.access_token,
                        groupId: curGroupId,
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
                extra: [{
                    name: '未分配',
                    id: 'idx_0',
                    parentId: 0,
                    subList: [],
                    url: app.url.yiliao.getUndistributed,
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
                        groupId: curGroupId,
                        pageIndex: 0,
                        pageSize: 10000
                    },
                    icon: 'fa fa-bookmark'
                }],
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
                    name: utils.localData('curGroupName'),
                    id: 'undefined'
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
                    dpt: 'departments',
                    description: 'description',
                    param: 'param',
                    icon: 'icon',
                    url: 'url',
                    isExtra: 'isExtra',
                    target: 'target'
                },
                response: authorSelected
            });
        };

        function authorSelected(dt) {
            if (dt.length > 0) {
                authorDate = dt[0];
                $scope.selectedAuthorId = authorDate.id;
                $scope.selectedAuthorName = authorDate.name;

                $scope.isGroup = false;
                $scope.$apply($scope.selectedAuthor);
                $scope.$apply($scope.isGroup);
                console.log($scope.selectedAuthorId)
            }

        }
        //判断作者者是否使用集团名
        $scope.switchAuthor = function() {
                // body...
                $scope.isGroup = !$scope.isGroup;
            }
            //判断封面图片是否显示在正文
        $scope.switchIsShow = function() {
            // body...
            $scope.isShow = !$scope.isShow;
        }


        //选择病种标签
        $scope.chooseDisease = function() {
            var tagsModal = new DataBox('data_res', {
                hasCheck: true,
                allCheck: true,
                leafCheck: true,
                multiple: true,
                allHaveArr: false,
                self: false,
                cover: false,
                leafDepth: 3,
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
                arrType: [0, 0],
                data: {
                    url: app.url.document.getDiseaseTree + '?access_token=' + app.url.access_token
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
                fixdata: $scope.keywords,
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
        };

        function tagsSelected(dt) {
            $scope.keywords = dt;
            $scope.$apply($scope.keywords);
        }
        $scope.removeItem = function(item) {
            var index = $scope.keywords.indexOf(item);
            $scope.keywords.splice(index, 1);
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

        //选择文件上传
        $scope.selectFile = function() {
            $scope.upload();
        };

        // 设置七牛上传获取uptoken的参数
        $scope.token = app.url.access_token;
        // 选择文件后回调
        $scope.uploaderAdded = function(up, files) {
            $scope.uploadPercent = 0;
            // console.log(up,files);
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
        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var isShow = $scope.isShow == false ? 0 : 1;
            var html = um.getContent();
            if (!html) {
                toaster.pop('warn', null, "请填写正文");
                return;
            }
            //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
            //var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
            var firstParagraph = um.getContentTxt().slice(0, 100);
            var articlePreview = {
                authorName: $scope.selectedAuthorName,
                title: $scope.title,
                isShow: isShow,
                copyPath: $scope.fontImgUrl,
                summary: $scope.summary ? $scope.summary : firstParagraph,
                content: html,
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
    }
})();

(function(){
    app.controller('previewModalInstanceCtrl',funcpreviewModalInstanceCtrl);
    funcpreviewModalInstanceCtrl.$inject=['$scope', '$modalInstance', 'article', '$sce'];
    function funcpreviewModalInstanceCtrl($scope, $modalInstance, article, $sce) {
        $scope.article = article;
        $scope.article.content = $sce.trustAsHtml($scope.article.content);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

})();

