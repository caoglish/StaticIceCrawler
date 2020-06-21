import DomReader from './lib/DomReader';
import puppeteer = require('puppeteer');
import UrlParser = require('url-parse');
import cheerio = require("cheerio");
import _ = require("lodash");

const FIRST_RECORD_NUMBER=5;
const PRICE_COLUMN=0
const DESCRIPTION_COLUMN=1
const TARGET_CONTENT_TAG = "table table table table table"
const domain = "https://www.staticice.com.au"
const baseUrl = domain+"/cgi-bin/search.cgi"
let searchUrl = baseUrl + "?" +"price-min=&q=msi+nvidia+2080+ti&pda=0"


const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(searchUrl);
	//await page.waitForSelector('[alt="EYO Technologies: Click to see the latest price for RTX 2080 TI LIGHTNING Z MSI nVidia Rtx 2080 TI Lightning Z Graphic Card"]', { visible: true })

	//await page.screenshot({ path: 'example.png' });
	let html = await page.content();
	let $ = cheerio.load(html);
	// let dr=new DomReader($);
	// dr.text("table table table table table");
	let price = $(TARGET_CONTENT_TAG).find('tr').eq(FIRST_RECORD_NUMBER).find('td').eq(PRICE_COLUMN).text()
	let description = $(TARGET_CONTENT_TAG).find('tr').eq(FIRST_RECORD_NUMBER).find('td').eq(DESCRIPTION_COLUMN).text()
	console.log(price);
	console.log(description);

	await browser.close();
})();