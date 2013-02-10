angular.module('TopicServices', ['ngResource']).
factory('Topic', function($resource) {
	var defaultParameters = actions = {}
	return $resource('/topic/:id', defaultParameters, actions)
})
