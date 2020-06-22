import puppeteer = require('puppeteer');
import cheerio = require("cheerio");
import _ = require("lodash");
import moment = require("moment")
const { Parser } = require('json2csv');
const fs = require('fs');

const FIRST_RECORD_NUMBER = 5;
const PRICE_COLUMN = 0
const DESCRIPTION_COLUMN = 1
const TARGET_CONTENT_TAG = "table table table table table"
const domain = "https://www.staticice.com.au"
const baseUrl = domain + "/cgi-bin/search.cgi"
let searchUrl;

const parser = new Parser();

let modelList = ["GTX 1050 TI", "GTX 1650", "GTX 1650 SUPER", "GTX 1660", "GTX 1660 SUPER", "GTX 1660 TI", "RTX 2060", "RTX 2060 SUPER", ["RTX 2070 SUPER", 600], "RTX 2080 SUPER", ["RTX 2080 TI", 1400]]
let companyList = ["MSI", "ASUS", "Inno3D", "GALAX", "Gigabyte", "EVGA", "ZOTAC"]
// let modelList = [["RTX 2080 TI", 1000], "GTX 1660"]
// let companyList = ["MSI", "ASUS", "Inno3D", "GALAX", "Gigabyte", "EVGA", "ZOTAC"]

class PageCrawler {
	page = null;

	constructor(page) {
		this.page = page;
	}

	async crawl(url) {
		let page = this.page
		await page.goto(url);

		let html = await page.content();
		let $ = cheerio.load(html);
		let isNoResult = $(TARGET_CONTENT_TAG).eq(1).find("tr td font b").text() == "Sorry, we could not find any items matching your search.";
		if (isNoResult) return;
		let price = $(TARGET_CONTENT_TAG).find('tr').eq(FIRST_RECORD_NUMBER).find('td').eq(PRICE_COLUMN).text()
		let description = $(TARGET_CONTENT_TAG).find('tr').eq(FIRST_RECORD_NUMBER).find('td').eq(DESCRIPTION_COLUMN).text()
		return { price, description }
	}
}


function makeSearchUrl(company, model) {
	if (_.isArray(model)) {
		model = ruleModelTi(model[0]) + " price:" + model[1]
	} else {
		model = ruleModelTi(model)
	}

	let query = company + "+" + model.replace(/ /g, "+");
	console.log(query)
	return baseUrl + "?" + "price-min=&q=" + query
}


//rule 1: if no ti, no super, description should no ti and no super
function ruleVerify(model, description): boolean {
	model = _.isArray(model) ? model[0] : model
	if (model.includes("TI") || model.includes("SUPER")) return true;
	if (description.toLowerCase().includes(" ti ") || description.toLowerCase().includes("super")) {
		return false;
	}
	return true;
}

//rule 2: if model with ti, should search exact word, so result will not have super keyword or just normal version.
function ruleModelTi(model) {
	let addSlash = (str) => {
		return "\"" + str + "\""
	}
	return model.includes("TI") ? addSlash(model) : model
}

function now() {
	return moment().format('[[]YYYY-MM-DD HH.mm.ss[]]');
}

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let pageCrawler = new PageCrawler(page);
	let crawlResultList = [];

	for (let model of modelList) {
		for (let company of companyList) {
			searchUrl = makeSearchUrl(company, model);
			console.log(searchUrl);
			let searchResult = await pageCrawler.crawl(searchUrl);
			//let searchResult={price:"$333",description:"ddd"}
			if (_.isNil(searchResult)) continue;

			if (!ruleVerify(model, searchResult.description)) continue;
			let oneResult = {
				company,
				model: _.isArray(model) ? model[0] : model,
				staticIceLink: searchUrl,
				price: searchResult.price,
				description: searchResult.description,
			};

			console.log(oneResult);
			crawlResultList.push(oneResult);
		}
	}
	await browser.close();
	crawlResultList = _.sortBy(crawlResultList, ["model", "price"])
	console.log(crawlResultList);
	const csvOutput = parser.parse(crawlResultList);
	console.log(csvOutput);
	fs.writeFileSync('StaticIcesearchResult' + now()+'.csv', csvOutput);
})();