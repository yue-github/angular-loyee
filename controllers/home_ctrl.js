var app = angular.module('app', ['ngRoute'])
    .controller('HomeCtrl',['$scope','$rootScope','$location','$http', '$anchorScroll','$cookies', '$interval',function ($scope, $rootScope, $location, $http, $anchorScroll, $cookies, $interval) {
        $anchorScroll();
        $rootScope.navstate=0;

        console.log('baseUrl='+baseUrl);
        
        //微信登录
        var customer =$location.search().customer;
        var token = $location.search().token;
        if(token){
            $cookies.put('token', token);
            $rootScope.logined=true;
        }
        if(customer){
            if(customer.nickName!=null){
                $rootScope.cookiesName=customer.nickName;
                $cookies.put("cookiesName",$rootScope.cookiesName);
            }
            if(!customer.shop_id){
                $rootScope.cookiesShopid=false;
                $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
            }else {
                $rootScope.cookiesShopid=true;
                $rootScope.shopId=customer.shop_id;
                $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
                $cookies.put("shopId",$rootScope.shopId);
            }
        }
        //获取轮播图
        getBanners($scope,$http);
        //获取广告图和推荐商品
        getRecommends($scope,$http);
        //帮助链接
        //getAllHelpLinks($scope,$http);
        //直接购买
        $scope.comfirmOrder = function (id) {
            window.location.href = '#/product?id=' + id;
        }
        //加入购物车
        $scope.shoppingCart = function (id) {
            window.location.href = '#/product?id=' + id;
        }
        $scope.toAdv=function(url, $event){
            window.open(url);
        }

        $scope.intervaling=function () {
            $interval($scope.navigator, 4000);
        }

        //图片轮播滑动
        $scope.activenub=0;
        $scope.div=-1;
        $scope.navigator=function () {
            var length=$scope.banners.length;
            if($scope.div<length-1){
                $scope.div++
            }else{
                $scope.div=0;
            }
            $scope.activenub=$scope.div;
        };
        $scope.selectBanner=function (e) {
            $scope.activenub=e;
        }
        $scope.gotoProducts=function () {
            window.open('#/specialty')
        }
        // //关闭活动显示层
        // $scope.offpromotion=function(){
        //     $('#promotion').animate({
        //         top: '-100%'
        //     }, 1000, 'linear');
        // }
    }]);
