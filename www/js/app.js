///<reference path="typings/tsd.d.ts" />
angular.module('todo', ['ionic'])

.factory('Projects', function() {
	return {
		all: function() {
			var projectString = window.localStorage['projects'];
			if (projectString) {
				return angular.fromJson(projectString);
			}
			return [];
		},
		save: function(projects) {
			window.localStorage['projects'] = angular.toJson(projects);	
		},
		newProject: function(projectTitle) {
			return {
				title: projectTitle,
				tasks: []
			};
		},
		getLastActiveIndex: function() {
			return parseInt(window.localStorage['lastActiveProject']) || 0;
		},
		setLastActiveIndex: function(index) {
			window.localStorage['lastActiveProject'] = index;
		}
	}
})

.controller('TodoCtrl', function($scope, $ionicModal, $timeout, Projects) {
	var createProject = function(projectTitle) {
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save($scope.projects);
		$scope.selectProject(newProject, $scope.projects.length-1);
	}
	
	$scope.projects = Projects.all();
	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
	$scope.taskModal = {};
	
	$scope.newProject = function() {
		var projectTitle = prompt('Project name');
		if (projectTitle) {
			createProject(projectTitle);
		}
	}
	
	$scope.selectProject = function(project, index) {
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
	}
	
	$ionicModal.fromTemplateUrl('new-task.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.taskModal = modal;
		console.log('TodoCtrl: taskModal has been loaded');
	});
	
	$scope.createTask = function(task) {
		if (!$scope.activeProject || !task)
			return;
		$scope.activeProject.tasks.push({
			title: task.title
		});
		Projects.save($scope.projects);
		$scope.taskModal.hide();
		task.title = "";
	};
	
	$scope.deleteTask = function(task) {
		var i = $scope.activeProject.tasks.indexOf(task);
		$scope.activeProject.tasks.splice(i, 1);
		Projects.save($scope.projects);
	}
	
	$scope.newTask = function() {
		$scope.taskModal.show();
	};
	
	$scope.closeNewTask = function() {
		$scope.taskModal.hide();
	};
	
	$timeout(function() {
		if ($scope.projects.length == 0) {
			while(true) {
				var projectTitle = prompt('Your first project title:');
				if (projectTitle) {
					createProject(projectTitle);
					break;
				}
			}
		}
	})
});	