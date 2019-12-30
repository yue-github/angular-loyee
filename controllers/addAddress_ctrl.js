/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('AddAddressCtrl',['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menu=1;
        $scope.viewsTitle='添加地址';
        $http.post(baseUrl + 'pc/address/provinces').success(function (result) {
            if(result.error >0) {
            }else{
                $scope.provinces= result.provinces;
            }
        });
        $scope.getCity=function(id){
            $http.post(baseUrl + 'pc/address/cities',{provinceId:id}).success(function (result) {
                if(result.error >0) {
                }else{
                    $scope.cities= result.cities;
                }
            });
        }
        $scope.getDistricts=function(id){
            $http.post(baseUrl + 'pc/address/districts',{cityId:id}).success(function (result) {
                if(result.error >0) {
                }else{
                    $scope.districts= result.districts;
                }
            });
        }
        $scope.data={};
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
            $http.post(baseUrl + 'pc/address/save',$scope.data).success(function (result) {
                if(result.error >0) {
                } else {
                    $byLayer.msg('保存成功', 'success',function(){
                        window.location.href = '#/myAddresses';
                    });
                }
            });
        }
        //重置
        $scope.cleaned=function(){
            $scope.data.contacts="";
            $scope.data.phone="";
            $scope.data.provinceId="";
            $scope.data.cityId="";
            $scope.data.districtId="";
            $scope.data.detailedAddress="";
        }
    }]);
