import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoProceso } from '../models/tipo-proceso.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoProcesosService {

  constructor(private http:HttpClient) { }

  getTipoProcesos():Observable<TipoProceso[]>{
    return this.http.get<TipoProceso[]>('api/tipoProcesos');
  }

}
