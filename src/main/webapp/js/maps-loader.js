
/*Basic function to create a Map- Part-1 */


function createMap(){
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.422, lng: -122.084},
        zoom: 16
      });
    }



function buildUI(){
    loadNavigation();
    createMap();
}
