/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ShopCouponsCtrl', ['$scope','$http','$anchorScroll','$location','$filter', '$timeout', function ($scope, $http, $anchorScroll, $location, $filter, $timeout) {
        $anchorScroll();
        $scope.shopmenu=3;
        $scope.data = {};
        $scope.data1 = {};
        $scope.data5 = {};
        $scope.coupon = {};
        $scope.product = {};
        $scope.shop = {};
        $scope.basedOnName = [
            {id: 1,name: '全部订单'},
            {id: 2,name: '特定商品'}
        ];
        $scope.typeName = [
            {id: 1,name: '折扣券'},
            {id: 2,name: '现金券'}
        ];

        $scope.scopeName = [
            //{id: 1,name: '全平台'},
            {id: 2,name: '本店铺可用'},
        ];


        $scope.CouponProduct={};

        $scope.pageNumber=1;
        $scope.data.length=8;
        $scope.data.offset=0;
        $scope.data5.length=8;
        $scope.data5.offset=0;
        $scope.data1.type = 1;
        $scope.pages=[];
        getmany($scope,$http,$scope.data5);
        
        $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });

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
            $scope.data5.offset=($scope.pageNumber-1)*$scope.data5.length;
            getmany($scope,$http,$scope.data5);
        }
        /**【明细】 分页点击事件
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
			$scope.Customer.pageNumber = k;
			manyCustomerCoupon($scope,$http,$scope.Customer);
		}
		/**【商品】 分页点击事件
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
			$scope.manyCouponProduct.pageNumber = k;
			getManyCouponProduct($scope,$http,$scope.manyCouponProduct);
		}
        /**
         * 获取优惠券产品列表
         * @param id 优惠券id
         * @param pageNumber 页码
         * @param pageSize 每页条数
         * @return 成功：{error: 0, data:[{id:id,couponId:优惠券id,type:类型(1分类，2产品),ojectId:相关id,name:产品或分类名称,mainPic:图片},...]}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.current=0;
        $scope.manyCouponProduct={};
        $scope.manyCouponProduct.pageNumber=1;
        $scope.manyCouponProduct.pageSize=10;
        $scope.manyCouponProduct.totalPage=1;
        $scope.manyCouponProduct.id=0;
        $scope.product.product_list=[];
        $scope.check = function(id,type){
            if(type==1){
        		$scope.manyCouponProduct.pageNumber=1;
                $scope.manyCouponProduct.pageSize=6;
                $scope.manyCouponProduct.totalPage=1;
                $scope.product.product_list=[];
            }
            $scope.current = id;
            $scope.manyCouponProduct.id=id;
            getManyCouponProduct($scope,$http,$scope.manyCouponProduct);
        }

        //加载更多产品
        $scope.getmanyCouponProduct=function(){
            if( $scope.manyCouponProduct.pageNumber< $scope.manyCouponProduct.totalPage){
                $scope.manyCouponProduct.pageNumber=$scope.manyCouponProduct.pageNumber+1;
                $scope.check($scope.manyCouponProduct.id);
            }else{
                $byLayer.msg('已经加载完，没有更多商品！', 'failed');
            }
        }

        /**
         * 获取该店铺所有可用产品
         * @param pageNumber
         * @param pageSize
         * @return 成功：{error: 0,data:[id:产品id,name:产品名称,suggestedRetailUnitPrice:指导价格]}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.data2={};
        $scope.getProducts={};
        $scope.data2.pageNumber=1;
        $scope.data2.pageSize=10;
        
        $scope.getProducts.totalPage=0;
        $scope.products=[];
        $scope.shopProductName = "";
		$scope.getshopProducts = function(){
			$scope.data2.pageNumber=1;
        	$scope.data2.pageSize=10;
			$scope.data2.couponId = $scope.current;
			$scope.data2.shopProductName = $scope.shopProductName;
            $scope.products=[];
            getshopProducts($scope,$http,$scope.data2);
        }

        $scope.getPageProducts=function(){
            if($scope.data2.pageNumber<$scope.getProducts.totalPage){
            	$scope.data2.couponId = $scope.current;
                $scope.data2.pageNumber=$scope.data2.pageNumber+1;
                getshopProducts($scope,$http,$scope.data2);
            }else{
                $byLayer.msg('已经加载完，没有更多商品！', 'failed');
            }
        }

        //选择商品
        $scope.selProductId=function(i){
            if($scope.products[i].isSelect==1){
                $scope.products[i].isSelect=0;
            }else{
                $scope.products[i].isSelect=1;
            }
        }

        $scope.shopProduct=function(){
            var objectId=[];
            var length=$scope.products.length;
            for(var i=0;i<length;i++){
                if($scope.products[i].isSelect==1){
                    objectId.push($scope.products[i].id);
                }
            }
            batchCreateCouponProduct($scope,$http,$scope.current,objectId.join());
        }

        /**
         * 删除优惠券产品
         * id 优惠券适用产品id
         */
        $scope.delete_product = function (id) {
            deleteCouponProduct($scope,$http,id);
        }


        /**
         * 获取会员优惠券列表
         * id 优惠券id
         * pageNumber 页码
         * pageSize 每页条数
         * @return 成功：{error: 0,recordsTotal：记录数 totalPage: 总页数, customerCoupons:[{id,...}...]}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.Customer={};
        $scope.Customer.pageNumber=1;
        $scope.Customer.pageSize=8;
        $scope.customerCoupons = [];
        $scope.getCustomerCoupon = {};
        $scope.getCustomerCoupon.totalPage = 0;
        var is_useMap = {
            0:'未使用',
            1:'已使用'
        }
        /**
         * 优惠券明细
         * @param {Object} id
         */
        $scope.details = function (id) {
            $scope.Customer.id=id;
            $scope.Customer.pageNumber=1;
            $scope.customerCoupons = [];
            manyCustomerCoupon($scope,$http,$scope.Customer);
        }
         /**
         * 获取更多优惠券用户
         */
       	$scope.getPageCustomerCoupons=function(){
            if($scope.Customer.pageNumber<$scope.getCustomerCoupon.totalPage){
            	$scope.Customer.couponId = $scope.current;
                $scope.Customer.pageNumber=$scope.Customer.pageNumber+1;
                manyCustomerCoupon($scope,$http,$scope.Customer);
            }else{
                $byLayer.msg('已经加载完，没有更多用户！', 'failed');
            }
        }

        //全选
        $scope.chkAll=function(c){
            if(c==true){
                for(var i=0;i<$scope.products.length;i++){
                    $scope.products[i].checked=true;
                }
            }else {
                for(var i=0;i<$scope.products.length;i++){
                    $scope.products[i].checked=false;
                }
            }

        }

        //获取选中的id数组
        var getselect=function(){
            var ids=[];
            for(var i=0;i<$scope.products.length;i++){
                if($scope.products[i].checked==true){
                    ids .push(JSON.stringify($scope.products[i].id));
                }
            }
            $scope.data.ids=JSON.stringify(ids);
        }
        /**
         * 删除用户优惠券
         * id 用户优惠券id
         * @return 成功：{error: 0, error:-1(该用户优惠券已被使用，不能删除)}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.deleteCustomerCoupon=function(id,c_id){
           deleteCustomerCoupon($scope,$http,id,c_id);
        }

        $scope.add = function () {
            $scope.data = {};
        }

        $scope.get = function (id) {
        	
            getShopCoupons($scope,$http,id);
        }
        /**
         * 创建优惠券
         * token 帐户访问口令（必填）
         * title 优惠券名称
         * baseOn 产品适用范围(1全订单，2特定产品)
         * scope 适用范围(1全平台，2自己店铺可用)
         * full 最低金额
         * value 折扣
         * startDate 优惠券存入时间
         * endDate 失效时间
         * type 类型（1优惠券，2现金券）
         * description 描述 选填
         * amount 优惠券数量
         * @return 成功：{error: 0}；失败：{error: >0, errmsg: 错误信息}
         */

        /**
         * 修改优惠券
         * token 帐户访问口令（必填）
         * id 优惠券id
         * title 优惠券名称
         * baseOn 产品适用范围(1全订单，2特定产品)
         * scope 适用范围(1全平台，2自己店铺可用)
         * full 最低金额
         * value 折扣
         * startDate 优惠券存入时间
         * endDate 失效时间
         * type 类型（1优惠券，2现金券）
         * description 描述 选填
         * amount 优惠券数量
         * @return 成功：{error: 0}；失败：{error: >0, errmsg: 错误信息}
         */

        $scope.save=function(){
        
            $scope.data.startDate=$("input[name='act_start_time']").val();
            $scope.data.endDate=$("input[name='act_stop_time']").val();
            var data = angular.copy( $scope.data);
            if(!data.type){
            	$byLayer.msg('请选择优惠券类型', 'failed');
                return false;
            }
            if(!data.title) {
                $byLayer.msg('优惠券名称不能为空', 'failed');
                return false;
            }

            if(!data.baseOn) {
                $byLayer.msg('请选择产品适用范围', 'failed');
                return false;
            }

            if(!data.scope) {
                $byLayer.msg('优惠券适用范围不可为空', 'failed');
                return false;
            }
            if(data.full<=0){
            	$byLayer.msg('享有折扣的最低购买金额不可小于0', 'failed');
                return false;
            }
            if(!data.full) {
                $byLayer.msg('享有折扣的最低购买金额不可为空', 'failed');
                return false;
            }
            if(data.value<=0){
            	$byLayer.msg('折扣优惠不可小于0', 'failed');
                return false;
            }
            if(!data.value) {
                $byLayer.msg('折扣优惠不可为空', 'failed');
                return false;
            }
            if(!data.startDate) {
                $byLayer.msg('折扣优惠开始时间不可为空', 'failed');
                return false;
            }
            if(!data.endDate) {
                $byLayer.msg('折扣优惠结束时间不可为空', 'failed');
                return false;
            }
            if(data.amount<=0) {
                $byLayer.msg('折扣优惠数量不可小于0', 'failed');
                return false;
            }
            if(!data.amount ) {
                $byLayer.msg('折扣优惠数量不可为空', 'failed');
                return false;
            }
            data.startDate = $filter('date')(data.startDate,'yyyy-MM-dd HH:mm:ss');
            data.endDate = $filter('date')(data.endDate,'yyyy-MM-dd HH:mm:ss');
            var url='';
            if($scope.data.id){
                url=baseUrl+'pc/coupon/updateCoupon';
            }else {
                url=baseUrl+'pc/coupon/createCoupon';
            }
            
            submitShopCoupons($scope,$http,data,url);
        }

        /**
         * 删除优惠券  -单个删除
         * id 优惠券id
         */
        $scope.deleteCoupon = function (id) {
        	$byLayer.confirm("确定删除优惠券吗？", function() {
        		deleteShopCoupons($scope,$http,id);
            });
        }


    }]);