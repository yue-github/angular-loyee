var app = angular.module('app', ['ngRoute', 'ngFileUpload'])
	.controller('SalesPromotionCtrl1', ['$scope', '$http', '$anchorScroll', '$location', '$filter', 'Upload', function($scope, $http, $anchorScroll, $location, $filter, Upload) {
		$anchorScroll();
		$scope.shopmenu = 4;
		$scope.state = 1;
		$scope.pageTitle = "满减";
		$scope.baseon_options = [{value: 1, title: '全订单'}, {value: 2, title: '特定产品'}];
		$scope.addForm = function() {
			$("input[name='act_start_time']").val("");
			$("input[name='act_stop_time']").val("");
			$scope.formTitle = "添加";
			$scope.data = {};
			$("#mj_applyScope").attr("disabled", false);
			//清空图片地址
			$scope.data.mainPic = "";
			$("#img_hover img").attr("src", "")
			
		}
		$scope.addForm2 = function() {
			$scope.formTitle = "添加";
		}
		$scope.Position = {};
		$scope.data = {};
		$scope.pageNumber = 1;
		$scope.data.length = 10;
		$scope.data.offset = 0;
		//@param type 位置类型(1产品，2优惠券)
		$scope.data.promotionType = 1;
		$scope.pages = [];
		$scope.detail = {};
		$scope.product = {};
		$scope.PositionType = [{
			id: 1,
			name: "产品"
		}, {
			id: 2,
			name: "优惠券"
		}]
		$scope.data.length = 10;
		$scope.data.offset = 0;
		var residueNumber = 0; //可添加产品的条数 用于打开窗口前提示
		//获得促销活动列表 ks
		var getPromotion = function() {
			$http.post(baseUrl + 'pc/promotionManjian/many', $scope.data).success(function(result) {
				if(result.error == 0) {
					$scope.many = result.data;
					//分页
					$scope.data.length = result.length;
					$scope.data.offset = result.offset;
					$scope.totalRow = result.totalRow;
					$scope.pageNumber = $scope.data.offset / $scope.data.length + 1;
					$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
					$scope.pages = getRange($scope.pageNumber, $scope.pagestotal, 10);
				}
			});
		}
		getPromotion();
		
		$http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });

		$scope.submit = function(id) {
			this.id = id
			$scope.data.encodedColor = $scope.encodedColor;
			$scope.data.type = 1;
			$scope.data.scope = 2;
			$scope.data.startDate = $("input[name='act_start_time']").val();
			$scope.data.endDate = $("input[name='act_stop_time']").val();
			// $scope.data.title = $("input[name='mj_title']").val();
			// $scope.data.baseOn = $("#mj_applyScope option:selected").val();
			// $scope.data.full = $("input[name='mj_enough']").val();
			// $scope.data.value = $("input[name='mj_discounts']").val();
			// $scope.data.desc = $("#mj_txt").val();

			reg = /^\d+$/;
			if(!$scope.data.title) {
				$byLayer.msg('促销活动名称不能为空2', 'failed');
				return false;
			}
			if(!$scope.data.startDate) {
				$byLayer.msg('促销活动开始时间不能为空', 'failed');
				return false;
			}
			if(!$scope.data.baseOn) {
				$byLayer.msg('请选择产品适用范围', 'failed');
				return false;
			}
			if(!$scope.data.endDate) {
				$byLayer.msg('促销活动截止时间不能为空', 'failed');
				return false;
			}

			if(!$scope.data.full) {
				$byLayer.msg('请输入满减金额', 'failed');
				return false;
			}
			if(reg.test($scope.data.full) == false) {
				$byLayer.msg('满减金额请输入数字', 'failed');
				return false;
			}
			if($scope.data.full < 1) {
				$byLayer.msg('满减金额不能小于1', 'failed');
				return false;
			}
			if(!$scope.data.value) {
				$byLayer.msg('请输入优惠金额', 'failed');
				return false;
			}
			if(reg.test($scope.data.value) == false) {
				$byLayer.msg('优惠金额请输入数字', 'failed');
				return false;
			}
			//添加
			if($scope.formTitle == '添加') {
				var data = angular.copy($scope.data);
				data.startDate = $filter('date')($scope.data.startDate, 'yyyy-MM-dd h:mm:ss');
				data.endDate = $filter('date')($scope.data.endDate, 'yyyy-MM-dd h:mm:ss');
				$http.post(baseUrl + "pc/promotionManjian/create", data).success(function(result) {
					if(result.error == 0) {
						//清空data
						$scope.data = {};
						$scope.data.offset = 0;
						$scope.data.length = 10;
						//加载列表
						getPromotion();
						$('#addsalesForm').modal('hide');
						$byLayer.msg('保存成功', 'success')
					} else {
						console.log(result.errmsg, 'failed');
					}
				});
			}
			//修改
			if($scope.formTitle == '修改') {
				$scope.data.id = this.id;
				var data = angular.copy($scope.data);
				data.startDate = $filter('date')($scope.data.startDate, 'yyyy-MM-dd h:mm:ss');
				data.endDate = $filter('date')($scope.data.endDate, 'yyyy-MM-dd h:mm:ss');
				$http.post(baseUrl + "pc/promotionManjian/update", data).success(function(result) {
					if(result.error == 0) {
						//清空data
						$scope.data = {};
						$scope.data.offset = 0;
						$scope.data.length = 10;
						getPromotion();
						$('#addsalesForm').modal('hide');
						$byLayer.msg('修改成功', 'success')
					} else {
						console.log(result.errmsg, 'failed');
					}
				});
			}

		}
		// 简单编码
		$scope.nameColor = "#000";
		$scope.encodedColor = "#000";
		$scope.encodedBlur = function(){
			$scope.nameColor = $scope.encodedColor;
		}
		//【 修改】修改按钮
		$scope.update = function(id) {
			console.log('你好')
			// $("#mj_applyScope").attr("disabled", true);
			$scope.data = {};
			$scope.data.id = this.id;
			$scope.formTitle = "修改";
			$http.post(baseUrl + 'pc/promotionManjian/get', {
				id: id,
				promotionType: 1
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.data = result.data;
					$scope.obj = result.data;
					$("#mj_applyScope").find("option[value=" + $scope.obj.baseOn + "]").attr("selected", true);
					$("#selectProduct").removeClass("disabled")
				}
			});

		}

		//【删除】 删除按钮 (id,标题用于提示)
		$scope.delete = function(id, hint) {
			var ids = [];
			ids.push(id);
			$scope.data.ids = JSON.stringify(ids);
			$byLayer.confirm("确定删除：" + hint, function() {
				$http.post(baseUrl + 'pc/promotionManjian/delete', $scope.data).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg)
					} else {
						//清空data
						$scope.data = {};
						$scope.data.offset = 0;
						$scope.data.length = 10;
						getPromotion();
						$byLayer.msg('删除成功', 'success', function() {
							$scope.data.pageNumber = 1;
							$scope.pages = [];
						})
					}
				});
			});

		}

		//【选择产品列表】（id，产品范围）
		var tempListOjb, tempListOjbAdd;
		$scope.saveProduct = function(id, baseOn) {
			if(baseOn == 1) {
				$byLayer.msg("抱歉！全订单暂不支持修改", 'failed');
				return;
			}
			var templ = $scope.data.length;
			var tempo = $scope.data.offset;
			var token = $scope.data.token;
			$scope.data = {};
			this.baseOn = baseOn;
			this.id = id;
			tempId = id;
			tempOn = baseOn;
			$scope.data.type = this.baseOn
			$scope.data.promotionId = this.id;
			$scope.data.pageIndex = $scope.pageNumber;
			$scope.addNewProduct = "";
			//添加产品数据
			if(baseOn == 2) {
				$http.post(baseUrl + 'pc/promotionCondition/getAllProject', $scope.data).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg, 'failed');
					} else {
						$scope.addNewProduct = result.data;
						//分页
						$scope.totalRow = result.totalRow;
						$scope.pageNumber = result.pagesIndex;
						$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
						$scope.addProductPages = getRange($scope.pageNumber, $scope.pagestotal, 10);
					}
				});
			}
			//添加特定分类
			else if(baseOn == 3) {
				$scope.data = {};
				$scope.data.type = this.baseOn
				$scope.data.promotionId = this.id;
				$scope.data.pageIndex = tempo + 1;
				$scope.data.token = token;
				$http.post(baseUrl + 'pc/promotionCondition/getAllCategory', $scope.data).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg, 'failed');
					} else {
						$scope.addNewProduct = result.data;
						//分页
//						$scope.addProductPages = result.totalRow
						$scope.totalRow = result.totalRow;
						$scope.pageNumber = result.pagesIndex;
						$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
						$scope.addProductPages = getRange($scope.pageNumber, $scope.pagestotal, 10);

					}
				});
			} else {
				$scope.addNewProduct = "";
			}
			$scope.data.length = 10;
			$scope.data.offset = 0;
			$scope.data.token = token;
			//添加特定产品
			tempListOjbAdd = $scope.data;
			//满减明细列表
			tempListOjb = $scope.data;
			$http.post(baseUrl + 'pc/promotionCondition/many', $scope.data).success(function(result) {
				if(result.error > 0) {
					console.log(result.errmsg, 'failed');
				} else {
					$scope.selectProduct = result.data
					//分页
					$scope.data.length = result.length;
					$scope.data.offset = result.offset;
					$scope.totalRow = result.totalRow;
					$scope.pageNumber = $scope.data.offset / $scope.data.length + 1;
					$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
					console.log($scope.pageNumber, $scope.pagestotal)
					$scope.selectProductPages = getRange($scope.pageNumber, $scope.pagestotal, 10);
					setpagesProductNumber = $scope.pageNumber;
					
				}
			});
			$('#product_alert').modal('show')
		}

		//【 删除 】 （促销活动） 
		$scope.addProductDelete = function(id, name) {
			this.name = name;
			this.id = id;
			$scope.data.id = this.id;
			$byLayer.confirm("确定删除：" + this.name, function() {
				$http.post(baseUrl + 'pc/promotionCondition/delete', $scope.data).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg)
					} else {
						$scope.saveProduct(tempId, tempOn)
						$byLayer.msg('已删除', 'success', function() {})
					}
				});
			})

		}

		//【再添加】 选择产品 再添加产品  
		$scope.addNowProduct = function() {
			$('#addProduct_alert').modal('show');
			//多选框状态
			$('#addProduct_alert :input[type=checkbox]').attr("checked",false);
		
		}

		//【再添加】 确定再添加产品  (id,产品适用范围)
		$scope.newProduct = function() {
			var objects = [];
			var ckLength = 0;
			var ck = $('#addProduct_alert :input[type=checkbox]');
			ck.each(function() {
				if($(this).is(':checked')) {
					ckLength++;
					if(this.id != "") {
						var item = {};
						item.id = this.id;
						item.name = this.name;
						item.type = tempOn;
						item.promotionId = tempId;
						objects.push(item);
					}
				}
			})
			if(ckLength <= 0) {
				$byLayer.msg('请勾选', 'failed');
				return;
			}
			$scope.data.objects = JSON.stringify(objects)
			$http.post(baseUrl + 'pc/promotionCondition/batchCreate', $scope.data).success(function(result) {
				if(result.error > 0) {
					console.log(result.errmsg, 'failed');
				} else {
					promotionList(tempListOjb);
					$scope.saveProduct(tempId, tempOn);
					$('#addProduct_alert').modal('hide');
					$byLayer.msg('已添加', 'success');
				}
			});
		}

		/** 【添加】 促销活动列表 分页点击事件
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		$scope.addProductPages = function(k, t) {
			console.log($scope.allselectProduct)
			console.log(k, t);
			if(t == 0) {
				$scope.pageNumberProduct = $scope.pageNumberProduct + k;
				if($scope.pageNumberProduct > 0 && $scope.pageNumberProduct <= $scope.pagestotal) {
					$scope.pageNumberProduct = $scope.pageNumberProduct;
				} else if($scope.pageNumberProduct >= $scope.pagestotal) {
					$scope.pageNumberProduct = $scope.pagestotal;
				} else {
					$scope.pageNumberProduct = 1;
				}
			} else {
				$scope.pageNumberProduct = k;
			}
			$scope.data.offset = ($scope.pageNumberProduct - 1) * $scope.data.length;

		}
		//刷新促销活动列表
		var promotionList = function(obj) {
			$http.post(baseUrl + 'pc/promotionCondition/many', obj).success(function(result) {
				if(result.error > 0) {
					console.log(result.errmsg, 'failed');
				} else {
					$scope.selectProduct = result.data
				}
			});
		}
		/**
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		//刷新添加促销活动列表
		var promotionListAdd = function(obj, k, t) {
			var baseOn = obj.type;
			obj.pageIndex = k;
			if(baseOn == 2) {
				$http.post(baseUrl + 'pc/promotionCondition/getAllProject', obj).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg, 'failed');
					} else {
						$scope.addNewProduct = result.data;
					}
				});
			}
			//添加特定分类
			else if(baseOn == 3) {
				$http.post(baseUrl + 'pc/promotionCondition/getAllCategory', obj).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg, 'failed');
					} else {
						$scope.addNewProduct = result.data;
					}
				});
			} else {
				$scope.addNewProduct = "";
			}
		}

		/**【促销活动列表】 分页点击事件
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		$scope.setpages = function(k, t) {
			if(t == 0) {
				$scope.pageNumber = $scope.pageNumber + k;
				if($scope.pageNumber > 0 && $scope.pageNumber <= $scope.pagestotal) {
					$scope.pageNumber = $scope.pageNumber;
				} else if($scope.pageNumber >= $scope.pagestotal) {
					$scope.pageNumber = $scope.pagestotal;
				} else {
					$scope.pageNumber = 1;
				}
			} else {
				$scope.pageNumber = k;
			}
			$scope.data.offset = ($scope.pageNumber - 1) * $scope.data.length;
			getPromotion();
		}

		/**【满减明细列表】 分页点击事件
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		$scope.setpagesProduct = function(k, t) {
			if(t == 0) {
				$scope.setpagesProductNumber = $scope.setpagesProductNumber + k;
				if($scope.setpagesProductNumber > 0 && $scope.setpagesProductNumber <= $scope.pagestotal) {
					$scope.setpagesProductNumber = $scope.setpagesProductNumber;
				} else if($scope.setpagesProductNumber >= $scope.pagestotal) {
					$scope.setpagesProductNumber = $scope.pagestotal;
				} else {
					$scope.setpagesProductNumber = 1;
				}
			} else {
				$scope.setpagesProductNumber = k;
			}
			$scope.data.offset = ($scope.setpagesProductNumber - 1) * $scope.data.length;
			promotionList(tempListOjb);
		}

		/**【添加满减明细列表】 分页点击事件
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		$scope.setpagesProductAdd = function(k, t) {
			if(t == 0) {
				$scope.pageNumberAdd = $scope.pageNumberAdd + k;
				if($scope.pageNumberAdd > 0 && $scope.pageNumberAdd <= $scope.pagestotal) {
					$scope.pageNumberAdd = $scope.pageNumberAdd;
				} else if($scope.pageNumberAdd >= $scope.pagestotal) {
					$scope.pageNumberAdd = $scope.pagestotal;
				} else {
					$scope.pageNumberAdd = 1;
				}
			} else {
				$scope.pageNumberAdd = k;
			}
			$scope.data.offset = ($scope.pageNumberAdd - 1) * $scope.data.length;
			promotionListAdd(tempListOjbAdd, k, t);
		}

		var detailItem = {
			full: "",
			cashDiscount: ""
		};
		//添加活动明细list
		var num = 0;
		$scope.addDetailList = function(k) {
			num = num + k;
			detailItem = {
				num: num,
				full: "",
				cashDiscount: ""
			}
			$scope.detailList.push(detailItem);
		}
		//删除活动明细list
		$scope.deleteDetailList = function(k, id, p_id) {
			if(id) {
				$http.post(baseUrl + 'pc/promotionManjian/deleteManjian', {
					id: id
				}).success(function(result) {
					if(result.error > 0) {} else {
						$scope.getPromotion(p_id);
					}
				});
			} else if($scope.detailList.length > 1) {
				$scope.detailList.splice(k, 1);
			}
		}

		//保存明细
		$scope.submitDetail = function() {
			$scope.detail.proms = JSON.stringify($scope.detailList);
			$http.post(baseUrl + 'pc/promotionManjian/saveManjian', $scope.detail).success(function(result) {
				if(result.error > 0) {

				} else {
					$byLayer.msg('保存成功', 'success', function() {
						$('#detailForm').modal('hide');
					})
				}
			});
		}

		$scope.getPromotion_id = function(id) {
			$scope.product.promotion_id = id;
			$http.post(baseUrl + 'pc/promotionManjian/manyProduct', {
				promotion_id: id,
				pageNumber: 1,
				pageSize: 50
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.products = result.data;
				}
			});
		}

		//根据分类id获取商品
		$scope.getProduct = function(id) {
			$http.post(baseUrl + 'pc/promotionManjian/getProductByCate', {
				id: id
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.productName = result.data;
				}
			});
		}

		//取消
		$scope.close = function(id) {
			$('#' + id).modal('hide')
		}
		//上传图片
		$scope.upload = function(file, type) {
			if(file) {
				var index = layer.load(0, {
					shade: 0.5
				});
				Upload.upload({
					url: baseUrl + "admin/file/upload",
					data: {
						file: file
					}
				}).then(function(resp) {
					if(type == 1) {
						$scope.data.mainPic = baseUrl + resp.data.path;
					} else if(type == 2) {
						$scope.Position.image = resp.data.path;
					}
					layer.close(index);
				}, function(resp) {}, function(evt) {});
			}
		};
		/**
		 * 获取促销活动位置列表
		 * @param token
		 * @param promotionId 促销活动id
		 * @param pageSize 每页条数
		 * @param pageNumber 页码
		 * @return 成功：{error:0,data:[{id:id,title:位置标题:image:图片,type:位置类型(1产品，2优惠券)},...]} 失败：{error:>0,errmsg:错误信息}
		 */
		$scope.getManyPromotionPosition = function(id) {
			var PromotionPosition = {};
			PromotionPosition.promotionId = id;
			$scope.promotionPositionId = id;
			PromotionPosition.pageSize = 20;
			PromotionPosition.pageNumber = 1;
			$http.post(baseUrl + 'pc/promotionManjian/manyPromotionPosition', PromotionPosition).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					$scope.PromotionPosition = result.data;
				}
			});
		}
		$scope.addPromotionPosition = function() {
			$scope.Position = {};
		}
		/**
		 * 创建促销活动位置
		 * @param token
		 * @param title
		 * @param image
		 * @param type 位置类型(1产品，2优惠券)
		 * @param sort 排序值
		 * @param promotionId 促销活动id
		 * @return 成功：{error:0} 失败：{error:>0,errmsg:错误信息}
		 */
		/**
		 * 修改促销活动位置
		 * @param token
		 * @param title
		 * @param image
		 * @param type 位置类型(1产品，2优惠券)
		 * @param sort 排序值
		 * @param promotionId 促销活动id
		 * @return 成功：{error:0} 失败：{error:>0,errmsg:错误信息}
		 */
		$scope.createPromotionPosition = function() {
			$scope.Position.promotionId = $scope.promotionPositionId;
			if($scope.Position.id) {
				$scope.Position.promotionPositionId = $scope.Position.id;
				$http.post(baseUrl + 'pc/promotionManjian/updatePromotionPosition', $scope.Position).success(function(result) {
					if(result.error > 0) {

					} else if(result.error == 0) {
						$byLayer.msg('修改成功', 'success', function() {
							$scope.getManyPromotionPosition($scope.Position.promotionId);
							$('#add-title-form').modal('hide');
						})
					}
				});
			} else {
				$http.post(baseUrl + 'pc/promotionManjian/createPromotionPosition', $scope.Position).success(function(result) {
					if(result.error > 0) {

					} else if(result.error == 0) {
						$byLayer.msg('添加成功', 'success', function() {
							$scope.getManyPromotionPosition($scope.Position.promotionId);
							$('#add-title-form').modal('hide');
						})
					}
				});
			}

		}
		/**
		 * 修改促销活动
		 */
		$scope.getPromotionPosition = function(id) {
			$http.post(baseUrl + 'pc/promotionManjian/getPromotionPosition', {
				promotionPositionId: id
			}).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					$scope.Position = result.data;
				}
			});
		}

		/**
		 * 删除促销活动位置
		 * @param token
		 * @param promotionPositionId 位置id
		 * @return 成功：{error:0} 失败：{error:>0,errmsg:错误信息}
		 */
		$scope.deletePromotionPosition = function(id) {
			$http.post(baseUrl + 'pc/promotionManjian/deletePromotionPosition', {
				promotionPositionId: id
			}).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					$byLayer.msg('删除成功', 'success', function() {
						$scope.getManyPromotionPosition($scope.promotionPositionId);
					})
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

		/**
		 * 批量添加促销产品
		 * @param token
		 * @param promotionId 活动id
		 * @param ids 产品ids [1,2,3,...]
		 * @return 成功 {error:0} 失败 {error:>0,errmsg:错误信息}
		 */
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
						$('#addProductform').modal('hide');
						$scope.getproducts($scope.PropromotionPositionId);
					});
				}
			});
		}
		//选择商品
		$scope.selProductId = function(i) {
			if($scope.productName[i].isSelect == 1) {
				$scope.productName[i].isSelect = 0;
			} else {
				$scope.productName[i].isSelect = 1;
			}
		}
		//全选
		$scope.chkAll = function(c) {
			if(c == true) {
				for(var i = 0; i < $scope.PromotionPositionProduct.length; i++) {
					$scope.PromotionPositionProduct[i].checked = 1;
				}
			} else {
				for(var i = 0; i < $scope.PromotionPositionProduct.length; i++) {
					$scope.PromotionPositionProduct[i].checked = 0;
				}
			}

		}
		//删除商品
		$scope.deleteProduuct = function() {
			var data = {};
			var ids = [];
			var length = $scope.PromotionPositionProduct.length;

			for(var i = 0; i < length; i++) {
				if($scope.PromotionPositionProduct[i].checked == 1) {
					ids.push(JSON.stringify($scope.PromotionPositionProduct[i].id));
				}
			}
			data.ids = JSON.stringify(ids);

			$http.post(baseUrl + 'pc/promotionManjian/deleteProduct', data).success(function(result) {
				if(result.error > 0) {

				} else {
					$byLayer.msg('删除成功', 'success', function() {
						$scope.chkall = 0;
						$scope.getproducts($scope.PropromotionPositionId);
					})

				}
			});
		}
		/**
		 * 获取促销优惠券列表
		 * @param token
		 * @param promotionId 活动id
		 * @param pageNumber
		 * @param pageSize
		 * @return 成功：{error:0,data:[{id:id,title:优惠券标题},...]}
		 */
		$scope.getcoupons = function(id) {
			$scope.PropromotionPositionId = id;
			$scope.PromCoupon = {};
			$scope.PromCoupon.promotionId = id;
			$scope.PromCoupon.pageNumber = 1;
			$scope.PromCoupon.pageSize = 10;
			$http.post(baseUrl + 'pc/promotionManjian/manyPromCoupon', $scope.PromCoupon).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					for(var i = 0; i < result.data.length; i++) {
						result.data[i].checked = 0;
					}
					$scope.manyPromCoupon = result.data;
				}
			});
		}
		/**
		 * 获取当前店铺可用优惠券
		 * @param token
		 * @return 成功：{error:0,data:[{id:id,tiltle:优惠券标题},...]} 失败：{error:>0,errmsg:错误信息}
		 */
		$scope.getShopCoupons = function() {
			$http.post(baseUrl + 'pc/promotionManjian/getShopCoupons').success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					for(var i = 0; i < result.data.length; i++) {
						result.data[i].checked = 0;
					}
					$scope.ShopCoupons = result.data;
				}
			});
		}
		/**
		 * 添加某个促销优惠券
		 * @param token
		 * @param couponIds 优惠券ids [1,2,...]
		 * @param promotionId 活动id
		 * @return 成功：{error:0,data:{id:id,title:优惠券标题}}
		 */
		$scope.batchAddcoupons = function() {
			var ids = [];
			var length = $scope.ShopCoupons.length;
			for(var i = 0; i < length; i++) {
				if($scope.ShopCoupons[i].checked == 1) {
					ids.push(JSON.stringify($scope.ShopCoupons[i].id));
				}
			}

			$scope.coupon = {};
			$scope.coupon.couponIds = JSON.stringify(ids);
			$scope.coupon.promotionId = $scope.PropromotionPositionId;

			$http.post(baseUrl + 'pc/promotionManjian/batchCreatePromCoupon', $scope.coupon).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					$byLayer.msg('添加成功', 'success', function() {
						$('#addCouponsform').modal('hide');
						$scope.getcoupons($scope.PropromotionPositionId);
					})
				}
			});
		}
		/**
		 * 删除某个促销优惠券
		 * @param token
		 * @param promotionCouponId
		 * @return 成功：{error:0}
		 */
		$scope.deleteCoupons = function(id) {

			$http.post(baseUrl + 'pc/promotionManjian/deletePromCoupon', {
				promotionCouponId: id
			}).success(function(result) {
				if(result.error > 0) {

				} else if(result.error == 0) {
					$byLayer.msg('删除成功', 'success', function() {
						$scope.getcoupons($scope.PropromotionPositionId);
					})
				}
			});
		}

	}]);