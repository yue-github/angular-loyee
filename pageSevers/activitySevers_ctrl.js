/**
 * 获取促销优惠券列表
 * @param promotionId 活动id
 * @return 成功：{error:0,data:[{id:id,title:优惠券标题},...]}
 */
var getPositionProductWithPromotion=function($scope,$http,data){
    $http.post(baseUrl+'pc/promotionManjian/getPositionProductWithPromotion',data).success(function(result){
        if(result.error == 0) {
            $scope.recommends=result.data;
        }else if (result.error > 0) {
        }
    });
}
/**
 * 获取促销优惠券列表
 * @param promotionId 活动id
 * @return 成功：{error:0,data:[{id:id,title:优惠券标题},...]}
 */
var getmanyPromCoupon=function($scope,$http,data){
    $http.post(baseUrl+'pc/promotionManjian/manyPromCoupon', data).success(function(result){
        if(result.error == 0) {
            $scope.manyPromCoupon=result.data;
        }else if (result.error > 0) {
        }
    });
}
/**
 * 领取优惠券
 * @param token
 * @param couponId 优惠券id
 * @return 成功：{error: 0,error:-1(优惠券已被领取完)}；失败：{error: >0, errmsg: 错误信息}
 */
var drawCustomerCoupon=function($scope,$http,id,data){
    $http.post(baseUrl+'pc/shopCoupons/drawCustomerCoupon', {couponId:id}).success(function(result){
        if(result.error == 0) {
            $byLayer.msg('领取成功', 'success', function () {
                getmanyPromCoupon($scope,$http,data);
            });
        }else if (result.error > 0) {
        }
    });
}
var getactivity=function($scope,$http,data){
    $http.post(baseUrl+'pc/promotionManjian/get', data).success(function(result){
        if(result.error == 0) {
            $scope.promotionInfo=result.data;
        }else if (result.error > 0) {
        }
    });
}


