
var contypeMap={
    1:'折扣券',
    2:'现金券'
};
getmany=function($scope,$http,data1){
    $http.post(baseUrl + 'pc/coupon/findCoupons',data1).success(function (result) {
        if(result.error >0) {

        } else {
            for(var i = 0; i < result.coupons.length; i++) {
                if(result.coupons[i].type==1){
                    result.coupons[i].unit="%";
                }else{
                    result.coupons[i].unit="元";
                }
                result.coupons[i].type = contypeMap[result.coupons[i].type];
            }
            $scope.coupons = result.coupons;

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
var getManyCouponProduct=function($scope,$http,manyCouponProduct) {
    $http.post(baseUrl + 'pc/coupon/findCouponProducts',manyCouponProduct).success(function (result) {
        if(result.error >0){

        } else {
            var length=result.data.length;
            for(var i=0;i<length;i++){
                $scope.product.product_list.push(result.data[i]);
            }
            $scope.manyCouponProduct.totalPage=result.totalPage;
        }
    });
}
var getshopProducts=function($scope,$http,data){
    $http.post(baseUrl + 'pc/coupon/getshopProducts',data).success(function (result) {
        if(result.error >0) {

        } else {
            var length=result.data.length;
            for(var i=0;i<length;i++){
                result.data[i].isSelect=0;
                $scope.products.push(result.data[i]);
            }
            $scope.getProducts.totalPage=result.totalPage;
        }
    });
}
var batchCreateCouponProduct=function($scope,$http,current,objectId){
    $http.post(baseUrl + 'pc/coupon/batchCreateCouponProduct',{couponId:current,objectIds:objectId,type:2}).success(function (result) {
       
        if(result.error >0) {

        } else {
            $byLayer.msg('添加成功', 'success', function () {
                $("#add-product-form").modal('hide');
                $scope.check($scope.manyCouponProduct.id,1);
            })

        }
    });
}
var deleteCouponProduct=function($scope,$http,id){
    $http.post(baseUrl + 'pc/coupon/deleteCouponProduct', {
        id:id
    }).success(function (result) {
        if(result.error >0) {

        } else {
            $byLayer.msg('删除成功', 'success', function () {
                $scope.check($scope.manyCouponProduct.id,1);
            })
        }
    });
}
 var is_useMap = {
	    0:'未使用',
	    1:'已使用'
    }
var manyCustomerCoupon=function($scope,$http,Customer){
    $http.post(baseUrl + 'pc/coupon/findCustomerCoupons',$scope.Customer).success(function (result) {
        if(result.error >0) {

        } else {
           
            var length=result.data.length;
            for(var i=0;i<length;i++){
                result.data[i].isUsed = is_useMap[result.data[i].isUsed];
                $scope.customerCoupons.push(result.data[i]);
            }
           
            $scope.getCustomerCoupon.totalPage = result.totalPage;
        }
    });
}
var deleteCustomerCoupon=function($scope,$http,id,c_id){
    $http.post(baseUrl + 'pc/coupon/deleteCustomerCoupon',{id:id}).success(function (result) {
        if(result.error >0) {

        }else if(result.error==0){
            $byLayer.msg('删除成功', 'success', function () {
                $scope.details(c_id);
            })
        }else if(result.error==-1){
            $byLayer.msg('删除失败，优惠券已被使用不可删除！', 'failed');
        }
    });
}
var getShopCoupons=function($scope,$http,id){
    $http.post(baseUrl + 'pc/coupon/getCoupon',{id:id}).success(function (result) {
        if(result.error >0) {

        } else {
            result.coupon.webappReceiveConfig="http://mobile.eebin.com/index.html?page=./dist/receiveConfig.js?id="+result.coupon.id;
            result.coupon.receiveConfig="http://www.eebin.com/webViews/index.html#/receiveConfig?id="+result.coupon.id;
            $scope.data = result.coupon;
        }
    });
}
var submitShopCoupons=function($scope,$http,data,url){
    $http.post(url, data).success(function (result) {
        if(result.error >0) {

        } else {
            $('#coupon-form').modal('hide');
            $byLayer.msg('保存成功', 'success', function () {
                getmany($scope,$http,$scope.data5);
            })
        }
    });
}
var deleteShopCoupons=function($scope,$http,id){
	
    $http.post(baseUrl + 'pc/coupon/deleteCoupon',{id:id}).success(function (result) {
        if(result.error >0) {

        }else if(result.error==0){
            $byLayer.msg('删除成功', 'success', function () {
                getmany($scope,$http,$scope.data5);
            })
        }else{
            $byLayer.msg(result.errmsg, 'failed');
        }
    });
}






