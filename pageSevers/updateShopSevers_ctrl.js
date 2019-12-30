var getShopInfo=function($scope,$http){
    $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
        if (result.error == 0) {
        	$scope.data=result.data;
        } else if (result.error == -1) {
        	window.location.href = "#/shopRegister";
        }
    });
}
var updateShop=function($scope,$http,$byLayer){
    $http.post(baseUrl + 'pc/shop/updateShop',$scope.data).success(function (result) {
        if(result.error >0) {

        } else {
            $byLayer.msg('修改成功', 'success', function () {
                window.location.href="#/shopcenter";
            });
        }
    });
}
var uploadFile=function($scope,$http,file,Upload) {
    var index = layer.load(0, {shade: 0.5});
    Upload.upload({
        url: baseUrl + "admin/file/upload",
        data: {file: file}
    }).then(function (resp) {
        if(resp.data.path != null && resp.data.path != "undefined" && resp.data.path != ""){
    		if(resp.data.path.indexOf("http://") == -1){
    			$scope.data.logoPic=baseUrl + resp.data.path;
    		}
		}
        layer.close(index);
    }, function (resp) {
    }, function (evt) {
    });
}



