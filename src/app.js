(function(){
	var express = require('express')
	, http    = require('http')
	, path    = require('path')
	, redis   = require('redis')
	, db      = require('./db')

	var app = express()

	//HTTP response codes
	var HTTP = {
		OK                    : 200,
		CREATED               : 201,
		BAD_REQUEST           : 400,
		INTERNAL_SERVER_ERROR : 500,
		NOT_IMPLEMENTED       : 501
	}

	app.use(function (req, res, next){
		res.jsonSuccess = function (httpCode, data){
			if (typeof httpCode === 'undefined') {
				res.json(HTTP.INTERNAL_SERVER_ERROR)
			}

			res.json(httpCode, {success : true, data: data})
		} 
		res.jsonError = function(httpCode, errMsg) {
			console.log(errMsg)
			res.json(httpCode, {success: false, err: errMsg})	
		}

		next()
	})

	
	app.configure(function(){
		app.set('port', process.env.PORT || 3000)
		app.set('views', __dirname + '/views')
		app.use(express.favicon())
		app.use(express.logger('dev'))
		app.use(express.bodyParser())
		app.use(express.methodOverride())
		app.use(app.router)
		app.use(express.static(path.join(__dirname, 'public')))
	})

	app.configure('development', function(){
		app.use(express.errorHandler())
	})


	function validateFields(fields) {
		return function(req, res, next) {
			fields.map(function(field) {
				if (typeof(req.body[field]) === 'undefined' ||
					req.body[field] === '') {
					res.json(HTTP.BAD_REQUEST, { success : false })
				}
			})

			next()
		}
	}


	app.get  ('/', function(req, res) {
		res.sendfile('views/index.html')
	})

	// Gets all the topics
	app.get  ('/topic',
		function (req, res) {
			db.getAllTopics()(function (data) {
				res.jsonSuccess(HTTP.OK, data)
			}, function (error) {
				res.jsonError(HTTP.INTERNAL_SERVER_ERROR, error)
			})
		}
	)

	// Creates a new discussion topic with one post associated with it
	app.post ('/topic',
		validateFields(['title', 'author', 'message']),
		function(req, res) {
			var topic = {
				title : req.body.title,
				author : req.body.author,
				message : req.body.message
			}
			db.createTopic(topic)(res.error, function(id) {
				res.header('Location', '/topic/' + id)
				res.jsonSuccess(HTTP.CREATED, { id : id })
			})
		}
	)

	
	

	// Gets a topic with all the posts associated with it
	app.get  ('/topic/:id',
		function(req, res) {
			console.log(db)
			db.getTopicById(req.params.id, function(err, topic) {
				if (err) {
					//
				}
				
				res.render('topic/view', { topic : topic })
			})
		}
	)


	// Replies to a specific topic
	app.post ('/topic/:id',
		validateFields(['author', 'message']),

		function(req, res) {
			res.send(HTTP.NOT_IMPLEMENTED)
		}
	)


	http.createServer(app).listen(app.get('port'), function(){
		console.log("Express server listening on port " + app.get('port'))
	})
})()
