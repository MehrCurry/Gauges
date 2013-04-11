requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../assets/js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
	    jquery: '../lib/jquery',
	    'jquery-ui': '../lib/jquery-ui',
	    angular: '../lib/angular',
	    'angular-ui': '../lib/angular-ui',
	    bootstrap: '../lib/bootstrap',
	    highcharts: '../lib/highcharts',
	    'angular-ui': '../lib/angular-ui',
	    tween: '../lib/tween',
	    steelseries: '../lib/steelseries',
    },
	shim: {
	    'bootstrap': [ 'jquery-1.9.1' ],
		'steelseries': ['tween'],
		'solar': ['helper','angular.min'],
	  }
});
// Start the main app logic.
requirejs(['bootstrap','angular','solar','steelseries'],
function   (bootstrap,angular,solar,steelseries) {
	console.log('Ready!');
});
