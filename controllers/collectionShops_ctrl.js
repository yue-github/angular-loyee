/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('CollectionShopsCtrl',  ['$scope','$http','$anchorScroll','$route', function ($scope, $http, $anchorScroll, $route) {
        $anchorScroll();
        $scope.menu=1;
        $scope.state=1;
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=20;
        $scope.data.offset=0;
        $scope.pages=[];
       var getcollections=function(){
           $http.post(baseUrl+'pc/center/myShopCollections', $scope.data).success(function(result){
               if(result.error == 0) {
                   $scope.shops=result.data;
                   //分页
                   $scope.data.length=result.length;
                   $scope.data.offset=result.offset;
                   $scope.totalRow=result.totalRow;
                   $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                   $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                   $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);

               }else if (result.error > 0) {

               }
           });
       }

        getcollections();

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
            getcollections();
        }

        //取消收藏
        $scope.cancleShop=function(id){
            $scope.data.id=id;
            $http.post(baseUrl+'pc/center/cancleShopCollection', $scope.data).success(function(result){
                if(result.error == 0) {
                    $byLayer.msg('取消成功', 'success');
                    $route.reload();
                }else if (result.error > 0) {

                }
            });
        }

        //进入店铺 主页
        $scope.toshopindex=function(id){
            window.open("shopindex.html#/index?id="+id);
        }

    }]);