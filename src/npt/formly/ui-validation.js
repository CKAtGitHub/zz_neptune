/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-validation")
    .run(function (formlyConfig, is,$q) {

        // 集成IS框架

        addTypeForValidator('boolean');
        addTypeForValidator('date');// Date
        addTypeForValidator('nan');// NaN
        addTypeForValidator('null');
        addTypeForValidator('string');
        addTypeForValidator('char');
        addTypeForValidator('undefined');
        addTypeForValidator('empty');
        addTypeForValidator('existy');// not null,not undefinder
        addTypeForValidator('truthy');// 有值
        addTypeForValidator('space');
        addTypeForValidator('url');
        addTypeForValidator('email');
        addTypeForValidator('creditCard');
        addTypeForValidator('timeString');
        addTypeForValidator('dateString');
        addTypeForValidator('hexColor');
        addTypeForValidator('ip');

        function addTypeForValidator(validatorName) {
            var validators = {};
            validators[validatorName] = {
                expression: is[validatorName],
                message: '"无效的 ' + validatorName + '"'
            };
            formlyConfig.setType({
                name: validatorName,
                defaultOptions: {
                    validators: validators
                }
            });
        }

        // 异步资源验证器
        formlyConfig.setType({
            name: "bizValidator",
            defaultOptions: {
                asyncValidators: {
                    ctrlCode:{
                        expression: function (viewValue, modelValue,scope) {
                            var defer = $q.defer();
                            var repository = scope.options.templateOptions.repository;
                            var repositoryParams = scope.options.templateOptions.repositoryParams || {};
                            if (!repository) {
                                defer.reject();
                            } else {
                                var params = {};
                                var reversal = scope.options.templateOptions.reversal;
                                if (scope.options.templateOptions.searchProp) {
                                    params[scope.options.templateOptions.searchProp] = viewValue;
                                }
                                params = angular.extend({},repositoryParams,params);
                                repository.post(params)
                                    .then(function(response) {
                                        var noExist = !response.data || response.data.length === 0;
                                        noExist = reversal?!noExist:noExist;
                                        if (noExist) {
                                            defer.reject();
                                        } else {
                                            defer.resolve();
                                        }
                                    },function(error) {
                                        defer.reject(error);
                                    });
                            }

                            return defer.promise;
                        },
                        message: '"无效的资源"+to.searchProp'
                    }
                },
                modelOptions:{ updateOn: 'blur' }
            }
        });
    });