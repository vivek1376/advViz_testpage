
document.addEventListener('DOMContentLoaded', (event) => {

    // Your code goes here
    // This example renders a scatterplot with DeckGL, on top of a basemap rendered with mapboxgl, using a map style JSON from Carto.
    // new deck.DeckGL({
    //     container: document.getElementById('map'),
    //     mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
    //     // mapStyle: 'mapbox://styles/mapbox/dark-v10',
    //     initialViewState: {
    //         longitude: -122.45,
    //         latitude: 37.8,
    //         zoom: 15
    //     },
    //     controller: true,
    //     layers: [
    //         new deck.ScatterplotLayer({
    //             data: [
    //                 { position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }
    //             ],
    //             getFillColor: d => d.color,
    //             getRadius: d => d.radius
    //         })
    //     ]
    // });

    // from observablehq 
    getDeckGLMap = (layers, pitch) => {
        if (pitch === undefined) {
          pitch = 0;
        }

        let deckgl = new deck.DeckGL({
            container: 'map',
            map: mapboxgl,
            mapboxAccessToken: '',
            mapboxApiAccessToken: 'pk.eyJ1Ijoidml2ZWsxMzc2MCIsImEiOiJjbHRhdm8wMmUwOWdpMmhteDJtcWdia2F5In0.LgfuVbASMGCbzZe71DbyfQ',
            // mapStyle: 'mapbox://styles/mapbox/dark-v10',
            mapStyle: `mapbox://styles/mapbox/dark-v11`,
            layers: layers,
            // layers: [
            //     new deck.ScatterplotLayer({
            //         data: [
            //             { position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }
            //         ],
            //         getFillColor: d => d.color,
            //         getRadius: d => d.radius
            //     })
            // ],
            initialViewState: {
                longitude: -82.9835,
                latitude: 42.2767,
                zoom: 11.5,
                pitch: pitch
            },
            controller: true
        });
    }

    getDeckGLMap([]);

    d3.csv("/getcsvdata").then(data => {
        console.log(data.length);
    }).catch(error => {
        console.error("Error loading the CSV file:", error);
    });

    // from https://deck.gl/docs/get-started/using-standalone#using-deckglcore

    // const INITIAL_VIEW_STATE = {
    //     latitude: 37.8,
    //     longitude: -122.45,
    //     zoom: 15
    // };

    // const deckgl = new deck.Deck ({
    //     initialViewState: INITIAL_VIEW_STATE,
    //     controller: true,
    //     layers: [
    //         new deck.ScatterplotLayer({
    //             data: [
    //                 { position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }
    //             ],
    //             getFillColor: d => d.color,
    //             getRadius: d => d.radius
    //         })
    //     ]
    // });
});