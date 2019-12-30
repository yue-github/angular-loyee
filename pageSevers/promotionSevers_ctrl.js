//图片轮播{error: 0, advertisements:[{path: 图片路径, url: 链接, note: 描述说明}, ...]}；失败：{error: >0, errmsg: 错误信息}
var getBanners=function($scope,$http){
    $http.post(baseUrl+'pc/promotion/banners').success(function(result){
        if(result.error == 0) {
            $scope.banners=result.advertisements;
        }
    });
}
//获取优惠活动
var getPromotions=function($scope,$http){
    // pc/promotion/promotions
    $http.post(baseUrl+'pc/promotionManjian/many',{promotionType: 1, length: 10, offset: 0}).success(function(result){
        
        if(result.error == 0) {
//            let obj=result.data;
//            obj.promPic = obj.mainPic;
        	result.data.forEach(item => {
        		item.promPic = item.mainPic;
        	});
            $scope.promotions = result.data;
        }
    });
}
//获取优惠活动
var getProducts=function($scope,$http){
    $http.post(baseUrl+'pc/promotion/many').success(function(result){
        if(result.error == 0) {
            $scope.many=result.products;
        }
    });
}
