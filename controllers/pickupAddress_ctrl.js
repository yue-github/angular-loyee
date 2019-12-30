/**
 * Created by admin on 2016/10/27.
 */
var app = angular.module('app', ['ngRoute'])
	.controller('pickupAddressCtrl',  ['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
	
		$scope.shopmenu=8;
		$scope.total = 0;
		$scope.offset = 0;
		$scope.length = 20;
		$scope.title = '';
		$scope.list = [];
		$scope.pageNumber=1;
		$scope.pages=[];
		
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
            $scope.offset=($scope.pageNumber-1)*$scope.length;
            $scope.getList();
        }
        
        $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });
		
		$scope.getList = function() {
			var params = {
				offset: $scope.offset,
				length: $scope.length,
				title: $scope.title
			};
			$http.post(baseUrl+'pc/pickup_address/list', params).success(function(result){
				if (result.error == 0) {
					$scope.list = result.data;
					$scope.total = result.total;
					
					// 分页
                    $scope.pageNumber=$scope.offset/$scope.length+1;
                    $scope.pagestotal=Math.ceil($scope.total/$scope.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
				}
	        });
		}
		
		$scope.getList();
		
		$scope.delete = function(id) {
			$http.post(baseUrl+'pc/pickup_address/delete', {id: id}).success(function(result){
				if (result.error == 0) {
					$byLayer.msg('删除成功', 'success');
					$scope.getList();
				}
	        });
		}
		
		$scope.search = function() {
			$scope.getList();
		}
		
}]);