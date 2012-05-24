//Poisson Experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tN";;
var dist, distGraph, tParam, rParam;
var recordTable, distTable, timeline;
var runButton, stepButton, distCanvas, showCheck;
var t = 5, time, r = 5, n;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect").value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	distCanvas = document.getElementById("distCanvas");
	tParam = new Parameter(document.getElementById("tInput"), document.getElementById("tLabel"));
	tParam.setProperties(0.5, 10, 0.1, t, "<var>t</var>");
	rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
	rParam.setProperties(0.5, 10, 0.1, r, "<var>r</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0;
	timeline.reset();
	computeArrivalTimes();
	stepID = setInterval(increaseTime, 50);
}


function runExperiment(){
	runID = setInterval(experiment, 20);
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
	t = tParam.getValue();
	r = rParam.getValue();
	timeline = new Timeline(document.getElementById("timeline"), 0, t, t);
	timeline.setXFormat(1);
	dist = new PoissonDistribution(r * t);
	distGraph = new DistributionGraph(distCanvas, dist, "N");
	showDist(showCheck.checked);
	timeline.draw(0);
}

function experiment(){
	stopCount++;
	timeline.reset();
	computeArrivalTimes();
	timeline.draw(t);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function computeArrivalTimes(){
	var arrivalTime = -Math.log(1 - Math.random()) / r;
	n = 0;
	while (arrivalTime <= t){
		n++;
		timeline.addArrival(arrivalTime, "red");
		arrivalTime = arrivalTime - Math.log(1 - Math.random()) / r;
	}
}

function increaseTime(){
	time = time + t / 200;
	timeline.draw(time);
	if (time >= t){
		update();
		stopExperiment();
	}
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

function update(){
	runCount++;
	currentRecord = runCount + "\t" + n;
	completeRecord = completeRecord + "\n" + currentRecord;
	dist.setValue(n);
	distGraph.draw();
	distTable.value = distGraph.text;
}	

