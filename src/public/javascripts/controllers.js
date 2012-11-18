function IndexController($scope, $http) {
	$http.get('topic/').success(function(response) {
		$scope.topics = response.data
	})

	$scope.title = "Index"
}
