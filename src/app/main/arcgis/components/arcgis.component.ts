import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Event,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import WebMap from '@arcgis/core/WebMap';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import SceneLayer from '@arcgis/core/layers/SceneLayer';
import WebScene from '@arcgis/core/WebScene';
import esriConfig from '@arcgis/core/config.js';
import Camera from '@arcgis/core/Camera';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import Renderer from '@arcgis/core/renderers/Renderer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import ObjectSymbol3DLayer from '@arcgis/core/symbols/ObjectSymbol3DLayer';
import PolygonSymbol3D from '@arcgis/core/symbols/PolygonSymbol3D';
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D';
import Weather from '@arcgis/core/widgets/Weather';
import Daylight from '@arcgis/core/widgets/Daylight';
import Expand from '@arcgis/core/widgets/Expand';
import ExtrudeSymbol3DLayer from '@arcgis/core/symbols/ExtrudeSymbol3DLayer';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import WebStyleSymbol from '@arcgis/core/symbols/WebStyleSymbol';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import * as locator from '@arcgis/core/rest/locator';

//import Color from "@arcgis/core/Color";
import * as route from '@arcgis/core/rest/route';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import LineSymbol3D from '@arcgis/core/symbols/LineSymbol3D';
import anime from 'animejs/lib/anime.es.js';

import * as projection from '@arcgis/core/geometry/projection';
import { load, project } from '@arcgis/core/geometry/projection';
import { NgControlStatusGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Search from '@arcgis/core/widgets/Search';

@Component({
  selector: 'app-arcgis',
  templateUrl: './arcgis.component.html',
  styleUrls: ['./arcgis.component.scss'],
})
export class ArcgisComponent {
  basketballCoordinates: any = [];
  boxingCoordinates: any = [];
  golfCoordinates: any = [];
  footballCoordinates: any = [];
  swimmingCoordinates: any = [];
  billiardCoordinates: any = [];
  jetSkiCoordinates: any = [];
  badmintonCoordinates: any = [];
  baseballCoordinates: any = [];
  cyclingCoordinates: any = [];
  tennisCoordinates: any = [];

  private badmintonhtml =
    '<img src="assets/img/gifs/Badminton.gif" width=55px" height="50px">';
  private baseballhtml =
    '<img src="assets/img/gifs/Baseball.gif" width=55px" height="50px">';
  private basketballhtml =
    '<img src="assets/img/gifs/Basketball.gif" width=55px" height="50px">';
  private boxinghtml =
    '<img src="assets/img/gifs/Boxing.gif" width=55px" height="50px">';
  private footballhtml =
    '<img src="assets/img/gifs/Football.gif" width=55px" height="50px">';
  private golfhtml =
    '<img src="assets/img/gifs/Golf-2.gif" width=55px" height="50px">';
  private jetskihtml =
    '<img src="assets/img/gifs/Jetski.gif" width=55px" height="50px">';
  private billiardhtml =
    '<img src="assets/img/gifs/Snooker.gif" width=55px" height="50px" style="vertical-align:middle">';
  private swimminghtml =
    '<img src="assets/img/gifs/Swimming.gif" width=55px" height="50px">';
  private cyclinghtml =
    '<img src="assets/img/gifs/Cycling.gif" width=55px" height="50px">';
  private paddletennishtml =
    '<img src="assets/img/paddletennismarker.png" width=35px" height="40px">';
  private tennishtml =
    '<img src="assets/img/tennismarker.png" width=35px" height="45px">';

  // global map variables
  private map = new Map();
  private view: any = new SceneView({ qualityProfile: 'high' });

  private dubaiSceneLayer = new SceneLayer();
  private newyorkSceneLayer = new SceneLayer();
  private buildingDetailsType1: any = [];
  private buildingDetailsType2: any = [];
  private buildingDetailsType3: any = [];
  private buildingDetailsType4: any = [];
  private planeDetails: any = [];
  private lawnDetails: any = [];
  private buildingColor = 'gold';
  private currentRoute = '';
  private buildingDetailsType5: any = [];
  private route_layer = new GraphicsLayer();
  private markerLayer = new GraphicsLayer();
  private burj: any;
  private buildingsLayer: any = [];
  private dub_renderer: any = new Renderer();
  private hotels_layer = new GraphicsLayer();
  public places: any = [
    'Choose a place type...',
    'Parks and Outdoors',
    'Coffee shop',
    'Gas station',
    'Food',
    'Hotel',
  ];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: LocationService,
    private http: HttpService
  ) {}
  ngOnInit(): void {
    // this.startUp();
    this.initialSetup(); //create map
    this.loadDubaiSceneLayer(); //add dubai layer
    this.loadCoordinates();
    this.addPointsLayer();
    this.addBurj();
    this.loadObjectsOnMap(); // add 3d objects to map
    this.loadGameOnMap();
    this.loadRoute();
    this.loadPlacesDropdown();
    this.view.map.add(this.markerLayer);
    this.view.map.add(this.hotels_layer);
    this.landThePlane();
  }

  ngAfterViewInit(): void {
    this.routeStarter1();
  }

  game: any;
  routeStarter1() {
    this.router.events.subscribe((event: Event) => {
      this.game = this.activeRoute.snapshot.queryParamMap.get('game');
      let lat = this.activeRoute.snapshot.queryParamMap.get('lat');
      let lng = this.activeRoute.snapshot.queryParamMap.get('lng');
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar

        this.currentRoute = event.url;
        console.log(this.currentRoute);
        if (this.map) {
          if (lat && lng) {
            console.log('inside router');
            console.log(lat, lng);
            // this.activateSport(this.currentRoute);
            this.goTomarker(this.game, lat, lng);
          } else {
            this.activateSport(this.game);
          }
        }
      }
    });
  }

  panCamera(lat: any, lng: any) {
    let camera = this.view.camera.clone();
    // camera.position.longitude = lng;
    // camera.position.latitude = lat;
    // camera.position.z = 2000;
    camera.tilt = 0;
    camera.position = {
      latitude: lat,
      longitude: lng,
      z: 2000,
    };
    console.log('panning');
    return camera;
  }

  tiltView(lat: any, lng: any) {
    console.log('first');
    this.view
      .goTo(this.panCamera(lat, lng), {
        speedFactor: 0.5,
        easing: 'linear',
        duration: 8000,
        maxDuration: 9000,
      })
      .then(() => {
        console.log('third');
        this.view
          .goTo(
            {
              tilt: 60,
              heading: (this.view.camera.heading += 60),
            },
            {
              speedFactor: 0.5,
              easing: 'linear',
              duration: 4000,
              maxDuration: 8000,
            }
          )
          .catch((error) => {
            if (error.name != 'AbortError') {
              console.error(error);
            }
          });
      })
      .catch((error) => {
        if (error.name != 'AbortError') {
          console.error(error);
        }
      });
  }

  goTomarker(sport: any, lat: any, lng: any) {
    this.tiltView(lat, lng);

    if (sport === 'basketball') {
      this.RemoveAllMarker();
      let basketballData: any;
      let data = this.basketballCoordinates.filter((x) => x.lat === lat);
      basketballData = data[0];
      this.addBasketballMarkersToMap(lat, lng, 0, basketballData);
    } else if (sport === 'badminton') {
      this.RemoveAllMarker();
      let badmintonData: any;
      let data = this.badmintonCoordinates.filter((x) => x.lat === lat);
      badmintonData = data[0];
      this.addBadmintonMarkersToMap(lat, lng, 0, badmintonData);
    } else if (sport === 'baseball') {
      this.RemoveAllMarker();
      let baseballData: any;
      let data = this.baseballCoordinates.filter((x) => x.lat === lat);
      baseballData = data[0];
      this.addBaseballMarkersToMap(lat, lng, 0, baseballData);
    } else if (sport === 'boxing') {
      this.RemoveAllMarker();
      let boxingData: any;
      let data = this.boxingCoordinates.filter((x) => x.lat === lat);
      boxingData = data[0];
      this.addBoxingMarkersToMap(lat, lng, 0, boxingData);
    } else if (sport === 'football') {
      this.RemoveAllMarker();
      let footballData: any;
      let data = this.footballCoordinates.filter((x) => x.lat === lat);
      footballData = data[0];
      this.addFootballMarkersToMap(lat, lng, 0, footballData);
    } else if (sport === 'golf') {
      this.RemoveAllMarker();
      let golfData: any;
      let data = this.golfCoordinates.filter((x) => x.lat === lat);
      golfData = data[0];
      this.addGolfMarkersToMap(lat, lng, 0, golfData);
    } else if (sport === 'jetski') {
      this.RemoveAllMarker();
      let jetskiData: any;
      let data = this.jetSkiCoordinates.filter((x) => x.lat === lat);
      jetskiData = data[0];
      this.addJetskiMarkersToMap(lat, lng, 0, jetskiData);
    } else if (sport === 'billiard') {
      this.RemoveAllMarker();
      let billiardData: any;
      let data = this.billiardCoordinates.filter((x) => x.lat === lat);
      billiardData = data[0];
      this.addBilliardMarkersToMap(lat, lng, 0, billiardData);
    } else if (sport === 'swimming') {
      this.RemoveAllMarker();
      let swimmingData: any;
      let data = this.swimmingCoordinates.filter((x) => x.lat === lat);
      swimmingData = data[0];
      this.addSwimmingMarkersToMap(lat, lng, 0, swimmingData);
    } else if (sport === 'cycle') {
      this.RemoveAllMarker();
      let cycleData: any;
      let data = this.cyclingCoordinates.filter((x) => x.lat === lat);
      cycleData = data[0];
      this.addCycleMarkersToMap(lat, lng, 0, cycleData);
    } else if (sport === 'tennis') {
      this.RemoveAllMarker();
      let tennisData: any;
      let data = this.tennisCoordinates.filter((x) => x.lat === lat);
      tennisData = data[0];
      this.addTennisMarkersToMap(lat, lng, 0, tennisData);
    } else {
      console.log('no match');
    }
  }

  activateSport(sport: string) {
    // let pieces = route.split('/');
    // let sport = '';
    // try {
    //   sport = pieces[2].split('?')[0];
    // } catch (e) {
    //   sport = pieces[2];
    // }
    if (sport === 'all') {
      // this.loadObjectsOnMap();
      this.loadGameOnMap();
      this.view.camera = new Camera({
        position: {
          x: 55.275349, //Longitude
          y: 25.185865, //Latitude
          z: 2000, //Meters
        },
        // position: { x: -74.0338, y: 40.6913, z: 707 },
        tilt: 45,
      });
    } else if (sport === 'basketball') {
      this.RemoveAllMarker();
      this.LoadBasketballMarkers();
    } else if (sport === 'badminton') {
      this.RemoveAllMarker();
      this.LoadBadmintonMarkers();
    } else if (sport === 'baseball') {
      this.RemoveAllMarker();
      this.LoadBaseballMarkers();
    } else if (sport === 'boxing') {
      this.RemoveAllMarker();
      this.LoadBoxingMarkers();
    } else if (sport === 'football') {
      this.RemoveAllMarker();
      this.LoadFootballMarkers();
    } else if (sport === 'golf') {
      this.RemoveAllMarker();
      this.LoadGolfMarkers();
    } else if (sport === 'jetski') {
      this.RemoveAllMarker();
      this.LoadJetskiMarkers();
    } else if (sport === 'billiard') {
      this.RemoveAllMarker();
      this.LoadBilliardMarkers();
    } else if (sport === 'swimming') {
      this.RemoveAllMarker();
      this.LoadSwimmingMarkers();
    } else if (sport === 'cycle') {
      this.RemoveAllMarker();
      this.LoadCycleMarkers();
    } else if (sport === 'tennis') {
      this.RemoveAllMarker();
      this.LoadTennisMarkers();
    } else {
      console.log('no match');
    }
  }

  RemoveAllMarker() {
    this.addSwimmingMarkersToMap(0, 0, 0, '');
    this.addGolfMarkersToMap(0, 0, 0, '');
    this.addBasketballMarkersToMap(0, 0, 0, '');
    this.addBadmintonMarkersToMap(0, 0, 0, '');
    this.addBoxingMarkersToMap(0, 0, 0, '');
    this.addBaseballMarkersToMap(0, 0, 0, '');
    this.addFootballMarkersToMap(0, 0, 0, '');
    this.addCycleMarkersToMap(0, 0, 0, '');
    this.addJetskiMarkersToMap(0, 0, 0, '');
    this.addBilliardMarkersToMap(0, 0, 0, '');
    this.addTennisMarkersToMap(0, 0, 0, '');
    this.hotels_layer.removeAll();
  }

  GetWeatherDetail() {
    const weatherExpand = new Expand({
      view: this.view,
      content: new Weather({
        view: this.view,
      }),
      group: 'bottom-right',
      expanded: false,
    });

    const daylightExpand = new Expand({
      view: this.view,
      content: new Daylight({
        view: this.view,
      }),
      group: 'bottom-right',
    });

    const searchExpand = new Expand({
      view: this.view,
      content: new Search({
        view: this.view,
      }),
      group: 'bottom-right',
    });

    this.view.ui.add(
      [weatherExpand, daylightExpand, searchExpand],
      'bottom-right'
    );
  }

  loadCoordinates() {
    this.buildingDetailsType1 = this.service.getBuildingDetailsType1();
    this.buildingDetailsType2 = this.service.getBuildingDetailsType2();
    this.buildingDetailsType3 = this.service.getBuildingDetailsType3();
    this.buildingDetailsType4 = this.service.getBuildingDetailsType4();
    this.buildingDetailsType5 = this.service.getBuildingDetailsType5();
    this.golfCoordinates = this.service.getGolfDetails();
    this.basketballCoordinates = this.service.getBasketballDetails();
    this.badmintonCoordinates = this.service.getBadmintonDetails();
    this.boxingCoordinates = this.service.getBoxingDetails();
    this.baseballCoordinates = this.service.getBaseballDetails();
    this.footballCoordinates = this.service.getFootballDetails();
    this.swimmingCoordinates = this.service.getSwimmingDetails();
    this.jetSkiCoordinates = this.service.getJetskiDetails();
    this.cyclingCoordinates = this.service.getCyclingDetails();
    this.billiardCoordinates = this.service.getBilliardDetails();
    this.tennisCoordinates = this.service.getTennisDetails();
    this.planeDetails = this.service.getPlaneDetails();
  }
  addBurj() {
    this.burj = new Graphic({
      // 25.19719404177507, 55.274279701766254

      geometry: new Point({
        x: 55.27433548957757,
        y: 25.197348634357217,
        // y: 25.19819404177507,
        z: 500,
      }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: 270,
            height: 1000,
            depth: 255,
            anchor: 'center',
            resource: { href: 'assets/models/burj_khalifa_dubai.glb' },
            heading: 240,
          },
        ],
      }),
    });
    //graphicsLayer.add(pointGraphic);
    this.view.graphics.add(this.burj);
  }

  loadPlacesDropdown() {
    const select = document.createElement('select');
    select.setAttribute('id', 'places-dropdown');
    select.setAttribute('class', 'esri-widget esri-select');
    select.setAttribute(
      'style',
      'width: 275px; margin-top:-100px; font-family: Avenir Next W00; font-size: 1em'
    );

    this.places.forEach((place) => {
      const option = document.createElement('option');
      option.value = place;
      option.innerHTML = place;
      select.appendChild(option);
    });

    this.view.ui.add(select, 'top-right');

    select.addEventListener('change', () => {
      if (select.value == 'Choose a place type...') {
        this.hotels_layer.removeAll();
      } else {
        this.findPlaces(select.value, this.view.center);
      }
    });
  }

  cofeeMarker() {
    let string =
      '{"name":"Coffee","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":20,"anchor":"bottom","material":{"color":[139,69,19],"transparency":0},"resource":{"href":"https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Coffee.svg"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  parkMarker() {
    let string =
      '{"name":"Park","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":20,"anchor":"bottom","material":{"color":[113,203,110],"transparency":0},"resource":{"href":"https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Park.svg"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  gasStationMarker() {
    let string =
      '{"name":"Fuel","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":20,"anchor":"bottom","material":{"color":[201,49,0],"transparency":0},"resource":{"href":"https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Fuel.svg"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }
  foodMarker() {
    let string =
      '{"name":"Restaurant","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"color":[0,191,255],"transparency":0},"resource":{"href":"https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Restaurant.svg"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  hotelMarker() {
    let string =
      '{"name":"Hotel","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"color":[255, 102, 102],"transparency":0},"resource":{"href":"https://static.arcgis.com/arcgis/styleItems/Icons/web/resource/Hotel.svg"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  public Img: any = '';
  findPlaces(category: any, pt: any) {
    // this.http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=25.197348634357217,55.27433548957757&radius=5000&type=gas_station&key=/`, null).subscribe((res: any) => {
    //   const responseData = res;
    //   debugger;
    //   if (res.status === true) {

    //   } else {

    //   }
    // });

    locator
      .addressToLocations(
        'http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        {
          location: pt,
          categories: [category],
          maxLocations: 50,
          outFields: ['*'],
          address: undefined,
        }
      )
      .then((results) => {
        this.hotels_layer.removeAll();
        results.forEach((result, index) => {
          let folder = '';
          var markers: any = [];
          if (category == 'Parks and Outdoors') {
            markers = this.parkMarker();
            folder = 'parks';
          } else if (category == 'Coffee shop') {
            markers = this.cofeeMarker();
            folder = 'coffee';
          } else if (category == 'Gas station') {
            markers = this.gasStationMarker();
            this.Img = '';
            folder = 'gas';
          } else if (category == 'Food') {
            markers = this.foodMarker();
            folder = 'food';
          } else if (category == 'Hotel') {
            markers = this.hotelMarker();
            folder = 'hotel';
          }
          const verticalOffset = {
            screenLength: 40,
            maxWorldLength: 200,
            minWorldLength: 35,
          };
          const graphic = new Graphic({
            geometry: result.location,
            attributes: result.attributes,
            symbol: new PointSymbol3D({
              symbolLayers: [
                {
                  type: 'icon',
                  size: markers.size,
                  material: markers.material,
                  anchor: markers.anchor,
                  // resource: { href: 'assets/img/gifs/Golf-2.gif' },
                  resource: markers.resource,
                },
              ],
              verticalOffset: verticalOffset,
              callout: {
                type: 'line',
                color: [135, 206, 250],
                size: 0.8,
              },
            }),
            popupTemplate: {
              title: result.attributes.PlaceName,
              content: function () {
                var div = document.createElement('div');
                div.innerHTML = `<div><img src="assets/img/places/${folder}/${
                  index % 4
                }.jpg" alt="" width=300> </div>
                                <div>${result.attributes.Place_addr}</div>`;
                return div;
              },
            },
          });
          this.hotels_layer.add(graphic);
        });
      });
  }

  loadRoute() {
    let route_layer = new GraphicsLayer({
      graphics: [],
    });
    this.route_layer = route_layer;
    this.view.map.add(this.route_layer);

    this.view.on('click', (event) => {
      if (this.route_layer.graphics.length === 0) {
        this.addGraphic(
          'origin',
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );
      } else if (this.route_layer.graphics.length === 1) {
        this.addGraphic(
          'destination',
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );
        this.getRoute();
      } else {
        this.route_layer.removeAll();
        this.addGraphic(
          'origin',
          event.mapPoint.longitude,
          event.mapPoint.latitude
        );
      }
    });
  }

  addGraphic(type: any, lng: any, lat: any) {
    const graphic = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: 0 }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: 50,
            height: 80,
            depth: 10,
            anchor: 'bottom',
            resource: { href: 'assets/models/map_pointer.glb' },
            // material: { color: this.buildingColor },
            heading: 50,
          },
        ],
      }),
    });
    this.route_layer.add(graphic);
  }

  getRoute() {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: this.route_layer.graphics.toArray(),
      }),
    });

    route
      .solve(
        'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
        routeParams
      )
      .then((data) => {
        data.routeResults.forEach((result) => {
          result.route.symbol = new LineSymbol3D({
            symbolLayers: [
              {
                type: 'path',
                material: { color: 'red' },
                width: 5,
                height: 30,
                castShadows: true,
              },
            ],
          });
          this.route_layer.add(result.route);
        });
      });
  }

  initialSetup(): void {
    console.log(process.env['API_KEY']);
    esriConfig.apiKey = '';
    // create a map object

    let basemap = '';
    if (localStorage.getItem('mode') === 'dark') {
      basemap = 'arcgis-navigation-night';
    } else {
      basemap = 'osm-standard';
    }
    // create a map object
    const map = new Map({
      //basemap: 'arcgis-navigation-night',
      basemap: basemap,
      ground: 'world-elevation',
    });

    // const map = new Map({
    //   //basemap: 'arcgis-navigation-night',
    //   basemap: 'osm-standard',
    //   ground: 'world-elevation',
    // });

    //this.map.ground.surfaceColor = new Color('#0000');//ground.surfaceColor = \
    //map.ground.opacity = 0.4;

    //create a local camera object
    const camera = new Camera({
      position: {
        x: 55.275349, //Longitude
        y: 25.185865, //Latitude
        z: 2000, //Meters
      },
      // position: { x: -74.0338, y: 40.6913, z: 707 },
      tilt: 45,
    });

    //create local view object
    const view = new SceneView({
      container: 'viewDiv',
      map: map,
      //map: webscene,
      qualityProfile: 'high',
      environment: {
        weather: {
          type: 'cloudy', // autocasts as new CloudyWeather({cloudCover: 0.3 })
          cloudCover: 0.3,
        },
        atmosphere: {
          quality: 'high',
        },
        lighting: {
          waterReflectionEnabled: true,
          ambientOcclusionEnabled: true,
        },
      },
      camera: camera,
      zoom: 16,
      // global for weather effects
      viewingMode: 'global',
      popup: {
        defaultPopupTemplateEnabled: true,
      },
    });

    //assiignn local map object to global map object
    this.map = map;

    // assign a local view to global view
    this.view = view;

    this.GetWeatherDetail();
  }

  loadDubaiSceneLayer() {
    const dubaiSceneLayer: any = new SceneLayer({
      portalItem: {
        id: '962efd58b194443ea855ed1ca69fdaf5',
      },
      popupEnabled: false,
    });

    const dub_symbol = {
      type: 'mesh-3d',
      symbolLayers: [
        {
          type: 'fill',
          //    material: {
          // color: "#ffffff",
          //     colorMixMode: "replace"
          //  },
          edges: {
            type: 'solid',
            color: [230, 115, 0, 0.1],
            size: 1,
          },
        },
      ],
    };

    this.dub_renderer = {
      type: 'simple', // autocasts as new SimpleRenderer()
      symbol: dub_symbol,
    };

    this.dubaiSceneLayer = dubaiSceneLayer;
    this.dubaiSceneLayer.renderer = this.dub_renderer;
    this.map.add(this.dubaiSceneLayer);
  }

  loadNewYorkSceneLayer() {
    const newyorkSceneLayer: any = new SceneLayer({
      portalItem: {
        id: '2e0761b9a4274b8db52c4bf34356911e',
      },
      popupEnabled: false,
    });
    this.newyorkSceneLayer = newyorkSceneLayer;
    this.map.add(this.newyorkSceneLayer);
  }

  addPointsLayer() {
    const pointsLayer = new FeatureLayer({
      url: 'http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/LyonPointsOfInterest/FeatureServer',
      title: 'Touristic attractions',
      elevationInfo: {
        // elevation mode that will place points on top of the buildings or other SceneLayer 3D objects
        mode: 'relative-to-scene',
      },
      renderer: new SimpleRenderer(),
      outFields: ['*'],
      // feature reduction is set to selection because our scene contains too many points and they overlap
      featureReduction: {
        type: 'selection',
      },
    });

    this.map.add(pointsLayer);
  }
  loadObjectsOnMap() {
    console.log('loadmap');
    this.view.when(() => {
      console.log('Map is loaded');

      for (let data of this.buildingDetailsType1) {
        this.addCustomBuildingModelsToMap(
          data.lat,
          data.lng,
          data.base,
          data.height,
          data.width,
          data.depth,
          data.heading,
          5
        );
      }

      for (let data of this.buildingDetailsType2) {
        this.addCustomBuildingModelsToMap(
          data.lat,
          data.lng,
          data.base,
          data.height,
          data.width,
          data.depth,
          data.heading,
          1
        );
      }
      for (let data of this.buildingDetailsType3) {
        this.addCustomBuildingModelsToMap(
          data.lat,
          data.lng,
          data.base,
          data.height,
          data.width,
          data.depth,
          data.heading,
          2
        );
      }
      for (let data of this.buildingDetailsType4) {
        this.addCustomBuildingModelsToMap(
          data.lat,
          data.lng,
          data.base,
          data.height,
          data.width,
          data.depth,
          data.heading,
          3
        );
      }
      for (let data of this.buildingDetailsType5) {
        this.addCustomBuildingModelsToMap(
          data.lat,
          data.lng,
          data.base,
          data.height,
          data.width,
          data.depth,
          data.heading,
          4
        );
      }
    });
  }

  loadGameOnMap() {
    this.LoadGolfMarkers();
    this.LoadSwimmingMarkers();
    this.LoadBasketballMarkers();
    this.LoadBadmintonMarkers();
    this.LoadBoxingMarkers();
    this.LoadBaseballMarkers();
    this.LoadFootballMarkers();
    this.LoadCycleMarkers();
    this.LoadJetskiMarkers();
    this.LoadBilliardMarkers();
    this.LoadTennisMarkers();
  }

  LoadGolfMarkers() {
    for (let marker of this.golfCoordinates) {
      this.addGolfMarkersToMap(marker.lat, marker.lng, 0, marker);
    }
  }

  LoadSwimmingMarkers() {
    for (let swimmingMarker of this.swimmingCoordinates) {
      this.addSwimmingMarkersToMap(
        swimmingMarker.lat,
        swimmingMarker.lng,
        0,
        swimmingMarker
      );
    }
  }

  LoadBasketballMarkers() {
    for (let basketballMarker of this.basketballCoordinates) {
      this.addBasketballMarkersToMap(
        basketballMarker.lat,
        basketballMarker.lng,
        0,
        basketballMarker
      );
    }
  }

  LoadBadmintonMarkers() {
    for (let badmintonMarker of this.badmintonCoordinates) {
      this.addBadmintonMarkersToMap(
        badmintonMarker.lat,
        badmintonMarker.lng,
        0,
        badmintonMarker
      );
    }
  }

  LoadBoxingMarkers() {
    for (let boxingMarker of this.boxingCoordinates) {
      this.addBoxingMarkersToMap(
        boxingMarker.lat,
        boxingMarker.lng,
        0,
        boxingMarker
      );
    }
  }

  LoadBaseballMarkers() {
    for (let baseballMarker of this.baseballCoordinates) {
      this.addBaseballMarkersToMap(
        baseballMarker.lat,
        baseballMarker.lng,
        0,
        baseballMarker
      );
    }
  }

  LoadFootballMarkers() {
    for (let footballMarker of this.footballCoordinates) {
      this.addFootballMarkersToMap(
        footballMarker.lat,
        footballMarker.lng,
        0,
        footballMarker
      );
    }
  }

  LoadCycleMarkers() {
    for (let cycleMarker of this.cyclingCoordinates) {
      this.addCycleMarkersToMap(
        cycleMarker.lat,
        cycleMarker.lng,
        0,
        cycleMarker
      );
    }
  }

  LoadJetskiMarkers() {
    for (let jetskiMarker of this.jetSkiCoordinates) {
      this.addJetskiMarkersToMap(
        jetskiMarker.lat,
        jetskiMarker.lng,
        0,
        jetskiMarker
      );
    }
  }

  LoadBilliardMarkers() {
    for (let billiardMarker of this.billiardCoordinates) {
      this.addBilliardMarkersToMap(
        billiardMarker.lat,
        billiardMarker.lng,
        0,
        billiardMarker
      );
    }
  }

  LoadTennisMarkers() {
    for (let tennisMarker of this.tennisCoordinates) {
      this.addTennisMarkersToMap(
        tennisMarker.lat,
        tennisMarker.lng,
        0,
        tennisMarker
      );
    }
  }

  getPlaneModelDetails() {
    let string =
      '{"name":"Airplane_Large_Passenger","type":"PointSymbol3D","symbolLayers":[{"type":"Object","width":21.539997100830078,"height":7.0347914695739746,"depth":25.677627563476563,"anchor":"origin","resource":{"href":"https://static.arcgis.com/arcgis/styleItems/RealisticTransportation/web/resource/Airplane_Large_Passenger.json"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }
  getGolfMarkerDetails() {
    let string =
      '{"name":"Golf Course","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Golf-2.png"}}]}';

    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getSwimmingMarkerDetails() {
    let string =
      '{"name":"Beach","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Swimming.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getBasketballMarkerDetails() {
    let string =
      '{"name":"Airport","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Basketball.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getBadmintonMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Badminton.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getBoxingMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Boxing.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getBaseballMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Baseball.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getFootballMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Football.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getCycleMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Cycling.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getJetskiMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Jetski.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getBilliardMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":30,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/gifs/Snooker.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  getTennisMarkerDetails() {
    let string =
      '{"name":"Vineyard","type":"PointSymbol3D","symbolLayers":[{"type":"Icon","size":20,"anchor":"bottom","material":{"transparency":0},"resource":{"href":"assets/img/tennis.png"}}]}';
    let data = JSON.parse(string);
    return data.symbolLayers[0];
  }

  addTennisMarkersToMap(lat: any, lng: any, base: any, TenisData: any) {
    let tennisData = this.getTennisMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    let tennisMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: tennisData.size,
            material: tennisData.material,
            anchor: tennisData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: tennisData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: TenisData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = TenisData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.view.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(tennisMarker);
    }
  }

  addBilliardMarkersToMap(lat: any, lng: any, base: any, billiData: any) {
    let billiardData = this.getBilliardMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const billiardMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: billiardData.size,
            material: billiardData.material,
            anchor: billiardData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: billiardData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: billiData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = billiData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(billiardMarker);
    }
  }

  addJetskiMarkersToMap(lat: any, lng: any, base: any, jetData: any) {
    let jetskiData = this.getJetskiMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const jetskiMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: jetskiData.size,
            material: jetskiData.material,
            anchor: jetskiData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: jetskiData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: jetData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = jetData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(jetskiMarker);
    }
  }

  addCycleMarkersToMap(lat: any, lng: any, base: any, Cyclingdata: any) {
    let cycleData = this.getCycleMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const cycleMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: cycleData.size,
            material: cycleData.material,
            anchor: cycleData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: cycleData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: Cyclingdata.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = Cyclingdata.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(cycleMarker);
    }
  }

  addFootballMarkersToMap(lat: any, lng: any, base: any, FootData: any) {
    let footballData = this.getFootballMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const footballMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: footballData.size,
            material: footballData.material,
            anchor: footballData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: footballData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: FootData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = FootData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(footballMarker);
    }
  }

  addBaseballMarkersToMap(lat: any, lng: any, base: any, BaseData: any) {
    let baseballData = this.getBaseballMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const baseballMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: baseballData.size,
            material: baseballData.material,
            anchor: baseballData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: baseballData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: BaseData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = BaseData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(baseballMarker);
    }
  }

  addBoxingMarkersToMap(lat: any, lng: any, base: any, BoxData) {
    let boxingData = this.getBoxingMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const boxingMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: boxingData.size,
            material: boxingData.material,
            anchor: boxingData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: boxingData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: BoxData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = BoxData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(boxingMarker);
    }
  }

  addBasketballMarkersToMap(lat: any, lng: any, base: any, Data: any) {
    let basketballData = this.getBasketballMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 500,
      minWorldLength: 50,
    };
    const basketballMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: basketballData.size,
            material: basketballData.material,
            anchor: basketballData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: basketballData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: Data.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = Data.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(basketballMarker);
    }
  }

  addBadmintonMarkersToMap(lat: any, lng: any, base: any, Data) {
    let badmintonData = this.getBadmintonMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const badmintonMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: badmintonData.size,
            material: badmintonData.material,
            anchor: badmintonData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: badmintonData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: Data.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = Data.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(badmintonMarker);
    }
  }

  addSwimmingMarkersToMap(lat: any, lng: any, base: any, swimData: any) {
    let SwimmingData = this.getSwimmingMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const SwimmingMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: SwimmingData.size,
            material: SwimmingData.material,
            anchor: SwimmingData.anchor,
            // resource: { href: 'assets/img/gifs/Swimming.gif' },
            resource: SwimmingData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: swimData.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = swimData.html;
          return div;
        },
      },
    });
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(SwimmingMarker);
    }
  }

  addGolfMarkersToMap(lat: any, lng: any, base: any, Golfdata: any) {
    const GolfData = this.getGolfMarkerDetails();
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35,
    };
    const GolfMarker = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            size: GolfData.size,
            material: GolfData.material,
            anchor: GolfData.anchor,
            // resource: { href: 'assets/img/gifs/Golf-2.gif' },
            resource: GolfData.resource,
          },
        ],
        verticalOffset: verticalOffset,
        callout: {
          type: 'line',
          color: [135, 206, 250],
          size: 0.8,
        },
      }),
      popupTemplate: {
        title: Golfdata.name,
        content: function () {
          var div = document.createElement('div');
          div.innerHTML = Golfdata.html;
          return div;
        },
      },
    });
    //graphicsLayer.add(pointGraphic);
    // this.view.graphics.add(GolfMarker);
    if (lat === 0) {
      this.markerLayer.graphics.removeAll();
      // this.addBurj();
      // this.loadObjectsOnMap();
    } else {
      this.markerLayer.graphics.add(GolfMarker);
    }
  }

  addPlanesToMap(lat: any, lng: any, base: any) {
    const planeData = this.getPlaneModelDetails();

    const planeModel = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: planeData.width,
            height: planeData.height,
            depth: planeData.depth,
            anchor: planeData.anchor,
            resource: planeData.resource,
          },
        ],
      }),
    });
    //graphicsLayer.add(pointGraphic);
    this.view.graphics.add(planeModel);
  }

  addType1BuildingToMap(
    lat: any,
    lng: any,
    base: any,
    height: any,
    width: any,
    depth: any
  ) {
    const pointGraphic = new Graphic({
      geometry: new Point({ x: lng, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height,
            depth: depth,
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    //graphicsLayer.add(pointGraphic);
    this.view.graphics.add(pointGraphic);
  }
  addType2BuildingToMap(
    lat: any,
    lng: any,
    base: any,
    height: any,
    width: any,
    depth: any
  ) {
    let point = new Point({ x: lng, y: lat, z: base });
    const outer = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const middle = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width - 15,
            height: height + 30,
            depth: depth - 15,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const inner = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width - 25,
            height: height + 60,
            depth: depth - 25,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    this.view.graphics.add(outer);
    this.view.graphics.add(middle);
    this.view.graphics.add(inner);
  }

  addType3BuildingToMap(
    lat: any,
    lng: any,
    base: any,
    height: any,
    width: any,
    depth: any
  ) {
    let point = new Point({ x: lng, y: lat, z: base });
    const outer = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width * 3,
            height: height,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cylinder' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const middle = new Graphic({
      geometry: new Point({ x: lng + 0.0001, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width * 2,
            height: height + 30,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cylinder' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const inner = new Graphic({
      geometry: new Point({ x: lng, y: lat + 0.0001, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height + 45,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cylinder' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    this.view.graphics.add(outer);
    this.view.graphics.add(middle);
    this.view.graphics.add(inner);
  }
  addType4BuildingToMap(
    lat: any,
    lng: any,
    base: any,
    height: any,
    width: any,
    depth: any
  ) {
    let point = new Point({ x: lng, y: lat, z: base });
    const middle = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height,
            depth: depth * 2,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const left = new Graphic({
      geometry: new Point({ x: lng + 0.0002, y: lat, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height - 50,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    const right = new Graphic({
      geometry: new Point({ x: lng - 0.0002, y: lat + 0.0002, z: base }),
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height + 50,
            depth: depth,
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            //  resource: { href: 'assets/models/scene.glb' },
            resource: { primitive: 'cube' },
            material: { color: this.buildingColor },
          },
        ],
      }),
    });
    this.view.graphics.add(left);
    this.view.graphics.add(middle);
    this.view.graphics.add(right);
  }
  startUp() {
    esriConfig.apiKey = '';

    // const buildings3DObjects = new SceneLayer({
    //   url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/SF_BLDG_WSL1/SceneServer',
    //   renderer: new Renderer({
    //     type: 'simple',
    //     symbol: {
    //       type: 'mesh-3d',
    //       symbolLayers: [
    //         {
    //           type: 'fill',
    //           material: {
    //             color: [255, 237, 204],
    //             colorMixMode: 'replace',
    //           },
    //           edges: {
    //             type: 'solid',
    //             color: [133, 108, 62, 0.5],
    //             size: 1,
    //           },
    //         },
    //       ],
    //     },
    //   }),
    // });

    // const sceneView = new SceneView({
    //   map: map,
    //   camera: {
    //     position: [-41.18215285, -86.13467977, 9321113.29449],
    //     heading: 359.73,
    //     tilt: 68.57,
    //   },
    //   viewingMode: 'local',

    //   container: 'viewDiv',
    //   qualityProfile: 'high',
    // });

    // const view = new SceneView({
    //   map: map,
    //   // map: webscene,
    //   viewingMode: 'local',
    //   camera: new Camera({
    //     position: {
    //       x: -118.808, //Longitude
    //       y: 33.961, //Latitude
    //       z: 2000, //Meters
    //     },
    //     tilt: 75,
    //   }),
    //   container: 'viewDiv',
    //   center: [55.052, 25.244],
    //   zoom: 12,
    // });
    // const webscene = new WebScene({
    //   portalItem: {
    //     id: '962efd58b194443ea855ed1ca69fdaf5',
    //   },
    // });

    const map = new Map({
      //basemap: 'streets-vector',
      basemap: 'arcgis-navigation-night',
      ground: 'world-elevation',
    });
    const view = new SceneView({
      container: 'viewDiv',
      map: map,
      //map: webscene,
      qualityProfile: 'high',

      environment: {
        weather: {
          type: 'cloudy', // autocasts as new CloudyWeather({ cloudCover: 0.3 })
          cloudCover: 0.3,
        },
        atmosphere: {
          quality: 'high',
        },
        lighting: {
          waterReflectionEnabled: true,
          ambientOcclusionEnabled: true,
        },
      },

      // center: [55.052456, 25.244258],
      camera: new Camera({
        position: {
          x: 55.274349, //Longitude
          y: 25.196865, //Latitude
          z: 2000, //Meters
        },
        // position: { x: -74.033885, y: 40.6913, z: 707 },
        tilt: 45,
      }),
      zoom: 16,
      viewingMode: 'local',
    });

    const graphicsLayer = new GraphicsLayer({
      elevationInfo: { mode: 'on-the-ground' },
    });
    view.map.add(graphicsLayer);

    const sceneLayer: any = new SceneLayer({
      portalItem: {
        //san fransciec
        // // id: '2e0761b9a4274b8db52c4bf34356911e',
        //dubai
        id: '962efd58b194443ea855ed1ca69fdaf5',
      },
      popupEnabled: false,
    });
    map.add(sceneLayer);
    const solidEdges = {
      type: 'solid',
      color: [0, 0, 0, 0.2],
      size: 1,
    };

    const sceneLayer2: any = new SceneLayer({
      portalItem: {
        //san fransciec
        id: '962efd58b194443ea855ed1ca69fdaf5',
      },
      popupEnabled: false,
    });

    // Create MeshSymbol3D for symbolizing SceneLayer
    const symbol2 = {
      type: 'mesh-3d', // autocasts as new MeshSymbol3D()
      symbolLayers: [
        {
          type: 'fill', // autocasts as new FillSymbol3DLayer()
          // If the value of material is not assigned, the default color will be grey
          //material: {
          //  color: [127, 91, 16],
          //},
          material: {
            color: [222, 171, 2],
            // colorMixMode: 'tint'
          },
          edges: solidEdges,
        },
      ],
    };
    // Add the renderer to sceneLayer
    let newRenderer2 = {
      type: 'simple',
      symbol: symbol2,
    };

    sceneLayer2.renderer = newRenderer2;
    // map.add(sceneLayer2);

    // sceneLayer.renderer = new SimpleRenderer();

    // Create MeshSymbol3D for symbolizing SceneLayer
    const symbol = {
      type: 'mesh-3d', // autocasts as new MeshSymbol3D()
      symbolLayers: [
        {
          type: 'fill', // autocasts as new FillSymbol3DLayer()
          // If the value of material is not assigned, the default color will be grey
          //material: {
          //  color: [127, 91, 16],
          //},
          material: {
            color: [242, 255, 255],
            // colorMixMode: 'tint'
          },
          edges: solidEdges,
        },
      ],
    };
    // Add the renderer to sceneLayer
    let newRenderer = {
      type: 'simple',
      symbol: symbol,
    };
    sceneLayer.renderer = newRenderer;

    view.when(() => {
      console.log('Map is loaded');
      const sketchVM = new SketchViewModel({
        layer: graphicsLayer,
        view: view,
      });

      const webStyleSymbol: any = new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: 21.539997100830078,
            height: 7.0347914695739746,
            depth: 22.367184638977051,
            anchor: 'origin',
            resource: {
              href: 'https://static.arcgis.com/arcgis/styleItems/RealisticTransportation/web/resource/Airplane_Large_Passenger.json',
            },
          },
        ],
      });

      const building3 = new PolygonSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: 100, // diameter of the object from east to west in meters
            height: 850, // height of object in meters
            depth: 100,
            material: {
              color: '#FFFFFF',
            },
            edges: {
              type: 'solid',
              color: [100, 100, 100],
            },
            size: 10,
          },
        ] as any,
      });

      // code to add a new new building
      const building1: any = new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object', // autocasts as new ObjectSymbol3DLayer()
            width: 100, // diameter of the object from east to west in meters
            height: 850, // height of object in meters
            depth: 50, // diameter of the object from north to south in meters
            // resource: { href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb' },
            resource: { href: 'assets/models/scene.glb' },
            //resource: { primitive: 'cylinder' },
            material: { color: 'gold' },
          },
        ],
      });

      const location = new Point({
        x: 55.2683561,
        y: 25.1971477,
        z: 5,
      });

      const pointGraphic = new Graphic({
        geometry: location,
        symbol: webStyleSymbol,
      });

      const location3 = new Point({
        x: 55.2941723,
        y: 26.1971553,
        z: 100,
      });

      const pointGraphic3 = new Graphic({
        geometry: location,
        symbol: building3,
      });
      //graphicsLayer.add(pointGraphic);
      view.graphics.add(pointGraphic);
      view.graphics.add(pointGraphic3);

      const ps3d = new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            resource: {
              href: 'https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/live/tent.glb',
            },
            width: 300, // diameter of the object from east to west in meters
            height: 900, // height of object in meters
            depth: 50,
          },
        ],
      });
      // let symbol = new ObjectSymbol3DLayer(resource:{
      //   href:"dfs"
      // });
      // sketchVM.pointSymbol = ps3d;
      // sketchVM.create('point');
      // sketchVM.on('create', (event) => {
      //   if (event.state === 'complete') {
      //     sketchVM.update(event.graphic);
      //   }
      // });

      // const pointsLayer: any = new FeatureLayer({
      //   elevationInfo: {
      //     // this elevation mode will place points on top of buildings or other SceneLayer 3D objects
      //     mode: 'relative-to-scene',
      //   },
      // });
      const polygon: any = {
        type: 'polygon', // autocasts as new Polygon()
        rings: [
          [55.271751, 25.198344, 0],
          [55.27605, 25.19948, 0],
          [55.27649, 25.19681, 0],
          [55.27345, 25.195356, 0],
        ],
      };
      const fillSymbol = {
        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
        color: [227, 139, 79, 0.8],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 0,
        },
      };
      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol,
      });

      graphicsLayer.add(polygonGraphic);
      const overlayColor = '#ff0000';
      const rendererObj: any = {
        type: 'simple',
        symbol: {
          type: 'polygon-3d',
          symbolLayers: [
            {
              type: 'fill',
              material: { color: overlayColor },
              outline: { color: overlayColor },
              pattern: {
                type: 'style',
                style: 'cross',
              },
            },
          ],
        },
      };
      // const overlay = new FeatureLayer({
      //   // url: "https://services8.arcgis.com/cbDaIA5xFnHBUlC1/arcgis/rest/services/SouthBostonDotAve_Scenario2ProposedZoneChange_1587127097870/FeatureServer/4",
      //   renderer: rendererObj,
      //   title: 'Urban Renewal Area Overlay',
      // });
      // let point: any = { x: -74.033885, y: 40.6913, z: 10 };
      // let pointSymbol: any = {
      //   type: 'simple-marker',
      //   color: [226, 119, 40], // RGB color values as an array
      //   width: 4,
      // };
      // let pointAtt: any = {
      //   Name: 'Keystone', // The name of the pipeline
      //   Value: 'Keith',
      // };
      // let polylineGraphic = new Graphic({
      //   geometry: point,
      //   symbol: pointSymbol,
      //   attributes: pointAtt,
      // });

      // view.graphics.add(polylineGraphic);

      // London
      const point = new Point({
        // type: "point", // autocasts as new Point()
        x: -74.033885,
        y: 40.6913,
        z: 2,
      });

      const markerSymbol = {
        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2,
        },
      };

      const pointGraphic4 = new Graphic({
        geometry: point,
        symbol: markerSymbol,
      });

      // graphicsLayer.add(pointGraphic);
      view.graphics.add(pointGraphic);
    });
  }

  addCustomBuildingModelsToMap(
    lat: any,
    lng: any,
    base: any,
    height: any,
    width: any,
    depth: any,
    heading: any,
    building: number
  ) {
    let point = new Point({ x: lng, y: lat, z: base });
    let resource = {};
    let building1 = { href: 'assets/models/Building_1_Red.glb' };
    let building2 = { href: 'assets/models/Building_2_Gold.glb' };
    let building3 = { href: 'assets/models/Building_1_Green.glb' };
    let building4 = { href: 'assets/models/Building_3_Gold.glb' };
    let building5 = { href: 'assets/models/Building_4_Red.glb' };
    if (building == 1) {
      resource = building1;
    } else if (building == 2) {
      resource = building2;
    } else if (building == 3) {
      resource = building3;
    } else if (building == 4) {
      resource = building4;
    } else if (building == 5) {
      resource = building5;
    }
    const middle = new Graphic({
      geometry: point,
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'object',
            width: width,
            height: height,
            depth: depth,
            resource: resource,
            // material: { color: this.buildingColor },
            heading: heading,
          },
        ],
      }),
    });
    this.view.graphics.add(middle);
    //this.buildingsLayer.add(middle);
  }

  landThePlane() {
    // Flight path
    let pointA = { longitude: 55.347600511426386, latitude: 25.26178073853431 }; //25.26178073853431, 55.347600511426386
    let pointB = { longitude: 55.36764197650612, latitude: 25.250913105474755 }; //25.250913105474755, 55.36764197650612
    let pointC = { longitude: 55.38952880092984, latitude: 25.238841130493785 }; //25.238841130493785, 55.38952880092984

    let scale = 1.5;

    // let scene = new WebScene({
    //   portalItem: {
    //     id: "85a1d98e43f34ba5bcf8d9aa4d3a44be"
    //   }
    // });

    // let view = new SceneView({
    //   // qualityProfile: "high",
    //   map: scene,
    //   container: "viewDiv",
    //   camera: {
    //     position: {
    //       spatialReference: { latestWkid: 3857, wkid: 102100 },
    //       x: 1477298.9087823536,
    //       y: 6901582.610172488,
    //       z: 118.85361315403134
    //     },
    //     heading: 110.19422534050881,
    //     tilt: 82.04763573016989
    //   }
    // });
    // this.view.ui.add(["toggle-play", "toggle-pause"], "bottom-left");

    let graphicsLayer = new GraphicsLayer({
      elevationInfo: {
        mode: 'relative-to-ground',
      },
    });

    let plane = new Graphic({
      geometry: new Point({ ...pointA, z: 100 }),
    });

    (async () => {
      var webStyleSymbol = new WebStyleSymbol({
        name: 'Airplane_Large_Passenger_With_Wheels',
        styleName: 'EsriRealisticTransportationStyle',
      });

      let symbol: any = await webStyleSymbol.fetchSymbol();
      console.log('printingsymbol', symbol);
      symbol.symbolLayers.items[0].heading = 125;
      symbol.symbolLayers.items[0].height *= scale;
      symbol.symbolLayers.items[0].depth *= scale;
      symbol.symbolLayers.items[0].width *= scale;
      plane.symbol = symbol;

      graphicsLayer.add(plane);
    })();

    (async () => {
      await this.view.when();
      let empty: any = [];
      this.view.map.basemap.referenceLayers = empty;
      this.view.map.add(graphicsLayer);
      this.view.environment.atmosphere.quality = 'high';
    })();

    let point = plane.geometry.clone();

    let animation = anime
      .timeline({
        autoplay: false,
        targets: point,
        loop: true,
        duration: 5000,
        update: function () {
          plane.geometry = point.clone();
        },
      })
      .add({
        ...pointB,
        easing: 'linear',
      })
      .add(
        {
          z: 0,
          easing: 'easeOutSine',
        },
        0
      )
      .add({
        ...pointC,
        easing: 'easeOutSine',
      });

    // document.querySelector("#toggle-play").onclick = () => {
    //   document.querySelector("#toggle-play").style.display = "none";
    //   document.querySelector("#toggle-pause").style.display = "";
    animation.play();
    // };
    // document.querySelector("#toggle-pause").onclick = () => {
    //   document.querySelector("#toggle-pause").style.display = "none";
    //   document.querySelector("#toggle-play").style.display = "";
    //   animation.pause();
    // };
  }
}
