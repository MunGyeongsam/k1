//=============================================================================
// marker manager
//=============================================================================
const markers = new Map();

// custumize in each html
let onAddMarker = function(marker) {}
let onRemMarker = function(marker) {}
let mouseOverMarker = function (marker) { };
let mouseOutMarker = function (marker) { };
let clickMarker = function (marker) { };
let rightClickMarker = function (marker) { };

const markerStateEnum = {
    NOT_ASSIGNED: 0,
    ASSIGNED: 1,
    IN_WORKING: 2,
    DONE: 3,
    IMPOSSIBLE: 4,
};

const imgs = { normal: [], over: [], selected: [], selectedOvr: [] };
imgs.get = function (marker) {
    let arr = imgs.normal;
    if (marker.kkk.selected) {
        arr = marker.kkk.mouseover ? imgs.selectedOvr : imgs.selected;
    }
    else {
        arr = marker.kkk.mouseover ? imgs.over : imgs.normal;
    }

    return arr[marker.kkk.state];
}
{
    //private
    let sizeN = new kakao.maps.Size(60, 60);
    let sizeO = new kakao.maps.Size(72, 72);
    let nrm = imgs.normal;
    let ovr = imgs.over;
    let sel = imgs.selected;
    let sov = imgs.selectedOvr;

    //let path = 'https://raw.githubusercontent.com/MunGyeongsam/k1/main';
    //let path = 'https://github.com/MunGyeongsam/k1/blob/main';
    for (let i = 1; i <= 10; ++i) {
        //nrm.push(new kakao.maps.MarkerImage(path+`/res/normal/${i}B.png`, sizeN));
        //ovr.push(new kakao.maps.MarkerImage(path+`/res/over/${i}B.png`, sizeO));
        //sel.push(new kakao.maps.MarkerImage(path+`/res/select/${i}B.png`, sizeN));
        //sov.push(new kakao.maps.MarkerImage(path+`/res/selectover/${i}B.png`, sizeO));
        let is = i.toString();
        if (i !== 10) is = '0' + is;

        nrm.push(new kakao.maps.MarkerImage(`res_marker_normal_${is}.png`, sizeN));
        ovr.push(new kakao.maps.MarkerImage(`res_marker_over_${is}.png`, sizeO));
        sel.push(new kakao.maps.MarkerImage(`res_marker_select_${is}.png`, sizeN));
        sov.push(new kakao.maps.MarkerImage(`res_marker_selectover_${is}.png`, sizeO));
    }
}

const clusterer = new kakao.maps.MarkerClusterer({
    map: map,               // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true,    // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 8             // 클러스터 할 최소 지도 레벨 
});



const _updateMarker = function (marker) {
    marker.setImage(imgs.get(marker));

    marker.setOpacity(1);
    if (marker.kkk.mouseover) {
        marker.setZIndex(2);
        //marker.kkk.infowindow.setZIndex(2);
    } else if (marker.kkk.selected) {
        marker.setZIndex(1);
        marker.setOpacity(0.9);
        //marker.kkk.infowindow.setZIndex(1);
    } else {
        marker.setZIndex(0);
        //marker.kkk.infowindow.setZIndex(0);
    }
}

const _handlerMouseOver = function (marker) {
    marker.kkk.mouseover = true;

    mouseOverMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseOut = function (marker) {
    marker.kkk.mouseover = false;

    mouseOutMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseClick = function (marker) {
    marker.kkk.selected = !marker.kkk.selected;

    clickMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseRightClick = function (marker) {
    rightClickMarker(marker);
}

function forAllMarker(callback) {
    markers.forEach(callback);
}

function changeMarkerState(marker, state) {
    marker.kkk.state = state;
}

function addMarker(address, coord, addtional = {}) {
    let marker = markers.get(address);
    if (marker)
    {
        marker.setMap(null);
        marker.setMap(map);
    }
    else
    {
        marker = new kakao.maps.Marker({
            map: map,
            title: address,
            image: imgs.normal[0],
            text:'홍길동',
            position: coord
        });

        //var infowindow = new kakao.maps.InfoWindow({
        //    map: map,
        //    position: new kakao.maps.LatLng(coord.getLat()+0.00004, coord.getLng()),
        //    content: '홍길동'
        //});
        clusterer.addMarker(marker);
        markers.set(address, marker);

        marker.addtional = addtional;
        marker.kkk = {
            //infowindow:infowindow,
            state: markerStateEnum.NOT_ASSIGNED,
            selected: false,
            mouseover: false
        };

        marker.mouseOver = function (event) { _handlerMouseOver(marker); };
        marker.mouseOut = function (event) { _handlerMouseOut(marker); };
        marker.click = function (event) { _handlerMouseClick(marker); };
        marker.rightClick = function (event) { _handlerMouseRightClick(marker); };

        kakao.maps.event.addListener(marker, 'mouseover', marker.mouseOver);
        kakao.maps.event.addListener(marker, 'mouseout', marker.mouseOut);
        kakao.maps.event.addListener(marker, 'click', marker.click);
        kakao.maps.event.addListener(marker, 'rightclick', marker.rightClick);

        onAddMarker(marker);
    }
}

function resetMarker(marker) {
    //marker.kkk.infowindow.close();

    kakao.maps.event.removeListener(marker, 'mouseover', marker.mouseOver);
    kakao.maps.event.removeListener(marker, 'mouseout', marker.mouseOut);
    kakao.maps.event.removeListener(marker, 'click', marker.click);
    kakao.maps.event.removeListener(marker, 'rightclick', marker.rightClick);

    delete marker.addtional;
    delete marker.kkk;
    delete marker.mouseOver;
    delete marker.mouseOut;
    delete marker.click;
    delete marker.rightClick;

    marker.setMap(null);
    clusterer.removeMarker(marker);
}

function remMarker(address) {
    var marker = markers.get(address);
    if (marker) {
        resetMarker(marker);
        markers.delete(address);
        onRemMarker(marker);
    }
}

function clearMarkers() {
    markers.forEach((v, $, _) => { onRemMarker(v); resetMarker(v); });
    markers.clear();
}