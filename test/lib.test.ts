import { amdRuleVerify, ruleVerify, ruleModelSuffix, makeSearchUrl} from '../src/lib'

test('amdRuleVerify(', () => {
	expect(amdRuleVerify("RX 560","aaaa RX 560 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX 570","aaaa RX 570 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX 5700", "aaaa RX 5700 aaaaaa")).toBeTruthy();
	
	expect(amdRuleVerify("RX 560", "aaaa RX560 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX 570", "aaaa RX570 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX 5700", "aaaa RX5700 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX 5700 XT", "aaaa RX5700XT aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX Vega 64", "aaaa RX Vega64 aaaaaa")).toBeTruthy();
	expect(amdRuleVerify("RX Vega 64", "aaaa RX Vega 64-aaaaaa")).toBeTruthy();


	expect(amdRuleVerify("RX 560", "aaaa RX 5600 aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 560", "aaaa RX 5600 XT aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 570","aaaa RX 5700 aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 570","aaaa RX 5700 XT aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 5700","aaaa RX 5700 XT aaaaaa")).toBeFalsy();

	expect(amdRuleVerify("RX 560", "aaaa RX5600 aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 570", "aaaa RX5700XT aaaaaa")).toBeFalsy();
	expect(amdRuleVerify("RX 5700", "aaaa RX5700XT aaaaaa")).toBeFalsy();
});

test('ruleVerify(', () => {
	expect(ruleVerify("RTX 1060 TI", "")).toBeTruthy();
	expect(ruleVerify("RTX 2060 SUPER", "")).toBeTruthy();
	expect(ruleVerify("RTX 2060", "RTX 2060")).toBeTruthy();

	expect(ruleVerify("RTX 2060", "RTX 2060 ti model")).toBeFalsy();
	expect(ruleVerify("RTX 2060", "RTX 2060 super")).toBeFalsy();
	
});
test('ruleModelSuffix(', () => {
	expect(ruleModelSuffix("RTX 1060 TI")).toBe('"RTX 1060 TI"');
	expect(ruleModelSuffix("RTX 2060 SUPER")).toBe('"RTX 2060 SUPER"');
	expect(ruleModelSuffix("RTX 2060")).toBe("RTX 2060");
});

test('makeSearchUrl(', () => {
	expect(makeSearchUrl("ASUS", ["RTX 1060 TI", 600])).toBe('https://www.staticice.com.au/cgi-bin/search.cgi?price-min=&q=ASUS+"RTX+1060+TI"+price:600');
	expect(makeSearchUrl("ASUS", ["RTX 1060", 300])).toBe('https://www.staticice.com.au/cgi-bin/search.cgi?price-min=&q=ASUS+RTX+1060+price:300');
	expect(makeSearchUrl("MSI", "RTX 2060 SUPER")).toBe('https://www.staticice.com.au/cgi-bin/search.cgi?price-min=&q=MSI+"RTX+2060+SUPER"');
	expect(makeSearchUrl("Gigabyte", "RTX 2060")).toBe("https://www.staticice.com.au/cgi-bin/search.cgi?price-min=&q=Gigabyte+RTX+2060");
});