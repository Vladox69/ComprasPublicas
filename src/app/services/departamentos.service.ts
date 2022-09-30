import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Departamento } from '../models/departamento.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor(private http:HttpClient) { }

  /**
   * Método para recuperar los departamentos
   * @returns - Array de departamentos
   */
  getDepartamentos():Observable<Departamento[]>{
    return this.http.get<Departamento[]>(`${environment.url}/api/departamentos`);
  }

}
