import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacioComponent } from './components/vacio/vacio.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';

const routes: Routes = [
  { path: '', redirectTo:'reportes',pathMatch:'full'},
  { path:'reportes',component:ReportesComponent},
  { path:'reportes/fechas/:fromDate/:toDate',component:ReportesComponent},
  { path:'graficos',component:GraficosComponent},
  { path:'graficos/fechas/:fromDate/:toDate',component:GraficosComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
