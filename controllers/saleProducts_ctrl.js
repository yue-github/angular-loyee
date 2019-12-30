/**
 * Created by admin on 2016/8/25.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('saleProductsCtrl',  ['$scope','$location','$http','$rootScope','$anchorScroll', function ($scope, $location, $http,$rootScope, $anchorScroll) {
        $anchorScroll();
        var promId = $location.search().id;
        $scope.products = [];

        $scope.getProducts = function() {
            var data = {
                offset: 0,
                length: 20,
                promotionId: promId
            };
            $http.post(baseUrl + "pc/promotion/promotionProducts", data).success(function(result) {
                if(result.error == 0) {
                    $scope.products = result.data;
                } else {
                    $byLayer.msg(result.errmsg, 'failed');
                }
            });
            
            $http.post(baseUrl+'pc/promotionManjian/get', {id: promId}).success(function(result) {
                if(result.error == 0) {
                    $scope.promotion = result.data;
                }
            });
        }

        $scope.getProducts();

        $scope.toProductDetail = function (id) {
            window.location.href = '#/product?id=' + id;
        }
    }]);
