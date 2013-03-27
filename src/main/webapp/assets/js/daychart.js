(function(Highcharts) {
	function loadScript(sScriptSrc, oCallback) {
		var oHead = document.getElementsByTagName('head')[0];
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.src = sScriptSrc;
		// most browsers
		oScript.onload = oCallback;
		// IE 6 & 7
		oScript.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				oCallback();
			}
		}
		oHead.appendChild(oScript);
	}
	var update = function() {
		m = new Array();
		mi = 0;
		loadScript(
				'http://monitoring.norderstedt-energie.de/1064/min_day.js?nocache',
				function() {
					var today = new Date();
					var tagesSoll = Math.round(SollYearKWP
							* AnlagenKWP
							/ 10
							* sollMonth[2]
							/ (10000 * getDaysInMonth(today.getFullYear(),
									today.getMonth())) * 10) / 10;
					var ac = new Array();
					var dc1 = new Array();
					var dc2 = new Array();
					var ertrag = new Array();
					var u1 = new Array();
					var u2 = new Array();
					var temp = new Array();
					var soll = new Array();
					var categories = new Array();
					var data=new Array();
					for (i = mi - 1; i >= 0; i--) {
						var parts = m[i].split('|');
						var date = dateFromString(parts[0]);
						var values = parts[1].split(';');
						var dataPoint = {
							date: date,	
							ac : parseFloat(values[0]),
							dc1 : parseFloat(values[1]),
							dc2 : parseFloat(values[2]),
							ertrag : parseFloat(values[3] / 1000.0),
							u1 : parseFloat(values[4]),
							u2 : parseFloat(values[5])
						};
						data.push(dataPoint);
						ac.push([ dataPoint.date, dataPoint.ac ]);
						dc1.push([ dataPoint.date, dataPoint.dc1 ]);
						dc2.push([ dataPoint.date, dataPoint.dc2 ]);
						ertrag.push([ dataPoint.date, dataPoint.ertrag]);
						u1.push([ dataPoint.date, dataPoint.u1 ]);
						u2.push([ dataPoint.date, dataPoint.u2 ]);
						categories.push(parts[0])
					}
					updateInstruments(data[mi-1]);
					var x = local2UTC(new Date());
					var startEnd = getStartAndEnd(new Date());
					soll.push([ startEnd[0].getTime(), tagesSoll ]);
					soll.push([ startEnd[1].getTime(), tagesSoll ]);
					var options = {
						chart : {
							renderTo : 'container',
							type : 'areaspline',
							zoomType : 'x',
							events : {
								load : function() {

									// set up the updating of the chart each
									// second
									var series = this.series[0];
									/*
									setInterval(function() {
										var x = (new Date()).getTime(), // current
										// time
										y = Math.random();
										series.addPoint([ x, y ], true, true);
									}, 1000); */
								}
							}
						},
						title : {
							text : 'Tagesübersicht'
						},
						xAxis : {
							type : 'datetime',
							dateTimeLabelFormats : { // don't display
								// the dummy
								// year
								month : '%e. %b',
								year : '%b'
							}
						},
						yAxis : [ { // --- Primary yAxis
							title : {
								text : 'Leistung [W]'
							},
							min : 0,
						}, { // --- Secondary yAxis
							title : {
								text : 'Energie [kWh]'
							},
							min : 0,
							max : 40,
							opposite : true
						} ],
						plotOptions : {
							areaspline : {
								lineWidth : 2,
								marker : {
									enabled : false
								},
								shadow : false,
								states : {
									hover : {
										lineWidth : 1
									}
								},
								threshold : null
							},
							spline : {
								lineWidth : 2,
								marker : {
									enabled : false
								},
								shadow : false,
								states : {
									hover : {
										lineWidth : 1
									}
								},
								threshold : null
							}
						},
						series : [ {

							yAxis : 0,
							name : 'AC Leistung [W]',
							color : '#E0C000',
							data : ac
						}, {
							yAxis : 0,
							type : 'spline',
							name : 'DC Leistung Strang 1 [W]',
							data : dc1
						}, {
							yAxis : 0,
							type : 'spline',
							name : 'DC Leistung Strang 2 [W]',
							data : dc2
						}, {
							yAxis : 1,
							type : 'spline',
							name : 'Ertrag [kWh]',
							data : ertrag
						}, {
							yAxis : 1,
							type : 'spline',
							dashStyle : 'Dash',
							name : 'Tagessoll  [kWh]',
							data : soll
						} ]
					};
					var chart;
					chart = new Highcharts.Chart(options);
				});
	}
	update();
	setInterval(update, 60000);
	function updateInstruments(p) {
		var today = new Date();
		var tagesSoll = Math.round(SollYearKWP
				* AnlagenKWP
				/ 10
				* sollMonth[2]
				/ (10000 * getDaysInMonth(today.getFullYear(),
						today.getMonth())) * 10) / 10;
		var sections = Array(steelseries.Section(0, tagesSoll/2, 'rgba(220, 0, 0, 0.7)'),
                steelseries.Section(tagesSoll/2, tagesSoll, 'rgba(220, 220, 0, 0.7)'), 
                steelseries.Section(tagesSoll/2, 100, 'rgba(0, 220, 0, 0.7)'));
		
		var rad=dashboard['radial0'];
		rad.setMaxValue(AnlagenKWP);
		rad.setTitleString("AC");
		rad.setUnitString("Watt");
		rad.setValueAnimated(p.ac);

		rad=dashboard['radial1']
		rad.setMaxValue(40);
		rad.setTitleString("Ertrag");
		rad.setUnitString("kWh");
		rad.setSection(sections);
		rad.setValueAnimated(p.ertrag);
		
		rad=dashboard['radial2'];
		rad.setMaxValue(AnlagenKWP);
		rad.setTitleString("DC Strang 1");
		rad.setUnitString("Watt");
		rad.setValueAnimated(p.dc1);
		
		rad=dashboard['radial3'];
		rad.setMaxValue(AnlagenKWP);
		rad.setTitleString("DC Strang 2");
		rad.setUnitString("Watt");
		rad.setValueAnimated(p.dc2);
		
		rad=dashboard['radial4'];
		rad.setMaxValue(500);
		rad.setTitleString("U Strang 1");
		rad.setUnitString("Volt");
		rad.setValueAnimated(p.u1);

		rad=dashboard['radial5'];
		rad.setMaxValue(500);
		rad.setTitleString("U Strang 2");
		rad.setUnitString("Volt");
		rad.setValueAnimated(p.u2);
	}
	function configure(instrument,config) {
		
	}

}(Highcharts));
