//=============================================================================
// global variables
//=============================================================================
let initOption = {

    container : document.getElementById('map'),

    mapOption : {
        center : new kakao.maps.LatLng(33.450701, 126.570667), 
        level : 3
    }
}


function excelExport(event, callback)
{
    var input = event.target;
    var reader = new FileReader();
    
    reader.onload = function(){
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type : 'binary'});
        var rowObj =XLSX.utils.sheet_to_json(wb.Sheets['경작지']);

        callback(rowObj);
    };

    reader.readAsBinaryString(input.files[0]);
}

function ptInRect(latLng, sPoint, ePoint)
{
    let x = latLng.getLng();
    let y = latLng.getLat();

    return (x >= sPoint.x && x <= ePoint.x) && (y >= sPoint.y && y <= ePoint.y);
}

//http://alienryderflex.com/polygon/
//https://github.com/substack/point-in-polygon/blob/master/nested.js
function ptInPoly(latLng, points)
{
    let inside = false;

    let x = latLng.getLng();
    let y = latLng.getLat();

    let LEN = points.length;
    let pi, pj;
    for(let i=0, j = LEN -1; i<LEN; j = i++)
    {
        pi = points[i], pj = points[j];
        let xi = pi.x, yi = pi.y;
        let xj = pj.x, yj = pj.y;

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
        inside = !inside;
    }

    return inside;
}
