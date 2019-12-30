var getProductInfo=function($scope,$http,id){
    $http.post(baseUrl+'pc/addProductInfo/get',{id: id}).success(function(result){
        if(result.error > 0) {

        }else {
        	if(!result.product.composeProducts) {
        		$scope.composeProducts = [];
        	} else {
        		$scope.composeProducts = JSON.parse(result.product.composeProducts);
        		if($scope.composeProducts.length > 0) {
        			$scope.is_compose = 1;
        		}
        		
        	}
            $scope.data=result.product;
            console.log($scope.data.hotels);
            if ($scope.data.hotels != null && $scope.data.hotels !== undefined) {
            	$scope.hotels = $scope.data.hotels;
            }
            console.log($scope.hotels);
            $scope.tpics = angular.copy($scope.data.pics);
            if($scope.data.prod_prop.split){
                var ps = $scope.data.prod_prop.split(',');
            }
            for(var i = 0; i < $scope.commonAttrs.length; i++) {
                var a = $scope.commonAttrs[i];
                for(var k = 0; k < a.propertyValueList.length; k++) {
                    var v = a.propertyValueList[k].propertyValueId;
                    for(var j = 0; j < ps.length; j++) {
                        if(ps[j] == v) {
                            $scope.attrSelecteds[i] = v;
                        }
                    }
                }
            }
            var pr = [];
            for(var i = 0; i < $scope.data.productPrices.length; i++){
                var p = $scope.data.productPrices[i];

                var tps = p.type_attr.split(',');
                pr = pr.concat(tps);
            }
            for(var i = 0; i < $scope.saleAttrs.length; i++) {
                var a = $scope.saleAttrs[i];
                for(var k = 0; k < a.propertyValueList.length; k++) {
                    var pv = a.propertyValueList[k];
                    var v = pv.propertyValueId;
                    for(var j = 0; j < pr.length; j++) {
                        if(pr[j] == v) {
                            pv.checked = true;
                            break;
                        }
                    }
                }
            }
            $scope.cratePrices();
        }
    });
}
//获取产品供应商列表
var getSuppliers=function($scope,$http,category_id){
    $http.post(baseUrl + 'pc/product/getSuppliers', {id: category_id}).success(function (result) {
        if(result.error==0){
            $scope.suppliers=result.data;
        }else if(result.error>0){

        }
    })
}

//获取产品品牌列表
var getBrands=function($scope,$http){
    $http.post(baseUrl + 'pc/product/getBrands', {}).success(function (result) {
        if(result.error==0){
            $scope.brands=result.data;
        }else if(result.error>0){

        }
    })
}
//获取产品税率标识
var getSignsList=function($scope,$http){
    $http.post(baseUrl + 'pc/addProductInfo/manyTax').success(function (result) {
        if(result.error==0){
            $scope.signsList=result.data;
        }else if(result.error>0){

        }
    })
}
//获取产品属性
var getAttrs=function($scope,$http,category_id){
    $http.post(baseUrl + 'pc/addProductInfo/getAttrs', {id: category_id}).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.commonAttrs = result.commonAttrs;
            $scope.saleAttrs = result.saleAttrs;
            $scope.isEditStoreAmount = $scope.saleAttrs.length > 0 ? false : true;
            console.log($scope.saleAttrs.length);
            $scope.loadInfo();
        }
    });
}

var uploadFile=function($scope,$http,file, k,Upload,index) {
    Upload.upload({
        url: baseUrl + "admin/file/upload",
        data: {file: file}
    }).then(function (resp) {
        if(k === -1) {
            $scope.tpics.push(baseUrl+resp.data.path);
        } else {
            $scope.tpics[k] = baseUrl+resp.data.path;
        }

        $byLayer.close(index);
    }, function (resp) {
    }, function (evt) {
    });
}
//保存商品信息
var create=function($scope,$http,index){
	console.log($scope.data.pre_end_time);
    $http.post(baseUrl + 'pc/addProductInfo/acreate', $scope.data).success(function (result) {
        $byLayer.close(index);
        if (result.error > 0) {
        	$byLayer.msg('保存失败', 'warning');
        } else {
            $byLayer.msg('保存成功', 'success', function () {
                window.location.href = '#/myProducts';
            });
        }
    });
}

//获取快递模板
var findLogisticsTemplateByShopId=function($scope,$http){
    $http.post(baseUrl + 'pc/addProductInfo/findLogisticsTemplateByShopId', $scope.data).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.findLogistics=result.data;
        }
    });
}

