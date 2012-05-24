//Coupon Collector Experiment
var runCount = 0, stopCount = 0, stopFreq = 10,  runID, stepID;
var dist, distCanvas, distGraph, distTable, showCheck;
var m = 20, k = 10, coupon, coupons, distinct, count;
var recordTable, currentRecord, completeRecord = "", header = "Run\tW";
var runButton, stepButton, stopSelect, mParam, kParam, grid;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 25, 1, m, "<var>m</var>");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, m, 1, k, "<var>k</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	grid.draw();
	for (var i = 0; i < m; i++) count[i] = 0;
	distinct = 0;
	coupons = 0;
	stepID = setInterval(selectCoupon, 50);
}

function runExperiment(){
	stepButton.disabled = true; stopSelect.disabled = true;
	runID = setInterval(experiment, 20);
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID)
	clearInterval(runID);
	stepButton.disabled = false; stopSelect.disabled = false; runButton.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	count = new Array(m);
	stopExperiment(); runCount = 0;
	k = kParam.getValue();
	grid = new CellGrid(document.getElementById("cellCanvas"), m);
	grid.draw();
	dist = new CouponDistribution(m, k);
	distGraph = new DistributionGraph(distCanvas, dist, "W");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
	completeRecord = ""; recordTable.value = header;
}

function setParameters(){
	m = mParam.getValue();
	kParam.setProperties(1, m, 1, Math.min(k, m), "<var>k</var>");
	resetExperiment();
}

function experiment(){
	stopCount++;
	for (var i = 0; i < m; i++) count[i] = 0;
	distinct = 0;
	coupons = 0;
	while (distinct < k){
		coupon = Math.floor(m * Math.random());
		coupons++;
		if (count[coupon] == 0) distinct++;
		count[coupon]++;
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}


function selectCoupon(){
	if (distinct < k){
		coupon = Math.floor(m * Math.random());
		coupons++;
		if (count[coupon] == 0) distinct++;
		count[coupon]++;
		grid.showBall(coupon);
	}
	else {
		update();
		stopExperiment();
	}		
}

function update(){
	runCount++;
	grid.showCounts(count);
	dist.setValue(coupons);
	distGraph.draw();
	distTable.value = distGraph.text;
	currentRecord = runCount + "\t" + coupons;
	completeRecord = completeRecord + "\n" + currentRecord;
}
	

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

function CellGrid(canvas, m){
	var cells = m;
	var ctx = canvas.getContext("2d");
	var cols = Math.ceil(Math.sqrt(cells));
	var rows = Math.round(cells / cols) + 1;
	var bigCols = cells % cols;
	var width = canvas.width, height = canvas.height;
	var cellWidth = width / cols, cellHeight = height / cols;
	var radius = Math.min(cellWidth, cellHeight) / 2;
	var labelWidth, lableHeight, label;
	
	this.draw = function(){
		ctx.clearRect(0, 0, width, height);
		var x, y;
		//draw grid
		ctx.strokeStyle = "blue";
		y = 0;
		ctx.beginPath();
		for(var i = 0; i < rows; i++){
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			y = y + cellHeight;
		}
		if (bigCols > 0){
			y = rows * cellHeight;
			x = bigCols * cellWidth;
			ctx.moveTo(0, y);
			ctx.lineTo(x, y);
		}
		x = 0;
		for(var i = 0; i <= cols; i++){
			if (i <= bigCols) y = rows * cellHeight;
			else y = (rows - 1) * cellHeight;
			ctx.moveTo(x, 0);
			ctx.lineTo(x, y);
			x = x + cellWidth;
		}
		ctx.stroke();

	}
	
	this.showCounts = function(c){
		this.draw();
		ctx.fillStyle = "red";
		for (var i = 0; i < cells; i++){
			y = Math.floor(i / cols) * cellHeight + cellHeight / 2;
			x = (i % cols) * cellWidth + cellWidth / 2;
			ctx.fillText(c[i], x, y);
		}
	}
	
	this.showBall = function(j){
		this.draw();
		ctx.fillStyle = "red";
		y = Math.floor(j / cols) * cellHeight + cellHeight / 2;
		x = (j % cols) * cellWidth + cellWidth / 2;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
		ctx.fill();
	}
}
