/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyCouponsCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $scope.data={}
        $scope.menu=3;
        $scope.state=0;

        /**
         * 获取我的优惠券
         * @param token
         * @param pageNumber
         * @param pageSize
         * @param isTimeOut (0未过期，1已过期, -1所有)
         * @return 成功：{error: 0, totalPage:总页数,  data: [{id:id, title:折扣券标题, full:最低购买金额, value:折扣, isUsed:是否已使用，startDate:开始时间, endDate:结束时间},...]}  失败：{error: >0, errmsg:错误信息}
         */
        $scope.pages=[];
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.data.isTimeOut=-1;
        // 转换时间戳
        let toTimeStamp = res=>{
            return new Date(res.split(' ')[0].replace(/-/g,'/')).getTime();
        }
        $scope.screen=function(){
            $http.post(baseUrl + 'pc/center/getMyCoupons',$scope.data).success(function (result) {
                console.log(result)
                if(result.error >0) {

                } else {
                    for (var i=0;i<result.data.length;i++){
                        let stampDis = new Date().getTime() - toTimeStamp(result.data[i].endDate);
                        result.data[i].isTimeOut=stampDis > 0?1:0;
                        if(result.data[i].type==1){
                            if(result.data[i].value>100)
                                result.data[i].value = 100;
                                result.data[i].value = parseInt(result.data[i].value/10)
                        }
                        if(result.data[i].isTimeOut==0&&result.data[i].isUsed==0){
                            result.data[i].class="coupon1";
                        }else if(result.data[i].isUsed==1){
                            result.data[i].class="coupon2";
                        }else{
                            result.data[i].class="coupon3";
                        }
                    }
                    $scope.coupons= result.data;

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
        $scope.screen();

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
            $scope.screen();
        }
    }]);
