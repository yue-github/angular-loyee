var getproducts=function($scope,$http,data){
    $http.post(baseUrl + 'pc/home/searchProduct',data).success(function (result) {
    		if(data.isPrice == 1){ 
        		 $scope.isPrice = 2;
        	}else if(data.isPrice == 2){
        		 $scope.isPrice = 1;
			}
			// 品牌热度
			if(data.isHeat == 1){
				$scope.isHeat = 2;
			}else if(data.isHeat == 2){
				$scope.isHeat = 1;
			}
			// 产品分类
			if(data.isClassify == 1){
				$scope.isClassify = 2;
			}else if(data.isClassify == 2){
				$scope.isClassify = 1;
			}
			
			
		//    商家排名
		   if(data.isRank == 1){
				$scope.isRank = 2;
			}else if(data.isRank == 2){
				$scope.isRank = 1;
			} 
		   
        	if(data.isSell == 1){
        		 $scope.isSell = 2;
        	}else if(data.isSell == 2){
        		 $scope.isSell = 1;
        	}
        	
        	if(data.isComment == 1){
        		 $scope.isComment = 2;
        		 
        	}else if(data.isComment == 2){
        		 $scope.isComment = 1;
        	}
        	
        if(result.error >0) {
        } else {
            $scope.products= result.data;
            $scope.pageLength=result.totalPage;
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





