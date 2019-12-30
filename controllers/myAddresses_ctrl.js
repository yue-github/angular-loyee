/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyAddressesCtrl', ['$scope','$http','$anchorScroll', '$rootScope', function ($scope, $http, $anchorScroll, $rootScope) {
        $scope.menu=2;
        $anchorScroll();
        $scope.viewsTitle='添加地址';
        $scope.page=1;
        $scope.data={};
        $scope.data.length = 5;
        $scope.data.offset = 0;
        var getmany=function(){
            $http.post(baseUrl + 'pc/address/many',$scope.data).success(function (result) {
                if(result.error == 0) {
                	$scope.addresses= result.addresses;
                    //分页
					$scope.data.offset = result.offset;
					$scope.totalRow = result.totalRow;
					$scope.pageNumber = $scope.data.offset / $scope.data.length + 1;
					$scope.pagestotal = Math.ceil($scope.totalRow / $scope.data.length);
					$scope.pages = getRange($scope.pageNumber, $scope.pagestotal, 10);
                }
            });
        }
        getmany();
        /**分页点击事件
		 * k:当前点击的页数或者左右+1、-1
		 * t:类型（0：左右按钮点击，1：页码点击）
		 * */
		$scope.setpages = function(k, t) {
			if(t == 0) {
				$scope.pageNumber = $scope.pageNumber + k;
				if($scope.pageNumber > 0 && $scope.pageNumber <= $scope.pagestotal) {
					$scope.pageNumber = $scope.pageNumber;
				} else if($scope.pageNumber >= $scope.pagestotal) {
					$scope.pageNumber = $scope.pagestotal;
				} else {
					$scope.pageNumber = 1;
				}
			} else {
				$scope.pageNumber = k;
			}
			$scope.data.offset = ($scope.pageNumber - 1) * $scope.data.length;
			 getmany();
		}
        //设置默认地址
        $scope.setDefault=function(id){
            $http.post(baseUrl + 'pc/address/setDefault',{addressId:id}).success(function (result) {
                if(result.error >0) {

                } else {
                    $byLayer.msg('设置成功', 'success',function(){
                        getmany();
                    });
                }
            });
        }
        //删除地址
        $scope.remove=function(id){
            $http.post(baseUrl + 'pc/address/remove',{addressId:id}).success(function (result) {
                if(result.error == 0) {
                    $byLayer.msg('删除成功', 'success',function(){
                        getmany();
                    });
                }
            });
        }

        //编辑地址
        $scope.editAddress=function (addressId) {
            $http.post(baseUrl + 'pc/editAddress/get',{addressId:addressId}).success(function (result) {
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
                    $rootScope.showLayer('#add_card','800px','500px','编辑地址')
                }
            });
        }
        

        //添加地址
        $scope.adddata=function () {
            $scope.data={};
            $scope.data.contacts=null;
            $scope.data.phone=null;
            $scope.data.provinceId=null;
            $scope.data.cityId=null;
            $scope.data.districtId=null;
            $scope.data.detailedAddress=null;
            $rootScope.showLayer('#add_card','800px','500px','添加地址')
        }


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

            if($scope.data.id){
                $http.post(baseUrl + 'pc/editAddress/editaddress',$scope.data).success(function (result) {
                    if(result.error >0) {

                    } else {
                        $byLayer.msg('修改成功', 'success',function(){
                            location.reload();
                        });
                    }
                });
            }else{
                $http.post(baseUrl + 'pc/address/save',$scope.data).success(function (result) {
                    if(result.error >0) {
                    } else {
                        $byLayer.msg('保存成功', 'success',function(){
                            location.reload();
                        });
                    }
                });
            }
        }
        $scope.onkeydownNumber = function(){
        	var str=[];
        	var num  =$scope.data.phone;
        	if($scope.data.phone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.data.phone = str;
        		});
      			
        	}
        	
        }
        //重置
        $scope.cleaned=function(){
            if($scope.data.id){
                $http.post(baseUrl + 'pc/editAddress/get',{addressId:$scope.data.id}).success(function (result) {
                    if(result.error >0) {

                    } else {
                        $scope.data= result.address;
                        console.log($scope.data);
                        $scope.data.provinceId = $scope.data.province_id;
                        $scope.data.cityId = $scope.data.city_id;
                        $scope.data.districtId = $scope.data.district_id;
                        var provinceId = $scope.data.provinceId;
                        var cityId = $scope.data.cityId;
                        $scope.getCity(provinceId);
                        $scope.getDistricts(cityId);
                    }
                });
            }else {
                $scope.data.contacts="";
                $scope.data.phone="";
                $scope.data.provinceId="";
                $scope.data.cityId="";
                $scope.data.districtId="";
                $scope.data.detailedAddress="";
            }


        }
    }]);
