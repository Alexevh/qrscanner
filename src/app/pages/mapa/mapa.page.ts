import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

/* esta biblioteca la importe por CDN en el index.html angular no la va a rrconocer ya que no 
esta instalada por NPM asi que la forzamos aca */
declare var mapboxgl: any;

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.page.html",
  styleUrls: ["./mapa.page.scss"]
})
export class MapaPage implements OnInit, AfterViewInit {
  lat: number;
  lng: number;

  /* como a esta pagina le paso por parametro el geolocation necesito poder agarrarlo */
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    /* obtengo el parametro con nombre geo */
    let geo: any = this.route.snapshot.paramMap.get("geo");

    /* lo que me viene comienza con geo:919191, no necesito geo: asi que los corto */
    geo = geo.substr(4);

    /* ahora convierto el geo en un arreglo de 2 posicions */
    geo = geo.split(",");

    /* cargo latitud y longitud */
    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxleGV2aCIsImEiOiJjazFka3ZzZTkwOWMyM2RudHhkdHFrOWlnIn0.5f6MfeJnlUpY9F40JrTvdw";
    const map = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/light-v10",
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: "map",
      antialias: true
    });

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap. pongo ()=> en lugar de function para no romper la referencia a this
    map.on("load", () =>{

      map.resize();

      const  marker = new mapboxgl.Marker({
        draggable: false
        })
        .setLngLat([this.lng, this.lat])
        .addTo(map);

      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }
        },
        labelLayerId
      );
    });
  }
}
