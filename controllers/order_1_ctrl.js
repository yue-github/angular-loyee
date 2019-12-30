/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('Order_1_Ctrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
    }]);
