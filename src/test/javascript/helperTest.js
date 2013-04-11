describe("Testing datehelper", function() {
	it("should calculate the epoch to a given datetime", function() {
		expect(dateFromString('01.01.1970 00:00:00')).toBe(0);
	});
});
