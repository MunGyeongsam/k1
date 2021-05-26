//=============================================================================
// kakao.maps.services.Geocoder
//=============================================================================
const geocoder = new kakao.maps.services.Geocoder();

function searchDetailAddrFromCoords(coords, callback) {
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function addressSearch(address, callback) {
	geocoder.addressSearch(address, callback);
}

function centerOfAddress(coords, callback) {
	searchDetailAddrFromCoords(coords, function (result1, status1) {
		if (status1 === kakao.maps.services.Status.OK) {
			const address = result1[0].address.address_name;

			addressSearch(address, function (result2, status2) {
				if (status2 === kakao.maps.services.Status.OK)
					callback(address, new kakao.maps.LatLng(result2[0].y, result2[0].x));
			});
		}
	});
}

//=============================================================================
// examples
//=============================================================================

//searchDetailAddrFromCoords(latlng, function(result, status) {
//	if (status === kakao.maps.services.Status.OK) {
//		const address = result[0].address.address_name;
//
//		if(markers.has(address)) {
//			remMarker(address);
//		} else {
//			addressSearch(address, function(result2, status2) {
//				if(status2 === kakao.maps.services.Status.OK) {
//					var coords = new kakao.maps.LatLng(result2[0].y, result2[0].x);
//					addMarker(address, coords);
//				}
//			});
//		}
//	}
//});

//centerOfAddress(latlng, function(address, coords) {
//	if (markers.has(address))
//	{
//		remMarker(address);
//	}
//	else
//	{
//		addMarker(address, coords);
//		panTo2(coords);
//	}
//})