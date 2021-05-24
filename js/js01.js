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