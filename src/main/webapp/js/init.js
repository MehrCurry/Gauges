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

function init() {
	for ( var item = 1; item <= 8; item++) {
		var canv = document.createElement("canvas");
		canv.setAttribute('width', 20);
		canv.setAttribute('height', 20);

		canv.setAttribute('id', 'led' + item);
		document.body.appendChild(canv);
	}
	var br = document.createElement("br");
	document.body.appendChild(br);

	var table = document.createElement("table");
	document.body.appendChild(table);
	var row;

	for ( var item = 0; item < 32; item++) {
		if ((item % 8) == 0) {
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
			threshold : 100,
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

	for ( var item = 0; item < 8; item++) {
		if ((item % 4) == 0) {
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
		var bar = new steelseries.LinearBargraph(id, {
			width : 400,
			height : 140,
			maxValue : 100,
			threshold : 100,
			thresholdVisible : false,
			frameDesign : defaultDesign,
			backgroundColor : defaultBackgroundColor,
			lcdColor : defaultLcdColor,
			ledColor : defaultLedColor,
		});
		dashboard[id] = bar;
	}

	var led1 = new steelseries.Led('led1', {
		ledColor : steelseries.LedColor.RED_LED
	});

	var led2 = new steelseries.Led('led2', {
		ledColor : steelseries.LedColor.YELLOW_LED
	});

	var led3 = new steelseries.Led('led3', {
		ledColor : steelseries.LedColor.GREEN_LED
	});
	var led4 = new steelseries.Led('led4', {
		ledColor : steelseries.LedColor.BLUE_LED
	});

	var led5 = new steelseries.Led('led5', {
		ledColor : steelseries.LedColor.ORANGE_LED
	});

	var hostname = window.location.hostname;
	if (hostname=="")
		hostname="localhost";
	// var url = "ws://" + hostname + ":61614/stomp";
	var url = "ws://" + hostname + ":1616/solarmon";
	//var client = Stomp.client(url);
	var login = "";
	var passcode = "";

	try {
		error_callback = function(error) {
			// display the error's message header:
			alert(error.headers.message);
		};

		connect_callback = function() {
			// id = client.subscribe("/topic/observationsWeb", callback);
			led1.setLedOnOff(true);
		};

		// client.connect(login, passcode, connect_callback, error_callback);
		callback = function(message) {
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
		
		var client = new WebSocket(url);
		client.onmessage=callback;
		client.onopen=connect_callback;
	}

	catch (e) {

		alert("Fehler: " + e);

	}
}

function setValue(measurement) {
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
	return false;
}

function configureInstrument(config) {
	try {
		instrumentMapping[config.name]=config.instrumentKey;
		instrument = dashboard[instrumentMapping[config.name]];
		if (instrument != null) {
			if (config.title != null)
				instrument.setTitleString(config.title);
			if (config.unit != null)
				instrument.setUnitString(config.unit);
			if (config.max != undefined)
				instrument.setMaxValue(config.max.$);
			if (config.min != undefined)
				instrument.setMinValue(config.min.$);
			if (config.threshold != undefined)
				instrument.setThreshold(config.threshold.$);
			if (config.areas != "")
				instrument
						.setArea(convertToSection(config.areas["de.gzockoll.measurement.ColoredRange"]));
			if (config.sections != "")
				instrument
						.setSection(convertToSection(config.sections["de.gzockoll.measurement.ColoredRange"]));
		}
	} catch (e) {
		// alert("Fehler: " + e);
	}
}

function convertToSection(ranges) {
	var areas = Array();
	for ( var i = 0; i < ranges.length; i++) {
		var a = ranges[i];
		var section = new steelseries.Section(parseInt(a.range.start.$),
				parseInt(a.range.end.$), "rgba({0},{1},{2},{3})".format(
						a.rgba.red, a.rgba.green, a.rgba.blue,
						a.rgba.alpha / 256.0))
		areas.push(section);
	}
	return areas;

}

function configureAreas(instrument, ranges) {

}