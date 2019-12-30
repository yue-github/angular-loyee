/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('testCtrl',['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.invoice={};
        $scope.invoice.payType=1;
        $scope.selectType=function(type){
            $scope.invoice.payType=type;
        }

        $scope.invoice.lists=[
            {id:1,name:'百用科技',isShow:0},
            {id:2,name:'腾讯科技',isShow:0},
            {id:3,name:'百度科技',isShow:0},
            {id:4,name:'淘宝科技',isShow:0},
        ]
        $scope.editInvoice=function(k){
            for(var i=0;i<$scope.invoice.lists.length;i++){
                if(i==k){
                    $scope.invoice.lists[i].isShow=1;
                }else{
                    $scope.invoice.lists[i].isShow=0;
                }
            }
            $scope.editInvo=$scope.invoice.lists[k].name;
        }
    }]);
