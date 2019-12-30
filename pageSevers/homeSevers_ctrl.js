//获取首页图片轮播
var getBanners=function($scope,$http){
    $http.post(baseUrl + 'pc/home/banners', {type:1}).success(function(result){
        if(result.error == 0) {
            $scope.banners=result.advertisements;
            $scope.intervaling();
        }
    });
}
//获取首页推荐商品和广告图片
var getRecommends=function($scope,$http){
    console.log('cc='+baseUrl+'pc/home/recommends');
    //推荐模块，{error: 0,recommends:[{recommends_name:推荐位置名称,advertise:{path: 图片路径, url: 链接, note: 描述说明},products:[{productid: 产品id, name: 产品名称, summary: 摘要说明, suggestedRetailUnitPrice: 价格, mainPic: 图片}, ...]}；失败：{error: >0, errmsg: 错误信息}
    $http.post(baseUrl+'pc/home/recommends', {}).success(function(result){
        if(result.error == 0) {
            $scope.recommends=result.data;
            return $scope.recommends;
        }
    });
}
//帮助链接
	var getAllHelpLinks=function($scope,$http){
        $http.post(baseUrl + 'pc/helpLink/many').success(function (result) {
            if(result.error >0) {

            } else {
                $scope.list= result.data;
                return $scope.list;
            }
        });
    }
