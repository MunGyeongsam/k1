//=============================================================================
// marker manager
//=============================================================================
const markers = new Map();

//=============================================================================
// private variables
//=============================================================================
const _pilotToImg = new Map();
const _lands = [];
const _landToAddr = new Map();
let _LENGTH_OF_LANDS = 0;


const _pilots = [
    "미할당",

    "심한길",
    "사공미르",
    "최달",
    "신버들",
    "윤한결",
    "류한길",
    "복달",
    "황보우람", 
    "성으뜸", 
    "탁빛가람", 
    "황보다운", 
    "성믿음", 
    "백으뜸", 
    "윤버들", 
    "허다운",
    "표한결",
    "황힘찬",
    "이우람",
    "김나길",
    "전믿음"
]


// custumize in each html
let onAddMarker = function(marker) {}
let onRemMarker = function(marker) {}
let mouseOverMarker = function (marker) { };
let mouseOutMarker = function (marker) { };
let clickMarker = function (marker) { };
let posClickMarker = function (marker) { };
let rightClickMarker = function (marker) { };

let onAddedAllMarkers = null;

const markerStateEnum = {
    NOT_ASSIGNED: 0,
    ASSIGNED: 1,
    IN_WORKING: 2,
    DONE: 3,
    IMPOSSIBLE: 4,
};

function makeImage(src, pilot, size1, key1, size2, key2)
{
    let canvas = document.getElementById("kc");
    let context = canvas.getContext("2d");
    let img = new Image();

    img.addEventListener('load', function() {

        context.drawImage(img, 0,0);
        context.font = "12px serif";
        context.fillText(pilot, 10, 30);

        let pimg = _pilotToImg.get(pilot);

        let markerImg = new kakao.maps.MarkerImage(canvas.toDataURL("image/png"), size1);
        pimg[key1] = markerImg;
        
        markerImg = new kakao.maps.MarkerImage(canvas.toDataURL("image/png"), size2);
        pimg[key2] = markerImg;
    });

    img.src = src;
}

//do
{

    const offset = 40;
    const sizeN = new kakao.maps.Size(60+offset, 60+offset);
    const sizeO = new kakao.maps.Size(72+offset, 72+offset);
    
    _pilots.forEach(function(item, index, array){
        _pilotToImg.set(item, {normal: null, over: null, selected: null, selectedOvr: null});
        
        makeImage("res_marker_normal_02.png", item, sizeN, "normal", sizeO, "over");
        makeImage("res_marker_selectover_02.png", item, sizeN, "selected", sizeO, "selectedOvr");
    });
}

const imgs = { normal: [], over: [], selected: [], selectedOvr: [] };
imgs.get = function (marker) {

    if (marker.kkk.state == markerStateEnum.ASSIGNED && _pilotToImg.get(marker.kkk.pilot))
    {
        let pimg = _pilotToImg.get(marker.kkk.pilot);
        
        if (marker.kkk.selected) {
            return marker.kkk.mouseover ? pimg.selectedOvr : pimg.selected;
        }
        else {
            return marker.kkk.mouseover ? pimg.over : pimg.normal;
        }
    }
    else
    {
        let arr = imgs.normal;
        if (marker.kkk.selected) {
            arr = marker.kkk.mouseover ? imgs.selectedOvr : imgs.selected;
        }
        else {
            arr = marker.kkk.mouseover ? imgs.over : imgs.normal;
        }

        return arr[marker.kkk.state];
    }
}
{
    //private
    const offset = 40;
    const sizeN = new kakao.maps.Size(60+offset, 60+offset);
    const sizeO = new kakao.maps.Size(72+offset, 72+offset);
    const nrm = imgs.normal;
    const ovr = imgs.over;
    const sel = imgs.selected;
    const sov = imgs.selectedOvr;

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

    //console.log(nrm);
}

const clusterer = new kakao.maps.MarkerClusterer({
    map: map,               // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true,    // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    //disableClickZoom: true,
    minLevel: 6             // 클러스터 할 최소 지도 레벨 
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

function selectMarker(marker, val)
{
    marker.kkk.selected = val;
    _updateMarker(marker);
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
    posClickMarker(marker);
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

function _findBestResult(result, addr0)
{
    let ret = result[0];

    if(result.length > 1)
    {
        let str0 = '경북 상주시 '+ addr0;
        let str1 = '경북 상주시';
        let ret2 = result.find(
            e => e.address_name.indexOf(str0) >= 0);
        if (!ret2)
            ret2 = result.find(
                e => e.address_name.indexOf(str1) >= 0);
        if (ret2) {
            ret = ret2;
        } else {
            console.log('============ :', result);
        }
    }

    return ret;
}

function makeClouser(i, addr, addr0, land)
{
    return function (result, status) {

        let ti = i;
        let taddr = addr;

        if (status === kakao.maps.services.Status.OK) {

            var ret = _findBestResult(result, addr0);
            addMarker(ret.address_name, new kakao.maps.LatLng(ret.y, ret.x), {addr:addr, land:land});
            if (i==0){
                panTo(new kakao.maps.LatLng(ret.y, ret.x));
            }

            //console.warn('['+ti.toString()+'] : @@@>>> ok :' + taddr);
        } else {
            console.warn('['+ti.toString()+'] : ===>>> not fund :' + taddr);
            console.log(status);
            console.log(result);
        }

        console.assert(_LENGTH_OF_LANDS > 0, "Logic errror");
        --_LENGTH_OF_LANDS;
        if (0 == _LENGTH_OF_LANDS)
        {
            forAllLands();
        }
    };
}

function forAllLands()
{
    if(!onAddedAllMarkers)
        return;
    
    let LEN = _lands.length;
    let mkr, addr, addr1;
    for(let i=0; i<LEN; ++i)
    {
        addr = _lands[i];
        mkr = _landToAddr.get(addr);
        if (mkr)
        {
            onAddedAllMarkers(mkr);
        }
    }
}

function addMarkers(lands) {
    let LEN = lands.length;
    let addr0, addr1, addr;

    _lands.length = 0;
    _landToAddr.clear();
    _LENGTH_OF_LANDS = LEN;

    for(let i=0; i<LEN; ++i)
    {
        let land = lands[i];
        addr0 = land.hasOwnProperty('경작지') ? land['경작지'] : '모서면';
        addr1 = land['경작지_1'];

        addr = addr0 + ' ' + addr1;

        _lands.push(addr);

        //console.log('['+i.toString()+'] :' + addr, addr1);

        addressSearch(addr, makeClouser(i, addr, addr0, land));
    }
}

function addMarker(address, coord, additional = {}) {
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
            position: coord
        });

        //var infowindow = new kakao.maps.InfoWindow({
        //    map: map,
        //    position: new kakao.maps.LatLng(coord.getLat()+0.00004, coord.getLng()),
        //    content: '홍길동'
        //});
        clusterer.addMarker(marker);
        markers.set(address, marker);
        _landToAddr.set(additional.addr, marker);

        marker.additional = additional;
        marker.kkk = {
            //infowindow:infowindow,
            state: markerStateEnum.NOT_ASSIGNED,
            selected: false,
            mouseover: false,
            pilot: ''
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

    delete marker.additional;
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