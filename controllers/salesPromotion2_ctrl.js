/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute', 'ngFileUpload'])
	.controller('SalesPromotionCtrl2', ['$scope', '$http', '$anchorScroll', '$location', '$filter', 'Upload', function($scope, $http, $anchorScroll, $location, $filter, Upload) {
		$anchorScroll();
		$scope.shopmenu = 4;
		$scope.menustate = 6;
		$scope.state = 2;
		$scope.pageTitle = "折扣";
		$scope.data = {};
		$scope.pageNumber = 1;
		$scope.data.length = 10;
		$scope.data.offset = 0;
		$scope.data.promotionType = 2;
		$scope.pages = [];
		$scope.detail = {};
		$scope.product = {};
		$scope.temp = {};
		//促销活动列表的offset
		$scope.temp.offse = 0;

		//添加按钮
		$scope.addForm = function() {
			$scope.formTitle = "添加";
			$("input[name='act_start_time']").val("");
			$("input[name='act_stop_time']").val("");
			$scope.obj = "";
			$("#mj_applyScope").attr("disabled", false);
			
			//清空图片地址
			$scope.data.mainPic = "";
			$("#img_hover img").attr("src", "")

		}
		// 简单编码
		$scope.nameColor = "#000";
		$scope.encodedColor = "#000";
		$scope.encodedBlur = function(){
			$scope.nameColor = $scope.encodedColor;
		}
		//【 修改】修改按钮
		$scope.update = function(id) {
			$("#mj_applyScope").attr("disabled", true);
			$scope.data.id = this.id;
			$scope.data = {};
			$scope.formTitle = "修改";
			$http.post(baseUrl + 'pc/promotionZhekou/get', {
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

		//获得促销活动列表
		var getPromotion = function() {
			$scope.data = {};
			$scope.data.length = 10;
			$scope.data.offset = $scope.temp.offse;
			$http.post(baseUrl + 'pc/promotionZhekou/many', $scope.data).success(function(result) {
				if(result.error > 0) {

				} else {
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

		
		//【促销列表】（id，产品范围）
		var tempListOjb, tempListOjbAdd;
		$scope.saveProduct = function(id,baseOn) {
			if(baseOn==1){
				$byLayer.msg("抱歉！全订单暂不支持修改", 'failed');
				return;
			}
			$scope.addNewProduct = "";
			
			
			var templ=$scope.data.length;
			var tempo=$scope.data.offset;
			var token = $scope.data.token;
			$scope.data={};
			this.baseOn = baseOn;
			this.id = id;
			tempId = id;
			tempOn = baseOn;
			$scope.data.type = this.baseOn 
			$scope.data.promotionId = this.id;
			$scope.data.pageIndex  = tempo+1;
			//添加产品的列表
			//添加特定产品
			if(baseOn == 2){
				$http.post(baseUrl + 'pc/promotionCondition/getAllProject', $scope.data).success(function(result) {
					if(result.error > 0) {
						$byLayer.msg(result.errmsg , 'failed');
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
			else if(baseOn == 3){
				$scope.data={};
				$scope.data.type = this.baseOn 
				$scope.data.promotionId = this.id;
				$scope.data.pageIndex  = tempo+1;
				$scope.data.token = token;
				$http.post(baseUrl + 'pc/promotionCondition/getAllCategory', $scope.data).success(function(result) {								
					if(result.error > 0) {
						$byLayer.msg(result.errmsg , 'failed');
					} else {
						$scope.addNewProduct = result.data;
						//分页
						$scope.addProductPages = result.totalRow
						$scope.totalRow = result.totalRow;
						$scope.pageNumber = result.pagesIndex;
						$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
						$scope.addProductPages = getRange($scope.pageNumber, $scope.pagestotal, 10);
						
					}
				});
			}else{
				$scope.addNewProduct = "";
			}
			
			$scope.data.length = 10;
			$scope.data.offset = 0;
			$scope.data.token = token;
			//添加特定产品
			tempListOjbAdd = $scope.data;
			//促销明细列表
			tempListOjb = $scope.data;
			//促销明细列表
			$http.post(baseUrl + 'pc/promotionCondition/many', $scope.data).success(function(result) {
				if(result.error > 0) {
					$byLayer.msg(result.errmsg , 'failed');
				} else {
					$scope.selectProduct = result.data
					//产品总条数
					$scope.allselectProduct = result.totalRow;
					//分页
					$scope.data.length = result.length;
					$scope.data.offset = result.offset;
					$scope.totalRow = result.totalRow;
					$scope.pageNumber = $scope.data.offset / $scope.data.length + 1;
					$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
					$scope.selectProductPages = getRange($scope.pageNumber, $scope.pagestotal, 10);
					setpagesProductNumber = $scope.pageNumber;
				}
			});
			$('#product_alert').modal('show')
			
			
		}
		//刷新促销活动列表
		var promotionList = function(obj) {
			$http.post(baseUrl + 'pc/promotionCondition/many', obj).success(function(result) {
				if(result.error > 0) {
					$byLayer.msg(result.errmsg, 'failed');
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
		/**【促销明细列表】 分页点击事件
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
		/**【添加促销明细列表】 分页点击事件
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
		//删除  修改促销活动 
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
						$byLayer.msg('删除成功', 'success', function() {

						})
					}
				});
			})

		}
		//【再添加】 选择产品 再添加产品 
		$scope.addNowProduct = function() {
			$('#addProduct_alert').modal('show');
		}

		$scope.productAlert = function() {}
		$scope.data.startTime = "";
		
		//【添加 】，【修改】 提交按钮
		$scope.submit = function(id) {
			//适用范围
			this.id = id
			var reg = /^\d+$/;
			$scope.data = {};
			$scope.data.encodedColor = $scope.encodedColor;
			$scope.data.type = 2;
			$scope.data.title = $("input[name='mj_title']").val();
			$scope.data.startDate = $("input[name='act_start_time']").val();
			$scope.data.endDate = $("input[name='act_stop_time']").val();
			$scope.data.scope = 2;
			$scope.data.baseOn = $("#mj_applyScope option:selected").val();
			$scope.data.full = $("input[name='mj_enough']").val();
			$scope.data.value = $("input[name='mj_zhekou']").val();
			$scope.data.desc = $("#mj_txt").val();

			console.log($scope.data);

			if(!$scope.data.title) {
				$byLayer.msg('促销活动名称不能为空', 'failed');
				return false;
			}
			if(!$scope.data.startDate) {
				$byLayer.msg('促销活动开始时间不能为空', 'failed');
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
			if(!$scope.data.full < 0) {
				$byLayer.msg('满减金额不能小于0', 'failed');
				return false;
			}
			if(reg.test($scope.data.full) == false) {
				$byLayer.msg('满减金额请输入数字', 'failed');
				return false;
			}

			if(!$scope.data.value) {
				$byLayer.msg('请输入折扣', 'failed');
				return false;
			}
			if(!$scope.data.value < 0) {
				$byLayer.msg('折扣不能小于0', 'failed');
				return false;
			}
			if(reg.test($scope.data.value) == false) {
				$byLayer.msg('折扣请输入数字', 'failed');
				return false;
			}

			//添加
			if($scope.formTitle == '添加') {
				var data = angular.copy($scope.data);
				data.startDate = $filter('date')($scope.data.startDate, 'yyyy-MM-dd h:mm:ss');
				data.endDate = $filter('date')($scope.data.endDate, 'yyyy-MM-dd h:mm:ss');
				$http.post(baseUrl + "pc/promotionZhekou/create", data).success(function(result) {
					if(result.error == 0) {
						$('#addsalesForm').modal('hide');
						getPromotion();
						$byLayer.msg('保存成功', 'success')
					} else {
						$byLayer.msg(result.errmsg, 'failed');
					}
				});

			}
			//修改
			if($scope.formTitle == '修改') {
				$scope.data.id = this.id;
				var data = angular.copy($scope.data);
				data.startDate = $filter('date')($scope.data.startDate, 'yyyy-MM-dd h:mm:ss');
				data.endDate = $filter('date')($scope.data.endDate, 'yyyy-MM-dd h:mm:ss');
				$http.post(baseUrl + "pc/promotionZhekou/update", data).success(function(result) {
					if(result.error == 0) {
						$('#addsalesForm').modal('hide');
						getPromotion();
						$byLayer.msg('已保存', 'success')
					} else {
						$byLayer.msg(result.errmsg, 'failed');
					}
				});
			}
		}
		
		//【再添加】 确定再添加产品  (id,产品适用范围)
		$scope.newProduct = function(){
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
					$byLayer.msg(result.errmsg, 'failed');
				} else {
					$scope.saveProduct(tempId,tempOn);
					promotionList(tempListOjb);
					$('#addProduct_alert').modal('hide');
					$byLayer.msg('已添加', 'success')
					$scope.saveProduct(tempId, tempOn)
				}
			});
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//删除活动
		$scope.delete = function(id, hint) {
			var ids = [];
			ids.push(id);
			$scope.data.ids = JSON.stringify(ids);
			$byLayer.confirm("确定删除：" + hint, function() {
				$http.post(baseUrl + 'pc/promotionZhekou/delete', $scope.data).success(function(result) {
					if(result.error > 0) {
						$byLayer.msg(result.errmsg, 'failed');
					} else {
						getPromotion();
						$byLayer.msg('删除成功', 'success', function() {
							$scope.data.pageNumber = 1;
							$scope.pages = [];
						})
					}
				});
			})
		}
		
		/**分页点击事件
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
			$scope.temp.offse = ($scope.pageNumber - 1) * $scope.data.length;
			getPromotion();
		}

		$scope.getPromotion = function(id) {
			$scope.detail.promotion_id = id;
			$http.post(baseUrl + 'pc/promotionManjian/manyManjian', {
				promotion_id: id
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.detailList = result.data;
				}
			});
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
					$byLayer.msg('已保存', 'success', function() {
						$('#detailForm').modal('hide');
					})
				}
			});
		}

		//添加商品
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
		$scope.getAllCategory = function() {
			$http.post(baseUrl + 'pc/promotionManjian/getAllCategory').success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.category = result.data;
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

		//删除商品
		$scope.deleteProduuct = function(id) {
			var data = {};
			var ids = [];
			ids.push(JSON.stringify(id));
			data.ids = JSON.stringify(ids);
			$http.post(baseUrl + 'pc/promotionManjian/deleteProduct', data).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.getPromotion_id($scope.product.promotion_id);
				}
			});
		}
		//取消
		$scope.close = function(id) {
			$('#' + id).modal('hide');
		}
		//上传图片
		$scope.upload = function(file) {
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
					$scope.data.mainPic = baseUrl+resp.data.path;
					layer.close(index);
				}, function(resp) {}, function(evt) {});
			}
		};
	}]);