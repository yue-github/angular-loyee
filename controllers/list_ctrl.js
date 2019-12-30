/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute', 'ngSanitize'])
    .controller('listCtrl', ['$scope', '$location', '$http', '$sce', '$anchorScroll','$rootScope', function ($scope, $location, $http, $sce, $anchorScroll, $rootScope) {
        $anchorScroll();
        $scope.data={};
        $scope.data.keyName=$location.search().keyName;
        if($location.search().isPrice != null&&$location.search().isPrice != "undefined"){
        	$scope.data.isPrice = $location.search().isPrice;
        	if($location.search().isPrice == 1){
        		 $scope.data.priceSort='desc';
        	}else{
        		$scope.data.priceSort='asc';
        	}
        }else{
        	
        	$scope.data.isPrice = 1;
        }
         if($location.search().isSell != null&&$location.search().isSell != "undefined"){
        	$scope.data.isSell = $location.search().isSell;
        	if($location.search().isSell == 1){
        		 $scope.data.salesVolume='desc';
        	}else{
        		$scope.data.salesVolume='asc';
        	}
        }else{
        	$scope.data.isSell = 1;
        }
        if($location.search().isComment != null&&$location.search().isComment != "undefined"){
        	$scope.data.isComment = $location.search().isComment;
        	if($location.search().isComment == 1){
        		 $scope.data.commentNum='desc';
        	}else{
        		$scope.data.commentNum='asc';
        	}
        	
        }else{
        	$scope.data.isComment = 1;
        }
        // 商家排名
        if($location.search().isRank != null&&$location.search().isRank != "undefined"){
        	$scope.data.isRank = $location.search().isRank;
        	if($location.search().isRank == 1){
        		 $scope.data.commentNum='desc';
        	}else{
        		$scope.data.commentNum='asc';
        	}
        	
        }else{
        	$scope.data.isRank = 1;
        }
         // 产品分类
         if($location.search().isClassify != null&&$location.search().isClassify != "undefined"){
        	$scope.data.isClassify = $location.search().isClassify;
        	if($location.search().isClassify == 1){
        		 $scope.data.priceSort='desc';
        	}else{
        		$scope.data.priceSort='asc';
        	}
        	
        }else{
        	$scope.data.isClassify = 1;
        }
        // 品牌热度
        if($location.search().isHeat != null&&$location.search().isHeat != "undefined"){
             $scope.data.isHeat = $location.search().isHeat;
        if($location.search().isHeat == 1){
                $scope.data.commentNum='desc';
        }else{
            $scope.data.commentNum='asc';
        }
        
        }else{
        	$scope.data.isHeat = 1;
        }
        $scope.data.length=24;
        $scope.data.offset=0;
        $scope.pages=[];
        getproducts($scope,$http,$scope.data);
        //直接购买
        $scope.comfirmOrder = function (id) {
            window.open('#/product?id=' + id);
        }
        //加入购物车
        $scope.shoppingCart = function (id) {
           window.open('#/product?id=' + id);
        }

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
            getproducts($scope,$http,$scope.data);
        }
    }]);
