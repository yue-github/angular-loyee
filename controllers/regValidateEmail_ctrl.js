/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('RegValidateEmailCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.email = $location.search().email;
        $scope.Verifiedemail=function(){
            window.open($scope.email);
        }
    }]);