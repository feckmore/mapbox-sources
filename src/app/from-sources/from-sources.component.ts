import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { MapMouseEvent } from 'mapbox-gl';

import { LocationService } from '../location.service';

@Component({
  selector: 'app-from-sources',
  templateUrl: './from-sources.component.html',
  styleUrls: ['./from-sources.component.scss']
})
export class FromSourcesComponent implements OnInit {
  points: GeoJSON.FeatureCollection<GeoJSON.Point>;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  cursorStyle: string;

  constructor(
    private locationService: LocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.getGeoJson();
  }

  ngOnInit() {}

  getGeoJson() {
    const result = this.locationService.getGeoJsonLocations();
    result.forEach(locations => {
      console.log('adding locations');
      this.points = locations;
    });
  }

  onClick(evt: MapMouseEvent) {
    console.log('click');
    console.log(evt);
    this.selectedPoint = null;
    this.changeDetectorRef.detectChanges();
    this.selectedPoint = (evt as any).features[0];
    console.log('selected point');
    console.log(this.selectedPoint);
  }
}
