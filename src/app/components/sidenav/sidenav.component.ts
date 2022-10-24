import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

/**
 * Clase para generar el menú y la navegación entre ventanas
 */
export class SidenavComponent implements OnDestroy {


  

  fillerNav=[
       {
         name:'Compras públicas',
         icon:'request_quote',
         children:[
          {
            name:'Reportes',
            route:'reportes',
            icon:'date_range',
          },
          {
            name:'Gráficos',
            route:'graficos',
            icon:'equalizer',
          }
         ]
      //  },
      //  {
      //   name:'Calidad de servicio',
      //    icon:'support_agent',
      //    children:[
      //     {
      //       name:'Alimentadores',
      //       route:'graficos-cs',
      //       icon:'equalizer',
      //     },
      //     {
      //       name:'Generales',
      //       route:'graficos-generales-cs',
      //       icon:'join_full',
      //     }
      //    ]
       }
   ]
   
   options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

   constructor(private _formBuilder: FormBuilder) {
   
    }
 
   ngOnDestroy(): void {
   }
   
   onClose(){
    const home='';
   }

   shouldRun = true;
}
