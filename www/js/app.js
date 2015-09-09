// Ionic Todo App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'todo' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'todo.services', 'todo.controllers'])
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('TaskList', {
      url: '/task',
      templateUrl: 'task-template.html',
      controller: 'TodoController'
    });
    $urlRouterProvider.otherwise('/task');
  });