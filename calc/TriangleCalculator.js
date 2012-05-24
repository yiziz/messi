//Triangle distribution calculator
var dist, distGraph, aParam, bParam;
var xParam, pParam, graphSelect;
var x, p, b, c;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 10, 0.01, 1, "<var>b</var>");
	cParam = new Parameter(document.getElementById("cInput"), document.getElementById("cLabel"));
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	setParameters();
}

function setParameters(){
	b = bParam.getValue();
	cParam.setProperties(0, b, 0.01, 0, "<var>c</var>");
	setDist();
}

function setDist(){
	c = cParam.getValue();
	dist = new TriangleDistribution(0, b, c);
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
	distGraph = new QuantileGraph(distCanvas, dist, "X");
	distGraph.xFormat = 2;
	distGraph.setGraphType(graphSelect.value);
	setProb();	
}

function setValue(){
	x = xParam.getValue();
	p = dist.CDF(x);
	pParam.setValue(p);
	distGraph.setValue(x);
}

function setProb(){
	p = pParam.getValue();
	x = dist.quantile(p);
	xParam.setValue(x);
	distGraph.setProb(p);
}



