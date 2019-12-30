/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('receiveConfigCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.code_txt="获取手机验证码";
        $scope.data={};
        //获取验证码
        $scope.checkcode = function(){
            var phone = $scope.data.phone;
            var phone_pattern = /^1[3|4|5|8][0-9]\d{4,8}$/;

            if (phone == '' || phone == null) {
                $byLayer.msg('手机号不能为空', 'failed');
                return false;
            }
            if (!phone_pattern.test(phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed');
                return false;
            }
            $scope.is_disabled = true;
            //获取验证码
            getCode($scope,$http,phone);
        }
        /**
         * 领取优惠券
         * @param couponId 优惠券Id
         * @param phone 手机号
         * @param code 手机验证码
         * @param codeToken 验证码token值  gainCoupon
         * @return 成功：{error: 0(成功), error:-1(手机验证码不正确),error:-2(该优惠券不存在),error:-3(该优惠券已过期),error:-4(该优惠券已被领取完),error:-5(已领取过该优惠券了),error:-6(领取失败)} 失败：{error:>0,errmsg:错误信息}
         */
       $scope.submit=function(){
           var phone = $scope.data.phone;
           var codeToken = $scope.data.codeToken;
           var code = $scope.data.code;
           var couponId =$location.search().id;
           $scope.data.couponId =couponId;
           var phone_pattern = /^1[0-9]{10}$/;

           if (phone == '' || phone == null) {
               $byLayer.msg('手机号不能为空', 'failed');
               return false;
           }
           if (!phone_pattern.test(phone)) {
               $byLayer.msg('手机号码格式不正确', 'failed');
               return false;
           }
           if (!code) {
               $byLayer.msg('验证码不能为空', 'failed');
               return false;
           }
           if (!codeToken) {
               $byLayer.msg('验证码无效', 'failed');
               return false;
           }
           if (!couponId) {
               $byLayer.msg('该优惠券不存在', 'failed');
               return false;
           }
           gainCoupon($scope,$http,$scope.data);
       }
    }]);
