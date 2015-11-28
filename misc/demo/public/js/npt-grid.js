/**
 * Created by leon on 15/11/24.
 */

angular.module("nptGridApp", ["ui.neptune"])
    .factory("DemoNptGrid", function (nptGridStore, uiGridConstants, nptFormStore) {
        nptFormStore.put("order", {
            options: {},
            fields: [
                {
                    key: 'sn',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单编号:',
                        placeholder: "请输入订单编号"
                    }
                },
                {
                    key: 'state',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单状态:',
                        placeholder: "请输入订单编号"
                    }
                },
                {
                    key: 'clientid',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '客户编号:',
                        placeholder: "请输入客户编号"
                    }
                },
                {
                    key: 'sales',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '销售顾问:',
                        placeholder: "请输入销售顾问"
                    }
                },
                {
                    key: 'amount',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单金额:'
                    }
                },
                {
                    key: 'createdate',
                    type: 'dateInput',
                    templateOptions: {
                        required: true,
                        label: '创建日期:'
                    }
                },
                {
                    key: 'remark',
                    type: 'input',
                    templateOptions: {
                        label: '备注:'
                    }
                }
            ]
        }).put("demo", {
            fields: [
                {
                    key: 'lastName',
                    type: 'input',
                    templateOptions: {
                        label: 'Last Name'
                    }
                }
            ]
        });

        return nptGridStore("DemoNptGrid", {
            gridOptions: {
                columnDefs: [
                    {field: 'sn', displayName: "订单编号", width: 150},
                    {field: 'state', displayName: "订单状态", width: 80},
                    {field: 'clientid', displayName: "客户名称", enableSorting: false},
                    {field: 'sales', displayName: "业务员", cellFilter: "cacheFilter:'user':'name':'id'"},
                    {field: 'amount', displayName: "订单金额", aggregationType: uiGridConstants.aggregationTypes.sum},
                    {field: 'createdate', displayName: "创建日期"},
                    {field: 'remark', displayName: "备注"}
                ],
                enableGridMenu: true,
                gridMenuCustomItems: [
                    {
                        title: "添加",
                        action: function ($event) {

                        },
                        leaveOpen: false
                    }
                ]
            },
            action: {
                view: {
                    label: "查看",
                    type: "none"
                },
                add: {
                    label: "添加",
                    type: "add",
                    target: "order",
                    listens: [function ($q, $timeout) {
                        var deferd = $q.defer();
                        console.info("添加方法,在Store中配置");

                        $timeout(function () {
                            deferd.resolve();
                            console.info("添加方法,在配置中执行完成");
                        }, 1000);

                        return deferd.promise;
                    }, function (params, $timeout, $q) {
                        var deferd = $q.defer();
                        console.info("开始调用后台添加服务.");

                        $timeout(function () {
                            if (params.index === 0) {
                                deferd.reject("不能在第一行上添加.");
                            } else {
                                console.info("后台调用更成功.controller");
                                deferd.resolve("添加成功");
                            }
                        }, 500);

                        return deferd.promise;
                    }, function (params) {
                        console.info("添加的第二个方法!");
                    }]
                },
                del: {
                    label: "删除",
                    type: "del"
                },
                edit: {
                    label: "编辑",
                    type: "edit",
                    target: "order",
                    listens: [
                        function (params, $timeout, $q) {
                            var deferd = $q.defer();
                            console.info("开始执行后台更新服务.")
                            $timeout(function () {
                                if (params.index === 0) {
                                    deferd.reject("不能编辑第一行");
                                } else {
                                    deferd.resolve("执行成功!");
                                    params.data["demo"] = "测试添加一行数据";
                                    params.data["sn"] = "测试修改订单号"
                                }
                            }, 500);
                            return deferd.promise;
                        },
                        function () {
                            return "我是第二个方法";
                        }
                    ]
                }
            }
        })
    })
    .controller("nptGridDemoController", function (DemoNptGrid, $scope, $timeout) {
        var vm = this;

        vm.nptGridOptions = {
            store: DemoNptGrid,
            onRegisterApi: function (nptGridApi) {
                vm.nptGridApi = nptGridApi;
            }
        };

        vm.model = [];

        $timeout(function () {
            var tempDatas = [];
            for (var i = 0; i < 100; i++) {
                tempDatas.push({
                    "sn": "DD20150101000" + i,
                    "state": "buy",
                    "clientid": "10000002315692",
                    "sales": "10000001498059",
                    "amount": 10938.88 + i,
                    "createdate": (new Date().getTime() + 1000 * i),
                    "remark": "测试数据表格配置"
                });
            }

            vm.model = tempDatas;
        }, 500);


    });