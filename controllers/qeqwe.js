var app = angular.module('app', ['ngFileUpload','ng.ueditor'])
    .controller('ProductCtrl', function ($scope, $location, $http, $rootScope, Upload, $anchorScroll) {
        $anchorScroll();
        $rootScope.liPageIndex = 'Production';
        $rootScope.pageIndex = 'Product';
        var addTitle = '添加记录';
        var editTitle = '修改记录';
        $rootScope.menuName = '产品管理';
        $rootScope.menuSecond = '产品信息';
        $rootScope.menuEnName = 'Details';

        //上传图片
        $scope.upload = function (file) {
            if(file) {
                Upload.upload({
                    url: baseUrl + "admin/file/upload",
                    data: {file: file}
                }).then(function (resp) {
                    $scope.data.mainPic = resp.data.path;
                }, function (resp) {
                }, function (evt) {
                });
            }
        };

        $scope.supplierName = [
            {id:1,name:'供货商1'},
            {id:2,name:'供货商2'},
            {id:3,name:'供货商3'},
            {id:4,name:'供货商4'},
        ];

        $scope.statusName = [
            {id:1,name:'有货'},
            {id:2,name:'无存货需等待'},
            {id:3,name:'无货'},
        ];

        //获取所有产品
        $scope.$on('$viewContentLoaded', function() {
            //window.UMEDITOR_HOME_URL = 'plugins/umeditor/dist/ueditor/';
            $scope.table = loadDataTable({
                table: "#datatable_ajax",
                columns: [
                    { data: "mainPic", render:function (data) {
                        return "<img style='width: 50px;' src=" + data + ">";
                    }},
                    { data: "name" },
                    { data: "category_id", render:function (data, type, row, meta) {
                        if(row.category_id == 1) {
                            return '居家环保产品';
                        }else if(row.category_id == 2) {
                            return '居家环保服务';
                        }else if(row.category_id == 3) {
                            return '健康食品';
                        }
                    }},
                    { data: "unitCost" },
                    { data: "suggestedRetailUnitPrice"},

                    { data: "is_sale", render:function (data, type, row, meta){
                        if(row.is_sale == 0) {
                            return '是';
                        } else  {
                            return '否';
                        }
                    }},
                ],
                editButton: true,
                editEvent:  function(id) {
                    $scope.formTitle = editTitle;
                    $http.post(baseUrl + 'admin/product/get', {id:id}).success(function (result) {
                        if(result.error >0) {
                            alert(result.errmsg);
                        } else {
                            $scope.data = result.product;
                        }
                    });
                },
                url: baseUrl + "admin/product/many",
                success: function(grid, response){
                    // alert('加载成功');
                },
                error: function (grid) {
                    alert('加载失败');
                }
            });
        });


        //获取单条产品
        $scope.get = function (id) {

        }

        $scope.add = function () {
            $scope.formTitle = addTitle;
            $scope.data = {};
        }

        // 保存产品信息
        $scope.save = function () {
            var actionSave  = function () {
                if($scope.data.id) {
                    $scope.data.categoryId = $scope.data.category_id;
                    $http.post(baseUrl + 'admin/product/update', {
                        id:$scope.data.id,
                        name:$scope.data.name,
                        categoryId:$scope.data.categoryId,
                        unitCost:$scope.data.unitCost,
                        suggestedRetailUnitPrice:$scope.data.suggestedRetailUnitPrice,
                        unitDeliverCost:$scope.data.unitDeliverCost,
                        minAllowableUnitPrice:$scope.data.minAllowableUnitPrice,
                        minAllowableUnitDeliveryCharge:$scope.data.minAllowableUnitDeliveryCharge,
                        suggestedRetailUnitDeliveryCharge:$scope.data.suggestedRetailUnitDeliveryCharge,
                        minAllowableUnitPrice:$scope.data.minAllowableUnitPrice,
                        minAllowableUnitDeliveryCharge:$scope.data.minAllowableUnitDeliveryCharge,
                        is_sale:$scope.data.is_sale,
                        mainPic:$scope.data.mainPic,
                        summary:$scope.data.summary,
                        note:$scope.data.note,
                        supplier_id:$scope.data.supplier_id,
                        model:$scope.data.model,
                        upc:$scope.data.upc,
                        status:$scope.data.status,
                    }).success(function (result) {
                        if(result.error >0) {
                            alert(result.errmsg);
                        } else {
                            alert('修改成功');
                            $scope.table.getDataTable().ajax.reload();
                            $('#dataForm').modal('hide');
                        }
                    });
                } else {
                    //添加产品
                    $http.post(baseUrl + 'admin/product/create', {
                        name:$scope.data.name,
                        categoryId:$scope.data.categoryId,
                        unitCost:$scope.data.unitCost,
                        suggestedRetailUnitPrice:$scope.data.suggestedRetailUnitPrice,
                        unitDeliverCost:$scope.data.unitDeliverCost,
                        minAllowableUnitPrice:$scope.data.minAllowableUnitPrice,
                        minAllowableUnitDeliveryCharge:$scope.data.minAllowableUnitDeliveryCharge,
                        suggestedRetailUnitDeliveryCharge:$scope.data.suggestedRetailUnitDeliveryCharge,
                        minAllowableUnitPrice:$scope.data.minAllowableUnitPrice,
                        minAllowableUnitDeliveryCharge:$scope.data.minAllowableUnitDeliveryCharge,
                        is_sale:$scope.data.is_sale,
                        mainPic:$scope.data.mainPic,
                        summary:$scope.data.summary,
                        note:$scope.data.note,
                        supplier_id:$scope.data.supplier_id,
                        model:$scope.data.model,
                        upc:$scope.data.upc,
                        status:$scope.data.status,
                    }).success(function (result) {
                        if(result.error >0) {
                            alert(result.errmsg);
                        } else {
                            alert('添加成功');
                            $scope.table.getDataTable().ajax.reload();
                            $('#dataForm').modal('hide');
                        }
                    });
                }
            }


            var rules = {
                name: {
                    minlength: 2,
                    required: true
                }
            };

            formValidation(rules, actionSave);
        }

        //修改产品
        $scope.update = function (id) {

        }

        //批量删除 @param数组
        $scope.batchDelete = function () {
            $http.post(baseUrl + 'admin/product/batchDelete', {
                ids:JSON.stringify($scope.table.getSelectedRows())
            }).success(function (result) {
                if(result.error >0) {
                    alert(result.errmsg);
                } else {
                    alert('删除成功');
                    $scope.table.getDataTable().ajax.reload();
                }
            });
        }
    });
