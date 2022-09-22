import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  onSubmit(data: string) {
    return this.http.post('api/enviarCorreo', data);
  }


}
