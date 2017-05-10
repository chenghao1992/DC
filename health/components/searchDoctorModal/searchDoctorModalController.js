(function() {
    angular.module('app')
        .controller('SearchDoctorModalCtrl', ['$scope', '$modalInstance', 'toaster', '$http','options',function($scope, $modalInstance, toaster, $http,options){
            $scope.selectType=options.selectType;
            if(options.apiParams){
                options.apiParams.pageIndex=0;
                options.apiParams.pageSize=9999;
            }
            else{
                options.apiParams={};
                options.apiParams.pageIndex=0;
                options.apiParams.pageSize=9999;
            }

            //单选医生
            $scope.radioDoc = {
                selectedDoc: null
            };

            var selectedDocs=options.doctors.slice(0)||[];
            //取得传进组件的doctors对象的id数组
            var doctorIds=[];
            if(options.doctors&&options.doctors.length>0){
                if(options.selectType===0){//单选
                    //因为对象不能直接用==比较，所以要转换为JSON字符串。
                    $scope.radioDoc.selectedDoc=JSON.stringify(options.doctors[0]);
                }
                else if(options.selectType===1){//多选
                    options.doctors.forEach(function(item,index,array){
                        doctorIds.push(item.userId);
                    });
                }
            }

            //获取医生列表
            getDocList();
            function getDocList(){
                options.apiParams.keyWord=null;
                $http.post(options.apiUrl, options.apiParams).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $scope.data=data.data.pageData;
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                });
            }

            //标记多选的已选中医生
            $scope.checkSelected=function(userId){
                return doctorIds.indexOf(userId)>-1;
            };


            //多选的选择医生
            $scope.setCheckDoctor=function(item){
                if(item.check==true){
                    doctorIds.push(item.userId);
                    selectedDocs.push(item);
                }
                else{
                    var _ids=[];
                    selectedDocs.forEach(function(_item,index,array){
                        _ids.push(_item.userId);
                    });
                    var index=_ids.indexOf(item.userId);
                    selectedDocs.splice(index,1);
                }
            };

            //watch搜索框，计算输入字符串的长度
            $scope.keyWordLength=0;
            $scope.$watch('keyWord',function(newValue, oldValue){
                if(newValue!==oldValue){
                    if($scope.keyWord){
                        $scope.keyWordLength=$scope.keyWord.length;
                    }
                    else{
                        $scope.keyWordLength=0;
                    }
                }
            });

            //通过关键字搜索
            $scope.findByKeyWord=function(){
                options.apiParams.keyWord=$scope.keyWord;
                $http.post(options.apiUrl, options.apiParams).
                    success(function(data, status, headers, config) {
                        if(data.resultCode==1){
                            $scope.data=data.data.pageData||[];
                        }
                        else{
                            toaster.pop('error',null,data.resultMsg);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        toaster.pop('error',null,data.resultMsg);
                    });
            };

            //清除搜索关键字
            $scope.clearKW=function(){
                $scope.keyWord=null;
                getDocList();
            };


            //按回车键搜索
            $scope.pressEnter=function($event){
                if($event.keyCode==13){
                    $scope.findByKeyWord();
                }
            };

            //点击确定
            $scope.ok = function () {
                if($scope.selectType===0){
                    $modalInstance.close([JSON.parse($scope.radioDoc.selectedDoc)]);
                }
                else{
                    $modalInstance.close(selectedDocs);
                }
            };

            //点击取消
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
})();
