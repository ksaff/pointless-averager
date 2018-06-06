
function getAllStudents() {
	var stuCol = document.getElementById('ss');

	var students = [];
	var stuChildren = stuCol.children;
	for (var i=0; i < stuChildren.length; i++) {
		var stuLink = stuChildren[i];
		var innerDivs = stuLink.children;
		var stu = {};
		for (var j=0; j < innerDivs.length; j++) {
			var thisDiv = innerDivs[j];
			if (thisDiv.getAttribute('id').startsWith('stuname')) {
				stu.name = thisDiv.innerText.replace(/^\s+|\s+$/g, '');
			} else if (thisDiv.getAttribute('id').startsWith('stuid')) {
				stu.id = thisDiv.innerText.replace(/^\s+|\s+$/g, '');
			}
		}
		if (stu.id) {
			students.push(stu);
		}
	}
	return students;
}	

// porque no los dos...

function getDataByID(stuID) {
	/* Get value from all elements of class scoreenter with data-stuid of 
	stuID which are children of elements of class commenttext2.*/
	var inputs = document.querySelectorAll('.commenttext2 >' +
										   '.scoreenter[data-stuid="' +
										   stuID + '"]');
	var values = [];
	for (var i=0; i < inputs.length; i++) {
		values.push(inputs[i].getAttribute('value'));
	}
	return values;
}

/** Get value out of a "commentcell" **/
function getValueFromCell(cell) {
	var innerDivs = cell.children;
	for (var i=0; i < innerDivs.length; i++) {
		if (innerDivs[i].getAttribute('class') == 'commenttext2') {
			var inp = innerDivs[i].firstChild;
			var val = inp.value;
			return val;
		}
	}
}

function zipColumns() {
	// this really ought to be recursive...
	var cols = document.getElementsByClassName('assignment smallcolumn');
	var colVals = [];
	for (var i=0; i < cols.length; i++) {
		
		var col = cols[i];
		if (!col.classList.contains('hidden-xs')) {
			var cellVals = [];
			var cells = col.children;
			for (var j=0; j < cells.length; j++) {
				var val = getValueFromCell(cells[j]);
				cellVals.push(val);
			}
			colVals.push(cellVals);
		}
	}
	
	// zip
	var zipped = [];
	for (var i=0; i < colVals[0].length; i++) {
		var newRow = [];
		for (var j=0; j < colVals.length; j++) {
			var col = colVals[j];
			newRow.push(col[i]);
		}
		zipped.push(newRow);
	}
	return zipped;
}

var students = getAllStudents();
var studentRows = [];
students.forEach(function(stu) {
	var vals = getDataByID(stu.id);
	studentRows.push(vals);
	stu.grades = vals;
});
//console.log(students);

//var zipped = zipColumns();
//console.log(zipped);

/*var mpSelector = document.querySelector('#gpselector ul li');
var mpText = mpSelector.innerText;
console.log(mpText);*/
bundle = {students: students};
var mpHeader = document.querySelector('#gradebook > .header');
var mpText = mpHeader.childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '').replace(/^Gradebook for /, '');
bundle.markingPeriod = mpText;

var classHeader = document.querySelector('#content-expanded h1');
var classText = classHeader.innerText;
bundle.className = classText;
//console.log(bundle);

chrome.extension.sendRequest(bundle);