(function() {
    angular.module('app')
        .factory('DoctorInfoDailogFtory', DoctorInfoDailogFtory);

    // 手动注入依赖
    DoctorInfoDailogFtory.$inject = ['$http','$uibModal','constants'];

    function DoctorInfoDailogFtory($http,$uibModal,constants) {
        return {
            getIntro: getIntro,
            basicInfo: basicInfo,
            getRemarks: getRemarks,
            callByTel: callByTel,
            doctorInfo: doctorInfo,
            addDocTime: addDocTime,
            removeDocTime: removeDocTime,
            appointTime: appointTime,
            query: query,
            setRemarks: setRemarks,
            openModal:openModal,
        };

        function openModal(doctorId, gId,type,callback) {
            var data = {};
            data.gId = gId;
            data.type = type;

            var size = '';


            var modalInstance = $uibModal.open({
                templateUrl: 'doctorInfoDailogBox.html',
                controller: 'DoctorInfoDailogModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    doctorId: doctorId,
                    data: data,
                    goRunning:null
                }
            });

            modalInstance.result.then(function (returnMsg) {
                if(callback){
                    callback();
                }
            }, function () {

            });
        };

        // 修改备注
        function setRemarks(param) {

            return $http.post(constants.api.shared.setRemarks, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 查询套餐
        function query(param) {

            return $http.post(constants.api.order.query, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 发送医生预约时间--导医
        function appointTime(param) {

            return $http.post(constants.api.order.appointTime, param)
                .catch(getListsFailed);
        };

        // 删除医生预约时间--导医
        function removeDocTime(param) {

            return $http.post(constants.api.doctor.removeDocTime, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 添加医生预约时间--导医
        function addDocTime(param) {

            return $http.post(constants.api.doctor.addDocTime, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取医生个人介绍--导医
        function doctorInfo(param) {

            return $http.post(constants.api.doctor.doctorInfo, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取医生个人介绍
        function getIntro(param) {

            return $http.post(constants.api.doctor.getIntro, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取医生基本信息
        function basicInfo(param) {

            return $http.post(constants.api.doctor.basicInfo, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 获取个人备注
        function getRemarks(param) {

            return $http.post(constants.api.shared.getRemarks, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

        // 拨打电话
        function callByTel(param) {

            return $http.post(constants.api.order.callByTel, param)
                .then(getListsComplete)
                .catch(getListsFailed);
        };

    };

    // 处理数据
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data

            } catch (e) {

                if (e.type === undefined)
                    console.warn('返回数据没有 data 字段')

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('请求失败');
        }


    };
    // 检测错误
    function getListsFailed(error) {

        console.warn('请求失败.' + error.data);
    };

})();
