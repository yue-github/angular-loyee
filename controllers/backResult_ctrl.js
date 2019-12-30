/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('BackResultCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
    }]);
