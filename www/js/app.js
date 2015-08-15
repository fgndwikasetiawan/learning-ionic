///<reference path="typings/tsd.d.ts" />

angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $ionicModal) {
	$scope.tasks = [];
	
	$ionicModal.fromTemplateUrl('new-task.html', function(modal) {
		$scope.taskModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$scope.createTask = function(task) {
		$scope.tasks.push({
			title: task.title
		});
		$scope.taskModal.hide();
		task.title = "";
	};
	
	$scope.newTask = function() {
		$scope.taskModal.show();
	};
	
	$scope.newTask = function() {
		$scope.taskModal.hide();
	};
});