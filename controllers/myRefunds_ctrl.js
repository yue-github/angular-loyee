/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyRefundsCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.menu=9;
        $scope.data={};
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        $scope.statuss=[
        	{'val':0,'name':'待审核'},
        	{'val':1,'name':'审核通过'},
        	{'val':2,'name':'审核不通过'},
        	{'val':3,'name':'退款成功'}
    	];
        
        var getbacks=function(){
            $http.post(baseUrl+'pc/back/getRefunds',$scope.data).success(function(result){
                if (result.error == 0) {
                	$scope.refunds=result.data;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
	                angular.forEach($scope.refunds,function (value, key) {
	                    if($scope.refunds[key].status == 0) {
	                        $scope.refunds[key].status = '待审核';
	                    }else if($scope.refunds[key].status == 1) {
	                        $scope.refunds[key].status = '审核通过';
	                    }else if($scope.refunds[key].status == 2) {
	                        $scope.refunds[key].status = '审核不通过';
	                    }else if($scope.refunds[key].status == 3) {
	                        $scope.refunds[key].status = '退款成功';
	                    }
	                });
                }
            });
        }
        getbacks();
        
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
            getbacks();
        }

        $scope.data.id="";
        //获取退款信息
        $scope.getrefund=function(id){
            $scope.data.id=id;
            $http.post(baseUrl+'pc/refundManage/get', $scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.data=result.data;
                }
            });
        }
        
        //搜索
        $scope.searchref=function(){
            getbacks();
        }

    }]);