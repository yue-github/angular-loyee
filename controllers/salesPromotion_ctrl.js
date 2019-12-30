/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('SalesPromotionCtrl', ['$scope','$http','$anchorScroll','$location','$filter', function ($scope, $http, $anchorScroll, $location, $filter) {
        $anchorScroll();
        $scope.menustate=6;
        $scope.addForm=function(){
            $scope.formTitle="添加";
        }
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        $scope.data.minPurchaseAmount=0;

        $scope.appliedTo = [
            {id: 1,name: '订单'},
            {id: 2,name: '所有产品购买'},
            {id: 3,name: '特定产品购买'}
        ];

        $scope.conditions = [
            {id: 1,name: '无条件折扣'},
            {id: 2,name: '达到最低额时折扣'},
        ];
        $scope.cashOrPercentageDiscount =[
            {id: 1,name: '现金'},
            {id: 2,name: '折扣'},
        ];


        var getPromotion=function(){
            $http.post(baseUrl+'pc/salesPromotion/many',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.many=result.data;
                    var length=result.data.length;
                    for(var i=0;i<length;i++){
                        if(result.data[i].cashOrPercentageDiscount==1){
                            result.data[i].cashOrPercentageDiscount="现金";
                        }else if(result.data[i].cashOrPercentageDiscount==2){
                            result.data[i].cashOrPercentageDiscount="折扣";
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
        getPromotion();

        //保存优惠活动
        $scope.submit=function(){
            var url="";
            if($scope.data.id){
                url="pc/salesPromotion/edit";
            }else{
                url="pc/salesPromotion/create";
            }
            var data = angular.copy($scope.data);
            data.startTime = $filter('date')($scope.data.startTime,'yyyy-MM-dd');
            data.endTime = $filter('date')($scope.data.endTime,'yyyy-MM-dd');
            data.basedOn = $scope.data.appliedTo;

            $http.post(baseUrl+url,data).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('保存成功', 'success', function () {
                        $('#addsalesForm').modal('hide');
                        $scope.data.pageNumber=1;
                        $scope.pages=[];
                        getPromotion();

                    })
                }
            });
        }
        $scope.update=function(id){
            console.log(1234)
            $scope.data={};
            $scope.formTitle="修改";
            $http.post(baseUrl+'pc/salesPromotion/get',{id:id}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.data=result.data;


                }
            });
        }
        //删除活动
        $scope.delete=function(id){
            var ids=[];
            ids.push(JSON.stringify(id));
            $scope.data.ids=JSON.stringify(ids);
            $http.post(baseUrl+'pc/salesPromotion/delete', $scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('删除成功', 'success', function () {
                        $scope.data.pageNumber=1;
                        $scope.pages=[];
                        getPromotion();
                    })
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
            getPromotion();
        }
      
    }]);