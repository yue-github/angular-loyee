/**
 * Created by admin on 2016/10/27.
 */
var app = angular.module('app', ['ngRoute', 'ngFileUpload'])
    .controller('shopConfigureCtrl',  ['$scope','$location','$http', '$anchorScroll', 'Upload','$rootScope', function ($scope, $location, $http, $anchorScroll,Upload,$rootScope) {
        $scope.menustate=1;
        $scope.state=0;
        $scope.moduletype=1;
        $scope.sellayouttype=1;
        $scope.pageType=1;
        $scope.pageTypevalue= [{value:1,name:"首页"},{value:2,name:"商品详情"}];
            $scope.modules=[
            {id:1,icon:"images/config-icon-3.png",name:"商品推荐",type:4},
            {id:2,icon:"images/config-icon-3.png",name:"全部商品",type:5},
            {id:3,icon:"images/config-icon-7.png",name:"图片轮播",type:3},
        ];
        //选择编辑页面
        $scope.selpageType=function(){
            $scope.showView="";
        }
        $scope.selcategory=function(type){
            $scope.moduletype=type;
        }
        $scope.sellayout=function(type){
            $scope.sellayouttype=type;
        }
        //显示遮罩
        $scope.showView=0;
        $scope.showeditbox=function(k){
            $scope.showView=k;
        }
        //取消
        $scope.clean=function(k){
            $('#'+k).modal('hide');
            $scope.showView=0;
        }
        $scope.hideweditbox=function(){
            $scope.showView=!$scope.showView;
            alert($scope.showView);
        }
        getShopDecoration($scope,$http,$rootScope.shopId);
        
        $http.post(baseUrl + 'pc/shop/getShopByToken',$scope.data).success(function (result) {
            if (result.error == 0) {
            	$scope.data=result.data;
            } else if (result.error == -1) {
            	window.location.href = "#/shopRegister";
            }
        });
        
        //选择模块
        var sort_num=2;
        $scope.selmodule=function(k){
            sort_num=sort_num+1;
            var v={};
            if(k==3){
                v={sort_num:sort_num,banners:[],title:"轮播图",type:3};
            }else if(k=4){
                v={sort_num:sort_num,recommand:{products:[{id:1,mainPic:"images/p3-3.png",name:"甜枣",suggestedRetailUnitPrice:10}]},title:"推荐商品",type:4};
            }
            $scope.data.push(v);
        }
        //删除模块
        $scope.delModule=function(k){
            for(var i=0;i<$scope.data.length;i++){
                if($scope.data[i].sort_num==k){
                    $scope.data.splice(i,1);
                }
            }
        }
        $scope.editbanner=function(num){
            $scope.bannerSort_num=num;
        }
        //添加图片轮播
        $scope.banners=[];
        var item={num:0,path:"",url:""};
        $scope.banners.push(item);
        var a=0;
        $scope.addbanner=function(k){
            a=k+a;
            item={num:a,path:"",url:""};
            $scope.banners.push(item);
        }
        //删除图片轮播
        $scope.deleteBanner=function(k){
            $scope.banners.splice(k,1);
            $scope.banners=$scope.banners;
        }
        //保存轮播图
        $scope.submitBanner=function(k){
            for(var i=0;i<$scope.data.length;i++){
                if($scope.data[i].sort_num===$scope.bannerSort_num){
                    $scope.data[i].banners=$scope.banners;
                }
            }
            $('#'+k).modal('hide');
            $scope.showView=0;
        }
        //保存分类广告
        $scope.submitbrand=function(k){
            $('#'+k).modal('hide');
            for(var i=0;i<$scope.data.length;i++){
                if($scope.data[i].sort_num==1){
                    $scope.data[i].brand=$scope.brand.brand;
                }
            }
            $scope.showView=0;
        }
        //file标签触发
        $scope.selbanner=function(k){
            document.getElementById('bannerfile' + k).click();
        }
        //上传品牌图片
        $scope.uploadbrand=function(){
            document.getElementById('brand').click();
        }
        //上传图片
        $scope.brand={sort_num:1,brand:[{url:"#",path:"images/shopheader.jpg"}],title:"分栏广告",type:1};
        $scope.upload = function (file, k, type) {
            if (file) {
                var index = $byLayer.loading();
                uploadFile($scope,$http,file, k, type,Upload,index);
            }
        };
        //选择推荐商品的展示方式
        $scope.selProductNum=function(num){
            $scope.proName=num;
        }
        //获取店铺的所有上架商品
        getOnShelfProduct($scope,$http);
        //选择商品
        $scope.editproduct=function(num){
            //$scope.recommand.title="";
            $scope.proName=0;
            for(var i=0;i<$scope.products.length;i++){
                $scope.products[i].is_sel=0;
            }
            $scope.recommandSort_num=num;
        }
        //商品全选
        $scope.allSelProduct=function(m){
            for(var i=0;i< $scope.products.length;i++){
                $scope.products[i].is_sel=m;
            }
            for(var j=0;j<$scope.data.length;j++){
                if($scope.data[j].sort_num==$scope.recommandSort_num){
                    $scope.data[j].recommand.products= $scope.products;
                    $scope.data[j].title=$scope.recommand.title;
                    $scope.data[j].proName=$scope.recommand.proName;
                }
            }
        }
        $scope.selproduct=function(m,k){
            $scope.products[k].is_sel=m;
            $scope.products=$scope.products;
        }
        //保存商品
        $scope.submitProduct=function(k){
            var products=[];
            for(var i=0;i< $scope.products.length;i++){
                if($scope.products[i].is_sel==1){
                    products.push($scope.products[i]);
                }
            }
            for(var j=0;j<$scope.data.length;j++){
                if($scope.data[j].sort_num==$scope.recommandSort_num){
                    $scope.data[j].recommand.products=products;
                    if($scope.recommand.title){
                        $scope.data[j].title=$scope.recommand.title;
                    }

                    $scope.data[j].proName=$scope.recommand.proName;
                }
            }
            $('#'+k).modal('hide');
        }
        //保存商品详情商品推荐
        $scope.submitProductdetail=function(k){
            var products=[];
            for(var i=0;i< $scope.products.length;i++){
                if($scope.products[i].is_sel==1){
                    products.push($scope.products[i]);
                }
            }
            $scope.ProductDetails.products=products;
            if($scope.recommand.title){
                $scope.ProductDetails.title=$scope.recommand.title;
            }

            $('#'+k).modal('hide');
        }
        //提交JSON
        $scope.submit=function(){
            var attrs={};
             attrs.index=$scope.data;
             attrs.detailpage=$scope.ProductDetails;
            var attr=JSON.stringify(attrs);
            var url='';
            if( $scope.modelID){
                url=baseUrl+'pc/shopDecoration/updateShopDecoration';
            }else{
                url=baseUrl+'pc/shopDecoration/saveShopDecoration';
            }
            submitShopDecoration($scope,$http,attr);
        }
    }]);
