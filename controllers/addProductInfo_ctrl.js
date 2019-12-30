/**
 * Created by admin on 2016/9/30.
 */

var app = angular.module('app', ['ngRoute', 'ngFileUpload', 'ng.ueditor'])
    .controller('AddProductInfoCtrl', ['$scope', '$location', '$http', 'Upload', '$anchorScroll', function ($scope, $location, $http, Upload, $anchorScroll) {
        $anchorScroll();
        $scope.is_compose = 0; //是否组合 
        $scope.composeProductId = '';//组合产品id
        $scope.menustate=0;
        $scope.shopmenu=1;
        $scope.data = {};
        $scope.composeProducts = [];//组合产品
        $scope.data.category_id = $location.search().catId;
        $scope.data.id = $location.search().id;
        $scope.data.is_sale = 1;
        $scope.data.isSupportReturn = 0;
        $scope.data.is_pre_sale = 0;
        $scope.data.is_allow_pick = 0;
        $scope.tpics = [];
        $scope.prices = [];
        $scope.attrSelecteds = [];
        $scope.showPrices = false;  //显示价格表
        $scope.fontLength=30;
        $scope.isEditStoreAmount = true;
        $scope.a = 2;
        $scope.is_show_commission = true;
        $scope.prodTypeList=[{'val':0,'name':'普通产品'},{'val':1,'name':'酒店'},{'val':2,'name':'旅游产品'}];
        
        var getproducts=function(){
            $http.post(baseUrl+'pc/shopProduct/getProducts', {offset: 0, length: 1000, shopId:1}).success(function(result){
                if(result.error == 0) {
                	$scope.shopProducts=result.data;
                }
            });
        }

        getproducts();
        //选择组合产品
        $scope.addCompose = function() {
        	var p = null;
        	for(var i = 0; i < $scope.shopProducts.length; i++) {
        		if($scope.shopProducts[i].id == $scope.composeProductId) {
        			p = $scope.shopProducts[i];
        			break;
        		}
        	}
        	if(p == null) {
        		return;
        	}
        	for(var i = 0; i < $scope.composeProducts.length; i++) {
        		if($scope.composeProducts[i].id == p.id) {
        			alert('该产品已添加');
        			return;
        		}
        	}

        	$scope.composeProducts.push({id: p.id, name: p.name});
        }
        
        //删除组合产品 
        $scope.deleteCompose = function(id) {
        	var k = -1;
        	for(var i = 0; i < $scope.composeProducts.length; i++) {
        		if($scope.composeProducts[i].id == id) {
        			k = i;
        			break;
        		}
        	}
        	
        	$scope.composeProducts.splice(k, 1);
        }
        
        //酒店属性
        $scope.hotels = [];
        console.log($scope.hotels);
        // 发票类型
        $scope.invoiceTypeList = [
        	{name:'增值税普通发票', value:'general'},
        	{name:'增值税专用发票', value:'value_add'}
        ];
        //选择税率
        $scope.selectTax = function() {
        	var id = $scope.data.taxId;
        	var list = $scope.signsList;
        	var taxRate = 0;
        	for (var i = 0; i < list.length; i++) {
        		if (list[i].id == id) {
        			taxRate = list[i].rate;
        			break;
        		}
        	}
        	$scope.data.taxRate = taxRate;
        	
        	setUnitCostNoTax();
        }
        //输入税率
        $scope.taxRateKeyUp = function() {
        	setUnitCostNoTax();
        }
        //输入含税成本价
        $scope.unitCostKeyUp = function() {
        	setUnitCostNoTax();
        }
        //选择发票类型
        $scope.selectInvoiceType = function() {
        	setUnitCostNoTax();
        }
        // 选择是否允许自提
        $scope.selectPickup = function() {
        	console.log($scope.data.is_allow_pick);
        }
        
        // 自提
        $scope.pickup_address_id = 0;
        $scope.pickup_addresses = [];
        $scope.getPickupAddresses = function() {
        	$http.post(baseUrl+'pc/pickup_address/all', {}).success(function(result){
				if (result.error == 0) {
					$scope.pickup_addresses = result.data;
				}
	        });
        }
        $scope.getPickupAddresses();
        
        $scope.product_addresses = [];
        $scope.getProductAddresses = function() {
        	$http.post(baseUrl+'pc/pickup_address/productAddresses', {product_id: $scope.data.id}).success(function(result){
				if (result.error == 0) {
					$scope.product_addresses = result.data;
				}
	        });
        }
        $scope.getProductAddresses();
        
        // 选择自提地点
        $scope.selectPickupAddress = function() {
        	if (!$scope.pickup_address_id) {
        		return;
        	}
        	var is_contain = false;
        	for (var i = 0; i < $scope.product_addresses.length; i++) {
        		var item = $scope.product_addresses[i];
        		if (item.id == $scope.pickup_address_id) {
        			is_contain = true;
        			break;
        		}
        	}
        	if (!is_contain) {
        		var address = {};
            	for (var i = 0; $scope.pickup_addresses.length; i++) {
            		var item = $scope.pickup_addresses[i];
            		if (item.id == $scope.pickup_address_id) {
            			address = item;
            			break;
            		}
            	}
        		$scope.product_addresses.push(item);
        	}
        }
        
        // 删除自提点
        $scope.delete_address = function (index) {
        	$scope.product_addresses = removeArrayByIndex($scope.product_addresses, index);
        }
        
        function removeArrayByIndex(array, index) {
        	var result = [];
        	for (var i = 0; i < array.length; i++) {
        		if (index != i) {
        			result.push(array[i]);
        		}
        	}
        	return result;
        }
        
        //设置未税成本价
        var setUnitCostNoTax = function() {
        	var unitCostNoTax = calculateUnitCostNoTax($scope.data.taxRate, $scope.data.invoiceType, $scope.data.unitCost);
        	if (typeof unitCostNoTax == 'number')
        		unitCostNoTax = parseFloat(unitCostNoTax.toFixed(2));
        	$scope.data.unitCostNoTax = unitCostNoTax;
        }
        //计算未税成本价
        var calculateUnitCostNoTax = function(taxRate, invoiceType, unitCost) {
        	if ((taxRate === "" || taxRate === null) || !invoiceType || !unitCost) {
        		return '';
        	}
        	
        	if (taxRate == 0) {
        		return unitCost;
        	}
        	else if (invoiceType == 'general') {
        		return unitCost;
        	}
        	else if (invoiceType == 'value_add') {
        		return unitCost / (1 + taxRate * 0.01);
        	}
        	else {
        		return unitCost;
        	}
        }
        //限制商品名称字数为30个字；
        $scope.valiDateLength=function(){
            var length=$scope.data.name.length;
            if(length>30){
                $scope.data.name = $scope.data.name.substr(0, 30);
                $scope.fontLength=0;
            }else{
                $scope.fontLength=30-length;
            }
        }
        //加载产品信息
        $scope.loadInfo = function () {
            if($scope.data.id) {
                getProductInfo($scope,$http,$scope.data.id);
            }
        }
        var tempNum=0;
        $scope.createTirps = function (){
         	canCreateTirps();
         	tempNum++;
        }
        //添加酒店属性
        console.log($scope.hotels);
        var canCreateTirps = function () {
         	var t = {price: 0, product_number: 0,unitCost:0,originUnitPrice:0, start_at: '', end_at: ''};
         	$scope.hotels.push(t);
        }
        
        //属性值change
        $scope.cratePrices = function () {
            $scope.showPrices = canCreatePrices();
            if($scope.showPrices === true) {
                createPrices();
            } else {
                $scope.prices = [];
            } 
        }
        //判断符合条件创建价格表
        var canCreatePrices = function () {
            var showPrices = true;
            if($scope.saleAttrs.length<1){
                showPrices = false;
            }
            for(var i = 0; i < $scope.saleAttrs.length; i++) {
                var attr = $scope.saleAttrs[i];
                var flag = false;   //是否选中一个属性值
                for(var k = 0; k < attr.propertyValueList.length; k++) {
                    var av = attr.propertyValueList[k];
                    if(av.checked === true) {
                        flag = true;
                        break;
                    }
                }
                if(flag === false) {
                    showPrices = false;
                    break;
                }
            }
            return showPrices;
        }
        
        //获取产品品牌
        getBrands($scope,$http);
        //获取产品供应商列表
        getSuppliers($scope,$http,$scope.data.category_id);
        //获取产品税率标识
        getSignsList($scope,$http);
        //创建价格表
        var createPrices = function() {
            $scope.prices = [{price: 0, productNumber: 0,unitCost:0,originUnitPrice:0, attrs: [], attrType: ''}];
            for(var i = 0; i < $scope.saleAttrs.length; i++) {
                var attr = $scope.saleAttrs[i];
                var flag = false;
                var tempPrices = angular.copy($scope.prices);
                for(var k = 0; k < attr.propertyValueList.length; k++) {
                    var av = attr.propertyValueList[k];
                    if(av.checked === true) {
                        if(flag === true) {
                            var tp = angular.copy(tempPrices);

                            for(var j = 0; j < tp.length; j++) {
                                var p = tp[j];
                                p.attrs.push({propertyId: attr.propertyId, propertyName: attr.propertyName, propertyValueId: av.propertyValueId, propertyValueName: av.propertyValueName});
                                p.attrType += av.propertyValueId;

                                if(($scope.saleAttrs.length - 1) > i) {
                                    p.attrType += ',';
                                }
                                $scope.prices.push(p);
                            }
                        }else  {
                            for(var j = 0; j < $scope.prices.length; j++) {
                                var p = $scope.prices[j];
                                p.attrs.push({propertyId: attr.propertyId, propertyName: attr.propertyName, propertyValueId: av.propertyValueId, propertyValueName: av.propertyValueName});
                                p.attrType += av.propertyValueId;

                                if(($scope.saleAttrs.length - 1) > i) {
                                    p.attrType += ',';
                                }
                            }
                            flag = true;
                        }
                    }
                }
            }
            if($scope.data.id) {
                for (var i = 0; i < $scope.prices.length; i++) {
                    var price = $scope.prices[i];
                    for (var k = 0; k < $scope.data.productPrices.length; k++) {
                        var tp = $scope.data.productPrices[k];
                        if (price.attrType == tp.type_attr) {
                            price.productNumber = tp.product_number;
                            price.price = tp.price;
                            price.originUnitPrice = tp.originUnitPrice;
                            price.unitCost = tp.unitCost;
                        }
                    }
                }
            }
        };
        //获取产品属性
        getAttrs($scope,$http,$scope.data.category_id);
        //上传图片
        $scope.upload = function (file, k) {
            if (file) {
                var index = $byLayer.loading();
                uploadFile($scope,$http,file, k,Upload,index);
            }
        };
        //选择商品销售属性
        $scope.attrbox = [];
        $scope.selectAttr = function (k, n) {
            $scope.attrbox.splice(n, 1, k);
        }
        //保存商品
        console.log($scope.hotels);
        $scope.submit = function () {
        	console.log($scope.hotels);
            if(!$scope.data.name) {
                $byLayer.msg('请输入标题', 'warning');
                return;
            }
            if (($scope.data.prod_type == 1 || $scope.data.prod_type == 1) && !$scope.data.commission) {
            	$byLayer.msg('请输入佣金比例', 'warning');
                return;
            }
            if ($scope.data.commission < 0 || $scope.data.commission > 100) {
            	$byLayer.msg('佣金比例在0至100之间', 'warning');
                return;
            }
            if(!$scope.data.supplier_id) {
                $byLayer.msg('请选择产品供应商', 'warning');
                return;
            }
            if(!$scope.data.taxId) {
            	$byLayer.msg('请选择税率', 'warning');
                return;
            }
            if($scope.data.taxRate === null || $scope.data.taxRate === "" || $scope.data.taxRate === undefined) {
            	$byLayer.msg('请填写税率值', 'warning');
                return;
            }
            if($scope.data.taxRate < 0 || $scope.data.taxRate >= 100) {
            	$byLayer.msg('税率值要大于0小于100', 'warning');
                return;
            }
            if(!$scope.data.unitCost) {
                $byLayer.msg('请输入成本价', 'warning');
                return;
            }
            if(!$scope.data.originUnitPrice && $scope.data.originUnitPrice != 0) {
                $byLayer.msg('请输入零售价', 'warning');
                return;
            }
            if($scope.data.originUnitPrice <= 0) {
                $byLayer.msg('零售价要大于0', 'warning');
                return;
            }
            if(!$scope.data.suggestedRetailUnitPrice && $scope.data.suggestedRetailUnitPrice != 0) {
                $byLayer.msg('请输入促销价', 'warning');
                return;
            }
            if($scope.data.suggestedRetailUnitPrice <= 0) {
                $byLayer.msg('促销价要大于0', 'warning');
                return;
            }
            if(!$scope.data.storeAmount && $scope.data.storeAmount != 0) {
                $byLayer.msg('请输入库存', 'warning');
                return;
            }
            if($scope.data.storeAmount < 0) {
                $byLayer.msg('库存不能小于0', 'warning');
                return;
            }
            if(!$scope.data.warningValue && $scope.data.warningValue != 0) {
            	alert($scope.data.warningValue);
                $byLayer.msg('请输入库存预警值', 'warning');
                return;
            }
            if($scope.data.warningValue < 0) {
                $byLayer.msg('库存预警值不能小于0', 'warning');
                return;
            }
            if(!$scope.data.invoiceType || $scope.data.invoiceType == 'all') {
                $byLayer.msg('请选择发票类型', 'warning');
                return;
            }
            if ($scope.data.is_pre_sale == 1 && !$scope.data.pre_start_time) {
            	$byLayer.msg('请输入预售开始时间', 'warning');
                return;
            }
            if ($scope.data.is_pre_sale == 1 && !$scope.data.pre_end_time) {
            	$byLayer.msg('请输入预售结束时间', 'warning');
                return;
            }
            if($scope.tpics.length <= 0) {
                $byLayer.msg('至少上传一张产品图片', 'warning');
                return;
            }
            
          	if($scope.data.prod_type != 1){
          		if($scope.saleAttrs.length > 0 && $scope.prices.length <= 0) {
          		    $byLayer.msg('请选择销售属性', 'warning');
          		    return;
          		}
	            for (var i = 0; i < $scope.prices.length; i++) {
	            	var item = $scope.prices[i];
	            	if (!item.originUnitPrice && item.originUnitPrice != 0) {
	            		$byLayer.msg('请填写产品规格的原价', 'warning');
	                    return;
	            	}
	            	if (item.originUnitPrice <= 0) {
	            		$byLayer.msg('产品规格的原价要大于0', 'warning');
	                    return;
	            	}
	            	if (!item.price && item.price != 0) {
	            		$byLayer.msg('请填写产品规格的促销价', 'warning');
	                    return;
	            	}
	            	if (item.price <= 0) {
	            		$byLayer.msg('产品规格的促销价要大于0', 'warning');
	                    return;
	            	}
	            	if (!item.unitCost && item.unitCost != 0) {
	            		$byLayer.msg('请填写产品规格的成本价', 'warning');
	                    return;
	            	}
	            	if (item.unitCost <= 0) {
	            		$byLayer.msg('产品规格的成本价要大于0', 'warning');
	                    return;
	            	}
	            	if (!item.productNumber && item.productNumber !== 0) {
	            		$byLayer.msg('请填写产品规格的库存', 'warning');
	                    return;
	            	}
	            	if (item.productNumber < 0) {
	            		$byLayer.msg('产品规格的库存不能小于0', 'warning');
	                    return;
	            	}
	            }
            }      
	      
            if(!$scope.data.note) {
                $byLayer.msg('请填写描述', 'warning');
                return;
            }
            if(!$scope.data.logistics_template_id) {
                $byLayer.msg('请选择运费模板', 'warning');
                return;
            }
            
            console.log($scope.hotels);
            if($scope.data.prod_type == 1){
            	if($scope.hotels.length < 1) {
	                $byLayer.msg('请添加产品规格', 'warning');
	                return;
           		}
            	for (var i = 0; i < $scope.hotels.length; i++) {
	            	var item = $scope.hotels[i];
	            	if (!item.originUnitPrice) {
	            		$byLayer.msg('请填写产品规格的原价', 'warning');
	                    return;
	            	}
	            	if (!item.start_at) {
	            		$byLayer.msg('请填写开始时间', 'warning');
	                    return;
	            	}
	            	if (!item.end_at) {
	            		$byLayer.msg('请填写结束时间', 'warning');
	                    return;
	            	}
	            	if (!item.price && item.price != 0) {
	            		$byLayer.msg('请填写产品规格的促销价', 'warning');
	                    return;
	            	}
	            	if (item.price <= 0) {
	            		$byLayer.msg('产品规格的促销价要大于0', 'warning');
	                    return;
	            	}
	            	if (!item.unitCost && item.unitCost != 0) {
	            		$byLayer.msg('请填写产品规格的成本价', 'warning');
	                    return;
	            	}
	            	if (item.unitCost <= 0) {
	            		$byLayer.msg('产品规格的成本价要大于0', 'warning');
	                    return;
	            	}
	           }
            }
            
            $scope.data.attrTypeList = JSON.stringify($scope.prices);
            $scope.data.hotels = JSON.stringify($scope.hotels);
            $scope.data.pics = JSON.stringify($scope.tpics);
            $scope.data.prod_prop = '';
            $scope.data.is_sale = 0;
            $scope.data.product_addresses = JSON.stringify($scope.product_addresses);
            for(var i = 0; i < $scope.attrSelecteds.length; i++) {
                $scope.data.prod_prop += $scope.attrSelecteds[i];
                if($scope.attrSelecteds.length-1 > i) {
                    $scope.data.prod_prop += ',';
                }
            }
            
            if($scope.is_compose === 0) {
            	$scope.composeProducts = [];
            }
            
            $scope.data.composeProducts = JSON.stringify($scope.composeProducts);
            
            var index = $byLayer.loading();
            create($scope,$http,index);
        }
        
        $scope.is_show_message = false;
        // 消息提示
        $scope.showMessage = function() {
        	console.log(44);
        	$scope.is_show_message = true;
        }
        $scope.hideMessage = function() {
        	$scope.is_show_message = false;
        }
        
        // 产品规格的库存改变
        $scope.changeProductNumber = function() {
        	var prices = $scope.prices;
        	var storeAmount = 0;
        	for (var i = 0; i < prices.length; i++) {
        		var item = prices[i];
        		console.log(item);
        		if (!item.productNumber && item.productNumber !== 0) {
        			return;
        		} else {
        			storeAmount += parseInt(item.productNumber);
        		}
        	}
        	$scope.data.storeAmount = storeAmount;
        }
        // 改变酒店总库存
        $scope.changeProductNumberByHotels = function() {
        	var prices = $scope.hotels;
        	var storeAmount = 0;
        	for (var i = 0; i < prices.length; i++) {
        		var item = prices[i];
        		if (!item.product_number && item.product_number !== 0) {
        			return;
        		} else {
        			storeAmount += parseInt(item.product_number);
        		}
        	}
        	$scope.data.storeAmount = storeAmount;
        }
        
        //立即上架
        $scope.promptly = function () {
            if(!$scope.data.name) {
                $byLayer.msg('请输入标题', 'warning');
                return;
            }
            if(!$scope.data.supplier_id) {
                $byLayer.msg('请选择产品供应商', 'warning');
                return;
            }
            if(!$scope.data.suggestedRetailUnitPrice) {
                $byLayer.msg('请输入零售价', 'warning');
                return;
            }
            if(!$scope.data.logistics_template_id) {
                $byLayer.msg('请选择运费模板', 'warning');
                return;
            }
            if(!$scope.data.storeAmount) {
                $byLayer.msg('库存数不可为空', 'warning');
                return;
            }if(!$scope.data.warningValue) {
                $byLayer.msg('库存预警值不可为空', 'warning');
                return;
            }
            if($scope.tpics.length <= 0) {
                $byLayer.msg('至少上传一张产品图片', 'warning');
                return;
            }
            if($scope.saleAttrs.length > 0 && $scope.prices.length <= 0) {
                $byLayer.msg('请选择销售属性', 'warning');
                return;
            }
            if(!$scope.data.note) {
                $byLayer.msg('请填写描述', 'warning');
                return;
            }
            $scope.data.attrTypeList = JSON.stringify($scope.prices);
            $scope.data.pics = JSON.stringify($scope.tpics);
            $scope.data.prod_prop = '';
            $scope.data.is_sale = 1;
            for(var i = 0; i < $scope.attrSelecteds.length; i++) {
                $scope.data.prod_prop += $scope.attrSelecteds[i];
                if($scope.attrSelecteds.length-1 > i) {
                    $scope.data.prod_prop += ',';
                }
            }
            
            var index = $byLayer.loading();
            create($scope,$http,index);
        }
        //删除图片
        $scope.deleteImg = function (k) {
            $scope.tpics.splice(k, 1);
        }
        $scope.imgcloak = function (k) {
            document.getElementById('imagefile' + k).click();
        }
        //获取快递模板
        findLogisticsTemplateByShopId($scope,$http);
        //添加快递模板
        $scope.addLogistics=function(){
            window.open("#/addExpress");
        }
        //选择快递模板
        $scope.sellogistics=function(id){
            var logisticsinfo={};
            for(var i=0;i<$scope.findLogistics.length;i++){
                if($scope.findLogistics[i].id==id){
                    logisticsinfo=$scope.findLogistics[i];
                    i=$scope.findLogistics.length;
                }
            }
            logisticsinfo=logisticsinfo;
            if(logisticsinfo.payType==1){
                logisticsinfo.payname="件"
            }else  if(logisticsinfo.payType==2){
                logisticsinfo.payname="kg"
            }else  if(logisticsinfo.payType==3){
                logisticsinfo.payname="m³"
            }
            var typename="";
            for(var j=0;j<logisticsinfo.expressType.length;j++){
                var type=logisticsinfo.expressType[j].expressType;
                if(type==1){
                    typename="快递";
                } else if(type==2){
                    typename="EMS";
                } else if(type==3){
                    typename="平邮";
                }
                logisticsinfo.expressType[j].typename=typename;
            }
            $scope.logisticsinfo=logisticsinfo;
        }
        
        $scope.setStartDate = function(index){
        	$("input[name='act_start_time']").datetimepicker({
			language:'zh-CN',
			format:'yyyy-mm-dd',
	        weekStart: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
		}).on('changeDate', function(ev){
			    var time = ev.date.Format("yyyy-MM-dd");
			    $scope.hotels[index].start_at = time;
			});
        }
        
        $scope.setEndDate = function(index){
        	$("input[name='act_stop_time']").datetimepicker({
			language:'zh-CN',
			format:'yyyy-mm-dd',
	        weekStart: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
		}).on('changeDate', function(ev){
			    var time = ev.date.Format("yyyy-MM-dd");
			    $scope.hotels[index].end_at = time;
			});
        }
    }]);

	app.directive('defLaydate', function() {
		return {
		require: '?ngModel',
		restrict: 'A',
		scope: {
			ngModel:'='
　　　　	},
		　　　　link: function(scope, element, attr, ngModel) {
		　　　　　　var _date = null,_config={};
		　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
		　　　　　　_config = {
		　　　　　　　　lang: 'cn',
		　　　　　　　　elem: element[0],
		        	type: 'datetime',
		　　　　　　　　btns:['confirm'],
		　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM-dd',
		　　　　　　　　range: attr.range,
		　　　　　　　　done: function(value, date, endDate) {
		　　　　　　　　　　ngModel.$setViewValue(value);
		　　　　　　　　}
		　　　　　　};
		　　　　　　!!attr.typeDate && (_config.type = attr.typeDate);

		　　　　　　// 初始化
		　　　　　　 _date = laydate.render(_config);
		　　　　　　// 模型值同步到视图上
		　　　　　　ngModel.$render = function() {
		　　　　　　　　element.val(ngModel.$viewValue || '');
		　　　　　　};
		　　　　}
		　　};
	});