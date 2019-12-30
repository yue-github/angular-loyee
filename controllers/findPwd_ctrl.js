/**
 * Created by admin on 2016/9/6.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('FindPwdCtrl',['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.data={};
        $scope.hide="active";
        $scope.show="";
        $scope.code="images/code.jpg";
        $scope.code_txt="获取手机验证码";
        $scope.vcodePath="";
        $scope.vcodeToken="";
        //选择找回密码方式
        $scope.selecttype=function(type){
            $scope.data.type=type;
        }
        $scope.selecttype(1);
        
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

        $scope.checkcode = function(){
            var phone = $scope.data.phone;
            var vcode = $scope.data.vcode;
            var vcodeToken = $scope.vcodeToken;
            var phone_pattern = /^1[0-9]{10}$/;
            if (phone == '' || phone == null) {
                $byLayer.msg('手机号不能为空', 'failed')
                return false;
            }
            if (!phone_pattern.test(phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed')
                return false;
            }
            if (!vcode) {
                $byLayer.msg('图形验证码不能为空', 'failed');
                return false;
            }

            $http.post(baseUrl + 'pc/findPassword/getCode', {phone:phone,vcode:vcode,vcodeToken:vcodeToken}).success(function(result){
                if (result.error>0) {
                    $byLayer.msg('发送验证码失败', 'failed')
                    return false;
                } else if (result.error == -3) {
                	$byLayer.msg('图形验证码不正确', 'failed');
                    return false;
                } else if(result.error == 0){
                    $scope.is_disabled = true;
                    $scope.data.codeToken=result.codeToken;
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
        $scope.submit=function(){
            if( $scope.data.type==1){
                var phone = $scope.data.phone;
                var phone_pattern = /^1[0-9]{10}$/;
                if (phone == '' || phone == null) {
                    $byLayer.msg('手机号不能为空', 'failed')
                    return false;
                }

                if (!phone_pattern.test(phone)) {
                    $byLayer.msg('手机号码格式不正确', 'failed')
                    return false;
                }

                if(!$scope.data.code){
                    $byLayer.msg('验证码不能为空', 'failed')
                    return false;
                }
//                if(!$scope.data.codeToken){
//                    $byLayer.msg('验证码无效', 'failed')
//                    return false;
//                }
                $http.post(baseUrl+'pc/findPassword/nextByPhone', $scope.data).success(function(result){
                    if(result.error == 0) {
                        $byLayer.msg('提交申请成功', 'success',function(){
                            window.location.href="#/setNewPwd";
                        });
                    }else if(result.error==-1){
                        $byLayer.msg('验证码不正确', 'failed')
                    }else if(result.error==-2){
                        $byLayer.msg('该账户不存在', 'failed')
                    }else if (result.error == 2) {
                    	$byLayer.msg('验证码不正确', 'failed')
                    }else if (result.error == -3) {
                    	$byLayer.msg('验证码尝试次数不能超过5次,请5分钟后再试', 'failed')
                    }
                });
            }
        }
        $scope.validateEmail=function(){ 
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
            $http.post(baseUrl+'pc/findPassword/sendEmail', $scope.data).success(function(result){
                if(result.error == 0) {
                    $byLayer.msg('提交申请成功', 'success');
                }else if(result.error==-1){
                    $byLayer.msg('该邮箱账号不存在', 'failed');
                }else if(result.error==-2){
                    $byLayer.msg('发送邮件失败', 'failed');
                }else if(result.error==-3){
                    $byLayer.msg('该邮箱超过发送条数', 'failed');
                }
            });
        }
    }]);