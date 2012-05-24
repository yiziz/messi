var relationStrength = new Array();
relationStrength["convolution"] = 2;
relationStrength["transformation"] = 2;
relationStrength["linear transformation"] = 3;
relationStrength["special case"] = 4;
relationStrength["conditioning"] = 5;
relationStrength["central limit theorem"] = 3;
relationStrength["conditional distribution"] = 5;
relationStrength["parameter limit"] = 6;
relationStrength["inverse stochastic process"] = 4;
relationStrength["location-scale transformation"] = 3;
relationStrength["scale transformation"] = 2;
relationStrength["nonlinear transformation"] = 3;
relationStrength["mixture and transformation"] = 2;
relationStrength["limiting distribution"] = 3;
relationStrength["limiting conditional distribution"] = 4;
relationStrength["limiting distribution"] = 2;
relationStrength["location-scale transformation"] = 3;
relationStrength["tbd"] = 3;
relationStrength["mixture"] = 4;
relationStrength["limiting distribution with respect to parameter"] = 5;
relationStrength["inverse stochastic process"] = 4;
relationStrength["stochastic process"] = 3;
relationStrength["compound poisson transformation"] = 2;

var group = new Array();
group["continuous"] = 2;
group["discrete"] = 3;

/*************** Ajax request seperated for IE and others **************/
function createAjaxRequest(){
	var xmlHttp;
	try{
	 // use the ActiveX control for IE5.x and IE6.
		xmlHttp = new ActiveXObject('MSXML2.XMLHTTP.3.0');
	}catch (e){		 
		try{
			xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');	// Internet Explorer 6+
		}catch(e){
			try{
				xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');   // Internet Explorer 5.5
			}catch(e2){
				try{
					xmlHttp = new XMLHttpRequest();	//  Firefox, Opera 8.0+, Safari
				}catch(e3){
					xmlHttp = false;
				}
			}
		}
	}
	return xmlHttp;
}

/***** Logging ******/
var globalDebugFlag = false;
function log(message){
	if(!globalDebugFlag)
		return;
    if(!log.window_ || log.window_.closed){
        var win = window.open("", "Logger", "width=400,height=200,scrollbars=yes,resizable=yes,status=no,location=no,menubar=no,toolbar=no");
        if (!win) return;
        var doc = win.document;
        doc.write("<html><head><title>Debug Log</title></head>" +
                  "<body></body></html>");
        doc.close();
        log.window_ = win;
    }
    var logLine = log.window_.document.createElement("div");
    logLine.appendChild(log.window_.document.createTextNode(message));
    log.window_.document.body.appendChild(logLine);
}

/****** Get URL parameters ******/
function getURLParameters(){
	var sURL = window.document.URL.toString();	
	if (sURL.indexOf("?") > 0){
		var arrParams = sURL.split("?");
		urlParamString = arrParams[1];
		var arrURLParams = arrParams[1].split("&");				
		for (var i=0;i<arrURLParams.length;i++){
			var sParam =  arrURLParams[i].split("=");
			if(sParam[0]=='debug'){
				if(sParam[1]=='true')
					globalDebugFlag = true;
			}
		}
	}
}

/******* Remove the starting and leading White Spaces *******/
function trim(inputString) {
	if(typeof inputString != "string"){
		return inputString; 
	}
	inputString = inputString.replace(/^[\s\xA0]+/,''); 
	inputString = inputString.replace(/[\s\xA0]+$/,'');
	return inputString; 
}

/*************** Removing special characters like -,spaces **************/
function trimSpecialCharacters(inputString) {
	if(typeof inputString != "string"){
		return inputString; 
	}
	var index = inputString.indexOf("dist");
	if(index!=-1){
		var startString = inputString.substring(0,index-1);
		var endString = inputString.substring(index+12);
		inputString = startString.concat(endString);
	}
	inputString = inputString.replace(/[\s\xA0]+/g,''); 
	inputString = inputString.replace(/[-]/g,'');
	inputString = inputString.replace(/\'/g,'');
	return inputString; 
}

function trimDistribution(inputString){
	if(typeof inputString != "string"){
		return inputString; 
	}
	var index = inputString.indexOf("dist");
	if(index!=-1)
		inputString = inputString.substring(0,index-1);
	return inputString;
}

function camelize(str){
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return letter.toUpperCase();
	});
}

/*************** Fetch group information for node **************/
function getGroup(type){
	return (group[type] != undefined)?group[type]:1;
}

/*************** Get relation strength for edges **************/
function getRelationStrength(type){
	type = type.toLowerCase();
	return (relationStrength[type] != undefined)?relationStrength[type]:1;
}

/*************** Truncate distribution name to save for further use **************/
function getDistributionName(nodeName){
	nodeName = nodeName.toLowerCase();
	nodeName = trimSpecialCharacters(nodeName);
	return nodeName;
}

/*************** Apply Math Jax **************/
function renderMath(){
	MathJax.Hub.Typeset();
}

/*************** Get the drop down selected value **************/
function getDropDownSelectedValue(id){
	var dropDown = document.getElementById(id);
	return dropDown.options[dropDown.selectedIndex].value;	
}


/*************** set the drop down **************/
function setDropDownSelectedValue(dropDownID, value){
	var dropDown =document.getElementById(dropDownID);
	if(dropDown.options[value]){
		dropDown.options[value].selected = true;
	}else{
		for(var i=0; i< dropDown.options.length; i++){
			if(dropDown.options[i].value == value){
				dropDown.options[i].selected = true;
			}
		}
	}
}

/*************** Get node index for the distribution name **************/
function getNodeIndex(nodesArray, nodeName){
	return (nodesArray[nodeName] != undefined)?nodesArray[nodeName]:0;
}

/*************** Get the reference of the nodes wrt browser **************/
function getObjectReferenceNumber(object){
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer"){
		if(object == 'node') return 0;
		else if(object == 'relation') return 1;
		else return 2;
	}else{
		if(object == 'node') return 1;
		else if(object == 'relation') return 3;
		else return 5;
	}
}

/*************** Parse XML to fetch information per node in the XML **************/
function XMLParser(i, nodeNameIndex, index, reference, XML_Objects){
	var html = new Array();
	var referenceName = null;
	if (XML_Objects[i].nodeType==1) {
		
		var Level1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].firstChild;

		var Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[nodeNameIndex].nodeName)[index].childNodes;
		var currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[nodeNameIndex].nodeName)[index].firstChild;
		
		var k_corr=0;
		var nameText = ''; var nameFlag = true; var typeFlag = false; var typeText = '';
		for (var k=0;k<Level2Prop.length;k++) {
			try {
				if (currLevel2Prop.nodeType==1) {
					//Process only level=3 element nodes (type 1)
					if(reference){
						if(currLevel2Prop.nodeName == "cite"){
							referenceName = trim(currLevel2Prop.childNodes[0].nodeValue);
						}
					}
					if(currLevel2Prop.nodeName == 'name' && nameFlag){
						if(nameText == ''){
							nameText = '<b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue);
						}else{
							nameText = nameText+ ', '+trim(currLevel2Prop.childNodes[0].nodeValue);
						}
					}else if(currLevel2Prop.nodeName == 'type'){
						if(typeText == ''){
							typeText = '<b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue);
						}else{
							typeText = typeText+ ', '+trim(currLevel2Prop.childNodes[0].nodeValue);
						}
						typeFlag = true;
					}else{
						if(nameFlag){
							html.push('<div style="padding-left:3px">'+nameText+'</div>');
							html.push("<div style='height:5px'></div>");
						}
						nameFlag = false;
						if(typeFlag){
							html.push('<div style="padding-left:3px">'+typeText+'</div>');
							html.push("<div style='height:5px'></div>");
						}
						typeFlag = false;
						html.push('<div style="padding-left:3px"><b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue)+'</div>');
						html.push("<div style='height:5px'></div>");
					}
				} else k_corr++;
				currLevel2Prop=currLevel2Prop.nextSibling;
			} catch (err) {
				html.push("Empty tag" + currLevel2Prop.nodeValue + "<br />");
			}
		}
		if(typeFlag){	//handling the border case when type occurs last
			html.push('<div style="padding-left:3px">'+typeText+'</div>');
			html.push("<div style='height:5px'></div>");
		}
	}
	return new Array(html.join(''), referenceName);
}


/*************** Function to traverse the XML during initialization and search **************/
function traverseXML(searchFlag, text, XML_Objects, nodes, edges, references, nodesArray, referenceArray, connectivity){
	var currentNodeIndex=0;
	var currentEdgeIndex=0;
	var currentReferencesIndex=0;

	if(searchFlag){
		//remove extra white spaces first
		var originalText = text.split(" ");
		var splitText = text.toLowerCase().split(" ");
		var newText = '';
		for(var splitArray =0; splitArray<splitText.length;splitArray++){
			if(splitText[splitArray] == "") continue;
			if(splitText[splitArray] == "not" || splitText[splitArray] == "or" || splitText[splitArray] == "and"){
				var next = splitArray+1;
				while(next<splitText.length && splitText[next] == "") next++;
				if(next<splitText.length){
					if(splitText[next] == "not" || splitText[next] == "or" || splitText[next] == "and"){
							log("Improper search string '"+ text+"'");
							continue;
					}
				}else{
					break;
				}
				newText = newText+" "+originalText[splitArray];
				splitArray = next-1;
			}else{
				newText = newText+" "+originalText[splitArray];
			}
		}
		text = newText;
		var andIndex = text.toLowerCase().indexOf(' and ');
		var orIndex = text.toLowerCase().indexOf(' or ');
		var notIndex = text.toLowerCase().indexOf(' not ');
		if(notIndex!=-1){
			var originalText = text.split(" ");
			var splitText = text.toLowerCase().split(" ");
			var newText = '';
			var notArrayIndex = -1;
			for(var splitArray =0; splitArray<splitText.length;splitArray++){
				if(splitText[splitArray] != "not"){
					newText = newText+" "+originalText[splitArray];
				}else{
					var notText = originalText[splitArray+1]
					splitArray++;
				}
			}
			text = newText;
		}
	}
	
	/*** For each of the 3 main Distirbutome.xml classes of objects (1=distirbutions, 3=relations, 5-references ***/
	for (var i=0;i<XML_Objects.length;i++) {
		var j_corr=0;
		if (XML_Objects[i].nodeType==1) {
			//Process only level=1 element nodes (type 1) 
			Level1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].childNodes;
			currLevel1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].firstChild;
			if (Level1Prop[i] && Level1Prop[i].nodeName == 'distribution') {	// for "distributions" objects
				/**  nodes:[
						{nodeName:"1:_:Standard Normal", group:0},
				 ]
				 ***/
				
				for (var j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						if(!searchFlag) nodes[currentNodeIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						var nameFlag = false;
						var andRegex = false;
						var orRegex = false;
						for (var k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									if(searchFlag){
										if(orIndex!=-1){
											var orText2 = text.substring(orIndex+1+3);//extra 1 for the space
											var orText2Regex = new RegExp(trimSpecialCharacters(orText2),"i");
											if(andIndex !=-1 && andIndex<orIndex){
												if(trimSpecialCharacters(value).search(orText2Regex)!=-1) orRegex = true;
											}else{
												var orText1 = text.substring(0, orIndex-1+1);
												var orText1Regex = new RegExp(trimSpecialCharacters(orText1),"i");
												if(andIndex!=-1){
													orText2 = text.substring(orIndex+3+1, andIndex-1+1);
													orText2Regex = new RegExp(trimSpecialCharacters(orText2),"i");
												}
												if(trimSpecialCharacters(value).search(orText1Regex)!=-1 || trimSpecialCharacters(value).search(orText2Regex)!=-1) orRegex = true;
											}
										}
										if(andIndex!=-1){
											var andText2 = text.substring(andIndex+4+1);
											var andText2Regex = new RegExp(trimSpecialCharacters(andText2),"i");
											
											if(orIndex!=-1 && orIndex<andIndex){
												if(orRegex && trimSpecialCharacters(value).search(andText2Regex)!=-1) andRegex = true;
											}else{
												var andText1 = text.substring(0, andIndex-1+1);
												var andText1Regex = new RegExp(trimSpecialCharacters(andText1),"i");
												if(orIndex!=-1){
													andText2 = text.substring(andIndex+4+1, orIndex-1+1);
													andText2Regex = new RegExp(trimSpecialCharacters(andText2),"i");
												}
												if(trimSpecialCharacters(value).search(andText1Regex)!=-1 && trimSpecialCharacters(value).search(andText2Regex)!=-1) andRegex = true;
											}
										}
										if(orIndex!=-1 && andIndex!=-1){
											if(orRegex && andRegex) {
												if(connectivity){
													if(nodes[currentNodeIndex].selected)
														nodes[currentNodeIndex].selected = 'red';
												}else nodes[currentNodeIndex].selected = 'red';
											}
										}else if(orIndex!=-1){
											if(orRegex){
												if(connectivity){
													if(nodes[currentNodeIndex].selected)
														nodes[currentNodeIndex].selected = 'red';
												}else nodes[currentNodeIndex].selected = 'red';
											}
										}else if(andIndex!=-1){
											if(andRegex) {
												if(connectivity){
													if(nodes[currentNodeIndex].selected)
														nodes[currentNodeIndex].selected = 'red';
												}else nodes[currentNodeIndex].selected = 'red';
											}
										}else{
											var regex = new RegExp(trimSpecialCharacters(text),"i");
											if(trimSpecialCharacters(value).search(regex)!=-1) {
												if(connectivity){
													if(nodes[currentNodeIndex].selected)
														nodes[currentNodeIndex].selected = 'red';	
												}else nodes[currentNodeIndex].selected = 'red';
											}
										}
										if(notIndex!=-1){
											var notRegex = new RegExp(trimSpecialCharacters(notText),"i");
											if(nodes[currentNodeIndex].selected && trimSpecialCharacters(value).search(notRegex)!=-1){
												nodes[currentNodeIndex].selected = false; 
												break;
											}
										}
									}else{
										//Process only level=3 element nodes (type 1)
										if (currLevel2Prop.nodeName == "name" && !nameFlag) {
											nameFlag = true;
											nodes[currentNodeIndex].nodeName = camelize(trimDistribution(value));
											nodesArray[getDistributionName(value)] = currentNodeIndex;
											nodesArray[currentNodeIndex] = getDistributionName(value);
										} else if(currLevel2Prop.nodeName == "name" && nameFlag){
											nodesArray[getDistributionName(value)] = currentNodeIndex;
											nodesArray[currentNodeIndex] = nodesArray[currentNodeIndex]+ ","+getDistributionName(value);
										}else if (currLevel2Prop.nodeName == "type") {
											nodes[currentNodeIndex].group = getGroup(value.toLowerCase());
										}
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag)	nodes[currentNodeIndex].selected = false;
						currentNodeIndex++;
					} else j_corr++;
					currLevel1Prop=currLevel1Prop.nextSibling;
				}
				// End for "distributions" objects
			
			} else if (Level1Prop[i] && Level1Prop[i].nodeName == 'relation') { // for "relations", edges
				/*** links:[
							{source:1, target:0, value:2},
					 ]
				***/	
				var totalEdges = xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].getElementsByTagName('relation').length;
				for (var j=0;j<Level1Prop.length;j++) {
					var k_corr=0;	
					
					if (currLevel1Prop.nodeType==1) {
						if(!searchFlag){
							edges[currentEdgeIndex] = new Object();
							var to = false;
							var from = false;
							var fromValue, toValue;
							var fromNodes = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].getElementsByTagName('from');
							var toNodes = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].getElementsByTagName('to');
							var extraNodeIterator = 0;
							var totalExtraNodes = 0;
							if(toNodes.length > 1)
								totalExtraNodes = toNodes.length-1;
							else if(fromNodes.length > 1)
								totalExtraNodes = fromNodes.length-1;
							for(var temp =0; temp<totalExtraNodes; temp++){
								edges[totalEdges+temp] = new Object();
							}
						}
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						var andRegex = false;
						var orRegex = false;
						for (var k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									//Process only level=3 element nodes (type 1)
									if(searchFlag){ //Check search
										if(orIndex!=-1){
											var orText2 = text.substring(orIndex+3+1);
											var orText2Regex = new RegExp(trimSpecialCharacters(orText2),"i");
											if(andIndex !=-1 && andIndex<orIndex){
												if(trimSpecialCharacters(value).search(orText2Regex)!=-1) orRegex = true;
											}else{
												var orText1 = text.substring(0, orIndex-1+1);
												var orText1Regex = new RegExp(trimSpecialCharacters(orText1),"i");
												if(andIndex!=-1){
													orText2 = text.substring(orIndex+3+1, andIndex-1+1);
													orText2Regex = new RegExp(trimSpecialCharacters(orText2),"i");
												}
												if(trimSpecialCharacters(value).search(orText1Regex)!=-1 || trimSpecialCharacters(value).search(orText2Regex)!=-1) orRegex = true;
											}
										}
										if(andIndex!=-1){
											var andText2 = text.substring(andIndex+4+1);
											var andText2Regex = new RegExp(trimSpecialCharacters(andText2),"i");
											
											if(orIndex!=-1 && orIndex<andIndex){
												if(orRegex && trimSpecialCharacters(value).search(andText2Regex)!=-1) andRegex = true;
											}else{
												var andText1 = text.substring(0, andIndex-1+1);
												var andText1Regex = new RegExp(trimSpecialCharacters(andText1),"i");
												if(orIndex!=-1){
													andText2 = text.substring(andIndex+4+1, orIndex-1+1);
													andText2Regex = new RegExp(trimSpecialCharacters(andText2),"i");
												}
												if(trimSpecialCharacters(value).search(andText1Regex)!=-1 && trimSpecialCharacters(value).search(andText2Regex)!=-1) andRegex = true;
											}
										}
										if(orIndex!=-1 && andIndex!=-1){
											if(orRegex && andRegex) {
												if(connectivity){
													if(edges[currentEdgeIndex].selected)
														edges[currentEdgeIndex].selected = 'red';
												}else edges[currentEdgeIndex].selected = 'red';
											}
										}else if(orIndex!=-1){
											if(orRegex) {
												if(connectivity){
													if(edges[currentEdgeIndex].selected)
														edges[currentEdgeIndex].selected = 'red';
												}else edges[currentEdgeIndex].selected = 'red';
											}
										}else if(andIndex!=-1){
											if(andRegex) {
												if(connectivity){
													if(edges[currentEdgeIndex].selected)
														edges[currentEdgeIndex].selected = 'red';
												}else edges[currentEdgeIndex].selected = 'red';
											}
										}else{
											var regex = new RegExp(trimSpecialCharacters(text),"i");
											if(trimSpecialCharacters(value).search(regex)!=-1) {
												if(connectivity){
													if(edges[currentEdgeIndex].selected)
														edges[currentEdgeIndex].selected = 'red';
												}else edges[currentEdgeIndex].selected = 'red';
											}
										}
										
										if(notIndex!=-1){
											var notRegex = new RegExp(trimSpecialCharacters(notText),"i");
											if(edges[currentEdgeIndex].selected && trimSpecialCharacters(value).search(notRegex)!=-1){
												edges[currentEdgeIndex].selected = false; 
												break;
											}
										}
									}else{
										if (currLevel2Prop.nodeName == "from") {
											var fromValue = getNodeIndex(nodesArray, getDistributionName(value));
											if(!from)
												edges[currentEdgeIndex].source = fromValue;
											else{
												edges[totalEdges+extraNodeIterator].source = fromValue;	
											}
											if(toNodes.length >1){
												for(var extraNodes=0; extraNodes<toNodes.length-1; extraNodes++){
													edges[totalEdges+extraNodes].source = fromValue;
												}
											}
											from = true;
										} else if (currLevel2Prop.nodeName == "to") {
											var toValue = getNodeIndex(nodesArray, getDistributionName(value));
											if(!to)
												edges[currentEdgeIndex].target = toValue;
											else{
												edges[totalEdges+extraNodeIterator].target = toValue;
											}
											if(fromNodes.length >1){
												for(var extraNodes=0; extraNodes<fromNodes.length-1; extraNodes++){	
													edges[totalEdges+extraNodes].target = toValue;
												}
											}
											to = true;
										} else if (currLevel2Prop.nodeName == "type") {
											var type = getRelationStrength(value.toLowerCase());
											edges[currentEdgeIndex].value = type;
											if(totalExtraNodes > 0){
												for(var extraNodes =0; extraNodes<totalExtraNodes; extraNodes++){
													edges[totalEdges+extraNodes].value = type;
												}
											}
										}
										edges[currentEdgeIndex].index = currentEdgeIndex;
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag){
							edges[currentEdgeIndex].selected = false;
							if(totalExtraNodes > 0){
								edges[currentEdgeIndex].extra = totalEdges+","+totalExtraNodes;
								extraNodeIterator++;
							}
							totalEdges = totalEdges+ totalExtraNodes;
						}
						currentEdgeIndex++;
					} else j_corr++;
				currLevel1Prop=currLevel1Prop.nextSibling;
				}
				// end for relations
			
			} else 	if (Level1Prop[i] && Level1Prop[i].nodeName == 'reference' & !searchFlag)	{ // for references, citations
				for (var j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						references[currentReferencesIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						nodeParent = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr];
						currLevel2Prop=nodeParent.firstChild;
						referenceArray[trim(nodeParent.attributes.getNamedItem("id").value)] = currentReferencesIndex;
						for (var k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									
									//Process only level=3 element nodes (type 1)
									if (currLevel2Prop.nodeName == "author") {
										references[currentReferencesIndex].author = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "title") {
										references[currentReferencesIndex].title = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "year") {
										references[currentReferencesIndex].year = currLevel2Prop.childNodes[0].nodeValue;
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						currentReferencesIndex++;
					} else j_corr++;
					currLevel1Prop=currLevel1Prop.nextSibling;
				}					
			}
		}	//end of nodeType = 1
		
	}	// End of for (i=0;i<XML_Objects.length;i++)

}
