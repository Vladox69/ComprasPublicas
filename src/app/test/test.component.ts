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
    destino:new FormControl('',[Validators.required,Validators.email]),
    asunto:new FormControl('',Validators.required),
    mensaje:new FormControl('',Validators.required),
  })


  constructor(private emailService:EmailService) { }

  ngOnInit(): void {
  }

  onClickEnviar(){
    //console.log(this.formData.value);
    let mensajeStr=JSON.stringify(this.formData.value);
    this.emailService.onSubmit(mensajeStr);
  }

}
