/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ShopCashCtrl', ['$scope','$http','$anchorScroll','$location', '$filter', function ($scope, $http, $anchorScroll, $location, $filter) {
        $anchorScroll();
        $scope.menustate=5;
        $scope.data = {};
        $scope.cash = {};
        $scope.product = {};
        $scope.shop = {};
        $scope.data.page = 1;
        $scope.data.pageSize = 10;

        $scope.basedOnName = [
            {id: 1,name: '订单'},
            {id: 2,name: '所有产品购买'},
            {id: 3,name: '所有服务购买'},
            {id: 4,name: '特定产品购买'},
            {id: 5,name: '特定服务购买'},
        ];

        $scope.conditionsName = [
            {id: 1,name: '无条件折扣'},
            {id: 2,name: '达到最低额时折扣'},
        ];

        var appliedToMap = {
            1:'订单',
            2:'所有产品购买',
            3:'所有服务购买',
            4:'特定产品购买',
            5:'特定服务购买',
        };

        var conditionsMap = {
            1:'无条件折扣',
            2:'达到最低额时折扣'
        };

        var is_useMap = {
            0:'未使用',
            1:'已使用'
        }

        $scope.pages=[];
        //获取优惠券列表
      var getmany=function(){
          $http.post(baseUrl + 'pc/shopCash/many',$scope.data).success(function (result) {
              if(result.error >0) {

              } else {
                  $scope.coupons = result.coupons;
                  $scope.pageLength=result.totalPages;
                  if($scope.pageLength<=1){
                      $scope.pages.push(1);
                  }else {
                      for (var i=0;i<$scope.pageLength;i++){
                          $scope.pages.push(i+1);
                      }
                  }
              }
          });
      };

        getmany();

        //分页加载数据
        $scope.setpages=function(k,n){
            if(n==0){
                var page=$scope.data.page;
                var pagenum=page+k;
                if(pagenum>$scope.pageLength){
                    $scope.data.page=$scope.pageLength;
                }else if(pagenum<1){
                    $scope.data.page=1;
                }else {
                    $scope.data.page=pagenum;
                }
                getmany();
            }else {
                var pagenum=k;
                $scope.data.page=pagenum;
                getmany();
            }
        }

        //点击商品按钮加载优惠券的商品
        $scope.check = function (id) {
            $scope.current = id;
            $http.post(baseUrl + 'pc/shopCash/getCashProduct',{
                id:id,
                page:1
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.product.product_list = result.model.list;
                }
            });
        }
        /**
         * 获取所有可用分类
         * @param pageNumber
         * @param pageSize
         * @return 成功：{error: 0,data:[id:分类id,name:分类名称,mainPic:分类主图]}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.Products={};
        $scope.Products.pageNumber=1;
        $scope.Products.pageSize=10;

        $http.post(baseUrl + 'pc/shopCoupons/getProducts',$scope.Products).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.productName = result.products;
            }
        });

        $scope.shopProduct = function () {
            //$scope.getProduct();
            $http.post(baseUrl + 'pc/shopCoupons/createCouponProduct',{
                product_id:$scope.shop.product_id,
                coupon_id:$scope.current,
                coupon_type:2,
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    alert('添加成功');
                    location.reload();
                }
            });
        }
        //加载店铺所有商品
        $scope.delete_product = function (id) {
            $http.post(baseUrl + 'pc/shopCoupons/deleteCouponProduct', {
                id:id
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    alert('删除成功');
                    location.reload();
                }
            });
        }

        //记载优惠券的信息
        $scope.details = function (id) {
            $http.post(baseUrl + 'pc/shopCash/getCustomerCash',{
                id:id,
                page:1
            }).success(function (result) {
                if(result.error >0) {

                } else {
                    for(var i = 0; i < result.customerCoupons.length; i++) {
                        result.customerCoupons[i].is_used = is_useMap[result.customerCoupons[i].is_used];
                    }
                    $scope.customerCoupons = result.customerCoupons;
                }
            });
        }


        $scope.add = function () {
            $scope.data = {};
        }

        //编辑时加载优惠券的信息
        $scope.get = function (id) {
            $http.post(baseUrl + 'pc/shopCash/get',{id:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    if(result.coupon.depositTime) {
                        result.coupon.depositTime = new Date(result.coupon.depositTime);
                    }
                    if(result.coupon.expirationTime) {
                        result.coupon.expirationTime = new Date(result.coupon.expirationTime);
                    }
                    $scope.data = result.coupon;
                }
            });
        }

        //保存
        $scope.save=function(){
            var data = angular.copy( $scope.data);
            if(data.cashTitle == null || data.cashTitle == '') {
                alert('现金券名称不能为空');
                return false;
            }

            if(data.basedOn == null || data.basedOn == '') {
                alert('折扣券适用范围');
                return false;
            }

            if(data.conditions == null || data.conditions == '') {
                alert('折扣券适用条件');
                return false;
            }

            if(data.percentageDiscount == null || data.percentageDiscount == '') {
                alert('折扣优惠');
                return false;
            }

            if(data.depositTime == null || data.depositTime == '') {
                alert('折扣券存入时间');
                return false;
            }

            if(data.expirationTime == null || data.expirationTime == '') {
                alert('折扣券失效时间');
                return false;
            }
            data.appliedTo = data.basedOn;
            data.depositTime = $filter('date')(data.depositTime,'yyyy-MM-dd');
            data.expirationTime = $filter('date')(data.expirationTime,'yyyy-MM-dd');
            if(data.conditions == 1) {
                data.minPurchaseAmount = 0;
            }

            if($scope.data.id){
                $http.post(baseUrl + 'pc/shopCash/update', data).success(function (result) {
                    if(result.error >0) {

                    } else {
                        alert('修改成功');
                        location.reload();
                    }
                });
            }else {
                $http.post(baseUrl + 'pc/shopCash/create', data).success(function (result) {
                    if(result.error >0) {

                    } else {
                        alert('保存成功');
                        location.reload();
                    }
                });
            }
        }

        $scope.sendCash = function (id) {
            $http.post(baseUrl + 'pc/shopCoupons/get',{id:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    if(result.coupon.depositTime) {
                        result.coupon.depositTime = new Date(result.coupon.depositTime);
                    }
                    if(result.coupon.expirationTime) {
                        result.coupon.expirationTime = new Date(result.coupon.expirationTime);
                    }
                    $scope.cash.couponTitle = result.coupon.cashTitle;
                }
            });
            $scope.cashs_save = function () {
                $http.post(baseUrl + 'pc/shopCash/createCustomerCash',{
                    id:id,
                    amount:$scope.cash.amount,
                }).success(function (result) {
                    if(result.error >0) {

                    } else {
                        alert('生成优惠券成功');
                        location.reload();
                    }
                });
            }
        }

        $scope.delete = function (id) {
            $http.post(baseUrl + 'pc/shopCash/delete',{id:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    alert('删除成功');
                    location.reload();
                }
            });
        }
    }]);