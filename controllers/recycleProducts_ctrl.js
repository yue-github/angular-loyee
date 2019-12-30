/**
 * Created by lenovo on 2016/12/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('recycleProductsCtrl',  ['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menustate=3;
        $scope.shopmenu=1;
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.products=[];
        $scope.pages=[];
        getDeletedProducts($scope,$http,$scope.data);
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
            getDeletedProducts($scope,$http,$scope.data);
        }
        //全选
        $scope.chkAll=function(c){
            if(c==true){
                for(var i=0;i<$scope.products.length;i++){
                    $scope.products[i].checked=true;
                }
            }else {
                for(var i=0;i<$scope.products.length;i++){
                    $scope.products[i].checked=false;
                }
            }
        }
        //获取选中的id数组
        var getselect=function(){
            var ids=[];
            for(var i=0;i<$scope.products.length;i++){
                if($scope.products[i].checked==true){
                    ids .push(JSON.stringify($scope.products[i].id));
                }
            }
            $scope.data.ids=JSON.stringify(ids);
        }
        //找回商品
        $scope.recycle=function(){
            getselect();
            if(JSON.parse($scope.data.ids).length==0){
                $byLayer.msg('请选择你要还原的商品', 'failed');
                return false;
            }
            recoverProducts($scope,$http,$scope.data);
        }
        //商品上架
        $scope.onShelf=function(){
            getselect();
            if(JSON.parse($scope.data.ids).length==0){
                $byLayer.msg('请选择你要上架的商品', 'failed');
                return false;
            }
            onShelfProducts($scope,$http,$scope.data);
        }
        //搜索商品
        $scope.select=function(){
            getDeletedProducts($scope,$http,$scope.data)
        }
    }]);