requirejs.config({
	baseUrl : '../assets/js',
	urlArgs: "bust=" + (new Date()).getTime(),
	paths : {
		'jquery' : 'jquery-1.9.1/jquery.min',
		'bootstrap' : 'bootstrap/bootstrap.min'
	},
	shim : {
		'bootstrap' : {
			deps : [ 'jquery' ]
		}
	}
});

requirejs([ 'jquery', 'bootstrap' ], function($, _bootstrap) {
	alert("Ready!");
	return {};
});