angular.module('steelSeries', []).directive('steelSeries', function() {
	var defaultDesign = steelseries.FrameDesign.GLOSSY_METAL;
	var defaultBackgroundColor = steelseries.BackgroundColor.LIGHT_GRAY;
	var defaultLcdColor = steelseries.LcdColor.GREEN;
	var defaultLedColor = steelseries.LedColor.GREEN;
	var defaultKnobType = steelseries.KnobType.METAL_KNOW;
	var defaultKnobStyle = steelseries.KnobStyle.SILVER;

	return {
		restrict : 'E',
		replace : true,
		scope : {
			items : '=',
			steelSeriesId : '@'
		},
		controller : function($scope, $element, $attrs) {
			console.log(2);

		},
		template : '<canvas style="margin: 0 auto">not working</canvas>',
		link : function(scope, element, attrs) {
			console.log(6);
			if (scope.items == undefined)
				return;
			var options = {
				maxValue : 6000,
				threshold : 100,
				thresholdVisible : false,
				frameDesign : defaultDesign,
				backgroundColor : defaultBackgroundColor,
				lcdColor : defaultLcdColor,
				ledColor : defaultLedColor,
				knobType : defaultKnobType,
				knobStyle : defaultKnobStyle
			};
			// additional=angular.fromJson(attrs.steelSeries);
			// $.extend(options,additional);
			var id = attrs.id;
			var radial = new steelseries.Radial(id, options);
			radial.setValueAnimated(scope.items);

			scope.$watch("items", function(newValue) {
				radial.setValueAnimated(newValue);
			});
		}
	}
});
angular.module('dayChart', []).directive('dayChart', function() {
	return {
		restrict : 'E',
		replace : true,
		scope : {
			items : '=',
		},
		controller : function($scope, $element, $attrs) {
			console.log(2);

		},
		template : '<div style="margin: 0 auto">not working</div>',
		link : function(scope, element, attrs) {
			console.log(3);
			if (scope.items == undefined)
				return;
			var options = {
				chart : {
					renderTo : attrs.id,
					type : 'areaspline',
					zoomType : 'x',
				},
				title : {
					text : scope.title,
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
					data : scope.items.ac
				}, {
					yAxis : 0,
					type : 'spline',
					name : 'DC Leistung Strang 1 [W]',
					data : scope.items.dc1
				}, {
					yAxis : 0,
					type : 'spline',
					name : 'DC Leistung Strang 2 [W]',
					data : scope.items.dc2
				}, {
					yAxis : 1,
					type : 'spline',
					name : 'Ertrag [kWh]',
					data : scope.items.ertrag
				}, {
					yAxis : 1,
					type : 'spline',
					dashStyle : 'Dash',
					name : 'Tagessoll  [kWh]',
					data : scope.items.soll
				} ]
			};
			var chart = new Highcharts.Chart(options);

			scope.$watch("items", function(newValue) {
				chart.series[0].setData(newValue.ac, true);
				chart.series[1].setData(newValue.dc1, true);
				chart.series[2].setData(newValue.dc2, true);
				chart.series[3].setData(newValue.ertrag, true);
				chart.series[4].setData(newValue.soll, true);
			});
		}
	}
});
angular.module('monthChart', []).directive('monthChart', function() {
	return {
		restrict : 'E',
		replace : true,
		scope : {
			items : '=',
		},
		controller : function($scope, $element, $attrs) {
			console.log(2);

		},
		template : '<div style="margin: 0 auto">not working</div>',
		link : function(scope, element, attrs) {
			console.log(3);
			if (scope.items == undefined)
				return;
			var options = {
				chart : {
					renderTo : attrs.id,
					type : 'column',
					zoomType : 'x',
				},
				title : {
					text : 'Monatsübersicht'
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
						text : 'Energie [kWh]'
					},
					min : 0,
				}, {
					title : {
						text : 'Gesamt Energie [kWh]'
					},
					min : 0,
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
					name : 'Ertrag [kWh]',
					color : '#E0C000',
					data : scope.items.ac
				}, {
					yAxis : 0,
					type : 'spline',
					dashStyle : 'Dash',
					name : 'Tagessoll  [kWh]',
					data : scope.items.soll
				}, {
					yAxis : 1,
					type : 'spline',
					dashStyle : 'Dash',
					name : 'Monatsoll  [kWh]',
					data : scope.items.ac
				}, {
					yAxis : 1,
					type : 'spline',
					color : "#00B000",
					name : 'Ertrag (cum.)  [kWh]',
					data : scope.items.ac
				}, {
					yAxis : 1,
					type : 'spline',
					color : "#00B000",
					dashStyle : 'Dash',
					name : 'Prognose [kWh]',
					data : scope.items.ac
				} ]
			};
			var chart;
			chart = new Highcharts.Chart(options);

			scope.$watch("items", function(newValue) {
				chart.series[0].setData(newValue.ac, true);
				chart.series[1].setData(newValue.dc1, true);
				chart.series[2].setData(newValue.dc2, true);
				chart.series[3].setData(newValue.ertrag, true);
				chart.series[4].setData(newValue.soll, true);
			});
		}
	}
});
angular.module('SolarApp', [ 'dayChart', 'monthChart', 'steelSeries',
		'ui.directives' ]);
