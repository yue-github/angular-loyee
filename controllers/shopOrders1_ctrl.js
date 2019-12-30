/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ShopOrders1Ctrl',['$scope','$http','$anchorScroll','$location', '$filter', function ($scope, $http, $anchorScroll, $location, $filter) {
        $anchorScroll();
        $scope.shopmenu=2;
        $scope.state=1;
        $scope.data={};
        $scope.data.status=1;
        $scope.data.code="";
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.data.timeType='';
        //1下单时间，2支付时间，3发货时间，4收货时间，5取消订单时间
        $scope.timeTypes=[
            {id:1,name:'下单时间'},
            //{id:2,name:'支付时间'},
            //{id:3,name:'发货时间'},
            //{id:4,name:'收货时间'},
            //{id:5,name:'取消订单时间'},
        ];
        $scope.pages=[];
        var getorders=function(){
            $http.post(baseUrl + 'pc/shopOrders/many',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.orders= result.orders;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);

                    angular.forEach($scope.orders,function (value, key) {
                        if(result.orders[key].status == 1) {
                            $scope.orders[key].status = '待付款';
                        }else if(result.orders[key].status == 2) {
                            $scope.orders[key].status = '待发货';
                        }else if(result.orders[key].status == 3) {
                            $scope.orders[key].status = '待收货';
                        }else if(result.orders[key].status == 4) {
                            $scope.orders[key].status = '已收货';
                        }else if(result.orders[key].status == 5) {
                            $scope.orders[key].status = '已评价';
                        }else if(result.orders[key].status == 6) {
                            $scope.orders[key].status = '订单已取消';
                        }else if(result.orders[key].status == 7) {
                            $scope.orders[key].status = '已评价';
                        }
                    });
                }
            });
        }
        getorders();

        $scope.data.code="";
        //搜索订单
        $scope.search=function(){
            $scope.data.page=1;
            $scope.pages=[];
            $scope.data.startTime=$filter('date')($scope.data.startTime,'yyyy-MM-dd h:mm:ss');
            $scope.data.endTime=$filter('date')($scope.data.endTime,'yyyy-MM-dd h:mm:ss');

            getorders();
        }

        $scope.data.id="";
        //获取要发货的订单id
        $scope.setorderId=function(id){
            $scope.data.id=id;
        }
        $scope.data.deliveryCompany="";
        $scope.data.trackingNumber="";
        //提交发货信息
        $scope.sendOut=function(){
            $http.post(baseUrl + 'pc/shopOrders/sendOut',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    alert('发货成功！');
                    location.reload();
                }
            });
        }



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
            getorders();
        }
        //导出excel表k值为1：导出订单信息，2：导出快递信息
        $scope.filter={};
        $scope.export=function(){
            if($scope.data.startTime){
                $scope.filter.startTime=$filter('date')($scope.data.startTime,'yyyy-MM-dd h:mm:ss');
            }
            if($scope.data.endTime){
                $scope.filter.endTime=$filter('date')($scope.data.endTime,'yyyy-MM-dd h:mm:ss');
            }
            if($scope.data.timeType){
                $scope.filter.timeType=$scope.data.timeType;
            }
            if($scope.data.order_code){
                $scope.filter.order_code=$scope.data.order_code;
            }
            $http.post(baseUrl + 'pc/shopOrders/exportOrders2?status=1',$scope.filter ).success(function (result) {
                if(result.error >0) {
                    alert(result.errmsg);
                } else {
                    window.open(result.path);
                }
            });
        }
    }]);