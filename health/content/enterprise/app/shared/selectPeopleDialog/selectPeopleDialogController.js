(function() {
    angular.module('app')
        .controller('SelectPeopleDialogCtrl', SelectPeopleDialogCtrl)
        .controller('SelectPeopleDialogModalInstanceCtrl', SelectPeopleDialogModalInstanceCtrl);

    SelectPeopleDialogCtrl.$inject = ['$scope', '$uibModal','constants'];

    function SelectPeopleDialogCtrl($scope, $uibModal,constants) {

        $scope.open = function(chatGroup,callback) {
            var data = {};
            data.chatGroup=chatGroup;

            var size = 'lg';
            //var func=$scope.func.clone();
            //var func=function() {
            //    return $scope.func;
            //}();

            var modalInstance = $uibModal.open({
                templateUrl: 'selectPeopleDialogBox.html',
                controller: 'SelectPeopleDialogModalInstanceCtrl',
                size: size,
                resolve: {
                    data: data,

                }
            });

            modalInstance.result.then(function (data) {
                if(callback){
                    callback(data);
                }
            }, function () {

            });
        };

    };

    SelectPeopleDialogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'SelectPeopleDialogFactory', 'moment', 'toaster', 'data','$http','constants'];

    function SelectPeopleDialogModalInstanceCtrl($scope, $uibModalInstance, SelectPeopleDialogFactory, moment, toaster, data,$http,constants) {
        $scope.showDep=false;
        $scope.pageSize = '5';
        $scope.selPeople=[];
        var list=data.chatGroup?data.chatGroup.groupUsers:[];
        $scope.currentPeopleMap={};
        $.each(list,function(i,v){
            $scope.currentPeopleMap[v.id]=true;
        })
        var userData =JSON.parse(localStorage.getItem('enterprise_user'));
        // 获取组织架构
        var funGetTreeData = (function _funGetTreeData() {
            $scope.treeLoading = true;
            $http.post(constants.api.enterprise.personnel.getEnterOrg, {
                access_token: localStorage['enterprise_access_token'],
                //drugCompanyId: userData.enterpriseId,
                drugCompanyId: userData.companys[0].companyId,
                getUnassigned: 1
            }).then(function(rpn) {
                if(rpn.data.resultCode==0)return;
                var _data = rpn.data.data;
                if (_data) {
                    // funSetTree(_data);
                    $scope.treeData = [_data];
                    //$scope.treeData[0].subList.push({
                    //    name: '已离职',
                    //    id: 'idx_0',
                    //    subList: [],
                    //    icon: 'fa fa-ban'
                    //});
                    $scope.currentLeaf = _data;
                    $scope.treeLoading = false;
                    funGetPersonnelList(_data,null)

                }
            });
            return _funGetTreeData;
        })();

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        // 树节点点击
        $scope.funTreeClick = function(node, selected) {
            $scope.showDep=false;
            if ($scope.currentLeaf && node.id == $scope.currentLeaf.id) return;
            funGetPersonnelList(node);
        };

        // 获取人员列表
        function funGetPersonnelList(info, keyword) {
            // if ($scope.currentLeaf && info.id == $scope.currentLeaf.id) return;
            $scope.currentLeaf = info;
            $scope.keyword = keyword || '';

            var _param = {
                    access_token: localStorage['enterprise_access_token'],
                    pageIndex: ($scope.pageIndex || '1') - 1,
                    pageSize: $scope.pageSize || '5'
                },
                _url = '#';

            // 查询离职
            if (info.id == 'idx_0') {
                _param.drugCompanyId = userData.companys[0].companyId;
                _url = constants.api.enterprise.personnel.getEnterOffLineUserList;

            }
            // 查询在职
            else {
                _param.orgId = info.id || '';
                _param.drugCompanyId = userData.companys[0].companyId;
                _param.keyword = keyword || '';
                _url = constants.api.enterprise.personnel.getEnterUsersByDptId;
            }

            $http.post(_url, _param).then(function(rpn) {
                if(rpn.data.resultCode==0)return;
                var _data = rpn.data.data;
                if (_data) {
                    $scope.personnelList = _data.pageData;
                    $scope.pageCount = _data.total;

                } else {
                    $scope.personnelList = [];
                }
            });
        };

        // 搜索
        $scope.search = function(keyword) {
            funGetPersonnelList({}, keyword);
        };
        //
        $scope.pageChanged = function(keyword) {

            funGetPersonnelList($scope.currentLeaf, keyword);
        };

        $scope.addPerson=function(person){
            if($scope.findPersonIndex(person)!==-1)return;
            if($scope.currentPeopleMap[person.userId])return;
            $scope.selPeople.push(person);
        }
        $scope.findPersonIndex=function(person){
            //$.each($scope.selPeople,function(i,v){
            //    if(person.id=== v.id){
            //        return i;
            //    }
            //})
            var l=$scope.selPeople;
            for(var i=0;i<l.length;i++){
                if(person.userId===l[i].userId){
                    return i;
                }
            }
            return -1;
        }
        $scope.removePerson=function(person){
            var index=$scope.findPersonIndex(person);
            $scope.selPeople.splice(index,1);
        }

        $scope.createChat=function(){
            if($scope.selPeople.length==0){
                toaster.pop('error', null, '请选择人员');
                return;
            }
            var l=$scope.selPeople,ids="";
            for(var i=0;i<l.length;i++){
                ids+=l[i].userId+"|";
            }
            var param = {
                fromUserId: userData.userId,
                toUserId: ids,
                gtype: '10',
            };
            if(data.chatGroup){
                if(data.chatGroup.type==2){
                    param.gid=data.chatGroup.groupId;
                    SelectPeopleDialogFactory.addPerson(param).then(function(response){
                        console.log(response);
                        $uibModalInstance.close('addOk');
                    });
                }else{
                    $.each(data.chatGroup.groupUsers,function(i,v){
                        ids+= v.id+"|";
                    });
                    param.toUserId=ids;
                    SelectPeopleDialogFactory.createChat(param).then(function(response){
                        $uibModalInstance.close(response);
                    });
                }

            }else {
                SelectPeopleDialogFactory.createChat(param).then(function(response){
                    //$uibModalInstance.close('createOk');
                    $uibModalInstance.close(response);
                });
            }

        }
    }

})();
