import _ = require('lodash');

class DomReader
{
	_$:CheerioStatic; 
	
	constructor(cheerio:CheerioStatic){
		this._$=cheerio;
	}

	text(tag:string,index?:number,subTag?:string):string{
		let dom=this._$(tag);

		if(_.isNumber(index)){
			if(index>=dom.length){
				dom=dom.eq(dom.length-1);
			}else{
				dom= dom.eq(index);
			}
		}

		if(!_.isEmpty(subTag)){
			dom=dom.find(subTag);
		}
		return _.trim(dom.text());;
	}
}

export default DomReader;