function XMLWriter(includeXMLHeader)
{
    if(includeXMLHeader)
		this.XML=new Array('<?xml version="1.0" encoding="UTF-8"?>\n');
	else
		this.XML=[];
    this.Nodes=[];
    this.State="";
    this.FormatXML = function(Str)
    {
        if (Str)
            return Str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return ""
    }
    this.BeginNode = function(Name,numberOfTabs)
    {
        if (!Name) return;
        if (this.State=="beg"){
			this.XML.push(">\n");
		}
        
		this.Nodes.push(Name);
		if(numberOfTabs){
			if (this.State=="beg"){
				this.Nodes.push(numberOfTabs);
				this.Nodes.push("tabs");
			}
			for(var no=0;no<numberOfTabs;no++){
				this.XML.push("\t");
			}
		}
		this.State="beg";
        this.XML.push("<"+Name);
    }
    this.EndNode = function()
    {
        if (this.State=="beg")
        {
            this.XML.push("/>\n");
            this.Nodes.pop();
			this.Nodes.pop();
			this.Nodes.pop();
        }
        else if (this.Nodes.length>0){
			var nodeValue = this.Nodes.pop();
			if(nodeValue == "tabs"){
				var numberOfTabs = this.Nodes.pop();
				for(var no=0;no<numberOfTabs;no++){
					this.XML.push("\t");
				}
				this.XML.push("</"+this.Nodes.pop()+">\n");
			}else this.XML.push("</"+nodeValue+">\n");
		}
        this.State="";
    }
    this.Attrib = function(Name, Value)
    {
        if (this.State!="beg" || !Name) return;
        this.XML.push(" "+Name+"=\""+this.FormatXML(Value)+"\"");
    }
    this.WriteString = function(Value)
    {
        if (this.State=="beg") this.XML.push(">");
        this.XML.push(this.FormatXML(Value));
        this.State="";
    }
    this.Node = function(Name, Value)
    {
        if (!Name) return;
        if (this.State=="beg") this.XML.push(">\n");
        this.XML.push((Value=="" || !Value)?"<"+Name+"/>\n":"<"+Name+">"+this.FormatXML(Value)+"</"+Name+">\n");
        this.State="";
    }
    this.Close = function()
    {
        while (this.Nodes.length>0)
            this.EndNode();
        this.State="closed";
    }
	this.AppendXML = function(appendValue)
	{
		if (this.State=="beg") this.XML.push(">\n");
		this.XML.push(appendValue);
		this.State="";
	}
    this.ToString = function(){return this.XML.join("");}
}