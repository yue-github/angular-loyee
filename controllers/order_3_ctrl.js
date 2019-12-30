/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
    .controller('Order_3_Ctrl',['$scope','$http','$anchorScroll','$location','Upload', function ($scope, $http, $anchorScroll, $location, Upload) {
        $anchorScroll();
        var order_id=$location.search().id;
        $scope.score1_1 = [];
        $scope.score1_0 = [{value:1},{value:2},{value:3},{value:4},{value:5}];

        $scope.score2_1 = [];
        $scope.score2_0 = [{value:1},{value:2},{value:3},{value:4},{value:5}];

        $scope.score3_1 = [];
        $scope.score3_0 = [{value:1},{value:2},{value:3},{value:4},{value:5}];

        $scope.score1 = 0;
        $scope.score2 = 0;
        $scope.score3 = 0;

        $scope.ratings = function (t, v) {
            if(t == 1) {
                $scope.score1 = v;
                $scope.score1_1 = [];
                $scope.score1_0 = [];
                for(var i = 0; i < v; i++) {
                    $scope.score1_1.push({value:i+1});
                }

                for(var i = v; i < 5; i++) {
                    $scope.score1_0.push({value:i+1});
                }
            } else if(t == 2) {
                $scope.score2 = v;
                $scope.score2_1 = [];
                $scope.score2_0 = [];
                for(var i = 0; i < v; i++) {
                    $scope.score2_1.push({value:i+1});
                }

                for(var i = v; i < 5; i++) {
                    $scope.score2_0.push({value:i+1});
                }
            } else if(t == 3) {
                $scope.score3 = v;
                $scope.score3_1 = [];
                $scope.score3_0 = [];
                for(var i = 0; i < v; i++) {
                    $scope.score3_1.push({value:i+1});
                }

                for(var i = v; i < 5; i++) {
                    $scope.score3_0.push({value:i+1});
                }
            }

        }
        $scope.tpics = [];
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

        $scope.data={};
        $http.post(baseUrl + 'pc/back/getProductOrder', {
            productOrderId:order_id
        }).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.order= result.productOrder;
                $scope.data.productId=result.productOrder.product_id;
                $scope.data.orderId=result.productOrder.order_id;
            }
        });
        $scope.data.comment="";
        $scope.data.productOrderId=order_id;
        $scope.submit=function(){
            $scope.data.imgs=JSON.stringify($scope.tpics);
            $scope.data.ratings=$scope.score1_1.length;     //获取合作态度；
            $scope.data.ratings2=$scope.score2_1.length;       //获取服务质量
            $scope.data.ratings3=$scope.score3_1.length;
            if(!$scope.data.comment){
                $byLayer.msg('评论内容不能为空', 'failed',function(){
                    return false;
                });
            }
            $http.post(baseUrl + 'pc/comment/submit', $scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('提交成功', 'success',function(){
                        window.location.href='#/myOrders';
                    });
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

    }]);
