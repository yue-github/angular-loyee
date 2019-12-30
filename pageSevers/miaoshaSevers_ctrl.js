//获取活动详情
var paginatePromotionProduct=function($scope,$http,data){
    $http.post(baseUrl + 'pc/salesPromotion/paginatePromotionProduct',data).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.salesPromotion = result;
        }
    });
}



