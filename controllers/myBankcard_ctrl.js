/**
 * Created by admin on 2016/9/18.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyBankcardCtrl', ['$scope','$http','$anchorScroll','$rootScope', function ($scope, $http, $anchorScroll, $rootScope) {
        $anchorScroll();
        $scope.data={};
        $scope.state=1;
        $scope.menu=5
        $scope.code_txt="获取手机验证码";
      var getmany=function(){
          $http.post(baseUrl + 'pc/card/many', $scope.data).success(function (result) {
              if(result.error >0) {

              } else {
                  $scope.cards= result.data;

              }
          });
      }
        getmany();

        //添加银行卡
        $scope.addCard=function(){
            $scope.data={};
            $rootScope.showLayer('#add_card','800px','550px','添加银行卡')
        }
        //编辑银行卡
        $scope.edit=function(id){
            getBankCard($scope,$http,$rootScope,id);
        }
        //delete银行卡
        var deleted=function(){
            $http.post(baseUrl + 'pc/card/removeBankCard', $scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('删除成功', 'success',function(){
                        getmany();
                    });
                }
            });
        }
        $scope.deleteCard=function(id){
            $scope.data.id=id
            $byLayer.confirm("是否删除",function(){
                deleted();
            });
        }
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
            /*if(!$scope.data.code){
                $byLayer.msg('验证码不能为空', 'failed')
                return false;
            }
            if(!$scope.data.codeToken){
                $byLayer.msg('验证码无效', 'failed')
                return false;
            }*/
            updateBankCard($scope,$http);

        }
    }]);