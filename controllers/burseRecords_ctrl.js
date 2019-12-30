/**
 * Created by admin on 2016/9/19.
 */
var app = angular.module('app', ['ngRoute'])
    .controller('BurseRecordsCtrl', ['$scope','$http','$anchorScroll', function ($scope, $http, $anchorScroll) {
        $anchorScroll();
        $scope.menu=5;
        $scope.state=0;
        $scope.hide='active';
        $scope.tabshide=function(){
            $scope.hide='active';
            $scope.show='';
            $scope.data2={};
            $scope.data2.pageNumber=1;
            $scope.pages=[];
            getwallet();
        }
        $scope.tabsshow=function(){
            $scope.show='active';
            $scope.hide='';
            $scope.data={};
            $scope.pages1=[];
            $scope.data.pageNumber=1;
            getwithDrawList();
        }



        //我的账户余额
       var getmyWalletAmount=function(){
           $http.post(baseUrl+'pc/applyCashOn/myWalletAmount').success(function(result){
               if(result.error==0){
                   $scope.walletAmount=result.walletAmount;
               }else {

               }
           });
       }
        getmyWalletAmount();

        $scope.data={};
        $scope.pages1=[];
        $scope.data.pageNumber=1;
        //获取提现明细；
         var getwithDrawList=function(){
            $http.post(baseUrl+'pc/applyCashOn/withDrawList',$scope.data).success(function(result){
                if(result.error==0){
                    $scope.withDrawList=result.data;
                    $scope.pageLength=result.totalPages;
                    for (var i=0;i<$scope.pageLength;i++){
                        $scope.pages1.push(i+1);
                    }
                }else {

                }
            });
        }
        getwithDrawList();

        $scope.applyCashOn=function(){
            //获取提现账号；
            $http.post(baseUrl+'pc/applyCashOn/myBankCardList').success(function(result){
                if(result.error==0){
                    $scope.myBankCardList=result.data;
                }else {

                }
            });
        }
        $scope.data1={};
        //提交提现申请
        $scope.submitCashon=function(){

            if(!$scope.data1.money){
                $byLayer.msg('提现金额不能为空', 'failed');
                return false;
            }
            if(!$scope.data1.money>0){
                $byLayer.msg('提现金额有误请核对再提交！', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.data1.money)){
                $byLayer.msg('提现金额有误请核对再提交', 'failed');
                return false;
            }
            if(!$scope.data1.accountType){
                $byLayer.msg('提现方式不能为空', 'failed');
                return false;
            }
            if($scope.data1.accountType==1){
                if(!$scope.data1.aplipayAccount){
                    $byLayer.msg('支付宝账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.data1.accountType==2){
                if(!$scope.data1.weixinAccount){
                    $byLayer.msg('微信账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.data1.accountType==3){
                if(!$scope.data1.bankCard_id){
                    $byLayer.msg('账号不能为空', 'failed');
                    return false;
                }
            }
            if($scope.walletAmount<$scope.data1.money){
                $byLayer.msg('账号余额不足！', 'failed');
                return false;
            }
            $http.post(baseUrl+'pc/applyCashOn/submit',$scope.data1).success(function(result){
                if(result.error==0){
                    $byLayer.msg('提交成功', 'success',function(){
                        $('#CashOnform').modal('hide');
                        getwithDrawList();
                        getmyWalletAmount();
                    } );

                }else {

                }
            });
        }

        /*----------------------------充值--------------------------*/
        $scope.data2={};
        $scope.data2.pageNumber=1;
        $scope.pages=[];
        //获取充值明细；
        var getwallet=function(){
            $http.post(baseUrl+'pc/wallet/many',$scope.data2).success(function(result){
                if(result.error==0){
                    $scope.wallets=result.data;
                    angular.forEach($scope.wallets,function (value, key) {
                        if(result.data[key].event == 3) {
                            $scope.wallets[key].event = '支付宝充值';
                        }else if(result.data[key].event == 4) {
                            $scope.wallets[key].event = '微信充值';
                        }else if(result.data[key].event == 6) {
                            $scope.wallets[key].event = '银联充值';
                        }
                    });
                    $scope.pageLength1=result.totalPages;
                    for (var i=0;i<$scope.pageLength1;i++){
                        $scope.pages.push(i+1);
                    }

                }else {

                }
            });
        }
        getwallet();
        $scope.data3={};
        //提交充值信息applywallet
        $scope.recharge=function(){
            if(!$scope.data3.money){
                $byLayer.msg('充值金额不能为空', 'failed');
                return false;
            }

            if(!$scope.data3.money>0){
                $byLayer.msg('充值金额有误，请重新核对！', 'failed');
                return false;
            }
            var regu=/^[0-9]+\.?[0-9]*$/;
            if(!regu.test($scope.data3.money)){
                $byLayer.msg('请填写正确的金额', 'failed');
                return false;
            }
            if(!$scope.data3.event){
                $byLayer.msg('充值方式不能为空', 'failed');
                return false;
            }
            $('#walletform').modal('hide');
            $http.post(baseUrl+'pc/wallet/recharge',$scope.data3).success(function(result){
                if(result.error==0){
                    getwallet();
                    if(result.payType==4){
                        window.location.href="#/weixinPay?path="+result.payInfo;
                    }else if(result.payType==3){
                        angular.element('.container').append(result.payInfo);
                    }else if(result.payType==6){
                        document.write(result.payInfo);
                    }

                }else {

                }
            });
        }

        //分页加载数据
        $scope.setpages=function(k,n){
            if(n==0){
                var page=$scope.data2.pageNumber;
                var pagenum=page+k;
                if(pagenum>$scope.pageLength1){
                    $scope.data2.pageNumber=$scope.pageLength1;
                }else if(pagenum<1){
                    $scope.data2.pageNumber=1;
                }else {
                    $scope.data2.pageNumber=pagenum;
                }
                getwallet();
            }else {
                var pagenum=k;
                $scope.data2.pageNumber=pagenum;
                getwallet();
            }
        }
        $scope.setpages1=function(k,n){
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
                getwithDrawList();
            }else {
                var pagenum=k;
                $scope.data2.pageNumber=pagenum;
                getwithDrawList();
            }
        }
        //取消
        $scope.clean=function(){
            $scope.data1={};
            $scope.data2={};
            $('#walletform').modal('hide');
            $('#CashOnform').modal('hide');
        }
    }]);