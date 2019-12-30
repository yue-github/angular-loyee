/**
 * Created by admin on 2016/9/5.
 */
var big;
var app = angular.module('app', ['ngRoute'])
    .controller('MyNoticeCtrl', ['$scope','$http','$anchorScroll', '$rootScope', function ($scope, $http, $anchorScroll, $rootScope) {
        $anchorScroll();
        $scope.state=0;
        $scope.menu=8;
        $scope.data={};
        $scope.data.noticeTitle="全部消息";
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        $scope.noticeType = 0;
        if($scope.noticeType==1){
            $scope.data.isRead=0;
        }else if($scope.noticeType==2){
        	 $scope.data.isRead=1;
        }

        $scope.selectNotice=function(noticeType){
        	$scope.noticeType=noticeType;
            if(noticeType==0){
                $scope.data.noticeTitle="全部消息";
                $scope.data.isRead=null;
                $scope.data.offset=0;
            }else if(noticeType==1){
                $scope.data.noticeTitle="未读消息";
                $scope.data.isRead=0;
                $scope.data.offset=0;
            }else if(noticeType==2){
            	$scope.data.isRead=1;
            	$scope.data.noticeTitle="已读消息";
            	$scope.data.offset=0;
            }else{
                $scope.data.noticeTitle="全部消息";
                $scope.data.isRead=null;
                $scope.data.offset=0;
            }
            getNotice();
        }

        var getNotice=function(){
            $http.post(baseUrl + 'pc/notice/many', $scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.notices= result.data;
                    big = $scope.notices;
                    for(var i=0;i<result.data.length;i++){
	                    if(result.data[i].msg_grade==1){
	                        result.data[i].msg_grade="通知";
	                    } else if(result.data[i].msg_grade==2){
	                        result.data[i].msg_grade="重要";
	                    } else if(result.data[i].msg_grade==3){
	                        result.data[i].msg_grade="紧急";
	                    }
                    }

                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                }
            });

        }
        
        getNotice();
        
        var noReadCount=function(){
        	 $http.post(baseUrl + 'pc/notice/noReadCount').success(function (result) {
        		 if(result.error > 0) {

                 } else {
                	 $scope.data.noReadCount=result.noReadCount;
                 }
        	 });
        }
        noReadCount();
        
        /**分页点击事件
         * k:当前点击的页数或者左右+1、-1
         * t:类型（0：左右按钮点击，1：页码点击）
         * */
        $scope.setpages = function (k,t) {
            if(t==0){
                $scope.pageNumber= $scope.pageNumber+k;
                if($scope.pageNumber>0&&$scope.pageNumber<=$scope.pagestotal){
                    $scope.pageNumber=$scope.pageNumber;
                }else if($scope.pageNumber>=$scope.pagestotal){
                    $scope.pageNumber=$scope.pagestotal;
                }else{
                    $scope.pageNumber=1;
                }
            }else {
                $scope.pageNumber=k;
            }
            $scope.data.offset=($scope.pageNumber-1)*$scope.data.length;
            getNotice();
        };
        
        $scope.viewDetails = function(noticeId) {
        	$http.post(baseUrl + 'pc/notice/get',{id:noticeId}).success(function (result) {
                if(result.error >0) {
                	
                } else {
                	$scope.data.content= result.data.msg_content;
	                if(result.data.msg_grade==1){
	                	result.data.msg_grade="通知";
	               	} else if(result.data.msg_grade==2){
	                	 result.data.msg_grade="重要";
	                } else if(result.data.msg_grade==3){
	                	result.data.msg_grade="紧急";
	                }
                    $rootScope.showLayer('#viewDetails', '800px', '500px', result.data.msg_grade);
                    if (result.data.isRead == 0) {
                    	$http.post(baseUrl + 'pc/notice/update',{id:noticeId}).success(function (result) {});
                    }
                    getNotice();
                    noReadCount();
                }
            });
        };
        
        $scope.delNotice = function(noticeId) {
        	$http.post(baseUrl + 'pc/notice/delete',{id:noticeId}).success(function (result) {
                if(result.error >0) {
                	
                } else {
                	$byLayer.msg('删除成功', 'success');
                	getNotice();
                }
            });
        }
        
    }]);
