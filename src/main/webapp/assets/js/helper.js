function dateFromString(str) {
	var m = str.match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+):(\d+)/);
	return Date.UTC(+m[3] + 2000, +m[2] - 1, +m[1], +m[4], +m[5], +m[6]);
}
function getStartAndEnd(aDate) {
	var start = new Date(0);
	start.setUTCMilliseconds(Date.UTC(aDate.getFullYear(), aDate.getMonth(),
			aDate.getDate(), 5));
	var end = new Date(0);
	end.setUTCMilliseconds(Date.UTC(aDate.getFullYear(), aDate.getMonth(),
			aDate.getDate(), 22));
	return [ start, end ];
}
function local2UTC(adate) {
	return new Date(adate.getTime() - (adate.getTimezoneOffset() * 60000))
}
function UTC2local(adate) {
	return new Date(adate.getTime() + (adate.getTimezoneOffset() * 60000))
}
//Returns the number of days of a month.
function getDaysInMonth( iFullYear, iMonth )
{
    var iDaysInMonth = 32 - new Date( iFullYear, iMonth, 32 ).getDate();
    return iDaysInMonth;
}