/**
 * Created by admin on 2016/9/18.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('updateBankcardCtrl', ['$scope','$http','$anchorScroll','$location', function ($scope, $http, $anchorScroll, $location) {
        $anchorScroll();
        $scope.state=1;
        $scope.menu=5
        $scope.title="修改";
        var cardId=$location.search().id;
        $scope.data={};
        $scope.data.id=cardId;
        //获取银行银行卡信息
        getBankCard($scope,$http)

        $scope.submit=function(){
            updateBankCard($scope,$http);
        }
    }]);