const fs = require('fs');
import moment = require("moment");
import _ = require("lodash");


const domain = "https://www.staticice.com.au"
export const baseUrl = domain + "/cgi-bin/search.cgi"
export const csvFolder = "./csv"


export function now() {
	return moment().format('[[]YYYY-MM-DD HH.mm.ss[]]');
}

export function makeFolder(folder) {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
}

//rule 1: if no ti, no super, description should no ti and no super
export  function ruleVerify(model, description): boolean {
	model = _.isArray(model) ? model[0] : model
	if (model.includes("TI") || model.includes("SUPER")) return true;
	if (description.toLowerCase().includes(" ti ") || description.toLowerCase().includes("super")) {
		return false;
	}
	return true;
}

//rule 2: if model with number and suffix letter, should search exact word, so result will not have irrelevant text keyword or just normal version.
export function ruleModelSuffix(model) {
	let addSlash = (str) => {
		return "\"" + str + "\""
	}
	return model.match(/\d+ \w+$/) ? addSlash(model) : model
}

export let amdRuleVerify = (model: string, description: string): boolean => {
	let modelNoSpace = model.replace(/ /g, "")
	if (model === "RX Vega 64") return true
	if (description.includes(model)) {
		if (description.includes(model + "0")) return false;
		if (description.includes(model + " XT")) return false;
	}
	if (description.includes(modelNoSpace)) {
		if (description.includes(modelNoSpace + "0")) return false;
		if (description.includes(modelNoSpace + "XT")) return false;
	}
	if (!description.includes(model) && !description.includes(modelNoSpace)) return false;
	return true;
}


export function makeCsvFilePath(filename) {
	return csvFolder + "/" + filename + now() + '.csv'
}


export function makeSearchUrl(company, model) {
	if (_.isArray(model)) {
		model = ruleModelSuffix(model[0]) + " price:" + model[1]
	} else {
		model = ruleModelSuffix(model)
	}

	let query = company + "+" + model.replace(/ /g, "+");
	//console.log(query)
	return baseUrl + "?" + "price-min=&q=" + query
}
