//Finite order statistics experiment
var runID, stepID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header;
var dist, distCanvas, distGraph, mParam, nParam, kParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, sampleSelect, showCheck;
var m = 10, n = 5, k = 1, N = 50, type = 0;
var x = new Array(n);
var ball = new Array(N);
var pop = new Array(m);

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
	for (var i = 0; i < m; i++) pop[i] = i + 1;
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 100, 1, m, "<var>m</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, m, 1, n, "<var>n</var>");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, n, 1, k, "<var>k</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	s = sample(pop, n, type);
	count = 0;
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
	m = mParam.getValue();
	n = nParam.getValue();
	k = kParam.getValue();
	for (var i = 0; i < N; i++){
		if (i < n) ball[i].setValue(-1);
		else ball[i].setValue(-2);
	}
	completeRecord = "";
	header = "Run";
	for (var i = 1; i <= n; i++) header = header + "\tX(" + i + ")"; 
	recordTable.value = header;
	dist = new FiniteOrderStatistic(m, n, k);
	distGraph = new DistributionGraph(distCanvas, dist, "X(" + k + ")");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function setPopulation(){
	m = mParam.getValue();
	pop = new Array(m);
	for (var i = 0; i < m; i++) pop[i] = i + 1;
	nParam.setProperties(1, Math.min(m, N), 1, Math.min(n, N), "<var>n</var>") ;
	kParam.setProperties(1, n, 1, Math.min(k, n), "<var>k</var>");
	resetExperiment();
}

function setSample(){
	n = nParam.getValue();
	kParam.setProperties(1, n, 1, Math.min(k, n), "<var>k</var>");
	resetExperiment();
}

function setOrder(){
	resetExperiment();
}

function selectBalls(){
	stopCount++;
	s = sample(pop, n, type);
	for (var i = 0; i < n; i++){
		ball[i].ballColor = "green";
		ball[i].setValue(s[i]);
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function selectBall(){
	if (count < n){
		ball[count].ballColor = "green";
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
	currentRecord = runCount;
	x = s.sort(ascend);
	for (var i = 0; i < n; i++) currentRecord = currentRecord + "\t" + x[i];
	for (var i = 0; i < n; i++) if (ball[i].value == x[k - 1]){
		ball[i].ballColor = "red";
		ball[i].setValue(x[k - 1]);
	}		
	completeRecord = completeRecord + "\n" + currentRecord;
	dist.setValue(x[k - 1]);
	distGraph.draw();
	distTable.value = distGraph.text;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

