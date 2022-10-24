import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficosCsComponent } from './calidad-servicio/graficos-cs/graficos-cs.component';
import { GraficosGeneralesCsComponent } from './calidad-servicio/graficos-generales-cs/graficos-generales-cs.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';

const routes: Routes = [
  { path: '', redirectTo:'home',pathMatch:'full'},
  { path:'home',component:HomePageComponent},
  { path:'reportes',component:ReportesComponent},
  { path:'reportes/fechas/:fromDate/:toDate',component:ReportesComponent},
  { path:'graficos',component:GraficosComponent},
  { path:'graficos/fechas/:fromDate/:toDate',component:GraficosComponent},
  { path:'graficos-cs',component:GraficosCsComponent},
  { path:'graficos-generales-cs',component:GraficosGeneralesCsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
