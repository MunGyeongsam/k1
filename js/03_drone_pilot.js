let selectedMarker;
let selectedAddr;
let selectedPhone;


function tell(num) {
    //location.href = "tell:"+num;
    if (!selectedMarker)
    {
        alert("선택된 택지가 없어요.");
        return;
    }

    window.open('tel:'+selectedPhone);
}
function navi() {
    //console.log("Kakao.init navi");
    if (!selectedMarker)
    {
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

let loadExcel = function (event) {
    let input = event.target;
    let fname = event.target.files[0];
    excelExport(fname, addMarkers);
}

clickMarker = function (marker) {
    if (selectedMarker && marker !== selectedMarker) {
        selectMarker(selectedMarker, false);
    }

    selectedMarker = marker;
    panTo(marker.getPosition());

    var name = marker.additional.land['성명'];

    selectedAddr = marker.getTitle();
    selectedPhone = findPhoneNumber(name);
    
    var resultDiv = document.getElementById('marker_numb');
    resultDiv.innerHTML = name + ' : ' + selectedPhone;

    resultDiv = document.getElementById('marker_addr');
    resultDiv.innerHTML = selectedAddr;

    console.log(marker.getPosition());
}