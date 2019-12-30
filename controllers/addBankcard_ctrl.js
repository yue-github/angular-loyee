/**
 * Created by admin on 2016/9/18.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('AddBankcardCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.state=1;
        $scope.menu=5
        $scope.title="添加";
        $scope.data={};
        $scope.code_txt="获取手机验证码";
        $scope.checkcode = function(){
            var phone = $scope.data.contactNumber;
            var phone_pattern = /^1[0-9]{10}$/;
            if (phone == '' || phone == null) {
                $byLayer.msg('手机号不能为空', 'failed')
                return false;
            }
            if (!phone_pattern.test(phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed')
                return false;
            }
            $http.post(baseUrl + 'pc/card/getCode', {phone:phone}).success(function(result){
                if (result.error>0) {
                    $byLayer.msg('手机号码不正确', 'failed')
                    return false;
                }else if(result.error == 0){
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
                }
            });
        };
        $scope.submit=function(){
            if(!$scope.data.accountNumber){
                $byLayer.msg('银行卡号不能为空', 'failed')
                return false;
            }
            if(!$scope.data.bankName){
                $byLayer.msg('开户银行名称不能为空', 'failed')
                return false;
            }
            if(!$scope.data.bankBranch){
                $byLayer.msg('开户支行名称不能为空', 'failed')
                return false;
            }
            if(!$scope.data.accountName){
                $byLayer.msg('持卡人姓名不能为空', 'failed')
                return false;
            }
            if(!$scope.data.contactNumber){
                $byLayer.msg('手机号不能为空', 'failed')
                return false;
            }
            if(!$scope.data.code){
                $byLayer.msg('验证码不能为空', 'failed')
                return false;
            }
            if(!$scope.data.codeToken){
                $byLayer.msg('验证码无效', 'failed')
                return false;
            }
            $http.post(baseUrl + 'pc/card/createBankCard', $scope.data).success(function (result) {
                if(result.error >0) {
                } else if(result.error ==0){
                    $byLayer.msg('添加成功', 'success',function(){
                        window.location.href="#/myBankcard";
                    });

                }else if(result.error ==-1){
                    $byLayer.msg('验证码错误', 'failed')
                }
            });
        }
    }]);