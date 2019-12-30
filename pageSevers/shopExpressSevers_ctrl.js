var getlist=function($scope,$http,data){
    $http.post(baseUrl + 'pc/logisticsTemplate/paginateLogisticsTemplate',data).success(function (result) {
        if (result.error > 0) {

        } else {
            for(var i=0;i<result.data.length;i++){
                if(result.data[i].payType==1){
                    result.data[i].payType=="按件数";
                }else if(result.data.payType==2){
                    result.data[i].payType=="按重量";
                }else if(result.data.payType==3){
                    result.data[i].payType=="按体积";
                }
                var details=result.data[i].details;
                for(var j=0;j<details.length;j++){
                    if(details[j].expressType==1){
                        details[j].expressType="快递";
                    }else  if(details[j].expressType==2){
                        details[j].expressType="EMS";
                    }else  if(details[j].expressType==3){
                        details[j].expressType="平邮";
                    }
                    if(details[j].isDefaultFreight==1){
                        var pitem=details[j].provinceItem;
                        for(var k=0;k<pitem.length;k++){
                            pitem[k].provinceName="全国"
                        }
                    }
                }
            }
            //分页
            $scope.data.length=result.length;
            $scope.data.offset=result.offset;
            $scope.totalRrow=result.totalRrow;
            $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
            $scope.pagestotal=Math.ceil($scope.totalRrow/$scope.data.length);
            $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
            $scope.logisticss=result.data;
        }
    });
}
var deleteLogisticsTemplate=function($scope,$http,id,con) {
    $http.post(baseUrl + 'pc/logisticsTemplate/deleteLogisticsTemplate',{templateId:id}).success(function (result) {
        if (result.error > 0&&result.error !=1) {

        }else if(result.error ==1){
            var errmsg=result.errmsg;
            $byLayer.msg("此模板已被使用不能删除，请选择其他模板","success",function(){
                $scope.pages=[];
            });
            $byLayer.close(con);
        } else if(result.error=='1'){
        }else{
            $byLayer.close(con);
            $byLayer.msg('删除成功',"success",function(){
                $byLayer.close(con);
                $scope.pages=[];
                location.reload();
            });
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





