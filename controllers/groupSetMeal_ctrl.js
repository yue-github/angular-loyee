/**
 * Created by admin on 2016/9/30.
 */

var app = angular.module('app', ['ngRoute', 'ngSanitize'])
    .controller('groupSetMealCtrl', ['$scope', '$location', '$http', '$sce', '$anchorScroll','$interval', function ($scope, $location, $http, $sce, $anchorScroll, $interval) {
        $anchorScroll();
        var productId = $location.search().id;
        $scope.data = "";
        $scope.hide = 'active';
        $scope.attrSelecteds = [];
        $scope.hours=0;
        $scope.minutes=0;
        $scope.seconds=0;
        $scope.address={};
        $scope.express={};
        $scope.address.id=productId;
        $scope.address.provinceId=19;
        $scope.address.provinceName="广东省";
        $scope.address.cityId=197;
        $scope.address.cityName="广州市";
        $scope.showIndex=0;
        //酒店入住相关数据
        $scope.startAt="";
        $scope.endAt="";
        $scope.price = 0;
        $scope.hotel= {};
        $scope.tempData="";
        
        $scope.Promotion = false;$scope.coupon = false;
        
        $scope.selshow=function(e){
            $scope.showIndex=e;
        }
        $scope.gotoTop = function () {
                $location.hash("top");
                $anchorScroll();
              };
        $scope.tabshide = function () {
            $scope.hide = 'active';
            $scope.show = '';
        }
        $scope.tabsshow = function () {
            $scope.show = 'active';
            $scope.hide = '';
        }
        //获取商品分类导航
//        getcategory($scope,$http,productId);
        //获取商品信息
        getProductInfo($scope,$http,productId,$sce);

       // $scope.time=1000;
       // var max_num=$scope.time;
       // var setTime=function(){
       //     $scope.time=$scope.time-1;
       //     var h=(Array(2).join('0') + Math.floor($scope.time/3600)).slice(-2);
       //     var m=(Array(2).join('0') + Math.floor(($scope.time%3600)/60)).slice(-2);
       //     var s=(Array(2).join('0') + Math.floor(($scope.time%60))).slice(-2);
       //     $scope.hours=h;
       //     $scope.minutes=m;
       //     $scope.seconds=s;
       // };
       // if(max_num>0){
       //     $interval(setTime, 1000, max_num);
       // }
        //获取促销活动信息
        getPromInfoByProductId($scope,$http,productId)
		getCouponByProductId($scope,$http,productId)
        //跳转活动详情
        $scope.toPromotion=function(id,type){
            window.open("#/miaosha?id="+id+"&type="+type);
        }
        //获取商品销售属性
//        getAttrs($scope,$http,productId)

        $scope.productReviewData={};
        $scope.productReviewData.id=productId;
        $scope.productReviewData.offset=1;
        $scope.productReviewData.length=20;
        $scope.pages=[];
        //获取商品评论
        productReview($scope,$http,$scope.productReviewData);
        //分页加载数据
        $scope.setpages=function(k,n){
            if(n==0){
                var page_num= $scope.productReviewData.page+k;
                if(page_num>0&&$scope.productReviewData.page<$scope.pagelength){
                    $scope.productReviewData.page=page_num;
                }else if(page_num>=$scope.pagelength){
                    $scope.productReviewData.page=$scope.pagelength;
                }else{
                    $scope.productReviewData.page=1;
                }
            }else {
                var pagenum=k;
                $scope.productReviewData.page=pagenum;
            }
            $scope.pages=[];
            productReview($scope,$http,$scope.productReviewData);
        }
        //获取商品店铺信息
        getShop($scope,$http,productId)

        $scope.setamount = function (n) {
            var amount = parseInt($scope.amount)+parseInt(n);
            if(amount>0){
                $scope.amount = amount;
            }else{
                $scope.amount = 1;
            }
        }
        //判断是否全部属性选择中
        var isAllSelected = function () {
            if( $scope.saleAttrs){
                for(var i = 0; i < $scope.saleAttrs.length; i++){
                    if (!$scope.attrSelecteds[i]) {
                        return $scope.saleAttrs[i];
                    }
                }
                return true;
            }
        }

        //选择table
        $scope.showstyle="height: 100%;border-bottom-color: red;";
        $scope.hidestyle="height: 100%;";
        $scope.selActive=function(type){
            if(type){
                $scope.showflog=1;
            }else{
                $scope.showflog=0;
            }
        }
        //加载地址信息获取所有省市
        provinces($scope,$http);

        //根据省id获取该省份的所有城市
        $scope.getCity=function(id,name){
            if(id){
                $scope.address.provinceId=id;
                $scope.address.provinceName=name;
                $scope.address.cityName="";
            }
            if($scope.address.provinceId){
                getCityData($scope,$http,$scope.address);
            }
        }
        $scope.getCity()
        //根据商品id、省id、市id查询快递模板
        $scope.getTemplate=function(id,name) {
            if (id) {
                $scope.address.cityId = id;
                $scope.address.cityName = name;
            }
            if ($scope.address.cityId) {
                getTemplates($scope, $http, $scope.address)

            }
        }
        $scope.getTemplate();
        //判断是否全部属性选完提示
        var validateSelcet=function(){
            var flag = isAllSelected();
            if($scope.saleAttrs){
                if (flag !== true) {
                    $byLayer.msg('请选择' + flag.propertyName,'failed');
                    return false;
                }
                return true;
            }else{
                return true;
            }
        }
        //选择销售属性
        $scope.selectAttr = function (k, v) {
            $scope.attrSelecteds[k] = v;
            var flag = isAllSelected();
            if (flag === true) {
                getPrice($scope,$http,productId);
            }
        }
        //加入购物车
        $scope.shoppingCart = function () {
        	if ($scope.product.is_sale == 0 || $scope.product.isDelete == 1) {
        		$byLayer.msg('该商品已下架，请继续浏览其他商品！','failed');
        		return;
        	}
            if(!$scope.priceId){
                $scope.priceId=0;
            }
            if($scope.product.storeAmount<1){
                $byLayer.msg('库存不足','failed');
                return false;
            }
            if($scope.product.storeAmount<$scope.amount){
                $byLayer.msg('库存不足','failed');
                return false;
            }
            if(validateSelcet()==true){
                addCart($scope,$http,productId,$scope.amount,$scope.priceId);
            }
        }
        //立即购买
        $scope.comfirmOrder = function () {
        	if ($scope.product.expire_status == -1) {
        		$byLayer.msg('活动还没开始', 'failed');
        		return;
        	} else if ($scope.product.expire_status == 1) {
        		$byLayer.msg('活动已结束', 'failed');
        	} else {
        		window.location.href = "#/comfirmOrder?order_type=3&group_set_meal_id=" + $scope.product.id;
        	}
        }
        //收藏商品
        $scope.collectionProduct = function () {
            collection($scope,$http,productId);
        }

        //收藏店铺
        $scope.collectionshop = function (id) {
            collectionShopA($scope,$http,id)
        }
        //进入店铺
        $scope.toshop = function (id,type) {
        	window.open("shopindex.html#/index?id="+id);
//          if(type===3){
//              window.location.href = "#/home";
//          }else{
//              window.open("shopindex.html#/index?id=" + id);
//          }
        }
        //客户行为推荐商品
        $scope.data={};
        $scope.data.row=7;
        getRecommendProductsByCustomer($scope,$http,$scope.data);
        //换一批商品
        $scope.changeALot=function(){
            getRecommendProductsByCustomer($scope,$http,$scope.data);
        }
        //test
        $scope.test=function(){
            alert("套餐搭配功能还在开发中");
        }
        //显示快递模板的收货地址
        $scope.showType=0;
        $scope.showAddress=function(type){
            if(type==1){
                $scope.showType=0;
            }else {
                $scope.showType=1;
            }
        }
        //去商品详情
        $scope.toproduct=function(id){
            window.open('#product?id='+id);
        }
      	
         //datetimePicker日期时间控件
 		$scope.startimepicker = function () {
	       //根据ID绑定input框  最后选中的日期也显示在input框中
	     	var end = $scope.endAt;
		    $('#startHour').datetimepicker({
			language:'zh-CN',
			format:'yyyy-mm-dd',
	        weekStart: 1,
			autoclose: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			startDate: new Date(),
			
	    }).on('changeDate', function(ev){
	    	var time = ev.date.Format("yyyy-MM-dd");
	    	$scope.startAt = time;
	    	var temp = addDate(ev.date);
			$('#endHour').datetimepicker('setStartDate', temp);
			if($scope.endAt){
				$scope.hotel.startAt = time;
            	$scope.hotel.endAt = $scope.endAt;
            	$scope.hotel.id = productId;
				getHotelPrice($scope,$http,$scope.hotel);
			}
		});
		}
 		
 		$scope.endtimepicker = function () {
 			
		     var temp = addDate(new Date());
		     $('#endHour').datetimepicker({
			      	language:'zh-CN',
					format:'yyyy-mm-dd',
			        weekStart: 1,
					autoclose: 1,
					startView: 2,
					minView: 2,
					forceParse: 0,
					startDate:temp
			    }).on('changeDate', function(ev){
			    	var preDate  = new Date(ev.date.getTime() - 24*60*60*1000)
			    	$('#startHour').datetimepicker('setEndDate', preDate);
			    	var time = ev.date.Format("yyyy-MM-dd");
			    	$scope.endAt = time;
	            	if($scope.startAt){
	            		$scope.hotel.startAt = $scope.startAt;
		            	$scope.hotel.endAt = time;
		            	$scope.hotel.id = productId;
						getHotelPrice($scope,$http,$scope.hotel);
	            	}
				});
 			
		}
 		// 日期，在原有日期基础上，增加days天数，默认增加1天
 		function addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }

        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        function getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return '';
            }

            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }

            return re;
        }

    }]);
