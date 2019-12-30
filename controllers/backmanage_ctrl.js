/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('BackmanageCtrl',  ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.shopmenu=5;
        $scope.state=1;
        $scope.back=true;
        $scope.data={};
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.pages=[];
        $scope.statuss=[
        	{'val':0,'name':'待审核'},
        	{'val':1,'name':'审核通过'},
        	{'val':2,'name':'审核不通过'},
        	{'val':4,'name':'退款成功'},
        	{'val':5,'name':'退款失败'},
    	];
        $scope.status = 0;
        $scope.shenhes=[
        	{'val':1,'name':'审核通过并打款'},
        	{'val':2,'name':'审核不通过'},
    	];
        var getbacks=function(){
            $http.post(baseUrl+'pc/backManage/many',$scope.data).success(function(result){
                if(result.error == 0) {
                	$scope.refunds=result.list;
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                    for(var i=0;i<$scope.refunds.length;i++){
                        if($scope.refunds[i].status == 0) {
                            $scope.refunds[i].status = '待审核';
                        }else if($scope.refunds[i].status == 1) {
                            $scope.refunds[i].status = '审核通过';
                        }else if($scope.refunds[i].status == 2) {
                            $scope.refunds[i].status = '审核不通过';
                        }else if($scope.refunds[i].status == 3) {
                            $scope.refunds[i].status = '已收货';
                        }else if($scope.refunds[i].status ==4) {
                            $scope.refunds[i].status = '退款成功';
                        }else if($scope.refunds[i].status ==5) {
                            $scope.refunds[i].status = '退款失败';
                        }
                    }

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
            $http.post(baseUrl+'pc/backManage/get',$scope.data).success(function(result){
                if(result.error == 0) {
                    $scope.data=result.data;
                    $scope.status = $scope.data.status;
                    $scope.data.statusName = getStatusName($scope.data.status);
                }
            });
        }
        
        function getStatusName(status) {
        	if (status == 0) {
        		return '待审核';
        	} else if (status == 1) {
        		return '审核通过';
        	} else if (status == 2) {
        		return '审核不通过';
        	} else if (status == 4) {
        		return '退款成功';
        	} else if (status == 5) {
        		return '退款失败';
        	}
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
            	$http.post(baseUrl+'pc/backManage/audit',$scope.data).success(function(result){
                    if(result.error > 0) {

                    }else {
                        $byLayer.msg('退款处理成功', 'success');
                        location.reload();
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
            getbacks();
        }

    }]);