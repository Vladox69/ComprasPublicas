import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css'],
})

/**
 * Clase para la creación del componente fecha
 */
export class DateFormComponent implements OnInit {
  currentRoute: string;
  route: string;
  datePipe = new DatePipe('en-US');
  minDate;
  maxDate;
  formValid: boolean = false;

  constructor(private router: Router,private dialog: MatDialog) {

    //Proceso para saber en que ruta nos encontramos
    this.currentRoute = 'Home';

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentRoute == '/reportes') {
          this.route = '/reportes';
        } else if (this.currentRoute == '/graficos') {
          this.route = '/graficos';
        }
      }
    });
  }


  ngOnInit(): void {
    this.maxDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }
  dateForm = new FormGroup({
    fromDate: new FormControl('',[Validators.required]),
    toDate: new FormControl('',[Validators.required]),
  },);

  cargarFechaFinal() {
    this.minDate = this.datePipe.transform(this.dateForm.get('fromDate').value, 'yyyy-MM-dd');
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogErrorComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Método que devuelve cual es la ruta actual en caso de recargar la página o caida de internet
   */
  onClickObtenerResultados() {
    if (!this.calculoEntreFechas()) {
      this.openDialog();
    } else {

      this.route = this.currentRoute.includes('/reportes') ? '/reportes' : '/graficos';
      this.router
        .navigateByUrl(`${this.route}`, { skipLocationChange: true })
        .then(() =>
          this.router.navigate([
            `${this.currentRoute}/fechas`,
            this.datePipe.transform(this.dateForm.get('fromDate').value, 'yyyy-MM-dd'),
            this.datePipe.transform(this.dateForm.get('toDate').value, 'yyyy-MM-dd'),
          ])
        );
    }

  }

  calculoEntreFechas(): boolean {
    let valido = false;
    let fromDatePipe = this.datePipe.transform(this.dateForm.get('fromDate').value, 'yyyy-MM-dd');
    let toDatePipe = this.datePipe.transform(this.dateForm.get('toDate').value, 'yyyy-MM-dd');
    let fromDate = new Date(fromDatePipe).getTime();
    let toDate = new Date(toDatePipe).getTime();
    let diff = toDate - fromDate;
    let rangoTotal = diff / (1000 * 60 * 60 * 24);
    if (rangoTotal <= 366) {
      valido = true;
    }
    return valido;
  }


}
