import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/models/departamento.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {

  constructor(private departamentoService:DepartamentosService,private tipoProcesoServices:TipoProcesosService) { }

  departamentos:Departamento[]=[];
  tipoProcesos:TipoProceso[]=[]

  async ngOnInit(): Promise<void> {
      await this.getSelectDatos();
  }

  async getSelectDatos(){
    this.departamentoService.getDepartamentos().subscribe((response)=>{
      console.log(response)
      this.departamentos=response;
    });
    this.tipoProcesoServices.getTipoProcesos().subscribe((response)=>{
      console.log(response)
      this.tipoProcesos=response;
    })  
  }


}
