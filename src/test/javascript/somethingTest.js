describe("A suite", function() {
	it("contains spec with an expectation", function() {
		expect(true).toBe(true);
	});
});

describe("Another suite", function() {
	it("should calculate the doubled value of an integer", function() {
		expect(tuwas(5)).toBe(10);
	});
	it("should calculate the doubled value of a float", function() {
		expect(tuwas(6.1)).toBe(12.2);
	});
	it("should calculate the doubled value of 0", function() {
		expect(tuwas(0)).toBe(0);
	});
	it("should calculate the doubled value of negative numbers", function() {
		expect(tuwas(-1)).toBe(-2);
	});
});