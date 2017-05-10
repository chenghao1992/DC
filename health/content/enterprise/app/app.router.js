(function() {
    // injector
    angular.module('app')
        .config(config);

    // run.$inject＝['$rootScope', '$state', '$stateParams'];

    function config($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
        // =================================路由配置===========================================
        $urlRouterProvider
            .when('', '/signin')
            .when('/', '/signin')
            .when('/app', '/app/chat')

        $stateProvider
            .state('app', {
                title: 'app',
                url: '/app',
                views: {
                    '': {
                        template: '<div ui-view="appNav"></div><ui-view> </ui-view>',
                        controller: 'MainCtrl'
                    },
                    'appNav@app': {
                        templateUrl: 'app/shared/app_nav/navView.html',
                        controller: 'AppNavCtrl',
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'app/main.js',
                                    // nav
                                    'app/shared/app_nav/navService.js',
                                    'app/shared/app_nav/navController.js',
                                    //修改密码
                                    'app/shared/changePwdModal/changePwdModalController.js',
                                    'app/shared/changePwdModal/changePwdModalService.js'
                                ],

                            });
                        }
                    ]
                }

            })
            //聊天
            .state('app.chat', {
                title: '聊天',
                url: '/chat',
                views: {
                    '': {
                        templateUrl: 'app/components/chat/chatView.html',
                        controller: 'ChatCtrl'
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // face-icon-filter
                                    'app/shared/chat_window/faceIcon/filter/faceIconFilterDirective.js',
                                    'app/shared/chat_window/faceIcon/faceIconDirective.js',
                                    // 七牛上传文件组建
                                    '../components/qiniuUploader/rely/plupload.full.min.js',
                                    '../components/qiniuUploader/qiniuUploaderController.js',
                                    '../components/qiniuUploader/qiniuUploaderDirective.js',
                                    // uploadFile
                                    'app/shared/chat_window/uploadFile/uploadFileDirective.js',
                                    'app/shared/chat_window/uploadFile/uploadFileController.js',
                                    //chat
                                    'app/components/chat/chatController.js',
                                    'app/components/chat/chatService.js',
                                    // editor
                                    'app/shared/chat_window/editor/editorDirective.js',
                                    'app/shared/chat_window/editor/editorController.js',
                                    //chatImgSelModal
                                    'app/shared/chatImgSelModal/chatImgSelModalService.js',
                                    'app/shared/chatImgSelModal/chatImgSelModalController.js',
                                    // selPeopleDialog
                                    'app/shared/selectPeopleDialog/selectPeopleDialogDirective.js',
                                    'app/shared/selectPeopleDialog/selectPeopleDialogService.js',
                                    'app/shared/selectPeopleDialog/selectPeopleDialogController.js',
                                    // chatPeopleDialog
                                    'app/shared/chatPeopleDialog/chatPeopleDialogDirective.js',
                                    'app/shared/chatPeopleDialog/chatPeopleDialogService.js',
                                    'app/shared/chatPeopleDialog/chatPeopleDialogController.js',
                                    // 通用树组件
                                    'app/shared/trees/tree.css?rev=a86a046d59b1f8ade9c1fb420edc89ee',
                                    'app/shared/trees/treeDir.js?rev=a86a046d59b1f8ade9c1fb420edc89ee',

                                    'app/third/contextMenu.js',
                                    
                                ],
                                
                            });
                        }
                    ]
                }

            })
            // 登录
            .state('signin', {
                title: '登录',
                url: '/signin',
                views: {
                    '': {
                        templateUrl: 'app/components/signin/signinView.html',
                        controller: 'SigninCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // signin
                                    'app/components/signin/signinService.js',
                                    'app/components/signin/signinController.js'
                                ],
                                
                            });
                        }
                    ]
                }

            })
            // 忘记密码
            .state('resetPassWord', {
                title: '忘记密码',
                url: '/resetPassWord',
                views: {
                    '': {
                        templateUrl: 'app/components/resetPassWord/resetPassWordView.html',
                        controller: 'ResetPassWordCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    // signin
                                    'app/components/resetPassWord/resetPassWordService.js',
                                    'app/components/resetPassWord/resetPassWordController.js'
                                ],

                            });
                        }
                    ]
                }

            })
            // 新密码
            .state('newPassWord', {
                title: '忘记密码',
                url: '/newPassWord/:smsid/:ranCode/:phone',
                views: {
                    '': {
                        templateUrl: 'app/components/newPassWord/newPassWordView.html',
                        controller: 'NewPassWordCtrl'
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'app/components/newPassWord/newPassWordService.js',
                                    'app/components/newPassWord/newPassWordController.js'
                                ]
                            });
                        }
                    ]
                }
            })
            // 重置成功
            .state('resetSuccess', {
                title: '重置成功',
                url: '/resetSuccess',
                views: {
                    '': {
                        templateUrl: 'app/components/resetSuccess/resetSuccessView.html',
                        controller: 'ResetSuccessCtrl',
                    },
                },
                resolve: {
                    lazy: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    'app/components/resetSuccess/resetSuccessController.js'
                                ],

                            });
                        }
                    ]
                }

            })

    }
})();
