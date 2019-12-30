/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('Order_Ctrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        var id=$location.search().id;
        $scope.type=$location.search().type;

        $scope.emptyPage=1;
        $scope.orderState6=0;
        $scope.data={};
        $scope.data.orderId=id;
        var getorder=function(){
            $http.post(baseUrl + 'pc/myOrders/get', {
                id:id
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.data.payType=result.order.payType;
                    if(result.order.status==6){
                        $scope.orderState6=1;
                    }
                    if(result.order.status>=1&&result.order.status!=6){
                        $scope.state1=true;
                    }else {
                        $scope.state1=false;
                    }
                    if(result.order.status>=2&&result.order.status!=6){
                        $scope.state2=true;
                    }else {
                        $scope.state2=false;
                    }
                    if(result.order.status>=3&&result.order.status!=6){
                        $scope.state3=true;
                    }else {
                        $scope.state3=false;
                    }
                    if(result.order.status>=4&&result.order.status!=6){
                        $scope.state4=true;
                    }else {
                        $scope.state4=false;
                    }
                    if(result.order.status==5||result.order.status==7){
                        $scope.state5=true;
                    }else {
                        $scope.state5=false;
                    }

                    //1: 微信支付, 2: 支付宝, 3银联支付, 4余额支付
                    if(result.order.payType==1){
                        result.order.payType="微信支付";
                    }else if(result.order.payType==2){
                        result.order.payType="支付宝支付";
                    }else if(result.order.payType==3){
                        result.order.payType="银联支付";
                    }else if(result.order.payType==4){
                        result.order.payType="余额支付";
                    }else if(result.order.payType==5){
                        result.order.payType="团购卡支付";
                    }else if(result.order.payType==6){
                        result.order.payType="积分兑换";
                    }
                    $scope.order= result.order;
                    $scope.customer= result.customer;

                    //1: 待付款,2: 待发货,3: 待收货,4: 待评价,5: 已评价,6: 已取消, 7订单完成
                    switch($scope.order.status){
                        case 1:$scope.order.status="待付款";
                            break;
                        case 2:$scope.order.status="待发货";
                            break;
                        case 3:$scope.order.status="待收货";
                            break;
                        case 4:$scope.order.status="待评价";
                            break;
                        case 5:$scope.order.status="已评价";
                            break;
                        case 6:$scope.order.status="订单已关闭";
                            break;
                        case 7:$scope.order.status="订单完成";
                            break;
                    }
                }
            });
        }
        getorder();
        $http.post(baseUrl + 'pc/logisticsDetails/logisticsDetail', {
            orderId:id
        }).success(function (result) {
            if(result.error >0) {

            } else {
                var length=result.detail.length;
                if(result.detail){
                    if(length>0){
                        $scope.emptyPage=1;
                    }else{
                        $scope.emptyPage=0;
                    }
                }
                for(var i=0;i<length;i++){
                    if(i==0){
                        result.detail[i].typenum=1;
                    }else if(i==length-1){
                        result.detail[i].typenum=2;
                    }else{
                        result.detail[i].typenum=0;
                    }
                }
                $scope.dataDetail= result;

            }
        });

        $scope.toProduct=function(id){
           window.open('#/product?id=' + id);
        }

        //选择支付方式
        $scope.paytype=function(type){
        	 $scope.data.payType=type;
//          if(type==3){
//              $byLayer.msg('银联支付待开发中', 'failed');
//              $scope.data.payType=1;
//          }else {
//              $scope.data.payType=type;
//          }
        }
        //取消修改
        $scope.clean=function(){
            getorder();
            $('#updatePay').modal('hide');
        }

        //提交修改
        $scope.submit=function(){
            $http.post(baseUrl + 'pc/myOrders/editPaytype',$scope.data).success(function (result) {
              if(result.error==0){
                  $byLayer.msg('保存成功', 'success',function(){
                      $('#updatePay').modal('hide');
                      getorder();
                  });
              }
            });
        }
    }]);
