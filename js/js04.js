//=============================================================================
// marker manager
//=============================================================================
const markers = new Map();

const markerStateEnum = {
    NOT_ASSIGNED        : 0,
    ASSIGNED            : 1,
    IN_WORKING          : 2,
    DONE                : 3,
    IMPOSSIBLE          : 4,
};

const imgs = {normal:[], over:[], selected:[], selectedOvr:[]};
imgs.get = function (marker)
{
    let arr = imgs.normal;
    if (marker.kkk.selected)
    {
        arr = marker.kkk.mouseover ? imgs.selectedOvr : imgs.selected;
    }
    else
    {
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
    for(let i=1; i<=10; ++i)
    {
        nrm.push(new kakao.maps.MarkerImage(`./res/normal/${i}B.png`, sizeN));
        ovr.push(new kakao.maps.MarkerImage(`./res/over/${i}B.png`, sizeO));
        sel.push(new kakao.maps.MarkerImage(`./res/select/${i}B.png`, sizeN));
        sov.push(new kakao.maps.MarkerImage(`./res/selectover/${i}B.png`, sizeO));
    }
}

const clusterer = new kakao.maps.MarkerClusterer({
	map: map,               // 마커들을 클러스터로 관리하고 표시할 지도 객체 
	averageCenter: true,    // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
	minLevel: 5             // 클러스터 할 최소 지도 레벨 
});

// custumize in each html
let mouseOverMarker = function(marker){};
let mouseOutMarker = function(marker){};
let clickMarker = function(marker){};
let rightClickMarker = function(marker){};


const _updateMarker =  function(marker)
{
    marker.setImage(imgs.get(marker));

    if(marker.kkk.mouseover)
        marker.setZIndex(2);
    else if(marker.kkk.selected)
        marker.setZIndex(1);
    else
        marker.setZIndex(0);
}

const _handlerMouseOver = function(marker)
{
    marker.kkk.mouseover = true;

    mouseOverMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseOut = function(marker)
{
    marker.kkk.mouseover = false;

    mouseOutMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseClick = function(marker)
{
    marker.kkk.selected = !marker.kkk.selected;

    clickMarker(marker);
    _updateMarker(marker);
}
const _handlerMouseRightClick = function(marker)
{
    rightClickMarker(marker);
    _updateMarker(marker);
}

function forAllMarker(callback)
{
    markers.forEach(callback);
}

function changeMarkerState(marker, state)
{
    marker.kkk.state = state;
}

function addMarker(address, coord, addtional = {})
{
    remMarker(address);

    var marker = new kakao.maps.Marker({ 
        map:map,
        title:address,
        image:imgs.normal[0],
        border:5,
        position: coord 
    });

    clusterer.addMarker(marker);
    markers.set(address, marker);

    marker.addtional = addtional;
    marker.kkk = {
        state: markerStateEnum.NOT_ASSIGNED,
        selected: false,
        mouseover: false
    };

    marker.mouseOver = function(event){_handlerMouseOver(marker);};
    marker.mouseOut = function(event){_handlerMouseOut(marker);};
    marker.click = function(event){_handlerMouseClick(marker);};
    marker.rightClick = function(event){_handlerMouseRightClick(marker);};
    
    kakao.maps.event.addListener(marker, 'mouseover', marker.mouseOver);
    kakao.maps.event.addListener(marker, 'mouseout', marker.mouseOut);
    kakao.maps.event.addListener(marker, 'click', marker.click);
    kakao.maps.event.addListener(marker, 'rightclick', marker.rightClick);
}

function resetMarker(marker)
{

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

function remMarker(address)
{
    var marker = markers.get(address);
    if (marker)
    {
        resetMarker(marker);
        markers.delete(address);
    }
}

function clearMarkers()
{
    markers.forEach((v, $, _) => {resetMarker(v);});
    markers.clear();
}