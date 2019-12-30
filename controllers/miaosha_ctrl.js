/**
 * Created by admin on 2016/11/18.
 */
var app = angular.module('app', ['ngRoute', 'ngSanitize'])
    .controller('miaoshaCtrl', ['$scope', '$location', '$http', '$sce', '$anchorScroll','$rootScope','$interval', function ($scope, $location, $http, $sce, $anchorScroll, $rootScope, $interval) {
        $anchorScroll();
        $scope.data={};
        $scope.data.promotionId = $location.search().id;
        $scope.data.promotionType=$location.search().type;
        $scope.data.pageNumber=1;
        $scope.data.pageSize=12;

        $scope.hours=0;
        $scope.minutes=0;
        $scope.seconds=0;
        //$scope.salesPromotion= $scope.result.promotion;
        //获取活动详情
        paginatePromotionProduct($scope,$http,$scope.data);

        //活动倒计时
        //$scope.time=$scope.salesPromotion.remainTime/1000;
        var max_num=$scope.time;
        var setTime=function(){
            $scope.time=$scope.time-1;
            var h=(Array(2).join('0') + Math.floor($scope.time/3600)).slice(-2);
            var m=(Array(2).join('0') + Math.floor(($scope.time%3600)/60)).slice(-2);
            var s=(Array(2).join('0') + Math.floor(($scope.time%60))).slice(-2);
            $scope.hours=h;
            $scope.minutes=m;
            $scope.seconds=s;
        };
        $interval(setTime, 1000, max_num);

        //去抢购
        $scope.goshopping=function(id){
           window.open('#/product?id=' + id);
        }
    }]);
