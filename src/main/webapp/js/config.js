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

defaults = {
	maxValue : 100,
	thresholdVisible : false,
	minMeasuredValueVisible : true,
	maxMeasuredValueVisible : true,
	frameDesign : defaultDesign,
	backgroundColor : defaultBackgroundColor,
	lcdColor : defaultLcdColor,
	ledColor : defaultLedColor,
	knobType : defaultKnobType,
	knobStyle : defaultKnobStyle
}

function configureCamelRoute(mesurementId, namePrefix, instrumentPrefix, id) {
	return [ {
		name : mesurementId + ".InflightExchanges",
		instrumentKey : instrumentPrefix + id++,
		setter : {
			key:mesurementId + ".InflightExchanges",
			setValue : function(value) {
				instrument.setValueAnimated(value);
			}			
		},
		parameter : {
			titleString : namePrefix + " Inflight",
			minValue : 0,
			maxValue : 10,
			useOdometer : true
		},
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
		name : mesurementId + ".ExchangesTotal",
		instrumentKey : instrumentPrefix + id - 1,
		setValue : function(value) {
			instrument.setOdoValue(value);
		},
	}, {
		name : mesurementId + ".ExchangesFailed",
		instrumentKey : instrumentPrefix + id++,
		setValue : function(value) {
			instrument.setValueAnimated(value);
		},
		parameter : {
			titleString : namePrefix + " Failed",
			minValue : 0,
			maxValue : 100
		},
		sections : [ {
			start : 0,
			end : 100,
			color : red
		} ]
	}, {
		name : mesurementId + ".Load01",
		instrumentKey : instrumentPrefix + id++,
		setValue : function(value) {
			instrument.setValueAnimated(value);
		},
		parameter : {
			titleString : namePrefix + " Load01",
			minValue : 0,
			maxValue : 10
		},
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
		setValue : function(value) {
			instrument.setValueAnimated(value);
		},
		parameter : {
			titleString : namePrefix + " Last",
			unitString : "ms",
			minValue : 0,
			maxValue : 1000
		},
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
		setValue : function(value) {
			instrument.setValueAnimated(value);
		},
		parameter : {
			titleString : namePrefix + " Mean",
			unitString : "ms",
			minValue : 0,
			maxValue : 1000
		},
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
configurations.addAll(configureCamelRoute("Camel.out", "Out", "radial", 0));
configurations.addAll(configureCamelRoute("Camel.jmx", "JMX", "radial", 5));
configurations.addAll(configureCamelRoute("Camel.fetch", "WWW", "radial", 10));
configurations
		.addAll(configureCamelRoute("Camel.proxy", "Proxy", "radial", 15));

configurations.addAll([ {
	name : "System.memory.HeapMemoryUsage.used",
	instrumentKey : "bar0",
	setValue : function(value) {
		instrument.setValueAnimated(value);
	},
	parameter : {
		titleString : "Heap",
		unitString : "MB",
		minValue : 0,
		maxValue : 500
	}
}, {
	name : "System.memory.NonHeapMemoryUsage.used",
	instrumentKey : "bar1",
	setValue : function(value) {
		instrument.setValueAnimated(value);
	},
	parameter : {
		titleString : "NonHeap",
		unitString : "MB",
		minValue : 0,
		maxValue : 200
	}
} ]);

configurationMap = new Object();

for ( var i = 0; i < configurations.length; i++) {
	config = configurations[i];
	config.parameter = $.extend({}, defaults, config.parameter);
	configurationMap[config.instrumentKey] = config;
}