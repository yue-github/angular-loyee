/**
 * Created by admin on 2016/9/6.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('FindPwdResultCtrl',['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
    }]);