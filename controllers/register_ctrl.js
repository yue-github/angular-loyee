/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('RegisterCtrl',['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.data={};
        $scope.code_txt="获取手机验证码";

        $scope.data.type=1;
        $scope.hide="active";
        $scope.show="";
        $scope.tabshide=function(){
            $scope.hide="active";
            $scope.show="";
            $scope.data.type=1;
        }
        $scope.tabsshow=function(){
            $scope.hide="";
            $scope.show="active";
            $scope.data.type=2;
        }

        $scope.data.mobilePhone='';
        $scope.data.vcode='';
        $scope.data.email='';
        $scope.data.code='';
        $scope.data.password='';
        $scope.data.passworded='';
        $scope.vcodePath = '';
        $scope.vcodeToken = '';
        
        function getVcodePath() {
        	$http.post(baseUrl+'pc/validateCode/getValidateCode', {}).success(function(result){
                $scope.vcodePath = result.path;
                $scope.vcodeToken = result.vcodeToken;
            });
        }
        
        getVcodePath();
        
        $scope.changeImg = function() {
        	getVcodePath(); 
        }

        //获取验证码
        $scope.checkcode = function(){
            var phone = $scope.data.mobilePhone;
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
            if (!vcode) {
                $byLayer.msg('图形验证码不能为空', 'failed');
                return false;
            }

            $http.post(baseUrl + 'pc/register/getCode', {phone:phone,vcode:vcode,vcodeToken:vcodeToken}).success(function(result){
                if (result.error == -2) {
                    $byLayer.msg('该手机号码已注册', 'failed');
                    return false;
                } else if (result.error == -3) {
                	$byLayer.msg('图形验证码不正确', 'failed');
                    return false;
                } else if(result.error == 0){
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
                } else if(result.error == 10){
                    $byLayer.msg(errmsg,'failed');
                }
                 else {
                	$byLayer.msg('发送短信失败', 'failed');
                    return false;
                }

            });
        };
        $scope.onkeydownNumber = function(){
        	var str=[];
        	var num  = $scope.data.mobilePhone;
        	if(num.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        			$scope.data.mobilePhone= str;
        		});
      			
        	}
        	
        }
        $scope.Look=true;
        $scope.submit=function(){
            if(!$scope.Look){
                $byLayer.msg('请接受服务条款', 'failed');
                return false;
            }
            if( $scope.data.type==1){
            	if( !$scope.data.mobilePhone){
                    $byLayer.msg('手机号码不能为空', 'failed');
                    return false;
                }
            	if( !$scope.data.code){
                    $byLayer.msg('验证码不能为空', 'failed');
                    return false;
                }
                if( !$scope.data.codeToken){
                    $byLayer.msg('无效验证码', 'failed');
                    return false;
                }
            }else if($scope.data.type==2){
                var email = $scope.data.email;
                var email_pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
                if (email == '' || email == null) {
                    $byLayer.msg('邮箱不能为空', 'failed')
                    return false;
                }

                if (!email_pattern.test(email)) {
                    $byLayer.msg('邮箱格式不正确', 'failed')
                    return false;
                }
            }
            if( !$scope.data.password){
                $byLayer.msg('密码不能为空', 'failed');
                return false;
            }
            if( !$scope.data.passworded){
                $byLayer.msg('确认密码不能为空', 'failed');
                return false;
            }
            if( $scope.data.password!=$scope.data.passworded){
                $byLayer.msg('密码不一致', 'failed');
                return false;
            }

            if($scope.data.type==2){
                $http.post(baseUrl+'pc/register/verifedEmail', $scope.data).success(function(result){
                    if(result.error == 0) {
                        $byLayer.msg('注册成功，请登录邮箱进行验证', 'success', function () {
                            window.location.href="#/regValidateEmail?email="+$scope.data.email;
                        });
                    }else if (result.error == -1) {
                        $byLayer.msg('密码不一致', 'failed');
                    }else if (result.error == -2) {
                        $byLayer.msg('该邮箱已经注册了，请前往登录！', 'success', function () {
                            window.location.href="#/login";
                        });
                    }else if (result.error == -3) {
                        $byLayer.msg('该邮箱已经注册了，请登录邮箱进行验证！', 'success', function () {
                            window.location.href="#/regValidateEmail?email="+$scope.data.email;
                        });
                    }
                });
            } else{
                $http.post(baseUrl+'pc/register/register', $scope.data).success(function(result){
                    if(result.error == 0) {
                        $byLayer.msg('注册成功', 'success', function () {
                            window.location.href="#/home";
                        });
                    }else if (result.error == -1) {
                        $byLayer.msg(result.errmsg, 'failed');
                    }else if (result.error == -2) {
                        $byLayer.msg('该账户已存在，请核对注册信息！', 'failed');
                    }else if (result.error == -3) {
                        $byLayer.msg('验证码不正确', 'failed');
                    }else if (result.error == -3) {
                        $byLayer.msg('注册失败，请刷新页面重新注册', 'failed');
                    }else if (result.error == -5) {
                        $byLayer.msg('手机号码已篡改', 'failed');
                    }else{
                        $byLayer.msg(result.errmsg, 'failed');
                    }
                });
            }

        }

        $scope.dologin=function(){
            window.location.href="#/login";
        }

    }]);
