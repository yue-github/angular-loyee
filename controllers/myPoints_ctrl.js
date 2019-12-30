/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute']).controller('MyPointsCtrl',['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        
       
        $scope.menu=4;
        $scope.state=0;
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=20;
        $scope.data.offset=0;
        $scope.pages=[];
        var goPointProduct=function(d){
            console.log(12121)
            window.location.href = `#/pointProduct?params=${d}`;
            location.reload();
        }
        //获取我的积分明细列表
        var getPoints=function(){
            $http.post(baseUrl+'pc/myPoints/many',$scope.data).success(function(result){
                if(result.error == 0) {
                    for(var i=0;i<result.data.length;i++){
                        if(result.data[i].source==9){
                            result.data[i].source="每日签到"
                        }else if(result.data[i].source==11){
                            result.data[i].source="评价商品";
                        }else if(result.data[i].source==5){
                            result.data[i].source="完善个人信息";
                        }else if(result.data[i].source==3){
                            result.data[i].source="新用户注册";
                        }else if(result.data[i].source==13){
                        	result.data[i].source="点击广告";
                        }else if(result.data[i].source==7){
                        	result.data[i].source="邀请好友注册成功一次";
                        }else if(result.data[i].source==15){
                        	result.data[i].source="分享活动链接";
                        }else if(result.data[i].source==17){
                        	result.data[i].source="购买特产类商品第三方支付";
                        }else if(result.data[i].source==20){
                        	result.data[i].source="购买特产类商品钱包支付";
                        }else if(result.data[i].source==23){
                        	result.data[i].source="购买旅游类产品第三方支付";
                        }else if(result.data[i].source==26){
                        	result.data[i].source="购买旅游类产品钱包支付";
                        }else if(result.data[i].source==31){
                        	result.data[i].source="抽奖";
                        }else if(result.data[i].source==29){
                        	result.data[i].source="取消订单";
                        }else if(result.data[i].source==40){
                        	result.data[i].source="退货";
                        }else if(result.data[i].source==41){
                        	result.data[i].source="退款";
                        }else if(result.data[i].source==42){
                        	result.data[i].source="通过积分兑换商品扣除";
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

        $http.post(baseUrl+'pc/myPoints/myPoint').success(function(result){
            if(result.error == 0) {
                $scope.totalPoint=result.data.pointAmount;
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
