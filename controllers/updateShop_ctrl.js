/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
    .controller('UpdateShopCtrl',['$scope', '$location', '$http', 'Upload', '$anchorScroll', function ($scope, $location, $http, Upload, $anchorScroll) {
        $anchorScroll();
        $scope.shopmenu=0;
        getShopInfo($scope,$http);
        $scope.data={};

        //点击触发file标签
        $scope.updateImg=function(){
            document.getElementById('logoPic').click();
        }
        //上传图片
        //上传图片
        $scope.upload = function (file) {
            if (file) {
                uploadFile($scope,$http,file,Upload);
            }
        };

        //提交修改信息
        $scope.submit=function(){
        	var phone_pattern =/^[1][3,4,5,7,8][0-9]{9}$/;
            if(!$scope.data.name){
            	$byLayer.msg('店铺名称不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.contacts){
            	$byLayer.msg('联系人姓名不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.gender){
            	$byLayer.msg('性别', 'failed');
            	return false;
            }
            if(!$scope.data.phone){
            	$byLayer.msg('联系人电话不能为空', 'failed');
            	return false;
            }
            if(phone_pattern.test($scope.data.phone)==false){
                $byLayer.msg('联系人电话不合法', 'failed');
                return false;
            }
            if(!$scope.data.logoPic){
            	$byLayer.msg('店铺logo不能为空', 'failed');
            	return false;
            }
            updateShop($scope,$http,$byLayer)
        }
		$scope.onkeydownNumber = function(){
        	var str=[];
        	var num  =$scope.data.phone;
        	if($scope.data.phone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.data.phone = str;
        		});
        	}
        }
        //重置
        $scope.clean=function(){
            getShopInfo($scope,$http);
        }
    }]);
