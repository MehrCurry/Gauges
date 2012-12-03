red = 'rgba(255, 0, 0, 0.7)';
red30 = 'rgba(255, 0, 0, 0.3)';
yellow = 'rgba(255, 255, 0, 0.7)';
green = 'rgba(0, 255, 0, 0.7)';

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
		name : mesurementId + ".InflightExchanges",
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
		} ],
		areas : [ {
			start : 8,
			end : 10,
			color : red30
		} ]

	}, {
		name : mesurementId + ".ExchangesFailed",
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
		name : mesurementId + ".Load01",
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
		} ],
		areas : [ {
			start : 8,
			end : 10,
			color : red30
		} ]
	}, {
		name : mesurementId + ".LastProcessingTime",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Last",
		unit : "ms",
		min : 0,
		max : 1000,
		sections : [ {
			start : 0,
			end : 300,
			color : green
		}, {
			start : 300,
			end : 800,
			color : yellow
		}, {
			start : 800,
			end : 1000,
			color : red
		} ],
		areas : [ {
			start : 800,
			end : 1000,
			color : red30
		} ]
	}, {
		name : mesurementId + ".MeanProcessingTime",
		instrumentKey : instrumentPrefix + id++,
		title : namePrefix +" Mean",
		unit : "ms",
		min : 0,
		max : 1000,
		sections : [ {
			start : 0,
			end : 300,
			color : green
		}, {
			start : 300,
			end : 800,
			color : yellow
		}, {
			start : 800,
			end : 1000,
			color : red
		} ],
		areas : [ {
			start : 800,
			end : 1000,
			color : red30
		} ]
	} ];
};

configurations = [];
configurations.addAll(configureCamelRoute("Camel.out","Out", "radial", 0));
configurations.addAll(configureCamelRoute("Camel.jmx", "JMX", "radial", 5));
configurations.addAll(configureCamelRoute("Camel.fetch", "WWW", "radial", 10));
configurations.addAll(configureCamelRoute("Camel.proxy", "Proxy", "radial", 15));

configurations.addAll([  {
	name : "System.memory.HeapMemoryUsage.used",
	instrumentKey : "bar0",
	title : "Heap",
	unit : "MB",
	min : 0,
	max : 500
}, {
	name : "System.memory.NonHeapMemoryUsage.used",
	instrumentKey : "bar1",
	title : "NonHeap",
	unit : "MB",
	min : 0,
	max : 200
} ]);