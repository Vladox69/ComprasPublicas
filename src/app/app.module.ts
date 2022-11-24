import { LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import localEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localEs,'es');

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogErrorComponent } from './components/dialog-error/dialog-error.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GraficosCsComponent } from './calidad-servicio/graficos-cs/graficos-cs.component';
import { GraficosGeneralesCsComponent } from './calidad-servicio/graficos-generales-cs/graficos-generales-cs.component';

@NgModule({
  entryComponents: [DialogErrorComponent],
  declarations: [
    AppComponent,
    SidenavComponent,
    DateFormComponent,
    ReportesComponent,
    GraficosComponent,
    DialogErrorComponent,
    HomePageComponent,
    GraficosCsComponent,
    GraficosGeneralesCsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgApexchartsModule,
  ],
  providers: [{provide:LOCALE_ID,useValue:'es'}],
  bootstrap: [AppComponent],
  exports:[
  ]
})
export class AppModule { }
