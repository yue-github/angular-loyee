/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('SpecialtyCtrl',['$scope','$rootScope','$location','$http', '$anchorScroll', function ($scope, $rootScope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $rootScope.navstate=1;
        $scope.data={};
        $scope.data.cateId = 169;
        $scope.data.i = 1;
        $scope.data.length=24;
        $scope.data.offset=0;
        $scope.data.cateName="辣条君";
        $scope.top = 0;
        $scope.categorylist = [];
        getCategories($scope,$http,$scope.data);
        $scope.pages=[];
		//getproductAll($scope,$http,$scope.data);
        //根据分类id获取相应的商品
        getproducts($scope,$http,$scope.data);
        $scope.overcate = function(cateId) {
        	var num = 0;
        	for (var i = 0; i < $scope.categorylist.length; i++) {
        		num++;
        		if (cateId == $scope.categorylist[i].id) {
        			break;
        		}
        	}
        	var level = Math.ceil(num / 4);
        	if (level == 1) {
        		$scope.top = 28;
        	} else if (level == 2) {
        		$scope.top = 70;
        	}
        }
        //选择分类
        $scope.selcategory=function(categoryId,p_id,name,p_name){
            if(p_id==0){
                $scope.currentparent_id=categoryId;
                $scope.page_name=name;
                $scope.parent_name="地方特产";
            }else {
                $scope.currentparent_id=p_id;
                $scope.currentCatId=categoryId;
                $scope.page_name=name;
                $scope.parent_name=p_name;
            }
            $scope.data.cateId=categoryId;
            $scope.data.length=24;
            $scope.data.offset=0;

            getproducts($scope,$http,$scope.data);
        }
        $scope.salesVolume = function(){
        	$scope.data.sort = "salesVolume";
        	getproducts($scope,$http,$scope.data);
        	remove_addClass("salesVolume");
        }
        //价格排序
        $scope.suggestedRetailUnitPrice = function(){
        	if($scope.data.i == 1){
        		$scope.data.sort = "suggestedRetailUnitPrice";
        		$scope.data.i++;
        	} else if($scope.data.i == 2) {
        		$scope.data.sort = "suggestedRetailUnitPrice desc";
        		$scope.data.i--;
			}
        	getproducts($scope,$http,$scope.data);
        	remove_addClass("suggestedRetailUnitPrice");
        }
        $scope.commentNum = function(){
        	$scope.data.sort = "commentNum";
        	getproducts($scope,$http,$scope.data);
        	remove_addClass("commentNum");
        }
        //直接购买
        $scope.comfirmOrder = function (id) {
            window.location.href = '#/product?id=' + id;
        }
        //加入购物车
        $scope.shoppingCart = function (id) {
            window.location.href = '#/product?id=' + id;
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
            getproducts($scope,$http,$scope.data);
        }
    }]);