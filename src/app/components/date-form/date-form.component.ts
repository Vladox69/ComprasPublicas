import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
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

  @Input() ruta:string=''; 

  route: string;
  datePipe = new DatePipe('en-US');
  minDate:any;
  maxDate:any;
  formValid: boolean = false;

  fromDateParams: any;
  toDateParams: any;
  
  dateForm = new FormGroup({
    fromDate: new FormControl('',[Validators.required]),
    toDate: new FormControl('',[Validators.required]),
  },);

  constructor(private router: Router,private dialog: MatDialog,private activedRoute: ActivatedRoute) {
    this.maxDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
    this.setValues();
  }


  ngOnInit(): void {
    
  }
  

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
  onClickObtenerResultados(event:any) {
    event.preventDefault();
    if (!this.calculoEntreFechas()) {
      this.openDialog();
    } else {

      this.router
        .navigateByUrl(`${this.ruta}`, { skipLocationChange: true })
        .then(() =>
          this.router.navigate([
            `${this.ruta}/fechas`,
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

  setValues(){
    this.fromDateParams = this.activedRoute.snapshot.params.fromDate;
    this.toDateParams = this.activedRoute.snapshot.params.toDate;
    let fromDate=new Date(`${this.fromDateParams}T00:00:00`);
    let toDate=new Date(`${this.toDateParams}T00:00:00`);
    this.dateForm.get('fromDate').setValue(fromDate);
    this.dateForm.get('toDate').setValue(toDate);
  }


}
