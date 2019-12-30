/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('LoginCtrl', ['$scope','$location','$http', '$cookies', '$rootScope', '$anchorScroll', function ($scope, $location, $http, $cookies, $rootScope, $anchorScroll) {
        $anchorScroll();
        $rootScope.navstate="";
        $scope.isPhoneLogin = false;
        $scope.code_txt = "获取验证码";
        $scope.data={};
        $scope.data.vcodeToken = '';
        
        function getVcodePath() {
        	$http.post(baseUrl+'pc/validateCode/getValidateCode', {}).success(function(result){
                $scope.vcodePath = result.path;
                $scope.data.vcodeToken = result.vcodeToken;
            });
        }
        
        getVcodePath();
        
        $scope.changeImg = function() {
        	getVcodePath(); 
        }
        
        $scope.submit=function(){
        	if($scope.isPhoneLogin) {
        		if(!$scope.data.phone){
                    $byLayer.msg('账号不可为空', 'failed');
                    return false;
                }
        		if(!$scope.data.code){
                    $byLayer.msg('手机验证码不可为空', 'failed');
                    return false;
                }
        		if(!$scope.data.vcode){
                    $byLayer.msg('验证码不可为空', 'failed');
                    return false;
                }
        		
        		$scope.phoneLogin();
        	} else {
        		if(!$scope.data.phone){
                    $byLayer.msg('账号不可为空', 'failed');
                    return false;
                }
                if(!$scope.data.password){
                    $byLayer.msg('密码不可为空', 'failed');
                    return false;
                }
                if(!$scope.data.vcode){
                    $byLayer.msg('验证码不可为空', 'failed');
                    return false;
                }
                submitData($scope,$http,$cookies,$rootScope,$scope.data, function() {
                	getVcodePath();
                });
        	}
        }
        
        $scope.phoneLogin=function(){
            $http.post(baseUrl+'pc/login/phoneLogin', $scope.data).success(function(result){
                if(result.error==0){
                    $byLayer.msg('登录成功', 'success', function () {
                        $cookies.put('token', result.token);
                        $rootScope.logined=true;
                        if(result.customer.nickName!=null){
                            $rootScope.cookiesName=result.customer.nickName;
                            $cookies.put("cookiesName",$rootScope.cookiesName);
                        }else if(result.customer.mobilePhone!=null){
                            $rootScope.cookiesName=result.customer.mobilePhone;
                            $cookies.put("cookiesName",$rootScope.cookiesName);
                        }else if(result.customer.email!=null){
                            $rootScope.cookiesName=result.customer.email;
                            $cookies.put("cookiesName",$rootScope.cookiesName);
                        }
                        if(!result.customer.shop_id){
                            $rootScope.cookiesShopid=false;
                            $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
                        }else {
                            $rootScope.cookiesShopid=true;
                            $rootScope.shopId=result.customer.shop_id;
                            $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
                            $cookies.put("shopId",$rootScope.shopId);
                        }
                        history.back();
                    });
                } else {
                	$byLayer.msg(result.errmsg, 'failed');
                }
            });
        }
        
        //QQ登录
        $scope.QQLogin=function(){
            qqLoginSe($http);
        }
        //微信登录
        $scope.weixinLogin=function(){
            qqLoginSe($http);
        }
        //键盘回车键
        $scope.myKeyup=function (e) {
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.submit();
            }
        }
        //跳转注册页面
        $scope.goback=function(){
            window.location.href="#/register";
        }
        
      //获取验证码
        $scope.checkcode = function(){
            var phone = $scope.data.phone;
            var vcode = $scope.data.vcode;
            var vcodeToken = $scope.vcodeToken;
            var phone_pattern =/^[1][3,4,5,7,8][0-9]{9}$/;

            if (phone == '' || phone == null) {
                $byLayer.msg('手机号不能为空', 'failed');
                return false;
            }
            if (!phone_pattern.test(phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed');
                return false;
            }

            $http.post(baseUrl + 'pc/login/getCode', {phone:phone,vcode:vcode,vcodeToken:vcodeToken}).success(function(result){
                if(result.error == 0){
                    $scope.is_disabled = true;
                    $scope.data.codeToken=result.codeToken;
                    $scope.data.phone = result.phone;
                    var time = 60;
                    var init = setInterval(function(){
                        $scope.$apply(function () {
                            if (time >= 0) {
                                $scope.code_txt = time + '秒后重新发送';
                            } else {
                                $scope.code_txt = '获取手机验证码';
                                $scope.is_disabled = false;
                                clearInterval(init);
                            }
                            time--;
                        });
                    }, 1000);
                } else {
                	$byLayer.msg('发送短信失败', 'failed');
                    return false;
                }

            });
        };
    }]);
