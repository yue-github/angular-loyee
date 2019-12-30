/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyGrowValueCtrl',['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menu=7;
        $scope.state=0;
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=20;
        $scope.data.offset=0;
        $scope.pages=[];
        //获取我的成长值明细列表
        var getPoints=function(){
            $http.post(baseUrl+'pc/customerGrowth/myGrowthList',$scope.data).success(function(result){
                if(result.error == 0) {
                    for(var i=0;i<result.data.length;i++){
                        if(result.data[i].source==4){
                            result.data[i].source="注册"
                        }else if(result.data[i].source==6){
                            result.data[i].source="完善个人信息";
                        }else if(result.data[i].source==8){
                            result.data[i].source="邀请好友注册成功一次";
                        }else if(result.data[i].source==10){
                            result.data[i].source="每日签到";
                        }else if(result.data[i].source==12){
                            result.data[i].source="评论商品";
                        }else if(result.data[i].source==14){
                            result.data[i].source="点击广告";
                        }else if(result.data[i].source==36){
                            result.data[i].source="评论被管理员置顶前五";
                        }else if(result.data[i].source==16){
                            result.data[i].source="分享活动链接";
                        }else if(result.data[i].source==19){
                            result.data[i].source="购买特产类商品第三方支付";
                        }else if(result.data[i].source==22){
                            result.data[i].source="购买特产类商品钱包支付";
                        }else if(result.data[i].source==25){
                            result.data[i].source="购买旅游类产品第三方支付";
                        }else if(result.data[i].source==28){
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

        $http.post(baseUrl+'pc/customerGrowth/growthAmount').success(function(result){
            if(result.error == 0) {
                $scope.growthAmount=result.growthAmount;
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
