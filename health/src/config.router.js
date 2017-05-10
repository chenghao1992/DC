'use strict';

(function() {

    var rootUrl = 'src';

    angular.module('app').run(funRun).config(funAppRouterConfig);

    funRun.$inject = ['$rootScope', '$state', '$stateParams']

    function funRun($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$rootUrl = rootUrl;
    }

    funAppRouterConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG']

    function funAppRouterConfig($stateProvider, $urlRouterProvider, JQ_CONFIG) {
        //$urlRouterProvider.when('/app/home');
        //$urlRouterProvider.otherwise('/app/customer_service');
        $urlRouterProvider.otherwise('/access/signin');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                //templateUrl: rootUrl+'/tpl/app.html?rev=@@hash',
                views: {
                    '': {
                        templateUrl: rootUrl + '/tpl/app.html?rev=@@hash'
                    },
                    'footer': {
                        template: '<div id="dialog-container" ui-view></div>'
                    },
                    'nav@app': {
                        templateUrl: rootUrl + '/tpl/nav/nav.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/nav/nav.js?rev=@@hash',
                                rootUrl + '/js/directives/ui-medicine.js?rev=@@hash',

                                'components/trees/treeDir.js?rev=@@hash',
                                'components/trees/tree.css?rev=@@hash',
                                'components/rightDrawerDir/rightDrawerDir.js?rev=@@hash',

                                'components/myFileSelectBox/myFileSelectBox.js?rev=@@hash',

                                'components/selectMedicineBox/selectMedicineBoxFat.js?rev=@@hash',
                                'components/xg-table/bk-table.js?rev=@@hash',
                                'components/xg-table/fe-table.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.home', {
                url: '/home',
                templateUrl: rootUrl + '/tpl/home.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/home.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.test', {
                url: '/test',
                templateUrl: rootUrl + '/tpl/test/test.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/tpl/test/test.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            // others
            .state('lockme', {
                url: '/lockme',
                templateUrl: rootUrl + '/tpl/lockme.html?rev=@@hash'
            })
            .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: rootUrl + '/tpl/signin.html?rev=@@hash',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load([
                                rootUrl + '/js/controllers/signin.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('access.enterprise_signin', {
                url: '/enterprise_signin',
                templateUrl: rootUrl + '/tpl/enterprise/signin.html?rev=@@hash',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load([
                                rootUrl + '/js/controllers/enterprise/signin.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: rootUrl + '/tpl/enterprise/signup.html?rev=@@hash',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load([
                                rootUrl + '/js/controllers/enterprise/signup.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.relationship', {
                url: '/relationship',
                templateUrl: rootUrl + '/tpl/group/relationship.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                rootUrl + '/js/controllers/group/relationship.js?rev=@@hash').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            .state('app.relationship.list', {
                url: '/list/{id}',
                templateUrl: rootUrl + '/tpl/group/relationship_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/relationship_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.relationship.edit', {
                url: '/edit',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/relationship_edit.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/relationship_edit.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.relationship.list.delete', {
                url: '/delete',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/relationship_delete.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/relationship_delete.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts', {
                url: '/contacts',
                //templateUrl: rootUrl+'http://localhost:8080/template/contacts.html?rev=@@hash',
                //templateUrl: rootUrl+'/tpl/group/contacts.html?rev=@@hash',
                views: {
                    "@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            .state('app.contacts.list', {
                url: '/list/{id}',
                templateUrl: rootUrl + '/tpl/group/contacts_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.contacts.search', {
                url: '/search/{key}',
                views: {
                    "groupSearch": {
                        templateUrl: rootUrl + '/tpl/group/contacts_search.html?rev=@@hash'
                    }
                },
                //templateUrl: rootUrl+'/tpl/group/contacts_search.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_search.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.create_doctor_account', {
                url: '/create_doctor_account',
                templateUrl: rootUrl + '/tpl/group/create_doctor_account.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/create_doctor_account.js?rev=@@hash',
                                // 七牛上传文件组建
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                'ui.select'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_list_details.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_list_details.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_add.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_add.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.edit', {
                url: '/edit',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_edit.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_edit.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.delete', {
                url: '/delete',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_delete.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_delete.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.invite', {
                url: '/invite',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_invite.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_invite.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.quit', {
                url: '/quit',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_list_quit.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_list_quit.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.list.apportion', {
                url: '/apportion',
                views: {
                    "dialogView@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_list_apportion.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/contacts_list_apportion.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.contacts.joinToCompany', {
                url: '/joinToCompany',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/joinToCompany.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/group/joinToCompany.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.groupSettings', {
                url: '/groupSettings/:groupId',
                templateUrl: rootUrl + '/tpl/group/groupSettings.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return uiLoad.load([
                                    rootUrl + '/js/controllers/group/groupSettings.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state('app.groupLogo', {
                url: '/groupLogo/:groupId',
                templateUrl: rootUrl + '/tpl/group/groupLogo.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return uiLoad.load([
                                    rootUrl + '/js/controllers/group/groupLogo.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })
            //值班表
            .state('app.schedule', {
                url: '/schedule',
                templateUrl: rootUrl + '/tpl/group/schedule.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/group/schedule.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            // 集团管理员
            .state('app.setting.group_admin', {
                url: '/group_admin',
                templateUrl: rootUrl + '/tpl/group/administrator.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/group/administrator.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //眼科医院导医账户管理
            // .state('app.setting.Eyegroup_admin', {
            //     url: '/Eyegroup_admin',
            //     templateUrl: rootUrl + '/tpl/group/EyegroupAdministrator.html?rev=@@hash',
            //     resolve: {
            //         deps: ['$ocLazyLoad', 'uiLoad',
            //             function($ocLazyLoad, uiLoad) {
            //                 return $ocLazyLoad.load([
            //                     'toaster',
            //                     rootUrl + '/js/controllers/group/EyegroupAdministrator.js?rev=@@hash'
            //                 ]).then(function() {
            //                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
            //                 });
            //             }
            //         ]
            //     }
            // })
            // 名医推荐
            .state('app.doc_recommend', {
                url: '/doc_recommend',
                template: '<div ui-view></div>'
            })
            // 名医推荐列表
            .state('app.doc_recommend.list', {
                url: '/list',
                templateUrl: rootUrl + '/tpl/doc_recommend/doc_recommend_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/doc_recommend/doc_recommend_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            // 名医推荐--个性化页面
            .state('app.doc_recommend.doctor_personal_profile', {
                url: '/doctor_personal_profile/{id}/{name}',
                templateUrl: rootUrl + '/tpl/doc_recommend/doctor_personal_profile.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/doc_recommend/doctor_personal_profile.js?rev=@@hash',
                                // 七牛上传文件组建
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                // 百度富文本编辑器
                                'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',
                            ]);
                        }
                    ]
                }
            })
            // 名医推荐
            .state('app.docRecommend', {
                url: '/docRecommend',
                template: '<div ui-view></div>'
            })
            // 名医推荐列表
            .state('app.docRecommend.list', {
                url: '/list',
                templateUrl: rootUrl + '/tpl/docRecommend/docRecommend.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/docRecommend/docRecommend.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //公司模块
            .state('app.group_manage', {
                url: '/group_manage',
                templateUrl: rootUrl + '/tpl/enterprise/group_manage.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/enterprise/group_manage.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.group_manage.enterprise_setting', {
                url: '/enterprise_setting',
                views: {
                    "@app": {
                        templateUrl: rootUrl + '/tpl/enterprise/enterprise_setting.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/enterprise/enterprise_setting.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.setting.enterprise_identify', {
                url: '/enterprise_identify',
                templateUrl: rootUrl + '/tpl/enterprise/enterprise_identify.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/enterprise/enterprise_identify.js?rev=@@hash',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state('app.group_create', {
                url: '/group_create',
                templateUrl: rootUrl + '/tpl/group/group_create.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/group/group_create.js?rev=@@hash',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.setting.group_edit', {
                url: '/group_edit',
                templateUrl: rootUrl + '/tpl/group/group_edit.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load([rootUrl +'/js/controllers/group/group_edit.js?rev=@@hash',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.setting.group_h5', {
                url: '/group_h5',
                templateUrl: rootUrl + '/tpl/group/groupH5.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/group/groupH5.js?rev=@@hash',
                                    // 七牛上传文件组建
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                    // 百度富文本编辑器

                                    'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                    'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.setting.helper_account', {
                url: '/helper_account',
                templateUrl: rootUrl + '/tpl/setting/helper_account.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/setting/helper_account.js?rev=@@hash',
                                rootUrl + '/js/directives/xg-table.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.group_create.invite', {
                url: '/invite',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/group/contacts_invite.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(rootUrl +'/js/controllers/group/contacts_invite.js?rev=@@hash');
                        }
                    ]
                }
            })
            .state('app.en_admin', {
                url: '/en_admin',
                templateUrl: rootUrl + '/tpl/enterprise/administrator.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/enterprise/administrator.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //集团就医知识
            .state('app.groupKnowledge', {
                //abstract: true,
                url: '/groupKnowledge',
                template: '<div ui-view></div>',
            })
            //集团就医知识列表
            .state('app.groupKnowledge.list', {
                url: '/list?isEditBeforeWidthcategoryId&isSearchByAllCategory',
                templateUrl: rootUrl + '/tpl/knowledge/group/knowledgeList.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/knowledge/group/knowledgeList.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //集团就医知识添加
            .state('app.groupKnowledge.add', {
                url: '/add',
                templateUrl: rootUrl + '/tpl/knowledge/group/knowledgeAdd.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/group/knowledgeAdd.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //集团就医知识编辑
            .state('app.groupKnowledge.edit', {
                url: '/edit?id&categoryId&isSearchByAllCategory',
                templateUrl: rootUrl + '/tpl/knowledge/group/knowledgeEdit.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/group/knowledgeEdit.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //查看集团就医知识
            .state('app_groupKnowledge_info', {
                url: '/info?id&categoryId&isTop&isSearchByAllCategory',
                templateUrl: rootUrl + '/tpl/knowledge/group/knowledgeInfo.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/group/knowledgeInfo.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })
            //个人就医知识
            .state('app.doctorKnowledge', {
                //abstract: true,
                url: '/doctorKnowledge',
                template: '<div ui-view></div>',
            })
            //个人就医知识列表
            .state('app.doctorKnowledge.list', {
                url: '/list?isPersonKnowledge&isEditBeforeWidthcategoryId&isSearchByAllCategory&showGroupKnowledge',
                templateUrl: rootUrl + '/tpl/knowledge/doctor/knowledgeList.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/knowledge/doctor/knowledgeList.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //个人就医知识添加
            .state('app.doctorKnowledge.add', {
                url: '/add?isPersonKnowledge',
                templateUrl: rootUrl + '/tpl/knowledge/doctor/knowledgeAdd.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/doctor/knowledgeAdd.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //查看个人就医知识
            .state('app_doctorKnowledge_info', {
                url: '/info2?id&categoryId&isPersonKnowledge&isTop&isSearchByAllCategory',
                templateUrl: rootUrl + '/tpl/knowledge/doctor/knowledgeInfo.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/doctor/knowledgeInfo.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })

        //个人就医知识添加
        .state('app.doctorKnowledge.edit', {
                url: '/edit?id&categoryId&isPersonKnowledge&isSearchByAllCategory',
                templateUrl: rootUrl + '/tpl/knowledge/doctor/knowledgeEdit.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/knowledge/doctor/knowledgeEdit.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生动态
            .state('app.doctorDynamic', {
                //abstract: true,
                url: '/doctorDynamic',
                template: '<div ui-view></div>',
            })
            //医生动态列表
            .state('app.doctorDynamic.edit', {
                url: '/edit',
                templateUrl: rootUrl + '/tpl/dynamic/doctor/dynamic_edit.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/dynamic/doctor/dynamic_edit.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //医生动态群发消息
            .state('app.doctorDynamic.edit.sendMsg', {
                url: '/send',
                templateUrl: rootUrl + '/tpl/dynamic/doctor/dynamic_send.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/dynamic/doctor/dynamic_send.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生动态历史消息
            .state('app.doctorDynamic.edit.msgHistory', {
                url: '/msgHistory',
                templateUrl: rootUrl + '/tpl/dynamic/doctor/dynamic_history.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/dynamic/doctor/dynamic_history.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //动态
            .state('app.dynamic', {
                //abstract: true,
                url: '/dynamic',
                template: '<div ui-view></div>',
            })
            //动态列表
            .state('app.dynamic.list', {
                url: '/list',
                templateUrl: rootUrl + '/tpl/dynamic/group/dynamic.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/dynamic/group/dynamic.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //动态编辑
            .state('app.dynamic.edit', {
                url: '/edit?id',
                templateUrl: rootUrl + '/tpl/dynamic/group/dynamic_edit.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/dynamic/group/dynamic_edit.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //动态群发消息
            .state('app.dynamic.edit.sendMsg', {
                url: '/sendMsg?id',
                templateUrl: rootUrl + '/tpl/dynamic/group/dynamic_send.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/dynamic/group/dynamic_send.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //动态历史消息
            .state('app.dynamic.edit.msgHistory', {
                url: '/msgHistory',
                templateUrl: rootUrl + '/tpl/dynamic/group/dynamic_history.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/dynamic/group/dynamic_history.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //动态设置
            .state('app.dynamic.edit.setting', {
                url: '/setting',
                templateUrl: rootUrl + '/tpl/dynamic/group/dynamic_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/dynamic/group/dynamic_setting.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('access.Fill_Info', {
                url: '/Fill_Info',
                templateUrl: rootUrl + '/tpl/enterprise/Fill_Info.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('ngFileUpload').then(function() {
                                return uiLoad.load([
                                    rootUrl + '/js/controllers/enterprise/Fill_Info.js?rev=@@hash'
                                ]);
                            });
                        }
                    ]
                }
            })
            .state('access.signup_success', {
                url: '/signup_success',
                templateUrl: rootUrl + '/tpl/enterprise/signup_success.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function(uiLoad) {
                            return uiLoad.load([
                                rootUrl + '/js/controllers/enterprise/signup_success.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('access.enterprise_verify', {
                url: '/verify',
                templateUrl: rootUrl + '/tpl/enterprise/verify.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function(uiLoad) {
                            return uiLoad.load([
                                rootUrl + '/js/controllers/enterprise/verify.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            // 医生考核
            .state('app.evaluation', {
                url: '/evaluation',
                templateUrl: rootUrl + '/tpl/evaluation/evaluation.html?rev=@@hash',
                //template: '<div ui-view></div>',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/evaluation.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.evaluation.by_patient', {
                url: '/by_patient',
                templateUrl: rootUrl + '/tpl/evaluation/evaluation_by_patient.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/evaluation_by_patient.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.evaluation.by_doctor', {
                url: '/by_doctor',
                templateUrl: rootUrl + '/tpl/evaluation/evaluation_by_doctor.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/evaluation_by_doctor.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.evaluation.by_finance', {
                url: '/by_finance',
                templateUrl: rootUrl + '/tpl/evaluation/evaluation_by_finance.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/evaluation_by_finance.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            .state('app.doctor_list', {
                url: '/doctor_list',
                templateUrl: rootUrl + '/tpl/evaluation/doctor_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/doctor_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.doctor_list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: rootUrl + '/tpl/evaluation/doctor_details.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/evaluation/doctor_details.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            // 医生统计
            .state('app.statistics', {
                url: '/statistics',
                templateUrl: rootUrl + '/tpl/statistics/statistics.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/statistics/statistics.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            .state('app.statistics.of_disease', {
                url: '/of_disease',
                templateUrl: rootUrl + '/tpl/statistics/statistics_of_disease.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/statistics/statistics_of_disease.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            // 集团收入
            .state('app.finance', {
                url: '/finance',
                template: '<div ui-view></div>'
            })
            .state('app.finance.reports', {
                url: '/reports/{name}/{date}',
                templateUrl: rootUrl + '/tpl/finance/reports_of_finance.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/finance/reports_of_finance.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.finance.statistic_of_report', {
                url: '/statistic_of_report',
                templateUrl: rootUrl + '/tpl/finance/statistic_of_report.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/finance/statistic_of_report.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.setting.bank_account', {
                url: '/bank_account',
                templateUrl: rootUrl + '/tpl/finance/bank_account.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/finance/bank_account.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            // 患者库
            .state('app.patient', {
                url: '/patient/{type}',
                templateUrl: rootUrl + '/tpl/patient/patient.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/patient/patient.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            .state('app.patient.patient_list', {
                url: '/patient_list/{id}',
                templateUrl: rootUrl + '/tpl/patient/patient_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/patient/patient_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.patient.patient_list.details', {
                url: '/details',
                views: {
                    "dialogView@app": {
                        templateUrl: rootUrl + '/tpl/patient/patient_details.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/patient/patient_details.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.statistics.of_title', {
                url: '/of_title',
                templateUrl: rootUrl + '/tpl/statistics/statistics_of_title.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/statistics/statistics_of_title.js?rev=@@hash', 'toaster'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            .state('app.statistics.of_area', {
                url: '/of_area',
                templateUrl: rootUrl + '/tpl/statistics/statistics_of_area.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/statistics/statistics_of_area.js?rev=@@hash', 'toaster'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.echarts));
                            });
                        }
                    ]
                }
            })
            //值班安排设置
            .state('app.setting.schedule_setting', {
                url: '/schedule_setting',
                templateUrl: rootUrl + '/tpl/setting/schedule_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/setting/schedule_setting.js?rev=@@hash', 'toaster'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            .state('app.setting.schedule_setting.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/setting/add.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/setting/add.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            //专家名单设置
            .state('app.setting.expert_setting', {
                url: '/expert_setting',
                templateUrl: rootUrl + '/tpl/setting/expert_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/setting/expert_setting.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            .state('app.setting.expert_setting.add', {
                url: '/add',
                views: {
                    "modalDialog@app": {
                        templateUrl: rootUrl + '/tpl/setting/add.html?rev=@@hash'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/setting/add.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            //病种标签设置
            .state('app.setting.disease_setting', {
                url: '/disease_setting',
                templateUrl: rootUrl + '/tpl/setting/disease_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/setting/disease_setting.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //预约名医设置
            .state('app.setting.appointment_setting', {
                url: '/appointment_setting',
                templateUrl: rootUrl + '/tpl/setting/appointment_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/setting/appointment_setting.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //线下执业医院设置
            .state('app.setting.substance_setting', {
                url: '/substance_setting',
                templateUrl: rootUrl + '/tpl/setting/substance_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'components/chooseHospitals/chooseHospitals.js?rev=@@hash',
                                rootUrl + '/js/controllers/setting/substance_setting.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //消息管理
            .state('app.message', {
                url: '/message',
                templateUrl: rootUrl + '/tpl/message/message.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/message/message.js?rev=@@hash', 'toaster'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.umeditor);
                            });
                        }
                    ]
                }
            })


        //集团患教中心 start
        .state('app.document', {
                //abstract: true,
                url: '/document',
                template: '<div ui-view></div>',
            })
            .state('app.document.group', {
                url: '/group',
                template: '<div ui-view></div>',
            })
            //文章列表
            .state('app.document.group.article_list', {
                url: '/article_list',
                templateUrl: rootUrl + '/tpl/document/group/article_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/document/group/article_list.js?rev=@@hash', 'angularBootstrapNavTree'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //新建文章
            .state('app.document.group.create_article', {
                url: '/create_article',
                templateUrl: rootUrl + '/tpl/document/group/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/group/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑文章
            .state('app.document.group.edit_article', {
                url: '/edit_article/{id}',
                templateUrl: rootUrl + '/tpl/document/group/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/group/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })

        //医生资料中心开始
        .state('app.document.doctor', {
                url: '/doctor',
                template: '<div ui-view></div>',
            })
            //玄关患教中心
            .state('app.document.doctor.platform_doc', {
                url: '/platform_doc',
                templateUrl: rootUrl + '/tpl/document/doctor/platform_doc.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/document/doctor/platform_doc.js?rev=@@hash'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            //集团患教中心
            .state('app.document.doctor.group_doc', {
                url: '/group_doc',
                templateUrl: rootUrl + '/tpl/document/doctor/group_doc.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/document/doctor/group_doc.js?rev=@@hash'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            //医生收藏
            .state('app.document.doctor.doctor_doc', {
                url: '/doctor_doc',
                templateUrl: rootUrl + '/tpl/document/doctor/doctor_doc.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/document/doctor/doctor_doc.js?rev=@@hash'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //新建文章
            .state('app.document.doctor.create_article', {
                url: '/create_article',
                templateUrl: rootUrl + '/tpl/document/doctor/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/doctor/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑文章
            .state('app.document.doctor.edit_article', {
                url: '/edit_article/{id}',
                templateUrl: rootUrl + '/tpl/document/doctor/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/doctor/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })


        .state('app.public_msg', {
                //abstract: true,
                url: '/public_msg',
                template: '<div ui-view></div>',
            })
            //集团公众账号start
            .state('app.public_msg.group', {
                url: '/group',
                template: '<div ui-view></div>',
            })
            .state('app.public_msg.group.public_msg_list', {
                url: '/public_msg_list',
                templateUrl: rootUrl + '/tpl/public_msg/group/public_msg_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                rootUrl + '/js/controllers/public_msg/group/public_msg_list.js?rev=@@hash');
                        }
                    ]
                }
            })
            .state('app.public_msg.group.msg_manage', {
                url: '/msg_manage/{id}',
                templateUrl: rootUrl + '/tpl/public_msg/group/msg_manage.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/public_msg/group/msg_manage.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.public_msg.group.msg_manage.send_msg', {
                url: '/send_msg',
                templateUrl: rootUrl + '/tpl/public_msg/group/send_msg.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/public_msg/group/send_msg.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.public_msg.group.msg_manage.msg_history', {
                url: '/msg_history',
                templateUrl: rootUrl + '/tpl/public_msg/group/msg_history.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/public_msg/group/msg_history.js?rev=@@hash'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.public_msg.group.msg_manage.setting', {
                url: '/setting',
                templateUrl: rootUrl + '/tpl/public_msg/group/setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/public_msg/group/setting.js?rev=@@hash',
                                        'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                        'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                        'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                    ]);
                                }
                            );
                        }
                    ]
                }
            })
            //集团公众号end

        //医生公众号start
        .state('app.public_msg.doctor', {
                url: '/doctor',
                template: '<div ui-view></div>',
            })
            .state('app.public_msg.doctor.msg_manage', {
                url: '/msg_manage/{id}',
                templateUrl: rootUrl + '/tpl/public_msg/doctor/msg_manage.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                rootUrl + '/js/controllers/public_msg/doctor/msg_manage.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.public_msg.doctor.msg_manage.send_msg', {
                url: '/send_msg',
                templateUrl: rootUrl + '/tpl/public_msg/doctor/send_msg.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/public_msg/doctor/send_msg.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.public_msg.doctor.msg_manage.msg_history', {
                url: '/msg_history',
                templateUrl: rootUrl + '/tpl/public_msg/doctor/msg_history.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/public_msg/doctor/msg_history.js?rev=@@hash'
                                    ]);
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //医生公众账号end


        //集团浏览文章
        .state('groupArticle', {
                url: '/document/groupArticle/{id}?createType',
                templateUrl: rootUrl + '/tpl/document/group/article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/group/article.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //集团浏览页面的编辑文章
            .state('group_edit_article', {
                url: '/document/group_edit_article/{id}',
                templateUrl: rootUrl + '/tpl/document/group/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/group/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生浏览文章
            .state('doctorArticle', {
                url: '/document/doctorArticle/{id}?createType',
                templateUrl: rootUrl + '/tpl/document/doctor/article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/doctor/article.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生浏览页面的编辑文章
            .state('doctor_edit_article', {
                url: '/document/doctor_edit_article/{id}?createType',
                templateUrl: rootUrl + '/tpl/document/doctor/edit_article.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/document/doctor/edit_article.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //医生的患教中心 end


        //集团财务
        .state('app.setting.charge_setting', {
                url: '/charge_setting',
                templateUrl: rootUrl + '/tpl/group/charge_setting.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ui.bootstrap', 'toaster',
                                rootUrl + '/js/controllers/group/charge_setting.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            //订单管理
            .state('app.order_list',{
                url:'/order_list',
                template:'<div ui-view></div>'
            })
            .state('app.order_list.done',{
                url:'/order-done',
                templateUrl:rootUrl+'/tpl/order/order_done.html?rev=@@hash',
                resolve:{
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/order/order_done.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-计划列表
            .state('app.care_plan', {
                url: '/care_plan',
                template: '<div ui-view></div>'
            })
            .state('app.care_plan.list', {
                url: '/list',
                templateUrl: rootUrl + '/tpl/care/care_plan_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/care_plan_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-新建计划
            .state('app.new_plan', {
                url: '/new_plan/:isEdit',
                templateUrl: rootUrl + '/tpl/care/new_plan.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/new_plan.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-编辑计划
            .state('app.edit_plan', {
                url: '/edit_plan/:planId/:isEdit',
                templateUrl: rootUrl + '/tpl/care/edit_plan.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/edit_plan.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-编辑介绍
            .state('app.care_introduce', {
                url: '/care_introduce/:planId/:isEdit',
                templateUrl: rootUrl + '/tpl/care/care_introduce.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/care/care_introduce.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-预览计划
            //.state('app.plan_preview', {
            //    url: '/plan_preview/:planId',
            //    templateUrl: rootUrl+'/tpl/care/plan_preview.html?rev=@@hash',
            //    resolve: {
            //        deps: ['$ocLazyLoad',
            //            function($ocLazyLoad) {
            //                return $ocLazyLoad.load(['toaster', '/js/controllers/care/plan_preview.js?rev=@@hash']);
            //            }
            //        ]
            //    }
            //})
            //健康关怀计划-病情跟踪题库
            .state('app.questions_of_disease', {
                url: '/questions_of_disease',
                templateUrl: rootUrl + '/tpl/care/questions_of_disease.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/questions_of_disease.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })

        //健康关怀计划-创建病情跟踪题库
        .state('app.care_plan.createTrackContent', {
                url: '/diseaseTrackDatabase/createTrackContent',
                templateUrl: rootUrl + '/tpl/care/diseaseTrackDatabase/createTrackContent.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    rootUrl + '/js/controllers/care/diseaseTrackDatabase/createTrackContent.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',

                                    rootUrl + '/js/controllers/care/carePlan/addIllnessTrack.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]

                }
            })
            //健康关怀计划-日程题库
            .state('app.reserve_of_schedule', {
                url: '/reserve_of_schedule',
                templateUrl: rootUrl + '/tpl/care/reserve_of_schedule.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/carePlan/addIllnessTrack.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/reserve_of_schedule.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-关怀计划
            .state('app.carePlan', {
                url: '/carePlan/:planId',
                templateUrl: rootUrl + '/tpl/care/carePlan/carePlan.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                // 百度富文本编辑器
                                'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',
                                // 时间选择组件
                                'components/timeSetCpn/timeSetCpnDirective.js?rev=@@hash',

                                rootUrl + '/js/controllers/care/carePlan/editInfo.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addOtherRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addMedication.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addLifeQuality.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addSurvey.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckDocReply.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addIllnessTrack.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addText.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/carePlan.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-生活量表题库
            .state('app.care_plan.lifeQualityLibrary', {
                url: '/lifeQualityLibrary',
                templateUrl: rootUrl + '/tpl/care/lifeQualityLibrary/lifeQualityLibrary.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                rootUrl + '/js/controllers/care/lifeQualityLibrary/lifeQualityLibrary.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-病情跟踪题库
            .state('app.care_plan.diseaseTrackDatabase', {
                url: '/diseaseTrackDatabase',
                templateUrl: rootUrl + '/tpl/care/diseaseTrackDatabase/disease_track_database.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                // 百度富文本编辑器
                                'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',
                                // 时间选择组件
                                'components/timeSetCpn/timeSetCpnDirective.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/editInfo.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addOtherRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addMedication.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addLifeQuality.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addSurvey.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addText.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckDocReply.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addIllnessTrack.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/diseaseTrackDatabase/disease_track_database.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-创建量表
            .state('app.editLifeQuality', {
                url: '/editLifeQuality/:lifeScaleId/:version',
                templateUrl: rootUrl + '/tpl/care/lifeQualityLibrary/editLifeQuality.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                'components/chooseDepartment/chooseDepartmentService.js?rev=@@hash',
                                 // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/lifeQualityLibrary/editLifeQuality.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });;
                        }
                    ]
                }
            })
            //健康关怀计划-调查表库
            .state('app.care_plan.surveyLibrary', {
                url: '/surveyLibrary',
                templateUrl: rootUrl + '/tpl/care/surveyLibrary/surveyLibrary.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/surveyLibrary/surveyLibrary.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });;
                        }
                    ]
                }
            })
            //健康关怀计划-编辑调查表
            .state('app.editorSurvey', {
                url: '/editorSurvey/:surveyId/:version',
                templateUrl: rootUrl + '/tpl/care/surveyLibrary/editorSurvey.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                'components/chooseDepartment/chooseDepartmentService.js?rev=@@hash',
                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/surveyLibrary/editorSurvey.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });;
                        }
                    ]
                }
            })
            //随访表
            .state('app.follow_up_table', {
                url: '/follow_up_table/:planId',
                templateUrl: rootUrl + '/tpl/care/follow_up_table.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/follow_up_table.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //新增随访
            .state('app.new_follow_up', {
                url: '/new_follow_up/:planId',
                templateUrl: rootUrl + '/tpl/care/new_follow_up.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/care/new_follow_up.js?rev=@@hash'
                            ]).then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //新增随访
            .state('app.followUp', {
                url: '/followUp/:planId',
                templateUrl: rootUrl + '/tpl/care/followUp/followUp.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                // 百度富文本编辑器
                                'components/ngUmeditor/umeditor/third-party/jquery.min.js?rev=@@hash',
                                'components/ngUmeditor/umeditor/umeditor.min.js?rev=@@hash',
                                'components/ngUmeditor/umeditor/umeditor.config.js?rev=@@hash',
                                'components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css?rev=@@hash',
                                'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',

                                // 时间选择组件
                                'components/timeSetCpn/timeSetCpnDirective.js?rev=@@hash',

                                rootUrl + '/js/controllers/care/carePlan/editInfo.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addOtherRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addMedication.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckRemind.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addLifeQuality.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addSurvey.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addText.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addCheckDocReply.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/carePlan/addIllnessTrack.js?rev=@@hash',

                                rootUrl + '/js/controllers/care/followUp/addArticle.js?rev=@@hash',
                                rootUrl + '/js/controllers/care/followUp/followUp.js?rev=@@hash'
                            ]).then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree, JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            .state('app.setting', {
                url: '/setting',
                template: '<div ui-view></div>'
            })

        .state('app.invitation', {
                url: '/invitation',
                templateUrl: rootUrl + '/tpl/invitation/invite_patient.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {

                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/invitation/invite_patient.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.invite_list', {
                url: '/invite_list',
                templateUrl: rootUrl + '/tpl/invitation/invite_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {

                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/invitation/invite_list.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //集团药品库start
            .state('app.group_drug_library', {
                url: '/group_drug_library',
                templateUrl: rootUrl + '/tpl/group_drug_library/group_drug_library.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/group_drug_library/group_drug_library.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 文件管理
            .state('app.file_management', {
                url: '/file_management',
                templateUrl: rootUrl + '/tpl/file_management/file_management.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                // 七牛上传文件组建
                                'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                'components/qiniuUploader/rely/qiniu.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash',
                                rootUrl + '/js/controllers/file_management/file_management.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            // 医生社区 -- 集团
            .state('app.groupCommunity', {
                url: '/groupCommunity',
                template: '<div ui-view></div>',
            })
            // 医生社区主页
            .state('app.groupCommunity.post_list', {
                url: '/post_list',
                templateUrl: rootUrl + '/tpl/community/group/post_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('angularBootstrapNavTree')
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/community/group/post_list.js?rev=@@hash',
                                        // 表情处理过滤器
                                        rootUrl + '/js/filters/faceIconFilterDirective.js?rev=@@hash',
                                        rootUrl + '/js/controllers/community/group/post_detail.js?rev=@@hash'
                                    ]);
                                }).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                                });
                        }
                    ]
                }
            })
            // 医生社区 -- 个人
            .state('app.doctorCommunity', {
                url: '/doctorCommunity',
                template: '<div ui-view></div>',
            })
            // 医生社区主页
            .state('app.doctorCommunity.post_list', {
                url: '/post_list/{postType}',
                templateUrl: rootUrl + '/tpl/community/doctor/post_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('angularBootstrapNavTree')
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        rootUrl + '/js/controllers/community/doctor/post_list.js?rev=@@hash',
                                        // 表情处理过滤器
                                        rootUrl + '/js/filters/faceIconFilterDirective.js?rev=@@hash',
                                        rootUrl + '/js/controllers/community/doctor/post_detail.js?rev=@@hash'
                                    ]);
                                }).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                                });
                        }
                    ]
                }
            })
            //帖子详情
            .state('app.doctorCommunity.post_detail', {
                url: '/post_detail/{postId}/{postType}',
                templateUrl: rootUrl + '/tpl/community/doctor/post_detail.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('angularBootstrapNavTree')
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        // 表情处理过滤器
                                        rootUrl + '/js/filters/faceIconFilterDirective.js?rev=@@hash',
                                        rootUrl + '/js/controllers/community/doctor/post_detail.js?rev=@@hash'
                                    ]);
                                }).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                        }
                    ]
                }
            })
            // 新建帖子--图文(医生论坛)
            .state('app.doctorCommunity.create_post_imgt', {
                url: '/create_post_imgt/{id}/{postType}',
                templateUrl: rootUrl + '/tpl/community/doctor/create_post_imgt.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([

                                    // 百度富文本编辑器
                                    // 'components/ngUmeditor/umeditor/third-party/jquery.min.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/umeditor.min.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/umeditor.config.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css?rev=@@hash',
                                    'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                    'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',

                                    rootUrl + '/js/controllers/community/doctor/create_post_imgt.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            // 新建帖子--视频(医生论坛)
            .state('app.doctorCommunity.create_post_video', {
                url: '/create_post_video/{id}/{postType}',
                templateUrl: rootUrl + '/tpl/community/doctor/create_post_video.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([

                                    // 百度富文本编辑器
                                    // 'components/ngUmeditor/umeditor/third-party/jquery.min.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/umeditor.min.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/umeditor.config.js?rev=@@hash',
                                    'components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css?rev=@@hash',
                                    'components/ngUmeditor/ngUmeditorController.js?rev=@@hash',
                                    'components/ngUmeditor/ngUmeditorDirective.js?rev=@@hash',

                                    rootUrl + '/js/controllers/community/doctor/create_post_video.js?rev=@@hash',
                                    'components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    'components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //会诊
            .state('app.consultation', {
                url: '/consultation',
                template: '<ui-view></ui-view>'
            })
            .state('app.consultation.introduce', {
                url: '/introduce',
                templateUrl: rootUrl + '/tpl/consultation/introduce.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/consultation/introduce.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.consultation.list', {
                url: '/list',
                templateUrl: rootUrl + '/tpl/consultation/consult_list.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/consultation/consult_list.js?rev=@@hash', 
                                rootUrl + '/js/directives/xg-table.js?rev=@@hash'
                            ]);
                        }
                    ]
                }
            })
            .state('app.consultation.detail', {
                url: '/id/{id}',
                templateUrl: rootUrl + '/tpl/consultation/consult_detail.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/consultation/consult_detail.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            // 集团订单
            .state('app.order', {
                url: '/order',
                template: '<ui-view></ui>'
            })
            .state('app.order.chargeList', {
                url: '/chargeList',
                templateUrl: rootUrl + '/tpl/order/chargeList.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                rootUrl + '/js/controllers/order/chargeList.js?rev=@@hash'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            .state('app.group_in_blocked_status', {
                url: '/group_in_blocked_status',
                template: '<div class="hbox hbox-auto-xs hbox-auto-sm">' +
                    '<div class="frame-panel text-center" style="padding: 100px 0;">' +
                    '<i style="font-size:160px;" class="fa fa-exclamation-circle text-danger"></i><br/>' +
                    '<p class="text-lg" style="padding: 30px 0;">集团状态异常，如有疑问请联系客服：400-618-8886</p>' +
                    '</div>' +
                    '</div>'
            })
            .state('access.forgetPassword', {
                url: '/forgetPassword',
                templateUrl: rootUrl + '/tpl/forgetPassword.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(
                                rootUrl + '/js/controllers/forgetPassword.js?rev=@@hash');
                        }
                    ]
                }
            })
            .state('access.resetPassword', {
                url: '/resetPassword',
                templateUrl: rootUrl + '/tpl/enterprise/resetPassword.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(
                                rootUrl + '/js/controllers/enterprise/resetPassword.js?rev=@@hash');
                        }
                    ]
                }
            })
            .state('access.404', {
                url: '/404',
                templateUrl: rootUrl + '/tpl/404.html?rev=@@hash'
            })
            .state('app.mail.list', {
                url: '/inbox/{fold}',
                templateUrl: rootUrl + '/tpl/mail.list.html?rev=@@hash'
            })
            .state('app.mail.detail', {
                abstract: true,
                url: '/{mailId:[0-9]{1,4}}',
                templateUrl: rootUrl + '/tpl/mail.detail.html?rev=@@hash'
            })
            //app端接受邀请
            .state('appInvite', {
                url: '/appInvite',
                templateUrl: rootUrl + '/tpl/appInvite.html?rev=@@hash'
            });
    }
})();
