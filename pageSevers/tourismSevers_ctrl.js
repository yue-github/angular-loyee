/**
 * 获取推荐产品
 * @param 位置
 * @return [{id:id, name: 产品名称, suggestedRetailUnitPrice: 价格, mainPic: 图片, summary: 摘要}, ...]
 * @return 成功： {error:0, data:[{positionName:位置名称, productList:[{id:id, name: 产品名称, suggestedRetailUnitPrice: 价格, mainPic: 图片, summary: 摘要}, ...]},...]} 失败: {error:>0, errmsg:错误信息}
 */
var getPositionOne = function($scope, $http, data) {
	$http.post(baseUrl + 'pc/travel/getPositionOne', data).success(function(result) {
		if(result.error > 0) {} else {
			if(result.data.length > 0) {
				$scope.PositionOne = result.data[0].productList;
			}
		}
	});
}
var getPositionTwo = function($scope, $http, data) {
	$http.post(baseUrl + 'pc/travel/getPositionTwo', data).success(function(result) {
		if(result.error > 0) {} else {
			for(var i = 0; i < result.data.length; i++) {
				for(var j = 0; j < result.data[i].productList.length; j++) {
					if(result.data[i].productList[j].recommendPic != null &&
						result.data[i].productList[j].recommendPic != "undefined" &&
						result.data[i].productList[j].recommendPic != "") {
						if(result.data[i].productList[j].recommendPic.indexOf("http://") == -1) {
							result.data[i].productList[j].recommendPic = baseUrl + result.data[i].productList[j].recommendPic;
						}
					}
				}
			}
			$scope.PositionTwo = result.data;
		}
	});
}

var getPositionThree = function($scope, $http, data, $interval) {
	$http.post(baseUrl + 'pc/travel/getPositionThree', data).success(function(result) {
		if(result.error > 0) {} else {
			$scope.PositionThree = result.data;
			var length = $scope.PositionThree[0].productList.length;
			var width = 483 * length;
			var runleght = 0;
			var index = length - 4;
			$scope.threeBox = {
				"width": width,
				"height": "250px",
				"overflow": "hidden",
				"transform": "translate3d(" + runleght + "px, 0px, 0px)"
			};
			$interval(function() {
				if(index > 0) {
					runleght -= 483;
					index--;
				} else {
					index = length - 4;
					runleght = 0;
				}
				$scope.threeBox = {
					"width": width,
					"height": "250px",
					"overflow": "hidden",
					"transform": "translate3d(" + runleght + "px, 0px, 0px)"
				};

			}, 3000);

		}
	});
}
//提交收藏商品
var collection = function($scope, $http, id) {
	$http.post(baseUrl + 'pc/product/collection', {
		productId: id
	}).success(function(result) {
		if(result.error == 0) {
			$byLayer.msg('收藏成功', 'success');
		}
	});
}
