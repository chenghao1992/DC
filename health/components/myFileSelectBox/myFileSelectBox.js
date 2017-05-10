'use strict';

(function() {
    angular.module('app')
        .factory('MyFileSelectBoxFactory', MyFileSelectBoxFactory);

    // 手动注入依赖
    MyFileSelectBoxFactory.$inject = ['$http', '$modal'];

    function MyFileSelectBoxFactory($http, $modal) {

        var template = '\
                        <div class="modal-header">\
                            <h4 class="modal-title">选择文件</h4>\
                        </div>\
                        <div class="clearfix" style="height:474px;padding-top:15px">\
                            <div class="col-xs-12">\
                                <div class="clearfix">\
                                    <!-- //文件分类（可以为空）文档=document，图片=picture，视频=video，音乐=music，其他=other -->\
                                    <div class="btn-group pull-left" w-full m-t-sm" >\
                                        <label ng-show="!config.type || config.type.indexOf(\'\')>-1" class="btn btn-default" btn-radio="\'\'" ng-model="type" ng-click="type=\'\';getMyFile(1,page_size,mode,\'\')">全部</label>\
                                        <label ng-show="!config.type || config.type.indexOf(\'document\')>-1" class="btn btn-default" btn-radio="\'document\'" ng-model="type" ng-click="type=\'document\';getMyFile(1,page_size,mode,\'document\')">文档</label>\
                                        <label ng-show="!config.type || config.type.indexOf(\'picture\')>-1" class="btn btn-default" btn-radio="\'picture\'" ng-model="type" ng-click="type=\'picture\';getMyFile(1,page_size,mode,\'picture\')">图片</label>\
                                        <label ng-show="!config.type || config.type.indexOf(\'video\')>-1" class="btn btn-default" btn-radio="\'video\'" ng-model="type" ng-click="type=\'video\';getMyFile(1,page_size,mode,\'video\')">视频</label>\
                                        <label ng-show="!config.type || config.type.indexOf(\'music\')>-1" class="btn btn-default" btn-radio="\'music\'" ng-model="type" ng-click="type=\'music\';getMyFile(1,page_size,mode,\'music\')">音乐</label>\
                                        <label ng-show="!config.type || config.type.indexOf(\'other\')>-1" class="btn btn-default" btn-radio="\'other\'" ng-model="type" ng-click="type=\'other\';getMyFile(1,page_size,mode,\'other\')">其他</label>\
                                    </div>\
                                    <div class="input-group pull-right">\
                                        <input type="text" class="form-control" placeholder="搜索" ng-model="searchKey" ng-enter="fileNameKey=searchKey;getMyFile(1, page_size)">\
                                    </div>\
                                </div>\
                                <table class="table table-striped b-b b-t b-r b-l m-t-sm m-b-xxs">\
                                    <thead>\
                                        <tr>\
                                            <th class="clearfix" width="40%">\
                                                <span class="pull-left" ng-click="sortAttr=\'name\';sortType=-sortType;getMyFile(1,page_size)">\
                                                    <a>\
                                                        文件\
                                                        <i class="fa fa-fw" ng-if="sortAttr==\'name\'" ng-class="{\'-1\':\'fa-sort-down\',\'1\':\'fa-sort-up\'}[sortType]"></i>\
                                                    </a>\
                                                </span>\
                                            </th>\
                                            <th width="20%">\
                                                <span ng-click="sortAttr=\'size\';sortType=-sortType;getMyFile(1,page_size)">\
                                                    <a>\
                                                    大小\
                                                    <i class="fa fa-fw" ng-if="sortAttr==\'size\'" ng-class="{\'-1\':\'fa-sort-down\',\'1\':\'fa-sort-up\'}[sortType]"></i>\
                                                </a>\
                                                </span>\
                                            </th>\
                                            <th width="30%">\
                                                <span ng-click="sortAttr=\'date\';sortType=-sortType;getMyFile(1,page_size)">\
                                                    <a>\
                                                    上传时间\
                                                    <i class="fa fa-fw" ng-if="sortAttr==\'date\'" ng-class="{\'-1\':\'fa-sort-down\',\'1\':\'fa-sort-up\'}[sortType]"></i>\
                                                </a>\
                                                </span>\
                                            </th>\
                                            <th width="10%" class="text-center">\
                                                <span style="color:#363f44;">操作</span>\
                                            </th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>\
                                        <tr ng-if="!mgFilesIsLoading&&(!myFiles||!myFiles.length||myFiles.length<1)">\
                                            <td colspan="4" class="text-center">\
                                                无数据\
                                            </td>\
                                        </tr>\
                                        <tr ng-show="mgFilesIsLoading">\
                                            <td colspan="4" class="text-center">\
                                                <i class="fa fa-spinner fa-spin"></i>\
                                            </td>\
                                        </tr>\
                                        <tr ng-repeat="item in myFiles track by $index" ng-class="{bgLavenderBlush: (curVideoId==item.fileId || item.isSeleted)}" ng-show="!mgFilesIsLoading" ng-click="selected(item)" style="cursor: pointer;">\
                                            <td class="clearfix control-man">\
                                                <p class="r clear pull-left">\
                                                    <img style="border-radius:0px;width:24px;height:24px" ng-src="{{fileFormatIdentify(item)}}">\
                                                </p>\
                                                <div style="border: none;margin:0 0 0 30px; width:200px">\
                                                    <b class="block m-t-xxs text-ellipsis">\
                                                        {{item.name}}\
                                                    </b>\
                                                </div>\
                                            </td>\
                                            <td>\
                                                {{byte(item.size)}}\
                                            </td>\
                                            <td>\
                                                {{item.lastUpdateDate | date:\'yyyy/MM/dd H:mm\'}}\
                                            </td>\
                                            <td class="text-center">\
                                                <input type="checkbox" ng-checked="item.isSeleted==true" ng-show="!config.onlyIf"/>\
                                                <input type="radio" name="fileVideo" ng-checked="curVideoId==item.fileId" ng-show="config.onlyIf" />\
                                            </td>\
                                        </tr>\
                                    </tbody>\
                                </table>\
                                <div class="text-center" style="margin:-14px 0px">\
                                    <pagination ng-show="page_count>0" total-items="page_count" ng-model="page" items-per-page="page_size" ng-change="pageChanged()" direction-links="false" boundary-links="true" first-text="首页" last-text="尾页"></pagination>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="modal-footer clearfix" style="text-align:left">\
                            <a class="btn btn-primary pull-left" ng-show="{{!config.show}}" href="#/app/file_management" ng-click="cancel()"  target="_blank">去上传文件</a>\
                            <button class="btn btn-success pull-right" type="button" ng-click="cancel()">取消</button>\
                            <button class="btn btn-info pull-right m-r-sm" type="button" ng-click="ok()">确定</button>\
                        </div>\
                        ';

        // 打开选择窗口
        function openModel(config, callback) {

            var modalInstance = $modal.open({
                template: template,
                controller: 'MyFileSelectBoxCtrl',
                size: 'lg',
                // windowClass: 'bigWindows',
                resolve: {
                    config: function() {
                        return config || {}
                    }
                }
            });

            modalInstance.result.then(function(files) {
                if (callback) {
                    callback(files)
                }
            });
        };

        return {
            open: openModel
        };

    };

    angular.module('app')
        .controller('MyFileSelectBoxCtrl', MyFileSelectBoxCtrl);

    function MyFileSelectBoxCtrl($http, $modalInstance, $scope, toaster, config, $timeout) {

        $scope.ok = function() {
            $modalInstance.close($scope.slecetdFiles);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };


        $scope.slecetdFiles = [];
        $scope.curVideoId = "";

        $scope.funIsSelected = function(item) {
            for (var i = 0; i < $scope.slecetdFiles.length; i++) {
                if (item.fileId == $scope.slecetdFiles[i].fileId) {
                    return true;
                }
            }
            return false;
        }

        $scope.selected = function(file) {
            if(config.onlyIf) {
                // 单选
                $timeout(function() {
                    $scope.curVideoId = file.fileId;
                })
                $scope.slecetdFiles = [file]; 
            } else {
                // 多选
                $timeout(function() {
                    file.isSeleted = !file.isSeleted;
                })
                if (!$scope.funIsSelected(file)) {
                    $scope.slecetdFiles.push(file);
                }
                else {
                    $scope.slecetdFiles = $scope.slecetdFiles.filter(function(item) {
                        return item.fileId != file.fileId;
                    })
                } 
            } 
        };

        ////////////////////////文件列表///////////////////////

        $scope.myFiles = [];

        $scope.page = 1;
        $scope.page_size = 10;

        //搜索模式 upload=我上传的文件 receive=我接收的文件
        $scope.mode = 'upload';
        //文件分类（可以为空）文档=document，图片=picture，视频=video，音乐=music，其他=other
        $scope.type = '';
        //排序属性 name=按名称排序，size=按文件大小排序，date=按上传时间排序（默认
        $scope.sortAttr = 'date';
        //排序顺序 1=顺序（默认），-1=倒序
        $scope.sortType = -1;
        //关键字
        $scope.fileNameKey = '';

        // 配置
        $scope.config = config;
        if ($scope.config.type && Array.isArray($scope.config.type)) {
            $scope.type = $scope.config.type[0];
        }

        // 换页
        $scope.pageChanged = function() {
            $scope.getMyFile($scope.page, $scope.page_size);
        };

        // 文件格式识别
        $scope.fileFormatIdentify = function(item) {
            var suffix = item.suffix.toLowerCase();
            var fileTypeUrl = './src/img/fileFormat/';

            if (suffix == 'ppt' || suffix == 'pptx')
                return fileTypeUrl + 'ppt.png';

            if (suffix == 'pdf')
                return fileTypeUrl + 'pdf.png';

            if (suffix == 'rtf')
                return fileTypeUrl + 'rtf.png';

            if (suffix == 'txt')
                return fileTypeUrl + 'txt.png';

            if (suffix == 'xml')
                return fileTypeUrl + 'xml.png';

            if (suffix == 'xls' || suffix == 'xlsx')
                return fileTypeUrl + 'excle.png';

            if (suffix == 'doc' || suffix == 'docx') {
                return fileTypeUrl + 'word.png';
            }
            if (suffix == 'xps') {
                return fileTypeUrl + 'doc.png';
            }

            // if (
            //     suffix == 'rar' ||
            //     suffix == 'zip'
            // )
            //     return 'zip';

            // if (
            //     suffix == 'doc' ||
            //     suffix == 'docx' ||
            //     suffix == 'txt' ||
            //     suffix == 'xps' ||
            //     suffix == 'pdf' ||
            //     suffix == 'rtf' ||
            //     suffix == 'xml'
            // )
            //     return 'document';

            if (
                suffix == 'jpg' ||
                suffix == 'jpeg' ||
                suffix == 'png' ||
                suffix == 'gif' ||
                suffix == 'bmp'
            )
                return item.url + '?imageView2/3/w/50/h/50' || fileTypeUrl + 'image.png';

            if (
                suffix == 'mp4' ||
                suffix == 'avi' ||
                suffix == 'rmvb' ||
                suffix == 'rm' ||
                suffix == 'asf' ||
                suffix == 'divx' ||
                suffix == 'mpg' ||
                suffix == 'mpeg' ||
                suffix == 'mpe' ||
                suffix == 'wmv' ||
                suffix == 'mkv' ||
                suffix == 'vob' ||
                suffix == 'mov'
            )
                return fileTypeUrl + 'video.png';

            if (
                suffix == 'mp3' ||
                suffix == 'wma' ||
                suffix == 'aac' ||
                suffix == 'mid' ||
                suffix == 'wav' ||
                suffix == 'vqf' ||
                suffix == 'cda'
            )
                return fileTypeUrl + 'audio.png';

            return fileTypeUrl + 'unknow.png';
        };

        // bytes to kB or MB...
        $scope.byte = function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };

        // 获取文件列表
        getMyFile($scope.page, $scope.page_size);

        function getMyFile(pageIndex, pageSize, mode, type, sortAttr, sortType, fileNameKey) {

            $scope.isCheckAll = false;
            $scope.mgFilesIsLoading = true;

            $http({
                url: app.yiliao + 'vpanfile/queryFile',
                method: 'post',
                data: {
                    access_token: $scope.config && $scope.config.userId ? '' : localStorage.getItem('access_token'),        // 健康社区时token传空
                    userId: $scope.config && $scope.config.userId ? $scope.config.userId : '',      // 健康社区获取指定医生的云盘文件
                    pageIndex: pageIndex - 1,
                    pageSize: pageSize,
                    mode: mode || $scope.mode || null,
                    type: type || $scope.type || null,
                    fileNameKey: fileNameKey || $scope.fileNameKey || null,
                    sortAttr: sortAttr || $scope.sortAttr || 'date',
                    sortType: sortType || $scope.sortType || -1
                }
            }).then(function(response) {
                var rep = response.data;
                if (rep && rep.resultCode == 1) {
                    // console.log(rep.data);
                    $scope.page_count = rep.data.total;
                    $scope.page_size = rep.data.pageSize;
                    for(var i=0; i<rep.data.pageData.length; i++){
                        if (!$scope.funIsSelected( rep.data.pageData[i] )) {
                            rep.data.pageData[i].isSeleted = false;
                        } else {
                            rep.data.pageData[i].isSeleted = true;
                        }
                    }
                    $scope.myFiles = rep.data.pageData;
                } else {
                    console.warn(rep);
                }
                $scope.mgFilesIsLoading = false;
            });
        };
        $scope.getMyFile = getMyFile;
    };

})();
