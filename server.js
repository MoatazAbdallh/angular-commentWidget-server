// =======================
// get the packages we need ============
// =======================
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var commentService = require('./services/comment-app');

//depending on Config Vars in Heroku for production only else depend on config.js
if (process.env.NODE_ENV == "production")
    mongoose.connect(process.env.MONGODB_URI);
else{
    var config = require('./config');
    mongoose.connect(config.database);
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function (callback) {
    console.log("Connection Success");
});
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
app.post('/create-comment-app', function (req, res) {
    commentService.createApp(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});
app.post('/post-comment', function (req, res) {
    commentService.postComment(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});

app.post('/get-app-info', function (req, res) {
    commentService.getAppInfo(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});
app.post('/get-comment-list', function (req, res) {
    commentService.getCommentList(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});
app.post('/increment-recommendation', function (req, res) {
    commentService.incrementRecommendation(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});
app.post('/updateCommentItem', function (req, res) {
    commentService.incrementRecommendation(req.body).then(function (result) {
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: result
        });
    }, function (err) {
        res.json({
            errorCode: 1,
            errorMessage: err.message,
            data: null
        });
    });
});
app.listen(port);
console.log('Magic happens at http://localhost:' + port);