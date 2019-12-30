/**
 * Created by admin on 2016/9/13.
 */
var app = angular.module('app', ['ngRoute', 'ngFileUpload'])
    .controller('ShopRegisterCtrl',['$scope', '$location', '$http', 'Upload', '$anchorScroll', function ($scope, $location, $http, Upload, $anchorScroll) {
        $anchorScroll();
        $scope.data = {};
        //获取分类
        $scope.getAllCategories=[{id:1,name:"个人店铺"},{id:2,name:"o2o服务区"},{id:3,name:"自营"}]


        $scope.imgcloak=function(id){
            document.getElementById('img'+id).click();
        }
        
        //手机验证
		$scope.onkeydownNumber = function(){
        	var str=[];
        	var num  =$scope.data.phone;
        	if($scope.data.phone.length>11){
        		$byLayer.msg('手机号码长度不能大于11位', 'failed',function(){
        			for(var i = 0;i<10;i++){
        				str+=num[i]
        			}
        		$scope.data.phone = str;
        		});
      			
        	}
        
        }
		//身份证验证
		function IdentityCodeValid(code) { 
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;

            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }

           else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }
                }
            }
//          if(!pass) alert(tip);
            return pass;
        }
		$scope.blurIdNumber = function(obj){
			if(obj!=undefined){
				var tmp = IdentityCodeValid(obj)
				if(!tmp){
					$byLayer.msg('身份证格式不正确,请重新填写', 'failed')
				}
			}
			
		}

        //上传图片
        $scope.upload = function (file, k) {
            if (file) {
                var index = layer.load(0, {shade: 0.5});
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    if(k==1){
                        $scope.data.idcardPic=baseUrl + resp.data.path;
                    }else if(k==2){
                        $scope.data.businessLicensePic=baseUrl + resp.data.path;
                    }else if(k==3){
                        $scope.data.logoPic=baseUrl + resp.data.path;
                    }
                    layer.close(index);
                }, function (resp) {
                }, function (evt) {
                });
            }
        };

        //提交申请
        $scope.submit = function () {
            var reg=/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
            var phone_pattern =/^[1][3,4,5,7,8][0-9]{9}$/;
            if(!$scope.data.name){
            	$byLayer.msg('店铺名称不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.shopType){
            	$byLayer.msg('店铺分类不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.contacts){
            	$byLayer.msg('联系人姓名不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.phone){
            	$byLayer.msg('联系人电话不能为空', 'failed');
            	return false;
            }
            if(phone_pattern.test($scope.data.phone)==false){
                $byLayer.msg('联系人电话不合法', 'failed');
                return false;
            }
            if(!$scope.data.idcard){
            	$byLayer.msg('身份证号码不能为空', 'failed');
            	return false;
            }
            if(reg.test($scope.data.idcard)==false){
                $byLayer.msg('身份证号码不合法', 'failed');
                return false;
            }
            if(!$scope.data.businessLicense){
            	$byLayer.msg('营业执照编号不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.idcardPic){
            	$byLayer.msg('店铺logo不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.businessLicensePic){
            	$byLayer.msg('身份证照片不能为空', 'failed');
            	return false;
            }
            if(!$scope.data.logoPic){
            	$byLayer.msg('营业执照照片不能为空', 'failed');
            	return false;
            }
            
            $http.post(baseUrl+'pc/shop/createShop',$scope.data).success(function(result){
                if(result.error == 0) {
                    $byLayer.msg('店铺创建成功', 'success', function () {
                    	window.location.href = '#/shopRegisterAudit';
                    });
                }else if (result.error > 0) {
                	$byLayer.msg('店铺创建失败', 'failed');
                }
            });

        }
    }]);