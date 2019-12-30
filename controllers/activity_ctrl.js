/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('activityCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.data={};
        $scope.data.promotionId=$location.search().id;
        $scope.data.id=$location.search().id;
        $scope.data.pageNumber=1;
        $scope.data.pageSize=100;
        /**
         * 获取某个活动的所有流程产品
         * @param promotionId
         * @return 成功：{error:0,data:[{id:id,title:位置id,image:位置图片,products:[{id:id,name:产品名称,mainPic:产品主图},...]},...]}
         */
        getPositionProductWithPromotion($scope,$http,$scope.data);

        /**
         * 获取促销优惠券列表
         * @param promotionId 活动id
         * @return 成功：{error:0,data:[{id:id,title:优惠券标题},...]}
         */
        getmanyPromCoupon($scope,$http,$scope.data);

        /**
         * 领取优惠券
         * @param token
         * @param couponId 优惠券id
         * @return 成功：{error: 0,error:-1(优惠券已被领取完)}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.submitCoupon=function(id){
            drawCustomerCoupon($scope,$http,id,$scope.data);
        }
        /**
         * 查看促销活动
         * @param id 促销活动id
         * @return 成功：{error: 0 Promotion:{id,promotionTitle:促销标题,promotionDescription:促销说明,startTime:开始时间,endTime:结束时间}}；失败：{error: >0, errmsg: 错误信息}
         */
        getactivity($scope,$http,$scope.data);

    }]);
