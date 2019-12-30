/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('CenterCtrl',  ['$scope','$location','$http', '$anchorScroll', '$rootScope', function ($scope, $location, $http, $anchorScroll, $rootScope) {
        $anchorScroll();
        $rootScope.navstate=5;
        var getInfo=function(){
            $http.post(baseUrl + 'pc/center/info').success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.info= result.info;
                    $rootScope.grade = $scope.info.grade;
                    // 获取优惠券数
                    let getMyCouponsCount=function(){
                        $http.post(baseUrl + 'pc/center/getMyCoupons',{offset:0,length:10000000}).success(function (result) {
                            $scope.couponCount = result.data.length;
                            $scope.info.couponAmount = $scope.couponCount;
                            let info = $scope.info;
                            $scope.info = info;
                        });
                    }
                    getMyCouponsCount();
                    // console.log($rootScope.grade);
                    $scope.info.headImg = $scope.getAbsolutePath($scope.info.headImg);
                }
            });
        }
        getInfo();
        
        $scope.skipPage = function(url, status) {
        	window.location.href=url;
        }
        
        $scope.tomyorder=function(){
            window.location.href="#/myOrders";
        }
        $scope.data={};
        $scope.data.status=1;
        $scope.data.page=1;
        $scope.data.pageSize=6;
        $scope.pages=[];
        $scope.shopCount = 0;
        $scope.couponCount = 0;
        // 解决购物车数据不对问题,显示购物车商品数量 @author:吴同岳
        let getCartAmount = function() {
			$http.post(baseUrl + 'pc/cart/getMyShoppingCart', $scope.data).success(function(result) {
                let shops = result.shops;
                let countArr = shops.filter(res=>{
                    return res.products.length != 0;
                });
                var shopCount = 0; 
               if(countArr.length>1){
                   shopCount = countArr.reduce((o,n)=>{
                        if(o instanceof number){
                            return o + n.products.length;
                        }else{
                            return o.products.length;
                        }
                    });
               }else if(countArr.length == 1){
                shopCount = countArr[0].products.length; 
               }
               $scope.shopCount = shopCount;
               console.log($scope.shopCount)
			});
        }
        getCartAmount();
        // 获取订单
        var getorder=function(){
            $http.post(baseUrl + 'pc/myOrders/myOrders',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.orders= result.orders;
                    $scope.pageLength=result.totalPages;
                    if($scope.pageLength<=1){
                        $scope.pages.push(1);
                    }else {
                        for (var i=0;i<$scope.pageLength;i++){
                            $scope.pages.push(i+1);
                        }
                    }
                }
            });

        }
        getorder();
        //我的账户余额
        $http.post(baseUrl+'pc/wallet/balance').success(function(result){
            if(result.error==0){
                $scope.walletAmount=result.balance;
            }else {

            }
        });
        $scope.applyCashOn=function(){
            //获取提现账号；
            $http.post(baseUrl+'pc/applyCashOn/myBankCardList').success(function(result){
                if(result.error==0){
                    $scope.myBankCardList=result.data;
                }else {

                }
            });
        }

        $scope.data1={};
        //提交提现申请
        $scope.submitCashon=function(){
            if(!$scope.data1.money){
                $byLayer.msg('提现金额不能为空', 'failed');
                return false;
            }
            if(!$scope.data1.money>0){
                $byLayer.msg('提现金额有误请核对再提交！', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.data1.money)){
                $byLayer.msg('提现金额有误请核对再提交', 'failed');
                return false;
            }
            if(!$scope.data1.accountType){
                $byLayer.msg('提现方式不能为空', 'failed');
                return false;
            }
            if($scope.data1.accountType==1){
                if(!$scope.data1.aplipayAccount){
                    $byLayer.msg('支付宝账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.data1.accountType==2){
                if(!$scope.data1.weixinAccount){
                    $byLayer.msg('微信账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.data1.accountType==3){
                if(!$scope.data1.bankCard_id){
                    $byLayer.msg('账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.data1.money>$scope.walletAmount){
                $byLayer.msg('账号余额不足！', 'failed');
                return false;
            }
            $http.post(baseUrl+'pc/applyCashOn/submit',$scope.data1).success(function(result){
                if(result.error==0){
                    $byLayer.msg('提交成功', 'success',function(){
                        $('#CashOnform').modal('hide');
                        getInfo();
                    });
                }else {

                }
            });
        }
        $scope.data3={};
        //提交充值信息applywallet
        $scope.recharge=function(){

            if(!$scope.data3.money){
                $byLayer.msg('充值金额不能为空', 'failed');
                return false;
            }

            if(!$scope.data3.money>0){
                $byLayer.msg('充值金额有误，请重新核对！', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.data3.money)){
                $byLayer.msg('请填写正确的金额', 'failed');
                return false;
            }
            if(!$scope.data3.event){
                $byLayer.msg('充值方式不能为空', 'failed');
                return false;
            }
            $('#walletform').modal('hide');
            $http.post(baseUrl+'pc/wallet/recharge',$scope.data3).success(function(result){
                if(result.error >0) {

                } else if(result.error==0){
                    $scope.data3={};
                    getInfo();
                    if(result.payType==4){
                        window.location.href="#/weixinPay?path="+result.payInfo;
                    }else if(result.payType==3){
                        angular.element('.container').append(result.payInfo);
                    }else if(result.payType==6){
                        document.write(result.payInfo);
                    }
                }
            });
        }

        //订单支付
        $scope.payOrder = function (id) {
            $http.post(baseUrl + 'pc/comfirmOrder/payOrder',{
                orderId:id
            }).success(function (result) {
                if(result.error >0) {

                } else if(result.payType==1){
                    window.location.href="#/weixinPay?path="+result.payInfo;

                }else if(result.payType==2){
                    angular.element('.container').append(result.payInfo);
                }else if(result.payType==3){
                        document.write(result.payInfo);        
                }else {
                    $byLayer.msg('支付成功', 'success',function(){
                        getorder();
                    });
                }
            });

        }
        //取消订单
        $scope.remove=function(id){
            $http.post(baseUrl + 'pc/myOrders/remove',{
                orderId:id
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('订单已取消', 'success',function(){
                        getorder();
                    });
                }
            });
        }

        //充值与提现取消
        $scope.clean=function(){
            $scope.data1={};
            $scope.data2={};
            $('#walletform').modal('hide');
            $('#CashOnform').modal('hide');
        }

        //获取银行卡
        $scope.getbankCard = function (id) {
            $scope.bankCardNumber = '123456789';
            $http.post(baseUrl + 'pc/center/getBankCard',{
                bankCardId:id
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.bankCardNumber = '**** **** **** ****'+result.data.accoutNumber;
                }
            });
        }

        //换一批商品
        $scope.changeALot=function(){
            getRecommendProductsByCustomer();
        }
        //客户行为推荐商品
        var getRecommendProductsByCustomer=function(){
            $scope.data={};
            $scope.data.row=4;
            $http.post(baseUrl + 'pc/product/getRecommendProductsByCustomer',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.recommentProducts=result.data;
                }
            });
        }
        getRecommendProductsByCustomer();
    }]);
