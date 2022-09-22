import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

/**
 * Clase para generar el menú y la navegación entre ventanas
 */
export class SidenavComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

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
       }
   ]
   
 
   private _mobileQueryListener: () => void;
   constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
     this.mobileQuery = media.matchMedia('(max-width: 600px)');
     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
     this.mobileQuery.addListener(this._mobileQueryListener);
    }
 
   ngOnDestroy(): void {
     this.mobileQuery.removeListener(this._mobileQueryListener);
   }
   
   shouldRun = true;
}
