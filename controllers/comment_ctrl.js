/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('CommentCtrl', ['$scope','$location','$http','$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
        $anchorScroll();
        //我的账户余额
        $http.post(baseUrl+'pc/applyCashOn/myWalletAmount').success(function(result){
            if(result.error==0){
                $scope.walletAmount=result.walletAmount;
            }else {

            }
        });
    }]);
