var defaultDesign = steelseries.FrameDesign.GLOSSY_METAL;
var defaultBackgroundColor = steelseries.BackgroundColor.LIGHT_GRAY;
var defaultLcdColor = steelseries.LcdColor.GREEN;
var defaultLedColor = steelseries.LedColor.GREEN;
var defaultKnobType = steelseries.KnobType.METAL_KNOW;
var defaultKnobStyle = steelseries.KnobStyle.SILVER;

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

function InstrumentConfiguration(parameter) {
	this.instrument = undefined;
	this.mappings = {};
	this.parameter = {
		maxValue : 100,
		thresholdVisible : false,
		minMeasuredValueVisible : true,
		maxMeasuredValueVisible : true,
		frameDesign : defaultDesign,
		backgroundColor : defaultBackgroundColor,
		lcdColor : defaultLcdColor,
		ledColor : defaultLedColor,
		knobType : defaultKnobType,
		knobStyle : defaultKnobStyle,
		digitalFont : true
	};
	this.addMapping = function(id, setter) {
		this.mappings[id] = setter;
	}

	this.setValue = function(key, value) {
		var setValue = this.mappings[key];
		if (setValue != undefined)
			setValue(this, value);
	}

	$.extend(true, this, parameter);
	this.addMapping(parameter.name, function(config, value) {
		config.instrument.setValueAnimated(value);
	});

}

function configureCamelRoute(mesurementId, namePrefix, instrumentPrefix, id) {
	result = [];

	var config = new InstrumentConfiguration({
		name : mesurementId + ".InflightExchanges",
		instrumentKey : instrumentPrefix + id++,
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

	});
	config.addMapping(mesurementId + ".ExchangesTotal",
			function(config, value) {
				config.instrument.setOdoValue(value);
			});
	result.push(config);

	var config = new InstrumentConfiguration({
		name : mesurementId + ".ExchangesFailed",
		instrumentKey : instrumentPrefix + id++,
		parameter : {
			titleString : namePrefix + " Failed",
			minValue : 0,
			maxValue : 100,
			useOdometer : true,
			odometerUseValue : true
		},
		sections : [ {
			start : 0,
			end : 100,
			color : red
		} ]
	});
	result.push(config);

	var config = new InstrumentConfiguration({

		name : mesurementId + ".Load01",
		instrumentKey : instrumentPrefix + id++,
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
	});
	result.push(config);

	var config = new InstrumentConfiguration({

		name : mesurementId + ".LastProcessingTime",
		instrumentKey : instrumentPrefix + id++,
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
	});
	result.push(config);

	var config = new InstrumentConfiguration({

		name : mesurementId + ".MeanProcessingTime",
		instrumentKey : instrumentPrefix + id++,
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
	});
	result.push(config);
	return result;
};

configurations = [];
/*
 * configurations.addAll(configureCamelRoute("Camel.out", "Out", "radial", 0));
 * configurations.addAll(configureCamelRoute("Camel.jmx", "JMX", "radial", 5));
 */
configurations.addAll(configureCamelRoute("Camel.fetch", "WWW", "radial", 0));
configurations
		.addAll(configureCamelRoute("Camel.proxy", "Proxy", "radial", 5));

configurations.addAll([ new InstrumentConfiguration({
	name : "System.memory.HeapMemoryUsage.used",
	instrumentKey : "bar0",
	parameter : {
		titleString : "Heap",
		unitString : "MB",
		minValue : 0,
		maxValue : 500
	}
}), new InstrumentConfiguration({
	name : "System.memory.NonHeapMemoryUsage.used",
	instrumentKey : "bar1",
	parameter : {
		titleString : "NonHeap",
		unitString : "MB",
		minValue : 0,
		maxValue : 200
	}
}), new InstrumentConfiguration({
	name : "System.gc.LastGcInfo.duration",
	instrumentKey : "bar2",
	parameter : {
		titleString : "GC Duration",
		unitString : "ms",
		minValue : 0,
		maxValue : 500
	},
	areas : [ {
		start : 300,
		end : 1000,
		color : red30
	} ]

}) ]);

var cfg=new InstrumentConfiguration({
	name : "Zockoll.Pac.WR",
	instrumentKey : "radial10",
	parameter : {
		titleString : "Leistung",
		unitString : "Watt",
		minValue : 0,
		maxValue : 6000,
		useOdometer: true
	}
});
cfg.addMapping("Zockoll.Ertrag.WR",
		function(config, value) {
			config.instrument.setOdoValue(value);
		});
configurations.push(cfg);
var cfg=new InstrumentConfiguration({
	name : "Zockoll.Gesamt.WR",
	instrumentKey : "radial11",
	parameter : {
		titleString : "Ertrag",
		unitString : "KWh",
		minValue : 0,
		maxValue : 5000
	}
});
configurations.push(cfg);
var cfg=new InstrumentConfiguration({
	name : "Zockoll.Udc1.WR",
	instrumentKey : "radial12",
	parameter : {
		titleString : "Spanung",
		unitString : "Volt",
		minValue : 0,
		maxValue : 500
	}
});
configurations.push(cfg);
var cfg=new InstrumentConfiguration({
	name : "Zockoll.Udc2.WR",
	instrumentKey : "radial13",
	parameter : {
		titleString : "Spanung",
		unitString : "Volt",
		minValue : 0,
		maxValue : 500
	}
});
configurations.push(cfg);



configurationMap = new Object();
valueMapping = {};
for ( var i = 0; i < configurations.length; i++) {
	config = configurations[i];
	configurationMap[config.instrumentKey] = config;
	for ( var key in config.mappings) {
		valueMapping[key] = config;
	}
}