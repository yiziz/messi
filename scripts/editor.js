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
}

/******* Hide the Dialog Div *******/
function hideDialog(dialog){
	document.getElementById(dialog).style.visibility = "hidden";
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