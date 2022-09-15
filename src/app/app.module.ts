import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import {HttpClientModule} from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";

import { DateFormComponent } from './components/date-form/date-form.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { VacioComponent } from './components/vacio/vacio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DateFormComponent,
    ReportesComponent,
    GraficosComponent,
    VacioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports:[
  ]
})
export class AppModule { }
