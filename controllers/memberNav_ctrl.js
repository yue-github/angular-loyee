var app = angular.module('app', ['ngRoute'])
    .controller('memberNavCtrl',  ['$scope','$location','$http', '$anchorScroll', function ($scope, $location, $http, $anchorScroll) {
         $anchorScroll();
         console.log("这是会员专区-controller/memberNav_ctrl.js")
           // 直接购买,先不判断选中属性与否
        $scope.comfirmOrder = function (id) {
            console.log(id)
            if(!id) id=529;
            window.location.href = `#/product?id=${id}&vip_is=1`;
        }
        $scope.shoppingCart = function(id){
            if(!id) id=529;
            window.location.href = `#/product?id=${id}&vip_is=1`;
        }
        $scope.foods = [
            {
                img:'http://service.eebin.com/upload/e8504697-bef3-4fd9-82d7-f9b20358bcb0.jpg',
                comment:'裕骏丰珍珠番石榴5.5斤礼盒装清甜爽脆广东省内包邮',
                now:'￥68.00',
                old:'￥89.00'
           },
            {img:'http://service.eebin.com/upload/32a4ec57-6515-4570-a224-c885e22ac66e.jpg',comment:'清远鸡天农山林散养五谷喂养清远土鸡 原种珍品清远鸡',now:'￥138.00',old:'￥168.00'},
            {img:'http://service.eebin.com/upload/74aea635-c683-4748-9ac2-ccabe52ba72e.jpg',comment:'【天农】农家散养清远鸡 土鸡 走地鸡 盐焗鸡 800g',now:'￥138.00',old:'￥168.00'},
            {img:'http://service.eebin.com/upload/b2fd89df-2e52-411d-9cce-f9c7598be8ae.jpg',comment:'冷冻金鲳鱼 约500g-600g 6条装',now:'￥148.00',old:'￥188.00'},
       ]
       $scope.hot = 'assets/image/foods/hot.png'
        //加入购物车具体请求
        // var addCart = function ($scope,$http,productId,amount,priceId) {
        //     $http.post(baseUrl + 'pc/order/addCart', {id: productId, amount: amount, priceId:priceId}).success(function (result) {
        //         if (result.error == 0) {
        //             $byLayer.msg('加入购物车成功', 'success')
        //         }else{
        //         }
        //     });
        // }
        // 获取会员专区的商品
        $scope.data = {
            offset:5,
            length:15
        };
        $scope.getVipShop = function(){
            $http.post(baseUrl + 'pc/home/searchProduct', $scope.data).success(function (result) {
                if(result.error == 0) {
                    $scope.foods = result.data;
                    $scope.foods = $scope.foods.map(i=>{
                        return Object.assign({},{id:i.id,img:i.mainPic,comment:i.name,now:i.suggestedRetailUnitPrice,old:i.originUnitPrice})
                    })
                }
            })
       }
       $scope.getVipShop();
}]);