var getDeletedProducts=function($scope,$http,data){
    $http.post(baseUrl+'pc/addProductInfo/getDeletedProducts',data).success(function(result){
        if(result.error > 0) {

        }else {
            $scope.products=result.data;
            //分页
            $scope.data.length=result.length;
            $scope.data.offset=result.offset;
            $scope.totalRow=result.totalRow;
            $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
            $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
            $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
        }
    });
}
var recoverProducts=function($scope,$http,data){
    $http.post(baseUrl+'pc/addProductInfo/recoverProducts',data).success(function(result){
        if(result.error > 0) {

        }else {
            $byLayer.msg('还原成功',"success",function(){
                getDeletedProducts($scope,$http,$scope.data)
            });
        }
    });
}
var onShelfProducts=function($scope,$http,data){
    $http.post(baseUrl+'pc/addProductInfo/onShelfProducts',data).success(function(result){
        if(result.error > 0) {

        }else {
            $byLayer.msg('上架成功',"success",function(){
                getDeletedProducts($scope,$http,$scope.data)
            });
        }
    });
}



