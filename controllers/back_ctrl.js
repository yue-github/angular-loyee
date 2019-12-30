/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
    .controller('BackCtrl', ['$scope', '$location', '$http', 'Upload', '$anchorScroll', function ($scope, $location, $http, Upload, $anchorScroll) {
        $anchorScroll();
        $scope.tpics = [];
        $scope.show='';
        $scope.hide='';
        $scope.showback=function(){
            $scope.hide='active';
            $scope.show='';
            $scope.tpics = [];

        }

        $scope.hideback=function(){
            $scope.show='active';
            $scope.hide='';
            $scope.tpics = [];
        }
        
        var productId=$location.search().id;
        $scope.data = {};
        $scope.data.isGeted=0;
        $scope.data.productOrderId=productId;
        $scope.refund = {};

        $http.post(baseUrl + 'pc/back/getOrder',{
            id:productId
        }).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.order = result.order;
                if ($scope.order.status == 2) {
                	$scope.show = 'active';
                } else if ($scope.order.status == 3 || $scope.order.status == 4) {
                	$scope.hide = 'active';
                }
            }
        });

        $http.post(baseUrl + 'pc/back/getProductOrder',{
            productOrderId:productId
        }).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.productOrder = result.productOrder;
                // $scope.productOrder.allowApplyCash = 1000;
                $scope.productOrder.allowApplyCash = result.productOrder.totalActualDeliveryCharge;
                $scope.data.refundAmount=$scope.productOrder.unitOrdered;
                $scope.data.refundCash=$scope.productOrder.allowApplyCash;
                // 退款金额
                $scope.refund.refundCash=$scope.productOrder.allowApplyCash;
                console.log($scope.productOrder);
            }
        });

        //上传图片
        $scope.upload = function (file, k) {
            if (file) {
                var index = $byLayer.loading();
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    if(k === -1) {
                        $scope.tpics.push(resp.data.path);
                    } else {
                        $scope.tpics[k] = resp.data.path;
                    }
                    $byLayer.close(index);
                }, function (resp) {
                }, function (evt) {
                });
            }
        };
        var isGeteds0=[
            {id:1,name:'未按约定时间发货'},
            {id:2,name:'空包裹/少货'},
            {id:3,name:'拍错了/不想要了'},
            {id:4,name:'商品已过期/已变质'},
            {id:5,name:'退运费'},
            {id:6,name:'其他'},
        ]
        var isGeteds1=[
            {id:1,name:'收到商品少件/破损/污渍等'},
            {id:2,name:'假冒品牌'},
            {id:3,name:'商品及商品本身的外包装严重损坏'},
            {id:4,name:'商品已过期/已变质'},
            {id:5,name:'商品数量/重量不符'},
            {id:6,name:'卖家发错货'},
            {id:7,name:'退运费'},
            {id:8,name:'其他'},
        ]

        $scope.isGeteds=isGeteds0;

        //选择是否收到货
        $scope.setisGeted=function(type){
            if(type){
                $scope.data.isGeted=1;
                $scope.isGeteds=isGeteds1;
            }else{
                $scope.data.isGeted=0;
                $scope.isGeteds=isGeteds0;
            }
        }

        //提交退货申请
        $scope.submitBack = function () {
            $scope.data.refundAmount=$scope.productOrder.unitOrdered;
            $scope.data.couponDiscount=$scope.productOrder.couponDiscount;

            if(!$scope.data.reason){
                $byLayer.msg('请选择退货原因', 'failed');
                return false;
            }

            if(!$scope.data.refundAmount){
                $byLayer.msg('请填写退货数量', 'failed');
                return false;
            }
            if(!$scope.data.refundCash){
                $byLayer.msg('请填写退货金额', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.data.refundCash)){
                $byLayer.msg('请填写正确的金额', 'failed');
                return false;
            }

            if($scope.data.refundCash>$scope.productOrder.allowApplyCash){
                $byLayer.msg('退货金额不能超过订单总额！', 'failed');
                return false;
            }
            if(!$scope.data.note){
                $byLayer.msg('请输入退货说明', 'failed');
                return false;
            }
            $scope.data.reason=$scope.data.reason.name;
            $scope.data.pics=JSON.stringify($scope.tpics);

            $http.post(baseUrl + 'pc/back/submitBack',$scope.data).success(function (result) {
                if(result.error >0) {
                	$byLayer.msg("申请失败", 'failed');
                }else if(result.error==0){
                    $byLayer.msg('申请成功', 'success', function () {
                        window.location.href = '#/myBacks';
                    })
                }else{
                    $byLayer.msg(result.errmsg, 'failed');
                }
            });
        }

        //提交退款申请
        $scope.refund.productOrderId=productId;
        $scope.submitRefund = function () {
            $scope.refund.refundAmount=$scope.productOrder.unitOrdered;
            $scope.refund.couponDiscount=$scope.productOrder.couponDiscount;
            if(!$scope.refund.reason){
                $byLayer.msg('请选择退款原因', 'failed');
                return false;
            }
            if(!$scope.refund.refundCash){
                $byLayer.msg('请填写退款金额', 'failed');
                return false;
            }
            if(!$scope.refund.note){
                $byLayer.msg('请输入退款说明', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.refund.refundCash)){
                $byLayer.msg('请填写正确的金额', 'failed');
                return false;
            }
            if($scope.refund.refundCash>$scope.productOrder.allowApplyCash){
                $byLayer.msg('退款金额不能超过订单总额！', 'failed');
                return false;
            }

            $scope.refund.pics=JSON.stringify($scope.tpics);
            $http.post(baseUrl + 'pc/back/submitRefund', $scope.refund).success(function (result) {
                if(result.error >0) {
                	$byLayer.msg('申请失败', 'failed');
                }else if(result.error==0){
                    $byLayer.msg('申请成功', 'success', function () {
                        window.location.href = '#/myRefunds';
                    });
                }else{
                    $byLayer.msg(result.errmsg, 'failed');
                }
            });
        }

        //删除图片
        $scope.deleteImg = function (k) {
            $scope.tpics.splice(k, 1);
        }
        $scope.imgcloak = function (k) {
            document.getElementById('imagefile' + k).click();
        }
        $scope.imgcloaka = function (k) {
            document.getElementById('imagefilea' + k).click();
        }
    }]);
