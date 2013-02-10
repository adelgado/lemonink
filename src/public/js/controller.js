angular.module('Lemonink', ['TopicServices'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/',
		{ controller  : HomeController
		, templateUrl : '/partial/home.html'
		}).
	when('/topic',
		{ controller  : ListTopicController
		, templateUrl : '/partial/topic/list.html'
		}).
	when('/topic/:id',
		{ controller  : ViewTopicController
		, templateUrl : '/partial/topic/view.html'
		}).
	when('/topics/new',
		{ controller  : CreateTopicController
		, templateUrl : '/partial/topic/new.html'
		}).
	otherwise({redirectTo : '/'})
}])
.config(['$locationProvider', function($locationProvider) {
}])

function HomeController($scope) {
	$scope.title = "Lemonink"
}

function ListTopicController($scope, Topic) {
	$scope.topics = Topic.query() 
}

function ViewTopicController($scope, Topic) {
	$scope.topic = Topic.get({ id : this._id }) 
}

function CreateTopicController($scope, $location, Topic) {
	$scope.create = function() {
		Topic.save($scope.topic, function(topic) {
			console.log(topic)
			$location.path('/topic/' + topic.id)
		})
	}
}
