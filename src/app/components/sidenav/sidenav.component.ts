import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

/**
 * Clase para generar el menú y la navegación entre ventanas
 */
export class SidenavComponent implements OnDestroy {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  
  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

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

   constructor(private _formBuilder: FormBuilder,private observer: BreakpointObserver) {
   
    }
 
   ngOnDestroy(): void {
   }
   
   onClose(){
    const home='';
   }

   shouldRun = true;
}
