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
	}
}

clickMarker = function (marker) {
	if (selectedMarker && marker !== selectedMarker) {
		selectMarker(selectedMarker, false);
	}

	selectedMarker = marker;
	panTo(marker.getPosition());

	var combo = document.getElementById("id-state");
	combo.disabled = false;

	var name = marker.additional.land['성명'];

	selectedAddr = marker.getTitle();
	selectedPhone = findPhoneNumber(name);

	var resultDiv = document.getElementById('marker_numb');
	resultDiv.innerHTML = name + ' : ' + selectedPhone;

	resultDiv = document.getElementById('marker_addr');
	resultDiv.innerHTML = selectedAddr;

	//console.log(marker.getPosition());
}

/*
let id = 1;
onAddMarker = function (marker) {
	addRow(marker);
}
onRemMarker = function (marker) {
	removeRow(marker);
}

function removeRow(marker) {
	var table = document.getElementById("list");
	var row = table.deleteRow(marker.row.rowIndex);
}

function addRow(marker) {
	var table = document.getElementById("list");
	var row = table.insertRow(table.rows.length);
	let cell0 = row.insertCell(0);
	let cell1 = row.insertCell(1);
	let cell2 = row.insertCell(2);
	let cell3 = row.insertCell(3);

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
	cell2.innerHTML = ".";
	cell3.innerHTML = "미할당";

	marker.row = row;

	row.onclick = function () {
		console.log("marker", marker);
		console.log(marker.innerHTML);
		marker.kkk.selected = !marker.kkk.selected;
		_updateMarker(marker);
		clickMarker(marker);
		row.toggleClass("clicked");
	}
}
//*/