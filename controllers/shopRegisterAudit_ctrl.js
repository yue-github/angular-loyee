/**
 * Created by admin on 2016/9/18.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('ShopRegisterAuditCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
    }]);