
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the 
 * last active project index.
 */
angular.module('todo.services', ["firebase"])
.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//todobyionic.firebaseio.com/users");
  var auth = $firebaseAuth(usersRef);
  return {
    login: function() {
      auth.$authWithOAuthRedirect("facebook").then(function(authData) {
        // User successfully logged in
      }).catch(function(error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          auth.$authWithOAuthPopup("facebook").then(function(authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            console.log(authData);
          });
        } else {
          // Another error occurred
          console.log(error);
        }
      });
    },
    onAuth: function(authenticate){
        auth.$onAuth(function(authData) {
          if (authData === null) {
            console.log("Not logged in yet");
          } else {
            console.log("Logged in as", authData.uid);
          }
          authenticate(authData); 
        });
    }
  }
})
.factory("ProjectManager", function($firebaseArray){
  var ref = new Firebase("https://todobyionic.firebaseio.com");

  return {
    projects: function(){
      var projectsRef = ref.child("projects");
      return $firebaseArray(projectsRef);
    },
    tasks: function(){
      var tasksRef = ref.child("tasks");
      return $firebaseArray(tasksRef);
    },
    addProject: function(projectName){
      var projectsRef = ref.child("projects");
      var newProjectRef = projectsRef.push({
        name: projectName,
        archived: false
      });
      return newProjectRef.key();
    },
    editProject: function(recordOrIndex){
      return projects.$save(recordOrIndex);
    },
    deleteProject: function(recordOrIndex){
      return projects.$remove(recordOrIndex);
    },
    tasksForProject: function(projectRecord){
      var query = ref.child("tasks").orderByChild("project").equalTo(projectRecord.$id);
      return $firebaseArray(query);
    },
    addTask: function(projectRecord, task){
      var projectId = projectRecord.$id;
      var tasksRef = ref.child("tasks");
      var newTaskRef = tasksRef.push({
        name: task.name,
        description: task.description,
        completed: false,
        project: projectId
      }, function(error){
        if(error){
          // Handle Error 
        } else {
          /*var projectTasksRef = ref.child("projects").child(projectId).child("tasks");
          var newTaskId = newTaskRef.key();
          projectTasksRef.push({
            newTaskId: true
          });*/
        }
      });
    }
  }
});