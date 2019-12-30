/**
 * Created by admin on 2016/9/6.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('SetNewPwdCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.data={};
        $scope.data.customerId = $location.search().id;

        $scope.submit=function(){
            if(!$scope.data.password){
                $byLayer.msg('新密码不可为空', 'failed');
                return false;
            }
            if(!$scope.data.repassword){
                $byLayer.msg('确认密码不可为空', 'failed');
                return false;
            }
            if($scope.data.repassword!==$scope.data.password){
                $byLayer.msg('密码与确认密码不一致', 'failed')
                return false;
            }

            $http.post(baseUrl+'pc/findPassword/updatePassword', $scope.data).success(function(result){
                if(result.error == 0) {
                    $byLayer.msg('保存成功', 'success',function(){
                        window.location.href="#/findPwdResult"
                    });
                }else if(result.error==-1){
                    $byLayer.msg('密码不一致！','failed')
                }else if (result.error == 5) {
                	window.location.href="#/findPwd";
                }
            });


        }
    }]);