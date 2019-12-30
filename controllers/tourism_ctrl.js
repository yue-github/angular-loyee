/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('TourismCtrl',['$scope','$rootScope','$location','$http', '$anchorScroll','$interval', function ($scope, $rootScope, $location, $http, $anchorScroll, $interval) {
        $anchorScroll();
        $rootScope.navstate=2;
        $scope.PositionOne = [];
        $scope.PositionTwo = [];
        $scope.PositionThree = [];
        $scope.baseUrl = baseUrl;
        getPositionOne($scope,$http,$scope.data);
        getPositionTwo($scope,$http,$scope.data);
        getPositionThree($scope,$http,$scope.data,$interval);
        //提交收藏商品
        $scope.collection = function (id) {
            collection($scope,$http,id);
        }
         //直接购买
        $scope.comfirmOrder = function (id) {
            window.location.href = '#/product?id=' + id;
        }
        //加入购物车
        $scope.shoppingCart = function (id) {
            window.location.href = '#/product?id=' + id;
        }
    }]);