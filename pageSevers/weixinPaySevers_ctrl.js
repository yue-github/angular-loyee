var isPayByTheSameOrderNum=function($scope,$http,data,$timer){
    $http.post(baseUrl + 'pc/comfirmOrder/isPayByTheSameOrderNum', {theSameOrderNum:data}).success(function(result){
        if (result.error == 0 && result.data == true) {
            clearTimeout($timer);
            $byLayer.msg('支付成功！', 'success',function(){
                window.location.href="#/home";
            });
        }
    });
}
var isPayByOrderId=function($scope,$http,data,$timer){
    $http.post(baseUrl + 'pc/comfirmOrder/isPayByOrderId', {orderId:data}).success(function(result){
        if (result.error == 0 && result.data == true) {
            clearTimeout($timer);
            $byLayer.msg('支付成功！', 'success',function(){
                window.location.href="#/home";
            });
        }
    });
}




