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

function initDisplays(parent) {
	var table = document.createElement("table");
	parent.appendChild(table);
	var row;

	for ( var item = 0; item < 6; item++) {
		if ((item % 6) == 0) {
			row = document.createElement("tr");
			table.appendChild(row);
		}
		var canv = document.createElement("canvas");
		var td = document.createElement("td");
		canv.setAttribute('width', 200);
		canv.setAttribute('height', 100);

		var id = 'display' + item;
		canv.setAttribute('id', id);
		td.appendChild(canv);
		row.appendChild(td);
		config = configurationMap[id] != undefined ? configurationMap[id] : {};
		var displaySingle = new steelseries.DisplaySingle(id, config);
		config.instrument = displaySingle;
		dashboard[id] = displaySingle;
	}
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
		config = configurationMap[id] != undefined ? configurationMap[id] : {};
		var instrument = new steelseries.Radial(id, config.parameter);
		if (config.areas != undefined)
			instrument.setArea(convertToSection(config.areas));
		if (config.sections != undefined)
			instrument.setSection(convertToSection(config.sections));
		config.instrument = instrument;
		dashboard[id] = instrument;
	}
}

function initBars(parent) {
	var table = document.createElement("table");
	parent.appendChild(table);
	var row;
	for ( var item = 0; item < 6; item++) {
		if ((item % 2) == 0) {
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
		config = configurationMap[id] != undefined ? configurationMap[id] : {};
		var instrument = new steelseries.Linear(id, config.parameter);
		config.instrument = instrument;
		dashboard[id] = instrument;
	}
}

function connect() {
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
			led1.setLedOnOff(true);
		};

		close_callback = function() {
			led1.setLedOnOff(false);
			setTimeout(connect, 2000);
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
	trigger(led2);
	if (message.data) {
		var data = message.data;
		var payload = jQuery.parseJSON(data);
		setValue(payload.key, payload.value);

	}
};

function setValue(key, value) {
	trigger(led3);
	var config = valueMapping[key];
	if (config != undefined && value != undefined && !isNaN(value)) {
		trigger(led4);
		config.setValue(key, value);
	}
}

function trigger(led) {
	led.setLedOnOff(true);
	setTimeout(function() {
		led.setLedOnOff(false);
	}, 500);

}

function resetMinMax(gauge) {
	gauge.resetMinMeasuredValue();
	gauge.resetMaxMeasuredValue();
}

function resetAllMinMax() {
	for ( var key in dashboard)
		resetMinMax(dashboard[key])
	return false;
}

function configureInstrument(config) {
	trigger(led5);
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

function init() {
	initLED(document.getElementById('leds'));
	// initDisplays(document.getElementById('displays'));
	initRadials(document.getElementById('radials'));
	initBars(document.getElementById('bars'));
	for ( var i = 0; i < configurations.length; i++) {
		config = configurations[i];
		instrumentMapping[config.name] = config;
	}
	connect();
}