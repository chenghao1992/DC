/**
 * Created by ChenLeepyng on 2016/7/25.
 */
'use strict';
(function() {
    angular.module('app').controller('groupKnowledgeEditCtrl', funGroupKnowledgeEditCtrl);

    funGroupKnowledgeEditCtrl.$inject = ['$scope', '$http', '$state', 'toaster', '$stateParams', 'Group', 'AppFactory', 'utils', '$modal'];

    function funGroupKnowledgeEditCtrl($scope, $http, $state, toaster, $stateParams, Group, AppFactory, utils, $modal) {


        var groupId = localStorage.getItem('curGroupId');
        var access_token = localStorage.getItem('access_token');
        var knowledgeId = $stateParams.id;
        $scope.isSearchByAllCategory = $stateParams.isSearchByAllCategory;
        $scope.isEditBeforeWidthcategoryId = $stateParams.categoryId;

        var isEdit = false;
        var articleId = null;
        var um = null;
        var groupName,
            authorDate = {};

        $scope.titleLength = 0;
        $scope.summaryLength = 0;
        $scope.formData = {};
        $scope.formData.keywords = [];
        $scope.formData.isShare = true;
        $scope.formData.isShow = true;
        $scope.fontImg = null;
        $scope.fontImgUrl = null;
        $scope.isSaved = false;
        $scope.isGroup = false;
        $scope.formData.selectedAuthor = {};
        $scope.$on('$destroy', function() {
            um.destroy();
        });
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
                    initEdit();
                } else {
                    console.error(rep);
                }
            })
        })();
        //更新文章
        $scope.updateKnowledge = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.formData.selectedAuthor) {
                toaster.pop('warn', '', '请选择作者');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }
            var html = um.getContent();
            if (!html) {
                toaster.pop('warn', null, "请填写正文");
                return;
            }
            //调用更新就医知识接口    
            $http.post(app.url.knowledge.updateKnowledge, {
                access_token: app.url.access_token,
                id: knowledgeId,
                groupId: groupId,
                title: $scope.formData.title,
                isShow: $scope.formData.isShow ? 1 : 0,
                copy: $scope.fontImgUrl,
                author: $scope.isGroup ? groupId : $scope.formData.selectedAuthor.id,
                authorName: $scope.formData.selectedAuthor.name,
                categoryId: $scope.formData.selectedType.id ? $scope.formData.selectedType.id : $stateParams.categoryId,
                sCategoryId: $stateParams.categoryId,
                description: $scope.formData.summary,
                content: html
            }).
            success(function(data) {
                if (data.resultCode == 1) {
                    toaster.pop('success', null, "更新就医知识成功");
                    $state.go('app.groupKnowledge.list');

                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).
            error(function(data) {
                //toaster.pop('error', null, data.resultMsg);
                // alert(data.resultMsg);
            });

        };



        // 作者默认为当前登录管理员的名称
        /*$scope.formData.selectedAuthor = {
            id:localStorage.getItem('user_id'),
            name:localStorage.getItem('user_name')
        };*/


        //编辑文章
        function initEdit() {
            if ($stateParams.id) {
                isEdit = true;
                $http.post(app.url.knowledge.getDetailById, {
                    access_token: app.url.access_token,
                    id: $stateParams.id,
                    categoryId: $stateParams.categoryId
                }).
                success(function(data, status, headers, config) {
                    if (data.resultCode == 1) {
                        $scope.formData = {
                            author: data.data.author,
                            summary: data.data.description,
                            title: data.data.title,
                            keywords: data.data.tag,

                        };

                        $scope.formData.selectedType = {
                            id: data.data.categoryId,
                            name: data.data.categoryName || ''
                        }
                        $scope.fontImgUrl = data.data.copy;

                        $scope.sCategoryId = data.data.categoryId;

                        $scope.copy_small = data.data.copy_small;
                        $scope.formData.isShow = data.data.isShow;
                        $scope.formData.isShare = data.data.isShare;
                        $scope.formData.selectedAuthor = {
                            id: data.data.author,
                            name: data.data.authorName
                        };
                        authorDate = {
                            id: data.data.author,
                            name: data.data.authorName
                        };
                        if (data.data.description.length == 100) {
                            $scope.formData.summary = data.data.description.substring(0, 94) + '......';
                        }
                        articleId = data.data.id;

                        um.setContent(data.data.content);
                        Group.handle(groupId, function(group) {
                            groupName = group.name;

                            // 作者默认为当前集团
                            if ($scope.formData.isGroup) {
                                $scope.formData.selectedAuthor.id = groupId;
                                $scope.formData.selectedAuthor.name = groupName;
                            }

                        });
                        // //清除掉预览的存储
                        // localStorage.removeItem('articlePreview');





                        // // 判断作者是集团还是医生
                        // if (data.data.createType === 3) {
                        //     $scope.isGroup = false;
                        // }
                    } else {
                        console.log(data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    alert(data.resultMsg);
                });
            }
        }


        $scope.switchAuthor = function() {

            if ($scope.isGroup) {
                $scope.formData.selectedAuthor.id = groupId;
                $scope.formData.selectedAuthor.name = groupName;
            } else {
                $scope.formData.selectedAuthor.id = authorDate.id;
                $scope.formData.selectedAuthor.name = authorDate.name;
            }
        };

        // $scope.$watch('formData.title', function(newValue, oldValue) {
        //     if (newValue != oldValue) {
        //         if ($scope.formData.title) {
        //             $scope.titleLength = $scope.formData.title.length;
        //         } else {
        //             $scope.titleLength = 0;
        //         }
        //     }
        // });
        // $scope.$watch('formData.summary', function(newValue, oldValue) {
        //     if (newValue != oldValue) {
        //         if ($scope.formData.summary) {
        //             $scope.summaryLength = $scope.formData.summary.length;
        //         } else {
        //             $scope.summaryLength = 0;
        //         }
        //     }
        // });

        //选择病种分类
        $scope.chooseType = function() {
            var diseaseModal = new DataBox('data_res', {
                hasCheck: false,
                allCheck: false,
                leafCheck: true,
                multiple: false,
                allHaveArr: false,
                self: false,
                cover: false,
                leafDepth: 2,
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
                    url: app.url.knowledge.getCategoryList + '?access_token=' + app.url.access_token + '&&groupId=' + groupId
                },
                titles: {
                    main: '选择病种',
                    searchKey: '搜索病种...',
                    label: '已选择病种数'
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
                        access_token: access_token,
                        groupId: groupId
                    }
                },
                search: {
                    url: app.url.yiliao.searchDoctorByKeyWord,
                    param: {
                        access_token: app.url.access_token,
                        groupId: groupId,
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
                        access_token: access_token,
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
                        groupId: groupId,
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

        function diseaseSelected(dt) {
            var selectedType = dt[0];
            $scope.formData.selectedType.id = selectedType.id;
            $scope.formData.selectedType.name = selectedType.name;
            $scope.$apply($scope.formData.selectedType);
        }

        function authorSelected(dt) {
            if (dt.length > 0) {
                authorDate = dt[0];
                $scope.formData.selectedAuthor.id = authorDate.id;
                $scope.formData.selectedAuthor.name = authorDate.name;
                $scope.isGroup = false;
                $scope.$apply($scope.formData.selectedAuthor);
                $scope.$apply($scope.isGroup);
            }
        }



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



        //预览文章，并不保存
        $scope.toPreview = function() {
            if (!$scope.formData.title) {
                toaster.pop('warn', '', '请填写标题');
                return;
            }
            if (!$scope.formData.selectedAuthor) {
                toaster.pop('warn', '', '请选择作者');
                return;
            }
            if (!$scope.fontImgUrl) {
                toaster.pop('warn', '', '请上传题图');
                return;
            }

            var isShow = $scope.formData.isShow == false ? 0 : 1;
            //有摘要，则显示摘要。没有摘要，则去第一段文字的前100字，第一段文字不足100字，这只取第一段文字。
            //var firstParagraph=um.getPlainTxt().split('/\n')[0].slice(0,100);
            var firstParagraph = um.getContentTxt().slice(0, 100);
            var html = um.getContent();
            if (!html) {
                toaster.pop('warn', null, "请填写正文");
                return;
            }
            var articlePreview = {
                authorName: $scope.formData.selectedAuthor.name,
                title: $scope.formData.title,
                keywords: $scope.formData.keywords,
                isShow: isShow,
                copyPath: $scope.fontImgUrl,
                summary: $scope.formData.summary ? $scope.formData.summary : firstParagraph,
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
app.controller('previewModalInstanceCtrl',['$scope', '$modalInstance', 'article', '$sce', function($scope, $modalInstance, article, $sce) {
    $scope.article = article;
    $scope.article.content = $sce.trustAsHtml($scope.article.content);
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
