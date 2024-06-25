{/* // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com */}
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-15.749, 28.536],
    zoom: 7.2
});

map.on('load', () => {
    // Add a GeoJSON source with 3 points.
    map.addSource('points', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            ...allPlaces
        }
    });
    // Add a circle layer
    map.addLayer({
        'id': 'circle',
        'type': 'circle',
        'source': 'points',
        'paint': {
            'circle-color': '#3AA6B9',
            'circle-radius': 9,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Center the map on the coordinates of any clicked circle from the 'circle' layer.
    map.on('click', 'circle', (e) => {
        const coordinates = e.features[0].geometry.coordinates;
        const popUpText = e.features[0].properties.popUpMarkup;

        map.flyTo({
            center: coordinates
        });

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpText)
            .addTo(map);
    });

    // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
    map.on('mouseenter', 'circle', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'circle', () => {
        map.getCanvas().style.cursor = '';
    });
});


map.addControl(new mapboxgl.FullscreenControl());
