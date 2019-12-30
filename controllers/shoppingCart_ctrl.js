/**
 * Created by admin on 2016/9/1.
 */
var big;
var app = angular.module('app', ['ngRoute'])
	.controller('ShoppingCartCtrl', ['$scope', '$http', '$anchorScroll', '$location', function($scope, $http, $anchorScroll, $location) {
		$anchorScroll();

		$scope.data = {};

		/**
		 * 获取我的购物车cartProducts
		 * @param token 帐户访问口令（必填）
		 * @return 成功：{error: 0, totalPrice: 总价, products:[{id: 产品id, shoppingCartId: 购物车id, name: 产品名称, selectProerties: 摘要说明, suggestedRetailUnitPrice: 价格, mainPic: 图片, amount: 数量}, ...]}；失败：{error: >0, errmsg: 错误信息}
		 */
		/*   {
		       totalPrice:应付金额,
		      totalAmount:总购买数量,
		       promDiscount:促销优惠金额,
		       totalProdPrice:商品总金额,
		       shops:[
		       {
		           shop_id:店铺id,
		           shopName:店铺名称,
		           shopLogo:店铺logo,
		           productList:[
		               {
		                   productSelectPay:商品金额,
		                   remainPay:还差多少金额才可以优惠,
		                   promotionDiscount:优惠金额,
		                   isHasProm:是否有促销活动,
		                   promotion:
		                   {
		                       id:活动id,
		                       promotionTitle:活动标题,
		                   },
		                   products:[
		                       {
		                           id:购物车id,
		                           product_id:产品id,
		                           productName:产品名称,
		                           mainPic:产品主图,
		                           selectProterties:所选属性,
		                           amount:购买数量,
		                           suggestedRetailUnitPrice:产品单价,
		                           totalPrice:产品总价,
		                           isSelected:是否选中,
		                       },...
		           ]
		       }*/

		$scope.getCart = function() {
			$http.post(baseUrl + 'pc/cart/getMyShoppingCart', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.carts = result;
					console.log(result)
					var id = [];
					for(var i = 0; i < $scope.carts.shops.length; i++) {
						var goods = $scope.carts.shops[i].products;
						for(var y = 0; y < goods.length; y++) {
							if(goods[y].isSelected == 1) {
								id.push(goods[y].id)
							}

							//							for(var k = 0; k < goods[y].products.length; k++) {
							//								if(goods[y].products[k].isSelected == 1) {
							//									id.push(goods[y].products[k].id)
							//								}
							//							}
						}
					}
					//					console.log(id)
					$scope.data.ids = JSON.stringify(id);
				} else {
					console.log("修改失败：" + result.errmsg)
				}
			});
		}
		$scope.getCart();

		//文本框修改数量
		$scope.addamount = function(num, n, p_k) {
			reg=/^\d+$/;
			if(num == '') return;
			if(reg.test(num)==false){
				$byLayer.msg('请输入数字,至少为1', 'failed');
				num=1;
			}
			if(num <= 0) {
				$byLayer.msg('数量至少为1', 'failed');
				num=1;
			}
			var id, amount;
			id = $scope.carts.shops[p_k].products[n].id;
			amount = num;
			$scope.data.id = id
			$scope.data.amount = amount;
			$http.post(baseUrl + 'pc/cart/update', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.getCart();
				} else if(result.error == -1) {
					$byLayer.msg('库存不足', 'failed');
					num=1;
					$scope.addamount(num,n, p_k)
				} else {
					console.log(result.errmsg)
				}
			});
		}
		//点击左右修改数量
		$scope.addCount = function(k, n, p_k, p_p_k) {
			$scope.data.id= $scope.carts.shops[p_k].products[n].id;
			$scope.data.amount = $scope.carts.shops[p_k].products[n].amount+k;
			if($scope.data.amount < 1) {
				$byLayer.msg('数量至少只能为1', 'failed');
				$scope.data.amount= 1;
			}
			$http.post(baseUrl + 'pc/cart/update', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.getCart();
				} else if(result.error == -1) {
					$byLayer.msg('库存不足', 'failed');
				} else {
					console.log(result.errmsg)
				}
			});

		};

		//处理选择的方法
		//n（index）,n_p(父级的index),t_on_f(是否勾选)
		$scope.disposeSelesct = function(n, n_p, t_on_f) {
			var id;
			$scope.data.id = $scope.carts.shops[n_p].products[n].id;
			$scope.data.selected = t_on_f;

			$http.post(baseUrl + 'pc/cart/selectShoppingCart', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.ifCheck();
					$scope.getCart();
				} else {
					console.log("操作失败：" + result.errmsg)
				}
			});
		}
		//判断店铺是否勾选
		$scope.ifCheck = function(ifCheck) {
			//勾选个数
			var num = 0;
			//商品个数
			var productNum = 0;
			$http.post(baseUrl + 'pc/cart/getMyShoppingCart', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.carts = result;
					for(var i = 0; i < $scope.carts.shops.length; i++) {
						var goods = $scope.carts.shops[i].products;
						productNum = goods.length;
						for(var y = 0; y < goods.length; y++) {
							if(goods[y].isSelected == 1) {
								num++;
							}
						}
					}

				} else {
					console.log("修改失败：" + result.errmsg)
				}
				if(num == productNum) {
					$scope.isTrue = true;
					$scope.ifAll = true;
				} else {
					$scope.isTrue = false;
					$scope.ifAll = false;
				}

			});

		}
		$scope.ifCheck()

		//选择单个商品
		//n（index）,n_p(父级的index),t_on_f(是否勾选)
		$scope.isSelected = function(n, n_p, t_on_f) {
			$scope.disposeSelesct(n, n_p, t_on_f);
		}
		//选中全店 
		//isTrue(是否勾选)
		$scope.shopAll = function(index, isTrue) {
			var num=0;
			var ifnum=0;
			var ids = [];
			var product = $scope.carts.shops[index].products;
			for(var i = 0; i < product.length; i++) {
				var item = {};
				item.id = product[i].id;
				if(isTrue) {
					item.selected = 1;
					ifnum++;
				}
				if(isTrue == false) {
					item.selected = 0
				}
				ids.push(item);
			}
			$scope.data.ids = JSON.stringify(ids);
			$http.post(baseUrl + 'pc/cart/batchSelectShoppingCart', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.isTrue = isTrue;
					$scope.getCart();
				} else {
					console.log("操作失败：" + result.errmsg)
				}
			});
			for(var i = 0; i < $scope.carts.shops.length; i++) {
				var goods = $scope.carts.shops[i].products;
				for(var y = 0; y < goods.length; y++) {
					num++;
				}
			}
			//所有产品个数== 勾选个数
			if(num==ifnum){
				$scope.ifAll = true;
			}else{
				$scope.ifAll = false;
			}
		}
		//全选
		//ifAll(是否勾选)
		$scope.chkAll = function(ifAll) {
			var ids = [];
			for(var i = 0; i < $scope.carts.shops.length; i++) {
				var goods = $scope.carts.shops[i].products;
				for(var y = 0; y < goods.length; y++) {
					var item = {};
					item.id = goods[y].id;
					if(ifAll) {
						item.selected = 1
						$scope.isTrue = true;
					}
					if(ifAll == false) {
						item.selected = 0
						$scope.isTrue = false;
					}
					ids.push(item)
				}
			}
			$scope.data.ids = JSON.stringify(ids);
			$http.post(baseUrl + 'pc/cart/batchSelectShoppingCart', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.getCart();

				} else {
					console.log("操作失败：" + result.errmsg)
				}
			});
		}

		//删除购物车
		$scope.remove = function(id) {
			$http.post(baseUrl + 'pc/cart/remove', {
				id: id
			}).success(function(result) {
				if(result.error == 0) {
					$byLayer.msg('删除成功', 'success', function() {
						$scope.getCart();
					});
				} else {

				}
			});
		}
		//结算
		$scope.submit = function() {
			if(JSON.parse($scope.data.ids).length == 0) {
				$byLayer.msg('请选择要结算的商品', 'failed');
			} else {
				var shops = $scope.carts.shops;
				for (var i = 0; i < shops.length; i++) {
					var products = shops[i].products;
					for (var j = 0; j < products.length; j++) {
						var product = products[j];
						if (product.isSelected == 1 && (product.is_sale == 0 || product.isDelete == 1)) {
							var content = '"' + product.productName + '"' + "已下架，请从购物车中删除该商品再购买";
							$byLayer.msg(content, 'failed');
							return;
						}
					}
				}
				window.location.href = "#/comfirmOrder?order_type=2"
			}
		}

		//客户行为推荐商品
		var getRecommendProductsByCustomer = function() {
			$scope.data = {};
			$scope.data.row = 4;
			$http.post(baseUrl + 'pc/product/getRecommendProductsByCustomer', $scope.data).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.recommentProducts = result.data;
				}
			});
		}
		getRecommendProductsByCustomer();
		
		//换一组
		$scope.athorGroup = function() {
			getRecommendProductsByCustomer();
		}
	}]);