/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('addExpressCtrl',['$scope','$http','$anchorScroll','$rootScope', function ($scope, $http, $anchorScroll, $rootScope) {
        $anchorScroll();
        $scope.shopmenu=6;
        $scope.state=0;
        $scope.data={};
        $scope.data.isFree=0;
        $scope.data.payType=1;
        $scope.unitname="件";
        $scope.data.expressType=[
            {expressType:0,expressname:"快递",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]},
            {expressType:0,expressname:"EMS",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]},
            {expressType:0,expressname:"平邮",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]}
        ];
        //选择计价方式改变单位
        $scope.setUnitname=function(type){
            $scope.data.expressType=[
                {expressType:"",expressname:"快递",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]},
                {expressType:"",expressname:"EMS",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]},
                {expressType:"",expressname:"平邮",firstUnit:"",firstPay:"",addUnit:"",addPay:"",details:[]}
            ];
            if(type==1){
                $scope.unitname="件";
            }else if(type==2){
                $scope.unitname="KG";
            }else if(type==3){
                $scope.unitname="立方米";
            }
        }
        //添加指定地区的运送方式
        var object={};
        $scope.addExpressTypelist=function(k){
            object={provinceItem:[],isAllProvince:0,firstUnit:"",firstPay:"",addUnit:"",addPay:""};
            $scope.data.expressType[k].details.push(object);
        }
        //删除指定地区的运送方式
        $scope.deletelist=function(p_k,k){
            $scope.data.expressType[p_k].details.splice(k,1);
            $scope.data.expressType[p_k].details=$scope.data.expressType[p_k].details;
        }
        $scope.cityshow=0;
        $scope.districtsshow=0;
        //获取所有省份
        getProvinces($scope,$http);
        $scope.getformprovince=function(p_k, k,model){
            $scope.pindex=p_k;
            $scope.index=k;
            getProvinceAndCity($scope,$http,model);
        }
        //根据省id获取城市
        $scope.getcitys=function(id){
            if(id){
                cities($scope,$http,id);
            }
        }
        //根据城市id获取区镇
        $scope.getdistricts=function(id){
            if(id){
                districts($scope,$http,id);
            } 
        }
        //选择特定省份
        $scope.selProvince=function(k){
            if($scope.provinceOrcity[k].is_sel==0){
                $scope.provinceOrcity[k].is_sel=1;
                $scope.provinceOrcity[k].isAllProvince=1;
                for(var i=0;i<$scope.provinceOrcity[k].cities.length;i++){
                    $scope.provinceOrcity[k].cities[i].is_sel=1;
                }
            }else {
                $scope.provinceOrcity[k].is_sel=0;
                for(var i=0;i<$scope.provinceOrcity[k].cities.length;i++){
                    $scope.provinceOrcity[k].cities[i].is_sel=0;
                    $scope.provinceOrcity[k].isAllProvince=0;
                }
            }
            $scope.provinceOrcity=$scope.provinceOrcity;
        }
        $scope.selCity=function(p_k,k){
            if($scope.provinceOrcity[p_k].cities[k].is_sel==0){
                $scope.provinceOrcity[p_k].cities[k].is_sel=1;
                $scope.provinceOrcity[p_k].is_sel=1;
            }else {
                $scope.provinceOrcity[p_k].cities[k].is_sel=0;
                $scope.provinceOrcity[p_k].isAllProvince=0;
            }
            $scope.provinceOrcity=$scope.provinceOrcity;
        }
        //选择特定运费城市
        $scope.submitCity=function(){
            var cityattr=[];
            var p=$scope.provinceOrcity;
            for(var i=0;i< p.length;i++){
                if(p[i].is_sel==1){
                    cityattr.push(p[i]);
                }
            }
            var attr=[];
            for(var j=0;j<cityattr.length;j++){
                var citys=cityattr[j].cities;
                if(cityattr[j].isAllProvince==0){
                    for(var k=0;k<citys.length;k++){
                        if(citys[k].is_sel==1){
                            attr.push({province_id:cityattr[j].id,city_id:citys[k].id,name:citys[k].name,isAllProvince:0});
                        }
                    }
                }else{
                    attr.push({province_id:cityattr[j].id,city_id:0,name:cityattr[j].name,isAllProvince:1});
                }
            }
            $scope.data.expressType[$scope.pindex].details[$scope.index].provinceItem=attr;

        }
        //验证快递默认信息是否已填
        var validateInfo=function(){
            var flog=false;
            for(var i=0;i<$scope.data.expressType.length;i++){
                if($scope.data.expressType[i].firstUnit&&$scope.data.expressType[i].firstPay&&$scope.data.expressType[i].addUnit&&$scope.data.expressType[i].addPay){
                    flog=true;
                }
            }
            return flog;
        }
        //保存
        /*
        *  {shopId:店铺id,name:模板名称,province_id:宝贝省id,city_id:宝贝市id,district_id:宝贝区id,isFree:是否包邮,payType:计价方式,
         * 					expressType:[{expressType:运送方式,firstUnit:默认首重,firstPay:默认首费,addUnit:默认续重,addPay:默认续费,
         * 								  details:[{provinceItem:[{province_id:省id,city_id:市id,name:名称,isAllProvince:是否省下面所有市,}],city_id:市id,isAllProvince:是否省下面所有市,firstUnit:首重,firstPay:首费,addUnit:续重,addPay:续费}]},...
         *                              ]
         *                 }
        * */
        $scope.data1={};
        $scope.butflag=true;
        $scope.submit=function(){
            if(!$scope.data.name) {
                $byLayer.msg('模板名称', 'failed');
                return false;
            }
            if(!$scope.data.province_id) {
                $byLayer.msg('商品所在省份不可为空', 'failed');
                return false;
            }
            if(!$scope.data.city_id) {
                $byLayer.msg('商品所在城市不可为空', 'failed');
                return false;
            }
            if(!$scope.data.district_id) {
                $byLayer.msg('商品所在区/县不可为空', 'failed');
                return false;
            }
            if(!$scope.data.payType) {
                $byLayer.msg('计价方式不可为空', 'failed');
                return false;
            }
            if($scope.data.isFree==0){
                var validate=validateInfo();
                if(validate==false){
                    $byLayer.msg('默认运费信息不可为空', 'failed');
                    return false;
                }
            }
            $scope.data.shopId=$rootScope.shopId;
            if($scope.butflag) {
                var template = JSON.stringify($scope.data);
                $scope.butflag = false;
                console.log($scope.data);
                createLogisticsTemplate($scope,$http,template);
            }
        }
        //显示城市层
        $scope.shownum=-1;
        $scope.showCitybox=function(k){
            if( $scope.shownum==k){
                $scope.shownum=-1;
            }else{
                $scope.shownum=k;
            }
        }
        //隐藏城市层
        $scope.offCity=function(){
            $scope.shownum=-1;
        }

        $scope.cancel=function(){
            window.location.href = "#/shopExpress";
        }
    }]);
