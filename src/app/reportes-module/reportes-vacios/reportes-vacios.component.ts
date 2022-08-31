import { Component, OnInit } from '@angular/core';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { Departamento } from 'src/app/models/departamento.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';

@Component({
  selector: 'app-reportes-vacios',
  templateUrl: './reportes-vacios.component.html',
  styleUrls: ['./reportes-vacios.component.css']
})

/**
 * Clase para mostrar una primera vista de las comprar públicas sin datos
 */
export class ReportesVaciosComponent implements OnInit {
  departamentos: Departamento[] = [];
  tipoProcesos: TipoProceso[] = [];
  comprasPublicas: CompraPublica[] = [];

  fromDate:any;
  toDate:any;
  
  displayedColumns: string[] = [
    'INTRP_FECHA_PUBLICACION',
    'INTPRO_DESCRIPCION',
    'INTPRO_ABREV',
    'INTRP_NUMEROPROCESO',
    'INTRP_CODIGOPROCESO',
    'INTRP_DETALLE',
    'INTRES_DETALLE',
    'INTRP_NUMOFICIO',
    'MA_CONT_RAZON_SOCIAL',
    'CONTRAF_NUMERO_CONTRATO',
    'CONTRAF_VALOR_CONTRATO',
    'INTDEP_DESCRIPCION',
  ];

  constructor(
    private departamentoService: DepartamentosService,
    private tipoProcesoServices: TipoProcesosService,
  ) {
    
  }

  ngOnInit(): void {
    this.getDatos()
  }

  getDatos() {
    this.departamentoService.getDepartamentos().subscribe((response) => {
      this.departamentos = response;
    });
    this.tipoProcesoServices.getTipoProcesos().subscribe((response) => {
      this.tipoProcesos = response;
    });
  }


}
