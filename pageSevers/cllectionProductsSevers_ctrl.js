//获取收藏的商品
var getcollections=function($scope,$http,data){
    $http.post(baseUrl+'pc/center/myProductCollections', data).success(function(result){
        if(result.error == 0) {
            $scope.products=result.data;
            //分页
            $scope.data.length=result.length;
            $scope.data.offset=result.offset;
            $scope.totalRow=result.totalRow;
            $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
            $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
            $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);

        }else if (result.error > 0) {

        }
    });
}
//取消收藏
var cancelProductCollection=function($scope,$http,data, $route){
    $http.post(baseUrl+'pc/center/cancelProductCollection',data).success(function(result){
        if(result.error == 0) {
            $byLayer.msg('取消成功', 'success');
            $route.reload();
            getcollections($scope,$http,data);
        }else if (result.error > 0) {

        }
    });
}

