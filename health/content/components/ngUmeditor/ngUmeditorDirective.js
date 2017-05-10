(function() {
    angular.module('app')
        .directive('ngUmeditor', ngUmeditor);

    function ngUmeditor() {
        return {
            scope: {
                token: '@',
                content: '=',
                config: '=',
                umeditor:'=?',
                errorcallback:'=?'

            },
            template: '<!-- 加载编辑器的容器 -->\
            <script id="ngUmeditorContainer" name="content" type="text/plain"></script>\
            <!-- 七牛上传组件 -->\
            <qiniu-uploader token="{{token}}" bucket="group" upload="upload" filters="qiniuFilters" file-list="fileList" max-file-size="10mb" chunk-sizee="1mb" success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>\
            <!-- 七牛上传组件 end -->',
            //templateUrl: function() {
            //    var isChack = window.location.href.indexOf('/check/');
            //    if (isChack != -1)
            //        return '../components/ngUmeditor/ngUmeditorView.html';
            //    else
            //        return 'components/ngUmeditor/ngUmeditorView.html';
            //}(),
            controller: 'ngUmeditorCtrl',
        };
    }
})();
