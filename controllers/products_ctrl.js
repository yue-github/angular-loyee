/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ProductsCtrl',  ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        //获取所有分类

        $scope.data={};
        $scope.data.pageNumber=1;
        $scope.data.pageSize=24;
        $scope.data.cateName="";
        $scope.pages=[];
        getCategories($scope,$http)
        getproducts($scope,$http,$scope.data);
        //选择分类
        $scope.selcategory=function(categoryId,p_id,name,p_name){
            if(p_id==0){
                $scope.currentparent_id=categoryId;
                $scope.page_name=name;
                $scope.parent_name="全部商品";
            }else {
                $scope.currentparent_id=p_id;
                $scope.currentCatId=categoryId;
                $scope.page_name=name;
                $scope.parent_name=p_name;

            }
            $scope.data.cateId=categoryId;
            $scope.data.pageNumber=1;
            $scope.pages=[];
            getproducts($scope,$http,$scope.data);
        }

        //直接购买
        $scope.comfirmOrder = function (id) {
            window.open('#/product?id=' + id);
        }

        //加入购物车
        $scope.shoppingCart = function (id) {
           window.open('#/product?id=' + id);
        }

        //选择分类
        $scope.showu_lis=function (id) {
            alert(1);
            //$scope.currentparent_id=id;
        }
        //分页加载数据
        $scope.setpages=function(k,n){

            if(n==0){
                var page_num= $scope.data.pageNumber+k;
                if(page_num>0&&$scope.data.pageNumber<$scope.pagelength){
                    $scope.data.pageNumber=page_num;
                }else if(page_num>=$scope.pagelength){
                    $scope.data.pageNumber=$scope.pagelength;
                }else{
                    $scope.data.pageNumber=1;
                }
            }else {
                var pagenum=k;
                $scope.data.pageNumber=pagenum;
            }
            $scope.pages=[];
            getproducts($scope,$http,$scope.data);
        }

    }]);
