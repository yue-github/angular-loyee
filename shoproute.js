var app = angular.module('shopapp', ['ngRoute', 'oc.lazyLoad', 'ngCookies']);
app.factory('requestInterceptor', ['$log', '$location', '$cookies', function($log, $location, $cookies){
    var requestInterceptor = {
        request: function(config){
            if(config.method == 'POST') {
                if(config.data === undefined) {
                    config.data = {};
                }
                config.data.token = $cookies.get('token');
                if(config.url.indexOf('images') < 0) {
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
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
    $routeProvider.when('/index', {
        templateUrl: 'views/shopIndex.html',
        controller: 'ShopIndexCtrl',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        'controllers/shopcontrollers/shopIndex_ctrl.js'
                    ]
                });
            }]
        }
    }).
    otherwise({
        redirectTo: '/index'
    });
}]);

app.controller('shopindexCtrl',['$rootScope','$location','$http','$cookies', '$scope',function ($rootScope, $location, $http,$cookies,$scope) {
    var token=$cookies.get('token');

    if(token){
        $rootScope.logined=true;
    }else {
        $rootScope.logined=false;
    }
    //获取coke里面的昵称和shop_id
    var cookiesName=$cookies.get('cookiesName');
    var cookiesShopid=$cookies.get('cookiesShopid');
    $rootScope.cookiesName=cookiesName;
    $rootScope.cookiesShopid=cookiesShopid;
    $scope.data={};
    var shopId=$location.search().id;
    $scope.data.shopId=shopId;
    $http.post(baseUrl+'pc/shop/get',$scope.data).success(function(result){
        if(result.error == 0) {
            $scope.shop = result.data;
        }else if (result.error > 0) {
            alert(result.errmsg);
        }
    });
    //收藏店铺
    $rootScope.collect = function (id) {
        $http.post(baseUrl + 'pc/product/collectionShop', {
            shopId: id
        }).success(function (result) {
            if (result.error == 0) {
                alert('收藏成功');
            } else if(result.error==3){
               window.location.href="index.html#/login"
            }
        });
    }

    //获取购物车信息
    $rootScope.cartnum=0;
    $rootScope.getCarts=function(){
        $http.post(baseUrl+'pc/cart/cartProducts').success(function(result){
            if(result.error==0){
                $rootScope.carts=result;
                $rootScope.cartnum= result.products.length;
            }else {

            }
        });
    }
    if($rootScope.logined==true){
        $rootScope.getCarts();
    }

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
    //  测试跳转商城
     $rootScope.goPointProduct=function(d){
         console.log(1234)
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
    	if (path.indexOf("http://") >= 0 || path.indexOf("https://") >= 0) {
    		return path;
    	} else {
    		return baseUrl + path;
    	}
    }

    var getCategories=function(){
        $http.post(baseUrl + 'pc/products/getAllCategories').success(function (result) {
            if (result.error > 0) {}else {
                $rootScope.categories=result.categories;
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