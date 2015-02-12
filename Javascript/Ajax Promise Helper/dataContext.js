// has a dependency on jquery
//  module pattern
var fncNS = fncNS || {};

fncNS.dataContext = (function ($) {

    // private variables

    // private functions
    var get = function (url, isAsync, data) {
        return $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: isAsync
        });

    };

    var put = function (url, isAsync, model) {
        return $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: model,
            async: isAsync
        });
    };

    var post = function (url, isAsync, model) {
        return $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: model,
            async: isAsync
        });
    };

    var postFile = function (url, data) {
        return $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: false,
            processData: false,
            data: data
        });
    };

    var remove = function (url, isAsync) {
        return $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: isAsync
        });
    };

    var removeData = function (url, data) {
        return $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            data: data,
            contentType: 'application/json; charset=utf-8',
        });
    };

    // public
    return {
        get: function (url, data) {
            return get(url, true, data);
        },

        getSync: function (url, data) {
            return get(url, false, data);
        },

        post: function (url, data) {
            return post(url, true, data);
        },

        postSync: function (url, data) {
            return post(url, false, data);
        },

        postFile: function (url, data) {
            return postFile(url, data);
        },

        put: function (url, model) {
            return put(url, true, model);
        },

        putSync: function (url, model) {
            return put(url, false, model);
        },

        remove: function (url) {
            return remove(url, true);
        },

        removeSync: function (url) {
            return remove(url, false);
        },

        removeData: function(url, data) {
            return removeData(url, data);
        }
    };
})($);
