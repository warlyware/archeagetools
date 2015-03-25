(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var myApp = angular.module('myApp', ['ui.router', 'appCtrl', 'firebase']);

var appCtrl = angular.module('appCtrl', ['firebase'])
	.constant('FIREBASE_URL', 'https://wixiw.firebaseio.com/');

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to...
	$urlRouterProvider.otherwise("/home");

	// States
	$stateProvider
    .state('home', {
		url: '/home',
		controller: 'HomeCtrl',
		templateUrl: 'views/home.html'
	});
}]);
var test = function() {
	console.log("this is a test!");
}

test();
myApp.controller('HomeCtrl', ['$scope', '$rootScope', '$firebase', '$state', '$stateParams', 'FIREBASE_URL', function($scope, $rootScope, $firebase, $state, $stateParams, FIREBASE_URL) {

}]);
},{}]},{},[1])