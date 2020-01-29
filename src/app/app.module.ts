import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { FromSourcesComponent } from './from-sources/from-sources.component';

const mapboxAccessToken = environment.mapboxAccessToken;

@NgModule({
  declarations: [AppComponent, FromSourcesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: mapboxAccessToken,
      geocoderAccessToken: mapboxAccessToken
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
