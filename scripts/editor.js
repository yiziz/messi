var distributionArray = new Array();
var relationArray = new Array();
var force = null;
var relationDropDown, distributionDropDown, nodeDropDown;
var distributomeEditor = new Object ();

distributomeEditor.nodes = new Array ();
distributomeEditor.edges = new Array ();
distributomeEditor.references = new Array ();
var distributomeEditorNodes = new Array();
var referenceEditorNodes = new Array();

function addDialog(dialog, title, onClickClose){
	if(!dialog)
		return;
	var x = '<div name="titlebar" id="'+dialog+'.titlebar" style="background:#4e647d; height:24px; border-style:solid; border-width:0; cursor:move; width:'+(parseInt(document.getElementById(dialog).style.width))+'px;" class="home-style" valign="top">';
	x += '<table name="titlebar" cellspacing=0 cellpadding=0 border=0 width="100%" height="24px"><tr name="titlebar" valign="middle">';
	x += '<td name="titlebar" align="left"><div name="titlebar" style="width:'+(parseInt(document.getElementById(dialog).style.width)-37)+'px;"><div name="titlebar" style="position:absolute; top:2px; left:4px;"><span name="titlebar" style="white-space:nowrap;"><img name="titlebar" src="/cbmui/images/home/dialog-left-icon.gif" height="20px" width="20px" style="border-style:none; border-width:0px" border=0></span></div><div name="titlebar" style="padding:0 5px;"><span name="titlebar" nowrap><label name="titlebar" class="home-txt" style="color:#ffffff"><b name="titlebar">'+title+'</b></label></span></div></div></td>';
	x += '<td name="titlebar" align="right"><span name="titlebar" style="white-space:nowrap">';
	x += '<input name="titlebar" type="button" style="border:0; background:#4e647d; width:18px; height:20px; color:#fff; font-size:11px; font-weight:bold; font-family:arial; cursor:pointer" value="X " class="home-txt" width="18px" height="20px" id="'+dialog+'.close" onClick="';
	if(onClickClose)
		x += onClickClose+'();';
	x += 'hideDialog(\''+dialog+'\');';	
	x += '"></span></td>';
	x += '</tr></table>';
	x += '</div>';
	var e = document.getElementById(dialog);	
	if(!document.getElementById(dialog+'.titlebar'))
		e.innerHTML = x + e.innerHTML;
	e.style.background='#ffffff';
	e.style.borderStyle='solid';
	e.style.borderWidth='1px';
	e.style.borderColor='#929292';
}

/******* Show the dialog Div *******/
function showDialog(dialog, zIndex, topDiff){
	if(zIndex){
		document.getElementById(dialog).style.zIndex=parseInt(zIndex);
	}else{
		document.getElementById(dialog).style.zIndex=5;
	}
	document.getElementById(dialog).style.visibility = "visible";
	distributomeEditor.on = true;
}

/******* Hide the Dialog Div *******/
function hideDialog(dialog){
	document.getElementById(dialog).style.visibility = "hidden";
	distributomeEditor.on = false;
}

function editXML(){
	addDialog('distributome.editXML','XML Editor');
	showDialog('distributome.editXML');
}

function reflectResourceType(){
	var type = getDropDownSelectedValue('distributome.resourceType');
	if(type == 1){
		document.getElementById('distributome.distributionXml').style.display = '';
		document.getElementById('distributome.relationXml').style.display = 'none'; 
		setDropDownSelectedValue('distributome.distributionXmlTable.dropDown0', 'name');
		setDropDownSelectedValue('distributome.distributionXmlTable.dropDown1', 'pdf');
		
	}else if(type ==2){
		document.getElementById('distributome.relationXml').style.display = ''; 
		document.getElementById('distributome.distributionXml').style.display = 'none';
		setDropDownSelectedValue('distributome.relationXmlTable.dropDown0', 'to');
		setDropDownSelectedValue('distributome.relationXmlTable.dropDown1', 'from');
		setDropDownSelectedValue('distributome.relationXmlTable.dropDown2', 'statement');
	}
}


function saveXML(){
	var XML = new XMLWriter(true);
	XML.BeginNode("distributome");
	XML.Attrib("version","2.0");
	var e = document.getElementById('distributome.distributionXmlTable');
	if(e.hasChildNodes()){
		if(e.childNodes[0].childNodes.length>1){
			var name = false; var pdf = false;
			var trs = e.childNodes[0].childNodes;
			XML.BeginNode("distributions",1);
			XML.BeginNode("distribution",2);
			var tempXML = new XMLWriter();
			for(var i=0; i<(trs.length-1);i++){
				var dropDownValue = getDropDownSelectedValue('distributome.distributionXmlTable.dropDown'+i);
				var value = document.getElementById('distributome.distributionXmlTable.text'+i).value;
				if(dropDownValue == 'name'){
					if(!name){
						XML.Attrib("id",value+'');
						name = true;
					}
					value = value + ' distribution';
				}else if(dropDownValue == 'pdf') pdf = true;
				tempXML.BeginNode(dropDownValue,3);
				tempXML.WriteString(value);
				tempXML.EndNode();
			}
			if(name && pdf)
				XML.AppendXML(tempXML.ToString());
			else{
				alert('A distribution has to be associated with atleast a name and a pdf');
				return;
			}
			XML.EndNode();
			XML.EndNode();
		}
	}
	e = document.getElementById('distributome.relationXmlTable');
	if(e.hasChildNodes()){
		if(e.childNodes[0].childNodes.length>1){
			var from = false; var to = false; var statement = false;
			var trs = e.childNodes[0].childNodes;
			XML.BeginNode("relations",1);
			XML.BeginNode("relation",2);
			var tempXML = new XMLWriter();
			for(var i=0; i<(trs.length-1);i++){
				var dropDownValue = getDropDownSelectedValue('distributome.relationXmlTable.dropDown'+i);
				var tdValue = trs[i].childNodes[1].childNodes[0];
				if(tdValue.tagName == 'SELECT'){	
					var value = getDropDownSelectedValue('distributome.relationXmlTable.nodeDropDown'+i);
				}else var value = document.getElementById('distributome.relationXmlTable.text'+i).value;
				if(dropDownValue == 'from'){
					from = value;
					value = value + ' distribution';
				}else if(dropDownValue == 'to'){
					to = value;
					value = value + ' distribution';
				}else if(dropDownValue == 'statement'){
					statement = true;
				}
				tempXML.BeginNode(dropDownValue,3);
				tempXML.WriteString(value);
				tempXML.EndNode();
			}
			if(from && to && statement){
				XML.Attrib("id",from+'/'+to);
				XML.AppendXML(tempXML.ToString());
			}else{
				alert('A relation has to be associated with atleast a "from", a "to" and a "statement"');
				return;
			}
			XML.EndNode();
			XML.EndNode();
		}
	}
	XML.EndNode();
	var distributomeXML = XML.ToString();
	var win = window.open("", "Save_XML", "");
    if (!win){
		return;
	}
    var doc = win.document;
    doc.write("<html><head><title>Save XML by copying<\br></title></head><body><div><textarea rows=\"50\" cols=\"100\">"+distributomeXML+"</textarea></div></body></html>");
    doc.close();
	alert("To proceed further, Save this XML displayed and email it for review and publishing to info@sistributome.org");
}

/********* Create a drop down **********/
	function createDropDown(fillArray, codeSnippet){
		var dropDownOutput = '<select  class="home-txt" style="width:100px">';
		if(codeSnippet)
			dropDownOutput +=codeSnippet;
		for(var dropDownOptions=0; dropDownOptions< fillArray.length ;dropDownOptions++ ){
			dropDownOutput += '<option value="'+fillArray[dropDownOptions]+'">'+fillArray[dropDownOptions]+'</option>';
		}
		return dropDownOutput;
	}
	
	function nodesDropDown(codeSnippet){
		var dropDownOutput = '<select  class="home-txt" style="width:180px">';
		if(codeSnippet)
			dropDownOutput +=codeSnippet;
		for(var dropDownOptions=0; dropDownOptions< distributomeEditor.nodes.length ;dropDownOptions++ ){
			dropDownOutput += '<option value="'+distributomeEditor.nodes[dropDownOptions].nodeName+'">'+distributomeEditor.nodes[dropDownOptions].nodeName+'</option>';
		}
		return dropDownOutput;
	}
	
function initialize(){
	//document.getElementById('distributome.distributionXmlTable').innerHTML = '<tbody><tr><td>hfjf</td></tr></tbody>';
	document.getElementById('distributome.distributionXmlTable').innerHTML = '<tbody><tr><td>'+distributionDropDown+'</td><td></td></tr></tbody>';
	document.getElementById('distributome.distributionXmlTable').childNodes[0].childNodes[0].childNodes[0].childNodes[0].setAttribute('id','distributome.distributionXmlTable.dropDown0');
	displayText('distributome.distributionXmlTable',0, 'distribution');
	displayText('distributome.distributionXmlTable',1, 'distribution');
	document.getElementById('distributome.distributionXmlTable').childNodes[0].childNodes[1].childNodes[0].childNodes[0].setAttribute('onchange','');
	
	
	//alert(getDropDownSelectedValue('distributome.distributionXmlTable.dropDown0'));
	document.getElementById('distributome.relationXmlTable').innerHTML = '<tr><td>'+relationDropDown+'</td><td></td></tr>';
	document.getElementById('distributome.relationXmlTable').childNodes[0].childNodes[0].childNodes[0].childNodes[0].setAttribute('id','distributome.relationXmlTable.dropDown0');
	setDropDownSelectedValue('distributome.relationXmlTable.dropDown0', 'to');
	displayText('distributome.relationXmlTable',0, 'relation');
	setDropDownSelectedValue('distributome.relationXmlTable.dropDown1', 'from');
	displayText('distributome.relationXmlTable',1, 'relation');
	displayText('distributome.relationXmlTable',2, 'relation');
	document.getElementById('distributome.relationXmlTable').childNodes[0].childNodes[2].childNodes[0].childNodes[0].setAttribute('onchange','');
}
	
function displayText(id,num, type){
	var nodeNum = num+1;
	if(type == 'distribution')
		document.getElementById(id+'.dropDown'+num).parentNode.parentNode.childNodes[1].innerHTML = '<input type="text" style="width:180px" class="home-txt" id="'+id+'.text'+(num)+'"/>';
	else{
		var attr = getDropDownSelectedValue(id+'.dropDown'+num);
		if(attr == 'to' || attr == 'from'){
			document.getElementById(id+'.dropDown'+num).parentNode.parentNode.childNodes[1].innerHTML = nodeDropDown;
			document.getElementById(id+'.dropDown'+num).parentNode.parentNode.childNodes[1].childNodes[0].setAttribute('id',id+'.nodeDropDown'+num);
		}
		else{
			document.getElementById(id+'.dropDown'+num).parentNode.parentNode.childNodes[1].innerHTML = '<input type="text" style="width:180px" class="home-txt" id="'+id+'.text'+(num)+'"/>';	
		}
	}
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	tr.appendChild(td1);
	tr.appendChild(td2);
	document.getElementById(id).childNodes[0].appendChild(tr);
	if(type == 'distribution')
		document.getElementById(id).childNodes[0].childNodes[nodeNum].childNodes[0].innerHTML = distributionDropDown;
	else
		document.getElementById(id).childNodes[0].childNodes[nodeNum].childNodes[0].innerHTML = relationDropDown;
	
	document.getElementById(id).childNodes[0].childNodes[nodeNum].childNodes[0].childNodes[0].setAttribute('id',id+'.dropDown'+nodeNum);
	document.getElementById(id).childNodes[0].childNodes[nodeNum].childNodes[0].childNodes[0].setAttribute('onchange','displayText(\''+id+'\','+nodeNum+',\''+type+'\');');
}


function fetchArray(xmlDoc){
	var fillArray = new Array();
	var k;
	xmlDoc = xmlDoc.element[0].complexType[0].sequence[0];
	for(var rows=0; rows<xmlDoc._children.length;rows++){
		var childName = xmlDoc._children[rows];
		var element = eval('xmlDoc.'+childName+'['+rows+']');
		if(!element){
			//alert("error"); 
			return;
		}
		temp = xmlDoc;
		var attribute = eval('temp.'+childName+'['+rows+'].name');
		if(attribute == "distributions" || attribute == "relations"){
			if(attribute == "distributions"){
				fillArray = distributionArray;
			}else if(attribute == "relations"){
				fillArray = relationArray;
			}
			k=0;
			
			temp = eval('xmlDoc.'+childName+'[rows].complexType[0].sequence[0].'+childName+'[0].complexType[0]');
			var childrenLength = temp._children.length;
			for(var listCount=0; listCount<childrenLength; listCount++){
				var childrenName = temp._children[listCount];
				if(childrenName == 'sequence'){
					var childnodes = eval('temp.sequence[0]._children');
					for(var j=0; j<childnodes.length; j++){
							var child = eval('temp.sequence[0]._children[j]');
							var name = eval('temp.sequence[0].'+child+'[j].name');
							//name = name.substring(4);
							fillArray[k++] = name;
						
					}
				}else{
					var attributeLength = eval('temp.'+childrenName+'.length');
					for(var j=0; j<attributeLength; j++){
						var name = eval('temp.'+childrenName+'[j].name');
						fillArray[k++] = name;
					}
				}
				
				
			}
			if(attribute == "distributions"){
				distributionDropDown = createDropDown(fillArray, '<option value="-1">Select a distribution attribute</option>');
			}else{
				relationDropDown = createDropDown(fillArray, '<option value="-1">Select a relation criteria</option>');
			}
		}
	}
}

{

		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xsd",false);
		xmlhttp.send();
		//if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			//xmlhttp.responseXML.load(xmlhttp.responseStream);
		var xmlData = xmlhttp.responseText;
		var myXMLasJSON = convertXMLToJSON(convertTextToXML(xmlData));
		fetchArray(myXMLasJSON);
		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xml",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		xmlDoc = xmlhttp.responseXML;
		var distributomeEditorXML_Objects;
		try{
			distributomeEditorXML_Objects=xmlDoc.documentElement.childNodes;
		}catch(error){
			distributomeEditorXML_Objects=xmlDoc.childNodes;
		}
		traverseXML(false, null, distributomeEditorXML_Objects, distributomeEditor.nodes, distributomeEditor.edges, distributomeEditor.references, distributomeEditorNodes, referenceEditorNodes);//TODO send xmlDoc also
		nodeDropDown = nodesDropDown();
	
}

// Newly added stuff to editor

var editor;
var editorCopy;
var editorContent;
var editorFooter;
var editorTitle;
var addAttrDiv;

// Set existing object on distributomeEditor
function setEditorNode (index, type) {
	var xmlObject;
	// if true
	if (editor.css("display") != "none") {
		xmlObject = XMLObject(index, type);
		if (typeof xmlObject != 'undefined' && xmlObject != null) {
			editor.data("existing", xmlObject);
			editor.data("type", type);
			if (type == "node") {
				editor.data("existingName", xmlObject.getElementsByTagName("name")[0].childNodes[0].nodeValue);
			}
			//editorContent.text(XMLToString(xmlObject));
			//alert(XMLToString(xmlObject));
			xmlToEditor(xmlObject);
		}
	}
}

// gotten from joncom.be
function XMLToString(oXML) {
  if (window.ActiveXObject) {
    return oXML.xml;
  } else {
    return (new XMLSerializer()).serializeToString(oXML);
  }
}

function newDistribution(){
	editor.data("changeState")("Editing new Distribution");
	editor.data("action", "newDistribution");
	editor.data("editing", true);
	editor.data("type", "distribution");
	editor.data("nodeFooter").css("display", "block");
	appendNewAttr("name");
	appendNewAttr("pdf");
}

function newRelation(){
	editor.data("changeState")("Editing new Relation");
	editor.data("action", "newRelation");
	editor.data("editing", true);
	editor.data("type", "relation");
	editor.data("nodeFooter").css("display", "block");
	appendNewAttr("from");
	appendNewAttr("to");
	appendNewAttr("statement");
}

// place xml object into editor
function xmlToEditor(xmlObject) {
	if (!editor.data("editing")) {
		
		var xC = xmlObject.childNodes;
		var xType = xmlObject.tagName;
		var xId = xmlObject.attributes.getNamedItem("id");
		if (xId != null) {
			xId = xId.value;
			
			editor.data("id", xId);
		} else {
			editor.data("id", xId);
			xId = "";
		}
		var xUpper;
		if (xId.length == 0) {
			xUpper = "";
		} else if (xId.length == 1) {
			xUpper = xId.toUpperCase();
		} else {
			xUpper = xId[0].toUpperCase() + xId.substr(1);
		}
		editor.data("changeState")("Editing " + xUpper + " " + 
				xType[0].toUpperCase() + xType.substr(1));
		var tempX = document.createElement("id");
		tempX.innerHTML = xId;
		editorContent.append(editorAttrDiv(tempX));
		for (var i=0; i<xC.length; i++) {
			if (xC[i].tagName != null) {
				var attrDiv = editorAttrDiv(xC[i]);
				editorContent.append(attrDiv);
			}
			//editorContent.append($('<div >' + XMLToString(xC[i]) + '</div>'));
		}
		editor.data("editing", true);
		editor.data("action", "existing");
		editor.data("existing", xmlObject);
		
		editor.data("type", xType);
		editor.data("nodeFooter").css("display", "block");
	}
}

function editorSave() {

	var XML = new XMLWriter(true);
	XML.BeginNode("distributome");
	XML.Attrib("version","2.0");
	var xId = "";
	if (editor.data("type") == "distribution") {
		XML.BeginNode("distributions",1);
		XML.BeginNode("distribution",2);
		var attrNodes = new XMLWriter();
		var dName = null;
		var dPdf = null;
		editorContent.children().each(function(){
			//alert($(this).data("name"));
			var name = $(this).data("name").toLowerCase();
			var value = $.trim($(this).data("value"));
			var newV = $(this).data("new");
			if (name != "id") {
				if (name == "name") {
					if (xId == "") {
						xId = value;
					}
					if (value.indexOf("distribution") < 0) {
						value = $.trim(value);
						value += " distribution";
					}
					dName = value;
				} else if (name == "pdf") {
					dPdf = value;
				}
				attrNodes.BeginNode(name,3);
				attrNodes.WriteString(value);
				attrNodes.EndNode();
			} else {
				xId = value;
			}
		});
		if (dName == null || dPdf == null) {
			alert('A distribution needs at least a name and pdf attributes');
			return;
		}
		XML.Attrib("id", xId);
		XML.WriteString('\n'+attrNodes.ToString());
		XML.EndNode();
		XML.EndNode();
	} else if(editor.data("type") == "relation") {
		XML.BeginNode("relations",1);
		XML.BeginNode("relation",2);
		var attrNodes = new XMLWriter();
		var to = null;
		var from = null;
		var statement = null;
		editorContent.children().each(function(){
			//alert($(this).data("name"));
			var name = $(this).data("name").toLowerCase();
			var value = $.trim($(this).data("value"));
			var newV = $(this).data("new");
			if (name != "id") {
				attrNodes.BeginNode(name,3);
				attrNodes.WriteString(value);
				attrNodes.EndNode();
				if (name == "to") {
					to = value;
				} else if (name == "from") {
					from = value;
				} else if (name == "statement") {
					statement = value;
				}
			} else {
				xId = value;
			}
		});
		if (xId == "") {
			xId = from + '/' + to;
		}
		if (to == null || from == null || statement == null) {
			alert('A relation needs at least a to, from, and statement attributes');
			return;
		}
		XML.Attrib("id", xId);
		XML.WriteString('\n'+attrNodes.ToString());
		XML.EndNode();
		XML.EndNode();
	}
	

	XML.EndNode();
	
	var distributomeXML = XML.ToString();
	var win = window.open("", "Save_XML", "");
    if (!win){
		return;
	}
    var doc = win.document;
    doc.write("<html><head><title>Save XML by copying<\br></title></head><body><div><textarea rows=\"50\" cols=\"100\">"+distributomeXML+"</textarea></div></body></html>");
    doc.close();
	alert("To proceed further, Save this XML displayed and email it for review and publishing to info@sistributome.org");
}

// get new attribute for editor
function editorNewAttrDiv(name) {
	var xTemp = new XMLWriter();
	xTemp.BeginNode(name);
	xTemp.WriteString('Click me to edit');
	xTemp.EndNode();
	var $xml = $.parseXML(xTemp.ToString());
	var newDiv = editorAttrDiv($xml);
	newDiv("new", true);
	return newDiv;
}


// get attribute name div
function editorAttrName(name) {
	var temp = $('<div class="attrName" ></div>');
	temp.text(name);
	return temp.clone().wrap('<div/>').parent().html()
	//return '<div class="attrName" >' + name + '</div>';
}

// get attribute value div
function editorAttrValue(value) {
	var temp1 = $('<div class="attrValue" ></div>');
	var temp2 = $('<input class="attrInput" style="display:none" type="text" />');
	temp1.text(value);
	temp2.attr("value", temp1.text());
	return temp1.clone().wrap('<div/>').parent().html() + temp2.clone().wrap('<div/>').parent().html();
	//return '<div class="attrValue" >' + value + '</div>' + '<input class="attrInput" style="display:none" type="text" value="' + value + '" />';
	//return '<div class="attrValue" >' + value + '</div>' + '<textarea class="attrInput" style="display:none" >' + value + '</textarea>';
}

// get attribute div
function editorAttrDiv(node) {
	var nodeName = node.tagName.toLowerCase();
	var nodeValue = $(node).text(); 
	var attrDiv;
	
	attrDiv = $('<div class="attrDiv" >' + editorAttrName(nodeName) + editorAttrValue(nodeValue) + editorAttrButtons() + '</div>');
	//document.write(attrDiv.html());
	attrDiv.data("name", nodeName);
	attrDiv.data("value", nodeValue);
	attrDiv.data("new", false);
	attrDiv.data("editing", false);
	var attrValue = $(attrDiv.find(".attrValue")[0]);
	var attrInput = $(attrDiv.find(".attrInput")[0]);
	var attrDivBut1 = $(attrDiv.find(".attrBut1")[0]);
	var attrDivBut2 = $(attrDiv.find(".attrBut2")[0]);
	var attrEditB = $(attrDiv.find(".attrEditB")[0]);
	var attrRemoveB = $(attrDiv.find(".attrRemoveB")[0]);
	var attrDoneB = $(attrDiv.find(".attrDoneB")[0]);
	var attrCancelB = $(attrDiv.find(".attrCancelB")[0]);
	attrDiv.data("attrValue", attrValue);
	attrDiv.data("attrInput", attrInput);
	attrDiv.data("attrDivBut1", attrDivBut1);
	attrDiv.data("attrDivBut2", attrDivBut2);
	attrDiv.data("attrEditB", attrEditB);
	attrDiv.data("attrRemoveB", attrRemoveB);
	attrDiv.data("attrDoneB", attrDoneB);
	attrDiv.data("attrCancelB", attrCancelB);
	attrDiv.data("changeState", function(state) {
		state = state.toLowerCase();
		if (state == "edit") {
			attrDiv.data("editing", true);
			attrDivBut1.css("display", "none");
			attrDivBut2.css("display", "block");
			attrValue.css("display", "none");
			attrInput.css("display", "block");
		} else if (state == "done" || state == "cancel") {
			attrDiv.data("editing", false);
			attrDivBut1.css("display", "none");
			attrDivBut2.css("display", "none");
			attrValue.css("display", "block");
			attrInput.css("display", "none");
		}
	});
	attrEditB.click(function(){
		attrDiv.data("changeState")("edit");
	});
	attrDoneB.click(function(){
		attrValue.text(attrInput.val());
		attrDiv.data("new", false);
		attrDiv.data("value", attrValue.text());
		attrDiv.data("changeState")("done");
	});
	attrCancelB.click(function(){
		attrInput.val(attrValue.text());
		attrDiv.data("changeState")("cancel");
	});
	attrRemoveB.click(function(){
		attrDiv.remove();
	});
	attrValue.click(function(){
		attrEditB.click();
	});
	attrDiv.hover(function() {
		if (!$(this).data("editing")) {
			$(this).data("attrDivBut1").css("display", "block");
		}
	}, function() {
		if (!$(this).data("editing")) {
			$(this).data("attrDivBut1").css("display", "none");
		}
	});
	if (nodeName == null) {
		return null;
	}
	return attrDiv;
}

// get attribute buttons div
function editorAttrButtons() {
	var but1 = '<div class="attrBut1" ><button class="attrEditB" >Edit</button><button class="attrRemoveB">Remove</button></div>';
	var but2 = '<div class="attrBut2" ><button class="attrDoneB" >Done</button><button class="attrCancelB">Cancel</button></div>';
	return but1 + but2;
}

function editorFooterButtons() {
	return '<div id="nodeFooter" ><button id="fAddAttr">Add Attribute</button><button id="fReset" >Reset</button><button id="fClear" >Cancel</button><button id="fSave">Save</button></div>';
}

function editorFooterAddAttrButtons() {
	return '<div ><button id="fCancel">Cancel</button></div>';
}

function editorReset() {
	editorContent.empty();
	editor.data("editing", false);
	if (editor.data("action") == "existing") {
		xmlToEditor(editor.data("existing"));
	} else if (editor.data("action") == "newDistribution") {
		newDistribution();
	} else if (editor.data("action") == "newRelation") {
		newRelation();
	}
}

function editingFooter() {
	var nodeFooter = $(editorFooterButtons());
	var nodeAddAttrB = $(nodeFooter.find("#fAddAttr")[0]);
	var nodeClearB = $(nodeFooter.find("#fClear")[0]);
	var nodeResetB = $(nodeFooter.find("#fReset")[0]);
	var nodeSaveB = $(nodeFooter.find("#fSave")[0]);
	editor.data("nodeAddAttrB", nodeAddAttrB);
	editor.data("nodeClearB", nodeClearB);
	editor.data("nodeResetB", nodeResetB);
	editor.data("nodeSaveB", nodeSaveB);
	
	nodeClearB.click(editorClear);
	nodeResetB.click(editorReset);
	nodeAddAttrB.click(editorAddAttrDiv);
	nodeSaveB.click(editorSave);
	
	clearFooter();
	editorFooter.append(nodeFooter);
	editor.data("nodeFooter", nodeFooter);
}

function clearFooter() {
	editorFooter.empty();
}

function editorAddAttrDiv(){
	if (!addAttrDiv.data("visible")) {
		$("#addAttrDiv").css("display", "block");
		if (editor.data("type") == "relation") {
			$("#relAttr").css("display", "block");
		} else if (editor.data("type") == "distribution") {
			$("#disAttr").css("display", "block");
		}
		clearFooter();
		var f = $(editorFooterAddAttrButtons());
		editorFooter.append(f);
		var fCancel = $(editorFooter.find("#fCancel")[0]);
		fCancel.click(function(){
			editorAddAttrDiv();
		});
		
		addAttrDiv.data("visible", true);
	} else {
		$("#addAttrDiv").css("display", "none");
		$("#relAttr").css("display", "none");
		$("#disAttr").css("display", "none");
		clearFooter();
		editingFooter();
		editor.data("nodeFooter").css("display", "block");
		addAttrDiv.data("visible", false);
	}
	
}

function appendNewAttr(name) {
	var tempX = document.createElement(name);
	tempX.innerHTML = "Click here to edit new attribute";
	var tempN = editorAttrDiv(tempX);
	tempN.data("new", true);
	editorContent.append(tempN);
}

function editorClear() {
	editor.html(editorCopy.html());
	
	addAttrDiv = $("#addAttrDiv");
	addAttrDiv.data("visible", false);
	
	$(".attrChoice").click(function(){
		var text = $.trim($(this).text()).toLowerCase();
		appendNewAttr(text);
		editorAddAttrDiv();
	});
	
	editorContent = $(editor.find("#editorContent")[0]);
	editorFooter = $(editor.find("#editorFooter")[0]);
	editorTitle = $(editor.find("#editorTitle")[0]);
	editor.data("changeState", function(title) {
		if (typeof title == "string") {
			editorTitle.text(title);
		}
		editorContent.empty();
	});

	editingFooter();
	
	editor.data("action", null);
	editor.data("editing", false);
	editor.data("existing", null);
	editor.data("type", null);
	editor.data("id", null);
	
	$("#createDis").click(function(){
		newDistribution();
	});
	
	$("#createRel").click(function(){
		newRelation();
	});
	
}

// init editor
$(document).ready(function(){
	editor = $("#editor");
	editorCopy = $(editor.clone(false));
	editorClear();
	
	

});