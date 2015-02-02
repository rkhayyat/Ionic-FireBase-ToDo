// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var example=angular.module('starter', ['ionic','firebase']);
var fb = null;

example.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    fb = new Firebase("https://<my-firebase-URL>.firebaseio.com/");
  });
});

example.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state("login",{
			url:"/login",
			templateUrl:"templates/login.html",
			controller:"LoginController"
		})
		.state("todo",{
			url:"/todo",
			templateUrl:"templates/todo.html",
			controller:"TodoController"
		})
		$urlRouterProvider.otherwise("/login");
});


example.controller("LoginController",function($scope,$firebaseAuth,$location){
	
	$scope.login=function(username,password){
		var fbAuth = $firebaseAuth(fb);
		fbAuth.$authWithPassword({
  			"email": username,
  			"password": password
		}).then(function(authData) {
			$location.path("/todo");
		}).catch(function(error) {
			alert(error);			
		});
		
	}

	$scope.register=function(username,password){
		fbAuth = $firebaseAuth(fb);
		fbAuth.$createUser(username,password).then(function() {
			return fbAuth.$authWithPassword({
  			"email": username,
  			"password": password
			});			
		}).then(function(authData) {
			$location.path("/todo");
		}).catch(function(error){
			alert(error);			
		});
	}
	
	
});


example.controller("TodoController", function($scope, $firebase, $ionicPopup) {
 
    $scope.list = function() {
    fbAuth = fb.getAuth();
    if(fbAuth) {
        var sync = $firebase(fb.child("users/" + fbAuth.uid));
        var syncObject = sync.$asObject();
        syncObject.$bindTo($scope, "data");
    	}
	}
 
 	$scope.create = function() {
	    $ionicPopup.prompt({
	        title: 'Enter a new TODO item',
	        inputType: 'text'
	    })
	    .then(function(result) {
	        if(result !== "") {
	            if($scope.data.hasOwnProperty("todos") !== true) {
	                $scope.data.todos = [];
	            }
	            $scope.data.todos.push({title: result});
	        } else {
	            console.log("Action not completed");
	        }
	    });
	}
	

	$scope.onItemDelete=function(id){
    		
    		$ionicPopup.confirm({
    			title:'Confirm Delete',
    			content:'Are you sure'
    		}).then(function(res) {
     		if(res) {    			
     			$scope.data.todos.splice(id,1);
     			console.log('You are sure');
     		} else {
       			console.log('You are not sure');
     			}
   			}
   		)}


      $scope.onItemEdit=function(id){
  		
    		$ionicPopup.prompt({
   				title: 'Edit Task',
   				subTitle: 'Enter new task', // String (optional). The sub-title of the popup.
   				inputType: 'text',
   				inputPlaceholder: 'Your task'
    		}).then(function(res) {
     			console.log('You edited the task');
     			$scope.data.todos.splice(id,1,{title: res});

   			}
   		)}
    
   	$scope.moveItem=function(item,fromIndex,toIndex){
    
    		$scope.data.todos.splice(fromIndex,1);    		
    		$scope.data.todos.splice(toIndex,0,item);
     }
 
});

