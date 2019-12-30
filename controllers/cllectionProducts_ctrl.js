/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('CollectionProductsCtrl',  ['$scope','$http','$anchorScroll','$route', function ($scope, $http, $anchorScroll, $route) {
        $anchorScroll();
        $scope.menu=1;
        $scope.state=0;

        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=20;
        $scope.data.offset=0;
        $scope.pages=[];

        getcollections($scope,$http,$scope.data);
        //跳转到商品详情页
        $scope.toproduct=function(id){
            window.open('#/product?id='+id);
        }
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
            getcollections($scope,$http,$scope.data);
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

        $scope.cancleproduct=function(id){
            getselect();
            if(id){
                var ids=[];
                ids.push(JSON.stringify(id));
                $scope.data.ids=JSON.stringify(ids);
            }
            if(!$scope.data.ids){
                $byLayer.msg('请选择要操作的数据', 'failed');
                return false;
            }
            cancelProductCollection($scope,$http,$scope.data,$route)
        }
        
        $scope.search=function(id){
        	getcollections($scope,$http,$scope.data);
        }
    }]);
