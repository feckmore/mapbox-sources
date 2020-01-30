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
  id: string;
  [key: string]: any;
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

  getFeatureCollection(): Observable<FeatureCollection> {
    return this.http.get('/assets/locations.json').pipe(
      map((data: any) => {
        const transformed = this.transformResponse(data);
        return this.toFeatureCollection(transformed);
      })
    );
  }

  toFeatureCollection(locations: MapLocation[]): FeatureCollection {
    const features: Feature[] = [];
    for (const l of locations) {
      const feature = this.toFeature(l);
      features.push(feature as Feature);
    }

    return { type: 'FeatureCollection', features } as FeatureCollection;
  }

  toFeature(l: MapLocation): Feature {
    return {
      type: 'Feature',
      properties: {
        id: l.id,
        classification: l.classification,
        specialties: l.specialties,
        organization: l.organization,
        distance: l.distance,
        units: l.units,
        fullname: l.fullname,
        line1: l.line1,
        line2: l.line2,
        icon: 'custom'
      },
      geometry: {
        type: 'Point',
        coordinates: l.coordinates
      }
    };
  }
}
