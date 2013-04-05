function dateFromString(str) {
	var m = str.match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+):(\d+)/);
	return new Date(+m[3] + 2000, +m[2] - 1, +m[1], +m[4], +m[5], +m[6])
			.getTime();
}
function getStartAndEnd(aDate) {
	var start = new Date(aDate).clearTime();
	start.setHours(5);
	var end = new Date(aDate).clearTime();
	end.setHours(22);
	return [ start, end ];
}
function local2UTC(date) {
	// return new Date(adate.getTime() - (adate.getTimezoneOffset() * 60000))
	return new Date(date.getUTCFullYear(), date.getUTCMonth(), date
			.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date
			.getUTCSeconds());
}
function UTC2local(adate) {
	return new Date(adate.getTime() + (adate.getTimezoneOffset() * 60000))
}
// Returns the number of days of a month.
function getDaysInMonth(iFullYear, iMonth) {
	var iDaysInMonth = 32 - new Date(iFullYear, iMonth, 32).getDate();
	return iDaysInMonth;
}