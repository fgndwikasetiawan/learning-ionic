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

.controller('TodoCtrl', function($scope, $ionicModal, $timeout, Projects, $ionicSideMenuDelegate) {
	var createProject = function(projectTitle) {
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save($scope.projects);
		$scope.selectProject(newProject, $scope.projects.length-1);
	}
	
	var promptFirstProject = function() {
		if ($scope.projects.length == 0) {
			while(true) {
				var projectTitle = prompt('Your first project title:');
				if (projectTitle) {
					createProject(projectTitle);
					break;
				}
			}
		}
	};
	
	$scope.projects = Projects.all();
	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
	$scope.taskModal = {};
	$scope.deleteProjectModal = {};
	
	$ionicModal.fromTemplateUrl('new-task.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.taskModal = modal;
		console.log('TodoCtrl: taskModal has been loaded');
	});
	
	$ionicModal.fromTemplateUrl('delete-project.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.deleteProjectModal = modal;
		console.log('TodoCtrl: deleteProjectModal has been loaded');
	})
	
	$scope.newProject = function() {
		var projectTitle = prompt('Project name');
		if (projectTitle) {
			createProject(projectTitle);
		}
	}
	
	$scope.selectProject = function(project, index) {
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
		$ionicSideMenuDelegate.toggleLeft();
	}
	
	
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
	
	
	$scope.showDeleteProjectModal = function(project) {
		$scope.deletedProject = project;
		$scope.deleteProjectModal.show();

	}
	
	$scope.deleteProject = function(project) {
		var i = $scope.projects.indexOf(project);
		$scope.projects.splice(i, 1);
		Projects.save($scope.projects);
		$scope.deletedProject = null;	
		if ($scope.projects.length == 0) {
			promptFirstProject();
		}
		else {
			$scope.selectProject($scope.projects[0], 0);
		}
		$scope.closeDeleteProjectModal();
	}
	
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
	
	$scope.closeDeleteProjectModal = function() {
		$scope.deleteProjectModal.hide();
		$ionicSideMenuDelegate.toggleLeft();
	}
	
	$scope.toggleSidemenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
	
	
	$timeout(promptFirstProject)
});	