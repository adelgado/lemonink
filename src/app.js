(function(){
	var express = require('express')
	, http    = require('http')
	, path    = require('path')
	, redis   = require('redis')
	, uuid    = require('node-uuid')

	var app = express()

	app.use(function (req, res, next){
		res.jsonSuccess = function (httpCode, data){
			res.json(httpCode, {success : true, data: data})
		} 
		res.jsonError = function(httpCode, data) {
			res.json(httpCode, {success: false, err: errMsg})	
		}

		next()
	})

	var client = redis.createClient()

	var db = {
		createTopic: function(topic, callback) {
			var id = uuid.v4()
			client.hset("topic", id, JSON.stringify(topic), function(err, reply) {
				client.quit()

				if (reply === 1) {
					callback(null, id)
				}

				if (reply === 0) {
					callback(err)
				}
			})
		},

		getAllTopics : function(callback) {
			client.hgetall("topic", function(err, topics) {
				if (err) {
					callback(err, {success: false})
				}

				var parsed_topics = []
				for (var id in topics) {
					var topic = JSON.parse(topics[id])
					topic.id = id
					parsed_topics.push(topic)
				}

				callback(null, parsed_topics)
			})
		}
	}

	//HTTP response codes
	var HTTP = {
		OK              : 200,
		CREATED         : 201,
		BAD_REQUEST     : 400,
		NOT_IMPLEMENTED : 501
	}

	app.configure(function(){
		app.set('port', process.env.PORT || 3000)
		app.set('views', __dirname + '/views')
		app.set('view engine', 'hjs')
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


	app.get  ('/', function(req, res) { res.redirect('/topic') })


	// Creates a new discussion topic with one post associated with it
	app.post ('/topic',
		validateFields(['title', 'author', 'message']),
		function(req, res) {
			var topic = {
				title : req.body.title,
				author : req.body.author,
				message : req.body.message
			}

			db.createTopic(topic, function(err, id) {
				if (err) {
					res.jsonError(HTTP.BAD_REQUEST, { error : err })
				}

				res.header('Location', '/topic/' + id)
				res.jsonSuccess(HTTP.CREATED, { id : id })
			})
		}
	)

	
	// Gets all the topics
	app.get  ('/topic',
		function (req, res) {
			db.getAllTopics(function(err, topics) {
				if (err) {
					//
				}

				res.render('topic/list', {
					topics: topics
				})
			})
		}
	)

	// Gets a topic with all the posts associated with it
	app.get  ('/topic/:id',
		function(req, res) {
			res.send(HTTP.NOT_IMPLEMENTED)
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
