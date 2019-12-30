/**
 * Created by admin on 2016/9/6.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ValidateCodeCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
    }]);