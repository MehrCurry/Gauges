function SolarCtrl($scope, $timeout) {
	var updateInterval = 10000;
	var timer;
	$scope.referenceDate = Date.today();
	$scope.aDate = new Date();
	$scope.ac = 0;
	$scope.ertrag = 0;
	$scope.spezifischerErtrag=0;
	$scope.total = 0;
	$scope.monthTotal=0;
	$scope.yearTotal=0;
	$scope.baseUrl = 'http://monitoring.norderstedt-energie.de/1064/';
	$scope.data = {
		ac : [],
		dc1 : [],
		dc2 : [],
		ertrag : [],
		u1 : [],
		u2 : [],
		soll : []
	};
	$scope.monthData = {
		max : [],
		soll : [],
		sollAuflaufend : [],
		ertrag : [],
		prognose : [],
	};

	$scope.currentData = {};

	// update($scope.referenceDate,$scope.baseUrl);
	$scope.selected = 0;
	$scope.anlagen = [ {
		name : 'Zockoll',
		url : 'http://monitoring.norderstedt-energie.de/1064/'
	}, {
		name : 'Buck',
		url : 'http://monitoring.norderstedt-energie.de/1063/'
	} ];
	$scope.$watch('aDate', function() {
		console.log($scope.aDate);
	});
	$scope.$watch('currentData', function() {
		console.log("New data!");
	});

	$scope.onIimeout = function() {
		$scope.update($scope.referenceDate, $scope.baseUrl);
	};
	timer = $timeout($scope.onIimeout, 500);

	$scope.update = function(referenceDate, baseUrl) {
		console.log('Tick');
		m = new Array();
		mi = 0;
		var data;
		var dayFile;
		if (Date.today().equals(referenceDate.clearTime())) {
			dayFile = '/min_day.js?nocache';
		} else {
			dayFile = '/min' + referenceDate.clearTime().toString('yyMMdd')
					+ '.js?nocache';
		}
		$.when($.getScript(baseUrl + '/base_vars.js'),
				$.getScript(baseUrl + dayFile), $.Deferred(function(deferred) {
					$(deferred.resolve);
				})).done(function() {
			$scope.dayData = $scope.parseArray(m);
			var values=_($scope.dayData).map(function(p){return [p.epoch,p.ertrag];});
			$scope.$apply(function() {
				$scope.data = $scope.createSeriesData($scope.dayData);
				$scope.currentData = _($scope.dayData).last();
				$scope.ac = $scope.currentData.ac/1000;
				$scope.ertrag = $scope.currentData.ertrag;
				$scope.spezifischerErtrag=$scope.currentData.ertrag*1000/AnlagenKWP;
			});
		});
		da = new Array();
		dx = 0;
		$.when($.getScript(baseUrl + '/days_hist.js?nocache'),
				$.Deferred(function(deferred) {
					$(deferred.resolve);
				})).done(
				function() {
					data = $scope.parseDaysHist(referenceDate, da);
					data.push({
						date : referenceDate.getTime(),
						ertrag : $scope.currentData.ertrag,
					});
					$scope.$apply(function() {
						$scope.total = _(data).reduce(function(memo, p) {
							return memo + p.ertrag
						}, 0) / 1000;
						$scope.yearTotal = _(data).select(function(p){
							return new Date(p.date).isSameYear(referenceDate)
							}).reduce(function(memo, p) {
							return memo + p.ertrag
						}, 0) / 1000;
						$scope.monthTotal = _(data).select(function(p){
							return new Date(p.date).isSameYearAndMonth(referenceDate)
							}).reduce(function(memo, p) {
							return memo + p.ertrag
						}, 0);
						$scope.monthData = $scope.createMonthSeriesData(
								referenceDate, data);
					});
				});
		timer = $timeout($scope.onIimeout, updateInterval);
	}
	$scope.parseDaysHist = function(epoch, raw) {
		var data = new Array();
		for (i = dx - 1; i >= 0; i--) {
			var parts = da[i].split('|');
			var date = dateFromString(parts[0] + " 00:00:00");
			var ref = new Date(date);
			var values = parts[1].split(';');
			var dataPoint = {
				date : date,
				ertrag : parseFloat(values[0] / 1000.0),
				max : parseFloat(values[1]),
			};
			data.push(dataPoint);
		}
		return data;
	}
	$scope.createMonthSeriesData = function(epoch, raw) {
		var result = {
			cumulatedData : [],
			data : [],
			max : [],
			ertrag : [],
			prognose : [],
			soll : [],
			sollAuflaufend : []
		};
		var selected = new Date(epoch);
		var daysInMonth = getDaysInMonth(selected.getFullYear(), selected
				.getMonth());
		var tagesSoll = Math.round(SollYearKWP
				* AnlagenKWP
				/ 10
				* sollMonth[selected.getMonth()]
				/ (10000 * getDaysInMonth(selected.getFullYear(), selected
						.getMonth())) * 10) / 10;
		var count = 0;
		var cumulated = 0;
		_.chain(raw).select(
				function(p) {
					var d = new Date(p.date);
					return selected.getFullYear() == d.getFullYear()
							&& selected.getMonth() == d.getMonth()
				}).each(function(dataPoint) {
			cumulated += dataPoint.ertrag;
			result.max.push([ dataPoint.date, dataPoint.max ]);
			result.cumulatedData.push([ dataPoint.date, cumulated ]);
			result.ertrag.push([ dataPoint.date, dataPoint.ertrag ]);
			count++;
		});
		var aDate = new Date(epoch);
		for (i = count; i <= daysInMonth; i++) {
			aDate.setDate(i);
			result.prognose.push([ aDate.getTime(), cumulated ]);
			cumulated += tagesSoll;
		}
		var start = new Date(selected.getFullYear(), selected.getMonth(), 1);
		var end = new Date(selected.getFullYear(), selected.getMonth() + 1, 1);

		result.soll.push([ start.getTime(), tagesSoll ]);
		result.soll.push([ end.getTime(), tagesSoll ]);
		var day = start;
		var sum = 0;
		for (i = 1; i <= daysInMonth; i++) {
			day.setDate(i);
			sum = sum + tagesSoll;
			result.sollAuflaufend.push([ day.getTime(), sum ]);
		}
		return result;
	}
	$scope.parseArray = function(raw) {
		var data = new Array();
		_.each(raw.reverse(), function(line) {
			var parts = line.split('|');
			var epoch = dateFromString(parts[0]);
			var values = parts[1].split(';');
			var dataPoint = {
				epoch : epoch,
				ac : parseFloat(values[0]),
				dc1 : parseFloat(values[1]),
				dc2 : parseFloat(values[2]),
				ertrag : parseFloat(values[3] / 1000.0),
				u1 : parseFloat(values[4]),
				u2 : parseFloat(values[5])
			};
			data.push(dataPoint);
		});
		return data;
	}
	$scope.createSeriesData = function(data) {
		var result = {};
		var referenceDate = new Date(data[0].epoch);
		var tagesSoll = Math.round(SollYearKWP
				* AnlagenKWP
				/ 10
				* sollMonth[referenceDate.getMonth()]
				/ (10000 * getDaysInMonth(referenceDate.getFullYear(),
						referenceDate.getMonth())) * 10) / 10;
		result.ac = new Array();
		result.dc1 = new Array();
		result.dc2 = new Array();
		result.ertrag = new Array();
		result.u1 = new Array();
		result.u2 = new Array();
		result.temp = new Array();
		result.soll = new Array();
		_.each(data, function(dataPoint) {
			result.ac.push([ dataPoint.epoch, dataPoint.ac ]);
			result.dc1.push([ dataPoint.epoch, dataPoint.dc1 ]);
			result.dc2.push([ dataPoint.epoch, dataPoint.dc2 ]);
			result.ertrag.push([ dataPoint.epoch, dataPoint.ertrag ]);
			result.u1.push([ dataPoint.epoch, dataPoint.u1 ]);
			result.u2.push([ dataPoint.epoch, dataPoint.u2 ]);
		});
		var startEnd = getStartAndEnd(referenceDate);
		result.soll.push([ startEnd[0].getTime(), tagesSoll ]);
		result.soll.push([ startEnd[1].getTime(), tagesSoll ]);
		return result;
	}
}
