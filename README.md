# angular-CommentWidget-server

CommentWidget Server Side using NodeJS & MongoDB

# Installation

clone Repo 

```javascript
$ git clone https://github.com/mo3taz-abdallh/angular-commentWidget-server.git
```

Add config.json in the root project folder if you want to test locally

```javascript
module.exports = {'database': 'MONGO_DB_URL'
};
```

Add MONGODB_URI in Config Var for production environment

# Running

```javascript
$ NODE_ENV=production node server.js
```

```javascript
$ NODE_ENV=development node server.js
```