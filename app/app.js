//app.js
define(['backbone', 'md5'], function () {

    "use strict";


    var hex_md5 = window.hex_md5;

    var requestIndex = {}, abortableRequestIndex = {}, queableRequestIndex = {};


    var app = {
        root: '/',
        pageNode: $('#main'),
        dataIndex:{}
    };


    var getResp = function (requestId, dataObj, successHash) {
        var requestSettings = requestIndex[requestId];
        if (requestSettings.cache === "session" && app.store.get(successHash)) {
            return app.store.get(successHash);
        }
    };

    var getSuccessHash = function (requestId, dataObj) {
        return hex_md5(requestId + JSON.stringify(dataObj) + 'success');
    };

    app.getCachedData = function (args) {
        var successHash = getSuccessHash.call(null, args.id, args.params);
        return _.clone(app.store.get(successHash));
    };


    app.ajaxRequest = function (requestSettings, dataObj) {
        var settings = $.extend(true, {}, requestSettings, {
            contentType:"application/json"
        });

        if (requestSettings.type.toLowerCase() === "post") {
            settings.data = JSON.stringify(dataObj);
            return $.ajax(settings);
        } else if (requestSettings.type.toLowerCase() === "form_post") {
            return $.post(settings.url, dataObj);
        } else {
            if (!_.isEmpty(dataObj)) {
                settings.url += "?" + $.param(dataObj);
            }
            return $.ajax(settings);
        }
    };


    app.request = function (requestConfig) {
        var requestId = requestConfig.id;

        if (!requestIndex[requestId]) {
            throw "Request with id: " + requestId + " is not defined";
        }
        var requestSettings = requestIndex[requestId];
        requestSettings.id = requestId;

        var successCallBack = requestConfig.success || _.identity;
        var errorCallBack = requestConfig.failure || _.identity;
        var alwaysCallBack = requestConfig.always || _.identity;

        var dataObj = requestConfig.params || {};


        app._request(requestSettings, dataObj, successCallBack, errorCallBack, alwaysCallBack);

    };

    app._request = function (requestSettings, dataObj, successCallBack, errorCallBack, alwaysCallBack) {

        var requestId = requestSettings.id;

        var parseSuccessResponse = function (resp) {
            if (resp && resp.diagnostics) {
                if (resp.diagnostics.error && resp.diagnostics.error.length > 0) {
                    var parsedErrors = _.map(resp.diagnostics.error, function (error) {
                        return {
                            id: error.errorCode,
                            message: error.errorMessage
                        };
                    });
                    errorCallBack.call(this, resp, parsedErrors);
                } else if (resp.data) {
                    if (requestSettings.parser) {
                        resp.data = requestSettings.parser(resp.data);
                    }
                    if (requestSettings.cache === "session" && !_.isEmpty(resp.data)) {
                        var successHash = hex_md5(requestSettings.requestId + JSON.stringify(dataObj) + 'success');
                        app.store.set(successHash, resp.data);
                        successCallBack.call(this, resp.data, requestSettings);
                    } else {
                        successCallBack.call(this, resp.data, requestSettings);
                    }

                } else {
                    errorCallBack.call(this, resp, requestSettings);
                }
            } else {
                errorCallBack.call(this, resp, requestSettings);
            }
        };

        var parseErrorResponse = function (resp) {
            errorCallBack.call(this, resp, requestSettings);
        };

        var successHash = getSuccessHash(requestId, dataObj);

        var cachedData = requestId !== undefined ? getResp(requestId, dataObj, successHash) : {};

        if (!_.isEmpty(cachedData)) {
            _.debounce(successCallBack, 100).call(null, cachedData, requestSettings);
            _.debounce(alwaysCallBack, 100).call(null, cachedData, requestSettings);
        } else {

            var runningRequest, request;

            if (requestSettings.queBehavior === 'abort') {
                runningRequest = abortableRequestIndex[successHash];
                if (runningRequest) {
                    runningRequest.abort();
                }
            }

            if (requestSettings.queBehavior === 'abort') {
                request = app.ajaxRequest(requestSettings, dataObj);
                abortableRequestIndex[successHash] = request;
                $.when(request).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            } else if (requestSettings.queBehavior === 'que') {
                runningRequest = queableRequestIndex[successHash] = queableRequestIndex[successHash] || app.ajaxRequest(requestSettings, dataObj);
                $.when(runningRequest).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            } else {
                $.when(app.ajaxRequest(requestSettings, dataObj)).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            }


        }
    };


    app.request.define = function (requestId, type, settings) {
        settings.requestId = requestId;
        settings.requestType = type;
        requestIndex[requestId] = settings;
    };

    app.request.mockData = function (requestId, inputData, mockData) {
        var successHash = hex_md5(requestId + JSON.stringify(inputData) + 'success');
        app.store.set(successHash, mockData);
    };

    window.app = app;

    return  _.extend(app, {
        store: {
            set: function (key, value) {
                app.dataIndex[key] = value;
            },
            get: function (key) {
                return app.dataIndex[key];
            },
            remove: function (key) {
                app.dataIndex[key] = null;
                delete app.dataIndex[key];
            },
            list: function () {
                _.each(app.dataIndex, function (value, key) {
                    console.log(key, value);
                });
            }
        }

    }, Backbone.Events);
});