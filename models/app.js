(function () {
    'use strict';
    var mongoose = require('mongoose');

    var AppSchema = new mongoose.Schema({
            app_id:String,
            admin_email: String,
            admin_password: String,
            comment_ids: [],
            comments_count: Number,
            recommendation_count: Number,
            creation_date: Date
        },
        {collection: "App"}
    );

    module.exports = mongoose.model('User', AppSchema);
})();



