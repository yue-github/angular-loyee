/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
    .controller('UpdateInfoCtrl',['$scope', '$location', '$http', 'Upload', '$anchorScroll', function ($scope, $location, $http, Upload, $anchorScroll) {
        $anchorScroll();
        $scope.code_txt="获取手机验证码";
        $scope.edit={};
        $scope.password={};
      var getinfo=function(){
          $http.post(baseUrl + 'pc/center/info',$scope.data).success(function (result) {
              if(result.error >0) {

              } else {
                  $scope.data=result.info;
                  $scope.data.headImg = $scope.getAbsolutePath($scope.data.headImg);
                  if(!$scope.data.mobilePhone){
                      $scope.updateTitle="绑定手机号码";
                  }else{
                      $scope.updateTitle="修改绑定手机号码";
                  }
              }
          });
      }
        getinfo();
        $scope.data={};

        //点击触发file标签
        $scope.updateImg=function(){
            document.getElementById('headImg').click();
        }
        //上传图片
        $scope.upload = function (file) {
            if (file) {
                var index = layer.load(0, {shade: 0.5});
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    $scope.data.headImg=$scope.getAbsolutePath(resp.data.path);
                    layer.close(index);
                }, function (resp) {
                }, function (evt) {
                });
            }
        };

        //提交修改信息
        $scope.submit=function(){
            $http.post(baseUrl + 'pc/center/updateInfo',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('修改成功', 'success',function(){
                        window.location.href="#/center"
                    });
                }
            });
        }

        //重置
        $scope.clean=function(k){
            getinfo();
        }

        //获取验证码
        $scope.checkcode = function(){
            var phone = $scope.edit.mobilePhone;
            var phone_pattern = /^1[0-9]{10}$/;

            if (phone == '' || phone == null) {
                $byLayer.msg('手机号不能为空', 'failed');
                return false;
            }
            if (!phone_pattern.test(phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed');
                return false;
            }

            $http.post(baseUrl + 'pc/center/getCode', {phone:phone}).success(function(result){
              if(result.error == 0){
                    $scope.is_disabled = true;
                    $scope.edit.codeToken=result.codeToken;
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
              }
            });

            //修改绑定手机号码
            $scope.editPhone=function(){

                var phone = $scope.edit.mobilePhone;
                var phone_pattern = /^1[0-9]{10}$/;

                if (phone == '' || phone == null) {
                    $byLayer.msg('手机号不能为空', 'failed');
                    return false;
                }
                if (!phone_pattern.test(phone)) {
                    $byLayer.msg('手机号码格式不正确', 'failed');
                    return false;
                }
                $scope.edit.phone=phone;
               if(!$scope.edit.code){
                   $byLayer.msg('验证码不可为空', 'failed');
                   return false;
               }
                if(!$scope.edit.codeToken){
                   $byLayer.msg('验证码无效,请重新发送', 'failed');
                   return false;
               }
                $('#editPhone').modal('hide');
                $http.post(baseUrl+'pc/center/bindPone',$scope.edit).success(function(result){
                    if(result.error==0){
                        $byLayer.msg('修改成功', 'success', function () {
                            getinfo();
                        });
                    }
                });
            }
        };

        //修改登录密码
        $scope.checkpasswordCode = function(){
            var phone = $scope.data.mobilePhone;

            $http.post(baseUrl + 'pc/findPassword/getCode', {phone:phone}).success(function(result){
                if (result.error>0) {
                    $byLayer.msg('手机号码不正确', 'failed')
                    return false;
                }else if(result.error == 0){
                    $scope.is_disabled = true;
                    $scope.password.codeToken=result.codeToken;
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

                }

            });
        };

        $scope.editpassword=function(){
            $scope.password.customerId=$scope.data.id;
            if($scope.data.mobilePhone){
                $scope.password.phone = $scope.data.mobilePhone;

                if(!$scope.password.code){
                    $byLayer.msg('验证码不能为空', 'failed')
                    return false;
                }
                if(!$scope.password.codeToken){
                    $byLayer.msg('验证码无效', 'failed')
                    return false;
                }
                if(!$scope.password.password){
                    $byLayer.msg('密码不能为空', 'failed')
                    return false;
                }
                if(!$scope.password.repassword){
                    $byLayer.msg('确认密码不能为空', 'failed')
                    return false;
                }
                if($scope.password.repassword!=$scope.password.password){
                    $byLayer.msg('确认密码与密码不一致', 'failed')
                    return false;
                }
                $http.post(baseUrl+'pc/findPassword/updatePassword', $scope.password).success(function(result){
                    if(result.error == 0) {
                        $byLayer.msg('修改成功', 'success',function(){
                            $('#editPassword').modal('hide');
                            getinfo();
                        });
                    }
                });
            }else if($scope.data.email){
                $http.post(baseUrl+'pc/findPassword/sendEmail', $scope.data).success(function(result){
                    if(result.error == 0) {
                        $byLayer.msg('链接已发送到您的邮箱，请注意查看', 'success');
                    }else if(result.error==-1){
                        $byLayer.msg('该邮箱账号不存在', 'failed');
                    }else if(result.error==-2){
                        $byLayer.msg('发送邮件失败', 'failed');
                    }
                });
            }
        }

    }]);
