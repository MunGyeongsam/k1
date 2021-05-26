//=============================================================================
// option
//=============================================================================
const strokeWeight = 1;
const strokeStyle = 'solid';	//solid, dashed, shortdash, ,longdash
const strokeOpacity = 0.8;
const fillOpacity = 0.3;

const options = { // Drawing Manager를 생성할 때 사용할 옵션입니다
    map: map, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
    drawingMode: [ // drawing manager로 제공할 그리기 요소 모드입니다
        kakao.maps.drawing.OverlayType.RECTANGLE,
        kakao.maps.drawing.OverlayType.POLYGON
    ],
    // 사용자에게 제공할 그리기 가이드 툴팁입니다
    // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
    guideTooltip: ['draw', 'drag', 'edit'],
    markerOptions: { // 마커 옵션입니다 
        draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다 
        removable: true // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다  
    },
    rectangleOptions: {
        draggable: true,
        removable: true,
        editable: true,
        strokeWeight: strokeWeight,
        strokeOpacity: 0.7,
        strokeColor: '#39f', // 외곽선 색
        strokeStyle: strokeStyle,
        fillColor: '#39f', // 채우기 색
        fillOpacity: fillOpacity // 채우기색 투명도
    },
    polygonOptions: {
        draggable: true,
        removable: true,
        editable: true,
        strokeWeight: strokeWeight,
        strokeOpacity: 0.7,
        strokeColor: '#39f',
        strokeStyle: strokeStyle,
        fillColor: '#39f',
        fillOpacity: fillOpacity,
        hintStrokeStyle: 'shortdash',
        hintStrokeOpacity: 0.5
    }
};

const manager = new kakao.maps.drawing.DrawingManager(options);
{
    //manager.addListener('drawstart', function(data) {
    //	console.log('[[DrawingManager]] drawstart', data);
    //});
    //manager.addListener('draw', function(data) {
    //	console.log('[[DrawingManager]] draw', data);
    //});
    //manager.addListener('drawend', function(data) {
    //	console.log('[[DrawingManager]] drawend', data);
    //});
    //manager.addListener('drawnext', function(data) {
    //	console.log('[[DrawingManager]] drawnext', data);
    //});
    //manager.addListener('cancel', function(e) {
    //	console.log(e.overlayType);
    //});
    //manager.addListener('remove', function(e) {
    //	console.log(e.overlayType);
    //});
    //manager.addListener('state_changed', function() {
    //	console.log('[[DrawingManager]] state_changed');
    //});
}

//=============================================================================
// global functions
//=============================================================================
function selectOverlay(type) {
    manager.cancel();
    manager.select(kakao.maps.drawing.OverlayType[type]);
}
