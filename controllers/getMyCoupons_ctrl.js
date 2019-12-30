/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('GetMyCouponsCtrl', ['$scope','$location','$http','$anchorScroll', function ($scope,$location, $http, $anchorScroll) {
        $scope.data={}
        $scope.menu=3;
        $scope.state=0;
        $scope.productId = $location.search().productId;
        $scope.couponList = JSON.parse($location.search().couponList);
        $scope.coupons=[
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id:4,
            //     isUsed: 1,
            //     isGeted:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // },
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id: 5,
            //     isUsed: 1,
            //     isGeted:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // },
            // {
            //     baseOn: 1,
            //     code: "b60deb59-3eb5-417a-b1bc-7a3c4b58dda2",
            //     couponId: 49,
            //     created_at: "2017-03-02 00:31:58",
            //     customerId: 84,
            //     description: "",
            //     endDate: "2017-03-26 00:00:00",
            //     full: 100,
            //     id: 6,
            //     isUsed: 1,
            //     isGeted:0,
            //     phone: null,
            //     scope: 1,
            //     shopId: 1,
            //     shopName: "驿伴自营店",
            //     startDate: "2017-03-01 00:00:00",
            //     title: "满100减10",
            //     type: 2,
            //     updated_at: "2017-03-02 00:31:58",
            //     useTime: "2017-03-02 09:56:26",
            //     value: 10
            // }
        ];
        let toTimeStamp = res=>{
            return new Date(res.split(' ')[0].replace(/-/g,'/')).getTime();
        }
        // 请求获取数据
        $http.post(baseUrl + 'pc/coupon/productCoupons', {productId: $scope.productId}).success(function (result) {
            console.log(result);
            if (result.error > 0) {
            } else {
               // 筛选过期
                $scope.coupons = result.data.map(res=>{
                    if(res.type==1){
						if(res.value>100)
							res.value = 100;
							res.value = parseInt(res.value/10)
					}
                   let stampDis = new Date().getTime() - toTimeStamp(res.endDate);
                   res.isPass=stampDis > 0?true:false;
                    return res;
                });
                // 优惠券增加样式
				for (var i=0,l = $scope.coupons.length;i<l;i++){
					$scope.coupons[i].class="coupon1";
				}
            }
        });
        
        $scope.backProduct=function(){
            window.location.href="#/product?id="+$scope.productId;
        };
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
        for (var i=0;i<$scope.coupons.length;i++){
            $scope.coupons[i].class="coupon1";
        }
        $scope.screen=function(){
            $http.post(baseUrl + 'pc/center/getMyCoupons',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    for (var i=0;i<$scope.coupons.length;i++){
                        $scope.coupons[i].class="coupon1";
                    }
                    // $scope.coupons=
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
        // 获取个人的会员等级
        $scope.vip_name = '大众会员';
        $http.post(baseUrl + 'pc/center/info').success(function (result) {
            if(result.error >0) {

            } else {
                $scope.vip_name = result.info.grade?result.info.grade:'大众会员';
            }
        })
        // 点击领取操作 @author:吴同岳
        $scope.getCoupon = function(index){
        // 会员等级必须达到一定条件才可以优先领取 目前设计规则为大众会员必须等候一天才可领取，等级高的可优先领取
            if((new Date().getTime() - toTimeStamp($scope.coupons[index].startDate)) < 86400000&&$scope.vip_name == '大众会员'){
                $byLayer.msg('您会员等级未达到一定条件需静候一天才可领取优惠券哦！','failed');
                return false;
            }
            if($scope.coupons[index].isGeted == 1){
                $byLayer.msg('优惠券已领取，不能重复领取');
                return false;
            }
            let data = {
                couponId:$scope.coupons[index].id
            };
            // 此接口为点击领取时调用的接口-》此用户需新增一个优惠券，若之前没领取过这个优惠券
            $http.post(baseUrl + 'pc/coupon/saveCoupon',data).success(function (result) {
                console.log(result);
                if(result.error == 0){
                    $byLayer.msg('优惠券领取成功！','success');
                    setTimeout(res=>{
                        location.reload();
                    },1500)
                }else{
                    $byLayer.msg('优惠券领取失败！','failed');
                }
                
            });
            
        }
    }]);
