/**
 * Created by admin on 2016/10/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('UpdateProductInfoCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        var productId=$location.search().id;
        $scope.data={};
        $scope.data.id=productId;
        $http.post(baseUrl+'pc/myProducts/get',$scope.data).success(function(result){
            if(result.error > 0) {

            }else {
                $scope.data=result.product;
            }
        });
        $scope.data.name="";
        $scope.data.suggestedRetailUnitPrice="";
        $scope.data.minAllowableUnitPrice="";
        $scope.data.minAllowableUnitDeliveryCharge="";
        $scope.data.suggestedRetailUnitDeliveryCharge="";
        $scope.data.storeAmount="";
        $scope.data.is_sale="";
        $scope.data.summary="";
        $scope.submit=function(){
            $http.post(baseUrl+'pc/myProducts/edit',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    alert("修改成功");
                    window.location.href="#/myProducts"
                }
            });
        }
    }]);