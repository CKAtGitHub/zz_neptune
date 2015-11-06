/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap'])
    .provider("DatatableStore", function () {
        this.storeConfig = {};

        this.config = {
            currPage: 1,
            maxSize: 10,
            itemsPerPage: 5,
            isIndex: false,
            isPagination: false
        };

        this.store = function (name, module) {

            if (!module) {
                module = name;
                name = module.name;
            }

            if (!name) {
                throw new Error("must have name.");
            }

            this.storeConfig[name] = module;

            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                getStore: function (name, done) {
                    if (done) {
                        done(self.storeConfig[name]);
                    }
                },
                getConfig: function () {
                    return self.config;
                }
            };
            return service;
        };
    })
    .controller("datatableController", ["$scope", "$attrs", function ($scope, $attrs) {
        this.$init = function (config) {
            //初始化参数
            this.config = config;
            $scope.currPage = $scope.currPage || config.currPage;

            $scope.totalItems = 0;
            if ($scope.data) {
                $scope.totalItems = $scope.data.length || 0;
            }

            $scope.maxSize = config.maxSize;
            $scope.itemsPerPage = $scope.itemsPerPage || config.itemsPerPage;
            $scope.pageData = [];
            $scope.isIndex = $scope.isIndex || config.isIndex;
            $scope.isPagination = $scope.isPagination || config.isPagination;

        };

        this.$pageChange = function () {
            //初始化分页数据
            $scope.pageData = [];
            var endIndex = 0;
            var beginIndex = 0;

            if ($scope.isPagination) {
                endIndex = $scope.currPage * $scope.itemsPerPage;
                beginIndex = $scope.currPage * $scope.itemsPerPage - $scope.itemsPerPage;
            } else {
                beginIndex = 0;
                endIndex = 0;
                if ($scope.data) {
                    endIndex = $scope.data.length;
                }
            }

            if ($scope.data) {
                for (beginIndex; beginIndex < endIndex; beginIndex++) {
                    if (beginIndex >= $scope.data.length) {
                        break;
                    } else {
                        $scope.pageData.push($scope.data[beginIndex]);
                    }
                }
            }
        };

        //回调绑定动作方法
        $scope.doAction = function (type, item, index) {
            //要求绑定时必须使用type作为参数名称)
            if ($scope.onAction) {
                $scope.onAction({
                    type: type,
                    item: item,
                    index: index
                });
            }
        };
    }])
    .directive("nptDatatable", ["DatatableStore", '$parse', function (DatatableStore, $parse) {
        return {
            restrict: "E",
            controller: "datatableController",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/datatable/datatable.html";
            },
            scope: {
                name: "@",
                header: "=?", //标题配置
                data: "=",   //表格数据
                action: "=?", //操作按钮
                isIndex: "=?", //是否显示序号
                isPagination: "@",//是否分页
                itemsPerPage: "=?", //每页显示行数
                onAction: "&" //操作按钮点击回调
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.$init(DatatableStore.getConfig());

                //设置表格结构
                DatatableStore.getStore(scope.name, function (storeConfig) {
                    if (!scope.header && storeConfig && storeConfig.header) {
                        scope.header = storeConfig.header;
                    }

                    if (!scope.action && storeConfig && storeConfig.action) {
                        scope.action = storeConfig.action;
                    }
                });

                //监控数据集合是否发生改变
                scope.$watchCollection("data", function (newValue, oldValue) {
                    //如果存在数据则出发第一页
                    if (angular.isDefined(newValue) && newValue !== null) {
                        //刷新总行数
                        scope.totalItems = newValue.length;
                        ctrl.$pageChange();
                    }
                });

                scope.$watch("currPage", function (newValue, oldValue) {
                    ctrl.$pageChange();
                });

                if (attrs.name && scope.$parent) {
                    var setter = $parse(attrs.name).assign;
                    setter(scope.$parent, ctrl);
                }
            }
        };
    }]);