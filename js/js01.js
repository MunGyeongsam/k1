// =============================================================================
// global variables
// =============================================================================
let initOption = {

    container: document.getElementById('map'),

    mapOption: {
        center: new kakao
            .maps
            .LatLng(33.450701, 126.570667),
        level: 3
    }
}

let lands;
let owners = new Map();


// =============================================================================
// for xlxs
// =============================================================================
//http://www.gisdeveloper.co.kr/?p=8987 https://eblo.tistory.com/83
function findPhoneNumber(name)
{
    //console.log('find :', name, owners[name]);
    return owners.hasOwnProperty(name) ? owners[name]['전화번호'] : 0;
}

function onLoadXlxs(sheets, callback)
{
    //console.log(sheets);
    lands = XLSX.utils.sheet_to_json(sheets['경작지']);
    let arrOwners = XLSX.utils.sheet_to_json(sheets['농업인']);

    //console.log(lands);
    //console.log(arrOwners);

    arrOwners.forEach(function(owner){
        let key = owner['성명'];
        if (owners.hasOwnProperty(key))
        {
            console.warn("이름 충돌:", key);
        }
        else
        {
            owners[key] = owner;
        }
    });

    callback(lands);
}

function excelExport(fname, callback) {
    
    let reader = new FileReader();

    reader.onload = function () {
        let fileData = reader.result;
        let workBook = XLSX.read(fileData, {type: 'binary'});

        //console.log("wb : ", workBook);
        let sheets = workBook.Sheets;
        onLoadXlxs(sheets, callback);
    };

    reader.readAsBinaryString(fname);
}

// =============================================================================
// to select markers
// =============================================================================
function ptInRect(latLng, sPoint, ePoint) {
    let x = latLng.getLng();
    let y = latLng.getLat();

    return (x >= sPoint.x && x <= ePoint.x) && (y >= sPoint.y && y <= ePoint.y);
}

// http://alienryderflex.com/polygon/
// https://github.com/substack/point-in-polygon/blob/master/nested.js
function ptInPoly(latLng, points) {
    let inside = false;

    let x = latLng.getLng();
    let y = latLng.getLat();

    let LEN = points.length;
    let pi,
        pj;
    for (let i = 0, j = LEN - 1; i < LEN; j = i++) {
        pi = points[i],
        pj = points[j];
        let xi = pi.x,
            yi = pi.y;
        let xj = pj.x,
            yj = pj.y;

        let intersect = ((yi > y) !== (yj > y)) && (
            x < (xj - xi) * (y - yi) / (yj - yi) + xi
        );
        if (intersect) 
            inside = !inside;
        }
    
    return inside;
}
