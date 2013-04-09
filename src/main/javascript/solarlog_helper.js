function splitDay(data,wr,index) {
	var parts=data.split('|');
	var values=parts[wr-1].split(';');
	return values[index];
}