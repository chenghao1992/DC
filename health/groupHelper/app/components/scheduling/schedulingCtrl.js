(function() {
    angular.module('app').controller('schedulingCtrl', schedulingCtrl);

    schedulingCtrl.$inject = ['$scope', '$state', '$http', '$log', 'toaster', 'constants', 'editSchedulingModalFactory'];

    function schedulingCtrl($scope, $state, $http, $log, toaster, constants, editSchedulingModalFactory) {

        var user = JSON.parse(localStorage.getItem('user'));
        var schKeep = {}; // 保存临时添加的医生排班
        var offlineListKeep = [];

        // 初始化参数
        $scope.search = {
        	hospital: '',
            doctor: {
                doctorId: '',
                doctorName: '请输入医生姓名搜索'
            }
        };
        $scope.weekKeep = 0;
        $scope.offlineList = []; // 医生排班列表信息

        // ************ 分页start ***************
        $scope.totalItems = 0;
        $scope.currentPage = 1; // 第一页
        $scope.pageNum = 20; // 每页显示的数目

        $scope.pageChanged = function() {
            var listStart = $scope.pageNum * ($scope.currentPage-1);
            var listEnd = $scope.pageNum * $scope.currentPage; // 不包括
            if( listEnd > offlineListKeep.length-1 ){
                listEnd = offlineListKeep.length;
            }
            $scope.offlineList = offlineListKeep.slice(listStart,listEnd);

            // 增加页面临时添加对象
            if($scope.currentPage==1){
                var hospitalId =  getIdOrName($scope.search.hospital);
                if( schKeep[hospitalId] && schKeep[hospitalId].length>0 ){
                    // if($scope.search.doctor && $scope.search.doctor.doctorId){
                    //     for(var i=0,len=schKeep[hospitalId].length; i<len; i++){
                    //         if( $scope.search.doctor.doctorId == schKeep[hospitalId][i].doctorId ){
                    //             $scope.offlineList.unshift(schKeep[hospitalId][i]);
                    //         }
                    //     }
                    // } else{
                        $scope.offlineList = schKeep[hospitalId].concat($scope.offlineList);
                    // } 
                }
            }   
        };
        // ************ 分页end ***************

        // 获取医院列表
        (function _getHospitalList() {

            $http.post(constants.api.scheduling.getHospitalList, {
                access_token: localStorage['groupHelper_access_token']
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.hospitalList = data.data;
                    if ($scope.hospitalList[0] && $scope.hospitalList[0].id) {
                    	$scope.search.hospital = $scope.hospitalList[0].id + "-" + $scope.hospitalList[0].name;
                    }
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
                $scope.funGetDay(); // 初始时间处理
            }).error(function(data, status, headers, config) {
                toaster.pop('error', null, "网络错误");
                $scope.funGetDay(); // 初始时间处理
            });

        })();

        // 获取医生列表
        (function _getDoctorList() {

            $http.post(constants.api.scheduling.getDoctorList, {
                access_token: localStorage['groupHelper_access_token']
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    $scope.doctorList = data.data;
                    // $scope.doctorList.unshift({
                    //     doctorId: '',
                    //     doctorName: '请输入医生姓名搜索...'
                    // })
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                toaster.pop('error', null, "网络错误");
            });

        })();

        // 时间处理
        $scope.funGetDay = function(type) {
        	var add = 0;
        	if(type == "last"){
        		$scope.weekKeep--;
        	}
        	if(type == "next"){
        		$scope.weekKeep++;
        	}
        	if(type!="last" && type!="next"){
        		$scope.weekKeep = 0;
        	}
        	add = $scope.weekKeep*7;

        	var mon = moment().startOf('week').add(add+1,"day").format("MM-DD"),
        		tue = moment().startOf('week').add(add+2,"day").format("MM-DD"),
        		wed = moment().startOf('week').add(add+3,"day").format("MM-DD"),
        		thu = moment().startOf('week').add(add+4,"day").format("MM-DD"),
        		fri = moment().startOf('week').add(add+5,"day").format("MM-DD"),
        		sat = moment().startOf('week').add(add+6,"day").format("MM-DD"),
        		sun = moment().startOf('week').add(add+7,"day").format("MM-DD");

        	$scope.paramDate = {
        		mon : mon,
        		tue : tue,
        		wed : wed,
        		thu : thu,
        		fri : fri,
        		sat : sat,
        		sun : sun,
        		monMask : compareDate(mon),
        		tueMask : compareDate(tue),
        		wedMask : compareDate(wed),
        		thuMask : compareDate(thu),
        		friMask : compareDate(fri),
        		satMask : compareDate(sat),
        		sunMask : compareDate(sun),
        		start : moment().startOf('week').add(add+1,"day").unix()*1000,
        		end: moment().endOf('week').add(add+1,"day").unix()*1000
        	}

        	if( $scope.search.hospital ) {
        		$scope.getOfflines( $scope.search.hospital ); // 查询对应排班列表
        	}
        }

        // 日期比较函数
        function compareDate(date){
        	var today = parseInt( moment().format("MMDD")+"", 10 );
        	var compare = parseInt( date.replace("-","")+"", 10 );
        	return compare-today<=0;
        }
        // 截取医院id和name,默认返回id
        function getIdOrName(hospital,type){
            if(!hospital){
                return '';
            }
            if(type == 'name'){
                return hospital.substring(hospital.indexOf('-')+1);
            }
            return hospital.substring(0, hospital.indexOf('-'));
        }

        // 按照条件查询医生排班信息
		$scope.getOfflines = function(hospital) {

			$http.post(constants.api.scheduling.getOfflinesForWeb, {
                access_token: localStorage['groupHelper_access_token'],
                hospitalId: getIdOrName($scope.search.hospital),
                // doctorId: doctor.doctorId || '',
                startTime: $scope.paramDate.start,
                endTime: $scope.paramDate.end
            }).success(function(data, status, headers, config) {
                if (data.resultCode == 1) {
                    funFormatOfflines(data.data);
                } else {
                    toaster.pop('error', null, data.resultMsg);
                }
            }).error(function(data, status, headers, config) {
                toaster.pop('error', null, "网络错误");
            });

		};

        // 排班信息对象处理
        function funFormatOfflines(data){
            
            $scope.totalItems = 0;
            offlineListKeep =[];

            // if(!data) return;

            for(var i=0; i<data.length; i++){
                var itemObj = {
                    doctorId: '',
                    doctorName: '',
                    aMon : [],
                    aTue : [],
                    aWed : [],
                    aThu : [],
                    aFri : [],
                    aSat : [],
                    aSun : []
                }
                var doctor = data[i].doctor.split(",");
                itemObj.doctorId = doctor[0];
                itemObj.doctorName = doctor[1];
                itemObj.docIntro = data[i].doctor.substring(data[i].doctor.indexOf(",")+1);

                for(var j=0,len=data[i].offlineList.length; j<len; j++){
                    // 获取星期几
                    var week = ['aMon','aTue','aWed','aThu','aFri','aSat','aSun']['1234567'.indexOf(data[i].offlineList[j].week)];
                    itemObj[week].push(data[i].offlineList[j]);
                }
                offlineListKeep.push(itemObj);
                $scope.totalItems++;
            }
            $scope.pageChanged();
        }

		// 添加值班医生
		$scope.funAddDoctor = function() {
			var hospitalId =  getIdOrName($scope.search.hospital),
                temp = $scope.search.doctor;

            if(!schKeep[hospitalId]){
                schKeep[hospitalId] = [];
            }
            for(var i=0,iLen=schKeep[hospitalId].length; i<iLen; i++){
                if(temp.doctorId == schKeep[hospitalId][i].doctorId){
                    toaster.pop('error', null, "排班列表中已存在该医生，请勿重复添加！");
                    return ;
                }
            }
            for(var j=0,jLen=offlineListKeep.length; j<jLen; j++){
                if(temp.doctorId == offlineListKeep[j].doctorId){
                    toaster.pop('error', null, "排班列表中已存在该医生，请勿重复添加！");
                    return ;
                }
            }
            
            var newOne = {
                doctorId: temp.doctorId,
                doctorName: temp.doctorName,
                docIntro: [temp.doctorName,temp.hospitalName,temp.departments,temp.title].join(","),
                aMon : [],
                aTue : [],
                aWed : [],
                aThu : [],
                aFri : [],
                aSat : [],
                aSun : []
            }
            schKeep[hospitalId].unshift(newOne);
            $scope.offlineList.unshift(newOne);
		};

        // 点击td编辑排班信息
        $scope.funEditSch = function(id,intro,offlines,week) {
            var start = $scope.paramDate.start;
            var options = {
                id: id,
                intro: intro,
                hospitalId: getIdOrName($scope.search.hospital),
                hospital: getIdOrName($scope.search.hospital, 'name'),
                week: week,
                date: moment(start).add(week-1, 'days').unix()*1000,
                offlines: offlines,
                callback: function(){
                    // 从临时对象中删除对应的医生
                    var hospitalId = getIdOrName($scope.search.hospital);
                    if( schKeep[hospitalId] && schKeep[hospitalId].length>0 ){
                        for(var i=0,iLen=schKeep[hospitalId].length; i<iLen; i++){
                            if(id == schKeep[hospitalId][i].doctorId){
                                schKeep[hospitalId].splice(i,1);
                            }
                        }
                    }
                    $scope.getOfflines( $scope.search.hospital ); // 查询对应排班列表
                }
            }
            editSchedulingModalFactory.openModal(options);
        };

    };
})();
