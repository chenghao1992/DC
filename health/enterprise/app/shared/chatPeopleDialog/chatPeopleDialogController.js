(function() {
    angular.module('app')
        .controller('ChatPeopleDialogCtrl', ChatPeopleDialogCtrl)
        .controller('ChatPeopleDialogModalInstanceCtrl', ChatPeopleDialogModalInstanceCtrl);

    ChatPeopleDialogCtrl.$inject = ['$scope', '$uibModal','constants'];

    function ChatPeopleDialogCtrl($scope, $uibModal,constants) {

        $scope.open = function(chatGroup,callback) {
            var data = {};
            data.chatGroup=chatGroup;

            var size = 'lg';

            var modalInstance = $uibModal.open({
                templateUrl: 'chatPeopleDialogBox.html',
                controller: 'ChatPeopleDialogModalInstanceCtrl',
                size: size,
                resolve: {
                    data: data,

                }
            });

            modalInstance.result.then(function (returnMsg) {
                if(callback){
                    callback(returnMsg);
                }
            }, function () {
            });
        };

    };

    ChatPeopleDialogModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'ChatPeopleDialogFactory', 'moment', 'toaster', 'data','$http','constants'];

    function ChatPeopleDialogModalInstanceCtrl($scope, $uibModalInstance, ChatPeopleDialogFactory, moment, toaster, data,$http,constants) {
        $scope.chatGroup=data.chatGroup;
        var list=data.chatGroup?data.chatGroup.groupUsers:[];
        $scope.tempName=data.chatGroup.name;
        function initPeople(list){
            $scope.currentPeople=list;
            $scope.currentPeopleMap={};
            $.each(list,function(i,v){
                $scope.currentPeopleMap[v.id]=true;
            })
        };
        initPeople(list);
        var userData =JSON.parse(localStorage.getItem('enterprise_user'));

        // 关闭弹窗
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.onSelPeopleRes = function(res) {
            $uibModalInstance.close(res);
        }

        $scope.removePerson=function(person){
            if(userData.userId==person.id){
                toaster.pop('warning',null,'请不要删除自己');
                return;
            }
            var param={
                gid:data.chatGroup.groupId,
                fromUserId:userData.userId,
                toUserId:person.id,
            }
            ChatPeopleDialogFactory.removePerson(param)
                .then(function(data){
                    if(!data)return;
                    //console.log(JSON.stringify(data));
                    var i=$scope.findPersonIndex(person);
                    if(i>=0){
                        $scope.currentPeople.splice(i,1);
                    }
                    delete $scope.currentPeopleMap[person.id];
                });
        }
        $scope.changeName=function(){
            var param={
                gid:$scope.chatGroup.groupId,
                fromUserId:userData.userId,
                name:$scope.tempName,
            }
            ChatPeopleDialogFactory.changeGroupName(param)
                .then(function(data){
                    if(!data)return;
                    $scope.chatGroup.name=data.gname;
                    $scope.editingName=false;
                });
        }

        $scope.findPersonIndex=function(person){
            var l=$scope.currentPeople;
            for(var i=0;i<l.length;i++){
                if(person.id===l[i].id){
                    return i;
                }
            }
            return -1;
        }

        $scope.setChatTop=function(){
            var flag=$scope.chatGroup.top==1?0:1;
            var param={
                gid:$scope.chatGroup.groupId,
                act:flag,
            }
            ChatPeopleDialogFactory.setGroupTop(param)
                .then(function(data){
                    if(!data)return;
                    $scope.chatGroup.top=flag;
                });
        }

    }

})();
