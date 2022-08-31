import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompraPublica } from '../models/compras-publicas.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprasPublicasService {

  constructor(private http:HttpClient) { }

  /**
   * Método para recuperar todas las compras públicas
   * @returns - Array de comprar públicas
   */
  getComprasPublicas():Observable<CompraPublica[]>{
    return this.http.get<CompraPublica[]>('api/reportes');
  }

  /**
   * Método para recuperar las compras públicas entre un intervalo de tiempo
   * @param from - fecha de inicio
   * @param to - fecha de final
   * @returns - Array de comprar públicas
   */
  getComprasPublicasByDate(from:any,to:any):Observable<CompraPublica[]>{
    return this.http.get<CompraPublica[]>(`api/reportes/${from}/${to}`);
  }

}
