/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ShopcenterCtrl',  ['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.shopmenu=0;
        $http.post(baseUrl+'pc/shop/getShopByToken').success(function(result){
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
                window.location.href = "#/shopRegister";
            }
        });

        $scope.update=function(id){
            window.location.href="#/updateInfo?id="+id;
        }
    }]);