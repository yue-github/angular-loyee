var getBankCard=function($scope,$http,$rootScope,id){
    $http.post(baseUrl + 'pc/card/get',{id:id}).success(function (result) {
        if(result.error >0) {

        } else {
            $scope.data=result;
            $scope.data.accountNumber=result.accoutNumber;
            $rootScope.showLayer('#add_card','800px','550px','编辑银行卡');
        }
    });
}
var updateBankCard=function($scope,$http){
    var url=baseUrl +"pc/card/createBankCard";
    if($scope.data.id){
        url=baseUrl +"pc/card/updateBankCard";
    }
    $http.post( url, $scope.data).success(function (result) {
        if(result.error >0) {
        } else if(result.error ==0){
            $byLayer.msg('保持成功', 'success',function(){
                location.reload();
            });

        }else if(result.error ==-1){
            $byLayer.msg('验证码错误', 'failed')
        }
    });
}



