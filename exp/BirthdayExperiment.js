//Birthday Experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tV\tI";;
var vDist, iDist, distGraph, mParam, nParam;
var recordTable, distTable;
var runButton, stepButton, runImage, distCanvas, stopSelect, rvSelect, showCheck;
var m = 365, n = 20, N = 50, p;
var ball = new Array(N), count, distinct, duplicate, person;

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
	for (var i = 0; i < N; i++) ball[i] = new Ball(document.getElementById("ball" + i));
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 400, 1, m, "<var>m</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, N, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	distinct = 0;
	for (var i = 0; i < m; i++) count[i] = 0;
	for (var i = 0; i < n; i++) ball[i].setValue(-1);
	person = 0;
	stepID = setInterval(selectBirthday, 50);
}

function runExperiment(){
	runID = setInterval(selectBirthdays, 20);
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
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
	count = new Array(m);
	for (var i = 0; i < N; i++){
		if (i < n) ball[i].setValue(-1);
		else ball[i].setValue(-2);
	}
	completeRecord = "";
	recordTable.value = header;
	p = 1 - perm(m, n) / Math.pow(m, n);
	vDist = new BirthdayDistribution(m, n);
	iDist = new BinomialDistribution(1, p);
	setDist();
}

function setDist(){
	if (rvSelect.value == 0){
		distGraph = new DistributionGraph(distCanvas, vDist, "V");
		distGraph.xFormat = 0;
	}
	else {
		distGraph = new DistributionGraph(distCanvas, iDist, "I");
		distGraph.xFormat = 0;
		distGraph.showMoments(false);
	}
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function selectBirthdays(){
	stopCount++;
	distinct = 0;
	for (var i = 0; i < m; i++) count[i] = 0;
	for (var i = 0; i < n; i++){
		var j = Math.floor(m * Math.random());
		if (count[j] == 0) distinct++;
		count[j]++;
		if (count[j] > 1) ball[i].ballColor = "red";
		else ball[i].ballColor = "green";
		ball[i].setValue(j + 1);
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function selectBirthday(){
	if (person < n){
		var j = Math.floor(m * Math.random());
		if (count[j] == 0) distinct++;
		count[j]++;
		if (count[j] > 1) ball[person].ballColor = "red";
		else ball[person].ballColor = "green";
		ball[person].setValue(j + 1);
		person++;
	}
	else{
		update();
		stopExperiment();
	}
}

function update(){
	runCount++;
	vDist.setValue(distinct);
	if (distinct == n) duplicate = 0; else duplicate = 1;
	iDist.setValue(duplicate);
	currentRecord = runCount + "\t" + distinct + "\t" + duplicate;
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.draw();
	distTable.value = distGraph.text;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}


