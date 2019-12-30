var app = angular.module('app', ['ngRoute', 'oc.lazyLoad', 'ngCookies']);
app.factory('requestInterceptor', ['$log', '$location', '$cookies', function($log, $location, $cookies){
    var requestInterceptor = {
        request: function(config){
            if(config.method == 'POST') {
                if(config.data === undefined) {
                    config.data = {};
                }

                config.data.token = $cookies.get('token');

                if (config.url.indexOf('admin/file/upload') < 0) {
                    config.data = $.param(config.data);
                }
            }

            return config;
        }
    };
    return requestInterceptor;
}]);
app.factory('responseInterceptor', ['$log', '$cookies','$rootScope', function($log, $cookies, $rootScope) {
    var responseInterceptor = {
        response: function(config){
            if(config.data.error === 3) {
                $cookies.remove('token');
                $cookies.remove('cookiesName');
                $cookies.remove('cookiesShopid');
                $rootScope.logined=false;
                window.location.href = '#/login';
            }
            return config;
        }
    };
    return responseInterceptor;
}]);


app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('requestInterceptor');
    $httpProvider.interceptors.push('responseInterceptor');
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
        $routeProvider.
        when('/home', {
            templateUrl: 'eshop/index.html',
            controller: 'HomeCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/home_ctrl.js',
                            'pageSevers/homeSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/goodsList', {
            templateUrl: 'eshop/goodsList.html',
            controller: 'GoodsListCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/goodsList_ctrl.js',
                            'pageSevers/specialtySevers_ctrl.js'
                        ]
                    });
                }]
            }
        })
        .when('/promotion', {
            templateUrl: 'eshop/sale.html',
            controller: 'PromotionCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/promotion_ctrl.js',
                            'pageSevers/promotionSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/saleProducts', {
            templateUrl: 'eshop/saleProducts.html',
            controller: 'saleProductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/saleProducts_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/tourism', {
            templateUrl: 'eshop/tourism.html',
            controller: 'TourismCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/tourism_ctrl.js',
                            'pageSevers/tourismSevers_ctrl.js'
                        ]
                    });
                }]
            }  
        }).when('/product', {
            templateUrl: 'eshop/goodscontent.html',
            controller: 'ProductCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/product_ctrl.js',
                            'pageSevers/productSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/collectionProducts', {
            templateUrl: 'eshop/personalcollection.html',
            controller: 'CollectionProductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/cllectionProducts_ctrl.js',
                            'pageSevers/cllectionProductsSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/login', {
            templateUrl: 'eshop/login.html',
            controller: 'LoginCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/login_ctrl.js',
                            'pageSevers/loginSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/products', {
            templateUrl: 'eshop/products.html',
            controller: 'ProductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/products_ctrl.js',
                            'pageSevers/productsSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/register', {
            templateUrl: 'eshop/register.html',
            controller: 'RegisterCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/register_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shoppingCart', {
            templateUrl: 'eshop/cart.html',
            controller: 'ShoppingCartCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shoppingCart_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myRefunds', {
            templateUrl: 'eshop/myRefunds.html',
            controller: 'MyRefundsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myRefunds_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myBacks', {
            templateUrl: 'eshop/myBacks.html',
            controller: 'MyBacksCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myBacks_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders', {
            templateUrl: 'eshop/myorders.html',
            controller: 'MyOrdersCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders1', {
            templateUrl: 'eshop/myOrders.html',
            controller: 'MyOrders1Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders1_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders2', {
            templateUrl: 'eshop/myOrders.html',
            controller: 'MyOrders2Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders2_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders3', {
            templateUrl: 'eshop/myOrders.html',
            controller: 'MyOrders3Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders3_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders4', {
            templateUrl: 'eshop/myOrders.html',
            controller: 'MyOrders4Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders4_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myOrders5', {
            templateUrl: 'eshop/myOrders.html',
            controller: 'MyOrders5Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myOrders5_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myBack', {
            templateUrl: 'views/myBacks.html',
            controller: 'MyBackCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myBack_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myRefund', {
            templateUrl: 'views/myRefunds.html',
            controller: 'MyRefundCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myRefund_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/comfirmOrder', {
            templateUrl: 'eshop/comfirmOrder.html',
            controller: 'ComfirmOrderCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/comfirmOrder_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/findPwd', {
            templateUrl: 'eshop/findPwd.html',
            controller: 'FindPwdCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/findPwd_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/findPwdResult', {
            templateUrl: 'eshop/findPwdResult.html',
            controller: 'FindPwdResultCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/findPwdResult_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/setNewPwd', {
            templateUrl: 'eshop/setNewPwd.html',
            controller: 'SetNewPwdCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/setNewPwd_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/validateCode', {
            templateUrl: 'eshop/validateCode.html',
            controller: 'ValidateCodeCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/validateCode_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/center', { 
            templateUrl: 'eshop/personal.html',
            controller: 'CenterCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/center_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/updateInfo', {
            templateUrl: 'eshop/updateInfo.html',
            controller: 'UpdateInfoCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/updateInfo_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myAddresses', {
            templateUrl: 'eshop/address.html',
            controller: 'MyAddressesCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myAddresses_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/collectionShops', {
            templateUrl: 'eshop/personalcollection-2.html',
            controller: 'CollectionShopsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/collectionShops_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myPoints', {
            templateUrl: 'eshop/personalintegral.html',
            controller: 'MyPointsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myPoints_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/aboutUs', {
            templateUrl: 'eshop/aboutUs.html',
            controller: 'AboutUsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/aboutUs_ctrl.js'
                        ]
                    });
                }]
            } 
        }).when('/myCurrency', {
            templateUrl: 'eshop/personalcurrency.html',
            controller: 'MyCurrencyCtrl', 
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myCurrency_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myGrowValue', {
            templateUrl: 'eshop/personalgrowthvalue.html',
            controller: 'MyGrowValueCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myGrowValue_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myNotice', {
            templateUrl: 'eshop/personalNotice.html',
            controller: 'MyNoticeCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myNotice_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myCoupons', {
            templateUrl: 'eshop/personalcoupon.html',
            controller: 'MyCouponsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myCoupons_ctrl.js'
                        ]
                    });
                }]
            }
        })
        .when('/getMyCoupons', {
            templateUrl: 'eshop/getpersonalcoupon.html',
            controller: 'GetMyCouponsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/getMyCoupons_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/order', {
            templateUrl: 'eshop/orderdetail.html',
            controller: 'Order_Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/order_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/order_1', {
            templateUrl: 'eshop/order_1.html',
            controller: 'Order_1_Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/order_1_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/order_2', {
            templateUrl: 'eshop/order_2.html',
            controller: 'Order_2_Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/order_2_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/order_3', {
            templateUrl: 'eshop/order_3.html',
            controller: 'Order_3_Ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/order_3_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/back', {
            templateUrl: 'eshop/back.html',
            controller: 'BackCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/back_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/backResult', {
            templateUrl: 'eshop/backResult.html',
            controller: 'BackResultCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/backResult_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/specialty', {
            templateUrl: 'eshop/specialty.html',
            controller: 'SpecialtyCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/specialty_ctrl1.js',
                            'pageSevers/specialtySevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/specialtyOffer', {
            templateUrl: 'eshop/specialtyOffer.html',
            controller: 'specialtyOffer',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/specialtyOffer.js'
                        ]
                    });
                }]
            }
        }).when('/couponProduct', {
            templateUrl: 'eshop/couponProduct.html',
            controller: 'couponProduct',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/couponProduct.js'
                        ]
                    });
                }]
            }
        }).when('/regValidateEmail', {
            templateUrl: 'eshop/regValidateEmail.html',
            controller: 'RegValidateEmailCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/regValidateEmail_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myGold', {
            templateUrl: 'eshop/gold.html',
            controller: 'MyGoldCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myGold_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myBankcard', {
            templateUrl: 'eshop/card.html',
            controller: 'MyBankcardCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myBankcard_ctrl.js',
                            'pageSevers/myBankcardSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/addBankcard', {
            templateUrl: 'eshop/addBankcard.html',
            controller: 'AddBankcardCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/addBankcard_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopcenter', {
            templateUrl: 'eshop/seller.html',
            controller: 'ShopcenterCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopcenter_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/addProduct', {
            templateUrl: 'eshop/addProduct.html',
            controller: 'AddProductCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/addProduct_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myProducts', {
            templateUrl: 'eshop/goods.html',
            controller: 'MyproductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myproducts_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopOrders', {
            templateUrl: 'eshop/order.html',
            controller: 'ShopOrdersCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopOrders1', {
            templateUrl: 'eshop/order.html',
            controller: 'ShopOrdersCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopOrders2', {
            templateUrl: 'eshop/order.html',
            controller: 'ShopOrdersCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopOrders3', {
            templateUrl: 'eshop/order.html',
            controller: 'ShopOrdersCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopOrders4', {
            templateUrl: 'eshop/order.html',
            controller: 'ShopOrdersCtr',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopOrders_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/outProducts', {
            templateUrl: 'eshop/outProducts.html',
            controller: 'OutProductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/outProducts_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopCoupons', {
            templateUrl: 'eshop/discount.html',
            controller: 'ShopCouponsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopCoupons_ctrl.js',
                            'pageSevers/shopCouponsSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion1', {
            templateUrl: 'eshop/sales.html',
            controller: 'SalesPromotionCtrl1',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion1_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion2', {
            templateUrl: 'eshop/salesPromotion2.html',
            controller: 'SalesPromotionCtrl2',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion2_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion3', {
            templateUrl: 'eshop/salesPromotion3.html',
            controller: 'SalesPromotionCtrl3',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion3_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion4', {
            templateUrl: 'eshop/salesPromotion4.html',
            controller: 'SalesPromotionCtrl4',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion4_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion5', {
            templateUrl: 'eshop/salesPromotion5.html',
            controller: 'SalesPromotionCtrl5',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion5_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion6', {
            templateUrl: 'eshop/salesPromotion6.html',
            controller: 'SalesPromotionCtrl6',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion6_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion7', {
            templateUrl: 'eshop/salesPromotion7.html',
            controller: 'SalesPromotionCtrl7',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion7_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/salesPromotion8', {
            templateUrl: 'eshop/salesPromotion8.html',
            controller: 'SalesPromotionCtrl8',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/salesPromotion8_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/backmanage', {
            templateUrl: 'eshop/backmanage.html',
            controller: 'BackmanageCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/backmanage_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/refundmanage', {
            templateUrl: 'eshop/after.html',
            controller: 'RefundmanageCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/refundmanage_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopRegister', {
        templateUrl: 'eshop/enterprise1.html',
        controller: 'ShopRegisterCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'controllers/shopRegister_ctrl.js'
                    ]
                });
            }]
        }
    }).when('/shopRegisterAudit', {
            templateUrl: 'eshop/shopRegisterAudit.html',
            controller: 'ShopRegisterAuditCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopRegisterAudit_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/addProductInfo', {
            templateUrl: 'eshop/add.html',
            controller: 'AddProductInfoCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'js/angular-ueditor.min.js',
                            'controllers/addProductInfo_ctrl.js',
                            'pageSevers/addProductInfoSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/updateProductInfo', {
            templateUrl: 'eshop/add.html',
            controller: 'UpdateProductInfoCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/updateProductInfo_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/updateBankcard', {
            templateUrl: 'eshop/addBankcard.html',
            controller: 'updateBankcardCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/updateBankcard_ctrl.js',
                            'pageSevers/updateBankcardSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/registerResult', {
            templateUrl: 'eshop/registerResult.html',
            controller: 'registerResultCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/registerResult_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/myCash', {
            templateUrl: 'views/myCash.html',
            controller: 'MyCashCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/myCash_ctrl.js',
                            'pageSevers/myCashSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/updateShop', {
            templateUrl: 'eshop/edit.html',
            controller: 'UpdateShopCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/updateShop_ctrl.js',
                            'pageSevers/updateShopSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/shopConfig', {
            templateUrl: 'eshop/shopConfigure.html',
            controller: 'shopConfigureCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopConfigure_ctrl.js',
                            'pageSevers/shopConfigureSevers_ctrl.js'
                        ] 
                    });
                }]
            }
        }).when('/shopExpress', {
            templateUrl: 'eshop/express.html',
            controller: 'shopExpressCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/shopExpress_ctrl.js',
                            'pageSevers/shopExpressSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/addExpress', {
            templateUrl: 'eshop/addExpress.html',
            controller: 'addExpressCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/addExpress_ctrl.js',
                            'pageSevers/addExpressSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/updateExpress', {
            templateUrl: 'eshop/addExpress.html',
            controller: 'updateExpressCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/updateExpress_ctrl.js',
                            'pageSevers/updateExpressSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/list', {
            templateUrl: 'eshop/list.html',
            controller: 'listCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/list_ctrl.js',
                            'pageSevers/listSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/weixinPay', {
            templateUrl: 'eshop/weixinPay.html',
            controller: 'weixinPayCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/weixinPay_ctrl.js',
                            'pageSevers/weixinPaySevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/recycleProducts', {
            templateUrl: 'eshop/recycleProducts.html',
            controller: 'recycleProductsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/recycleProducts_ctrl.js',
                            'pageSevers/recycleProductsSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/miaosha', {
            templateUrl: 'eshop/miaosha.html',
            controller: 'miaoshaCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/miaosha_ctrl.js',
                            'pageSevers/miaoshaSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/payResult', {
            templateUrl: 'eshop/payResult.html',
            controller: 'payResultCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/payResult_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/activity', {
            templateUrl: 'eshop/activity.html',
            controller: 'activityCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/activity_ctrl.js',
                            'pageSevers/activitySevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/receiveConfig', {
            templateUrl: 'eshop/receiveConfig.html',
            controller: 'receiveConfigCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/receiveConfig_ctrl.js',
                            'pageSevers/receiveConfigSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/groupActivity', {
            templateUrl: 'eshop/groupActivity.html',
            controller: 'groupActivityCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/groupActivity_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/groupSetMeal', {
            templateUrl: 'eshop/groupSetMeal.html',
            controller: 'groupSetMealCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/groupSetMeal_ctrl.js',
                            'pageSevers/groupSetMealSevers_ctrl.js'
                        ]
                    });
                }]
            }
        }).when('/pointProduct', {
            templateUrl: 'eshop/pointProduct.html',
            controller: 'pointProductCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/pointProduct_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/pickupAddress', {
            templateUrl: 'eshop/pickupAddress.html',
            controller: 'pickupAddressCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/pickupAddress_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/pickupAddressForm', {
            templateUrl: 'eshop/pickupAddressForm.html',
            controller: 'pickupAddressFormCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/pickupAddressForm_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/membersArea', {
            templateUrl: 'eshop/membersArea.html',
            controller: 'membersAreaCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/membersArea_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/actpage', {
		    templateUrl: 'eshop/actpage.html',
		    controller: 'actpageCtrl',
		    resolve: {
		        deps: ['$ocLazyLoad', function($ocLazyLoad) {
		            return $ocLazyLoad.load({
		                files: [
		                    'controllers/actpage_ctrl.js',
		                ]
		            });
		        }]
		    }
		}).when('/promotionNav', {
            templateUrl: 'eshop/promotionNav.html',
            controller: 'promotionNavCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/promotionNav_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/brandPromotion', {
            templateUrl: 'eshop/brandPromotion.html',
            controller: 'brandPromotionCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/brandPromotion_ctrl.js',
                        ]
                    });
                }]
            }
        }).when('/memberNav', {
            templateUrl: 'eshop/memberNav.html',
            controller: 'memberNavCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'controllers/memberNav_ctrl.js',
                            
                        ]
                    });
                }]
            }
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

app.controller('IndexCtrl',['$scope','$rootScope','$location','$http', '$cookies', '$route','$window','$sce', function ($scope,$rootScope, $location, $http, $cookies, $route, $window,$sce) {
	var fun = function($scope,$http){
	    $http.post(baseUrl+'pc/home/searchword', {}).success(function(result){
	        if(result.error == 0) {
	            $scope.words=result.data;
	            return $scope.words;
	        }
	    });
	}
    fun($scope,$http);
    var token=$cookies.get('token');
    $rootScope.c_menu_hide=0;
    $rootScope.skipPage=function(url,type){
        if(type==1){
           // window.location.href=url;
        }else{
           // window.open(url);
        }
    };

    //菜单显示与隐藏
    $rootScope.showmenu=function(){
        if($rootScope.c_menu_hide==1){
            $rootScope.c_menu_hide=0;
        }else{
            $rootScope.c_menu_hide=1;
        }
    }
    $rootScope.setpages = function () {
        alert(e);
    };
//弹出层
    $rootScope.showLayer=function (id,w,h,t) {
        var model=$(id);
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: [w, h], //宽高
            title:t,
            content:model,
            end:function () {
                model.hide();
            }
        });
    }
 
    if(token){
        $rootScope.logined=true;
    }else {
        $rootScope.logined=false;
    }
    
    //获取coke里面的昵称和shop_id
    var cookiesName=$cookies.get('cookiesName');
    var cookiesShopid=$cookies.get('cookiesShopid');
    var shopId=$cookies.get('shopId');
    $rootScope.cookiesName=cookiesName;
    $rootScope.shopId=shopId;
    if(cookiesShopid=='true'){
        $rootScope.cookiesShopid=true;
    }else {
        $rootScope.cookiesShopid=false;
    }

    $rootScope.cartNum = 0; //购物车数量
    //退出登录
    $rootScope.LoginOut=function(){
        $http.post(baseUrl+'pc/center/logout').success(function(result){
            if(result.error==0){
                $byLayer.msg('退出成功','success',function(){
                    $cookies.remove('token');
                    $cookies.remove('cookiesName');
                    $cookies.remove('cookiesShopid');
                    $rootScope.logined=false;
                    $route.reload();
                });
            }else {

            }
        });
    }
    //获取购物车信息
    $rootScope.getCarts=function(){
        $http.post(baseUrl+'pc/cart/cartProducts').success(function(result){
            if(result.error==0){
            $rootScope.carts=result;
                $rootScope.cartnum= result.products.length;
            }else {

            }
        });
    }
    //删除购物车
    $rootScope.headerremove = function (id) {
        $http.post(baseUrl+'pc/cart/remove', {
            id:id
        }).success(function(result){
            if(result.error==0){
                alert("删除成功！");
                $rootScope.getCarts();
            }else {

            }
        });
    }
    $rootScope.followWeix=false;
    $rootScope.followWeix1=false;
    $rootScope.followWeix2=false;
    $rootScope.followWeix3=false;
    //关注微信
    $rootScope.showWeixcode=function(type){
        if(type==1){
            $rootScope.followWeix=true;
        }else if(type==2){
            $rootScope.followWeix1=true;
        }else if(type==3){
            $rootScope.followWeix2=true;
        }else if(type==4){
            $rootScope.followWeix3=true;
        }

    }
    //隐藏微信二维码
    $rootScope.hideWeixcode=function(type){
        if(type==1){
            $rootScope.followWeix=false;
        }else if(type==2){
            $rootScope.followWeix1=false;
        }else if(type==3){
            $rootScope.followWeix2=false;
        }else if(type==4){
            $rootScope.followWeix3=false;
        }
    }
    //店铺注册须知
    $rootScope.goshopRegister=function(){
        if($rootScope.logined){
            $('#shopxieyiform').modal('hide');
            window.location.href="#/shopRegister";
        }else{
            $byLayer.msg('请登录会员后再注册店铺', 'failed', function () {
                $('#shopxieyiform').modal('hide');
            })
        }

    }

    //获取O2O列表
    $http.post(baseUrl+'pc/shop/getServiceShop').success(function(result){
        if(result.error==0){
            $rootScope.shoplist=result.data;
        }else {

        }
    });
    //选择O2O店铺跳转
    $rootScope.goshopback=function(id){
        $byLayer.msg('功能待开放', 'failed')
        //window.open("shopindex.html#/index?id=" + id);
    }
    //搜索商品
    $rootScope.searchTop=function(k,f,g){
        if(k){
            window.location.href = "index.html#/list?keyName=" + k+"&"+g+"="+ f+"&type="+g+"&code="+new Date();
        }else{
            $byLayer.msg('请输入搜索关键字', 'failed')
        }

    } 
     $rootScope.searchTopKeycode=function(k,f,g){
     	var keycode = window.event.which;
    	 if(keycode==13){
    	 	if(k){
	            window.location.href = "index.html#/list?keyName=" + k+"&"+g+"="+ f+"&type="+g+"&code="+new Date();
	        }else{
	            $byLayer.msg('请输入搜索关键字', 'failed')
	        }
    	 }
     }
  $rootScope.goPointProduct=function(d){
    //   ${}为es6字符串模板
      window.location.href = `#/pointProduct?params=${d}`;
      location.reload();
  }
    //签到
    $rootScope.qianDao=function(){
        $http.post(baseUrl+'pc/home/sign').success(function(result){
            if(result.error==0){
                $byLayer.msg('签到成功', 'success', function () {
                    location.reload();
                })
            }else if(result.error==3){
                location.reload();
                window.location.href="#/login";

            }else if(result.error==-1){
                $byLayer.msg('今天已签到了，明天再来吧', 'failed', function () {
                    location.reload();
                })
            }
        });
    }
    //加载签到记录
    $rootScope.getSignLIst=function(){
		var key = [];
    	key.offset = 0;
    	key.length = 25;
        $http.post(baseUrl+'pc/home/signList',key).success(function(result){
            if(result.error==0){
                $rootScope.topSignList=result.data;
                $rootScope.showLayer('#qiandaoform','1200px','550px','每日签到')
            }else if(result.error==3){
                $byLayer.msg('请登录后在签到', 'failed', function () {
                    $("#qiandaoform").modal('hide');
                    window.location.href="#/login";
                })
            }
        });
    }
    $rootScope.toProductDetail=function(id){
        window.open('#product?id='+id);
    }
    //调用保留两位小数的公共方法
    $rootScope.toDecimal2=function(x){
        return $byLayer.toDecimal2(x);
    }
    
    $rootScope.getAbsolutePath = function(path) {
    	if (!path) {
    		return path;
    	}
    	if (path.indexOf("http://") >= 0 || path.indexOf("https://") >= 0) {
    		return path;
    	} else {
    		return baseUrl + path;
    	}
    }
    
    //获取url参数
    $rootScope.getUrlParam = function(name) {
        var after = window.location.hash.split("?")[1];
        if(after) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = after.match(reg);
            if(r != null) {
                return  decodeURIComponent(r[2]);
            } else {
                return null;
            }
        }
    }
    
    $rootScope.getStrDate = function(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month > 9 ? month : "0" + month;
        var day = date.getDate();
        day = day > 9 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }

    $rootScope.clickCategory = function() {
        window.location.href = '#/goodsList?name=农副特产';
    }
    
    var getCategories=function(){
        $http.post(baseUrl + 'pc/products/getAllCategories').success(function (result) {
            if (result.error > 0) {}else {
                $rootScope.categories=result.categories;
                if($rootScope.categories.length == 4) {
                    $rootScope.categories.push({name:'农副土特产',subcategories:[{name:'农副特产'}]});
                }

            }
        });
    }
    getCategories();
    
    $scope.list={};
    var getAllHelpLinks=function(){
        $http.post(baseUrl + 'pc/helpLink/many').success(function (result) {
            if(result.error >0) {

            } else {
                $scope.list= result.data;
            }
        });
    }
    getAllHelpLinks();
    
    }]);


