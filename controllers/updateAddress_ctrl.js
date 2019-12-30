/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('UpdateAddressCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.viewsTitle='修改地址';
        var addressId=$location.search().id;
        $http.post(baseUrl + 'pc/editAddress/get',{id:addressId}).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.data= result.address;
                $scope.data.provinceId = $scope.data.province_id;
                $scope.data.cityId = $scope.data.city_id;
                $scope.data.districtId = $scope.data.district_id;

                var provinceId = $scope.data.provinceId;
                var cityId = $scope.data.cityId;
                $scope.getCity(provinceId);
                $scope.getDistricts(cityId);
            }
        });
        $http.post(baseUrl + 'pc/address/provinces').success(function (result) {
            if(result.error >0) {

            } else {
                $scope.provinces= result.provinces;
            }
        });
        $scope.getCity=function(id){
            $http.post(baseUrl + 'pc/address/cities',{provinceId:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.cities= result.cities;
                }
            });
        }

        $scope.getDistricts=function(id){
            $http.post(baseUrl + 'pc/address/districts',{cityId:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.districts= result.districts;
                }
            });
        }

        //submit

        $scope.data={};
        $scope.data.id=addressId;
        $scope.data.contacts="";
        $scope.data.phone="";
        $scope.data.provinceId="";
        $scope.data.cityId="";
        $scope.data.districtId="";
        $scope.data.detailedAddress="";
        $scope.submit=function(){
            if(!$scope.data.contacts) {
                $byLayer.msg('收货人姓名不能为空', 'failed');
                return false;
            }

            var phone_pattern = /^1[0-9]{10}$/;

            if(!$scope.data.phone) {
                $byLayer.msg('收货人手机号不能为空', 'failed');
                return false;
            }
            if (!phone_pattern.test($scope.data.phone)) {
                $byLayer.msg('手机号码格式不正确', 'failed');
                return false;
            }

            if(!$scope.data.provinceId) {
                $byLayer.msg('请选择省份', 'failed');
                return false;
            }

            if(!$scope.data.cityId) {
                $byLayer.msg('请选择市区', 'failed');
                return false;
            }

            if(!$scope.data.districtId) {
                $byLayer.msg('请选择区', 'failed');
                return false;
            }

            if(!$scope.data.detailedAddress) {
                $byLayer.msg('请输入详细地址', 'failed');
                return false;

            }
            $http.post(baseUrl + 'pc/editAddress/editaddress',$scope.data).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('修改成功', 'success',function(){
                        window.location.href = '#/myAddresses';
                    });
                }
            });
        }

        $scope.cleaned=function(){
            $http.post(baseUrl + 'pc/editAddress/get',{addressId:addressId}).success(function (result) {
                if(result.error >0) {

                } else {
                    $scope.data= result.address;
                    $scope.data.provinceId = $scope.data.province;
                    $scope.data.cityId = $scope.data.city;
                    $scope.data.districtId = $scope.data.district;
                    var provinceId = $scope.data.provinceId;
                    var cityId = $scope.data.cityId;
                    $scope.getCity(provinceId);
                    $scope.getDistricts(cityId);
                }
            });
        }

    }]);
