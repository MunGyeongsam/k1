// =============================================================================
// global variables
//
// 1. map
//
// requires
//
// 1. mapDiv
// =============================================================================
const map = new kakao
    .maps
    .Map(initOption.container, initOption.mapOption);
{
    const mapTypeControl = new kakao
        .maps
        .MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao
        .maps
        .ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
}

// =============================================================================
// global functions
// =============================================================================
function zoomIn() {
    var level = map.getLevel();
    map.setLevel(level - 1);
}

function zoomOut() {
    var level = map.getLevel();
    map.setLevel(level + 1);
}

function setDraggable(draggable) {
    map.setDraggable(draggable);
}

function setZoomable(zoomable) {
    map.setZoomable(zoomable);
}

function setCenter(lat, lng) {
    var moveLatLon = new kakao
        .maps
        .LatLng(lat, lng);
    map.setCenter(moveLatLon);
}

function panTo(latLng) {
    map.panTo(latLng);
}

let toggleOverlayMapTypeId = (function () {
    const overlays = {
        terrain: {
            on: false,
            type: kakao.maps.MapTypeId.TERRAIN
        },
        use_district: {
            on: false,
            type: kakao.maps.MapTypeId.USE_DISTRICT
        }
    };
    return function (maptype) {
        if (!(maptype in overlays)) 
            return;
        
        //toggle
        overlays[maptype].on = !(overlays[maptype].on);

        if (overlays[maptype].on) 
            map.addOverlayMapTypeId(overlays[maptype].type);
        else 
            map.removeOverlayMapTypeId(overlays[maptype].type);
        }
    })();