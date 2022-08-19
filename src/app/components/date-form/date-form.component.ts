import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css'],
})
export class DateFormComponent implements OnInit {
  currentRoute: string;
  route:string;
  showEmpityComponentGraficos:boolean=false;
  showEmpityComponentReportes:boolean=false;
  
  constructor(private formBuilder: FormBuilder, private router: Router) {
    //Saber en que ruta nos encontramos
    this.currentRoute = 'Home';
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if(this.currentRoute=='/reportes'){
          this.showEmpityComponentReportes=true;
          this.showEmpityComponentGraficos=false;
          this.route='/reportes';
        }else if(this.currentRoute=='/graficos'){
          this.route='/graficos';
          this.showEmpityComponentGraficos=true;
          this.showEmpityComponentReportes=false;
        }else{
          this.showEmpityComponentReportes=false;
          this.showEmpityComponentGraficos=false;
        }
      }
    });
    
    this.dateForm = this.formBuilder.group(
      {
        fromDate: [''],
        toDate: [''],
      },
      { validator: this.checkDates }
    );
  }

  //Saber si la fecha es inicial es menor que la final 
  checkDates(group: FormGroup) {
    if (group.controls.toDate.value < group.controls.fromDate.value) {
      return { notValid: true };
    }

    if (
      group.controls.fromDate.value == '' ||
      group.controls.toDate.value == ''
    ) {
      return { notValid: true };
    }

    return null;
  }

  ngOnInit(): void {}
  dateForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });

  onClickObtenerResultados() {
    var datePipe = new DatePipe('en-US');
    this.route=this.currentRoute.includes('/reportes')?'/reportes':'/graficos'; 
    this.router
      .navigateByUrl(`${this.route}`, { skipLocationChange: true })
      .then(() =>
        this.router.navigate([
          `${this.currentRoute}/fechas`,
          datePipe.transform(this.dateForm.get('fromDate').value, 'yyyy-MM-dd'),
          datePipe.transform(this.dateForm.get('toDate').value, 'yyyy-MM-dd'),
        ])
      );
  }
}
