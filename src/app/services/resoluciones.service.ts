import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolucion } from '../models/resolucion.interface';

@Injectable({
  providedIn: 'root'
})
export class ResolucionesService {

  constructor(private http:HttpClient) { }

  getResoluciones():Observable<Resolucion[]>{
    return this.http.get<Resolucion[]>('api/resoluciones');
  }
  
}
