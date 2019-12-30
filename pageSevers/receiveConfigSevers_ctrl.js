//获取验证码
var getCode=function($scope,$http,phone){
    $http.post(baseUrl + 'mobile/coupons/getCode', {phone: phone}).success(function (result) {
        if (result.error == 0) {
            $scope.is_disabled = true;
            $scope.data.codeToken = result.codeToken;
            var time = 60;
            var init = setInterval(function () {
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
}
var gainCoupon=function($scope,$http,data){
    $http.post(baseUrl + 'mobile/coupons/gainCoupon', data).success(function (result) {
        if(result.error==0){
            $byLayer.msg('领取成功', 'success',function(){
                window.location.href="#/home"
            });
        }else if(result.error==-1){
            $byLayer.msg('手机验证码不正确！', 'failed');
            return false;
        }else if(result.error==-2){
            $byLayer.msg('该优惠券不存在！', 'failed');
            return false;
        }else if(result.error==-3){
            $byLayer.msg('该优惠券已过期！', 'failed');
            return false;
        }else if(result.error==-4){
            $byLayer.msg('该优惠券已被领取完！', 'failed');
            return false;
        }else if(result.error==-5){
            $byLayer.msg('已领取过该优惠券了！', 'failed');
            return false;
        }else if(result.error==-6){
            $byLayer.msg('领取失败！', 'failed');
            return false;
        }
    })
}


