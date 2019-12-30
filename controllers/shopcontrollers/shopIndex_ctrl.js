/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('shopapp', ['ngRoute'])
    .controller('ShopIndexCtrl', ['$scope','$location','$http','$anchorScroll','$rootScope', function ($scope, $location, $http, $anchorScroll,$rootScope) {
        $anchorScroll();
        var shopId=$location.search().id;

        var getAllPrducts=function () {
            $http.post(baseUrl+'pc/shopProduct/getProducts',{shopId:shopId}).success(function(result){
                if(result.error == 0) {

                    var attr={title:"全部商品",recommand:{products:result.data},type:4}
                    $scope.data=[]
                    $scope.data.push(attr);
                }else if (result.error > 0) {

                }
            });
        }
        var getJson=function(){
            $http.post(baseUrl+'pc/shopDecoration/getShopDecoration',{shopId:shopId}).success(function(result){

                if(result.error == 0) {
                    if(result.data){
                        var attr =JSON.parse(result.data.attr);
                        $scope.data=attr.index;

                    }else{
                        getAllPrducts();
                    }
                    setTimeout(function(){
                        initSilder();
                    },100);
                }else if (result.error > 0) {

                }
            });
        }
        getJson();


        //获取商店优惠券
        $http.post(baseUrl+'pc/shop/getShopCouponAndCash',{shopId:shopId}).success(function(result){
            if(result.error == 0) {
                $scope.coupons = result.data;
            }else if (result.error > 0) {

            }
        });

        //领取优惠券
        $scope.obtain=function(n){
            var id=$scope.coupons[n].id;
            var type=$scope.coupons[n].type;
            $scope.data.id=id;
            $scope.data.type=type;
            $http.post(baseUrl+'pc/shop/bindShopCouponAndCash',$scope.data).success(function(result){
                if(result.error == 0) {
                    alert("领取成功");
                }else if (result.error > 0) {

                }
            });
        }



        //直接购买
        $scope.comfirmOrder = function (id) {
            window.location.href = 'index.html#/product?id=' + id;
        }
        //加入购物车
        $scope.shoppingCart = function (id) {
            window.location.href = 'index.html#/product?id=' + id;
        }
        //搜索商品
        $rootScope.searchshop=function(k,t){
            if(!k){
                getJson();
            }
            if(t==1){
                $scope.data={};
                $scope.data.pageNumber=1;
                $scope.data.pageSize=21;
                $scope.isFirst=false;
                alert($scope.isFirst)
                $scope.data.keyName=k;
                $scope.data.shopId=shopId;
                $scope.pages=[];
                $scope.getproducts=function(){
                    $http.post(baseUrl + 'pc/shop/searchProduct',$scope.data).success(function (result) {
                        if(result.error >0) {

                        } else {
                            $scope.searchproducts= result.data;
                            $scope.searchLength=$scope.searchproducts.length;
                            $scope.pageLength=result.totalPage;
                            if($scope.pageLength<=1){
                                $scope.pages.push(1);
                            }else {
                                for (var i=0;i<$scope.pageLength;i++){
                                    $scope.pages.push(i+1);
                                }
                            }
                        }
                    });
                }
                $scope.getproducts();
                //分页加载数据
                $scope.setpages=function(k,n){
                    $scope.pages=[];
                    var pagenum=0;
                    if(n==0){
                        var page=$scope.data.pageNumber;
                        pagenum=page+k;

                        if(pagenum>$scope.pageLength){
                            $scope.data.pageNumber=$scope.pageLength;
                        }else if(pagenum<1){
                            $scope.data.pageNumber=1;
                        }else {
                            $scope.data.pageNumber=pagenum;
                        }

                    }else {
                        $scope.data.pageNumber=k;
                    }

                    $scope.getproducts();
                }
            }else if(t==2){
                window.location.href = "index.html#/list?keyName=" + k;
            }
        }


    }]);