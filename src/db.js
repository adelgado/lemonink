module.export = (function () { 
	var client = require('redis').createServer()

	return {
		createTopic: function(topic) {
			var id = uuid.v4()

			return function (errback, callback) {
				client.hset("topic", id, JSON.stringify(topic), function(err, reply) {
				client.quit()

				if (reply === 1) {
					callback(id) 
				}   

				if (reply === 0) {
					errback(err)
				}   
			}) 
			}
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
		},

		getTopicById : function(id, callback) {
			client.hget("topic", id, function(err, topic) {
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
