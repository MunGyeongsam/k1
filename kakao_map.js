



var mapContainer = document.getElementById('map'), // 지도를 표시할 div 

mapOption = { 
	center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
	level: 5 // 지도의 확대 레벨
};

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도 타입 컨트롤을 지도에 표시합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);


// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
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
	// ex) console.log(message);
}

// 지도 레벨을 표시합니다
displayLevel();

// 지도 레벨은 지도의 확대 수준을 의미합니다
// 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
function zoomIn() {        
	// 현재 지도의 레벨을 얻어옵니다
	var level = map.getLevel();
	
	// 지도를 1레벨 내립니다 (지도가 확대됩니다)
	map.setLevel(level - 1);
	
	// 지도 레벨을 표시합니다
	displayLevel();
}    

function zoomOut() {    
	// 현재 지도의 레벨을 얻어옵니다
	var level = map.getLevel(); 
	
	// 지도를 1레벨 올립니다 (지도가 축소됩니다)
	map.setLevel(level + 1);
	
	// 지도 레벨을 표시합니다
	displayLevel(); 
}    

function displayLevel(){
	var levelEl = document.getElementById('maplevel');
	levelEl.innerHTML = '현재 지도 레벨은 ' + map.getLevel() + ' 레벨 입니다.';
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

var terrainLayer = false;
var districtLayer = false;
function toggleOverlayMapTypeId(maptype) {
	var changeMaptype;
    
    // maptype에 따라 지도에 추가할 지도타입을 결정합니다
   if (maptype === 'terrain') {
        
        // 지형정보 지도타입
		terrainLayer = !terrainLayer
        changeMaptype = kakao.maps.MapTypeId.TERRAIN;

		if(terrainLayer)
			map.addOverlayMapTypeId(changeMaptype);
		else
			map.removeOverlayMapTypeId(changeMaptype);
    } else if (maptype === 'use_district') {
        
        // 지적편집도 지도타입
		districtLayer = !districtLayer
        changeMaptype = kakao.maps.MapTypeId.USE_DISTRICT;       

		if(districtLayer)
			map.addOverlayMapTypeId(changeMaptype);
		else
			map.removeOverlayMapTypeId(changeMaptype);    
    }
}