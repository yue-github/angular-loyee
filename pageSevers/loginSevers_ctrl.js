var submitData=function($scope,$http,$cookies,$rootScope,data, callback){
    $http.post(baseUrl+'pc/login/submit', $scope.data).success(function(result){
        if(result.error==0){
            $byLayer.msg('登录成功', 'success', function () {
                $cookies.put('token', result.token);
                $rootScope.logined=true;
                if(result.customer.nickName!=null){
                    $rootScope.cookiesName=result.customer.nickName;
                    $cookies.put("cookiesName",$rootScope.cookiesName);
                }else if(result.customer.mobilePhone!=null){
                    $rootScope.cookiesName=result.customer.mobilePhone;
                    $cookies.put("cookiesName",$rootScope.cookiesName);
                }else if(result.customer.email!=null){
                    $rootScope.cookiesName=result.customer.email;
                    $cookies.put("cookiesName",$rootScope.cookiesName);
                }
                if(!result.customer.shop_id){
                    $rootScope.cookiesShopid=false;
                    $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
                }else {
                    $rootScope.cookiesShopid=true;
                    $rootScope.shopId=result.customer.shop_id;
                    $cookies.put("cookiesShopid",$rootScope.cookiesShopid);
                    $cookies.put("shopId",$rootScope.shopId);
                }
                history.back();
            });
        } else {
        	$byLayer.msg(result.errmsg, 'failed');
        	if(callback) {
        		callback();
        	}
        }
    });
}
var qqLoginSe=function($http){
    $http.post(baseUrl+'pc/login/qqLogin').success(function(result){
        if(result.error==0){
            window.location.href=result.url;
        }
    });
}
var weixinLoginSe=function($http){
    $http.post(baseUrl+'pc/login/weixinLogin').success(function(result){
        if(result.error==0){
            window.location.href=result.url;
        }
    });
}

