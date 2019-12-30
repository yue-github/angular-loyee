/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('pointProductCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $scope.list = [];
        
        // 初始化列表
        $scope.getList = function() {
        	$http.post(baseUrl + 'pc/point/product_list', {offset: 0, length: 20}).success(function(result){
                if(result.error == 0) {
                	var list = result.data;
                	for (var i = 0; i < list.length; i++) {
                		var item = list[i];
                		item.mainPic = $scope.getAbsolutePath(item.mainPic);
                	}
                    $scope.list = list;
                }
            });
        }
        $scope.getList();
        
        // 跳转到订单页
        $scope.comfirmOrder = function(expire_status, set_meal_id) {
        	if (expire_status == -1) {
        		$byLayer.msg("活动还没开始", "fail");
        		return;
        	} else if (expire_status == 1) {
        		$byLayer.msg("活动已结束", "fail");
        		return;
        	}
        	window.location.href = "#/comfirmOrder?order_type=3&group_set_meal_id=" + set_meal_id;
        }
        
        // 跳转到详情页
        $scope.toDetail = function(id, pointProductId) {
        	window.location.href = "#/product?id=" + id + "&pointProductId=" + pointProductId;
        }
        
    }]);
