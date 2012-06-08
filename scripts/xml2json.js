function convertTextToXML(text){
	if(text == ""){
		return null;
	}
	var dom = null;
	if(window.DOMParser){
		try{
			dom = (new DOMParser()).parseFromString(text, "text/xml"); 
		}catch(e){ 
			dom = null; 
		}
	}else if(window.ActiveXObject){
		try{
			dom = new ActiveXObject('Microsoft.XMLDOM');
			dom.async = false;
			if (!dom.loadXML(text))
				window.alert(dom.parseError.reason + dom.parseError.srcText);
		}catch(e){
			dom = null; 
		}
	}else
	  alert("Can not parse XML string. Please check your browser compatibility.");
	return dom;
}

function convertXMLToJSON(xml){
	function setJSONAttributes(obj,node){
		if(node.attributes.length<0)
			return;
		var a=node.attributes.length-1, t;
		obj._att = new Array();
		do{
			t=(node.attributes[a].name).replace(/-/g,"_");
			obj._att.push(t);
			obj[t]=trim(node.attributes[a].value);
		}while(a--);
	}
	function createJSONObjects(obj,node){
		var t, eName, cnode;
		if(!node)
			return null;
		if(node.attributes.length>0){
			setJSONAttributes(obj,node);
		}
		obj.Text="";
		if(node.hasChildNodes()){
			var nodeCount=node.childNodes.length-1, n=0;
			obj._children=[];
			do{
				cnode=node.childNodes[n];
				if(cnode.nodeType==4){
					obj.Text+=(cnode.text)?trim(cnode.text):trim(cnode.nodeValue);
				}else if(cnode.nodeType==3){
					obj.Text+=trim(cnode.nodeValue);
				}else if(cnode.nodeType==1){
					eName = ((cnode.localName)?cnode.localName:cnode.baseName).replace(/-/g,"_");
					obj._children.push(eName);
					if(!obj[eName]){
						obj[eName]=new Array();
					}
					t=new Array();
					obj[eName].push(t);
					if(cnode.attributes.length>0){
						setJSONAttributes(t,cnode);
					}
					if(cnode.hasChildNodes()){
						createJSONObjects(t,cnode);
					}
				}
			}while(n++<nodeCount);
		}
	}
	if(!xml)
		return null;
	try{
		var json=new Array();
		json.typeOf="JSXBObject";
		var docRoot = (xml.nodeType==9) ? xml.documentElement : xml;
		if(docRoot.nodeName)
			json.RootName = docRoot.nodeName;
		else
			json.RootName = "";
		if(xml.nodeType==3||xml.nodeType==4){
			return xml.nodeValue;
		}
		createJSONObjects(json, docRoot);
		return json;
	}catch(err){
		return null;
	}
}
