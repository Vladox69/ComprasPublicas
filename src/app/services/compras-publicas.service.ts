import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompraPublica } from '../models/compras-publicas.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprasPublicasService {

  constructor(private http:HttpClient) { }

  getComprasPublicas():Observable<CompraPublica[]>{
    return this.http.get<CompraPublica[]>('api/reportes');
  }

  getComprasPublicasByDate(from:any,to:any):Observable<CompraPublica[]>{
    return this.http.get<CompraPublica[]>(`api/reportes/${from}/${to}`);
  }

}
