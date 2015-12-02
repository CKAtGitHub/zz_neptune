/**
 * Created by leon on 15/11/17.
 */

angular.module("ui.neptune.formly.select-image", [])
    .config(function (formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: "npt-select-image",
            templateUrl: "/template/formly/npt-select-image.html",
            extends: 'input',
            defaultOptions: {
                templateOptions: {
                    onSelect: function (model, options) {
                        var self = this;
                        self.selectImageApi.open().then(function (response) {
                            self.selectedImages = response;
                            //如果是单选,则将第一行设置为数据, 如果是多选则提取所有数据的id
                            if (self.single && response && response.length > 0) {
                                model[options.key] = response[0].data[self.valueProp];
                            } else if (!self.single && response) {
                                model[options.key] = [];
                                angular.forEach(response, function (value) {
                                    model[options.key].push(value.data[self.valueProp]);
                                });
                            }

                        }, function () {

                        });
                    },
                    onRegisterApi: function (selectImageApi) {
                        this.selectImageApi = selectImageApi;
                    },
                    imageRepository: undefined,
                    single: false,
                    valueProp: 'id'
                },
                expressionProperties: {
                    "templateOptions.selectedImages": function (viewValue, modelValue, field) {
                        if (modelValue) {
                            var selectedImages = [];
                            modelValue = angular.isArray(modelValue) ? modelValue : [modelValue];
                            angular.forEach(modelValue, function (id) {
                                selectedImages.push({
                                    file: {
                                        id: id
                                    }
                                });
                            });
                            return selectedImages;
                        }
                    },
                    "templateOptions.imageOptions":function(viewValue, modelValue, field) {
                        var to = field.to;
                        if (to.imageOptions) {
                            return to.imageOptions;
                        }

                        if (to.imageRepository) {
                            return {
                                repository: to.imageRepository,
                                searchProp: "id",
                                labelProp: "thumbnailUrl"
                            };
                        }
                    }
                }
            }
        });
    });