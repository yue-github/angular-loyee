/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyCurrencyCtrl',['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menu=6;
        $scope.state=0;
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=20;
        $scope.data.offset=0;
        $scope.pages=[];
        //获取我的通币明细列表
        var getPoints=function(){ 
            $http.post(baseUrl+'pc/customerGold/myGoldList',$scope.data).success(function(result){
                if(result.error == 0) {
                    for(var i=0;i<result.data.length;i++){
                        if(result.data[i].source==18){
                            result.data[i].source="购买特产类商品第三方支付"
                        }else if(result.data[i].source==21){
                            result.data[i].source="购买特产类商品钱包支付";
                        }else if(result.data[i].source==24){
                            result.data[i].source="购买旅游类产品第三方支付";
                        }else if(result.data[i].source==27){
                            result.data[i].source="购买旅游类产品钱包支付";
                        }else if(result.data[i].source==39){
                        	result.data[i].source="取消订单";
                        }else if(result.data[i].source==40){
                        	result.data[i].source="退货";
                        }else if(result.data[i].source==41){
                        	result.data[i].source="退款";
                        }
                    }
                    $scope.points=result.data;

                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                }else if (result.error > 0) {

                }
            });
        }
        getPoints();
        // 获取通币
        $scope.myGoldListOne = 0;
        // 根据token获取通币数
		$scope.data.offset = 0;
		$scope.data.length = 10;
        $http.post(baseUrl + 'pc/customerGold/goldAmount', $scope.data).success(function(result) {
        	if(result) {
                $scope.myGoldListOne = result.goldAmount;
                if(result.goldAmount<0){
                    $scope.myGoldListOne = 0;
                }
        	}
	
			//$scope.goldDiscount = result.goldDiscount;
		});
        $http.post(baseUrl+'pc/customerGold/goldAmount').success(function(result){
            if(result.error == 0) {
                $scope.goldAmount=result.goldAmount.goldAmount;
            }else if (result.error > 0) {

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
            $scope.data.offset=($scope.pageNumber-1)*$scope.data.length;
            getPoints();
        }
    }]);
