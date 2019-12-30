/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyproductsCtrl', ['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menustate=1;
        $scope.shopmenu=1;
        $scope.pageNumber=1;
        $scope.data={};
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.data.shopId=1;
        $scope.products=[];
        $scope.pages=[];
        $scope.getproducts=function(){
            $http.post(baseUrl+'pc/shopProduct/getProductsOnShelf',$scope.data).success(function(result){
                if(result.error == 0) {
                	for(var i =0;i<result.data.length;i++){
                		if(result.data[i].mainPic != null && result.data[i].mainPic != "undefined" && result.data[i].mainPic != ""){
	                		if(result.data[i].mainPic.indexOf("http://") == -1){
	                			result.data[i].mainPic = result.data[i].mainPic;
	                		}
                		}
                	}
                    $scope.products=result.data;
                    console.log($scope.products);
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                }
            });
        }

        $scope.getproducts();
        
        $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });

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
            $scope.getproducts();
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

        //删除商品
        $scope.delete=function(){
            getselect();
            if(JSON.parse($scope.data.ids).length==0){
                $byLayer.msg('请选择你要删除的商品', 'failed');
                return false;
            }
            $http.post(baseUrl+'pc/myProducts/delete',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('删除成功',"success",function(){
                        $scope.getproducts();
                    });
                }
            });
        }
        //商品下架
        $scope.offShelf=function(){
            getselect();
            if(JSON.parse($scope.data.ids).length==0){
                $byLayer.msg('请选择你要下架的商品', 'failed');
                return false;
            }

            $http.post(baseUrl+'pc/myProducts/offShelf',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('下架成功',"success",function(){
                        $scope.getproducts();
                    });
                }
            });
        }
        //搜索商品
        $scope.select=function(){
            $scope.getproducts();
        }
    }]);