/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('EmailCtrl',['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
    }]);
