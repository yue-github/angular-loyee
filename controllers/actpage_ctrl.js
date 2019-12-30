var app = angular.module('app', ['ngRoute'])
    .controller('actpageCtrl',  ['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        $scope.shopmenu=10;
        $http.post(baseUrl+'pc/shop/getShopByToken').success(function(result){
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
                window.location.href = "#/shopRegister";
            }
        });
      $scope.submit = function(id) {
			$('#uploadForm').modal('hide')
		}
		      $scope.close = function(id) {
					$('#uploadForm').modal('hide')
				}
        // $scope.update=function(id){
        //     window.location.href="#/updateInfo?id="+id;
        // }
		$scope.upload = function(file, type) {
			console.log(1)
		// 	if(file) {
		// 		var index = layer.load(0, {
		// 			shade: 0.5
		// 		});
		// 		Upload.upload({
		// 			url: baseUrl + "admin/file/upload",
		// 			data: {
		// 				file: file
		// 			}
		// 		}).then(function(resp) {
		// 			if(type == 1) {
		// 				$scope.data.mainPic = baseUrl + resp.data.path;
		// 			} else if(type == 2) {
		// 				$scope.Position.image = resp.data.path;
		// 			}
		// 			layer.close(index);
		// 		}, function(resp) {}, function(evt) {});
		// 	}
		};
		
			$scope.batchAddProduct = function() {
			$scope.batchProduct = {};
			$scope.batchProduct.promotionId = $scope.promotionPositionId;
			$scope.batchProduct.promotionPositionId = $scope.PropromotionPositionId;
			var objectId = [];
			var length = $scope.productName.length;
			for(var i = 0; i < length; i++) {
				if($scope.productName[i].isSelect == 1) {
					objectId.push(JSON.stringify($scope.productName[i].id));
				}
			}
			objectId = JSON.stringify(objectId);
			$scope.batchProduct.ids = objectId;
			$http.post(baseUrl + 'pc/promotionManjian/batchAddProduct', $scope.batchProduct).success(function(result) {
				if(result.error > 0) {
		
				} else {
					$byLayer.msg('添加成功', 'success', function() {
						$('#uploadForm').modal('hide');
						$scope.getproducts($scope.PropromotionPositionId);
					});
				}
			});
		}
		
		
		
		/**
		 * 获取促销活动产品列表
		 * @param token 用户登录口令
		 * @param promotionPositionId 位置id
		 * @param pageNumber 页码
		 * @param pageSize 每页显示条数
		 * @return 成功：{error: 0, totalPage: 总页数, totalRow: 总行数, data: [{id,name:产品名称,cashDiscount:优惠金额,storeAmount:库存},...]}；失败：{error: >0, errmsg: 错误信息}
		 */
		$scope.getproducts = function(id) {
			$scope.PropromotionPositionId = id;
			$scope.PositionProducts = {};
			$scope.PositionProducts.promotionPositionId = id;
			$scope.PositionProducts.pageNumber = 1;
			$scope.PositionProducts.pageSize = 10;
			$http.post(baseUrl + 'pc/promotionManjian/manyProduct', $scope.PositionProducts).success(function(result) {
				if(result.error > 0) {
		
				} else {
					for(var i = 0; i < result.data.length; i++) {
						result.data[i].checked = 0;
					}
					$scope.PromotionPositionProduct = result.data;
				}
			});
		}
		$scope.getAllCategory = function() {
			$http.post(baseUrl + 'pc/promotionManjian/getAllCategory').success(function(result) {
				if(result.error > 0) {
		
				} else {
					$scope.category = result.data;
				}
			});
		}
		$scope.getProduct = function(id) {
			$http.post(baseUrl + 'pc/promotionManjian/getProductByCate', {
				id: id
			}).success(function(result) {
				if(result.error > 0) {
		
				} else {
					var length = result.data.length;
					for(var i = 0; i < length; i++) {
						result.data[i].isSelect = 0;
					}
					$scope.productName = result.data;
				}
			});
		}
    }]);