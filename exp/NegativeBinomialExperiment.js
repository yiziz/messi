//Negative Binomial Experiment
var stepID, runID, time, sum;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tV";
var dist, distGraph, pParam, kParam;
var recordTable, distTable, timeline;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var k = 1, p = 0.5;

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
	distCanvas = document.getElementById("distCanvas");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, 5, 1, k, "<var>k</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.1, 1, 0.01, p, "<var>p</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0; sum = 0;
	timeline.reset();
	stepID = setInterval(doTrial, 50);
}

function runExperiment(){
	runID = setInterval(doTrials, 20);
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID);
	clearInterval(runID);
	stepButton.disabled = false;
	runButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = completeRecord;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}


function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = header;
	recordTable.value = completeRecord;
	p = pParam.getValue();
	k = kParam.getValue();
	dist = new NegativeBinomialDistribution(k, p);
	distGraph = new DistributionGraph(distCanvas, dist, "V");
	distGraph.xFormat = 0;
	timeline = new Timeline(document.getElementById("timeline"), 1, dist.maxValue, 1);
	timeline.setXFormat(0);
	timeline.setPointSize(3);
	timeline.draw(1);
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function doTrial(){
	if (sum < k) {
		time++;
		if (Math.random() < p){
			sum++;
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
	

function doTrials(){
	stopCount++; sum = 0; time = 0;
	timeline.reset();
	while (sum < k) {
		time++;
		if (Math.random() < p) {
			sum++;
			timeline.addArrival(time, "red");
		}
		else timeline.addArrival(time, "green");
	}
	timeline.draw(time);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function update(){
	runCount++;
	dist.setValue(time);
	currentRecord = runCount + "\t" + time;
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.draw();
	distTable.value = distGraph.text;
}	
