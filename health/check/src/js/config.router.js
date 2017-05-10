'use strict';
(function() {
    angular.module('app').run(funRun)
        .config(funAppRouterConfig);
    funRun.$inject = ['$rootScope', '$state', '$stateParams'];

    function funRun($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    };
    funAppRouterConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG'];

    function funAppRouterConfig($stateProvider, $urlRouterProvider, JQ_CONFIG) {
        var version = '12121212';
        $urlRouterProvider.otherwise('/app/home');
        $stateProvider.state('app', {
                abstract: true,
                url: '/app',
                //templateUrl: 'src/tpl/app.html',
                views: {
                    '': {
                        templateUrl: 'src/tpl/app.html',
                        controller: 'AppController'
                    },
                    'footer': {
                        template: '<div id="dialog-container" ui-view></div>'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'src/js/directives/ui-medicine.js',
                                'src/js/controllers/app_controller.js',
                                '../components/rightDrawerDir/rightDrawerDir.js',
                                '../components/selectMedicineBox/selectMedicineBoxFat.js',
                                '../components/inputValuePlace/inputValuePlace.js',

                                '../components/trees/treeDir.js',
                                '../components/trees/tree.css',

                                '../components/modelDialog/modelDialogFactory.js'
                            ]);
                        }
                    ]
                }
            }).state('app.home', {
                url: '/home',
                templateUrl: 'src/tpl/home.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/home.js']);
                        }
                    ]
                }
            })
            // 医生集团认证审核
            .state('app.check', {
                url: '/check',
                template: '<div ui-view></div>'
            }).state('app.check.doctor', {
                url: '/doctor',
                template: '<div ui-view></div>'
            }).state('app.check.group', {
                url: '/group',
                template: '<div ui-view></div>'
            })
            // 医生审核
            .state('app.check.doctor.check_list', {
                url: '/check_list/{type}/{page}/{isone}',
                templateUrl: 'src/tpl/customer_service/doctor_check_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'ui.select',
                                'src/js/controllers/customer_service/doctor_check_list.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 创建医生账号
            .state('app.check.create_doctor_account', {
                url: '/create_doctor_account/{id}/{name}',
                templateUrl: 'src/tpl/customer_service/create_doctor_account.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/customer_service/create_doctor_account.js',
                                // 七牛上传文件组建
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                'ui.select'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 集团加V审核
            .state('app.check.group.with_v_list', {
                url: '/with_v_list/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/with_v_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/with_v_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }).state('app.check.group.with_v_check_view', {
                url: '/with_v_check_view/{id}',
                templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    'src/js/controllers/customer_service/with_v_check_view.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]);
                            });
                        }
                    ]

                }
            }).state('app.check.group.with_v_details_view', {
                url: '/with_v_details_view/{id}',
                templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    'src/js/controllers/customer_service/with_v_check_view.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            // 集团审核
            .state('app.check.group.check_list', {
                url: '/check_list/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/group_check_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }).state('app.check.group.check_view', {
                url: '/check_view/{id}',
                templateUrl: 'src/tpl/customer_service/group_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox,JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            }).state('app.check.group.details_view', {
                url: '/details_view/{id}/{groupId}',
                templateUrl: 'src/tpl/customer_service/group_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/customer_service/group_check_view.js',
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/rely/qiniu.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox,JQ_CONFIG.dataTable ));
                            });
                        }
                    ]
                }
            }).state('app.group_check_view', {
                url: '/group_check_view/{id}',
                templateUrl: 'src/tpl/customer_service/group_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js'

                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox,JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            }).state('app.group_check_list_nopass', {
                url: '/group_check_list_nopass',
                templateUrl: 'src/tpl/customer_service/group_check_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }).state('app.group_check_undone_view', {
                url: '/group_check_undone',
                templateUrl: 'src/tpl/customer_service/group_check_edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_edit.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.group_check_pass_view', {
                url: '/group_check_pass_view',
                templateUrl: 'src/tpl/customer_service/group_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.group_check_nopass_view', {
                url: '/group_check_nopass_view',
                templateUrl: 'src/tpl/customer_service/group_check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }) // 导入医生
            .state('app.updoctor_view', {
                url: '/group_updoctor_view',
                templateUrl: 'src/tpl/customer_service/updoctor_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    'src/js/controllers/customer_service/updoctor_view.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]);
                            });
                        }
                    ]
                }
            })
            // 护士集团认证审核
            .state('app.vgroup_check_list', {
                url: '/vgroup_check_list/{type}',
                templateUrl: 'src/tpl/v_nurse/vgroup_check_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/v_group_check_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.v_not_details', {
                url: '/v_not_details/{id}',
                templateUrl: 'src/tpl/v_nurse/v_not_details.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/v_not_details.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.v_check_edit', {
                url: '/v_check_edit/{id}',
                templateUrl: 'src/tpl/v_nurse/v_check_edit.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/v_check_edit.js');
                        }
                    ]
                }
            })
            // 订单管理
            .state('app.order_query', {
                url: '/order_query',
                templateUrl: 'src/tpl/v_nurse/order_query.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/order_query.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 充值确认
            .state('app.topUp_confirm', {
                url: '/topUp_confirm',
                templateUrl: 'src/tpl/capitalLibrary/topUp_confirm.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/capitalLibrary/topUp_confirm.js', 'toaster']).then(function() {
                                return uiLoad.load(JQ_CONFIG.moment);
                            });
                        }
                    ]
                }
            })
            .state('app.order_list', {
                url: '/order_list/{id}',
                templateUrl: 'src/tpl/v_nurse/order_list.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/order_list.js');
                        }
                    ]
                }
            })
            .state('app.order_query.order_details', {
                url: '/order_details/{id}',
                templateUrl: 'src/tpl/v_nurse/order_details.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/order_details.js');
                        }
                    ]
                }
            })
            .state('app.nurse_order_list', {
                url: '/nurse_order_list/{type}',
                templateUrl: 'src/tpl/v_nurse/nurse_order_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/nurse_order_list.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })

        .state('app.o_not_details', {
                url: '/o_not_details/{id}',
                templateUrl: 'src/tpl/v_nurse/o_not_details.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/o_not_details.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.o_pass_details', {
                url: '/o_pass_details/{id}',
                templateUrl: 'src/tpl/v_nurse/o_pass_details.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/o_pass_details.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.o_cancel_details', {
                url: '/o_cancel_details/{id}',
                templateUrl: 'src/tpl/v_nurse/o_cancel_details.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/o_cancel_details.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.o_ing_details', {
                url: '/o_ing_details/{id}',
                templateUrl: 'src/tpl/v_nurse/o_ing_details.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/v_nurse/o_ing_details.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 医生资质审核
            .state('app.check_pass_view', {
                url: '/check_pass_view/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/check_pass_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/check_pass_view.js');
                        }
                    ]
                }
            }).state('app.check_nopass_view', {
                url: '/check_nopass_view/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/check_nopass_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/customer_service/check_nopass_view.js'
                            ]);
                        }
                    ]
                }
            }).state('app.check_nocheck_view', {
                url: '/check_nocheck_view/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/check_nocheck_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/check_nocheck_view.js');
                        }
                    ]
                }
            }).state('app.check_view', {
                url: '/check_view/{type}/{page}',
                templateUrl: 'src/tpl/customer_service/check_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/customer_service/check_view.js',
                                'ui.select'
                            ]);
                        }
                    ]
                }
            }).state('app.check_edit', {
                url: '/check_edit',
                templateUrl: 'src/tpl/customer_service/check_edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/customer_service/check_edit.js',
                                'src/js/directives/ui-picpreview.js',
                                'ui.select',
                                // 七牛上传文件组建
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/rely/qiniu.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                            });
                        }
                    ]
                }
            }).state('app.feedback_undone', {
                url: '/feedback_undone',
                templateUrl: 'src/tpl/customer_service/feedback_undone.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_undone.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            }).state('app.feedback_view', {
                url: '/feedback_view',
                templateUrl: 'src/tpl/customer_service/feedback_view.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_view.js');
                        }
                    ]
                }
            })
            // 订单
            .state('app.order', {
                url: '/order',
                templateUrl: 'src/tpl/order/order.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/order/order.js');
                        }
                    ]
                }
            })
            .state('app.order.orderList', {
                url: '/orderList',
                templateUrl: 'src/tpl/order/orderList.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/order/orderList.js', 'ui.select']);
                        }
                    ]
                }
            })
            .state('app.order.orderDetail', {
                url: '/orderDetail/{id}',
                templateUrl: 'src/tpl/order/orderDetail.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load('src/js/controllers/order/orderDetail.js');
                        }
                    ]
                }
            })
            .state('app.order.done', {
                url: '/done',
                templateUrl: 'src/tpl/order/order_done.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/order/order_done.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.order.undo', {
                url: '/undo',
                templateUrl: 'src/tpl/order/order_undo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/order/order_undo.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //企业管理-拆分
            .state('app.ComMan', {
                url: '/ComMan',
                template: '<div ui-view></div>'
            })
            .state('app.ComMan.list', {
                url: '/list/:type',
                templateUrl: 'src/tpl/companyManage/Company_List.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/companyManage/Company_List.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //添加企业-拆分
            .state('app.ComMan.create', {
                url: '/create',
                templateUrl: 'src/tpl/companyManage/Company_Create.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load([
                                    'src/js/controllers/companyManage/Company_Create.js',
                                    '../components/formValidate/formValidate.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //企业编辑-拆分
            .state('app.ComMan.edit', {
                url: '/edit/{companyId}/{type}',
                templateUrl: 'src/tpl/companyManage/Company_Edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/companyManage/Company_Edit.js',
                                    '../components/formValidate/formValidate.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]

                }
            })
            //企业查看-拆分
            .state('app.ComMan.info', {
                url: '/info/{companyId}/{type}',
                templateUrl: 'src/tpl/companyManage/Company_info.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/companyManage/Company_info.js',
                                    '../components/formValidate/formValidate.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]

                }
            })
            // 品种库管理-拆分
            .state('app.VarietyManage', {
                url: '/VarietyManage',
                template: '<div ui-view></div>'
            })
            // 品种组列表-拆分
            .state('app.VarietyManage.list', {
                url: '/list',
                templateUrl: 'src/tpl/varietyManage/varietyList.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/varietyManage/varietyList.js',

                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.dataTable);
                                });
                            })
                        }
                    ]
                }
            })
            //品种信息列表-拆分
            .state('app.VarietyManage.goodMoreList', {
                url: '/goodMoreList?groupId',
                templateUrl: 'src/tpl/varietyManage/VarietyGoodsList.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/varietyManage/VarietyGoodsList.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //添加品种-拆分
            .state('app.VarietyManage.add', {
                url: '/add',
                templateUrl: 'src/tpl/varietyManage/varietyAddGoodsGrooup.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                //
                                '../components/chineseUperFisrtLetter/chineseUperFirstLetter.js',

                                'src/js/controllers/varietyManage/varietyAddGoodsGrooup.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]

                }
            })
            //品种信息编辑-拆分
            .state('app.VarietyManage.edit', {
                url: '/edit?id',
                templateUrl: 'src/tpl/varietyManage/varietyEditGoodsGrooup.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                //
                                '../components/chineseUperFisrtLetter/chineseUperFirstLetter.js',

                                'src/js/controllers/varietyManage/varietyEditGoodsGrooup.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //品种审核列表-拆分
            .state('app.VarietyManage.check', {
                url: '/check',
                templateUrl: 'src/tpl/varietyManage/checkGoodList.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/varietyManage/checkGoodList.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]

                }
            })
            //新建品种信息-拆分
            .state('app.VarietyManage.addVart', {
                url: '/addVart?id',
                templateUrl: 'src/tpl/varietyManage/addVarietyInfo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/varietyManage/addVarietyInfo.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }

            })
            //编辑品种信息-拆分
            .state('app.VarietyManage.editVart', {
                url: '/editVart?vartId',
                templateUrl: 'src/tpl/varietyManage/editVarietyInfo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/varietyManage/editVarietyInfo.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]

                }
            })
            //复制品种信息-拆分
            .state('app.VarietyManage.copyVart', {
                url: '/copyVart?vartId',
                templateUrl: 'src/tpl/varietyManage/copyVarietyInfo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/varietyManage/copyVarietyInfo.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]
                }
            })
            //查看品种信息-拆分
            .state('app.VarietyManage.lookVart', {
                url: '/lookVart?vartId',
                templateUrl: 'src/tpl/varietyManage/lookVarietyInfo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                'src/js/controllers/varietyManage/lookVarietyInfo.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]

                }
            })
            //审核品种信息-拆分
            .state('app.VarietyManage.checkVart', {
                url: '/checkVart?vartId',
                templateUrl: 'src/tpl/varietyManage/checkVarietyInfo.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                'src/js/controllers/varietyManage/checkVarietyInfo.js'
                                //'src/js/controllers/care/editInfo.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
                            });
                        }
                    ]

                }
            })
            // 文档中心
            .state('app.document', {
                url: '/document',
                template: '<div ui-view></div>'
            })
            //文章列表
            .state('app.document.article_list', {
                url: '/list',
                templateUrl: 'src/tpl/document/article_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/article_list.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //新建文章
            .state('app.document.create_article', {
                url: '/create_article',
                templateUrl: 'src/tpl/document/edit_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load({
                                    files: ['src/js/controllers/document/edit_article.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ],
                                    cache: false
                                }).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑文章
            .state('app.document.edit_article', {
                url: '/edit_article/{id}',
                templateUrl: 'src/tpl/document/edit_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //浏览文章
            .state('article', {
                url: '/document/article/{id}',
                templateUrl: 'src/tpl/document/article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load('src/js/controllers/document/article.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //浏览页面的编辑文章
            .state('edit_article', {
                url: '/document/edit_article/{id}',
                templateUrl: 'src/tpl/document/edit_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //健康科普列表
            //.state('app.document.health', {
            //    url: '/health',
            //    template: '<div ui-view></div>'
            //})
            .state('app.document.health_science', {
                url: '/health_science',
                templateUrl: 'src/tpl/document/health_science.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('angularBootstrapNavTree');
                                }
                            ).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/health_science.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //个性化页面
            .state('app.document.personal', {
                url: '/create_health_science/{id}/{name}',
                templateUrl: 'src/tpl/document/doctor_personal_profile.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/doctor_personal_profile.js',
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //新建健康科普
            .state('app.document.create_health_science', {
                url: '/create_health_science',
                templateUrl: 'src/tpl/document/edit_health_science.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑健康科普
            .state('app.document.edit_health_science', {
                url: '/edit_health_science/{id}',
                templateUrl: 'src/tpl/document/edit_health_science.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster']).then(function() {
                                return $ocLazyLoad.load('src/js/controllers/document/edit_health_science.js').then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //查看健康科普文章
            .state('health_science_article', {
                url: '/document/health_science_article/{id}',
                templateUrl: 'src/tpl/document/health_science_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(function() {
                                return $ocLazyLoad.load('src/js/controllers/document/health_science_article.js');
                            });
                        }
                    ]
                }
            })
            //查看健康科普页面的编辑文章
            .state('edit_health_science', {
                url: '/document/edit_health_science/{id}',
                templateUrl: 'src/tpl/document/edit_health_science.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //患者广告条
            .state('app.document.patient_ad', {
                url: '/patient_ad',
                templateUrl: 'src/tpl/document/patient_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/patient_adv.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //药店广告条
            .state('app.document.drug_ad', {
                url: '/drug_ad',
                templateUrl: 'src/tpl/document/drugbanner/drug_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/document/drugbanner/drug_adv.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
                            });
                        }
                    ]
                }
            })
            //新建患者广告
            .state('app.document.create_patient_ad', {
                url: '/create_patient_ad',
                templateUrl: 'src/tpl/document/edit_patient_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //新建药店广告
            .state('app.document.create_drug_ad', {
                url: '/create_drug_ad',
                templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑患者广告
            .state('app.document.edit_patient_ad', {
                url: '/edit_patient_ad/{id}',
                templateUrl: 'src/tpl/document/edit_patient_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js', // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑药店广告
            .state('app.document.edit_drug_ad', {
                url: '/edit_drug_ad/{id}',
                templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //查看患者广告文章
            .state('patient_ad_article', {
                url: '/document/patient_adv_article/{id}',
                templateUrl: 'src/tpl/document/patient_adv_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(function() {
                                return $ocLazyLoad.load('src/js/controllers/document/patient_adv_article.js');
                            });
                        }
                    ]
                }
            })
            //查看药店广告文章
            .state('drug_ad_article', {
                url: '/document/drug_adv_article/{id}',
                templateUrl: 'src/tpl/document/drugbanner/drug_adv_article.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(function() {
                                return $ocLazyLoad.load('src/js/controllers/document/drugbanner/drug_adv_article.js');
                            });
                        }
                    ]
                }
            })
            //查看患者广告页面的编辑文章
            .state('edit_patient_ad', {
                url: '/document/edit_patient_ad/{id}',
                templateUrl: 'src/tpl/document/drugbanner/edit_patient_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //查看药店广告页面的编辑文章
            .state('edit_drug_ad', {
                url: '/document/edit_drug_ad/{id}',
                templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //公众账号start
            .state('app.public_msg_list', {
                url: '/public_msg_list',
                templateUrl: 'src/tpl/public_msg/public_msg_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/public_msg/public_msg_list.js');
                        }
                    ]
                }
            })
            .state('app.patients_list', {
                url: '/patients_list/{username}',
                templateUrl: 'src/tpl/groupmanagement/patients_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                ['src/js/controllers/groupmanagement/patients_list.js']
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                            });
                        }
                    ]
                }
            })
            .state('app.disease_list', {
                url: '/disease_list',
                templateUrl: 'src/tpl/groupmanagement/disease_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                ['src/js/controllers/groupmanagement/disease_list.js']
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                            });
                        }
                    ]
                }
            })
            .state('app.msg_manage', {
                url: '/msg_manage/{id}',
                templateUrl: 'src/tpl/public_msg/msg_manage.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/public_msg/msg_manage.js');
                        }
                    ]
                }
            })
            .state('app.msg_manage.send_msg', {
                url: '/send_msg',
                templateUrl: 'src/tpl/public_msg/send_msg.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/public_msg/send_msg.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            .state('app.msg_manage.msg_history', {
                url: '/msg_history',
                templateUrl: 'src/tpl/public_msg/msg_history.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/public_msg/msg_history.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.msg_manage.setting', {
                url: '/setting',
                templateUrl: 'src/tpl/public_msg/setting.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(
                                function() {
                                    return $ocLazyLoad.load(['src/js/controllers/public_msg/setting.js',
                                        // 七牛上传文件组件
                                        '../components/qiniuUploader/rely/plupload.full.min.js',
                                        '../components/qiniuUploader/qiniuUploaderController.js',
                                        '../components/qiniuUploader/qiniuUploaderDirective.js'
                                    ]);
                                }
                            );
                        }
                    ]
                }
            })
            //公众账号end
            //短信查询
            .state('app.message', {
                url: '/message',
                template: '<div ui-view></div>'
            })
            .state('app.message.query', {
                url: '/query',
                templateUrl: 'src/tpl/message/message_query.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('src/js/controllers/message/message_query.js').then(function() {
                                return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
                            });
                        }
                    ]
                }
            })
            //短信模板
            .state('app.message.tpl', {
                url: '/tpl',
                templateUrl: 'src/tpl/message/message_tpl.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load('toaster').then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/message/message_tpl.js');
                                }
                            ).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            //编辑短信模板
            .state('app.message.tpl_edit', {
                url: '/tpl_edit/:id',
                templateUrl: 'src/tpl/message/edit_message_tpl.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/message/edit_message_tpl.js');
                                }
                            );
                        }
                    ]
                }
            })
            //短信发送
            .state('app.message.sending', {
                url: '/sending',
                templateUrl: 'src/tpl/message/message_sending.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/message/message_sending.js');
                                }
                            );
                        }
                    ]
                }
            })
            .state('app.message.sending_BDJL', {
                url: '/sending_BDJL',
                templateUrl: 'src/tpl/message/message_sending_BDJL.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                function() {
                                    return $ocLazyLoad.load('src/js/controllers/message/message_sending_BDJL.js');
                                }
                            );
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
                templateUrl: '../src/tpl/care/care_plan_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/care_plan_list.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-关怀计划
            .state('app.carePlan', {
                url: '/carePlan/:planId',
                templateUrl: '../src/tpl/care/carePlan/carePlan.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                '../src/js/controllers/care/carePlan/editInfo.js',
                                '../src/js/controllers/care/carePlan/addOtherRemind.js',
                                '../src/js/controllers/care/carePlan/addMedication.js',
                                '../src/js/controllers/care/carePlan/addCheckRemind.js',
                                '../src/js/controllers/care/carePlan/addLifeQuality.js',
                                '../src/js/controllers/care/carePlan/addSurvey.js',
                                '../src/js/controllers/care/carePlan/addCheckDocReply.js',
                                '../src/js/controllers/care/carePlan/addIllnessTrack.js',
                                '../src/js/controllers/care/carePlan/addText.js',
                                '../src/js/controllers/care/carePlan/carePlan.js'
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
                templateUrl: '../src/tpl/care/lifeQualityLibrary/lifeQualityLibrary.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                '../src/js/controllers/care/lifeQualityLibrary/lifeQualityLibrary.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-创建量表
            .state('app.editLifeQuality', {
                url: '/editLifeQuality/:lifeScaleId/:version',
                templateUrl: '../src/tpl/care/lifeQualityLibrary/editLifeQuality.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                '../components/chooseDepartment/chooseDepartmentService.js',
                                '../src/js/controllers/care/lifeQualityLibrary/editLifeQuality.js',
                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js'


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
                templateUrl: '../src/tpl/care/surveyLibrary/surveyLibrary.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                '../src/js/controllers/care/surveyLibrary/surveyLibrary.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });
                        }
                    ]
                }
            })
            //健康关怀计划-编辑调查表
            .state('app.editorSurvey', {
                url: '/editorSurvey/:surveyId/:version',
                templateUrl: '../src/tpl/care/surveyLibrary/editorSurvey.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',
                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                '../components/chooseDepartment/chooseDepartmentService.js',
                                '../src/js/controllers/care/surveyLibrary/editorSurvey.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.tree);
                            });;
                        }
                    ]
                }
            })
            //健康关怀计划-病情跟踪题库
            .state('app.care_plan.diseaseTrackDatabase', {
                url: '/diseaseTrackDatabase',
                templateUrl: '../src/tpl/care/diseaseTrackDatabase/disease_track_database.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器

                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',
                                '../src/js/controllers/care/carePlan/addIllnessTrack.js',
                                '../src/js/controllers/care/diseaseTrackDatabase/disease_track_database.js'
                            ]).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //随访表
            .state('app.follow_up_table', {
                url: '/follow_up_table/:planId',
                templateUrl: '../src/tpl/care/follow_up_table.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/follow_up_table.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
                            });
                        }
                    ]
                }
            })
            //新增随访
            .state('app.new_follow_up', {
                url: '/new_follow_up/:planId',
                templateUrl: '../src/tpl/care/new_follow_up.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/new_follow_up.js']).then(
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
                templateUrl: '../src/tpl/care/followUp/followUp.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'toaster',
                                'xeditable',

                                // 七牛上传文件组件
                                '../components/qiniuUploader/rely/plupload.full.min.js',
                                '../components/qiniuUploader/qiniuUploaderController.js',
                                '../components/qiniuUploader/qiniuUploaderDirective.js',
                                // 百度富文本编辑器
                                '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.min.js',
                                '../components/ngUmeditor/umeditor/umeditor.config.js',
                                '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                '../components/ngUmeditor/ngUmeditorController.js',
                                '../components/ngUmeditor/ngUmeditorDirective.js',

                                // 时间选择组件
                                '../components/timeSetCpn/timeSetCpnDirective.js',

                                '../src/js/controllers/care/carePlan/editInfo.js',
                                '../src/js/controllers/care/carePlan/addOtherRemind.js',
                                '../src/js/controllers/care/carePlan/addMedication.js',
                                '../src/js/controllers/care/carePlan/addCheckRemind.js',
                                '../src/js/controllers/care/carePlan/addLifeQuality.js',
                                '../src/js/controllers/care/carePlan/addSurvey.js',
                                '../src/js/controllers/care/carePlan/addCheckDocReply.js',
                                '../src/js/controllers/care/carePlan/addIllnessTrack.js',

                                '../src/js/controllers/care/carePlan/addText.js',
                                '../src/js/controllers/care/followUp/addArticle.js',
                                '../src/js/controllers/care/followUp/followUp.js'
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
            // 集团收入结算
            .state('app.reports_of_finance', {
                url: '/reports_of_finance/{name}',
                templateUrl: 'src/tpl/finance/reports_of_finance.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/finance/reports_of_finance.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.statistic_of_report', {
                url: '/statistic_of_report',
                templateUrl: 'src/tpl/finance/statistic_of_report.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/finance/statistic_of_report.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.settlement_of_finance', {
                url: '/settlement_of_finance/{name}/{date}',
                templateUrl: 'src/tpl/finance/settlement_of_finance.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/finance/settlement_of_finance.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            // 导医管理
            .state('app.account', {
                url: '/account',
                template: '<div ui-view></div>',
            })
            .state('app.account.guider', {
                url: '/guider',
                templateUrl: 'src/tpl/account/guider_account.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/account/guider_account.js', 'src/js/directives/xg-table.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.account.docHelper', {
                url: '/docHelper',
                templateUrl: 'src/tpl/account/doc_helper_account.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/account/doc_helper_account.js', 'src/js/directives/xg-table.js']).then(function() {
                                return uiLoad.load(JQ_CONFIG.dataTable);
                            });
                        }
                    ]
                }
            })
            .state('app.password', {
                url: '/password',
                templateUrl: 'src/tpl/account/password.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/account/password.js']).then(function() {
                                //return uiLoad.load();
                            });
                        }
                    ]
                }
            })
            //医院
            .state('app.hospital', {
                url: '/hospital',
                template: '<div ui-view></div>'
            })
            //医院列表
            .state('app.hospital.list', {
                url: '/list',
                templateUrl: 'src/tpl/hospital/hospital_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/hospital/hospital_list.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js', 'src/js/directives/xg-table.js', 'toaster']);
                        }
                    ]
                }
            })
            //医院信息
            .state('app.hospital.Info', {
                url: '/Info?hospitalId',
                templateUrl: 'src/tpl/hospital/hospital_Info.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['src/js/controllers/hospital/hospital_Info.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js', 'src/js/directives/xg-table.js', 'toaster']);
                        }
                    ]

                }
            })
            //编辑医院
            .state('app.hospital.edit', {
                url: '/edit/{hospitalId}',
                templateUrl: 'src/tpl/hospital/hospital_edit.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'ui.select',
                                'toaster',
                                '../components/searchDoctorModal/searchDoctorModalService.js',
                                '../components/searchDoctorModal/searchDoctorModalController.js',
                                'src/js/directives/xg-table.js',
                                'src/js/controllers/hospital/hospital_edit.js',
                                'src/js/controllers/consultation/consult_detail.js',
                            ]);
                        }
                    ]
                }
            })
            //会诊
            .state('app.consultation', {
                url: '/consultation',
                template: '<ui-view></ui-view>'
            })
            .state('app.consultation.list', {
                url: '/list',
                templateUrl: 'src/tpl/consultation/consult_list.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_list.js', 'src/js/directives/xg-table.js']);
                        }
                    ]
                }
            })
            .state('app.consultation.detail', {
                url: '/id/{id}',
                templateUrl: 'src/tpl/consultation/consult_detail.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_detail.js', 'src/js/directives/xg-table.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js']);
                        }
                    ]
                }
            })
            // 健康社区
            .state('app.community', {
                url: '/community',
                templateUrl: 'src/tpl/community/community_nav.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/community_nav.js'
                            ]);
                        }
                    ]
                }
            })
            // 社区首页（推荐帖子列表）
            .state('app.community.list', {
                url: '/list/{id}',
                templateUrl: 'src/tpl/community/community_list.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/community_list.js',
                            ]);
                        }
                    ]
                }
            })
            // 发帖列表
            .state('app.community.myPost', {
                url: '/myPost',
                templateUrl: 'src/tpl/community/my_post.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/my_post.js',
                            ]);
                        }
                    ]
                }
            })
            //浏览文章
            .state('postDetail', {
                url: '/postDetail/{id}',
                templateUrl: 'src/tpl/community/post_detail.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                [
                                    'toaster', 'ngFileUpload',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',

                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',

                                    'src/js/controllers/community/post_detail.js',

                                    'src/js/filters/faceIconFilterContentDirective.js',
                                ]
                            );
                        }
                    ]
                }
            })
            //浏览文章
            .state('postDetailCheck', {
                url: '/postDetailCheck/{id}/{type}/{page}/{zt}/{topid}',
                templateUrl: 'src/tpl/community/post_detail_check.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(
                                [
                                    'toaster', 'ngFileUpload',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',

                                    'src/js/controllers/community/post_detail_check.js',
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',
                                    'src/js/filters/faceIconFilterContentDirective.js',
                                ]
                            );
                        }
                    ]
                }
            })
            // // 发帖
            // .state('app.community.createPost', {
            //     url: '/createPost',
            //     templateUrl: 'src/tpl/community/edit_post.html',
            //     resolve: {
            //         deps: ['$ocLazyLoad', 'uiLoad',
            //             function($ocLazyLoad, uiLoad) {
            //                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
            //                     return $ocLazyLoad.load({
            //                         files: ['src/js/controllers//community/edit_post.js',
            //                             // 七牛上传文件组件
            //                             '../components/qiniuUploader/rely/plupload.full.min.js',
            //                             '../components/qiniuUploader/qiniuUploaderController.js',
            //                             '../components/qiniuUploader/qiniuUploaderDirective.js'
            //                         ]
            //                     }).then(function() {
            //                         return uiLoad.load(JQ_CONFIG.umeditor);
            //                     });
            //                 });
            //             }
            //         ]
            //     }
            // })
            // // 编辑帖子
            // .state('app.community.editPost', {
            //     url: '/editPost/{id}',
            //     templateUrl: 'src/tpl/community/edit_post.html',
            //     resolve: {
            //         deps: ['$ocLazyLoad', 'uiLoad',
            //             function($ocLazyLoad, uiLoad) {
            //                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
            //                     return $ocLazyLoad.load({
            //                         files: ['src/js/controllers/community/edit_post.js',
            //                             // 七牛上传文件组件
            //                             '../components/qiniuUploader/rely/plupload.full.min.js',
            //                             '../components/qiniuUploader/qiniuUploaderController.js',
            //                             '../components/qiniuUploader/qiniuUploaderDirective.js'
            //                         ]
            //                     }).then(function() {
            //                         return uiLoad.load(JQ_CONFIG.umeditor);
            //                     });
            //                 });
            //             }
            //         ]
            //     }
            // })
            // 新建帖子--图文(健康社区)
            .state('app.community.create_post_imgt', {
                url: '/create_post_imgt',
                templateUrl: 'src/tpl/community/create_post_imgt.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    '../components/myFileSelectBox/myFileSelectBox.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    'src/js/controllers/community/create_post_imgt.js?rev=@@hash',
                                    '../components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            // 编辑帖子--图文(健康社区)
            .state('app.community.edit_post_imgt', {
                url: '/edit_post_imgt/{id}/{postType}',
                templateUrl: 'src/tpl/community/create_post_imgt.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    '../components/myFileSelectBox/myFileSelectBox.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    'src/js/controllers/community/create_post_imgt.js?rev=@@hash',
                                    '../components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            // 新建帖子--视频(健康社区)
            .state('app.community.create_post_video', {
                url: '/create_post_video',
                templateUrl: 'src/tpl/community/create_post_video.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    '../components/myFileSelectBox/myFileSelectBox.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    'src/js/controllers/community/create_post_video.js?rev=@@hash',
                                    '../components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            // 编辑帖子--图文(健康社区)
            .state('app.community.edit_post_video', {
                url: '/edit_post_video/{id}/{postType}',
                templateUrl: 'src/tpl/community/create_post_video.html?rev=@@hash',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load([
                                    '../components/myFileSelectBox/myFileSelectBox.js',
                                    // 百度富文本编辑器
                                    '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.min.js',
                                    '../components/ngUmeditor/umeditor/umeditor.config.js',
                                    '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
                                    '../components/ngUmeditor/ngUmeditorController.js',
                                    '../components/ngUmeditor/ngUmeditorDirective.js',

                                    'src/js/controllers/community/create_post_video.js?rev=@@hash',
                                    '../components/qiniuUploader/rely/plupload.full.min.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderController.js?rev=@@hash',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js?rev=@@hash'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //bander管理
            .state('app.community.banner', {
                url: '/banner',
                templateUrl: 'src/tpl/community/banner.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/community/bannerCtrl.js',
                                    // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            //编辑banner
            .state('app.community.editbanner', {
                url: '/upload_banner/{id}',
                templateUrl: 'src/tpl/community/upload_banner.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
                                return $ocLazyLoad.load(['src/js/controllers/community/uploadbannerCtrl.js', // 七牛上传文件组件
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js'
                                ]).then(function() {
                                    return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
                                });
                            });
                        }
                    ]
                }
            })
            // 栏目管理
            .state('app.community.column', {
                url: '/column',
                templateUrl: 'src/tpl/community/column.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/columnCtrl.js',
                            ]);
                        }
                    ]
                }
            })
            // 帖子审核
            .state('app.community.checkPost', {
                url: '/checkPost',
                templateUrl: 'src/tpl/community/check_post.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/checkPostCtrl.js',
                            ]);
                        }
                    ]
                }
            })
            // 评论审核
            .state('app.community.checkComment', {
                url: '/checkComment',
                templateUrl: 'src/tpl/community/check_comment.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/checkCommentCtrl.js',
                                'src/js/filters/faceIconFilterContentDirective.js',
                            ]);
                        }
                    ]
                }
            })
            // 举报审核
            .state('app.community.checkReport', {
                url: '/checkReport',
                templateUrl: 'src/tpl/community/check_report.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load([
                                'src/js/controllers/community/checkReportCtrl.js',
                            ]);
                        }
                    ]
                }
            })
            //意见反馈 todo
            .state('app.operate', {
                url: '/operate',
                template: '<ui-view></ui-view>'
            })
            .state('app.operate.feedback', {
                url: '/feedback/{type}',
                templateUrl: 'src/tpl/feedback/feedback.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load({
                                files: ['src/js/controllers/feedback/feedback.js',
                                    'src/css/setting.css',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',
                                    // quickReply
                                    'app/shared/chat_window/quickReply/quickReplyDirective.js',
                                    'app/shared/chat_window/quickReply/quickReplyService.js',
                                    'app/shared/chat_window/quickReply/quickReplyController.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',

                                    // editor
                                    'app/shared/chat_window/editor/editorDirective.js',
                                    'app/shared/chat_window/editor/editorController.js',
                                    //chatImgSelModal
                                    'app/shared/chatImgSelModal/chatImgSelModalService.js',
                                    'app/shared/chatImgSelModal/chatImgSelModalController.js',
                                ]
                            });
                        }
                    ]
                }
            })
            .state('app.drug_data', {
                url: '/drug_data',
                templateUrl: 'src/tpl/drug_data/drug_data.html',
                resolve: {
                    deps: ['$ocLazyLoad', 'uiLoad',
                        function($ocLazyLoad, uiLoad) {
                            return $ocLazyLoad.load(['toaster', 'angularBootstrapNavTree', 'src/js/controllers/drug_data/drug_data.js', 'src/js/directives/xg-table.js']);
                        }
                    ]
                }
            })
            // others
            .state('lockme', {
                url: '/lockme',
                templateUrl: 'src/tpl/lockme.html'
            }).state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            }).state('access.signin', {
                url: '/signin',
                templateUrl: 'src/tpl/signin.html',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/signin.js']);
                        }
                    ]
                }
            }).state('access.signup', {
                url: '/signup',
                templateUrl: 'src/tpl/signup.html',
                resolve: {
                    deps: ['uiLoad',
                        function(uiLoad) {
                            return uiLoad.load(['src/js/controllers/signup.js']);
                        }
                    ]
                }
            }).state('access.forgotpwd', {
                url: '/forgotpwd',
                templateUrl: 'src/tpl/forgotpwd.html'
            }).state('access.404', {
                url: '/404',
                templateUrl: 'src/tpl/404.html'
            })

    }

})()
// angular.module('app').run(
//     ['$rootScope', '$state', '$stateParams',
//         function($rootScope, $state, $stateParams) {
//             $rootScope.$state = $state;
//             $rootScope.$stateParams = $stateParams;
//         }
//     ]).config(
//     ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
//         function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
//             var version = '12121212';
//             $urlRouterProvider.otherwise('/app/home');
//             $stateProvider.state('app', {
//                     abstract: true,
//                     url: '/app',
//                     //templateUrl: 'src/tpl/app.html',
//                     views: {
//                         '': {
//                             templateUrl: 'src/tpl/app.html',
//                             controller: 'AppController'
//                         },
//                         'footer': {
//                             template: '<div id="dialog-container" ui-view></div>'
//                         }
//                     },
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'src/js/directives/ui-medicine.js',
//                                     'src/js/controllers/app_controller.js',
//                                     '../components/rightDrawerDir/rightDrawerDir.js',
//                                     '../components/selectMedicineBox/selectMedicineBoxFat.js',
//                                     '../components/inputValuePlace/inputValuePlace.js',
//
//                                     '../components/trees/treeDir.js',
//                                     '../components/trees/tree.css',
//
//                                     '../components/modelDialog/modelDialogFactory.js'
//                                 ]);
//                             }
//                         ]
//                     }
//                 }).state('app.home', {
//                     url: '/home',
//                     templateUrl: 'src/tpl/home.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/home.js']);
//                             }
//                         ]
//                     }
//                 })
//                 // 医生集团认证审核
//                 .state('app.check', {
//                     url: '/check',
//                     template: '<div ui-view></div>'
//                 }).state('app.check.doctor', {
//                     url: '/doctor',
//                     template: '<div ui-view></div>'
//                 }).state('app.check.group', {
//                     url: '/group',
//                     template: '<div ui-view></div>'
//                 })
//                 // 医生审核
//                 .state('app.check.doctor.check_list', {
//                     url: '/check_list/{type}/{page}',
//                     templateUrl: 'src/tpl/customer_service/doctor_check_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'ui.select',
//                                     'src/js/controllers/customer_service/doctor_check_list.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 创建医生账号
//                 .state('app.check.create_doctor_account', {
//                     url: '/create_doctor_account/{id}/{name}',
//                     templateUrl: 'src/tpl/customer_service/create_doctor_account.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/customer_service/create_doctor_account.js',
//                                     // 七牛上传文件组建
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     'ui.select'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 集团加V审核
//                 .state('app.check.group.with_v_list', {
//                     url: '/with_v_list/{type}/{page}',
//                     templateUrl: 'src/tpl/customer_service/with_v_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/with_v_list.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.check.group.with_v_check_view', {
//                     url: '/with_v_check_view/{id}',
//                     templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load([
//                                         'src/js/controllers/customer_service/with_v_check_view.js',
//                                         // 七牛上传文件组建
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]);
//                                 });
//                             }
//                         ]
//
//                     }
//                 }).state('app.check.group.with_v_details_view', {
//                     url: '/with_v_details_view/{id}',
//                     templateUrl: 'src/tpl/customer_service/with_v_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load([
//                                         'src/js/controllers/customer_service/with_v_check_view.js',
//                                         // 七牛上传文件组建
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 集团审核
//                 .state('app.check.group.check_list', {
//                     url: '/check_list/{type}/{page}',
//                     templateUrl: 'src/tpl/customer_service/group_check_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.check.group.check_view', {
//                     url: '/check_view/{id}',
//                     templateUrl: 'src/tpl/customer_service/group_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.check.group.details_view', {
//                     url: '/details_view/{id}/{groupId}',
//                     templateUrl: 'src/tpl/customer_service/group_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.group_check_view', {
//                     url: '/group_check_view/{id}',
//                     templateUrl: 'src/tpl/customer_service/group_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_view.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.group_check_list_nopass', {
//                     url: '/group_check_list_nopass',
//                     templateUrl: 'src/tpl/customer_service/group_check_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_list.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.group_check_undone_view', {
//                     url: '/group_check_undone',
//                     templateUrl: 'src/tpl/customer_service/group_check_edit.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_edit.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.group_check_pass_view', {
//                     url: '/group_check_pass_view',
//                     templateUrl: 'src/tpl/customer_service/group_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.group_check_nopass_view', {
//                     url: '/group_check_nopass_view',
//                     templateUrl: 'src/tpl/customer_service/group_check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/group_check_views.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })// 导入医生
//                 .state('app.updoctor_view', {
//                     url: '/group_updoctor_view',
//                     templateUrl: 'src/tpl/customer_service/updoctor_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load([
//                                         'src/js/controllers/customer_service/updoctor_view.js',
//                                         // 七牛上传文件组建
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//             // 护士集团认证审核
//             .state('app.vgroup_check_list', {
//                     url: '/vgroup_check_list/{type}',
//                     templateUrl: 'src/tpl/v_nurse/vgroup_check_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/v_group_check_list.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.v_not_details', {
//                     url: '/v_not_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/v_not_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/v_not_details.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.v_check_edit', {
//                     url: '/v_check_edit/{id}',
//                     templateUrl: 'src/tpl/v_nurse/v_check_edit.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/v_check_edit.js');
//                             }
//                         ]
//                     }
//                 })
//                 // 订单管理
//                 .state('app.order_query', {
//                     url: '/order_query',
//                     templateUrl: 'src/tpl/v_nurse/order_query.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/order_query.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 充值确认
//                 .state('app.topUp_confirm', {
//                     url: '/topUp_confirm',
//                     templateUrl: 'src/tpl/capitalLibrary/topUp_confirm.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/capitalLibrary/topUp_confirm.js', 'toaster']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.moment);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order_list', {
//                     url: '/order_list/{id}',
//                     templateUrl: 'src/tpl/v_nurse/order_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/order_list.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order_query.order_details', {
//                     url: '/order_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/order_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/order_details.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.nurse_order_list', {
//                     url: '/nurse_order_list/{type}',
//                     templateUrl: 'src/tpl/v_nurse/nurse_order_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/nurse_order_list.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//
//             .state('app.o_not_details', {
//                     url: '/o_not_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/o_not_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/o_not_details.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.o_pass_details', {
//                     url: '/o_pass_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/o_pass_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/o_pass_details.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.o_cancel_details', {
//                     url: '/o_cancel_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/o_cancel_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/o_cancel_details.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.o_ing_details', {
//                     url: '/o_ing_details/{id}',
//                     templateUrl: 'src/tpl/v_nurse/o_ing_details.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/v_nurse/o_ing_details.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 医生资质审核
//                 .state('app.check_pass_view', {
//                     url: '/check_pass_view',
//                     templateUrl: 'src/tpl/customer_service/check_pass_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/check_pass_view.js');
//                             }
//                         ]
//                     }
//                 }).state('app.check_nopass_view', {
//                     url: '/check_nopass_view',
//                     templateUrl: 'src/tpl/customer_service/check_nopass_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/customer_service/check_nopass_view.js'
//                                 ]);
//                             }
//                         ]
//                     }
//                 }).state('app.check_nocheck_view', {
//                     url: '/check_nocheck_view',
//                     templateUrl: 'src/tpl/customer_service/check_nocheck_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/check_nocheck_view.js');
//                             }
//                         ]
//                     }
//                 }).state('app.check_view', {
//                     url: '/check_view',
//                     templateUrl: 'src/tpl/customer_service/check_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/customer_service/check_view.js',
//                                     'ui.select'
//                                 ]);
//                             }
//                         ]
//                     }
//                 }).state('app.check_edit', {
//                     url: '/check_edit',
//                     templateUrl: 'src/tpl/customer_service/check_edit.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/customer_service/check_edit.js',
//                                     'src/js/directives/ui-picpreview.js',
//                                     'ui.select',
//                                     // 七牛上传文件组建
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/rely/qiniu.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.feedback_undone', {
//                     url: '/feedback_undone',
//                     templateUrl: 'src/tpl/customer_service/feedback_undone.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_undone.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 }).state('app.feedback_view', {
//                     url: '/feedback_view',
//                     templateUrl: 'src/tpl/customer_service/feedback_view.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_view.js');
//                             }
//                         ]
//                     }
//                 })
//                 // 订单
//                 .state('app.order', {
//                     url: '/order',
//                     templateUrl: 'src/tpl/order/order.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/order/order.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order.orderList', {
//                     url: '/orderList',
//                     templateUrl: 'src/tpl/order/orderList.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/order/orderList.js', 'ui.select']);
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order.orderDetail', {
//                     url: '/orderDetail/{id}',
//                     templateUrl: 'src/tpl/order/orderDetail.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/order/orderDetail.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order.done', {
//                     url: '/done',
//                     templateUrl: 'src/tpl/order/order_done.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/order/order_done.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.order.undo', {
//                     url: '/undo',
//                     templateUrl: 'src/tpl/order/order_undo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/order/order_undo.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //企业管理
//                 .state('app.ComMan', {
//                     url: '/ComMan',
//                     template: '<div ui-view></div>'
//                 })
//                 .state('app.ComMan.list', {
//                     url: '/list/:type',
//                     templateUrl: 'src/tpl/companyManage/Company_List.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/companyManage/Company_List.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //添加企业
//                 .state('app.ComMan.create', {
//                     url: '/create',
//                     templateUrl: 'src/tpl/companyManage/Company_Create.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
//                                     return $ocLazyLoad.load([
//                                         'src/js/controllers/companyManage/Company_Create.js',
//                                         '../components/formValidate/formValidate.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //企业编辑
//                 .state('app.ComMan.edit', {
//                     url: '/edit/{companyId}/{type}',
//                     templateUrl: 'src/tpl/companyManage/Company_Edit.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/companyManage/Company_Edit.js',
//                                         '../components/formValidate/formValidate.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 //企业查看
//                 .state('app.ComMan.info', {
//                     url: '/info/{companyId}/{type}',
//                     templateUrl: 'src/tpl/companyManage/Company_info.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ngFileUpload', 'toaster']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/companyManage/Company_info.js',
//                                         '../components/formValidate/formValidate.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 // 品种库管理
//                 .state('app.VarietyManage', {
//                     url: '/VarietyManage',
//                     template: '<div ui-view></div>'
//                 })
//                 // 品种组列表
//                 .state('app.VarietyManage.list', {
//                     url: '/list',
//                     templateUrl: 'src/tpl/varietyManage/varietyList.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/varietyManage/varietyList.js',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                         ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.dataTable);
//                                     });
//                                 })
//                             }
//                         ]
//                     }
//                 })
//                 //品种信息列表
//                 .state('app.VarietyManage.goodMoreList', {
//                     url: '/goodMoreList?groupId',
//                     templateUrl: 'src/tpl/varietyManage/VarietyGoodsList.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/varietyManage/VarietyGoodsList.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //添加品种
//                 .state('app.VarietyManage.add', {
//                     url: '/add',
//                     templateUrl: 'src/tpl/varietyManage/varietyAddGoodsGrooup.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//                                     //
//                                     '../components/chineseUperFisrtLetter/chineseUperFirstLetter.js',
//
//                                     'src/js/controllers/varietyManage/varietyAddGoodsGrooup.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 //品种信息编辑
//                 .state('app.VarietyManage.edit', {
//                     url: '/edit?id',
//                     templateUrl: 'src/tpl/varietyManage/varietyEditGoodsGrooup.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//                                     //
//                                     '../components/chineseUperFisrtLetter/chineseUperFirstLetter.js',
//
//                                     'src/js/controllers/varietyManage/varietyEditGoodsGrooup.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //品种审核列表
//                 .state('app.VarietyManage.check', {
//                     url: '/check',
//                     templateUrl: 'src/tpl/varietyManage/checkGoodList.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/varietyManage/checkGoodList.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 //新建品种信息
//                 .state('app.VarietyManage.addVart', {
//                     url: '/addVart?id',
//                     templateUrl: 'src/tpl/varietyManage/addVarietyInfo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     'src/js/controllers/varietyManage/addVarietyInfo.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//                     }
//
//                 })
//                 //编辑品种信息
//                 .state('app.VarietyManage.editVart', {
//                     url: '/editVart?vartId',
//                     templateUrl: 'src/tpl/varietyManage/editVarietyInfo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     'src/js/controllers/varietyManage/editVarietyInfo.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 //复制品种信息
//                 .state('app.VarietyManage.copyVart', {
//                     url: '/copyVart?vartId',
//                     templateUrl: 'src/tpl/varietyManage/copyVarietyInfo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     'src/js/controllers/varietyManage/copyVarietyInfo.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看品种信息
//                 .state('app.VarietyManage.lookVart', {
//                     url: '/lookVart?vartId',
//                     templateUrl: 'src/tpl/varietyManage/lookVarietyInfo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     'src/js/controllers/varietyManage/lookVarietyInfo.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 //审核品种信息
//                 .state('app.VarietyManage.checkVart', {
//                     url: '/checkVart?vartId',
//                     templateUrl: 'src/tpl/varietyManage/checkVarietyInfo.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     'src/js/controllers/varietyManage/checkVarietyInfo.js'
//                                     //'src/js/controllers/care/editInfo.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//
//                     }
//                 })
//                 // 文档中心
//                 .state('app.document', {
//                     url: '/document',
//                     template: '<div ui-view></div>'
//                 })
//                 //文章列表
//                 .state('app.document.article_list', {
//                     url: '/list',
//                     templateUrl: 'src/tpl/document/article_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('angularBootstrapNavTree');
//                                     }
//                                 ).then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/document/article_list.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable, JQ_CONFIG.clipboard));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新建文章
//                 .state('app.document.create_article', {
//                     url: '/create_article',
//                     templateUrl: 'src/tpl/document/edit_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load({
//                                         files: ['src/js/controllers/document/edit_article.js',
//                                             // 七牛上传文件组件
//                                             '../components/qiniuUploader/rely/plupload.full.min.js',
//                                             '../components/qiniuUploader/qiniuUploaderController.js',
//                                             '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                         ],
//                                         cache: false
//                                     }).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑文章
//                 .state('app.document.edit_article', {
//                     url: '/edit_article/{id}',
//                     templateUrl: 'src/tpl/document/edit_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //浏览文章
//                 .state('article', {
//                     url: '/document/article/{id}',
//                     templateUrl: 'src/tpl/document/article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load('src/js/controllers/document/article.js').then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //浏览页面的编辑文章
//                 .state('edit_article', {
//                     url: '/document/edit_article/{id}',
//                     templateUrl: 'src/tpl/document/edit_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_article.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //健康科普列表
//                 //.state('app.document.health', {
//                 //    url: '/health',
//                 //    template: '<div ui-view></div>'
//                 //})
//                 .state('app.document.health_science', {
//                     url: '/health_science',
//                     templateUrl: 'src/tpl/document/health_science.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('angularBootstrapNavTree');
//                                     }
//                                 ).then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/document/health_science.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //个性化页面
//                 .state('app.document.personal', {
//                     url: '/create_health_science/{id}/{name}',
//                     templateUrl: 'src/tpl/document/doctor_personal_profile.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/doctor_personal_profile.js',
//                                         '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                         '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                         '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                         '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                         '../components/ngUmeditor/ngUmeditorController.js',
//                                         '../components/ngUmeditor/ngUmeditorDirective.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新建健康科普
//                 .state('app.document.create_health_science', {
//                     url: '/create_health_science',
//                     templateUrl: 'src/tpl/document/edit_health_science.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑健康科普
//                 .state('app.document.edit_health_science', {
//                     url: '/edit_health_science/{id}',
//                     templateUrl: 'src/tpl/document/edit_health_science.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster']).then(function() {
//                                     return $ocLazyLoad.load('src/js/controllers/document/edit_health_science.js').then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看健康科普文章
//                 .state('health_science_article', {
//                     url: '/document/health_science_article/{id}',
//                     templateUrl: 'src/tpl/document/health_science_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(function() {
//                                     return $ocLazyLoad.load('src/js/controllers/document/health_science_article.js');
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看健康科普页面的编辑文章
//                 .state('edit_health_science', {
//                     url: '/document/edit_health_science/{id}',
//                     templateUrl: 'src/tpl/document/edit_health_science.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_health_science.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //患者广告条
//                 .state('app.document.patient_ad', {
//                     url: '/patient_ad',
//                     templateUrl: 'src/tpl/document/patient_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/document/patient_adv.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //药店广告条
//                 .state('app.document.drug_ad', {
//                     url: '/drug_ad',
//                     templateUrl: 'src/tpl/document/drugbanner/drug_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/document/drugbanner/drug_adv.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.clipboard));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新建患者广告
//                 .state('app.document.create_patient_ad', {
//                     url: '/create_patient_ad',
//                     templateUrl: 'src/tpl/document/edit_patient_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新建药店广告
//                 .state('app.document.create_drug_ad', {
//                     url: '/create_drug_ad',
//                     templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑患者广告
//                 .state('app.document.edit_patient_ad', {
//                     url: '/edit_patient_ad/{id}',
//                     templateUrl: 'src/tpl/document/edit_patient_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/edit_patient_adv.js', // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑药店广告
//                 .state('app.document.edit_drug_ad', {
//                     url: '/edit_drug_ad/{id}',
//                     templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看患者广告文章
//                 .state('patient_ad_article', {
//                     url: '/document/patient_adv_article/{id}',
//                     templateUrl: 'src/tpl/document/patient_adv_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(function() {
//                                     return $ocLazyLoad.load('src/js/controllers/document/patient_adv_article.js');
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看药店广告文章
//                 .state('drug_ad_article', {
//                     url: '/document/drug_adv_article/{id}',
//                     templateUrl: 'src/tpl/document/drugbanner/drug_adv_article.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(function() {
//                                     return $ocLazyLoad.load('src/js/controllers/document/drugbanner/drug_adv_article.js');
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看患者广告页面的编辑文章
//                 .state('edit_patient_ad', {
//                     url: '/document/edit_patient_ad/{id}',
//                     templateUrl: 'src/tpl/document/drugbanner/edit_patient_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //查看药店广告页面的编辑文章
//                 .state('edit_drug_ad', {
//                     url: '/document/edit_drug_ad/{id}',
//                     templateUrl: 'src/tpl/document/drugbanner/edit_drug_adv.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/document/drugbanner/edit_drug_adv.js', // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //公众账号start
//                 .state('app.public_msg_list', {
//                     url: '/public_msg_list',
//                     templateUrl: 'src/tpl/public_msg/public_msg_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/public_msg/public_msg_list.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.patients_list', {
//                     url: '/patients_list/{username}',
//                     templateUrl: 'src/tpl/groupmanagement/patients_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(
//                                     ['src/js/controllers/groupmanagement/patients_list.js']
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.disease_list', {
//                     url: '/disease_list',
//                     templateUrl: 'src/tpl/groupmanagement/disease_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(
//                                     ['src/js/controllers/groupmanagement/disease_list.js']
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.msg_manage', {
//                     url: '/msg_manage/{id}',
//                     templateUrl: 'src/tpl/public_msg/msg_manage.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/public_msg/msg_manage.js');
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.msg_manage.send_msg', {
//                     url: '/send_msg',
//                     templateUrl: 'src/tpl/public_msg/send_msg.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/public_msg/send_msg.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.msg_manage.msg_history', {
//                     url: '/msg_history',
//                     templateUrl: 'src/tpl/public_msg/msg_history.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/public_msg/msg_history.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.msg_manage.setting', {
//                     url: '/setting',
//                     templateUrl: 'src/tpl/public_msg/setting.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(
//                                     function() {
//                                         return $ocLazyLoad.load(['src/js/controllers/public_msg/setting.js',
//                                             // 七牛上传文件组件
//                                             '../components/qiniuUploader/rely/plupload.full.min.js',
//                                             '../components/qiniuUploader/qiniuUploaderController.js',
//                                             '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                         ]);
//                                     }
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 //公众账号end
//                 //短信查询
//                 .state('app.message', {
//                     url: '/message',
//                     template: '<div ui-view></div>'
//                 })
//                 .state('app.message.query', {
//                     url: '/query',
//                     templateUrl: 'src/tpl/message/message_query.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('src/js/controllers/message/message_query.js').then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.dataTable));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //短信模板
//                 .state('app.message.tpl', {
//                     url: '/tpl',
//                     templateUrl: 'src/tpl/message/message_tpl.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load('toaster').then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/message/message_tpl.js');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑短信模板
//                 .state('app.message.tpl_edit', {
//                     url: '/tpl_edit/:id',
//                     templateUrl: 'src/tpl/message/edit_message_tpl.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster']).then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/message/edit_message_tpl.js');
//                                     }
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 //短信发送
//                 .state('app.message.sending', {
//                     url: '/sending',
//                     templateUrl: 'src/tpl/message/message_sending.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster']).then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/message/message_sending.js');
//                                     }
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.message.sending_BDJL', {
//                     url: '/sending_BDJL',
//                     templateUrl: 'src/tpl/message/message_sending_BDJL.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster']).then(
//                                     function() {
//                                         return $ocLazyLoad.load('src/js/controllers/message/message_sending_BDJL.js');
//                                     }
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-计划列表
//                 .state('app.care_plan', {
//                     url: '/care_plan',
//                     template: '<div ui-view></div>'
//                 })
//                 .state('app.care_plan.list', {
//                     url: '/list',
//                     templateUrl: '../src/tpl/care/care_plan_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/care_plan_list.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-关怀计划
//                 .state('app.carePlan', {
//                     url: '/carePlan/:planId',
//                     templateUrl: '../src/tpl/care/carePlan/carePlan.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     '../src/js/controllers/care/carePlan/editInfo.js',
//                                     '../src/js/controllers/care/carePlan/addOtherRemind.js',
//                                     '../src/js/controllers/care/carePlan/addMedication.js',
//                                     '../src/js/controllers/care/carePlan/addCheckRemind.js',
//                                     '../src/js/controllers/care/carePlan/addLifeQuality.js',
//                                     '../src/js/controllers/care/carePlan/addSurvey.js',
//                                     '../src/js/controllers/care/carePlan/addCheckDocReply.js',
//                                     '../src/js/controllers/care/carePlan/addIllnessTrack.js',
//                                     '../src/js/controllers/care/carePlan/addText.js',
//                                     '../src/js/controllers/care/carePlan/carePlan.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-生活量表题库
//                 .state('app.care_plan.lifeQualityLibrary', {
//                     url: '/lifeQualityLibrary',
//                     templateUrl: '../src/tpl/care/lifeQualityLibrary/lifeQualityLibrary.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     '../src/js/controllers/care/lifeQualityLibrary/lifeQualityLibrary.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-创建量表
//                 .state('app.editLifeQuality', {
//                     url: '/editLifeQuality/:lifeScaleId/:version',
//                     templateUrl: '../src/tpl/care/lifeQualityLibrary/editLifeQuality.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//                                     '../components/chooseDepartment/chooseDepartmentService.js',
//                                     '../src/js/controllers/care/lifeQualityLibrary/editLifeQuality.js',
//                                           // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js'
//
//
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree);
//                                 });;
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-调查表库
//                 .state('app.care_plan.surveyLibrary', {
//                     url: '/surveyLibrary',
//                     templateUrl: '../src/tpl/care/surveyLibrary/surveyLibrary.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     '../src/js/controllers/care/surveyLibrary/surveyLibrary.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-编辑调查表
//                 .state('app.editorSurvey', {
//                     url: '/editorSurvey/:surveyId/:version',
//                     templateUrl: '../src/tpl/care/surveyLibrary/editorSurvey.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     '../components/chooseDepartment/chooseDepartmentService.js',
//                                     '../src/js/controllers/care/surveyLibrary/editorSurvey.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.tree);
//                                 });;
//                             }
//                         ]
//                     }
//                 })
//                 //健康关怀计划-病情跟踪题库
//                 .state('app.care_plan.diseaseTrackDatabase', {
//                     url: '/diseaseTrackDatabase',
//                     templateUrl: '../src/tpl/care/diseaseTrackDatabase/disease_track_database.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//                                     '../src/js/controllers/care/carePlan/addIllnessTrack.js',
//                                     '../src/js/controllers/care/diseaseTrackDatabase/disease_track_database.js'
//                                 ]).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //随访表
//                 .state('app.follow_up_table', {
//                     url: '/follow_up_table/:planId',
//                     templateUrl: '../src/tpl/care/follow_up_table.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/follow_up_table.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新增随访
//                 .state('app.new_follow_up', {
//                     url: '/new_follow_up/:planId',
//                     templateUrl: '../src/tpl/care/new_follow_up.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', '../src/js/controllers/care/new_follow_up.js']).then(
//                                     function() {
//                                         return $ocLazyLoad.load('angularBootstrapNavTree');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //新增随访
//                 .state('app.followUp', {
//                     url: '/followUp/:planId',
//                     templateUrl: '../src/tpl/care/followUp/followUp.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'toaster',
//                                     'xeditable',
//
//                                     // 七牛上传文件组件
//                                     '../components/qiniuUploader/rely/plupload.full.min.js',
//                                     '../components/qiniuUploader/qiniuUploaderController.js',
//                                     '../components/qiniuUploader/qiniuUploaderDirective.js',
//                                     // 百度富文本编辑器
//                                     '../components/ngUmeditor/umeditor/third-party/jquery.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.min.js',
//                                     '../components/ngUmeditor/umeditor/umeditor.config.js',
//                                     '../components/ngUmeditor/umeditor/themes/default/css/umeditor.min.css',
//                                     '../components/ngUmeditor/ngUmeditorController.js',
//                                     '../components/ngUmeditor/ngUmeditorDirective.js',
//
//                                     // 时间选择组件
//                                     '../components/timeSetCpn/timeSetCpnDirective.js',
//
//                                     '../src/js/controllers/care/carePlan/editInfo.js',
//                                     '../src/js/controllers/care/carePlan/addOtherRemind.js',
//                                     '../src/js/controllers/care/carePlan/addMedication.js',
//                                     '../src/js/controllers/care/carePlan/addCheckRemind.js',
//                                     '../src/js/controllers/care/carePlan/addLifeQuality.js',
//                                     '../src/js/controllers/care/carePlan/addSurvey.js',
//                                     '../src/js/controllers/care/carePlan/addCheckDocReply.js',
//                                     '../src/js/controllers/care/carePlan/addIllnessTrack.js',
//
//                                     '../src/js/controllers/care/carePlan/addText.js',
//                                     '../src/js/controllers/care/followUp/addArticle.js',
//                                     '../src/js/controllers/care/followUp/followUp.js'
//                                 ]).then(
//                                     function() {
//                                         return $ocLazyLoad.load('angularBootstrapNavTree');
//                                     }
//                                 ).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable.concat(JQ_CONFIG.tree, JQ_CONFIG.databox));
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 集团收入结算
//                 .state('app.reports_of_finance', {
//                     url: '/reports_of_finance/{name}',
//                     templateUrl: 'src/tpl/finance/reports_of_finance.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/finance/reports_of_finance.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.statistic_of_report', {
//                     url: '/statistic_of_report',
//                     templateUrl: 'src/tpl/finance/statistic_of_report.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/finance/statistic_of_report.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.settlement_of_finance', {
//                     url: '/settlement_of_finance/{name}/{date}',
//                     templateUrl: 'src/tpl/finance/settlement_of_finance.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/finance/settlement_of_finance.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 导医管理
//                 .state('app.account', {
//                     url: '/account',
//                     template: '<div ui-view></div>',
//                 })
//                 .state('app.account.guider', {
//                     url: '/guider',
//                     templateUrl: 'src/tpl/account/guider_account.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/account/guider_account.js', 'src/js/directives/xg-table.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.account.docHelper', {
//                     url: '/docHelper',
//                     templateUrl: 'src/tpl/account/doc_helper_account.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/account/doc_helper_account.js', 'src/js/directives/xg-table.js']).then(function() {
//                                     return uiLoad.load(JQ_CONFIG.dataTable);
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.password', {
//                     url: '/password',
//                     templateUrl: 'src/tpl/account/password.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/account/password.js']).then(function() {
//                                     //return uiLoad.load();
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //医院
//                 .state('app.hospital', {
//                     url: '/hospital',
//                     template: '<div ui-view></div>'
//                 })
//                 //医院列表
//                 .state('app.hospital.list', {
//                     url: '/list',
//                     templateUrl: 'src/tpl/hospital/hospital_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/hospital/hospital_list.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js', 'src/js/directives/xg-table.js', 'toaster']);
//                             }
//                         ]
//                     }
//                 })
//                 //医院信息
//                 .state('app.hospital.Info', {
//                     url: '/Info?hospitalId',
//                     templateUrl: 'src/tpl/hospital/hospital_Info.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['src/js/controllers/hospital/hospital_Info.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js', 'src/js/directives/xg-table.js', 'toaster']);
//                             }
//                         ]
//
//                     }
//                 })
//                 //编辑医院
//                 .state('app.hospital.edit', {
//                     url: '/edit/{hospitalId}',
//                     templateUrl: 'src/tpl/hospital/hospital_edit.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'ui.select',
//                                     'toaster',
//                                     '../components/searchDoctorModal/searchDoctorModalService.js',
//                                     '../components/searchDoctorModal/searchDoctorModalController.js',
//                                     'src/js/directives/xg-table.js',
//                                     'src/js/controllers/hospital/hospital_edit.js',
//                                     'src/js/controllers/consultation/consult_detail.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 //会诊
//                 .state('app.consultation', {
//                     url: '/consultation',
//                     template: '<ui-view></ui-view>'
//                 })
//                 .state('app.consultation.list', {
//                     url: '/list',
//                     templateUrl: 'src/tpl/consultation/consult_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_list.js', 'src/js/directives/xg-table.js']);
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.consultation.detail', {
//                     url: '/id/{id}',
//                     templateUrl: 'src/tpl/consultation/consult_detail.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'src/js/controllers/consultation/consult_detail.js', 'src/js/directives/xg-table.js', '../components/searchDoctorModal/searchDoctorModalService.js', '../components/searchDoctorModal/searchDoctorModalController.js']);
//                             }
//                         ]
//                     }
//                 })
//
//                 // 健康社区
//                 .state('app.community', {
//                     url: '/community',
//                     templateUrl: 'src/tpl/community/community_nav.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad',
//                             function($ocLazyLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/community_nav.js'
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 // 社区首页（推荐帖子列表）
//                 .state('app.community.list', {
//                     url: '/list/{id}',
//                     templateUrl: 'src/tpl/community/community_list.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/community_list.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 // 发帖列表
//                 .state('app.community.myPost', {
//                     url: '/myPost',
//                     templateUrl: 'src/tpl/community/my_post.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/my_post.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 //浏览文章
//                 .state('postDetail', {
//                     url: '/postDetail/{id}',
//                     templateUrl: 'src/tpl/community/post_detail.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(
//                                     [
//                                         'toaster', 'ngFileUpload',
//                                         // uploadFile
//                                         'app/shared/chat_window/uploadFile/uploadFileDirective.js',
//                                         'app/shared/chat_window/uploadFile/uploadFileController.js',
//                                         // face-icon-filter
//                                         'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
//                                         'app/shared/chat_window/faceIcon/faceIconDirective.js',
//
//                                         // 七牛上传文件组建
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js',
//
//                                         'src/js/controllers/community/post_detail.js',
//
//                                         'src/js/filters/faceIconFilterContentDirective.js',
//                                     ]
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 //浏览文章
//                 .state('postDetailCheck', {
//                     url: '/postDetailCheck/{id}/{type}/{page}/{zt}/{topid}',
//                     templateUrl: 'src/tpl/community/post_detail_check.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(
//                                     [
//                                         'toaster', 'ngFileUpload',
//                                         // uploadFile
//                                         'app/shared/chat_window/uploadFile/uploadFileDirective.js',
//                                         'app/shared/chat_window/uploadFile/uploadFileController.js',
//
//                                         'src/js/controllers/community/post_detail_check.js',
//                                         // face-icon-filter
//                                         'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
//                                         'app/shared/chat_window/faceIcon/faceIconDirective.js',
//                                         'src/js/filters/faceIconFilterContentDirective.js',
//                                     ]
//                                 );
//                             }
//                         ]
//                     }
//                 })
//                 // 发帖
//                 .state('app.community.createPost', {
//                     url: '/createPost',
//                     templateUrl: 'src/tpl/community/edit_post.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load({
//                                         files: ['src/js/controllers//community/edit_post.js',
//                                             // 七牛上传文件组件
//                                             '../components/qiniuUploader/rely/plupload.full.min.js',
//                                             '../components/qiniuUploader/qiniuUploaderController.js',
//                                             '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                         ]
//                                     }).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.umeditor);
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 编辑帖子
//                 .state('app.community.editPost', {
//                     url: '/editPost/{id}',
//                     templateUrl: 'src/tpl/community/edit_post.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load({
//                                         files: ['src/js/controllers/community/edit_post.js',
//                                             // 七牛上传文件组件
//                                             '../components/qiniuUploader/rely/plupload.full.min.js',
//                                             '../components/qiniuUploader/qiniuUploaderController.js',
//                                             '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                         ]
//                                     }).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.umeditor);
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //bander管理
//                 .state('app.community.banner', {
//                     url: '/banner',
//                     templateUrl: 'src/tpl/community/banner.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['ui.select', 'toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/community/bannerCtrl.js',
//                                         // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 //编辑banner
//                 .state('app.community.editbanner', {
//                     url: '/upload_banner/{id}',
//                     templateUrl:'src/tpl/community/upload_banner.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'ngFileUpload']).then(function() {
//                                     return $ocLazyLoad.load(['src/js/controllers/community/uploadbannerCtrl.js', // 七牛上传文件组件
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js'
//                                     ]).then(function() {
//                                         return uiLoad.load(JQ_CONFIG.tree.concat(JQ_CONFIG.databox, JQ_CONFIG.umeditor));
//                                     });
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 // 栏目管理
//                 .state('app.community.column', {
//                     url: '/column',
//                     templateUrl: 'src/tpl/community/column.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/columnCtrl.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 // 帖子审核
//                 .state('app.community.checkPost', {
//                     url: '/checkPost',
//                     templateUrl: 'src/tpl/community/check_post.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/checkPostCtrl.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 // 评论审核
//                 .state('app.community.checkComment', {
//                     url: '/checkComment',
//                     templateUrl: 'src/tpl/community/check_comment.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/checkCommentCtrl.js',
//                                     'src/js/filters/faceIconFilterContentDirective.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//                 // 举报审核
//                 .state('app.community.checkReport', {
//                     url: '/checkReport',
//                     templateUrl: 'src/tpl/community/check_report.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load([
//                                     'src/js/controllers/community/checkReportCtrl.js',
//                                 ]);
//                             }
//                         ]
//                     }
//                 })
//
//                 //意见反馈 todo
//                 .state('app.operate', {
//                     url: '/operate',
//                     template: '<ui-view></ui-view>'
//                 })
//                 .state('app.operate.feedback', {
//                     url: '/feedback/{type}',
//                     templateUrl: 'src/tpl/feedback/feedback.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load({
//                                     files: ['src/js/controllers/feedback/feedback.js',
//                                         'src/css/setting.css',
//                                         // uploadFile
//                                         'app/shared/chat_window/uploadFile/uploadFileDirective.js',
//                                         'app/shared/chat_window/uploadFile/uploadFileController.js',
//                                         // face-icon-filter
//                                         'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
//                                         'app/shared/chat_window/faceIcon/faceIconDirective.js',
//                                         // quickReply
//                                         'app/shared/chat_window/quickReply/quickReplyDirective.js',
//                                         'app/shared/chat_window/quickReply/quickReplyService.js',
//                                         'app/shared/chat_window/quickReply/quickReplyController.js',
//                                         // 七牛上传文件组建
//                                         '../components/qiniuUploader/rely/plupload.full.min.js',
//                                         '../components/qiniuUploader/qiniuUploaderController.js',
//                                         '../components/qiniuUploader/qiniuUploaderDirective.js',
//
//                                         // editor
//                                         'app/shared/chat_window/editor/editorDirective.js',
//                                         'app/shared/chat_window/editor/editorController.js',
//                                         //chatImgSelModal
//                                         'app/shared/chatImgSelModal/chatImgSelModalService.js',
//                                         'app/shared/chatImgSelModal/chatImgSelModalController.js',
//                                     ]
//                                 });
//                             }
//                         ]
//                     }
//                 })
//                 .state('app.drug_data', {
//                     url: '/drug_data',
//                     templateUrl: 'src/tpl/drug_data/drug_data.html',
//                     resolve: {
//                         deps: ['$ocLazyLoad', 'uiLoad',
//                             function($ocLazyLoad, uiLoad) {
//                                 return $ocLazyLoad.load(['toaster', 'angularBootstrapNavTree', 'src/js/controllers/drug_data/drug_data.js', 'src/js/directives/xg-table.js']);
//                             }
//                         ]
//                     }
//                 })
//                 // others
//                 .state('lockme', {
//                     url: '/lockme',
//                     templateUrl: 'src/tpl/lockme.html'
//                 }).state('access', {
//                     url: '/access',
//                     template: '<div ui-view class="fade-in-right-big smooth"></div>'
//                 }).state('access.signin', {
//                     url: '/signin',
//                     templateUrl: 'src/tpl/signin.html',
//                     resolve: {
//                         deps: ['uiLoad',
//                             function(uiLoad) {
//                                 return uiLoad.load(['src/js/controllers/signin.js']);
//                             }
//                         ]
//                     }
//                 }).state('access.signup', {
//                     url: '/signup',
//                     templateUrl: 'src/tpl/signup.html',
//                     resolve: {
//                         deps: ['uiLoad',
//                             function(uiLoad) {
//                                 return uiLoad.load(['src/js/controllers/signup.js']);
//                             }
//                         ]
//                     }
//                 }).state('access.forgotpwd', {
//                     url: '/forgotpwd',
//                     templateUrl: 'src/tpl/forgotpwd.html'
//                 }).state('access.404', {
//                     url: '/404',
//                     templateUrl: 'src/tpl/404.html'
//                 })
//
//         }
//     ]);
