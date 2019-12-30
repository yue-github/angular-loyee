/**
 * Created by admin on 2016/10/17.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('registerResultCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
    }]);
