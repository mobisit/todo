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
    Projects.addTask($scope.activeProject, task);
    /*$scope.activeProject.tasks.push({
      title: task.title
    });*/
    $scope.leaveTaskDialog();

    //Projects.save($scope.activeProject);

    task.title = "";
  };

  // Called when the project dialog is submitted
  $scope.createProject = function(projectTitle){
    var newProject = Projects.newProject(projectTitle);
    //$scope.projects.push(newProject);
    //Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    if($scope.projectModal !== undefined)
      $scope.projectModal.hide();

    projectTitle = "";
  };
  
  $scope.editTask = function(title){
    var item = {};
    if(!$scope.activeProject || !title){
      return;
    }

    item.title = title;

    var editIndex = $scope.activeProject.tasks.indexOf($scope.tmpEditTask);

    $scope.activeProject.tasks[editIndex] = item;
    Projects.save($scope.activeProject);

    $scope.leaveTaskDialog();
  };

  // Used to cache the empty form for Edit Dialog
  $scope.saveEmpty = function(title) {
    $scope.title = angular.copy(title);
  };

  $scope.addTask = function(title){
    var newTask = {};
    newTask.title = title;
    newTask.done = false;
    $scope.createTask(newTask);
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


  // Try to create the first project, make sure to defer 
  // this by using $timeout so everything is initialized properly
  $timeout(function(){
    $scope.projects.$loaded()
      .then(function(x) {
        if(x.length === 0){
          $scope.newProject();
        }
      })
      .catch(function(error) {
        alert("network is not stable, please retry");
      });
  });
}]);