//Beta-Negative Binomial Experiment
var stepID, runID, time, sum;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tP\tV";
var dist0, dist0Graph, dist1, dist1Graph, aParam, bParam, kParam;
var recordTable, distTable, timeline;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var k = 1, a = 3, b = 3, p;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	dist0Canvas = document.getElementById("dist0Canvas");
	dist1Canvas = document.getElementById("dist1Canvas");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, 10, 1, k, "<var>k</var>");
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(3, 10, 0.1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(3, 5, 0.1, b, "<var>b</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0; sum = 0;
	timeline.reset();
	dist0.data.reset();
	p = dist0.simulate();
	dist0Graph.draw();
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

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = header;
	recordTable.value = completeRecord;
	a = aParam.getValue();
	b = bParam.getValue();
	k = kParam.getValue();
	dist0 = new BetaDistribution(a, b);
	dist0Graph = new DistributionGraph(dist0Canvas, dist0, "P");
	dist1 = new BetaNegativeBinomialDistribution(a, b, k);
	dist1Graph = new DistributionGraph(dist1Canvas, dist1, "V");
	dist1Graph.xFormat = 0;
	timeline = new Timeline(document.getElementById("timeline"), 1, dist1.maxValue, 1);
	timeline.setXFormat(0);
	timeline.setPointSize(3);
	timeline.draw(1);
	dist0Graph.draw();
	dist1Graph.draw();
	distTable.value = dist1Graph.text;
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
	dist0.data.reset();
	p = dist0.simulate();
	dist0Graph.draw();
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
	dist1.setValue(time);
	currentRecord = runCount + "\t" + p.toFixed(2) + "\t" + time;
	completeRecord = completeRecord + "\n" + currentRecord;
	dist1Graph.draw();
	distTable.value = dist1Graph.text;
}	
