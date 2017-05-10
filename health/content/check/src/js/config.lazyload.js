(function() {

    var protocol = window.protocol || protocol + '';

    angular.module('app')
        .constant('JQ_CONFIG', {
            moment: [protocol + 'static.mediportal.com.cn/static/health/moment/moment.js'],
            dataTable: [protocol + 'static.mediportal.com.cn/static/health/datatables/media/js/jquery.dataTables.js', protocol + 'static.mediportal.com.cn/static/health/plugins/integration/bootstrap/3/dataTables.bootstrap.js', protocol + 'static.mediportal.com.cn/static/health/plugins/integration/bootstrap/3/dataTables.bootstrap.css'],
            tree: ['../src/js/tree.js?v=2016-9-12'],
            // d3: ['src/js/d3.js'],
            databox: ['../src/js/databox.js?v=2016-9-12'],
            dateTimePicker: [protocol + 'static.mediportal.com.cn/static/health/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js', protocol + 'static.mediportal.com.cn/static/health/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css', protocol + 'static.mediportal.com.cn/static/health/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js'],
            echarts: [protocol + 'static.mediportal.com.cn/static/health/echarts/dist/echarts.js'],
            //umeditor: [protocol+'static.mediportal.com.cn/static/health/umeditor/umeditor.config.js', protocol+'static.mediportal.com.cn/static/health/umeditor/umeditor.min.js', protocol+'static.mediportal.com.cn/static/health/umeditor/lang/zh-cn/zh-cn.js', protocol+'static.mediportal.com.cn/static/health/umeditor/themes/default/css/umeditor.min.css'],
            umeditor: ['../components/umeditor/umeditor.config.js', '../components/umeditor/umeditor.min.js', '../components/umeditor/lang/zh-cn/zh-cn.js', '../components/umeditor/themes/default/css/umeditor.min.css'],
            clipboard: [protocol + 'static.mediportal.com.cn/static/health/clipboard/dist/clipboard.min.js'],
        })
        .config(['$ocLazyLoadProvider',
            function($ocLazyLoadProvider) {
                $ocLazyLoadProvider.config({
                    debug: false,
                    events: true,
                    modules: [{
                        name: 'ui.bootstrap',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angular-ui-bootstrap/ui-bootstrap-tpls-0.14.2.min.js']
                    }, {
                        name: 'ui.select',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angular-ui-select/dist/select.min.js', protocol + 'static.mediportal.com.cn/static/health/angular-ui-select/dist/select.min.css']
                    }, {
                        name: 'ngFileUpload',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angular-file-upload/angular-file-upload.min.js']
                    }, {
                        name: 'angularBootstrapNavTree',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', protocol + 'static.mediportal.com.cn/static/health/angular-bootstrap-nav-tree/dist/abn_tree.css']
                    }, {
                        name: 'toaster',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angularjs-toaster/toaster.js', protocol + 'static.mediportal.com.cn/static/health/angularjs-toaster/toaster.css']
                    }, {
                        name: 'xeditable',
                        files: [protocol + 'static.mediportal.com.cn/static/health/angular-xeditable/dist/js/xeditable.min.js', protocol + 'static.mediportal.com.cn/static/health/angular-xeditable/dist/css/xeditable.css']
                    }]
                });
            }
        ]);
})();
