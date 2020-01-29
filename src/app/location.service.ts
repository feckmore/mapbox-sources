import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Organization {
  organization: string;
  website: string;
  email: string;
  phone: string;
  classification: string;
  specialties: string[];
}

interface Contact {
  prefix: string;
  firstname: string;
  lastname: string;
  suffix: string;
  fullname: string;
}

interface Address {
  address1: string;
  address2: string;
  locality: string;
  region: string;
  postalcode: string;
  country: string;
  line1: string;
  line2: string;
}

export interface MapLocation extends Organization, Contact, Address {
  id: string;
  coordinates: [number, number];
  distance: number;
  units: string;
  selected: boolean;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface Feature {
  type: 'Feature';
  properties: Properties;
  geometry: Geometry;
}

export interface Properties {
  [key: string]: string;
}

export interface Geometry {
  type: 'Point';
  coordinates: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<MapLocation[]> {
    // return this.http.get<MapLocation[]>('/assets/locations.json');
    return this.http
      .get('/assets/locations.json')
      .pipe(map((data: any) => this.transformResponse(data)));
  }

  transformResponse(json: MapLocation[]): MapLocation[] {
    const locations = json;
    for (const l of locations) {
      l.fullname = [l.prefix, l.firstname, l.lastname, l.suffix]
        .join(' ')
        .trim();
      l.line1 = [l.address1, l.address2].join(' ').trim();
      l.line2 = [l.locality, l.region, l.postalcode].join(' ').trim();
      l.classification = l.classification.toUpperCase();
      l.units = l.units.toLowerCase();
    }

    return locations;
  }

  getGeoJsonLocations(): Observable<FeatureCollection> {
    return this.http.get('/assets/locations.json').pipe(
      map((data: any) => {
        const transformed = this.transformResponse(data);
        return this.toGeoJson(transformed);
      })
    );
  }

  toGeoJson(locations: MapLocation[]): FeatureCollection {
    const features: Feature[] = [];
    for (const l of locations) {
      const feature = {
        type: 'Feature',
        properties: {
          fullname: l.fullname,
          address1: l.address1,
          icon: 'theatre'
        },
        geometry: {
          type: 'Point',
          coordinates: l.coordinates
        }
      };

      features.push(feature as Feature);
    }

    return { type: 'FeatureCollection', features } as FeatureCollection;
  }
}
