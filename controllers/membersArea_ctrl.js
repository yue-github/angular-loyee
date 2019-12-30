var app = angular.module('app', ['ngRoute'])
    .controller('membersAreaCtrl',  ['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
         $anchorScroll();
         $scope.shopmenu = 9;
         $scope.table = [
            {title: '会员专区一', stime: '2019-05-01', etime: '2019-05-02'}
         ];
         $scope.data = {};
         $scope.goods = [
            {name:'西瓜',img:'assets/image/goods/watermelon.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，西瓜大特卖，满足你的需求'},
            {name:'桃子',img:'assets/image/goods/peach.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，桃子大特卖，满足你的需求'},
            {name:'青苹果',img:'assets/image/goods/apple.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，青苹果大特卖，满足你的需求'},
            {name:'香蕉',img:'assets/image/goods/banana.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，香蕉大特卖，满足你的需求'},
            {name:'梨',img:'assets/image/goods/pear.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，梨大特卖，满足你的需求'},
            {name:'葡萄',img:'assets/image/goods/grape.jpg',depict:'炎炎夏日，想获得一份清爽？ 来吧，葡萄大特卖，满足你的需求'}
         ];
         $scope.good = [];
         $scope.ordeState = false;
         $scope.ordeShow = ()=>{
         	$scope.ordeState = true;
         };
         $scope.ordeHide = ()=>{
         	$scope.ordeState = false;
         };
         $scope.ordeSubmit = ()=>{
            let datas = {};
            datas.title = $scope.data.title;
            datas.stime = $scope.data.stime;
            datas.etime = $scope.data.etime;
            console.log(datas.stime);
            if(!$scope.data.title || !$scope.data.stime || !$scope.data.etime){
               alert('请输入全部内容!!!');
               return false;
            }else{
               $scope.table.push(datas);
               $scope.data = {};
               $scope.ordeState = false;
            }
         };
         $scope.goodsShow = (data)=>{
            $scope.good.push(data);
         }
}]);