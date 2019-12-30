/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('AddProductCtrl', ['$scope','$http', '$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menustate=0;
        $scope.shopmenu=1;

        $scope.catbox=[];
        $scope.data={};
        $scope.catId="";
        $scope.data.id="";
        $scope.getcategories=function(ids,n){
            var id = ids[0];
            $scope.data.id=id;
            $http.post(baseUrl + 'pc/category/getNextCategories',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    var length= $scope.catbox.length;
                    $scope.catId=id;
                    $scope.catbox.splice(n+1,length-n);
                    if(result.data.length!=0){
                        $scope.catbox.push(result.data);
                    }

                }
            });
        }
        $scope.getcategories([0]);
        $scope.next=function(){
            window.location.href="#/addProductInfo?catId="+$scope.catId;
        }
    }]);