module.export = (function () { 
	//var client = require('redis').createServer()

	return {
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
