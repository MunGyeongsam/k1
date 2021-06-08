let selectedMarker;
let selectedAddr;
let selectedPhone;


function tell(num) {
	//location.href = "tell:"+num;
	if (!selectedMarker) {
		alert("선택된 택지가 없어요.");
		return;
	}

	window.open('tel:' + selectedPhone);
}
function navi() {
	//console.log("Kakao.init navi");
	if (!selectedMarker) {
		alert("선택된 택지가 없어요.");
		return;
	}

	let latLng = selectedMarker.getPosition();

	Kakao.Navi.start({
		name: selectedAddr,
		x: latLng.getLng(),
		y: latLng.getLat(),
		coordType: 'wgs84',
		routeInfo: true
	});
}

function loadExcel(event) {
	let input = event.target;
	let fname = event.target.files[0];

	onAddedAllMarkers = addRow;
	excelExport(fname, addMarkers);
}

function chageStateSelect() {
	var combo = document.getElementById("id-state");
	var selectValue = combo.options[combo.selectedIndex].value;

	let state = markerStateEnum.NOT_ASSIGNED;
	if (selectValue == 'ASSIGNED') {
		state = markerStateEnum.ASSIGNED;
	} else if (selectValue == 'IN_WORKING') {
		state = markerStateEnum.IN_WORKING;
	} else if (selectValue == 'DONE') {
		state = markerStateEnum.DONE;
	} else if (selectValue == 'IMPOSSIBLE') {
		state = markerStateEnum.IMPOSSIBLE;
	}

	if (selectedMarker) {
		selectedMarker.kkk.state = state;
		_updateMarker(selectedMarker);
		updateTable(selectedMarker);
	}
}

function updateSelectIndex(marker) {
	var combo = document.getElementById("id-state");
	var state = marker.kkk.state;

	if (state == markerStateEnum.NOT_ASSIGNED) {
		combo.selectedIndex = 0;
	} else if (state == markerStateEnum.ASSIGNED) {
		combo.selectedIndex = 1;
	} else if (state == markerStateEnum.IN_WORKING) {
		combo.selectedIndex = 2;
	} else if (state == markerStateEnum.DONE) {
		combo.selectedIndex = 3;
	} else if (state == markerStateEnum.IMPOSSIBLE) {
		combo.selectedIndex = 4;
	}
}

function setSelectMarker(marker) {
	if (selectedMarker && marker !== selectedMarker) {
		selectMarker(selectedMarker, false);
	} else {
		var combo = document.getElementById("id-state");
		combo.disabled = false;
	}

	selectedMarker = marker;
	updateSelectIndex(selectedMarker);
	panTo(marker.getPosition());

	var name = marker.additional.land['성명'];

	selectedAddr = marker.getTitle();
	selectedPhone = findPhoneNumber(name);

	var resultDiv = document.getElementById('marker_numb');
	resultDiv.innerHTML = name + ' : ' + selectedPhone;

	resultDiv = document.getElementById('marker_addr');
	resultDiv.innerHTML = selectedAddr;
}

clickMarker = function (marker) {
	//토글 방지
	marker.kkk.selected = true;

	setSelectMarker(marker);
	selectRow(marker.row);
	updateScroll(marker.row);
}

//*
let id = 1;
onAddMarker = function (marker) {
	//addRow(marker);
}
onRemMarker = function (marker) {
	removeRow(marker);
}

function removeRow(marker) {
	var table = document.getElementById("list");
	var row = table.deleteRow(marker.row.rowIndex);
}

function updateTable(marker) {
	let state = marker.kkk.state;
	let value = "...";
	if (state == markerStateEnum.NOT_ASSIGNED) {
		value = "미할당";
	} else if (state == markerStateEnum.ASSIGNED) {
		value = "할당";
	} else if (state == markerStateEnum.IN_WORKING) {
		value = "작업시작";
	} else if (state == markerStateEnum.DONE) {
		value = "완료";
	} else if (state == markerStateEnum.IMPOSSIBLE) {
		value = "작업불가";
	}

	marker.row.cells[2].innerHTML = value;
}

function updateScroll(row) {
	var dtbl = document.getElementById("dtbl");
	dtbl.scrollTop = row.offsetTop;
}

let selectedRow;
function selectRow(row) {
	if (selectedRow) {
		selectedRow.style.backgroundColor = selectedRow.orgColor;
	}
	selectedRow = row;

	row.orgColor = row.style.backgroundColor;
	row.style.backgroundColor = '#BCD4EC';
}

function addRow(marker) {
	var table = document.getElementById("list");
	var row = table.insertRow(table.rows.length);
	let cell0 = row.insertCell(0);
	let cell1 = row.insertCell(1);
	let cell2 = row.insertCell(2);

	//let a = marker.a.innerHTML;
	//marker.a.innerHTML = a + "<span class='centered' onclick='return false;'>kday</span>";

	//let a = marker.a.innerHTML;
	//marker.a.innerHTML = a;
	//marker.setMap(null);


	let addr = marker.getTitle();
	let words = addr.split(' ');

	if (words.length > 4) {
		addr = words[3];
		const LEN = words.length;
		for (var i = 4; i < LEN; ++i) {
			addr += ' ' + words[i];
		}
	}

	if (id == 1)
		panTo(marker.getPosition());

	cell0.innerHTML = (id++).toString();
	cell1.innerHTML = addr;
	cell2.innerHTML = "미할당";

	marker.row = row;

	row.onclick = function () {
		//console.log("marker", marker);
		//console.log(row.innerHTML);
		if (marker.kkk.selected)
			return;

		marker.kkk.selected = true;
		_updateMarker(marker);
		setSelectMarker(marker);
		selectRow(this);
	}
}
//*/
