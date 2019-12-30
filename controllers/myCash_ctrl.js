/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('MyCashCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $scope.data={}
        $scope.menu=4;
        $scope.state=1;
        $scope.pages=[];
        $scope.data.pageNumber=1;
        $scope.data.pageSize=10;
        $scope.screen=function(type){
            $scope.data.type=type;
            getMyCashs($scope,$http);
        }
        $scope.screen();
        //分页加载数据
        $scope.setpages=function(k,n){
            if(n==0){
                var page=$scope.data.pageNumber;
                var pagenum=page+k;
                if(pagenum>$scope.pageLength){
                    $scope.data.pageNumber=$scope.pageLength;
                }else if(pagenum<1){
                    $scope.data.pageNumber=1;
                }else {
                    $scope.data.pageNumber=pagenum;
                }
            }else {
                var pagenum=k;
                $scope.data.pageNumber=pagenum;
            }
            $scope.screen();
        }
    }]);
