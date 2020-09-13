function initMap() {
  var opt = {
    center: {lat: 59.93885, lng: 30.322838},
    zoom: 17
  }

  var map = new google.maps.Map(document.getElementById("map"), opt);

  var marker = new google.maps.Marker({
      position: {lat: 59.938603, lng: 30.322838},
      map: map,
      icon: '../img/map-marker.svg'
    });
}
