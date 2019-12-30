/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
	.controller('SalesPromotionCtrl3', ['$scope','$http','$anchorScroll','$location','$filter', 'Upload', function ($scope, $http, $anchorScroll, $location, $filter, Upload) {
    $anchorScroll();
    $scope.menustate=6;
    $scope.shopmenu=4;
    $scope.state=3;
    $scope.pageTitle="秒杀";
    $scope.addForm=function(){
      $scope.formTitle="添加";
      $("input[name='act_start_time']").val("");
			$("input[name='act_stop_time']").val("");
			$scope.obj = "";
			$("#mj_applyScope").attr("disabled", false);
			
			//清空图片地址
			$scope.data.mainPic = "";
			$("#img_hover img").attr("src", "")
    }
    $scope.data={};
    $scope.pageNumber=1;
    $scope.data.length=10;
    $scope.data.promotionType=3;
    $scope.pages=[];
    $scope.detail={};
    $scope.product={};
    
    $scope.data.length = 10;
		$scope.data.offset = 0;
		var residueNumber = 0; //可添加产品的条数 用于打开窗口前提示
		$scope.temp = {};
		//促销活动列表的offset
		$scope.temp.offse = 0;
      
    //获得促销活动列表
		var getPromotion = function() {
			$scope.data = {};
			$scope.data.length = 10;
			$scope.data.offset = $scope.temp.offse;
			$http.post(baseUrl + 'pc/promotionMiaosha/many', $scope.data).success(function(result) {
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

		$scope.products = [];
		var getProducts = function() {
			$scope.data = {};
			$http.post(baseUrl+'pc/promotionMiaosha/products', $scope.data).success(function(result){
				if (result.error == 0) {
					$scope.products = result.data;
				}
      });
		}
		getProducts();

		$scope.product = {};
		$scope.selectProduct = function() {
			var products = $scope.products;
			for (var i = 0; i < products.length; i++) {
				if (products[i].id == $scope.data.id) {
					$scope.product = products[i];
					$scope.data.suggestedRetailUnitPrice = products[i].suggestedRetailUnitPrice;
					break;
				}
			}
		}
        
    $scope.submit=function(){	
			//适用范围
			var reg = /^\d+$/;
			$scope.data.encodedColor = $scope.encodedColor;
			$scope.data.startDate = $("input[name='act_start_time']").val();
			$scope.data.endDate = $("input[name='act_stop_time']").val();
			if(!$scope.data.id) {
				$byLayer.msg('请选择产品', 'failed');
				return false;
			}
			if(!$scope.data.sec_price) {
				$byLayer.msg('请输入秒杀价', 'failed');
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
			
      var data = angular.copy($scope.data);
			data.sec_start_time = $filter('date')($scope.data.startDate, 'yyyy-MM-dd');
			data.sec_end_time = $filter('date')($scope.data.endDate, 'yyyy-MM-dd');
      $http.post(baseUrl+'pc/promotionMiaosha/save',data).success(function(result){
          if(result.error > 0) {
						$byLayer.msg(result.errmsg, 'failed');
						console.log(result)
          }else {
          	getPromotion();
          	$('#addsalesForm').modal('hide');
              $byLayer.msg('保存成功', 'success')
          }
      });
    }
		// 简单编码
		$scope.nameColor = "#000";
		$scope.encodedColor = "#000";
		$scope.encodedBlur = function(){
			$scope.nameColor = $scope.encodedColor;
		}
    //【 修改】修改按钮  先回显数据
		$scope.update = function(id) {
			$("#mj_applyScope").attr("disabled", true);
			$scope.data.id = this.id;
			$scope.data = {};
			$scope.formTitle = "修改";
			$http.post(baseUrl + 'pc/promotionMiaosha/get', {
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
    //删除活动(id,标题用于提示)
    $scope.delete=function(id,hint){
  		$byLayer.confirm("确定删除："+hint,function(){
  			$http.post(baseUrl+'pc/promotionMiaosha/delete', {id: id}).success(function(result){
            if(result.error > 0) {
							console.log(result.errmsg)
            }else {
            	getPromotion();
                $byLayer.msg('删除成功', 'success', function () {
                  $scope.data.pageNumber=1;
                  $scope.pages=[];
                })
            }
        });
    	})
    }
        
    //【促销列表】（id，产品范围）
    //【选择产品列表】（id，产品范围）
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
//			$scope.data.pageIndex  = tempo+1;
			$scope.data.pageIndex = 1;
			
			//添加产品的列表
			//添加特定产品
			if(baseOn == 2){
				console.log("$scope.data.pageIndex；"+$scope.data.pageIndex)
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
						$byLayer.msg('已删除', 'success', function() {

						})
					}
				});
			})

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
		//【再添加】 选择产品 再添加产品 
		$scope.addNowProduct = function() {
			$('#addProduct_alert').modal('show');
			//多选框状态
			$('#addProduct_alert :input[type=checkbox]').attr("checked",false);
		}
		//【再添加】 确定再添加产品  (id,产品适用范围)
		$scope.newProduct = function(){
			var objects=[];
			var ckLength=0;
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
				if(ckLength<=0){
					$byLayer.msg('请选择要添加的选项', 'failed');
					return;
				}
			$scope.data.objects = JSON.stringify(objects)
			$http.post(baseUrl + 'pc/promotionCondition/batchCreate', $scope.data).success(function(result) {
				if(result.error > 0) {
					$byLayer.msg(result.errmsg, 'failed');
				} else {
					promotionList(tempListOjb);
					$scope.saveProduct(tempId, tempOn);
					$('#addProduct_alert').modal('hide');
					$byLayer.msg('已添加', 'success');
				}
			});
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
            getPromotion();
        }


        $scope.getPromotion=function(id){
            $scope.detail.promotion_id=id;
            $http.post(baseUrl+'pc/promotionManjian/manyManjian',{promotion_id:id}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.detailList= result.data;
                }
            });
        }
        var detailItem={full:"",cashDiscount:""};
        //添加活动明细list
        var num=0;
        $scope.addDetailList=function(k){
            num=num+k;
            detailItem={num:num,full:"",cashDiscount:""}
            $scope.detailList.push(detailItem);
        }
        //删除活动明细list
        $scope.deleteDetailList=function(k,id,p_id){
            if(id){
                $http.post(baseUrl+'pc/promotionManjian/deleteManjian',{id:id}).success(function(result){
                    if(result.error > 0) {
                    }else {
                        $scope.getPromotion(p_id);
                    }
                });
            }else if($scope.detailList.length>1){
                $scope.detailList.splice(k,1);
            }
        }

        //保存明细
        $scope.submitDetail=function(){
            $scope.detail.proms=JSON.stringify($scope.detailList);
            $http.post(baseUrl+'pc/promotionManjian/saveManjian',$scope.detail).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('保存成功', 'success', function () {
                        $('#detailForm').modal('hide');
                    })
                }
            });
        }

        //添加商品
        $scope.getPromotion_id=function(id){
            $scope.product.promotion_id=id;
            $http.post(baseUrl+'pc/promotionManjian/manyProduct',{promotion_id:id,pageNumber:1,pageSize:50}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.products=result.data;
                }
            });
        }
        $scope.getAllCategory=function(){
            $http.post(baseUrl+'pc/promotionManjian/getAllCategory').success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.category=result.data;
                }
            });

        }
        //根据分类id获取商品
        $scope.getProduct=function(id){
            $http.post(baseUrl+'pc/promotionManjian/getProductByCate',{id:id}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.productName=result.data;
                }
            });
        }
 
        
        
        //删除商品
        $scope.deleteProduuct=function(id){
            var data={};
            var ids=[];
            ids.push(JSON.stringify(id));
            data.ids=JSON.stringify(ids);
            $http.post(baseUrl+'pc/promotionManjian/deleteProduct',data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.getPromotion_id($scope.product.promotion_id);
                }
            });
        }
        //取消
        $scope.close=function(id){
            $('#'+id).modal('hide');
        }
        //上传图片
        $scope.upload = function (file) {
            if (file) {
                var index = layer.load(0, {shade: 0.5});
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    $scope.data.mainPic = baseUrl+resp.data.path;
                    layer.close(index);
                }, function (resp) {
                }, function (evt) {
                });
            }
        };
    }]);