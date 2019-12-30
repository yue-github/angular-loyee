/**
 * Created by admin on 2016/9/5.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyRefundCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.state=7;
        $scope.menu=0;
        $scope.data={};
        $scope.data.pageNumber=1;
        $scope.data.pageSize=5;
        $scope.pages=[];
        //$scope.data.status=-1;
       var getMyRefund=function(){
           $http.post(baseUrl + 'pc/back/getRefunds', $scope.data).success(function (result) {
               if(result.error >0) {

               } else {
                   $scope.orders= result.data;
                   //分页
                   var pagelength=result.totalPage;
                   $scope.pagelength=pagelength;
                   var totailpages1=$scope.data.pageNumber+5;
                   if($scope.data.pageNumber<=5&&pagelength<10){
                       for(var i=0;i<pagelength;i++){
                           $scope.pages.push(i+1);
                       }
                   }else if(pagelength<10){
                       for(var i=0;i<pagelength;i++){
                           $scope.pages.push(i+1);
                       }
                   }else if($scope.data.pageNumber<=5&&pagelength>10){
                       for(var i=0;i<10;i++){
                           $scope.pages.push(i+1);
                       }
                   }else if($scope.data.pageNumber>5&&pagelength>totailpages1){
                       for(var i=$scope.data.pageNumber-4;i<$scope.data.pageNumber+6;i++){
                           $scope.pages.push(i);
                       }
                   }else if($scope.data.pageNumber>6&&pagelength<totailpages1){
                       for(var i=$scope.data.pageNumber-((pagelength-$scope.data.pageNumber)+4);i<pagelength;i++){
                           $scope.pages.push(i+1);
                       }
                   }
                   angular.forEach($scope.orders, function (value, item) {
                       if($scope.orders[item].status == 0 ){
                           $scope.orders[item].status = '提交申请中';
                       }else if($scope.orders[item].status == 1) {
                           $scope.orders[item].status = '店家已同意';
                       }else if($scope.orders[item].status == 2) {
                           $scope.orders[item].status = '店家已拒绝';
                       }else if($scope.orders[item].status == 3) {
                           $scope.orders[item].status = '店家已退款';
                       }
                   });
               }
           });
       }
        getMyRefund();

        //分页加载数据
        $scope.setpages=function(k,n){
            if(n==0){
                var page_num= $scope.data.pageNumber+k;
                if(page_num>0&&$scope.data.pageNumber<$scope.pagelength){
                    $scope.data.pageNumber=page_num;
                }else if(page_num>=$scope.pagelength){
                    $scope.data.pageNumber=$scope.pagelength;
                }else{
                    $scope.data.pageNumber=1;
                }
            }else {
                var pagenum=k;
                $scope.data.pageNumber=pagenum;
            }
            $scope.pages=[];
            getMyRefund();
        }
    }]);
