/**
 * Created by admin on 2016/8/25.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('PromotionCtrl',  ['$scope','$location','$http','$rootScope','$anchorScroll', function ($scope, $location, $http,$rootScope, $anchorScroll) {
        $anchorScroll();
        $scope.promotions = [];
        $rootScope.navstate=3;
        //获取轮播图
        // getBanners($scope,$http);
        //点击轮播图跳转
        $scope.topath=function(url){
            window.open(url);
        }
        //获取优惠活动
        getPromotions($scope,$http);
        //获取积分商品
        // getProducts($scope,$http)
        //跳转活动详情
        $scope.toPromotion=function(id,type){
            window.open("#/activity?id="+id+"&type="+type);
        }
        $scope.toSaleProducts = function(id) {
            window.open("#/saleProducts?id="+id);
        }
    }]);
