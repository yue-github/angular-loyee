/**
 * Created by admin on 2016/9/1.
 */
var getCartProducts;
var app = angular.module('app', ['ngRoute']).controller('ComfirmOrderCtrl', ['$scope', '$location', '$http', '$anchorScroll', '$route', function($scope, $location, $http, $anchorScroll, $route) {
		$anchorScroll();
		
		//判断浏览器终端设备
		var browser={
		    versions:function(){
		        var u = navigator.userAgent, app = navigator.appVersion;
		        return {
		            trident: u.indexOf('Trident') > -1, //IE内核
		            presto: u.indexOf('Presto') > -1, //opera内核
		            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
		            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
		            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
		            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
		            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
		            iPad: u.indexOf('iPad') > -1, //是否iPad
		            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
		            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
		            qq: u.match(/\sQQ/i) == " qq" //是否QQ
		        };
		    }(),
		    language:(navigator.browserLanguage || navigator.language).toLowerCase()
		}
		
		var productId = $location.search().id;
	// 是否能用优惠券抵扣
		$scope.coupon = $location.search().coupon=='true'?false:true;
		var pointProductId = $location.search().pointProductId;
		var amount = $location.search().amount;
		var priceId = $location.search().priceId;
		var totalPrice = $location.search().totalPrice;
		console.log(totalPrice)
		var prodType = $location.search().prodType;
		var startAt = $location.search().startAt;
		var endAt = $location.search().endAt;
		var shopId = $location.search().shopId;
		console.log(shopId)
		var order_type = $location.search().order_type;
		var group_set_meal_id = $location.search().group_set_meal_id;
		$scope.order_type = order_type;
		$scope.data = {};
		 // 属性标识是否会员专区跳过来的，目的扣除其成长值
		$scope.data.vip_is = $location.search().vip_is;
		$scope.yue_discount = $location.search().yue_discount;
		$scope.data.address_id = "";
		$scope.data.address_type = 1;	// 收货地址方式
		$scope.data.payType = 1;
		$scope.data.id = productId;
		$scope.data.amount = amount;
		$scope.data.priceId = priceId;
		$scope.data.balance = 0;
		$scope.data.gold = 0;
		$scope.new_address = {};
		$scope.bangPwd = {};
		$scope.code_txt = "获取手机验证码";
		$scope.isSetBalancePwdType = 1;
		$scope.data.invoiceHead = {};
		$scope.totalPayable = 0;
		$scope.oriTotalPayable = 0;
		// 记录优惠券取消与选择的总价变化
		$scope.sawTotalPayable = 0;
		// 记录通币变化时总价的变化
		$scope.goldsTotalPayable = false;
		$scope.originProductPrice = 0;
		$scope.deliveryPrice = 0;
		$scope.totalProdPrice = 0;		
		$scope.totalPromDiscount = 0;		
		$scope.data.totalPrice = totalPrice;
 
		$scope.data.prodType = prodType;	
		$scope.data.startAt = startAt;
		$scope.data.endAt = endAt;
		$scope.data.shopId = shopId;		//根据收货地址获取待提交的订单列表
		$scope.companyCode = "";  // 普通发票纳税编号
		$scope.selected_address = null;
		$scope.address = [];
		$scope.data.contacts = "";
		$scope.data.phone = "";
		$scope.data.MyTgold = 0;
		$scope.MyGoldListOne = 0;
		// 砍价参数
		// 已经砍的次数
		$scope.alreadyUse = 0;
		// 剩余次数
		$scope.surplus = 0;
		// 点击砍价执行
		let canKanjiaBoo = true;
		let canKanjiaBooAgain = true;
		// 获取砍价的次数和剩余次数
		$http.post(baseUrl + 'pc/promotionKanjia/kanjiaMsg',{productId:productId,shop_id:shopId}).success(r=>{
			$scope.alreadyUse = r.data[0].alreadyUse;	  
			$scope.surplus = r.data[0].surplus;	
		})
		$scope.kanjia = _=>{
			if(!canKanjiaBoo){
				$byLayer.msg('您已成功砍下价格，不能再砍了！','failed');
				return false;
			}
			if(!canKanjiaBooAgain){
				$byLayer.msg('您需刷新页面或者重新进入才能再砍！','failed');
				return false;
			}
			let random = Math.random();
			console.log(random)
			if(random > 0.95){
				$byLayer.msg('砍价成功','success');
				canKanjiaBoo = false;
			}else{
				$byLayer.msg('砍价失败','failed');
				canKanjiaBooAgain = false;
				return false;
			}
			
		}
		// 优惠券
		$scope.coupons=[
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id: 1,
            //     isUsed: 1,
            //     use:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // },
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id: 2,
            //     isUsed: 1,
            //     use:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // },
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id: 3,
            //     isUsed: 1,
            //     use:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // },
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id:4,
            //     isUsed: 1,
            //     use:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
			// }
		];
		let getMyCouponsCount=function(){
			$http.post(baseUrl + 'pc/center/getMyCoupons',{offset:0,length:10000000}).success(function (result) {
				console.log(result)
				$scope.coupons = result.data.filter(res=>{
					// use是用户选择该优惠券与否判断的属性
					if(res.type==1){
						if(res.value>100)
							res.value = 100;
							res.value = parseInt(res.value/10)
					}
					res.use = 0;
					// 是否使用了？是否是本产品领取的优惠券
					return res.isUsed == 0&&res.shopId == shopId;
				});
			 
				// 优惠券增加样式
				for (var i=0,l = $scope.coupons.length;i<l;i++){
					$scope.coupons[i].class="coupon1";
				}
			});
		}
		getMyCouponsCount();
		// 优惠券增加样式
		for (var i=0;i<$scope.coupons.length;i++){
            $scope.coupons[i].class="coupon1";
		}
		// 取消优惠券选择
		$scope.cancelCoupon = function(item,index){
			$scope.coupons[index].use = 0;
			// 复原
			// console.log($scope.goldsTotalPayable);
			// $scope.goldsTotalPayable?$scope.totalPayable = $scope.goldsTotalPayable:$scope.totalPayable = $scope.originProductPrice;
				
			$scope.totalPayable = $scope.originProductPrice;
			
			// sawTotalPayable记录优惠券取消与还原的应付总额值
			$scope.sawTotalPayable = $scope.originProductPrice;
			 
		}
	 
		// 点击优惠券使用
		$scope.getCoupon = function(item,index){
			// 记录原来的总额，便于恢复
			let inputDom = document.getElementById('checkbox6-4443');
			if(inputDom.checked){
				$byLayer.msg('通币与优惠券不能同时使用！');
				return false;
			}
				
			// 没有达到满减条件提示
			if($scope.coupons[index].full > parseFloat($scope.totalPayable)){
				$byLayer.msg('您应付总额没有达到满减条件无法使用本优惠券哦！','failed');
				return false;
			}
			// 判断是否已经使用一张优惠券了，设计规则为一次只能使用一张优惠券
			let isUsedBoo = $scope.coupons.every(res=>{
				return res.use == 0;
			})
			// 对点击了已使用的优惠券折扣与满减  1为折扣券 2为现金券
			if(isUsedBoo){
				$scope.coupons[index].use = 1;
				if($scope.coupons[index].type==1){
					$scope.totalPayable = (parseFloat($scope.totalPayable)*($scope.coupons[index].value*0.1)).toFixed(2);
					$scope.sawTotalPayable = $scope.totalPayable;
				}else if($scope.coupons[index].type==2){
					$scope.totalPayable = (parseFloat($scope.totalPayable) - item.value).toFixed(2);
					$scope.sawTotalPayable = $scope.totalPayable;
				}
			}else{
				$byLayer.msg('一次只能使用一张优惠券哦！','failed');
			}
            

        }
		//获取积分信息
        $http.post(baseUrl + 'pc/point/pointProduct', {productId: productId}).success(function (result) {
            if (result.error == 0)  {
				$scope.pointProduct = result.data;
            }
        });
		
		// 自提地址
		$scope.pickup_addresses = [];
		// 选择自提地址
		$scope.selectPickupAddress = function (index) {
			angular.forEach($scope.address, function(value, key) {
				$scope.address[key].is_default = false;
			});
			for (var i = 0; i < $scope.pickup_addresses.length; i++) {
				var item = $scope.pickup_addresses[i];
				if (i == index) {
					item.selected = true;
				} else {
					item.selected = false;
				}
			}
			$scope.data.address_id = $scope.pickup_addresses[index].id;
			$scope.data.address_type = 2;
			$scope.data.contacts = $scope.selected_address.contacts;
			$scope.data.phone = $scope.selected_address.phone;
		}
		
		//获取地址列表
		var getAddressMany = function() {
			$http.post(baseUrl + 'pc/address/many', {offset: 0, length: 10}).success(function(result) {
				if(result.error == 0) {
					var flag = false;
					$scope.address = result.addresses;
					angular.forEach($scope.address, function(value, key) {
						$scope.address[key].is_default = false;
						if($scope.address[key].isDefault == 1) {
							flag = true;
							$scope.address[key].is_default = true;
							$scope.data.address_id = $scope.address[key].id;
							$scope.selected_address = $scope.address[key];
						}
					});
					// 设置第一个地址为选中地址
					if (!flag && $scope.address.length > 0) {
						$scope.address[0].is_default = true;
						$scope.data.address_id = $scope.address[0].id;
						$scope.selected_address = $scope.address[0];
					}
					initPickupAddressReceiver();
				}
			});
		}
		getAddressMany();
		
		// 为自提地址初始化收货人姓名和手机号码
		function initPickupAddressReceiver() {
			angular.forEach($scope.pickup_addresses, function(value, key) {
				$scope.pickup_addresses[key].contacts = $scope.selected_address.contacts;
				$scope.pickup_addresses[key].phone = $scope.selected_address.phone;
			});
		}

		//我的账户余额
		$http.post(baseUrl + 'pc/wallet/balance').success(function(result) {
			if(result.error == 0) {
				$scope.walletAmount = result.balance;
			} else {}
		});

		$scope.products = [];
		
		// 获取自提地址
		function getPickupAddresses(orders) {
			$http.post(baseUrl + 'pc/pickup_address/commonPickupAddresses', {orders:JSON.stringify(orders)}).success(function(result) {
				if(result.error == 0) {
					$scope.pickup_addresses = result.data;
					if ($scope.selected_address != null) {
						initPickupAddressReceiver();
					}
				}
			});
		}
		$scope.canUsePromotion = true;
		var getmyOrderListByAddressId = function() {
			$http.post(baseUrl + 'pc/cart/getMyOrderListBeforeSubmit', $scope.data).success(function(result) {
				if(result.error != 0) {

				} else {
					$scope.totalPayable = parseFloat(result.totalPayable).toFixed(2);
					$scope.oriTotalPayable = $scope.totalPayable;
					$scope.deliveryPrice = parseFloat(result.deliveryPrice).toFixed(2);
					$scope.totalProdPrice = parseFloat(result.totalProdPrice).toFixed(2);
					$scope.totalPromDiscount = parseFloat(result.totalPromDiscount).toFixed(2);
					$scope.list = result.data;
					// 在购物车中结算时，如果产品出现不同商家，则不能使用砍价、优惠券、通币等
					let shopIdBoo = $scope.list[0].shop_id;
					$scope.canUsePromotion = $scope.list.every(res=>{
						return res.shop_id == shopIdBoo;
					})
					console.log($scope.canUsePromotion);
					getPickupAddresses($scope.list);
				}
			});
		}
		var productInfoByAddress = function() {
			$http.post(baseUrl + 'pc/comfirmOrder/productInfo', $scope.data).success(function(result) {
				if(result.error != 0) {

				} else {
					$scope.totalPayable = parseFloat(result.totalPayable).toFixed(2);
					$scope.oriTotalPayable = $scope.totalPayable;
					// 记录最原始的价格
					$scope.originProductPrice = $scope.totalPayable;
					$scope.oriTotalPayable = $scope.totalPayable;
					$scope.deliveryPrice = parseFloat(result.deliveryPrice).toFixed(2);
					$scope.totalProdPrice = parseFloat(result.totalProdPrice).toFixed(2);
					$scope.totalPromDiscount = parseFloat(result.totalPromDiscount).toFixed(2);
					$scope.list = result.data;
					$scope.proType = result.prodType;
					$scope.startAt = result.startAt;
					$scope.endAt = result.endAt;
					getPickupAddresses($scope.list);
				}
			});
		}
		
		var getProductsByGroupAct = function() {
			var params = {
				group_set_meal_id: group_set_meal_id
			};
			$http.post(baseUrl + 'pc/group_activity/orderList', params).success(function(result) {
				if(result.error == 0) {
					$scope.totalPayable = parseFloat(result.totalPayable).toFixed(2);
					$scope.oriTotalPayable = $scope.totalPayable;
					$scope.deliveryPrice = parseFloat(result.deliveryPrice).toFixed(2);
					$scope.totalProdPrice = parseFloat(result.totalProdPrice).toFixed(2);
					$scope.list = result.data;
					getPickupAddresses($scope.list);
				}
			});
		}
		
		if (order_type == 3) {
			getProductsByGroupAct();
		} else {
			if(productId) {
				//直接购买
				productInfoByAddress();
			} else {
				//获取购物车商品
				getmyOrderListByAddressId();
			}
		}
		
		$scope.isPerson = 1;
		//根据token获取普通发票
		//获取普通发票
		var executeGetInvoice = function(){
			$http.post(baseUrl + 'pc/order/getPlainInvoice', $scope.data).success(function(result) {
				if (result.error == 0) {
					for(var i = 0; i < result.data.length; i++) {
						result.data[i].isShow = 0;
						result.data[i].selInvoice = 0;
					}
					$scope.getinVoice = result.data;
				}
			});
		}
		executeGetInvoice();

		//选择发票类型
		$scope.invoiceHead = {};
		$scope.invoiceHead.invoiceContent = 1;
		$scope.companyinvoice = 1;
		$scope.data.invoiceHead.invoiceHead ="";
		$scope.data.invoiceHead.type = "";
		
		$scope.selectType = function(type) {
			$scope.invoiceHead.type = type;
			$scope.data.invoiceHead.type = type;
		}
		
		//选择发票内容
		$scope.selectContentType = function(contentType) {
			$scope.invoiceHead.invoiceContent = contentType;
			$scope.data.invoiceHead.invoiceContent = contentType;
		}
		//手机验证
		$scope.onkeydownNumber = function(){
			
        	var str=[];
        	var num  =$scope.new_address.phone;
        	if($scope.new_address.phone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.new_address.phone = str;
        		});
      			
        	}
        	
        }
		//手机验证
		$scope.onkeydownNumber2 = function(){
			
        	var str=[];
        	var num  =$scope.invoicePerson.phone;
        	if($scope.invoicePerson.phone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.invoicePerson.phone= str;
        		});
      			
        	}
        	
        }
		//手机验证
		$scope.onkeydownNumber3 = function(){
			
        	var str=[];
        	var num  =$scope.InvoiceInfo.companyPhone
        	if($scope.InvoiceInfo.companyPhone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.InvoiceInfo.companyPhone= str;
        		});
      			
        	}
        	
        }
		//选择普通发票抬头
		$scope.SelInVoice = function(k) {
			$scope.isPerson = 0;
			for(var i = 0; i < $scope.getinVoice.length; i++) {
				if(i == k) {
					$scope.getinVoice[k].selInvoice = 1;
					$scope.data.invoiceHead.type = 2;
					$scope.data.invoiceHead.invoiceHead = $scope.getinVoice[k].invoiceHead;
					$scope.data.invoiceHead.companyCode = $scope.getinVoice[k].companyCode;
					$scope.data.invoiceHead.invoiceContent = $scope.getinVoice[k].invoiceContent;
					//赋值给识别码文本框
					$scope.companyCode = $scope.getinVoice[k].companyCode;
				} else {
					$scope.getinVoice[i].selInvoice = 0;
					$scope.getinVoice[i].isShow = 0;
				}
			}
			
			$scope.codeShow = true;
		}
		
		//选择个人
		$scope.selPerson = function() {
			$scope.codeShow = false;
			$scope.isPerson = 1;
			$scope.data.invoiceHead.type = 1;
			alert(invoiceHead.type)
			$scope.data.invoiceHead.invoiceHead = "个人";
			for(var i = 0; i < $scope.getinVoice.length; i++) {
				$scope.getinVoice[i].selInvoice = 0;
			}
		}
		
		$scope.addInvoicePersonType = 1;
		//添加普通发票
		$scope.addInvoicePerson = function(t, v) {
			$scope.isPerson = 0;
			// 下面这两条语句主要用于解决新添加的发票覆盖旧发票的问题
			$scope.createInvoice.id = 0;
			$scope.createInvoice.invoiceHead = "";
			var Invoice = {
				id: 0,
				invoiceHead: '',
				isShow: 1
			};
			if(t == 1) {
				$scope.getinVoice.push(Invoice);
			}
			if(v == 0) {
				$scope.addInvoicePersonType = v;
			} else {
				$scope.addInvoicePersonType = 1;
			}
		}
		
		$scope.createInvoice = {};
		//编辑普通发票
		$scope.editInvoice = function(k, $event) {
			$scope.isPerson = 0;
			$scope.createInvoice.id = 0;
			for(var i = 0; i < $scope.getinVoice.length; i++) {
				if(i == k) {
					$scope.createInvoice.invoiceHead = $scope.getinVoice[k].invoiceHead;
					$scope.createInvoice.id = $scope.getinVoice[k].id;
					$scope.getinVoice[k].selInvoice = 1;
					$scope.getinVoice[k].isShow = 1;
				} else {
					$scope.getinVoice[i].selInvoice = 0;
					$scope.getinVoice[i].isShow = 0;
				}
			}
			// 阻止冒泡事件
			$event.stopPropagation();
		}
		
		//保存普通发票抬头
		$scope.addInvoiceTitle = function($event) {
			if (!$scope.createInvoice.invoiceHead) {
				$byLayer.msg('发票抬头不能为空', 'failed');
				return;
			}
			var url = "pc/order/savePlainInvoice";
			$http.post(baseUrl + url, $scope.createInvoice).success(function(result) {
				if (result.error == 0) {
					$byLayer.msg('保存成功', 'success');
					$scope.addInvoicePersonType = 1;
					executeGetInvoice();
				}
			});
			$event.stopPropagation();
		}
		
		//删除普通发票 
		$scope.deleteInvoice = function(id, index) {
			if (id) {
				$http.post(baseUrl + 'pc/order/deleteInvoice', {
					id: id
				}).success(function(result) {
					if (result.error == 0) {
						$byLayer.msg('删除成功', 'success');
						executeGetInvoice();
					}
				});
			} else {
				var data = [];
				for (var i = 0; i < $scope.getinVoice.length; i++) {
					if (i != index) {
						data.push($scope.getinVoice[i]);
					}
				}
				$scope.getinVoice = data;
			}
			
			$scope.addInvoicePersonType = 1;
		}

		//提交选择的普通发票
		$scope.submitInvoice1 = function() {
			if($scope.isPerson) {
				$scope.data.invoiceHead.invoiceHead = "个人";
				$('#invoiceWin').modal('hide');
			} else {
				var data = {
					id: 0,
					type: 2,
					invoiceHead: '',
					companyCode: $scope.companyCode,
					invoiceContent: $scope.invoiceHead.invoiceContent,
				};
				
				for(var i = 0; i < $scope.getinVoice.length; i++) {
					if($scope.getinVoice[i].selInvoice) {
						$scope.data.invoiceHead.invoiceHead = $scope.getinVoice[i].invoiceHead;
						data.id = $scope.getinVoice[i].id;
						data.invoiceHead = $scope.getinVoice[i].invoiceHead;
						break;
					}
				}
				
				if (!data.invoiceHead) {
					$byLayer.msg('请选择发票抬头', 'failed');
					return;
				}
				
				if (!data.companyCode) {
					$byLayer.msg('请填写纳税人编号', 'failed');
					return;
				}
				
				if (!data.invoiceContent) {
					$byLayer.msg('请选择发票内容', 'failed');
					return;
				}
				
				if (data.id != 0) {
					$http.post(baseUrl + 'pc/order/savePlainInvoice', data).success(function(result) {
						if (result.error == 0) {
							$('#invoiceWin').modal('hide');
						}
					});
				}
			}
		}

		/**
		 * 获取电子发票个人信息
		 * @param token
		 * @return 成功：{error:0,data:{name:姓名,phone:电话,email:邮箱,provinceId:省id,cityId:市id,districtId:区id,addressDetail:详细地址}}  失败：{error:>0,errmsg:错误信息}
		 */
		$scope.invoicePerson = {};
		$scope.getEletronicInvoice = function(type) {
			$http.post(baseUrl + 'pc/invoice/getEletronicInvoice', {type:type}).success(function(result) {
				if (result.error == 0 && result.data) {
					if (type == 1) {
						$scope.invoicePerson.phone = result.data.phone;
						$scope.invoicePerson.email = result.data.email;
						$scope.invoicePerson.type = result.data.type;
						$scope.invoicePerson.invoiceContent = result.data.invoiceContent;
					} else {
						$scope.invoicePerson = result.data;
					}
				}
			});
		}
		$scope.getEletronicInvoiceHead = function() {
			$http.post(baseUrl + 'pc/invoice/getEletronicInvoice', {type:2}).success(function(result) {
				if (result.error == 0 && result.data) {
					$scope.invoicePerson.invoiceHead = result.data.invoiceHead;
				}
			});
		}
		$scope.getEletronicInvoice(1);
		$scope.getEletronicInvoiceHead();
		
		/**
		 * 选择开个人电子还是公司电子票
		 */
		$scope.ele_codeShow = false;
		$scope.selInvoiceEmail = function(k) {
			$scope.saveInvoiceEmailType = k;
			if (k==1) {
				//个人发票  纳税人识别码隐藏
				$scope.ele_codeShow = false;
			} else if (k == 0) {
				//个人发票  纳税人识别码显示
				$scope.ele_codeShow = true;
			}
			
			var type = (k == 1) ? 1 : 2;
			$scope.getEletronicInvoice(type);
		}
		
		/**
		 * 保存电子发票
		 * @param email
		 * @param phone
		 * @return 成功：{error:0}  失败：{error:>0,errmsg:错误信息}
		 */
		$scope.saveInvoiceEmailType = 1;
		$scope.saveInvoiceEmail = function() {
			var data = {};
			if($scope.saveInvoiceEmailType == 1) {
				$scope.data.invoiceHead.invoiceHead = "个人";
				data.type = 1;
				data.invoiceHead = "个人";
			} else {
				$scope.data.invoiceHead.invoiceHead = $scope.invoicePerson.invoiceHead;
				data.type = 2;
				data.invoiceHead = $scope.invoicePerson.invoiceHead;
			}
			if(!$scope.invoicePerson.companyCode && $scope.invoicePerson.type == 2) {
				$byLayer.msg('纳税人识别码不可为空！', 'failed');
				return false;
			}
			var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
			if(!phoneReg.test($scope.invoicePerson.phone)) {
				$byLayer.msg('手机号码格式不正确！', 'failed');
				return false;
			}
			if(!$scope.invoicePerson.email) {
				$byLayer.msg('邮箱不可为空！', 'failed');
				return false;
			}
			if(!$scope.invoiceHead.invoiceContent) {
				$byLayer.msg('发票内容不可为空！', 'failed');
				return false;
			}
			data.companyCode = (data.type == 2) ? $scope.invoicePerson.companyCode : "";
			data.phone = $scope.invoicePerson.phone;
			data.email = $scope.invoicePerson.email;
			data.invoiceContent = $scope.invoiceHead.invoiceContent;
			$http.post(baseUrl + 'pc/invoice/saveInvoiceEmail', data).success(function(result) {
				if (result.error == 0) {
					$scope.getEletronicInvoice();
					$('#invoiceWin').modal('hide');
				}
			});
		}
		
		$scope.InvoiceInfo = {};
		//获取增值税发票
		$scope.getInvoiceInfo = function() {
			$http.post(baseUrl + 'pc/invoice/getInvoiceInfo').success(function(result) {
				if (result.error == 0 && result.data) {
					$scope.InvoiceInfo = result.data;
				}
			});
		}
		$scope.getInvoiceInfo();
		
		/**
		 * 获取增值发票个人信息
		 */
		$scope.getProvinces = function() {
			$http.post(baseUrl + 'pc/address/provinces').success(function(result) {
				if (result.error == 0) {
					$scope.provinces = result.provinces;
				}
			});
		}
		$scope.getProvinces();
		
		/**
		 * 保存增值发票公司信息
		 * @param companyName 公司名称
		 * @param companyCode 纳税人识别码
		 * @param companyAddress 公司注册地址
		 * @param companyPhone 注册电话
		 * @param bankName 开户银行
		 * @param bankAccount 银行账户
		 * @return 成功：{error:0}  失败：{error:>0,errmsg:错误信息}
		 */
		$scope.saveInvoiceInfo = function() {
			if(!$scope.InvoiceInfo.companyName) {
				$byLayer.msg('单位名称不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.companyCode) {
				$byLayer.msg('纳税人识别码不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.companyAddress) {
				$byLayer.msg('注册地址不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.companyPhone) {
				$byLayer.msg('注册电话不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.bankName) {
				$byLayer.msg('开户银行不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.bankAccount) {
				$byLayer.msg('银行账户不可为空！', 'failed');
				return false;
			}
			$scope.InvoiceInfo.invoiceContent = $scope.invoiceHead.invoiceContent;
			$scope.data.invoiceHead.invoiceHead = $scope.InvoiceInfo.companyName;
			$http.post(baseUrl + 'pc/invoice/saveInvoiceInfo', $scope.InvoiceInfo).success(function(result) {
				if (result.error != 0) {
					$byLayer.msg('保存失败！', 'failed');
					$scope.companyinvoice = 1;
				} else {
					$scope.companyinvoice = 0;
				}
			});
		}
		
		/**
		 * 保存发票个人信息
		 * @param name 姓名
		 * @param phone 手机
		 * @param provinceId 省id
		 * @param cityId 市id
		 * @param districtId 区id
		 * @param addressDetail 详细地址
		 * @return 成功：{error:0}  失败：{error:>0,errmsg:错误信息}
		 */
		$scope.saveInvoicePerson = function() {
			if(!$scope.InvoiceInfo.name) {
				$byLayer.msg('收票人姓名不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.phone) {
				$byLayer.msg('收票人电话不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.provinceId) {
				$byLayer.msg('收票人省份不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.cityId) {
				$byLayer.msg('收票人城市不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.districtId) {
				$byLayer.msg('收票人街区不可为空！', 'failed');
				return false;
			}
			if(!$scope.InvoiceInfo.addressDetail) {
				$byLayer.msg('详细地址不可为空！', 'failed');
				return false;
			}
			$http.post(baseUrl + 'pc/invoice/saveInvoicePerson', $scope.InvoiceInfo).success(function(result) {
				if (result.error == 0) {
					$scope.getInvoiceInfo();
					$('#invoiceWin').modal('hide');
				}
			});
		}
		$scope.getInvoice = function(){
			$scope.invoiceHead.type = 1;
		}
		//返回上一步
		$scope.callback = function() {
			$scope.companyinvoice = 1;
		}

		//根据token获取金币数
		$http.post(baseUrl + 'pc/customerGold/goldAmount', $scope.data).success(function(result) {
			$scope.MyGold = result.goldAmount;
			
			//$scope.goldDiscount = result.goldDiscount;
		});
		// 根据token获取通币数
		$scope.data.offset = 0;
		$scope.data.length = 10;
		$http.post(baseUrl + 'pc/customerGold/goldAmount', $scope.data).success(function(result) {
			if(result){
				$scope.MyGoldListOne = Math.round(result.goldAmount);
			    if(result.goldAmount<0)
					$scope.myGoldListOne = 0;
			}
				
				
		});
		// 获取积分数
		$scope.pointAmount = 0;
		$http.post(baseUrl + 'pc/myPoints/myPoint', $scope.data).success(function(result) {
			console.log(result)
			if(result)
				$scope.pointAmount = result.data.pointAmount;
		});
		// 计算抵钱数
		$scope.disCountMoney = '0.00';
		$scope.countMyGold=function(){
			return Number($scope.disCountMoney).toFixed(2);
		}
		// 通币输入变化触发一些更新
		$scope.allGolds = $scope.MyGoldListOne;
		$scope.myTgoldDo=function(){
			// 判断是否使用了优惠券 若使用记录应付总额
			let useCouponBoo = $scope.coupons.every(res=>{
				return res.use == 0;
			});
			// if(!useCouponBoo){
			// 	$scope.oriTotalPayable = $scope.sawTotalPayable;
			// }
			let MyTgold = Number($scope.data.MyTgold);
			let count = $scope.MyGoldListOne - MyTgold;
			// 计算扣去通币价格的总价
			let oriT = $scope.oriTotalPayable - MyTgold*0.01;
				if(count >= 0 && oriT.toFixed(2) >= 0.001){
					$scope.disCountMoney = MyTgold*0.01 + '';
					// 总价也应该相应变化
					$scope.totalPayable = oriT.toFixed(2);
					$scope.allGolds = count;
					$scope.goldsTotalPayable = $scope.totalPayable;
				}else{
					$byLayer.msg('您输入的通币数不符');
					$scope.data.MyTgold = 0;
					$scope.disCountMoney = '0.00';
					$scope.totalPayable = $scope.oriTotalPayable;
					$scope.goldsTotalPayable = $scope.sawTotalPayable;
					$scope.allGolds = $scope.MyGoldListOne;
				}
				console.log($scope.allGolds);
		};
		// 通币兑换
		$scope.goldSelect = function(obj){
			let inputDom = document.getElementById('checkbox6-4443'),
			yueCheckbox6 = document.getElementById('yue-checkbox6-4443');
			
			let isUsedBoo = $scope.coupons.every(res=>{
				return res.use == 0;
			})
			if(!isUsedBoo){
				$byLayer.msg('通币与优惠券不能同时使用！');
				inputDom.checked = false;
				return false;
			}
			inputDom.checked?yueCheckbox6.disabled=null:yueCheckbox6.disabled='disabled';
			if(!inputDom.checked){
				$scope.data.MyTgold = 0;
				$scope.disCountMoney = '0.00';
				$scope.totalPayable = $scope.oriTotalPayable;
			}
			 
		}
		//根据token,金币数获取抵扣金额
		$scope.getGoldDiscount = function() {
			if($scope.MyGold < $scope.data.golds) {
				$byLayer.msg('您输入的金币数不符');
			} else {
				$http.post(baseUrl + 'pc/order/getGoldDiscount', $scope.data).success(function(result) {
					if(result.error > 0) {

					} else {
						$scope.Discount = result.goldDiscount;
					}
				});
			}

		}

		//选择送货地址
		$scope.selAddress = function(id, n) {
			angular.forEach($scope.address, function(value, key) {
				$scope.address[key].is_default = false;
			});
			angular.forEach($scope.pickup_addresses, function(value, key) {
				$scope.pickup_addresses[key].selected = false;
			});
			$scope.address[n].is_default = true;
			$scope.data.address_id = $scope.address[n].id;
			$scope.data.address_type = 1;
			$scope.selected_address = $scope.address[n];
			initPickupAddressReceiver();
			if (order_type == 3) {
				getProductsByGroupAct();
			} else {
				if(productId) {
					productInfoByAddress();
				} else {
					getmyOrderListByAddressId();
				}
			}
		}
		

		//选择支付方式
		$scope.paytype = function(type) {
			$scope.data.payType = type;
		}

		//判断余额支付是否绑定支付密码
		$scope.isSetBalancePwd = function() {
			$http.post(baseUrl + 'pc/wallet/isSetBalancePwd', {}).success(function(result) {
				if(result.error == 0) {
					$scope.isSetBalancePwdType = 1;
				} else if(result.error == -1) {
					$scope.isSetBalancePwdType = 0;
				}
			})
		}
		//设置支付密码获取手机验证码
		//获取验证码
		$scope.checkcode = function() {
			var phone = $scope.bangPwd.mobilePhone;
			var phone_pattern = /^1[0-9]{10}$/;

			if(phone == '' || phone == null) {
				$byLayer.msg('手机号不能为空', 'failed');
				return false;
			}
			if(!phone_pattern.test(phone)) {
				$byLayer.msg('手机号码格式不正确', 'failed');
				return false;
			}
			$http.post(baseUrl + 'pc/wallet/getCode', {
				phone: phone
			}).success(function(result) {
				if(result.error == 0) {

					$scope.is_disabled = true;
					$scope.bangPwd.codeToken = result.codeToken;
					var time = 60;
					var init = setInterval(function() {
						$scope.$apply(function() {
							if(time >= 0) {
								$scope.code_txt = time + '秒后重新发送';
							} else {
								$scope.code_txt = '获取手机验证码';
								$scope.is_disabled = false;
								clearInterval(init);
							}
							time--;
						});
					}, 1000);
				}
			});
		};
		//设置支付密码
		$scope.banPwd = function() {
			if(!$scope.bangPwd.balancePwd) {
				$byLayer.msg('支付密码不能为空', 'failed')
				return false;
			}
			if(!$scope.bangPwd.reBalancePwd) {
				$byLayer.msg('确认密码不能为空', 'failed')
				return false;
			}
			if($scope.bangPwd.balancePwd != $scope.bangPwd.reBalancePwd) {
				$byLayer.msg('请确保密码一致', 'failed');
				return false;
			}
			$http.post(baseUrl + 'pc/wallet/addBalancePwd', $scope.bangPwd).success(function(result) {
				if(result.error == 0) {
					$byLayer.msg('设置支付密码成功', 'success', function() {
						$scope.submit();
					});
				} else if(result.error == -1) {
					$byLayer.msg('支付密码不能为空', 'failed');
				} else if(result.error == -2) {
					$byLayer.msg('输入的密码不一致', 'failed');
				}
			})
		}
		$scope.pay = {};
		//提交支付密码
		$scope.isCorrectBalancePwd = function() {
			if(!$scope.pay.password) {
				$byLayer.msg('支付密码不可为空', 'failed');
				return false;
			}

			var balancePwd = $scope.pay.password;
			$http.post(baseUrl + 'pc/wallet/isCorrectBalancePwd', {
				balancePwd: balancePwd
			}).success(function(result) {
				if(result.error == 0) {
					$scope.submit();
				} else if(result.error == -1) {
					$scope.pay.password = "";
					$byLayer.msg('支付密码错误', 'failed');
				}
			})
		}
		
		$scope.submitOrderByActivityCard = function() {
			if (!$scope.pay.card_code) {
				$byLayer.msg("卡号不能为空", "warn");
				return;
			}
			if (!$scope.pay.card_password) {
				$byLayer.msg("密码不能为空", "warn");
				return;
			}
			var index = $byLayer.loading();
			$scope.data.card_code = $scope.pay.card_code;
			$scope.data.card_password = $scope.pay.card_password;
			$scope.data.group_set_meal_id = group_set_meal_id;
			$scope.data.payType = 5;
			$scope.data.source = 1;
			$http.post(baseUrl + 'pc/group_activity/submitOrder', $scope.data).success(function(result) {			
				$byLayer.close(index)
				var error = result.error;
				if(error == 0) {
					$('#cardCodeform').modal('hide');
					$byLayer.msg("提交订单成功", 'success');
					window.location.href = "#/myOrders";
				} else if (error == -5) {
					$byLayer.msg("该套餐没有产品，不能提交", 'failed');
				} else if (error == -6) {
					$byLayer.msg("活动还没开始", 'failed');
				} else if (error == -7) {
					$byLayer.msg("活动已结束", 'failed');
				} else if (error == -1) {
					$byLayer.msg("卡号或密码不正确", 'failed');
				} else if (error == -2) {
					$byLayer.msg("订单金额不能大于购物卡金额", 'failed');
				} else if (error == -3) {
					$byLayer.msg("该套餐不存在", 'failed');
				} else if (error == -4) {
					$byLayer.msg("卡号已被使用", 'failed');
				} else {
					$byLayer.msg("提交订单失败", 'failed');
				}
				
			});
		}
		
		$scope.flog = false;
		$scope.data.couponIdArr = [];
		$scope.data.couponId = 0;
		$scope.submit = function() {
			// 加入运费
			$scope.data.deliveryPrice = $scope.deliveryPrice;
			// 为了可拓展，将使用的优惠券筛选出放入数组变成字符串传给后端，目前只能使用一张
			$scope.data.couponIdArr = $scope.coupons.map(res=>{
				if(res.use==1){
					// // 目前先用这个参数
					$scope.data.couponId = res.couponId;
					return res.couponId;
				}
					
			});
			
			//设备终端判断
			var facilityJudge;
			if(browser.versions.android){
				facilityJudge = 3; //是否移动端
			}else if(browser.versions.ios){
				facilityJudge = 4;	//是否ios
			}else if(browser.versions.weixin){
				facilityJudge = 2;	//是否微信
			}else{
				facilityJudge = 1;	//否则是pc
			}
			//检查收货地址
			if($scope.data.address_id=="") {
				$byLayer.msg('选择收货地址', 'failed');
				return;
			}
			$scope.data.source = facilityJudge;
			 
			
			// 设置发票信息
			if ($scope.invoiceHead.type) {
				var tmp = {
					type: $scope.invoiceHead.type,
					invoiceHead: $scope.data.invoiceHead.invoiceHead,
					invoiceContent: $scope.invoiceHead.invoiceContent
				};
				$scope.data.invoice = JSON.stringify(tmp);
			}
			
			if (order_type == 3) {
				$('#cardCodeform').modal('show');
				return;
			}
			
			if (order_type == 4) {
				if(productId && !$scope.flog) {
					$scope.flog = true;
					$scope.data.payType = 6;
					$scope.data.source = 1;
					$scope.data.pointProductId = pointProductId;
					$scope.data.need_point = $scope.pointProduct.need_point;
					$http.post(baseUrl + 'pc/point/saveOrder', $scope.data).success(function(result) {			
						$byLayer.close(index)
						if(result.error == 0) {
							$scope.flog = false;
							$byLayer.msg("提交订单成功", 'success');
							window.location.href = '#/myOrders';
						} else if (result.error == -1) {
							$byLayer.msg("积分不足", 'failed');
							$scope.flog = false;
						} else {
							$byLayer.msg("提交订单失败", 'failed');
						}
						
					});
				}
				return;
			}
			
			var index = $byLayer.loading();

			if(productId && !$scope.flog) {
				$scope.flog = true;
				$scope.data.totalPayable = $scope.data.vip_is==1?$scope.totalPayable*$scope.yue_discount:$scope.totalPayable;
				console.log(typeof $scope.data.totalPayable)
				if(parseFloat($scope.data.totalPayable) <= 0){
					$scope.data.totalPayable = 0.01;
				}
				// 是否vip，根据vip等级不同折扣不同
				$scope.data.vip_is==1?$scope.data.yue_discount = $scope.yue_discount:$scope.data.yue_discount = 1;
				// 携带应更新的通币数
				$scope.data.allGolds = $scope.allGolds;
				//直接购买
				$http.post(baseUrl + 'pc/comfirmOrder/saveOrder', $scope.data).success(function(result) {			
					$byLayer.close(index)
					if(result.error == 0) {
						$scope.flog = false;
						if(result.payType == 1) {
							window.location.href = "#/weixinPay?path=" + result.payInfo + "&theSameOrderNum=" + result.theSameOrderNum + "&orderId=" + result.orderId + "&theType=1";
						} else if(result.payType == 2) {
							angular.element('.container').append(result.payInfo);
						} else if(result.payType == 3) {
							document.write(result.payInfo);
						}
					}else{
						$byLayer.msg("提交订单失败", 'failed');
					}
					
				}); 
			} else if(!productId && !$scope.flog) {
				$scope.flog = true;
				if(order_type)
					$scope.data.orderType = order_type;
				$scope.data.totalPayable = $scope.totalPayable;
				$http.post(baseUrl + 'pc/comfirmOrder/saveOrderByCart', $scope.data).success(function(result) {			
					$byLayer.close(index)
					if(result.error == 0) {
						$scope.flog = false;
						if(result.error > 0) {
	
						} else if(result.payType == 1) {
							window.location.href = "#/weixinPay?path=" + result.payInfo + "&theSameOrderNum=" + result.theSameOrderNum + "&orderId=" + result.orderId + "&theType=1";
						} else if(result.payType == 2) {
							angular.element('.container').append(result.payInfo);
						} else if(result.payType == 3) {
							document.write(result.payInfo);
						}
					}else{
						$byLayer.msg("提交订单失败", 'failed');
					}
					
				});
			}
		}

		//添加地址--获取省市区
		$scope.getaddress = function() {
			$scope.new_address = {};
			$http.post(baseUrl + 'pc/address/provinces').success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.provinces = result.provinces;
				}
			});
		}
		$scope.getCity = function(id) {
			$scope.cities = [];
			$http.post(baseUrl + 'pc/address/cities', {
				provinceId: id
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.cities = result.cities;
				}
			});
		}

		$scope.getDistricts = function(id) {
			$scope.districts = [];
			$http.post(baseUrl + 'pc/address/districts', {
				cityId: id
			}).success(function(result) {
				if(result.error > 0) {

				} else {
					$scope.districts = result.districts;
				}
			});
		}

		//添加地址，提交数据
		$scope.saveAddress = function() {
			if(!$scope.new_address.contacts) {
				$byLayer.msg('收货人姓名不能为空', 'success');
				return false;
			}
			var phone_pattern = /^1[0-9]{10}$/;

			if(!$scope.new_address.phone) {
				alert("收货人手机号不能为空");
				return false;
			}
			if(!phone_pattern.test($scope.new_address.phone)) {
				alert('手机号码格式不正确');
				return false;
			}
			if(!$scope.new_address.provinceId) {
				var alertPopup = $ionicPopup.alert({
					title: '',
					template: '请选择省份'
				});

				$byLayer.msg('请选择省份', 'success');
				return false;
			}

			if(!$scope.new_address.cityId) {

				$byLayer.msg('请选择市区', 'success');
				return false;
			}

			if(!$scope.new_address.districtId) {

				$byLayer.msg('请选择区', 'success');
				return false;
			}

			if(!$scope.new_address.detailedAddress) {
				$byLayer.msg('请输入详细地址', 'success');
				return false;
			}

			$http.post(baseUrl + 'pc/address/save', $scope.new_address).success(function(result) {

				if(result.error == 0) {
					$byLayer.msg('保存成功', 'success', function() {
						getAddressMany();
//						initPickupAddressReceiver();
					});
				}
			});
		}
		//重置
		$scope.cleaned = function() {
			$scope.new_address = {};
		}

		$scope.ShowType = 0;
		//地址栏显示与隐藏
		$scope.isShow = function() {
			if($scope.ShowType) {
				$scope.ShowType = 0;
			} else {
				$scope.ShowType = 1;
			}
		}
		
		/*$scope.codeIsShow = function() {
			$scope.codeShow = true;
		}*/

		/**
		 * 计算优惠券优惠金额
		 * @param orderStr
		 * @return 成功：{error:0,discount:优惠金额} 失败：{error:>0,errmsg:错误信息}
		 */
		$scope.setDiscount = function() {
			for(var i = 0; i < $scope.list.shops.length; i++) {
				var shoplist = $scope.list.shops[i];
				var promotion_id = shoplist.customerCouponId;
				if(promotion_id) {
					$scope.list.shops[i].customerCouponId = promotion_id;
				}
				shoplist.invoiceHead = $scope.data.invoiceHead;
				shoplist.jobNumber = "";
				for(var j = 0; j < shoplist.couponList.length; j++) {
					if(promotion_id) {
						if(promotion_id == shoplist.couponList[j].id) {
							shoplist.promitionType = shoplist.couponList[j].type;
						}
					} else {
						shoplist.customerCouponId = 0;
						shoplist.promitionType = 0;
					}

				}
			}

			$scope.data.orders = $scope.list.shops;
			var orderStr = JSON.stringify($scope.data);

			$http.post(baseUrl + 'pc/comfirmOrder/couponDiscount', {
				orderStr: orderStr
			}).success(function(result) {
				if (result.error == 0) {
					$scope.discount = result.discount;
				}
			});
		}
				
	}]);