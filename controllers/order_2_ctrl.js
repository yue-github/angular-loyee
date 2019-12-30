/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('Order_2_Ctrl',  ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        var order_id=$location.search().id;
        $http.post(baseUrl + 'pc/myOrders/get', {
            id:order_id
        }).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.order= result.order;
            }
        });

        $scope.comfirmGet = function () {
        	layer.confirm('是否确认收货', {
    		    btn: ['确定','取消'] //按钮
    		}, function(){
    			$http.post(baseUrl + 'pc/myOrders/comfirmGet', {
                    id:order_id
                }).success(function (result) {
                    if(result.error == 0) {
                    	$byLayer.msg('确认收货成功', 'success',function(){
                            window.location.href = '#/myOrders';
                        });
                    } else {
                    	$byLayer.msg('确认收货失败');
                    }
                });
    		}, function(){
    			
    		});
        }
    }]);
