import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { Map, MapMouseEvent } from 'mapbox-gl';

import { LocationService, MapLocation, Feature } from '../location.service';

@Component({
  selector: 'app-from-sources',
  templateUrl: './from-sources.component.html',
  styleUrls: ['./from-sources.component.scss']
})
export class FromSourcesComponent implements OnInit {
  locations: MapLocation[];
  points: GeoJSON.FeatureCollection<GeoJSON.Point>;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  cursorStyle: string;
  map: Map;

  constructor(
    private locationService: LocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.getGeoJson();
  }

  ngOnInit() {}

  mapLoaded(map: Map) {
    this.map = map;
    this.map.loadImage('/assets/map-marker.png', (e, image) => {
      this.map.addImage('icon-custom', image);
    });

    this.getGeoJson();
  }

  getGeoJson() {
    const result = this.locationService.getLocations();
    result.forEach(locations => {
      console.log('adding locations');
      this.locations = locations;
      this.points = this.locationService.toFeatureCollection(locations);
    });
  }

  pointClick(evt: MapMouseEvent) {
    console.log('click');
    console.log(evt);
    this.selectedPoint = null;
    this.changeDetectorRef.detectChanges();
    this.selectedPoint = (evt as any).features[0] as Feature;
    console.log('selected point');
    console.log(this.selectedPoint);
  }

  cardClick(location: MapLocation) {
    console.log('card click - ' + location.id);
    this.selectLocation(location);
  }

  selectLocation(location: MapLocation) {
    console.log(location);
    const feature = this.locationService.toFeature(location);
    console.log(feature);
    if (
      !this.selectedPoint ||
      this.selectedPoint.properties.id !== location.id
    ) {
      console.log('new point selected');
      this.selectedPoint = this.locationService.toFeature(location);
      console.log('selected point');
      console.log(this.selectedPoint);
    }
  }
}
