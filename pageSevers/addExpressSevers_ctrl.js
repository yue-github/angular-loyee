var getProvinces=function($scope,$http) {
    $http.post(baseUrl + 'pc/logisticsTemplate/provinces').success(function (result) {
        if (result.error > 0) {

        } else { 
            $scope.provinces=result.provinces;
        }
    });
}
var getProvinceAndCity=function($scope,$http,model) {
    $http.post(baseUrl + 'pc/logisticsTemplate/getProvinceAndCity').success(function (result) {
        if (result.error > 0) {

        } else {
            if(model.length>0){
                for(var i=0;i<result.data.length;i++){
                    var citys=result.data[i];
                    result.data[i].is_sel=0
                    result.data[i].isAllProvince=0;
                    for(var k=0;k<model.length;k++){
                        if(model[k].province_id==result.data[i].id&&model[k].city_id==0){
                            result.data[i].is_sel=1;
                            for(var j=0;j<citys.cities.length;j++){
                                if(model[k].province_id==citys.cities[j].ProvinceID){
                                    citys.cities[j].is_sel=1;
                                }else {
                                    citys.cities[j].is_sel=0;
                                }
                            }
                        }else if(model[k].province_id==result.data[i].id&&model[k].city_id!=0){
                            result.data[i].is_sel=1;
                            for(var s=0;s<citys.cities.length;s++){
                                if(model[k].city_id==citys.cities[s].id){
                                    citys.cities[s].is_sel=1;
                                }
                            }
                        }
                    }
                }
            }else {
                for(var i=0;i<result.data.length;i++){
                    var citys=result.data[i];
                    result.data[i].is_sel=0
                    result.data[i].isAllProvince=0;
                    for(var j=0;j<citys.cities.length;j++){
                        citys.cities[j].is_sel=0;
                    }
                }
            }
            $scope.provinceOrcity=result.data;
        }
    });
}
var cities=function($scope,$http,provinceId) {
    $http.post(baseUrl + 'pc/logisticsTemplate/cities',{provinceId:provinceId}).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.citys=result.cities;
            $scope.cityshow=1;
        }
    });
}
var districts=function($scope,$http,cityId) {
    $http.post(baseUrl + 'pc/logisticsTemplate/districts', {cityId :cityId }).success(function (result) {
        if (result.error > 0) {

        } else {
            $scope.districts=result.districts;
            $scope.districtsshow=1;
        }
    });
}
var createLogisticsTemplate=function($scope,$http,template) {
    $http.post(baseUrl + 'pc/logisticsTemplate/createLogisticsTemplate', {template: template}).success(function (result) {

        if (result.error > 0) {
        } else {
            $scope.butflag=true;
            $byLayer.msg('提交成功', "success", function () {
                window.location.href = "#/shopExpress";
            });
        }
    });
}





