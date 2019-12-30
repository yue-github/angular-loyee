/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('shopExpressCtrl',['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.shopmenu=6;
        $scope.state=0;
        $scope.data={};
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];

        getlist($scope,$http,$scope.data);

        //修改
        $scope.edit=function(id){
            window.location.href="#/updateExpress?id="+id;
        }
        //删除
        $scope.delete=function(id){
            if(id){
                var con = $byLayer.confirm('确定要删除吗？',function(){
                    deleteLogisticsTemplate($scope,$http,id,con);
                    getlist($scope,$http,$scope.data);
                })

            }

        }
        //添加快递模板
        $scope.add=function(){
            window.location.href="#/addExpress";
        }
        
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
            $scope.data.offset=($scope.pageNumber-1)*$scope.data.length;
            getlist($scope,$http,$scope.data);
        }
    }]);
