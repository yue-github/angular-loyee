/**
 * Created by admin on 2016/9/5.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyOrdersCtrl', ['$scope','$http', '$anchorScroll', '$location', '$rootScope', '$filter',function ($scope, $http, $anchorScroll, $location, $rootScope, $filter) {
        $anchorScroll();
        $scope.state=0;
        $scope.menu=0;
        $scope.data={};
        $scope.data.status=-1;
        $scope.data.orderTitle="全部订单";
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.orderCode = '';
        $scope.startTime = '';
        $scope.endTime;
        $scope.pages=[];
        $scope.orders = [];
        $scope.orderType = -1;
        $rootScope.navstate=5;
        
        $scope.is_show_search = false;
        $scope.select_order_status = -1;
        $scope.changeShowSearch = function() {
        	$scope.is_show_search = !$scope.is_show_search;
        	console.log($scope.is_show_search);
        }

        $scope.selectOrde=function(orderType){
            $scope.orderType=orderType;
            $scope.data.status=orderType;
            $scope.select_order_status = orderType;
            if(orderType==0){
                $scope.data.status=-1;
                $scope.data.orderTitle="全部订单";
            }else if(orderType==1){
                $scope.data.orderTitle="待付款订单";
            }else if(orderType==2){
                $scope.data.orderTitle="待发货订单";
            }else if(orderType==3){
                $scope.data.orderTitle="待收货订单";
            }else if(orderType==4){
                $scope.data.orderTitle="待评价订单";
            }else if(orderType==7){
                $scope.data.orderTitle="已完成订单";
            // }else if(orderType==6){
            //     $scope.data.orderTitle="已取消订单";
            }else{
                $scope.data.status=-1;
                $scope.data.orderTitle="全部订单";
            }
            getorder();
        }
        //取消订单的理由
        $scope.cancelReason=[
            {id:1,title:"我不想买了"},
            {id:2,title:"信息填写错误，重新拍"},
            {id:3,title:"卖家缺货"},
            {id:4,title:"付款遇到问题"},
            {id:5,title:"拍错了"},
            {id:6,title:"其他原因"},
        ];
        
        $scope.selectOrderStatus = function() {
        	$scope.search();
        }
        
        //搜索订单
        $scope.search=function(){
            $scope.data.page=1;
            $scope.pages=[];
            console.log("1="+$scope.startTime+","+$scope.endTime);
            $scope.data.startTime=$filter('date')($scope.startTime,'yyyy-MM-dd');
            $scope.data.endTime=$filter('date')($scope.endTime,'yyyy-MM-dd');
            $scope.data.order_code= $scope.orderCode;
            console.log("2="+$scope.data.startTime+","+$scope.data.endTime);
            getorder();
        }

        var getorder=function(){
            $http.post(baseUrl + 'pc/myOrders/myOrders',$scope.data).success(function (result) {
                if (result.error == 0) {
                    $scope.orders= result.orders;
                    $scope.super= 2;
                    var orderLength=$scope.orders.length;
                    for(var k=0;k<orderLength;k++){
                        if($scope.orders[k].status==2||$scope.orders[k].status==3){
                            $scope.orders[k].orderState=1;
                        }else{
                            $scope.orders[k].orderState=0;
                        }
                        
                        var status = $scope.orders[k].status;
                        if (status == 1) {
                        	$scope.orders[k].strStatus = "待支付";
                        } else if (status == 2) {
                        	$scope.orders[k].strStatus = "待发货";
                        } else if (status == 3) {
                        	$scope.orders[k].strStatus = "待收货";
                        } else if (status == 4) {
                        	$scope.orders[k].strStatus = "待评价";
                        } else if (status == 5) {
                        	$scope.orders[k].strStatus = "已评价";
                        } else if (status == 6) {
                        	$scope.orders[k].strStatus = "已取消";
                        } else if (status == 7) {
                        	$scope.orders[k].strStatus = "已完成";
                        }
                    }

                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                    console.log($scope.orders)
                    // 组合订单成一个 吴同岳-2019-11-27
                    $scope.orders = $scope.orders.map((i,index)=>{
                        if(i.productOrders.length > 1){
                            let product_name = i.productOrders.reduce((o,n)=>{
                                if(o instanceof Object){
                                    return o.product_name + '、' + n.product_name;
                                }
                                return o + '、' + n.product_name;
                            });
                            let actualUnitPrice = i.productOrders.reduce((o,n)=>{
                                if(o instanceof Object){
                                    return o.actualUnitPrice + n.actualUnitPrice;
                                }
                                return o + n.actualUnitPrice;
                            });
                            i.productOrders = [Object.assign({},i.productOrders.slice(0,1)[0],{product_name:product_name,actualUnitPrice:actualUnitPrice,unitOrdered:1,totalPrice:i.totalPayable})];
                        }else{
                            // 对单个订单（非组合）金额进行变值
                            i.productOrders[0].totalPrice = i.totalPayable;
                        }
                        return i;
                    })
                    console.log($scope.orders)
                }
            });

        }
        getorder();
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
            getorder();
        }
        //订单支付
        $scope.payOrder = function (id) {
            $http.post(baseUrl + 'pc/comfirmOrder/payOrder',{
                orderId:id
            }).success(function (result) {
            	console.log(JSON.stringify(result));
                if(result.error >0) {

                } else if(result.payType==1){
                    window.location.href="#/weixinPay?path="+result.payInfo+"&theSameOrderNum="+result.theSameOrderNum+"&orderId="+result.orderId+"&theType="+result.codeType;
                }else if(result.payType==2){
                    angular.element('.container').append(result.payInfo);
                }else if(result.payType==3){
                    document.write(result.payInfo);
                }
            });
        }
        //取消订单
        $scope.remove=function(id){
            $scope.orderId=id;
            $('#cancelForm').modal()
        }
        // 跳转页面
        $scope.skipPage = function(page, id) {
        	window.location.href = page + id;
        }

        $scope.cancelOrder=function(){
            if(!$scope.cancelReasonId){
                $byLayer.msg('请选择取消订单的理由！', 'failed');
                return false;
            }

            $http.post(baseUrl + 'pc/myOrders/cancel',{
                orderId:$scope.orderId
            }).success(function (result) {
                if(result.error >0) {
                	$byLayer.msg('取消订单失败', 'failed');
                }else{
                    $('#cancelForm').modal('hide');
                    $byLayer.msg('成功取消订单', 'success',function(){
                        getorder();
                    });
                }
            });
        }
        $scope.back = function (id) {
            window.location.href = '#/back?id=' + id;
        }

    }]);
