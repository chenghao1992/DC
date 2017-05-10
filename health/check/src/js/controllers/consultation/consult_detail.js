/**
 * Created by clf on 2016/1/15.
 */
'use strict';
(function () {
    app.controller('ConsultDetailCtrl', ['$scope','utils','$http','$modal','toaster','$location','$state','$rootScope','$stateParams','searchDoctorModalFactory',function($scope,utils,$http,$modal,toaster,$location,$state,$rootScope,$stateParams,searchDoctorModalFactory) {
        var curGroupId='666666666666666666666666';
        $scope.doctors=[];
        $scope.saved=true;

        function getData(){
            $http.post(app.url.consult.getPackDetail,{
                access_token:app.url.access_token,
                consultationPackId:$stateParams.id
            }).
            success(function(data, status, headers, config) {
                if(data.resultCode==1){
                    $scope.description=data.data.consultationPackDesc;
                    $scope.docPriceMax=data.data.maxFee/100;
                    $scope.docPriceMin=data.data.minFee/100;
                    if(data.data.doctorInfoList&&data.data.doctorInfoList.length>0){
                        data.data.doctorInfoList.forEach(function(item,index,array){
                            $scope.doctors.push({
                                userId:item.userId,
                                name:item.name
                            });
                        });
                    }
                }
                else{
                    console.log(data.resultMsg);
                }
            }).
            error(function(data, status, headers, config) {
                alert(data.resultMsg);
            });
        }
        if($stateParams.id){
            getData();
        }

        //将医生对象数据转换为id的数组
        function getDocIds(docObjs){
            var ids=[];
            docObjs.forEach(function(item,index,array){
                ids.push(item.userId);
            });
            return ids;
        }

        //点击添加医生，弹出选医生组件
        $scope.addData = function () {
            var options={
                apiUrl:app.url.consult.getPlatformSelectedDoctors,
                apiParams:{
                    consultationPackId:$stateParams.id?$stateParams.id:curGroupId,
                    groupId:curGroupId,
                    access_token:app.url.access_token
                },
                selectType:1,//1为多选，2为单选
                doctors:$scope.doctors,
                callback:makeList
            };
            searchDoctorModalFactory.openModal(options);
        };


        function makeList(dt){
            $scope.doctors=dt;
        }

        $scope.removeItem = function(item){
            var index = $scope.doctors.indexOf(item);
            $scope.doctors.splice(index,1);
        };

        $scope.$watch('docRatio',function(newValue,oldValue){
            if(newValue!=oldValue){
                $scope.orgDocRatio=100-newValue;
            }
        });

        $scope.$watch('orgDocRatio',function(newValue,oldValue){
            if(newValue!=oldValue){
                $scope.docRatio=100-newValue;
            }
        });

        $scope.save=function(){
            $scope.saved=false;

            var doctorIds=[];
            $scope.doctors.forEach(function(item,index,array){
                doctorIds.push(item.userId);
            });

            if($stateParams.id){
                //更新
                var doctorsStr='';

                doctorIds.forEach(function(item,index,array){
                    doctorsStr+='&doctorIds='+item;
                });

                var url=app.url.consult.updatePack+'?access_token='+app.url.access_token+'&id='+$stateParams.id+'&consultationPackDesc='+$scope.description+'&maxFee='+ $scope.docPriceMax*100+'&minFee='+$scope.docPriceMin*100 +doctorsStr;
                $http.get(encodeURI(url), {

                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $state.go('app.consultation.list',null,{reload:true});
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                        $scope.saved=true;
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                    $scope.saved=true;
                });
            }
            else{
                //添加
                $http.post(app.url.consult.addPack, {
                    access_token:app.url.access_token,
                    groupId:curGroupId,
                    consultationPackDesc:$scope.description,
                    maxFee:$scope.docPriceMax*100,
                    minFee:$scope.docPriceMin*100,
                    doctorIds:doctorIds
                }).
                success(function(data, status, headers, config) {
                    if(data.resultCode==1){
                        $state.go('app.consultation.list',null,{reload:true});
                    }
                    else{
                        toaster.pop('error',null,data.resultMsg);
                        $scope.saved=true;
                    }
                }).
                error(function(data, status, headers, config) {
                    toaster.pop('error',null,data.resultMsg);
                    $scope.saved=true;
                });
            }
        }
    }]);
})();
