(function () {
    'use strict';
    var $q = require('q');
    var Comment = require('../models/comment');
    var App = require('../models/app');
    var random = require("random-js")();

    /**
     * Represents App Schema Model by app_id.
     * @function
     * @param {object} data - Contains app_id to retrieve app info according to this id.
     */
    var getAppInfo = function (data) {
        var defered = $q.defer();
        var selectedApp = App.findOne({
            app_id: data.app_id
        }, function (err, app) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(app._doc)
        });
        return defered.promise;
    };
    /**
     * Represents Increment recommendation_count for selected App.
     * @function
     * @param {object} data - Contains app_id to retrieve app info according to this id.
     */
    var incrementRecommendation = function (data) {
        var defered = $q.defer();
        var selectedApp = App.update({
            app_id: data.app_id
        }, {$inc: {recommendation_count: 1}}, function (err, app) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(app._doc)
        });
        return defered.promise;
    };
    /**
     * Getting Comment Lsit for selected App.
     * @function
     * @param {object} data - Contains app_id to retrieve app then retrieve comments according to comments_id array inner join.
     */
    var getCommentList = function (data) {
        var defered = $q.defer();
        var selectedApp = getAppInfo(data).then(function (result) {
            var commentList = Comment.find({
                _id: {$in: result.comment_ids}
            }, function (err, comment_list) {
                if (err)
                    defered.reject(err);
                else
                    defered.resolve(comment_list)
            });
        });

        return defered.promise;
    };
    /**
     * Creating New App with random app_id.
     * @function
     * @param {object} data - Contains admin_email.
     */
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
    /**
     * Creating New comment & insert comment id to app comment_ids array.
     * @function
     * @param {object} data - comment schema model.
     */
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
                    {$push: {"comment_ids": comment._id.toString()}, $inc: {comments_count: 1}},
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
    /**
     * Represents updating points_up and points_down for comment item.
     * @function
     * @param {object} data - Contains comment id & points count.
     */
    var updateCommentItem = function (data) {
        var defered = $q.defer();

        var selectedComment = Comment.update({
            _id: data._id
        }, {points_up: data.points_up, points_down: data.points_down}, function (err, app) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(app._doc)
        });
        return defered.promise;
    };
    module.exports = {
        createApp: createApp,
        postComment: createComment,
        getAppInfo: getAppInfo,
        getCommentList: getCommentList,
        incrementRecommendation: incrementRecommendation,
        updateCommentItem: updateCommentItem
    }
})();