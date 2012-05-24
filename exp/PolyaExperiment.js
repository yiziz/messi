//Ball and Urn Experiment
var runID, stepID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tY\tM";
var dist, distCanvas, distGraph, aParam, bParam, cParam, nParam;
var recordTable, distTable;
var runButton, stepButton, runImage, distCanvas, stopSelect, sampleSelect, showCheck;
var a = 1, b = 1, c = 1, n = 10, N = 50, p, totalRed, totalGreen;
var ball = new Array(N);
var y, m;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	for (var i = 0; i < N; i++) ball[i] = new Ball(document.getElementById("ball" + i));
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(1, 50, 1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 50, 1, b, "<var>b</var>");
	cParam = new Parameter(document.getElementById("cInput"), document.getElementById("cLabel"));
	cParam.setProperties(1, 50, 1, c, "<var>c</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	y = 0;
	count = 0;
	totalRed = a; totalGreen = b;
	for (var i = 0; i < N; i++){
		if (i < n) ball[i].setValue(-1);
		else ball[i].setValue(-2);
	}
	stepID = setInterval(selectBall, 50);
}

function runExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(selectBalls, 20);
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(runID);
	clearInterval(stepID);
	stepButton.disabled = false;
	runButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	a = aParam.getValue();
	b = bParam.getValue();
	c = cParam.getValue();
	n = nParam.getValue();
	for (var i = 0; i < N; i++){
		if (i < n) ball[i].setValue(-1);
		else ball[i].setValue(-2);
	}
	completeRecord = "";
	recordTable.value = header;
	dist = new PolyaDistribution(a, b, c, n);
	distGraph = new DistributionGraph(distCanvas, dist, "Y");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function selectBalls(){
	stopCount++;
	totalRed = a, totalGreen = b;
	y = 0;
	for (var i = 0; i < n; i++){
		p = totalRed / (totalRed + totalGreen);
		if (Math.random() < p) {
			y++;
			ball[i].ballColor = "red";
			ball[i].setValue(Math.ceil(Math.random() * totalRed));
			totalRed = totalRed + c;
		}
		else{
			ball[i].ballColor = "green";
			ball[i].setValue(Math.ceil(Math.random() * totalGreen));
			totalGreen = totalGreen + c;
		}
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function selectBall(){
	if (count < n){
		p = totalRed / (totalRed + totalGreen);
		if (Math.random() < p){
			ball[count].ballColor = "red";
			ball[count].setValue(Math.ceil(Math.random() * totalRed));
			totalRed = totalRed + c;
			y++;
		}
		else{
			ball[count].ballColor = "green";
			ball[count].setValue(Math.ceil(Math.random() * totalGreen));
			totalGreen = totalGreen + c;
		}
		count++;
	}
	else{
		update();
		stopExperiment();
	}
}

function update(){
	runCount++;
	m = y / n;
	currentRecord = runCount + "\t" + y + "\t" + m.toFixed(2);
	completeRecord = completeRecord + "\n" + currentRecord;
	dist.setValue(y);
	distGraph.draw();
	distTable.value = distGraph.text;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

