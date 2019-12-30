var getShopDecoration=function($scope,$http,shopId){
    $http.post(baseUrl+'pc/shopDecoration/getShopDecoration',{shopId:shopId}).success(function(result){
        if(result.error==0){

            if(result.data){
                var attr=JSON.parse(result.data.attr);
                $scope.data= attr.index;
                $scope.modelID= result.data.id;
                $scope.ProductDetails= attr.detailpage;
            }else {
                $scope.data=[
                    {sort_num:1,brand:[{url:"#",path:"images/shopheader.jpg"}],title:"分栏广告",type:1},
                    {sort_num:2,nav:[{name:"首页",sort_num:0,url:"#/home"}],title:"导航栏",type:2},
                ];
                $scope.ProductDetails={products:[{id:1,mainPic:"images/p3-3.png",name:"甜枣",suggestedRetailUnitPrice:10}],title:"更多商品"};
            }
        }
    })
}
var uploadFile=function($scope,$http,file, k, type,Upload,index) {
    Upload.upload({
        url: baseUrl + "admin/file/upload",
        data: {file: file}
    }).then(function (resp) {
        if(type==1){
            $scope.brand.brand[0].path=resp.data.path;
        }else if(type==2){
            $scope.banners[k].path=resp.data.path;
            $scope.bannerPath=resp.data.path;
        }
        $byLayer.close(index);
    }, function (resp) {
    }, function (evt) {
    });
}
var getOnShelfProduct=function($scope,$http) {
    $scope.data={};
    $scope.data.length=1000;
    $scope.data.offset=0;
    $http.post(baseUrl+'pc/shopDecoration/getOnShelfProduct',$scope.data).success(function(result){
        if(result.error==0){
            $scope.products=result.data;
            for(var i=0;i<$scope.products.length;i++){
                $scope.products[i].is_sel=0;
            }
        }
    })
}
var submitShopDecoration=function($scope,$http,attr) {
    $http.post(url,{attr:attr}).success(function(result){
        if(result.error==0){
            alert("提交成功");
        }
    })
}




