var distributome = new Object ();

distributome.nodes = new Array ();
distributome.edges = new Array ();
distributome.references = new Array ();
var distributomeNodes = new Array();
var referenceNodes = new Array();
var DistributomeXML_Objects;
var xmlDoc;	
var force = null;
var presetNodes = null;
var topHierarchyArray = new Array();
var middleHierarchyArray = new Array();
var connectivity = false;

function getColor(d){
	if(d.selected == 'yellow'){
		return "yellow";
	}else if(d.selected == 'green'){
		return "green";
	}else if(d.selected == 'red'){
		return "red";
	}
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(d.selected == "top_hierarchy") return colors(d.group);
			else return "pv.hsla(0, 100%, 50%, 0.1)";
		}else if(connectivity == "middle_hierarchy"){
			if(d.selected == "top_hierarchy" || d.selected == "middle_hierarchy") return colors(d.group);
			else return "pv.hsla(0, 100%, 50%, 0.1)";
		}
	}
	else return colors(d.group);
}

function getText(d){
	if(connectivity){
		if(d.selected == "red" || d.selected == "yellow" || d.selected == "green") return d.nodeName;
		if(connectivity == "top_hierarchy"){
			if(d.selected == "top_hierarchy") return d.nodeName;
			else return '';
		}else if(connectivity == "middle_hierarchy"){
			if(d.selected == "top_hierarchy" || d.selected == "middle_hierarchy") return d.nodeName;
			else return '';
		}
	}
	return d.nodeName;
}

function getArrowColor(d,l){
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(distributome.nodes[l.source].selected == "top_hierarchy" && distributome.nodes[l.target].selected == "top_hierarchy") return '#C0C0C0';
			else return "pv.hsla(0, 0%, 63%, 0.1)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source].selected && distributome.nodes[l.target].selected) return '#C0C0C0';
			else return "pv.hsla(0, 0%, 63%, 0.1)";
		}
	}
	return "#C0C0C0";
}

function getArrowSize(d,l){
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(distributome.nodes[l.source].selected == "top_hierarchy" && distributome.nodes[l.target].selected == "top_hierarchy") return 3;
			else return 0.5;
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source].selected && distributome.nodes[l.target].selected) return 3;
			else return 0.5;
		}
	}
	return 3;
}

/*************** Reset Distributome Page **************/
function resetPage(){
	resetNavigator();
	resetDropDown();
}
	
/*************** Reset variables **************/
function resetVariables(){
	resetNodesEdges();
	presetNodes = null;
	connectivity = false;
	
	//Default href for calculator, experiment, simulation
	document.getElementById('distributome.calculator').href = './calc/NormalCalculator.html';
	document.getElementById('distributome.experiment').href = './exp/BallUrnExperiment.html';
	document.getElementById('distributome.simulation').href = './sim/NormalSimulation.html';
}

/*************** Reset search text **************/
function resetText(){
	document.getElementById('distributome.text').value = '';
	document.getElementById('distributome.referencePanel').innerHTML = '<b><u>Distribution Referencies</u></b>';
	document.getElementById('distributome.propertiesPannel').innerHTML = '<b><u>Distribution Properties</u></b>';	
	document.getElementById('distributome.relationPannel').innerHTML = '<b><u>Distribution Relations</u></b>';
}

function resetDropDown(){
	setDropDownSelectedValue('distributome.edgeTypeAction', 0);
	setDropDownSelectedValue('distributome.nodeTypeAction', 0);
	setDropDownSelectedValue('distributome.neighborAction', 0);
	setDropDownSelectedValue('distributome.connectedNodesAction', 0);
}

/*************** Reset view **************/
function resetView(){
	resetVariables();
	resetText();
}

function getLinkColor(d,l){
	if(l.selected == 'yellow'){
		return "yellow";
	}else if(l.selected == 'green'){
		return "green";
	}else if(l.selected == 'red'){
		return "red";
	}
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if((distributome.nodes[l.source].selected && distributome.nodes[l.source].selected != "middle_hierarchy") && (distributome.nodes[l.target].selected && distributome.nodes[l.target].selected != "middle_hierarchy")){
				l.selected = 'top_hierarchy';
				return 'rgb(170,170,170)';
			}
			else return "pv.hsla(0, 0%, 63%, 0.1)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source].selected && distributome.nodes[l.target].selected){
				l.selected = 'middle_hierarchy';
				return 'rgb(170,170,170)';
			}
			else return "pv.hsla(0, 0%, 63%, 0.1)";
		}
	}
	else return 'rgb(170,170,170)';
}

/*************** Fetch node properties **************/
function getNodeProperties(index, nodeName, d){
	if(connectivity && d.selected != "top_hierarchy" && d.selected != "middle_hierarchy") return;
	if(!_shiftKey){
		resetNodes();
		presetNodes = null;
		if(connectivity) {
			resetView();
			connectedNodesFetch();
		}
	}
	distributome.nodes[index].selected = "red";
	var html = new Array();
	html.push("<b><u>Distribution Properties</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, index, true, DistributomeXML_Objects);
	html.push(parserOutput[0]);
	var referenceName= parserOutput[1];
	document.getElementById('distributome.propertiesPannel').innerHTML = html.join('');	
	if(referenceName !=null)
		getReferences(referenceNodes[referenceName]);
	else getReferences(false);
	renderMath();
	nodeName = trimSpecialCharacters(nodeName);
	var firstChar = nodeName.substring(0,1).toUpperCase();
	nodeName = nodeName.substring(1); //Is it camel case or only first letter Upper Case?
	
	document.getElementById('distributome.calculator').href = './calc/'+firstChar+nodeName+'Calculator.html';
	document.getElementById('distributome.experiment').href = './exp/'+firstChar+nodeName+'Experiment.html';
	document.getElementById('distributome.simulation').href = './sim/'+firstChar+nodeName+'Simulation.html';
	
	vis.render();
}

/*************** Function invoked on node and edges action **************/
function search(searchType, indexType, type){
	var i= getObjectReferenceNumber(searchType);
	if (DistributomeXML_Objects[i].nodeType==1) {
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
		var currentNodeIndex = 0;
		for (var j=0, node_cnt=0;j<Level1Prop.length;j++) {
			var k_corr=0;					
			var nodes = xmlDoc.getElementsByTagName(Level1Prop[i].nodeName);
			if (currLevel1Prop.nodeType==1) {
				if(node_cnt<nodes.length) {
					Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].childNodes;
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].firstChild;
					for (var k=0;k<Level2Prop.length;k++) {
						try {
							if (currLevel2Prop.nodeType==1) {
								var value = trim(currLevel2Prop.childNodes[0].nodeValue);
								if (currLevel2Prop.nodeName == "type" && value == type) {
									if(searchType == "node") distributome.nodes[currentNodeIndex].selected = "red";
									if(searchType == "relation") distributome.edges[currentNodeIndex].selected = "red"; 
								}else if (currLevel2Prop.nodeName == "type" && value != type) {
									if(searchType == "node") distributome.nodes[currentNodeIndex].selected = false;
									if(searchType == "relation") distributome.edges[currentNodeIndex].selected = false;
								}
							} else k_corr++;
							currLevel2Prop=currLevel2Prop.nextSibling;
						} catch (err) {
						}
					}
					currentNodeIndex++;
					node_cnt++;
				}
			}else currLevel1Prop=currLevel1Prop.nextSibling;
		}
	}
}

/*************** Function to fetch the parents/children of the selected nodes **************/
function neighborsFetch(){
	var type = getDropDownSelectedValue('distributome.neighborAction');
	if(type == 'neighbors') return;
	var selectedNodes = getSelectedNodes();
	if(presetNodes == null || presetNodes.length == 0) presetNodes = selectedNodes;
	resetNodesEdges();
	if(connectivity) connectedNodesFetch();
	parentChildSearch(type, presetNodes);
	vis.render();
}


function connectedNodesFetch(){
	var type = getDropDownSelectedValue('distributome.connectedNodesAction');
	if(type == 'connectivity'){
		connectivity = false;
		resetNavigator();
		return; 
	}
	if(type == 'mostConnected'){
		connectivity =  "top_hierarchy";
		updateNodeColor(topHierarchyArray, "top_hierarchy");
	}else if(type == 'connected'){
		connectivity =  "middle_hierarchy";
		updateNodeColor(middleHierarchyArray, "middle_hierarchy");
		updateNodeColor(topHierarchyArray, "top_hierarchy");
	}else if(type == 'sparselyConnected'){
		connectivity = false;
		resetNodesEdges();
	}
	vis.render();
}


/*************** Function to search the parents/children of the selected nodes in the relations **************/
function parentChildSearch(type, selectedNodes){
	var i= getObjectReferenceNumber("relation");
	var indexType = 7;
	if (DistributomeXML_Objects[i].nodeType==1) {
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
		for (j=0, node_cnt=0;j<Level1Prop.length;j++) {
			var k_corr=0;					
			var nodes = xmlDoc.getElementsByTagName(Level1Prop[i].nodeName);
			if (currLevel1Prop.nodeType==1) {
				if(node_cnt<nodes.length) {
					Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].childNodes;
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('from'); //get from here
					currLevel2Prop1=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('to'); //get to node here
					try {
						//if (currLevel2Prop.nodeType==1) {
							for(var values=0;values<selectedNodes.length;values++){
								var nodeIndex = distributomeNodes[selectedNodes[values]];
								distributome.nodes[getNodeIndex(distributomeNodes,selectedNodes[values])].selected = 'red'; //selected Node
								var nodeNames = distributomeNodes[nodeIndex].split(","); //done for different names for a particular node
								for(var nodeNameTraverse=0; nodeNameTraverse<nodeNames.length; nodeNameTraverse++){
									for(var fromNodes=0;fromNodes<currLevel2Prop.length;fromNodes++){
										var fromValue = getDistributionName(currLevel2Prop[fromNodes].childNodes[0].nodeValue);
										if(fromValue == nodeNames[nodeNameTraverse]){
											if(type.indexOf('children')!=-1){
												for(var toNodes=0;toNodes<currLevel2Prop1.length;toNodes++){
													var toValue = getDistributionName(currLevel2Prop1[toNodes].childNodes[0].nodeValue);
													distributome.nodes[getNodeIndex(distributomeNodes,toValue)].selected = 'yellow'; //child 
												}
												//Take care of multiple from and to
												distributome.edges[node_cnt].selected = 'yellow';
												if(distributome.edges[node_cnt].extra){
													var totalExtra = distributome.edges[node_cnt].extra.split(",");
													var startPoint = totalExtra[0];
													var endPoint = totalExtra[1];
													for(var extraNodes=startPoint;extraNodes<endPoint;extraNodes++){
														distributome.edges[extraNodes].selected = 'yellow';
													}
												}
											}
										}
									}
									for(var toNodes=0;toNodes<currLevel2Prop1.length;toNodes++){
										var toValue = getDistributionName(currLevel2Prop1[toNodes].childNodes[0].nodeValue);		
										if(toValue == nodeNames[nodeNameTraverse]){
											if(type.indexOf('parent')!=-1){
												for(var fromNodes=0;fromNodes<currLevel2Prop.length;fromNodes++){
													var fromValue = getDistributionName(currLevel2Prop[fromNodes].childNodes[0].nodeValue);
													distributome.nodes[getNodeIndex(distributomeNodes, fromValue)].selected = 'green'; //parent
												}
												distributome.edges[node_cnt].selected = 'green';
												if(distributome.edges[node_cnt].extra){
													var totalExtra = distributome.edges[node_cnt].extra.split(",");
													var startPoint = totalExtra[0];
													var endPoint = totalExtra[1];
													for(var extraNodes=startPoint;extraNodes<endPoint;extraNodes++){
														distributome.edges[extraNodes].selected = 'green';
													}
												}
											}
										}
									}
								}
							}
						//} 
					} catch (err) {
					}
					node_cnt++;
				}
			}else currLevel1Prop=currLevel1Prop.nextSibling;
		}
	}
}

/*************** Function invoked on enter of the input box for search **************/
function textSearch(){
	if(!connectivity){
		resetVariables();
		resetNodesEdges();
	}
	var searchString = document.getElementById('distributome.text').value;
	traverseXML(true, searchString, DistributomeXML_Objects, distributome.nodes, distributome.edges, distributome.references, distributomeNodes, referenceNodes, connectivity);
	vis.render();
}

/*************** Fetch References from the XML **************/
function getReferences(index){
	var html = new Array();
	html.push("<b><u>Distribution Referencies</u></b> <div style='height:7px'></div>");
	if(index){
		html.push(XMLParser(getObjectReferenceNumber('reference'), 9, index, false, DistributomeXML_Objects)[0]);
	}
	document.getElementById('distributome.referencePanel').innerHTML = html.join('');
}

/*************** Fetch relation information of an edge **************/
function getRelationProperties(nodeName, linkIndex){
	if(!_shiftKey){
		resetEdges();
	}
	distributome.edges[linkIndex].selected = "red";
	var html = new Array();;
	html.push("<b><u>Inter-Distribution Relations</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, linkIndex, true, DistributomeXML_Objects);
	html.push(parserOutput[0]);
	var referenceName = parserOutput[1];
	document.getElementById('distributome.relationPannel').innerHTML = html.join('');
	if(referenceName!=null)
		getReferences(referenceNodes[referenceName]);
	else getReferences(false);
	renderMath();
	vis.render();
}

/*************** Node Action **************/
function nodeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.nodeTypeAction');
	if(type == 'distributionType') return;
	resetNavigator();
	search("node", 1, type);
	vis.render();
}

/*************** Edge Action **************/
function edgeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.edgeTypeAction');
	if(type == 'relationType') return;
	resetNavigator();
	search("relation", 7, type);
	vis.render();
}

function getOntologyOrderArray(ontologyOrder){
	var ontology = ontologyOrder.getElementsByTagName('distributome_ontology')[0].childNodes;
	var ontologyArray; var k=0;
	for (var i=0;i<ontology.length;i++) {
		if (ontology[i].nodeType==1) {
			var Level2Prop=ontology[i].childNodes;
			var level = ontology[i].getAttribute("id");
			if(level == "top_hierarchy"){
				ontologyArray = topHierarchyArray;
				k=0;
			}else{
				ontologyArray = middleHierarchyArray;
				k=0;
			}
			for(var j=0;j<Level2Prop.length;j++){
				if (Level2Prop[j].nodeType==1) {
					var name = Level2Prop[j].childNodes[0].nodeValue;
					ontologyArray[k++] = name;
				}
			}
		}
	}
}

function updateNodeColor(ontologyArray, level){
	for(var i=0; i<ontologyArray.length;i++){
		var nodeIndex = getNodeIndex(distributomeNodes,getDistributionName(ontologyArray[i]));
		distributome.nodes[nodeIndex].selected = level; //selected Node
	}
}

	
{		
		getURLParameters();
		/*** Read in and parse the Distributome.xml DB ***/
		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xml",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		xmlDoc = xmlhttp.responseXML;
		try{
			DistributomeXML_Objects=xmlDoc.documentElement.childNodes;
		}catch(error){
			DistributomeXML_Objects=xmlDoc.childNodes;
		}
		
		traverseXML(false, null, DistributomeXML_Objects, distributome.nodes, distributome.edges, distributome.references, distributomeNodes, referenceNodes);
		
		xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xml.pref",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		var ontologyOrder = xmlhttp.responseXML;	
		getOntologyOrderArray(ontologyOrder);
}
