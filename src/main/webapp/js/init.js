var defaultDesign = steelseries.FrameDesign.GLOSSY_METAL;
var defaultBackgroundColor = steelseries.BackgroundColor.LIGHT_GRAY;
var defaultLcdColor = steelseries.LcdColor.GREEN;
var defaultLedColor = steelseries.LedColor.GREEN;
var defaultKnobType = steelseries.KnobType.METAL_KNOW;
var defaultKnobStyle = steelseries.KnobStyle.SILVER;

var dashboard = new Object();

var instrumentMapping = new Object();

String.prototype.format = function() {
	var formatted = this;
	for (arg in arguments) {
		formatted = formatted.replace("{" + arg + "}", arguments[arg]);
	}
	return formatted;
};

String.prototype.endsWith = function(str) {
	return (this.match(str + "$") == str)
}

function initLED(parent) {
	for ( var item = 1; item <= 8; item++) {
		var canv = document.createElement("canvas");
		canv.setAttribute('width', 20);
		canv.setAttribute('height', 20);

		canv.setAttribute('id', 'led' + item);
		parent.appendChild(canv);
	}
	led1 = new steelseries.Led('led1', {
		ledColor : steelseries.LedColor.RED_LED
	});

	led2 = new steelseries.Led('led2', {
		ledColor : steelseries.LedColor.YELLOW_LED
	});

	led3 = new steelseries.Led('led3', {
		ledColor : steelseries.LedColor.GREEN_LED
	});
	led4 = new steelseries.Led('led4', {
		ledColor : steelseries.LedColor.BLUE_LED
	});

	led5 = new steelseries.Led('led5', {
		ledColor : steelseries.LedColor.ORANGE_LED
	});
}

function initRadials(parent) {
	var table = document.createElement("table");
	parent.appendChild(table);
	var row;

	for ( var item = 0; item < 30; item++) {
		if ((item % 5) == 0) {
			row = document.createElement("tr");
			table.appendChild(row);
		}
		var canv = document.createElement("canvas");
		var td = document.createElement("td");
		canv.setAttribute('width', 200);
		canv.setAttribute('height', 200);

		var id = 'radial' + item;
		canv.setAttribute('id', id);
		td.appendChild(canv);
		row.appendChild(td);
		var radial = new steelseries.Radial(id, {
			maxValue : 100,
			thresholdVisible : false,
			frameDesign : defaultDesign,
			backgroundColor : defaultBackgroundColor,
			lcdColor : defaultLcdColor,
			ledColor : defaultLedColor,
			knobType : defaultKnobType,
			knobStyle : defaultKnobStyle
		});
		dashboard[id] = radial;
	}
}

function initBars(parent) {
	var table = document.createElement("table");
	parent.appendChild(table);
	var row;
	for ( var item = 0; item < 15; item++) {
		if ((item % 5) == 0) {
			row = document.createElement("tr");
			table.appendChild(row);
		}
		var canv = document.createElement("canvas");
		var td = document.createElement("td");
		td.colSpan = "2";
		canv.setAttribute('width', 400);
		canv.setAttribute('height', 140);

		var id = 'bar' + item;
		canv.setAttribute('id', id);
		td.appendChild(canv);
		row.appendChild(td);
		var bar = new steelseries.Linear(id, {
			width : 140,
			height : 400,
			maxValue : 100,
			thresholdVisible : false
		});
		dashboard[id] = bar;
	}
}

function connect() {
	led1.blink(true);
	led1.setLedOnOff(true);
	var hostname = window.location.hostname;
	if (hostname == "")
		hostname = "localhost";
	var url = "ws://" + hostname + ":1616/monitoring";
	var login = "";
	var passcode = "";

	try {
		error_callback = function(error) {
			led1.setLedOnOff(false);
			alert(error.headers.message);
		};

		connect_callback = function() {
			led1.blink(false);
			led1.setLedOnOff(true);
		};

		close_callback = function() {
			led1.setLedOnOff(false);
			setTimeout(connect, 5000);
		}

		var client = new WebSocket(url);
		client.onmessage = onMessage;
		client.onopen = connect_callback;
		client.onclose = close_callback;
		client.onerror = error_callback;
	}

	catch (e) {
		alert("Fehler: " + e);
	}
}

function onMessage(message) {
	led2.setLedOnOff(true);
	setTimeout(function() {
		led2.setLedOnOff(false);
	}, 500);
	// called when the client receives a Stomp message from the server
	if (message.data) {
		// alert("got message with body " + message.body);
		var data = message.data;
		var payload = jQuery.parseJSON(data);
		if (payload["de.gzockoll.measurement.InstrumentConfiguration"] != undefined) {
			configureInstrument(payload["de.gzockoll.measurement.InstrumentConfiguration"]);
		}
		if (payload["de.gzockoll.observation.Measurement"] != undefined) {
			setValue(payload["de.gzockoll.observation.Measurement"]);
		}
	} else {
		// display.setText("got empty message")
	}
};
function setValue(measurement) {
	led3.setLedOnOff(true);
	setTimeout(function() {
		led3.setLedOnOff(false);
	}, 500);
	var key = measurement.subject.name + "." + measurement.type.$;
	var value = parseFloat(measurement.quantity.value.$);
	instrument = dashboard[instrumentMapping[key]];
	if (instrument != undefined && value != undefined && !isNaN(value)) {
		instrument.setValueAnimated(value);
	} else {
		console.log(value + " not a number");
	}
	;
}

function resetMinMax(gauge) {
	gauge.resetMinMeasuredValue();
	gauge.resetMaxMeasuredValue();
}

function resetAllMinMax() {
	for(var key in dashboard)
		resetMinMax(dashboard[key])
	return false;
}

function configureInstrument(config) {
	led4.setLedOnOff(true);
	setTimeout(function() {
		led4.setLedOnOff(false);
	}, 2000);
	try {
		instrumentMapping[config.name] = config.instrumentKey;
		instrument = dashboard[config.instrumentKey];
		if (instrument != null) {
			if (config.title != null)
				instrument.setTitleString(config.title);
			if (config.unit != null)
				instrument.setUnitString(config.unit);
			if (config.max != undefined)
				instrument.setMaxValue(config.max);
			if (config.min != undefined)
				instrument.setMinValue(config.min);
			if (config.threshold != undefined)
				instrument.setThreshold(config.threshold);
			if (config.areas != undefined)
				instrument.setArea(convertToSection(config.areas));
			if (config.sections != undefined)
				instrument.setSection(convertToSection(config.sections));
		}
	} catch (e) {
		alert("Fehler: " + e);
	}
}

function convertToSection(ranges) {
	var areas = Array();
	for ( var i = 0; i < ranges.length; i++) {
		var a = ranges[i];
		var section = new steelseries.Section(a.start, a.end, a.color)
		areas.push(section);
	}
	return areas;

}

function configureAreas(instrument, ranges) {

}

function init() {
	initLED(document.getElementById('leds'));
	initRadials(document.getElementById('radials'));
	initBars(document.getElementById('bars'));
	for ( var i = 0; i < configurations.length; i++)
		configureInstrument(configurations[i]);
	connect();
}