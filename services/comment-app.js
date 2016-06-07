(function () {
    'use strict';
    var $q = require('q');
    var Comment = require('../models/comment');
    var App = require('../models/app');
    var random = require("random-js")();

    var getAppInfo = function (data) {
        var defered = $q.defer();
        var selectedApp = App.findOne({
            app_id:data.app_id
        },function (err, app) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(app._doc)
        });
        return defered.promise;
    };

    var createApp = function (data) {
        var defered = $q.defer();
        var newApp = App({
            app_id: random.string(5),
            admin_email: data.admin_email,
            comment_ids: [],
            comments_count: 0,
            recommendation_count: 0,
            creation_date: new Date()
        });
        newApp.save(function (err, model) {
            if (err)
                defered.reject(err);
            else
            defered.resolve(model._doc)
        });
        return defered.promise;

    };

    var createComment = function (data) {
        var defered = $q.defer();

        var newComment = Comment({
            user_name: data.user_name,
            comment_txt: data.comment_txt,
            points_up: 0,
            points_down: 0,
            creation_date: new Date()
        });
        newComment.save(function (err, comment) {
            if (err)
                defered.reject(err);
            else {
                var selectedApp = App.update(
                    {app_id: data.app_id},
                    {$push: {"comment_ids": comment._id.toString()}},
                    function (err, model) {
                        if (err)
                            defered.reject(err);
                        else
                            defered.resolve(comment);
                    }
                );
            }
        });
        return defered.promise;
    };

    module.exports = {
        createApp: createApp,
        postComment: createComment,
        getAppInfo: getAppInfo
    }
})();