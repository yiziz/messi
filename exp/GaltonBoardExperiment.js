//Galton Board Experiment
var stepID, runID, time, sum, average;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tY\tM";;
var binomialDist, scaleDist, distGraph, nParam, pParam;
var recordTable, distTable, board;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var n = 10, p = 0.5;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	rvSelect = document.getElementById("rvSelect");
	rvSelect.value = "0";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	distCanvas = document.getElementById("distCanvas");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0, 1, 0.01, p, "<var>p</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0; sum = 0;
	board.reset();
	stepID = setInterval(doTrial, 100);
}

function runExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(doTrials, 20);
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
	p = pParam.getValue();
	n = nParam.getValue();
	board = new GaltonBoard(document.getElementById("board"), n);
	binomialDist = new BinomialDistribution(n, p);
	scaleDist = new LocationScaleDistribution(binomialDist, 0, 1 / n);
	setDist();
	board.reset();
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function setDist(){
	if (rvSelect.value == 0){
		distGraph = new DistributionGraph(distCanvas, binomialDist, "Y");
		distGraph.xFormat = 0;
	}
	else {
		distGraph = new DistributionGraph(distCanvas, scaleDist, "M");
		distGraph.xFormat = 3;
	}
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function doTrial(){
	time++;
	var t;
	if (time <= n) {
		if (Math.random() < p) t = 1;
		else t = 0;
		board.move(t);
		sum = sum + t;
	}
	else {
		update();
		stopExperiment();
	}
}
	

function doTrials(){
	stopCount++; sum = 0;
	board.reset();
	path = new Array(n)
	for (var i = 0; i < n; i++) {
		if (Math.random() < p) {
			path[i] = 1;
			sum++;
		}
		else path[i] = 0;
	}
	board.setPath(path);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function update(){
	runCount++;
	binomialDist.setValue(sum);
	average = sum / n;
	scaleDist.setValue(average);
	currentRecord = runCount + "\t" + sum + "\t" + average.toFixed(3);
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.draw();
	distTable.value = distGraph.text;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}


