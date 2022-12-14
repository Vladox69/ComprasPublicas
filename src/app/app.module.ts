import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import {HttpClientModule} from '@angular/common/http';

import { DateFormComponent } from './components/date-form/date-form.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { VacioComponent } from './components/vacio/vacio.component';
import { GraficosVacioComponent } from './graficos-module/graficos-vacio/graficos-vacio.component';
import { ReportesVaciosComponent } from './reportes-module/reportes-vacios/reportes-vacios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DateFormComponent,
    ReportesComponent,
    GraficosComponent,
    FiltrosComponent,
    VacioComponent,
    GraficosVacioComponent,
    ReportesVaciosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports:[
  ]
})
export class AppModule { }
