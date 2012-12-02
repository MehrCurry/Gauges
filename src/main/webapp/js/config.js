red = 'rgba(255, 0, 0, 0.8)';
yellow = 'rgba(255, 255, 0, 0.8)';
green = 'rgba(0, 255, 0, 0.8)';

/**
 * Adds all the elements in the specified arrays to this array.
 */
Array.prototype.addAll = function() {
	for ( var a = 0; a < arguments.length; a++) {
		arr = arguments[a];
		for ( var i = 0; i < arr.length; i++) {
			this.push(arr[i]);
		}
	}
}

function configureCamelRoute(mesurementId, namePrefix, instrumentPrefix, id) {
	return [ {
		name : mesurementId + ".InflightExchanges.ZAEHLER",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Inflight",
		min : 0,
		max : 10,
		sections : [ {
			start : 0,
			end : 5,
			color : green
		}, {
			start : 5,
			end : 8,
			color : yellow
		}, {
			start : 8,
			end : 10,
			color : red
		} ]
	}, {
		name : mesurementId + ".ExchangesFailed.ZAEHLER",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Failed",
		min : 0,
		max : 100,
		sections : [ {
			start : 0,
			end : 100,
			color : red
		} ]
	}, {
		name : mesurementId + ".Load01.ZAEHLER",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Load01",
		min : 0,
		max : 10,
		sections : [ {
			start : 0,
			end : 5,
			color : green
		}, {
			start : 5,
			end : 8,
			color : yellow
		}, {
			start : 8,
			end : 10,
			color : red
		} ]
	}, {
		name : mesurementId + ".LastProcessingTime.ZAEHLER",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Last",
		unit : "ms",
		min : 0,
		max : 50,
		sections : [ {
			start : 0,
			end : 10,
			color : green
		}, {
			start : 10,
			end : 30,
			color : yellow
		}, {
			start : 30,
			end : 100,
			color : red
		} ]
	}, {
		name : mesurementId + ".MeanProcessingTime.ZAEHLER",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Mean",
		unit : "ms",
		min : 0,
		max : 50,
		sections : [ {
			start : 0,
			end : 10,
			color : green
		}, {
			start : 10,
			end : 30,
			color : yellow
		}, {
			start : 30,
			end : 100,
			color : red
		} ]
	} ];
};

configurations = [];
configurations.addAll(configureCamelRoute("Camel.out","Out", "radial", 0));
configurations.addAll(configureCamelRoute("Camel.jmx", "JMX", "radial", 5));

configurations.addAll([  {
	name : "System.memory.HeapMemoryUsage.used.ZAEHLER",
	instrumentKey : "bar0",
	title : "Heap",
	unit : "MB",
	min : 0,
	max : 500
}, {
	name : "System.memory.NonHeapMemoryUsage.used.ZAEHLER",
	instrumentKey : "bar1",
	title : "NonHeap",
	unit : "MB",
	min : 0,
	max : 200
} ]);