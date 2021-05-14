function initMap() {
  const locations = [
    { lat: 25.018878, lng: 121.534602 }, //台大操場
    { lat: 25.022428, lng: 121.534221 },  //雨備 辛亥橋下
    { lat: 25.051801936560064, lng: 121.55047377575801 } // 小巨蛋
  ]
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.042589, lng: 121.543984 },
    zoom: 12,
  })

  const locationInfo = [`<div id="content">週二週四-台大操場</div>`, `<div id="content">雨備場地-辛亥橋下</div>`, `<div id="content">週一瑜珈-不限男女、週三限女-一起變辣</div>`]

  locations.map((location, i) => {
    let marker = new google.maps.Marker({
      position: location,
      map: map
    })

    let infowindow = new google.maps.InfoWindow({
      content: locationInfo[i]
    })

    marker.addListener('click', () => {
      infowindow.open(map, marker)
    })

  })

}

