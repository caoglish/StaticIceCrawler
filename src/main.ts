import puppeteer = require('puppeteer');
import cheerio = require("cheerio");
import _ = require("lodash");
import { makeFolder, ruleVerify,  amdRuleVerify, makeCsvFilePath, makeSearchUrl} from "./lib";//function
import { csvFolder} from "./lib";//const
const { Parser } = require('json2csv');
const fs = require('fs');


const FIRST_RECORD_NUMBER = 5;
const PRICE_COLUMN = 0
const DESCRIPTION_COLUMN = 1
const TARGET_CONTENT_TAG = "table table table table table"

const csvArchivedFolder = csvFolder + "/archived"
let searchUrl;

const parser = new Parser();

let AMDList = ["RX 5700", "RX 5700 XT", "RX 5600 XT", "RX 5500 XT", "RX Vega 64", "RX 580","RX 570","RX 560","RX 550"];
let nVidiaList=["GTX 1050 TI", "GTX 1650", "GTX 1650 SUPER", "GTX 1660", "GTX 1660 SUPER", "GTX 1660 TI", "RTX 2060", "RTX 2060 SUPER", ["RTX 2070 SUPER", 600], "RTX 2080 SUPER", ["RTX 2080 TI", 1400]]
//let AMDList = ["RX 5700"];
let commonCompanyList = ["MSI", "ASUS", "Gigabyte"]
let aVidiaCompanyList = commonCompanyList.concat(["Inno3D", "GALAX", "EVGA", "ZOTAC"])
let AMDCompnayList = commonCompanyList.concat(["ASRock", "HIS", "PowerColor", "XFX", "Sapphire"])


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

function nVidiaVerifyFun(model, searchResult) {
	if (ruleVerify(model, searchResult.description)) return true;
	return false;
}

function AmdVerifyFun(model, searchResult) {
	if (amdRuleVerify(model, searchResult.description)) return true;
	return false;
}



async function archiveCsvFiles() {
	makeFolder(csvFolder);
	makeFolder(csvArchivedFolder);
	let filelist = fs.readdirSync(csvFolder, { withFileTypes: true }).filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);;
	
	if (filelist.length > 0) {
		for (let file of filelist) {
			fs.renameSync(csvFolder + "/" + file, csvArchivedFolder + "/" + file);
			console.log(file + " have been archived.");
		}
		console.log('Move complete.');
	}
}

async function crawl(companyList, modelList, verifyFun, filename) {
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

			if (!verifyFun(model, searchResult)) continue;
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

	fs.writeFileSync(makeCsvFilePath(filename), csvOutput);
};

(async () => {
	makeFolder(csvFolder);
	archiveCsvFiles();
	await crawl(aVidiaCompanyList, nVidiaList, nVidiaVerifyFun,'nVidiaStaticIcesearchResult');
	await crawl(AMDCompnayList, AMDList, AmdVerifyFun, 'AMDStaticIcesearchResult');
})();