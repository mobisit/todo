angular.module('todo.controllers', [])

.controller('TodoController', ['$scope', '$ionicModal', 'ProjectManager', '$ionicSideMenuDelegate', '$ionicListDelegate', 'Auth',
  function($scope, $ionicModal, ProjectManager, $ionicSideMenuDelegate, $ionicListDelegate, Auth){
  //$scope.login = Auth.login();
  /*Auth.onAuth(function(authData){
    $scope.authData = authData;
  });*/

  // Load or initialize projects
  $scope.projects = ProjectManager.projects();

  // Grab the last active, or the first project
//  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
  //$scope.activeProject = $scope.projects[0];  // TODO: revise

  // Called to select the given project
  $scope.selectProject = function(project, index){
    $scope.activeProject = project;
    //Projects.setLastActiveIndex(index);
    $scope.tasks = ProjectManager.tasksForProject(project);
    $ionicSideMenuDelegate.toggleLeft(false);
  };


  // Create task dialog modal
  $ionicModal.fromTemplateUrl('task-dialog.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Create project dialog modal
  $ionicModal.fromTemplateUrl('project-dialog.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the project dialog is submitted
  $scope.createProject = function(projectTitle){
    //var newProject = Projects.newProject(projectTitle);
    var newProjectId = ProjectManager.addProject(projectTitle);
    var newProject = $scope.projects.$getRecord(newProjectId);
    var index = $scope.projects.length-1;
    $scope.selectProject($scope.projects[index], index);
    $scope.leaveProjectDialog();

    projectTitle = "";
  };
  
  $scope.editTask = function(task){
    if(!$scope.activeProject || !task){
      return;
    }
    $scope.tasks.$save(task)
    $scope.leaveTaskDialog();
  };

  // Used to cache the empty form for Edit Dialog
  $scope.saveEmpty = function(task) {
    $scope.task = angular.copy(task);
  };

  $scope.addTask = function(task){
    if(!$scope.activeProject || !task){
      return;
    }
    ProjectManager.addTask($scope.activeProject, task);
    
    $scope.leaveTaskDialog();
  };

  // Open task dialog modal
  $scope.newTask = function() {
    $scope.task = {name:"", description:""};
    $scope.showTaskDialog('add');
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.leaveTaskDialog();
  };

  $scope.toggleProjects = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Open project dialog modal
  $scope.newProject = function() {
    $scope.projectTitle = "";
    $scope.showProjectDialog('add');
  };

  // Close the new task modal
  $scope.closeNewProject = function() {
    $scope.leaveProjectDialog();
  };

  $scope.showTaskDialog = function(action) {
    $scope.action = action;
    $scope.taskModal.show();
  };

  $scope.leaveTaskDialog = function() {
    // Remove dialog 
    $scope.taskModal.remove();
    // Reload modal template to have cleared form
    $ionicModal.fromTemplateUrl('task-dialog.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
//    $ionicListDelegate.closeOptionButtons();
  };

  $scope.showProjectDialog = function(action) {
    $scope.action = action;
    $scope.projectModal.show();
  };

  $scope.leaveProjectDialog = function() {
    // Remove dialog 
    $scope.projectModal.remove();
    // Reload modal template to have cleared form
    $ionicModal.fromTemplateUrl('project-dialog.html', function(modal) {
      $scope.projectModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  };

  $scope.showEditTask = function(task) {
    $scope.task = task;
    // Open dialog
    $scope.showTaskDialog('change');
  };

  $scope.projects.$loaded(function() {
    if ($scope.projects.length === 0) {
      $scope.createProject("Today");
    }
    $scope.selectProject($scope.projects[0],0);
  });

}]);