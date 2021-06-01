
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

function clearTable() {
    var new_tbody = document.createElement('tbody');
    populate_with_new_rows(new_tbody);
    old_tbody
        .parentNode
        .replaceChild(new_tbody, old_tbody)
}

function mapClick(mouseEvent) {
    var latlng = mouseEvent.latLng;
    var message = 'Lat : ' + latlng.getLat();
    message += ', Lng : ' + latlng.getLng();

    var resultDiv = document.getElementById('clickLatlng');
    resultDiv.innerHTML = message;

    centerOfAddress(latlng, function (address, coords) {
        addMarker(address, coords);

        resultDiv = document.getElementById('clickAddress');
        resultDiv.innerHTML = address;
    });
}
function buttonClick(type) {

    kakao
        .maps
        .event
        .removeListener(map, 'click', mapClick);
    if (type == 'RECTANGLE')
        selectOverlay(type);
    else if (type == 'POLYGON')
        selectOverlay(type);
    else if (type == 'MARKER')
        kakao
            .maps
            .event
            .addListener(map, 'click', mapClick);
}

function keyupFunction(e) {
    let state = markerStateEnum.NOT_ASSIGNED;
    if (e.key == '1') {
        state = markerStateEnum.NOT_ASSIGNED;
    } else if (e.key == '2') {
        state = markerStateEnum.ASSIGNED;
    } else if (e.key == '3') {
        state = markerStateEnum.IN_WORKING;
    } else if (e.key == '4') {
        state = markerStateEnum.DONE;
    } else if (e.key == '5') {
        state = markerStateEnum.IMPOSSIBLE;
    } else if (e.key == 'p') {
        popup();
    } else if (e.key == 'a') {
        ptInRectTest(true);
        return;
    } else if (e.key == 'b') {
        ptInRectTest(false);
        return;
    } else {
        console.log(manager.getData());
        return;
    }

    forAllMarker(function (value, key, map) {
        if (value.kkk.selected) {
            value.kkk.state = state;
            value.kkk.selected = false;
            _updateMarker(value);
        }
    });
}

function ptInRectTest(onoff) {
    let data = manager.getData();
    let rects = data.rectangle;
    let polys = data.polygon;

    let LEN = rects.length;
    if (LEN > 0) {
        forAllMarker(function (value, key, map) {
            for (let i = 0; i < LEN; ++i) {
                let s = rects[i].sPoint;
                let e = rects[i].ePoint;
                if (ptInRect(value.getPosition(), s, e)) {
                    value.kkk.selected = onoff;
                    _updateMarker(value);
                }
            }
        });
    }

    LEN = polys.length;
    if (LEN > 0) {
        forAllMarker(function (value, key, map) {
            for (let i = 0; i < LEN; ++i) {
                let points = polys[i].points;
                if (ptInPoly(value.getPosition(), points)) {
                    value.kkk.selected = onoff;
                    _updateMarker(value);
                }
            }
        });
    }
}
let selectedMarker = null;
rightClickMarker = function (marker) {
    remMarker(marker.getTitle());
}
mouseOverMarker = function (marker) {

    var latlng = marker.getPosition();
    console.log(latlng);
    var message = 'Lat : ' + latlng.getLat();
    message += ', Lng : ' + latlng.getLng();

    var resultDiv = document.getElementById('clickLatlng');
    resultDiv.innerHTML = message;

    resultDiv = document.getElementById('clickAddress');
    resultDiv.innerHTML = marker.getTitle();
}
mouseOutMarker = function (marker) { }
clickMarker = function (marker) {
    panTo(marker.getPosition());
}


let loadExcel = function (event) {
    let input = event.target;
    let fname = event.target.files[0];
    excelExport(fname, addMarkers);
}