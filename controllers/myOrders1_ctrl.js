/**
 * Created by admin on 2016/9/5.
 */

var app = angular.module('app', ['ngRoute'])
    .controller('MyOrders1Ctrl', ['$scope','$http', '$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.state=1;
        $scope.menu=0;
        $scope.data={};
        $scope.data.status=1;
        $scope.data.orderTitle="待付款订单";
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];

        //取消订单的理由
        $scope.cancelReason=[
            {id:1,title:"我不想买了"},
            {id:2,title:"信息填写错误，重新拍"},
            {id:3,title:"卖家缺货"},
            {id:4,title:"付款遇到问题"},
            {id:5,title:"拍错了"},
            {id:6,title:"其他原因"},
        ];


        var getorder=function(){
            $http.post(baseUrl + 'pc/myOrders/myOrders',$scope.data).success(function (result) {
                if(result.error >0) {

                }else{
                    $scope.orders= result.orders;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
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
                if(result.error >0) {

                } else if(result.payType==1){
                    window.location.href="#/weixinPay?path="+result.payInfo;

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
