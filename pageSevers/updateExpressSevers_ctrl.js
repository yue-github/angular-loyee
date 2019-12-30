var getLogistics=function($scope,$http,data){
    $http.post(baseUrl + 'pc/logisticsTemplate/getLogisticsTemplate',data).success(function (result) {
        if (result.error > 0) {
        } else {
            var tdata = [];
            for(var j=1;j<4;j++){
                var flag = false;
                var temp = {};
                for(var i=0;i<result.data.expressType.length;i++){
                    if(j==result.data.expressType[i].expressType){
                        flag = true;
                        temp = result.data.expressType[i];
                    }
                }
                if(flag==false){
                    temp= {expressType:"",expressname:"",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]}
                }
                if(j==1){
                    temp.expressname="快递";
                }else  if(j==2){
                    temp.expressname="EMS";
                }else  if(j==3){
                    temp.expressname="平邮";
                }
                tdata.push(temp);
            }
            result.data.expressType = tdata;
            $scope.data = result.data;
            if(result.data.payType==1){
                $scope.unitname="件";
            }else if(result.data.payType==2){
                $scope.unitname="KG";
            }else if(result.data.payType==3){
                $scope.unitname="立方米";
            }
            $scope.getcitys(result.data.province_id);
            $scope.getdistricts(result.data.city_id);
        }
    });
}

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
var updateLogisticsTemplate=function($scope,$http,template) {
    $http.post(baseUrl + 'pc/logisticsTemplate/updateLogisticsTemplate',{template:template}).success(function (result) {
        if (result.error > 0) {
        } else {
            $scope.butflag=true;
            $byLayer.msg('提交成功',"success",function(){
                window.location.href="#/shopExpress";
            });
        }
    });
}





