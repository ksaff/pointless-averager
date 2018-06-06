
var stuCurr = [];

var currBundle = null;

var GRADE_MAP = {"CD": 3, "P": 2, "N": 1};
var REV_GRADE_MAP = {3: "CD", 2: "P", 1: "N"};
var GRADE_ALIASES = {"I": "N", "M": "N"};

// Pulled from http://rosettacode.org/wiki/Averages/Arithmetic_mean#JavaScript
function mean(array){
 var sum = 0, i;
 for (i = 0; i < array.length; i++)
 {
  sum += array[i];
 }
  return array.length ? sum / array.length : 0;
}

// Pulled from http://rosettacode.org/wiki/Averages/Median#JavaScript
function median(ary) {
    if (ary.length == 0)
        return null;
    ary.sort(function (a,b){return a - b})
    var mid = Math.floor(ary.length / 2);
    if ((ary.length % 2) == 1)  // length is odd
        return ary[mid];
    else 
        return (ary[mid - 1] + ary[mid]) / 2;
}

// Pulled from http://rosettacode.org/wiki/Averages/Mode#JavaScript
function mode(ary) {
    var counter = {};
    var mode = [];
    var max = 0;
    for (var i in ary) {
        if (!(ary[i] in counter))
            counter[ary[i]] = 0;
        counter[ary[i]]++;
 
        if (counter[ary[i]] == max) 
            mode.push(ary[i]);
        else if (counter[ary[i]] > max) {
            max = counter[ary[i]];
            mode = [ary[i]];
        }
    }
    return mode; 
}

/*
function findMode(grades) {
	processGrades = [];
	grades.forEach(function(grd) {
		grd = grd.toUpperCase();
		grd = grd.replace(/^\s+|\s+$/g, '');
		if (grd != '') {
			processGrades.push(grd);
		}
	});
	return mode(processGrades);
}

function build() {
	//clear table
	var stuTable = document.getElementById('stuTable');
	while (stuTable.children.length > 1) {
		stuTable.removeChild(
			stuTable.children[stuTable.children.length - 1]);
	}
	
	for (var i=0; i < stuCurr.length; i++) {
		var stu = stuCurr[i]
		var row = document.createElement('tr');
		var nameCell = document.createElement('td');
		nameCell.innerText = stu.name;
		row.append(nameCell);
		var grdCell = document.createElement('td');
		grdCell.innerText = findMode(stu.grades);
		row.append(grdCell);
		stuTable.appendChild(row);
	}
}
*/







function getBookKey(bundle) {
	return [bundle.className, bundle.markingPeriod].join('|');
}

function indexOfAttrVal(arr, attr, val) {
	for (var i=0; i < arr.length; i++) {
		if (arr[i][attr] === val) {
			return i;
		}
	}
	return -1;
}

function filterGrades(grades) {
	processGrades = [];
	grades.forEach(function(grd) {
		grd = grd.toUpperCase();
		grd = grd.replace(/^\s+|\s+$/g, '');
		if (grd in GRADE_ALIASES) {
			grd = GRADE_ALIASES[grd];
		}
		if (grd != '' && grd != 'E') {
			processGrades.push(grd);
		}
	});
	return processGrades;
}


/** Find average based on select **/
function findAverage(grades) {
	var elem = document.getElementById("avgSelect");
	var avgFunc = elem.value;
	var filGrades = filterGrades(grades);
	console.log(filGrades);
	if (avgFunc.toLowerCase() === "mode") {
		return mode(filGrades);
	} else {
		var procGrades = [];
		filGrades.forEach(function(grd) {
			procGrades.push(GRADE_MAP[grd]);
		});
		console.log(procGrades);
		if (avgFunc.toLowerCase() === "median") {
			var med = median(procGrades);
			console.log(med);
			return REV_GRADE_MAP[Math.round(med)];
		} else if (avgFunc.toLowerCase() === "mean") {
			var mea = mean(procGrades);
			console.log(mea);
			return REV_GRADE_MAP[Math.round(mea)];
		}
	}
}

/** Render table from a midStruct **/
function renderTable(midStruct) {
	// clear
	var stuTable = document.getElementById('stuTable');
	stuTable.innerHTML = '';
	
	var row = document.createElement('tr');
	var nameHdr = document.createElement('th');
	nameHdr.innerText = 'Name';
	row.append(nameHdr);
	midStruct.colNames.forEach(function(colName) {
		var colHdr = document.createElement('th');
		colHdr.innerText = colName;
		colHdr.className = "verticalText";
		row.append(colHdr);
	});
	stuTable.appendChild(row);
	
	for (var i=0; i < midStruct.stuNames.length; i++) {
		var stuName = midStruct.stuNames[i];
		var stuRow = midStruct.stuRows[i];
		
		var thisRow = document.createElement('tr');
		var nameCell = document.createElement('td');
		nameCell.innerText = stuName;
		thisRow.append(nameCell);
		
		stuRow.forEach(function(stu) {
			// find average
			var avg = findAverage(stu.grades);
			var avgCell = document.createElement('td');
			avgCell.innerText = avg;
			thisRow.append(avgCell);
		});
		stuTable.appendChild(thisRow);
	}
}

/** Build data structure for table rendering **/
function buildMidStruct(bundles) {
	// get all student names, sorted
	var stuNames = [];
	var colNames = [];
	bundles.forEach(function(bundle) {
		for (var i=0; i < bundle.students.length; i++){
			var stu = bundle.students[i];
			if (stuNames.indexOf(stu.name) < 0) {
				if (i > 0) {     // should be able to insert after last one
					var lastStu = bundle.students[i-1];
					var lastStuIdx = stuNames.indexOf(lastStu.name);
					stuNames.splice(lastStuIdx+1, 0, stu.name);
				} else {
					stuNames.push(stu.name);
				}
			}
		}
		colNames.push(getBookKey(bundle));
	});
	
	// for each bundle, add grades (whole stu) to student's row, if found in bundle
	//     also add bundle key to list of class/MP keys
	var stuRows = [];
	
	for (var i=0; i < stuNames.length; i++) {
		bundles.forEach(function(bundle) {
			stuIdx = indexOfAttrVal(bundle.students, 'name', stuNames[i]);
			if (stuIdx >= 0) {
				if (stuRows[i] != null) {
					stuRows[i].push(bundle.students[stuIdx]);
				} else {
					stuRows[i] = [bundle.students[stuIdx]];
				}
			} else {
				if (stuRows[i] != null) {
					stuRows[i].push('');
				} else {
					stuRows[i] = [''];
				}
			}
			
		});
	}	
	
	return {stuNames: stuNames,
		    stuRows: stuRows,
		    colNames: colNames};
}



function buildTable (bundle) {
	chrome.storage.local.get('books', function(result) {
		var books = result.books;
		console.log(books);
		var thisKey = getBookKey(bundle);
		// if thisKey in books, don't render...
		if (books != null) {
			
			var bundleList = [];
			books.order.forEach(function(key) {
				bundleList.push(books.bundles[key]);
			});
			
			var bookIdx = books.order.indexOf(thisKey);
			if (bookIdx >= 0) {
				var midStruct = buildMidStruct(bundleList);
				renderTable(midStruct);
			} else {
				var midStruct = buildMidStruct(bundleList.concat([bundle]));
				renderTable(midStruct);
			}
		} else {
			currBundle = bundle;
			var midStruct = buildMidStruct([bundle]);
			renderTable(midStruct);
		}
	});
}

function saveBundle(bundle) {
	var thisKey = getBookKey(bundle);
	chrome.storage.local.get('books', function(result) {
		var books = result.books;
		if (books == null) {
			books = {'order': [thisKey],
			         'bundles': {}};
			books.bundles[thisKey] = bundle;
		} else {
			books.bundles[thisKey] = bundle;
			var idx = books.order.indexOf(thisKey);
			if (idx < 0) {
				books.order.push(thisKey);
			}
		}
		chrome.storage.local.set({'books': books}, function() {
			console.log("Saved.");
			console.log(books);
		});
	});
}

function clearStorage(bundle) {
	chrome.storage.local.clear(function() {
		console.log("Cleared.");
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		}
	});
}

chrome.extension.onRequest.addListener(function(bundle) {
	currBundle = bundle;
	buildTable(bundle);
	
	/*students = bundle.students;
	for (var index in students) {
		stuCurr.push(students[index]);
	}
	build();*/
});

function runExternal() {
	chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
		chrome.tabs.executeScript(
			activeTabs[0].id, {file: 'send_data.js', allFrames: true});
		});
	});
}

window.onload = function() {
	runExternal();
	
	document.getElementById("avgSelect").addEventListener("change", function(e) {
		runExternal();
		buildTable(currBundle);
	});
	
	document.getElementById("saveBtn").addEventListener("click", function(e) {
		runExternal();
		saveBundle(currBundle);
		buildTable(currBundle);
	});
	
	document.getElementById("clearBtn").addEventListener("click", function(e) {
		runExternal();
		clearStorage();
		buildTable(currBundle);
	});
	
};