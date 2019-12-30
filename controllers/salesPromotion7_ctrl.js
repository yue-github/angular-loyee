/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute', 'ngFileUpload'])
	.controller('SalesPromotionCtrl7', ['$scope', '$http', '$anchorScroll', '$location', '$filter', 'Upload', function($scope, $http, $anchorScroll, $location, $filter, Upload) {
		$anchorScroll();
		$scope.menustate = 6;
		$scope.state = 6;
		$scope.shopmenu = 4;
		$scope.pageTitle = "拼团";
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
		$scope.data = {};
		$scope.pageNumber = 1;
		$scope.data.length = 10;
		$scope.data.offset = 0;
		$scope.data.promotionType = 7;
		$scope.pages = [];
		$scope.detail = {};
		$scope.product = {};

		//获取促销列表
		var getPromotion = function() {
			$scope.data = {};
			$scope.data.length = 10;
			$scope.data.offset = 0;
			$http.post(baseUrl + 'pc/promotionTuangou/many', $scope.data).success(function(result) {
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

		//【添加 】，【修改】 提交按钮
		$scope.submit = function() {
			//适用范围
		
			var reg = /^\d+$/;
			$scope.data.type = 7;
			$scope.data.encodedColor = $scope.encodedColor;
			$scope.data.scope = 1;
			$scope.data.title = $("input[name='mj_title']").val();
			$scope.data.desc = $("#mj_txt").val();
			$scope.data.startDate = $("input[name='act_start_time']").val();
			$scope.data.endDate = $("input[name='act_stop_time']").val();
			$scope.data.baseOn = $("#mj_applyScope option:selected").val();
			$scope.data.full = $("input[name='mj_enough']").val();
			if(!$scope.data.title) {
				$byLayer.msg('砍价活动名称不能为空', 'failed');
				return false;
			}
			if(!$scope.data.startDate) {
				$byLayer.msg('砍价活动开始时间不能为空', 'failed');
				return false;
			}
			if(!$scope.data.endDate) {
				$byLayer.msg('砍价活动截止时间不能为空', 'failed');
				return false;
			}
			if(reg.test($scope.data.full) == false) {
				$byLayer.msg('包邮金额请输入数字', 'failed');
				return false;
			}
			if(!$scope.data.full) {
				$byLayer.msg('请输入包邮金额', 'failed');
				return false;
			}

			if($scope.formTitle == '添加') {
				var data = angular.copy($scope.data);
				data.startTime = $filter('date')($scope.data.startTime, 'yyyy-MM-dd');
				data.endTime = $filter('date')($scope.data.endTime, 'yyyy-MM-dd');

				$http.post(baseUrl + "pc/promotionTuangou/create", data).success(function(result) {
					if(result.error > 0) {
						$byLayer.msg(result.errmsg, 'failed');
					} else {
						getPromotion();
						$('#addsalesForm').modal('hide');
						$byLayer.msg('保存成功', 'success')
					}
				});
			}
			if($scope.formTitle == '修改') {
				var data = angular.copy($scope.data);
				data.startTime = $filter('date')($scope.data.startTime, 'yyyy-MM-dd');
				data.endTime = $filter('date')($scope.data.endTime, 'yyyy-MM-dd');

				$http.post(baseUrl + "pc/promotionTuangou/update", data).success(function(result) {
					if(result.error > 0) {
						$byLayer.msg(result.errmsg, 'failed');
					} else {
						getPromotion();
						$('#addsalesForm').modal('hide');
						$byLayer.msg('保存成功', 'success')
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
			$("#mj_applyScope").attr("disabled", true);
			$scope.data.id = this.id;
			$scope.data = {};
			$scope.formTitle = "修改";
			$http.post(baseUrl + 'pc/promotionTuangou/get', {
				id: id,
				promotionType: 7
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
		
		//【促销列表】（id，产品范围）
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
			// $scope.data.type = this.baseOn 
			$scope.data.type = 7;
			$scope.data.promotionId = this.id;
			$scope.data.pageIndex  = tempo+1;
			
			
			//添加产品的列表
			//添加特定产品
			if(baseOn == 2){
				$http.post(baseUrl + 'pc/promotionCondition/many', $scope.data).success(function(result) {
					if(result.error > 0) {
						$byLayer.msg(result.errmsg , 'failed');
					} else {
						$scope.addNewProduct = result.data;
						
					}
				});
			}
			//添加特定分类
			else if(baseOn == 3){
				$scope.data={};
				// $scope.data.type = this.baseOn 
				$scope.data.type = 7 
				$scope.data.promotionId = this.id;
				$scope.data.pageIndex  = tempo+1;
				$scope.data.token = token;
				$http.post(baseUrl + 'pc/promotionCondition/getAllCategory', $scope.data).success(function(result) {								
					if(result.error > 0) {
						$byLayer.msg(result.errmsg , 'failed');
					} else {
						$scope.addNewProduct = result.data;
					}
				});
			}else{
				$scope.addNewProduct = "";
			}
			
			$scope.data.length = 10;
			$scope.data.offset = 1;
			$scope.data.token = token;
			//促销明细列表
			$http.post(baseUrl + 'pc/promotionCondition/many', $scope.data).success(function(result) {
				if(result.error > 0) {
					$byLayer.msg(result.errmsg , 'failed');
				} else {
					$scope.selectProduct = result.data
					//产品总条数
					$scope.allselectProduct = result.totalRow;
				}
			});
			$('#product_alert').modal('show')
			
			
		}
		
		
		//删除活动(id,标题用于提示)
		$scope.delete = function(id, hint) {
			var ids = [];
			ids.push(id);
			$scope.data.ids = JSON.stringify(ids);
			$byLayer.confirm("确定删除：" + hint, function() {
				$http.post(baseUrl + 'pc/promotionTuangou/delete', $scope.data).success(function(result) {
					if(result.error > 0) {
						console.log(result.errmsg)
					} else {
						getPromotion();
						$byLayer.msg('删除成功', 'success')
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
			$scope.data.offset = ($scope.pageNumber - 1) * $scope.data.length;
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
					$byLayer.msg('保存成功', 'success', function() {
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