/**
 * Created by lenovo on 2016/12/12.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('payResultCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
    }]);
