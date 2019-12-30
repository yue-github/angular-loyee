/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('RefundmanageCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.shopmenu=5;
        $scope.state=0;
        $scope.data={};
        $scope.refund=true;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        $scope.statuss=[
        	{'val':0,'name':'待审核'},
        	{'val':1,'name':'审核通过'},
        	{'val':2,'name':'审核不通过'},
        	{'val':3,'name':'退款成功'},
        	{'val':4,'name':'退款失败'},
    	];
        $scope.status = 0;
        $scope.shenhes=[
        	{'val':1,'name':'审核通过并打款'},
        	{'val':2,'name':'审核不通过'},
    	];
        var getbacks=function(){
            $http.post(baseUrl+'pc/refundManage/many',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                $scope.refunds=result.refunds;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                angular.forEach($scope.refunds,function (value, key) {
                    if(result.refunds[key].status == 0) {
                        $scope.refunds[key].status = '待审核';
                    }else if(result.refunds[key].status == 1) {
                        $scope.refunds[key].status = '审核通过';
                    }else if(result.refunds[key].status == 2) {
                        $scope.refunds[key].status = '审核不通过';
                    }else if(result.refunds[key].status == 3) {
                        $scope.refunds[key].status = '退款成功';
                    }else if(result.refunds[key].status == 4) {
                        $scope.refunds[key].status = '退款失败';
                    }
                });
                }
            });
        }
        
        $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });
        
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
                    $scope.status = $scope.data.status;
                    $scope.data.statusName = $scope.statuss[$scope.data.status].name;
                }
            });
        }
        //提交退款处理
        $scope.audit=function(){
        	var deliveryPrice = $scope.data.deliveryPrice;
        	var allowedDeliveryPrice = $scope.data.allowedDeliveryPrice;
        	if (deliveryPrice === '') {
        		alert('退款运费不能为空');
        		return;
        	}
        	if (deliveryPrice < 0) {
        		alert('退款运费不能小于0');
        		return;
        	}
        	if (deliveryPrice > allowedDeliveryPrice) {
        		alert('退款运费最多退'+allowedDeliveryPrice+'元');
        		return;
        	}
        	if (!$scope.data.status) {
        		alert("请选择是否同意退款");
        		return;
        	}
            var auditHandle = function () {
            	$http.post(baseUrl+'pc/refundManage/audit',$scope.data).success(function(result){
                    if(result.error > 0) {
                    	$byLayer.msg('审核失败', 'failed');
                    }else {
                       $byLayer.msg('成功', 'success');
                       window.location.reload();
                    }
                });
            }
            if ($scope.data.status == 2) {
            	auditHandle();
            } else {
            	if (confirm("审核通过后会直接打款回给用户，是否继续操作")==true) {
            		auditHandle();
            	}
            }
            $('#show-form').modal('hide');
        }
        //搜索
        $scope.searchref=function(){
        	angular.forEach($scope.data,function (value, key) {
                if($scope.data.status == '进行中') {
                	$scope.data.status = 0;
                }else if($scope.data.status == '审核通过') {
                	$scope.data.status = 1;
                }else if($scope.data.status == '审核不通过') {
                	$scope.data.status = 2;
                }else if($scope.data.status == '确认已退款') {
                	$scope.data.status = 3;
                }
            });
            getbacks();
        }

    }]);