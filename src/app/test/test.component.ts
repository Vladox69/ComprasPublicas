import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  formData:FormGroup=new FormGroup({
    Remitente:new FormControl('',[Validators.required,Validators.email]),
    Destinatario:new FormControl('',[Validators.required,Validators.email]), 
    Mensaje:new FormControl('',Validators.required),
    Asunto:new FormControl('',Validators.required),
  })

  constructor(private emailService:EmailService) { }

  ngOnInit(): void {
  }

  onClickEnviar(){
    this.emailService.onSubmit(this.formData.value).subscribe(response=>{
      console.log(response);
    });
  }

}
