//=============================================================================
// statics
//=============================================================================
function createMarkerImage(src, size, options) {
    var markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;            
}

//=============================================================================
// kakao.maps.Map
//=============================================================================
const mapContainer = document.getElementById('map'); // 지도를 표시할 div 

const mapOption = {
	center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
	level: 3 // 지도의 확대 레벨
};

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
const map = new kakao.maps.Map(mapContainer, mapOption);

// 마커 클러스터러를 생성합니다 
const clusterer = new kakao.maps.MarkerClusterer({
	map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
	averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
	minLevel: 5 // 클러스터 할 최소 지도 레벨 
});

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
const mapTypeControl = new kakao.maps.MapTypeControl();

// 지도 타입 컨트롤을 지도에 표시합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);


// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

function getInfo() {
	// 지도의 현재 중심좌표를 얻어옵니다 
	var center = map.getCenter();

	// 지도의 현재 레벨을 얻어옵니다
	var level = map.getLevel();

	// 지도타입을 얻어옵니다
	var mapTypeId = map.getMapTypeId();

	// 지도의 현재 영역을 얻어옵니다 
	var bounds = map.getBounds();

	// 영역의 남서쪽 좌표를 얻어옵니다 
	var swLatLng = bounds.getSouthWest();

	// 영역의 북동쪽 좌표를 얻어옵니다 
	var neLatLng = bounds.getNorthEast();

	// 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
	var boundsStr = bounds.toString();


	var message = '지도 중심좌표는 위도 ' + center.getLat() + ', <br>';
	message += '경도 ' + center.getLng() + ' 이고 <br>';
	message += '지도 레벨은 ' + level + ' 입니다 <br> <br>';
	message += '지도 타입은 ' + mapTypeId + ' 이고 <br> ';
	message += '지도의 남서쪽 좌표는 ' + swLatLng.getLat() + ', ' + swLatLng.getLng() + ' 이고 <br>';
	message += '북동쪽 좌표는 ' + neLatLng.getLat() + ', ' + neLatLng.getLng() + ' 입니다';

	// 개발자도구를 통해 직접 message 내용을 확인해 보세요.
	console.log(message);
}

// 지도 레벨은 지도의 확대 수준을 의미합니다
// 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
function zoomIn() {
	// 현재 지도의 레벨을 얻어옵니다
	var level = map.getLevel();

	// 지도를 1레벨 내립니다 (지도가 확대됩니다)
	map.setLevel(level - 1);
}

function zoomOut() {
	// 현재 지도의 레벨을 얻어옵니다
	var level = map.getLevel();

	// 지도를 1레벨 올립니다 (지도가 축소됩니다)
	map.setLevel(level + 1);
}


// 버튼 클릭에 따라 지도 이동 기능을 막거나 풀고 싶은 경우에는 map.setDraggable 함수를 사용합니다
function setDraggable(draggable) {
	// 마우스 드래그로 지도 이동 가능여부를 설정합니다
	map.setDraggable(draggable);
}

// 버튼 클릭에 따라 지도 확대, 축소 기능을 막거나 풀고 싶은 경우에는 map.setZoomable 함수를 사용합니다
function setZoomable(zoomable) {
	// 마우스 휠로 지도 확대,축소 가능여부를 설정합니다
	map.setZoomable(zoomable);
}

function setCenter(lat, lng) {
	// 이동할 위도 경도 위치를 생성합니다 
	var moveLatLon = new kakao.maps.LatLng(lat, lng);

	// 지도 중심을 이동 시킵니다
	map.setCenter(moveLatLon);
}

function panTo(lat, lng) {
	// 이동할 위도 경도 위치를 생성합니다 
	var moveLatLon = new kakao.maps.LatLng(lat, lng);

	// 지도 중심을 부드럽게 이동시킵니다
	// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
	map.panTo(moveLatLon);
}

let terrainLayer = false;
let districtLayer = false;
function toggleOverlayMapTypeId(maptype) {
	let changeMaptype;

	// maptype에 따라 지도에 추가할 지도타입을 결정합니다
	if (maptype === 'terrain') {

		// 지형정보 지도타입
		terrainLayer = !terrainLayer
		changeMaptype = kakao.maps.MapTypeId.TERRAIN;

		if (terrainLayer)
			map.addOverlayMapTypeId(changeMaptype);
		else
			map.removeOverlayMapTypeId(changeMaptype);
	} else if (maptype === 'use_district') {

		// 지적편집도 지도타입
		districtLayer = !districtLayer
		changeMaptype = kakao.maps.MapTypeId.USE_DISTRICT;

		if (districtLayer)
			map.addOverlayMapTypeId(changeMaptype);
		else
			map.removeOverlayMapTypeId(changeMaptype);
	}
}


//=============================================================================
// kakao.maps.services.Geocoder
//=============================================================================
// 주소-좌표 변환 객체를 생성합니다
const geocoder = new kakao.maps.services.Geocoder();

function searchAddrFromCoords(coords, callback) {
	// 좌표로 행정동 주소 정보를 요청합니다
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
	// 좌표로 법정동 상세 주소 정보를 요청합니다
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function addrToCoords(address, callback) {
	geocoder.addressSearch(address, callback);
}
