/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyGoldCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.state=2;
        $scope.menu=5;
        
        $http.post(baseUrl+'pc/customerGold/goldAmount',$scope.data).success(function(result){
            if(result.error > 0) {

            }else {
                $scope.goldAmount=result.goldAmount;
			
//              $scope.goldAmount= 0;
            }
        });
        $scope.data={};
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.data.shopId=1;
        $scope.pages=[];
        $scope.pageTotalRrow=0;
        var getGolds=function(){
            $http.post(baseUrl+'pc/customerGold/myGoldList',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.GoldList=result.data;
                    pageTotalRrow = result.totalRow;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRrow=result.totalRrow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRrow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                }
            });
        }
        getGolds();


        /**分页点击事件
         * k:当前点击的页数或者左右+1、-1
         * t:类型（0：左右按钮点击，1：页码点击）
         * */
        $scope.setpages = function (k,t) {
            if(t==0){
                $scope.pageNumber= $scope.pageNumber+k;
                if($scope.pageNumber>0&&$scope.pageNumber<=$scope.pagestotal){
                    $scope.pageNumber=$scope.pageNumber;
                }else if($scope.pageNumber>=$scope.pagestotal){
                    $scope.pageNumber=$scope.pagestotal;
                }else{
                    $scope.pageNumber=1;
                }
            }else {
                $scope.pageNumber=k;
            }
            $scope.data.offset=($scope.pageNumber-1)*$scope.data.length;
            getGolds();
        }
    }]);