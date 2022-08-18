import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css']
})
export class DateFormComponent implements OnInit {


  constructor(private formBuilder: FormBuilder) { 
    this.dateForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
      }, {validator: this.checkDates});
  }

  checkDates(group: FormGroup) {
    if(group.controls.toDate.value < group.controls.fromDate.value) {
    return { notValid:true }
    }
    
    if(group.controls.fromDate.value == '' || group.controls.toDate.value == '') {
      return { notValid:true }
    }

    return null;
 }

  ngOnInit(): void {
  }
  dateForm=new FormGroup({
    fromDate:new FormControl(''),
    toDate:new FormControl('')
  })

}
