import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacioComponent } from './components/vacio/vacio.component';
import { GraficosComponent } from './graficos-module/graficos/graficos.component';
import { ReportesComponent } from './reportes-module/reportes/reportes.component';

const routes: Routes = [
  {path:'',component:VacioComponent},
  {path:'reportes',component:VacioComponent,children:[
    {path:'datos',component:ReportesComponent}
  ]},
  {path:'graficos',component:GraficosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
