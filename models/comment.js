(function () {
    'use strict';
    var mongoose = require('mongoose');

    var CommentSchema = new mongoose.Schema({
            user_name: String,
            comment_txt: String,
            replies: [],
            points_up: Number,
            points_down: Number,
            creation_date: Date
        },
        {collection: "Comment"}
    );

    module.exports = mongoose.model('Comment', CommentSchema);
})();



