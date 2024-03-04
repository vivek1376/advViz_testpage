
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

    let deckgl = undefined;

    // from observablehq 
    getDeckGLMap = (containerid, layers, pitch) => {
        if (pitch === undefined) {
          pitch = 0;
        }

        deckgl = new deck.DeckGL({
            container: containerid,
            map: mapboxgl,
            mapboxAccessToken: '',
            mapboxApiAccessToken: 'pk.eyJ1Ijoidml2ZWsxMzc2MCIsImEiOiJjbHRhdm8wMmUwOWdpMmhteDJtcWdia2F5In0.LgfuVbASMGCbzZe71DbyfQ',
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

    let tripslayer = undefined;

    d3.csv("snowplow-2021-02-15_2021-02-21_filtered.csv").then(data => {
        console.log(data.length);

        console.log("data[0]:\n", data[0]);

        let reduced = data.reduce((accum, d) => {
            if (accum[d.Truck] === undefined) {
                accum[d.Truck] = {
                    Truck: d.Truck,
                    path: [],
                    timestamps: []
                };
            }
            accum[d.Truck].path.push([parseFloat(d.Longitude), parseFloat(d.Latitude)])
            accum[d.Truck].timestamps.push(new Date(d["Date time"]).getTime())
            return accum;
        }, {});

        let colorScale = getColorScale(0, Object.keys(reduced).length);
        console.log("colorScale:", colorScale);

        let trucks = [];
        let num = 0;
        for (let key in reduced) {
            let truck = reduced[key];
            truck.color = colorScale(num);
            trucks.push(truck);
            num++;
        }

        console.log("trucks:", trucks);

        let minTimestamp = d3.min(data, d => new Date(d["Date time"]).getTime());
        let maxTimestamp = d3.max(data, d => new Date(d["Date time"]).getTime());

        console.log("minTimestamp:", minTimestamp);
        console.log("maxTimestamp:", maxTimestamp);

        getDeckGLMap('map1', [
            new deck.ScatterplotLayer({
                id: 'scatterplot-layer',
                data: data,
                pickable: true,
                opacity: 1,
                filled: true,
                radiusScale: 1,
                radiusMinPixels: 1,
                radiusMaxPixels: 1,
                getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
                getRadius: d => 1,
                getFillColor: d => [255, 140, 0]
            }),
            
            // new deck.HeatmapLayer({
            //     id: 'heatmapLayer',
            //     data,
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
            //     aggregation: 'SUM',
            //     radiusPixels: 20,
            //     colorDomain: [100, 500]
            // })

            // new deck.HexagonLayer({
            //     id: 'hexagon-layer',
            //     data,
            //     pickable: true,
            //     extruded: true,
            //     radius: 50,
            //     elevationScale: 4,
            //     colorDomain: [1, 150],
            //     elevationDomain: [1, 150],
            //     elevationRange: [0, 500],
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)]
            // })

            // new deck.PathLayer({
            //     id: 'path-layer',
            //     data: trucks,
            //     pickable: true,
            //     widthScale: 1,
            //     widthMinPixels: 1,
            //     getPath: d => d.path,
            //     getColor: d => d.color,
            //     getWidth: d => 1
            // })

        ], 30);

        getDeckGLMap('map2', [
            // new deck.ScatterplotLayer({
            //     id: 'scatterplot-layer',
            //     data: data,
            //     pickable: true,
            //     opacity: 1,
            //     filled: true,
            //     radiusScale: 1,
            //     radiusMinPixels: 1,
            //     radiusMaxPixels: 1,
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
            //     getRadius: d => 1,
            //     getFillColor: d => [255, 140, 0]
            // }),
            
            // new deck.HeatmapLayer({
            //     id: 'heatmapLayer',
            //     data,
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
            //     aggregation: 'SUM',
            //     radiusPixels: 20,
            //     colorDomain: [100, 500]
            // })

            new deck.HexagonLayer({
                id: 'hexagon-layer',
                data,
                pickable: true,
                extruded: true,
                radius: 50,
                elevationScale: 4,
                colorDomain: [1, 150],
                elevationDomain: [1, 150],
                elevationRange: [0, 500],
                getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)]
            })

            // new deck.PathLayer({
            //     id: 'path-layer',
            //     data: trucks,
            //     pickable: true,
            //     widthScale: 1,
            //     widthMinPixels: 1,
            //     getPath: d => d.path,
            //     getColor: d => d.color,
            //     getWidth: d => 1
            // })

        ], 30);

        getDeckGLMap('map3', [
            // new deck.ScatterplotLayer({
            //     id: 'scatterplot-layer',
            //     data: data,
            //     pickable: true,
            //     opacity: 1,
            //     filled: true,
            //     radiusScale: 1,
            //     radiusMinPixels: 1,
            //     radiusMaxPixels: 1,
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
            //     getRadius: d => 1,
            //     getFillColor: d => [255, 140, 0]
            // }),
            
            // new deck.HeatmapLayer({
            //     id: 'heatmapLayer',
            //     data,
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)],
            //     aggregation: 'SUM',
            //     radiusPixels: 20,
            //     colorDomain: [100, 500]
            // })

            // new deck.HexagonLayer({
            //     id: 'hexagon-layer',
            //     data,
            //     pickable: true,
            //     extruded: true,
            //     radius: 50,
            //     elevationScale: 4,
            //     colorDomain: [1, 150],
            //     elevationDomain: [1, 150],
            //     elevationRange: [0, 500],
            //     getPosition: d => [parseFloat(d.Longitude), parseFloat(d.Latitude)]
            // })

            // new deck.PathLayer({
            //     id: 'path-layer',
            //     data: trucks,
            //     pickable: true,
            //     widthScale: 1,
            //     widthMinPixels: 1,
            //     getPath: d => d.path,
            //     getColor: d => d.color,
            //     getWidth: d => 1
            // })

            tripslayer = new deck.TripsLayer({
                id: 'trips',
                data: trucks,
                getPath: d => d.path,
                getTimestamps: d => d.timestamps.map(p => p - minTimestamp),
                // getTimestamps: function (d) {
                //     let t = d.timestamps.map(p => p - minTimestamp);
                //     console.log("t:", t);
                //     return t;
                // },
                getColor: d => d.color,
                opacity: 0.8,
                widthMinPixels: 3,
                rounded: true,
                trailLength: 1800000,
                currentTime: 0
            })

        ], 30);
        
        let currentTime = 0;
        // document.getElementById('btn').addEventListener('click', (event) => {
        //     event.preventDefault();
        //     console.log("Button clicked");

        //     currentTime += 100000; 

        //     // Update the TripsLayer with the new currentTime
        //     const updatedTripsLayer = tripslayer.clone({ currentTime });
          
        //     // Update the Deck instance with the new layer
        //     deckgl.setProps({ layers: [updatedTripsLayer] });
        // });

        document.getElementById('myRange').oninput = function() {
            currentTime = parseInt(this.value);
            // currentTime = 2000000;
            console.log("slider value:", currentTime, typeof currentTime);

            // Update the TripsLayer with the new currentTime
            const updatedTripsLayer = tripslayer.clone({ currentTime });

            // Update the Deck instance with the new layer
            deckgl.setProps({ layers: [updatedTripsLayer] });
        }

    }).catch(error => {
        console.error("Error loading the CSV file:", error);
    });

    getColorScale = (min, max) => {
        let func = d3
            .scaleSequential()
            .domain([min, max])                     // Domain is 0 to 231 (the number of trucks)
            .interpolator(d3.interpolateRainbow);   // Interpolate on the Rainbow color scale

        return d => {                             // Quick function to convery the hex color to an RGB array
            let col = d3.color(func(d));
            return [col.r, col.g, col.b];
        }
    }
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