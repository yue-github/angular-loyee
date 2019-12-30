var getCategories=function($scope,$http){
    $http.post(baseUrl + 'pc/products/getAllCategories').success(function (result) {
        if (result.error > 0) {}else {
            $scope.categories=result.categories;
        }
    });
}
//根据分类ID获取相关商品
var getproducts=function($scope,$http,data){
    var url="";
    if(data.cateId){
        url=baseUrl+"pc/products/getProductByCateId";
    }else{
        url=baseUrl+"pc/products/products";
    }
    $http.post(url,data).success(function (result) {
        if(result.error >0) {

        } else {
            $scope.categoryName=result.categoryName;
            $scope.products= result.products;
            $scope.totalRow= result.totalRow;
            //分页
            var pagelength=result.totalPage;
            $scope.pagelength=pagelength;
            var totailpages1=$scope.data.pageNumber+5;
            if(pagelength<=10){
                for(var i=0;i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }else if($scope.data.pageNumber<=5&&pagelength>10){
                for(var i=0;i<10;i++){
                    $scope.pages.push(i+1);
                }
            }else if(pagelength<10){
                for(var i=0;i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }else if($scope.data.pageNumber>5&&pagelength>totailpages1){
                for(var i=$scope.data.pageNumber-4;i<$scope.data.pageNumber+6;i++){
                    $scope.pages.push(i);
                }
            }else if($scope.data.pageNumber>5&&pagelength<totailpages1){
                for(var i=$scope.data.pageNumber-((pagelength-$scope.data.pageNumber)+4);i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }
        }
    });
}



