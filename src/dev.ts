export default {
	amdRuleVerify:(model:string,description:string):boolean=>{
		
		let modelNoSpace=model.replace(/ /g,"")

		if (model ==="RX Vega 64") return true
	
		if (description.includes(model)){
			if (description.includes(model + "0")) return false;
			if (description.includes(model + " XT")) return false;
		}

		if (description.includes(modelNoSpace)){
			if (description.includes(modelNoSpace + "0")) return false;
			if (description.includes(modelNoSpace + "XT")) return false;
		}
		

		
	
		
		if (!description.includes(model) && !description.includes(modelNoSpace)) return false;
		
		

		return true;
	}
}