//获取商品分类导航
var getcategory=function($scope,$http,productId){
    $http.post(baseUrl + 'pc/product/getProductCategory', {id: productId}).success(function (result) {
        if (result.error > 0) {
        } else {
            $scope.ProCategory=result.data;
        }
    });
}
//获取商品信息
var getProductInfo=function($scope,$http,productId,$sce){
    $http.post(baseUrl + 'pc/group_activity/set_meal_detail', {id: productId}).success(function (result) {
    	
        if (result.error == 0) {
        	$scope.product = result.data;
        	$scope.product.shopType = 3;
            $scope.trustHtml = $sce.trustAsHtml($scope.product.desc)
            $scope.amount = 1;
        }
    });
}
//创建用户查看习惯
var saveCustomerLook=function($scope, $http,product){
	var id = product.id;
	var name = product.name;
	var supplierId = product.supplier_id;
	var categoryId = product.category_id;
    $http.post(baseUrl + 'pc/customerLook/createLook', {productId: id, productName:name, supplierId: supplierId, categoryId: categoryId}).success(function (result) {
        if (result.error > 0) {
        } else {
            $scope.myHtml = result.product.note;
            $scope.trustHtml = $sce.trustAsHtml($scope.myHtml)
            $scope.amount = 1;
            if(result.product.isDelete==1||result.product.is_sale==0){
                $byLayer.msg('该商品已下架，请继续浏览其他商品！','failed');
                history.back();
            }
            $scope.product = result.product;
        }
    });
}
//获取促销活动信息
var getPromInfoByProductId=function($scope,$http,productId){
    $http.post(baseUrl + 'pc/promotion/productPromotions', {productId: productId}).success(function (result) {
        if (result.error > 0) {
        } else {
            $scope.PromotionList=result.data
            if($scope.PromotionList.length==0){
            	$scope.Promotion = true;
            }
        }
    });
}

//获取优惠券
var getCouponByProductId=function($scope,$http,productId){
    $http.post(baseUrl + 'pc/coupon/productCoupons', {productId: productId}).success(function (result) {
    	
        if (result.error > 0) {
        } else {
            $scope.couponList=result.data
            if($scope.couponList.length==0){
            	$scope.coupon = true;
            }
        }
    });
}


//获取商品销售属性
var getAttrs=function($scope,$http,productId){
    $http.post(baseUrl + 'pc/product/getAttrs', {id: productId}).success(function (result) {
        if (result.error > 0) {
        } else {
            $scope.commonAttrs = result.commonAttrs;
            $scope.saleAttrs = result.saleAttrs;
        }
    });
}
//获取商品评论
var productReview=function($scope,$http,productReviewData){
    $http.post(baseUrl + 'pc/product/productReview',  productReviewData).success(function (result) {
        if (result.error == 0) {
            $scope.reviews = result.reviews;
            $scope.reviews_num = result.totalRow;
            console.log($scope.reviews_num);
            $scope.ratings = result.rangs;
            //分页
            var pagelength=result.totalPages;
            $scope.pagelength=pagelength;
            var totailpages1=productReviewData.page+5;
            if(productReviewData.page<=5&&pagelength<10){
                for(var i=0;i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }else if(pagelength<=10){
                for(var i=0;i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }else if(productReviewData.page<=5&&pagelength>10){
                for(var i=0;i<10;i++){
                    $scope.pages.push(i+1);
                }
            }else if(productReviewData.page>5&&pagelength>=totailpages1){
                for(var i=productReviewData.page-4;i<productReviewData.page+6;i++){
                    $scope.pages.push(i);
                }
            }else if(productReviewData.page>6&&pagelength<totailpages1){
                for(var i=productReviewData.page-(5-(pagelength-productReviewData.page)+5);i<pagelength;i++){
                    $scope.pages.push(i+1);
                }
            }
        }
    });
}
//获取商品店铺信息
var getShop=function($scope,$http,productId){
    $http.post(baseUrl + 'pc/product/getShop', {productId: productId}).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.shop = result.data;
        }
    });
}
//根据属性id数组获取商品价格
var getPrice = function ($scope,$http,productId) {
    var ids = "";
    for (var i = 0; i < $scope.saleAttrs.length; i++) {
        ids += $scope.attrSelecteds[i];
        if (i < $scope.saleAttrs.length - 1) {
            ids = ids + ',';
        }
    }
    $http.post(baseUrl + 'pc/product/getPrice', {
        type_attr: ids,
        product_id: productId
    }).success(function (result) {
        if (result.error == 0) {
            $scope.price = result.data.price;
            $scope.product.suggestedRetailUnitPrice=$scope.price;
            $scope.product.originUnitPrice=result.data.originUnitPrice;
            $scope.product.storeAmount=result.data.product_number;
            $scope.priceId = result.data.id;
        } else {
        }
    });
}
//加载地址信息获取所有省市
var provinces = function ($scope,$http) {
    $http.post(baseUrl + 'pc/address/provinces').success(function (result) {
        if(result.error >0) {
        }else{
            $scope.provinces1= result.provinces;
        }
    });
}
//根据省id获取该省份的所有城市
var getCityData = function ($scope,$http,address) {
    $http.post(baseUrl + 'pc/address/cities',address).success(function (result) {
        if(result.error >0) {
        }else{
            $scope.cities= result.cities;
        }
    });
     $scope.showflog=0;
}
//根据商品id、省id、市id查询快递模板
var getTemplates = function ($scope,$http,address) {
    $http.post(baseUrl+'pc/logisticsTemplate/getFreightByProductId',address).success(function(result){
        if(result.error >0) {
        }else{
            if(result.data.length>0){
                if(result.data[0].expressType==1){
                    result.data[0].expressType="快递";
                }
            }

            $scope.express= result.data;
        }
    })
     $scope.showType=0;
}


//加入购物车
var addCart = function ($scope,$http,productId,amount,priceId) {
    $http.post(baseUrl + 'pc/order/addCart', {id: productId, amount: amount, priceId:priceId}).success(function (result) {
        if (result.error == 0) {
            $byLayer.msg('加入购物车成功', 'success')
        }else{
        }
    });
}
//是否收藏
var whetherCollection = function($scope,$http,productId){
	$http.post(baseUrl + 'pc/product/whetherCollection', {productId: productId}).success(function (result) {
        if (result.error == 1) {
            var star = document.getElementById('star');
            star.style.color="red";
        } else if(result.error==2){
            
        }
    });
}
//收藏商品
var collection = function ($scope,$http,productId) {
    $http.post(baseUrl + 'pc/product/collection', {productId: productId}).success(function (result) {
        if (result.error == 0) {
            $byLayer.msg('收藏成功', 'success');
            var star = document.getElementById('star');
            star.style.color="red";
        } else if(result.error==-1){
            $byLayer.msg('已经收藏过了', 'failed');
        }
    });
}
//收藏店铺
var collectionShopA= function ($scope,$http,id) {
    $http.post(baseUrl + 'pc/product/collectionShop', {
        shopId: id
    }).success(function (result) {
        if (result.error == 0) {
            $byLayer.msg('收藏成功', 'success');
        } else if(result.error==-1){
            $byLayer.msg('已经收藏过了', 'failed');
        }
    });
}
//客户行为推荐商品
var getRecommendProductsByCustomer=function($scope,$http,data){
    $http.post(baseUrl + 'pc/product/getRecommendProductsByCustomer',data).success(function (result) {
        if(result.error >0) {

        } else {
            $scope.recommentProducts=result.data;
        }
    });
}

var getHotelPrice=function($scope,$http,data){
    $http.post(baseUrl + 'pc/product/getHotelPrice',data).success(function (result) {
        if(result.error >0) {
        } else {
          $scope.price = result.price;
          $scope.originUnitPrice = result.originUnitPrice;
        }
    });
}