///<reference path="typings/tsd.d.ts" />
angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $ionicModal) {
	$scope.tasks = [];
	$scope.taskModal = {};
	$ionicModal.fromTemplateUrl('new-task.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.taskModal = modal;
		console.log('TodoCtrl: taskModal has been loaded');
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
	
	$scope.closeNewTask = function() {
		$scope.taskModal.hide();
	};
});	