import dev from '../src/dev'

test('dev.amdRuleVerify(', () => {
	expect(dev.amdRuleVerify("RX 560","aaaa RX 560 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX 570","aaaa RX 570 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX 5700", "aaaa RX 5700 aaaaaa")).toBeTruthy();

	
	expect(dev.amdRuleVerify("RX 560", "aaaa RX560 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX 570", "aaaa RX570 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX 5700", "aaaa RX5700 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX 5700 XT", "aaaa RX5700XT aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX Vega 64", "aaaa RX Vega64 aaaaaa")).toBeTruthy();
	expect(dev.amdRuleVerify("RX Vega 64", "aaaa RX Vega 64-aaaaaa")).toBeTruthy();
	

	expect(dev.amdRuleVerify("RX 560", "aaaa RX 5600 aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 560", "aaaa RX 5600 XT aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 570","aaaa RX 5700 aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 570","aaaa RX 5700 XT aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 5700","aaaa RX 5700 XT aaaaaa")).toBeFalsy();

	expect(dev.amdRuleVerify("RX 560", "aaaa RX5600 aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 570", "aaaa RX5700XT aaaaaa")).toBeFalsy();
	expect(dev.amdRuleVerify("RX 5700", "aaaa RX5700XT aaaaaa")).toBeFalsy();

});
