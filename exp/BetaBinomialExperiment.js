//Beta-Binomial Experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tP\tY", dataText;
var dist0, dist1, nParam, aParam, bParam;
var recordTable, dataTable;
var runButton, stepButton, dist0Canvas, dist1Canvas, stopSelect, dist0Graph, dist1Graph;
var n = 10, a = 1, b = 1, y, p, count;
var timeline, time;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	dist0Canvas = document.getElementById("dist0Canvas");
	dist1Canvas = document.getElementById("dist1Canvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 60, 1, n, "<var>n</var>");
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(0.5, 10, 0.1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(0.5, 10, 0.1, b, "<var>b</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = "true";
	runButton.disabled = "true";
	time = 0;
	count = 0;
	y = 0;
	dist0.data.reset();
	p = dist0.simulate();
	dist0Graph.draw();
	timeline.reset();
	stepID = setInterval(doTrial, 50);
}

function runExperiment(){
	stepButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(doTrials, 20);
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
	error = 0; error2 = 0;
	n = nParam.getValue();
	a = aParam.getValue();
	b = bParam.getValue();
	timeline = new Timeline(document.getElementById("timeline"), 1, n, 1);
	timeline.setXFormat(0);
	timeline.setPointSize(3);
	timeline.draw();
	completeRecord = "";
	recordTable.value = header;
	dist0 = new BetaDistribution(a, b);
	dist0Graph = new DistributionGraph(dist0Canvas, dist0,  "P");
	dist0Graph.draw();
	dist1 = new BetaBinomialDistribution(a, b, n);
	dist1Graph = new DistributionGraph(dist1Canvas, dist1, "Y");
	dist1Graph.draw();
	distTable.value = dist1Graph.text;
}

function doTrials(){
	stopCount++;
	y = 0;
	dist0.data.reset();
	p = dist0.simulate();
	dist0Graph.draw();
	timeline.reset();
	for (var i = 1; i <= n; i++) {
		if (Math.random() < p) {
			y++;
			timeline.addArrival(i, "red");
		}
		else timeline.addArrival(i, "green");
	}
	timeline.draw(n);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function doTrial(){
	time++;
	if (time <= n) {
		if (Math.random() < p){
			y++;
			timeline.addArrival(time, "red");
		}
		else timeline.addArrival(time, "green");
		timeline.draw(time);
	}
	else {
		update();
		stopExperiment();
	}
}

function update(){
	runCount++;
	dist1.setValue(y);
	currentRecord = runCount + "\t" + p.toFixed(2) + "\t" + y;
	completeRecord = completeRecord + "\n" + currentRecord;
	dist1Graph.draw();
	distTable.value = dist1Graph.text;
}


