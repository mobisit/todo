angular.module('todo.controllers', [])
.controller('TodoController', ['$scope', '$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', '$ionicListDelegate',
  function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicListDelegate){
  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to select the given project
  $scope.selectProject = function(project, index){
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
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

  // Called when the form is submitted
  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task){
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.leaveTaskDialog();

    // inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  // Called when the project dialog is submitted
  $scope.createProject = function(projectTitle){
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    $scope.projectModal.hide();

    projectTitle = "";
  };
  
  // Used to cache the empty form for Edit Dialog
  $scope.saveEmpty = function(title) {
    $scope.title = angular.copy(title);
  };

  $scope.addTask = function(title){
    var newTask = {};
    newTask.title = title;
    createTask(newTask);
  };

  // Open task dialog modal
  $scope.newTask = function() {
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
    $scope.projectModal.show();
  };

  // Close the new task modal
  $scope.closeNewProject = function() {
    $scope.projectModal.hide();
  };

/*
  // Define item buttons
  $scope.itemButtons = [{
    text: 'Delete',
    type: 'button-assertive',
    onTap: function(task) {
      $scope.removeTask(task);
    }
  }, {
    text: 'Edit',
    type: 'button-calm',
    onTap: function(task) {
      $scope.showEditTask(task);
    }
  }];
*/
/*
  $scope.removeTask = function(task) {
    // Search & Destroy item from list
    if(!$scope.activeProject || !task){
      return;
    }
    $scope.activeProject.tasks.splice($scope.list.indexOf(task), 1);
    // Save list in factory
    Projects.save($scope.projects);
  }
*/
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
  };

  $scope.moveTask = function(task, fromIndex, toIndex){
    $scope.activeProject.tasks.splice(fromIndex, 1);
    $scope.activeProject.tasks.splice(toIndex, 0, task);
  };

  $scope.showEditTask = function(task) {

    // Remember edit item to change it later
    $scope.tmpEditTask = task;

    // Preset form values
    $scope.title = task.title;
    // Open dialog
    $scope.showTaskDialog('change');
  };

  $scope.editTask = function(title){
    var item = {};
    if(!$scope.activeProject || !title){
      return;
    }

    item.title = title;

    var editIndex = $scope.activeProject.tasks.indexOf($scope.tmpEditTask);

    $scope.activeProject.tasks[editIndex] = item;
    Projects.save($scope.projects);

    $scope.leaveTaskDialog();
  };

  // Try to create the first project, make sure to defer 
  // this by using $timeout so everything is initialized properly
  $timeout(function(){
    if($scope.projects.length == 0){
      while(true){
        var projectTitle = prompt('Your first project title:');
        if(projectTitle){
          createProject(projectTitle);
          break;
        }
      }
    }
  });
}]);