var getMyCashs=function($scope,$http){
    $http.post(baseUrl + 'pc/center/getMyCashs',$scope.data).success(function (result) {
        if(result.error >0) {

        } else {
            $scope.coupons= result.data;
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
}



