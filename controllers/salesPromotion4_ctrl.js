/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute','ngFileUpload'])
    .controller('SalesPromotionCtrl4', ['$scope','$http','$anchorScroll','$location','$filter', 'Upload', function ($scope, $http, $anchorScroll, $location, $filter, Upload) {
        $anchorScroll();
        $scope.menustate=6;
        $scope.state=4;
        $scope.shopmenu=4;
        $scope.pageTitle="团购";
        $scope.addForm=function(){
            $scope.formTitle="添加";
        }
        $scope.data={};
        $scope.pageNumber=1;
        $scope.data.length=10;
        $scope.data.offset=0;
        $scope.data.promotionType=4;
        $scope.pages=[];
        $scope.detail={};
        $scope.product={};
        var getPromotion=function(){
            $http.post(baseUrl+'pc/promotionMansong/many',$scope.data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.many=result.data;
                    //分页
                    $scope.data.length=result.length;
                    $scope.data.offset=result.offset;
                    $scope.totalRow=result.totalRow;
                    $scope.pageNumber=$scope.data.offset/$scope.data.length+1;
                    $scope.pagestotal=Math.ceil($scope.totalRow/$scope.data.length);
                    $scope.pages=getRange($scope.pageNumber,$scope.pagestotal,10);
                }
            });
        }
        getPromotion();

        //保存优惠活动
        /**
         * 修改促销活动
         * @param token 用户登录口令
         * @param promotionType 活动类型
         * @param id 促销活动id
         * @param promotionTitle 促销活动名称
         * @param promotionDescription 活动描述(选填)
         * @param startTime 开始时间
         * @param endTime 截止时间
         * @return 成功：{error: 0}；失败：{error: >0, errmsg: 错误信息}
         */
        $scope.submit=function(){
            $scope.data.encodedColor = $scope.encodedColor;
            if(!$scope.data.promotionTitle){
                $byLayer.msg('促销活动名称不能为空', 'failed');
                return false;
            }
            if(!$scope.data.startTime){
                $byLayer.msg('促销活动开始时间不能为空', 'failed');
                return false;
            }
            if(!$scope.data.endTime){
                $byLayer.msg('促销活动截止时间不能为空', 'failed');
                return false;
            }
            var url="";
            if($scope.data.id){
                url="pc/promotionManjian/update";
            }else{
                url="pc/promotionManjian/create";
            }

            var data = angular.copy($scope.data);
            data.startTime = $filter('date')($scope.data.startTime,'yyyy-MM-dd');
            data.endTime = $filter('date')($scope.data.endTime,'yyyy-MM-dd');

            $http.post(baseUrl+url,data).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('保存成功', 'success', function () {
                        $('#addsalesForm').modal('hide');
                        $scope.data.pageNumber=1;
                        $scope.data.pageSize=10;
                        $scope.pages=[];
                        getPromotion();

                    })
                }
            });
        }
        	// 简单编码
		$scope.nameColor = "#000";
		$scope.encodedColor = "#000";
		$scope.encodedBlur = function(){
			$scope.nameColor = $scope.encodedColor;
		}
        $scope.update=function(id){
            $scope.data={};
            $scope.formTitle="修改";
            $http.post(baseUrl+'pc/promotionManjian/get',{id:id,promotionType:1}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.data=result.data;
                }
            });
        }
        //删除活动(id,标题用于提示)
        $scope.delete=function(id,hint){
        	var ids=[];
            ids.push(id);
            $scope.data.ids=JSON.stringify(ids);
        	$byLayer.confirm("确定删除："+hint,function(){
        		$http.post(baseUrl+'pc/promotionManjian/delete', $scope.data).success(function(result){
	                if(result.error > 0) {
						console.log(result.errmsg)
	                }else {
	                	getPromotion();
	                    $byLayer.msg('删除成功', 'success', function () {
	                        $scope.data.pageNumber=1;
	                        $scope.pages=[];
	                    })
	                }
	            });
        	})
        }

        /**分页点击事件
         * k:当前点击的页数或者左右+1、-1
         * t:类型（0：左右按钮点击，1：页码点击）
         * */
        $scope.setpages = function (k,t) {
            if(t==0){
                $scope.pageNumber= $scope.pageNumber+k;
                if($scope.pageNumber>0&&$scope.pageNumber<=$scope.pagestotal){
                    $scope.pageNumber=$scope.pageNumber;
                }else if($scope.pageNumber>=$scope.pagestotal){
                    $scope.pageNumber=$scope.pagestotal;
                }else{
                    $scope.pageNumber=1;
                }
            }else {
                $scope.pageNumber=k;
            }
            $scope.data.offset=($scope.pageNumber-1)*$scope.data.length;
            getPromotion();
        }


        $scope.getPromotion=function(id){
            $scope.detail.promotion_id=id;
            $http.post(baseUrl+'pc/promotionManjian/manyManjian',{promotion_id:id}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.detailList= result.data;
                }
            });
        }
        var detailItem={full:"",cashDiscount:""};
        //添加活动明细list
        var num=0;
        $scope.addDetailList=function(k){
            num=num+k;
            detailItem={num:num,full:"",cashDiscount:""}
            $scope.detailList.push(detailItem);
        }
        //删除活动明细list
        $scope.deleteDetailList=function(k,id,p_id){
            if(id){
                $http.post(baseUrl+'pc/promotionManjian/deleteManjian',{id:id}).success(function(result){
                    if(result.error > 0) {
                    }else {
                        $scope.getPromotion(p_id);
                    }
                });
            }else if($scope.detailList.length>1){
                $scope.detailList.splice(k,1);
            }
        }

        //保存明细
        $scope.submitDetail=function(){
            $scope.detail.proms=JSON.stringify($scope.detailList);
            $http.post(baseUrl+'pc/promotionManjian/saveManjian',$scope.detail).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('保存成功', 'success', function () {
                        $('#detailForm').modal('hide');
                    })
                }
            });
        }

        //添加商品
        $scope.getPromotion_id=function(id){
            $scope.product.promotion_id=id;
            $http.post(baseUrl+'pc/promotionManjian/manyProduct',{promotion_id:id,pageNumber:1,pageSize:50}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.products=result.data;
                }
            });
        }
        $scope.getAllCategory=function(){
            $http.post(baseUrl+'pc/promotionManjian/getAllCategory').success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.category=result.data;
                }
            });

        }
        //根据分类id获取商品
        $scope.getProduct=function(id){
            $http.post(baseUrl+'pc/promotionManjian/getProductByCate',{id:id}).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.productName=result.data;
                }
            });
        }
        //添加商品
        $scope.saveProduct=function(){
            $http.post(baseUrl+'pc/promotionManjian/addProduct',$scope.product).success(function(result){
                if(result.error > 0) {

                }else {
                    $byLayer.msg('添加成功', 'success', function () {
                        $scope.getPromotion_id($scope.product.promotion_id);
                        $('#add-product-form').modal('hide');
                    })
                }
            });
        }
        //删除商品
        $scope.deleteProduuct=function(id){
            var data={};
            var ids=[];
            ids.push(JSON.stringify(id));
            data.ids=JSON.stringify(ids);
            $http.post(baseUrl+'pc/promotionManjian/deleteProduct',data).success(function(result){
                if(result.error > 0) {

                }else {
                    $scope.getPromotion_id($scope.product.promotion_id);
                }
            });
        }
        //取消
        $scope.close=function(id){
            $('#'+id).modal('hide');
        }
        //上传图片
        $scope.upload = function (file) {
            if (file) {
                var index = layer.load(0, {shade: 0.5});
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    $scope.data.promPic=resp.data.path;
                    layer.close(index);
                }, function (resp) {
                }, function (evt) {
                });
            }
        };
    }]);