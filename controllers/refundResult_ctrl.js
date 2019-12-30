/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('RefundResultCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
    }]);