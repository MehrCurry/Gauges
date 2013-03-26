requirejs.config({
	paths: {
        "bootstrap": "bootstrap",
        "jquery": "jquery-1.9.1",
        "highcharts": "highcharts"
    },
    shim: {
        "bootstrap": {
          deps: ["jquery"],
          exports: "$.fn.popover"
        }
    },
    enforceDefine: true
});

require(["jquery","highcharts","helper","charts","init","bootstrap","solarlog_helper","tween-min","steelseries-min"], function($,highcharts,steelseries) {
    alert("Ready!");
	//This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});