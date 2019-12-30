/**
 * Created by admin on 2016/9/5.
 */

var app = angular.module('app', ['ngRoute'])
    .controller('MyOrders3Ctrl', ['$scope','$http', '$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.state=3;
        $scope.menu=0;
        $scope.data={};
        $scope.data.status=3;
        $scope.data.orderTitle="待收货订单";
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        var getorder=function(){
            $http.post(baseUrl + 'pc/myOrders/myOrders',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.orders= result.orders;
                    var orderLength=$scope.orders.length;
                    for(var k=0;k<orderLength;k++){
                        if($scope.orders[k].status==2||$scope.orders[k].status==3){
                            $scope.orders[k].orderState=1;
                        }else{
                            $scope.orders[k].orderState=0;
                        }
                    }
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
        $scope.back = function (id) {
            window.location.href = '#/back?id=' + id;
        }
    }]);
