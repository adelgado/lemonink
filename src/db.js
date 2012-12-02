module.exports = (function () { 
	var client = require('redis').createClient()
	  , uuid   = require('node-uuid')

	var REDIS_HASH_KEY = "topic"

	client.on('error', function(err) {
		console.log('Erro do Redis: ' + err)
	})

	return {
		createTopic: function(topic) {
			return function (errback, callback) {
				var id = uuid.v4()

				client.hset(REDIS_HASH_KEY, id, JSON.stringify(topic), function(err, reply) {
				client.quit()

				topic.id = id
					console.log(topic)

				if (reply === 1) {
					callback(topic) 
				}   

				if (reply === 0) {
					errback(err)
				}   
			}) 
			}
		},  


		getAllTopics : function () {
			return function (callback, errback) {
				client.hgetall(REDIS_HASH_KEY, function(err, topics) {
					if (err !== null) {
						errback(err)
						return
					} 
				
					console.log(topics)

					var parsed_topics = []

					for (var id in topics) {
						var topic = JSON.parse(topics[id])
						topic.id = id
						parsed_topics.push(topic)
					}   


					callback(parsed_topics)
				}) 
			}
		},

		getTopicById: function(id, callback) {
			client.hget(REDIS_HASH_KEY, id, function(err, topic) {
				console.log(err)
				console.log(topic)
				if (err) {
					callback(err)
				}

				var topic = JSON.parse(topic)
				topic.id  = id

				callback(null, topic)
			})
		},
	}
})()
