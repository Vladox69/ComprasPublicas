import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';

const routes: Routes = [
  { path: '', redirectTo:'home',pathMatch:'full'},
  {path:'home',component:HomePageComponent},
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
