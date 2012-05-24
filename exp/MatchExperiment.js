//Mathcing experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tN";;
var matchDist, distGraph, nParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, showCheck;
var ball = new Array(14);
var n = 5, N = 20, matches, p, s, count;

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
	distCanvas = document.getElementById("distCanvas");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(2, N, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	count = 0; matches = 0;
	s = sample(p, n, 0);
	for (var i = 0; i < n; i++) ball[i].setValue(-1);
	stepID = setInterval(selectBall, 50);
}

function runExperiment(){
	runID = setInterval(selectBalls, 20);
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
	n = nParam.getValue();
	p = new Array(n);
	for (var i = 0; i < n; i++) p[i] = i + 1;
	s = new Array(n);
	for (var i = 0; i < N; i++){
		if (i < n) ball[i].setValue(-1);
		else ball[i].setValue(-2);
	}
	matchDist = new MatchDistribution(n);
	distGraph = new DistributionGraph(distCanvas, matchDist, "N");
	distGraph.xFormat = 0;
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function selectBalls(){
	stopCount++; matches = 0;
	s = sample(p, n, 0);
	for (var i = 0; i < n; i++){
		if (s[i] == i + 1) {
			matches++;
			ball[i].ballColor = "red";
		}
		else ball[i].ballColor = "green";
		ball[i].setValue(s[i]);
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function selectBall(){
	if (count < n){
		if (s[count] == count + 1){
			matches++;
			ball[count].ballColor = "red";
		}
		else ball[count].ballColor = "green";
		ball[count].setValue(s[count]);
		count++;
	}
	else{
		update();
		stopExperiment();
	}
}

function update(){
	runCount++;
	matchDist.setValue(matches);
	currentRecord = runCount + "\t" + matches;
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.draw();
	distTable.value = distGraph.text;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

