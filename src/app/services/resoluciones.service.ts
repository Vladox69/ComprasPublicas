import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Resolucion } from '../models/resolucion.interface';

@Injectable({
  providedIn: 'root'
})
export class ResolucionesService {

  constructor(private http:HttpClient) { }

  getResoluciones():Observable<Resolucion[]>{
    return this.http.get<Resolucion[]>(`${environment.url}/resoluciones`);
  }
  
}
