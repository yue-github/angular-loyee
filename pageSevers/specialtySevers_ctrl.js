
var getCategories=function($scope,$http,data){
    $http.post(baseUrl + 'pc/specialty/categories',data).success(function (result) {
        if (result.error > 0) {}else {
            $scope.categorylist=result.data;
        }
    });
} 
var getproductAll=function($scope,$http,data){
    $http.post(baseUrl + 'pc/products/getProductAll',data).success(function (result) {
        if (result.error > 0) {}else {
            $scope.products=result.products;
            //分页
           /* $scope.data.length=result.length;
            $scope.data.offset=result.offset;
            $scope.totalRow=result.totalRow;
            $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
            $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
            $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);*/
        }
    });
}
//根据分类ID获取相关商品
var getproducts=function($scope,$http,data){
    var url="";
    if(data.cateId){
        url=baseUrl+"pc/products/getProductByCateId";
    }else if(data.cateName != "辣条君"){
        url=baseUrl+"pc/products/products";
    }else{
    	url = baseUrl + 'pc/products/getProductAll';
    }
    $http.post(url,data).success(function (result) {
        if(result.error >0) {

        } else {
            result.products = result.products.filter(i=>{
                return i.isDelete === 0;
                
            });
            result.totalRow = result.products.length;
            $scope.cateName=result.cateName;
            $scope.products= result.products;
            //分页
            $scope.data.length=result.length;
            $scope.data.offset=result.offset;
            console.log(result);
            $scope.totalRow=result.totalRow;
            $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
            $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
            $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
        }
    });
}
var remove_addClass=function(data){
	angular.element(document.querySelector('.u_title')).find("a").removeClass('active');  
    angular.element(document.querySelector("."+data)).addClass('active');
}
