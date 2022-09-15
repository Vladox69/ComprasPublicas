import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoProceso } from '../models/tipo-proceso.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoProcesosService {

  constructor(private http:HttpClient) { }

  /**
   * Método para recuperar todos los tipos de procesos
   * @returns - Arrays de tipo de procesos
   */
  async getTipoProcesos():Promise<Observable<TipoProceso[]>>{
    return  this.http.get<TipoProceso[]>('api/tipoProcesos');
  }

}
