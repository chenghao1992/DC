/**
 * Created by Mcp on 2016/4/14.
 */
'use strict';

app.controller('AppController',function ($scope, utils, $state) {
    //$scope.feedbackPolling();
    var userData = JSON.parse(utils.localData('check_user'));

    $scope.token = localStorage.getItem('check_access_token');

    if(!!userData) {
    	$scope.communityRole = userData.communityRole;

	    // 健康社区运营人员直接跳到帖子列表页面(当原页面不在健康社区内才触发跳转,避免其他路由刷新时跳到推荐列表页)
	    if($scope.communityRole == 1 && !$state.includes('app.community')) {
	    	$state.go('app.community.list');
	    }
    }

    // nav路由通过事件触发，当用户不在健康社区相关页面则进行跳转；若在社区相关页面则不做任何处理，避免点击直接跳转到推荐列表页。
    // 注：当路由变化都在 app.community 下时， communityNavCtrl不会执行（重定向到推荐list逻辑包含在此）。
    $scope.funCommunityClick = function() {
    	if(!$state.includes('app.community')) {
	    	$state.go('app.community.list');
	    }
    }
});
