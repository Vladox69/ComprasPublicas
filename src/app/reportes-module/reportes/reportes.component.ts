import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { Departamento } from 'src/app/models/departamento.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { ComprasPublicasService } from 'src/app/services/compras-publicas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PdfService } from 'src/app/services/pdf.service';
import { DetalleCompra } from 'src/app/models/detalle-compra.interface';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  
  departamentos: Departamento[] = [];
  tipoProcesos: TipoProceso[] = [];
  
  comprasPublicas: CompraPublica[] = [];
  comprasPublicasFilter:CompraPublica[]=[];
  comprasPublicasConteo:CompraPublica[]=[];
  detalleCompras:DetalleCompra[]=[];

  totalDesiertos:number=0;
  totalAdjudicados:number=0;
  totalCancelados:number=0;
  totalBorradores:number=0;
  totalNoUtilizados:number=0;

  totalContratado:number=0;

  selectProceso:string;
  selectDepartamento:string;

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
    private comprasPublicasService: ComprasPublicasService,
    private activedRoute:ActivatedRoute,
    private excelService:ExcelService,
    private pdfService:PdfService
  ) {
    this.fromDate=this.activedRoute.snapshot.params.fromDate;
    this.toDate=this.activedRoute.snapshot.params.toDate
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
    this.comprasPublicasService
    .getComprasPublicasByDate(this.fromDate, this.toDate)
    .subscribe((response) => {
      this.comprasPublicas = response;
      this.comprasPublicasFilter=response;
      this.filtrar();
    });
  }



  filtrar(): void {
    if (
      this.selectProceso == undefined &&
      this.selectDepartamento == undefined
    ) {
      this.comprasPublicas = this.comprasPublicasFilter;
    } else if (
      this.selectProceso == undefined &&
      this.selectDepartamento != ''
    ) {
      let departamento = this.selectDepartamento;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return proceso.intdep_DESCRIPCION == departamento;
      });
      
    } else if (
      this.selectProceso != '' &&
      this.selectDepartamento == undefined
    ) {
      let proceso_cod = this.selectProceso;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return proceso.intpro_ABREV == proceso_cod;
      });
      
    } else if (this.selectProceso != '' && this.selectDepartamento != '') {
      let departamento = this.selectDepartamento;
      let proceso_cod = this.selectProceso;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return (
          proceso.intdep_DESCRIPCION == departamento &&
          proceso.intpro_ABREV == proceso_cod
        );
      });
    }
    this.totalAdjudicados = this.conteo_adjudicados(this.comprasPublicas);
    this.totalCancelados = this.conteo_cancelados(this.comprasPublicas);
    this.totalDesiertos = this.conteo_desiertos(this.comprasPublicas);
    this.totalBorradores = this.conteo_borradores(this.comprasPublicas);
    this.totalNoUtilizados = this.conteo_no_utilizados(this.comprasPublicas);
    this.totalContratado = parseFloat(this.calculo_total_contratado(this.comprasPublicas).toFixed(2));
    this.crearDetalleCompras();

  }

  conteo_adjudicados(procesoConteo: CompraPublica[]): number {
    procesoConteo = procesoConteo.filter(function (proceso) {
      return proceso.intres_DETALLE == 'ADJUDICADO';
    });
    return procesoConteo.length;
  }

  conteo_desiertos(procesoConteo: CompraPublica[]): number {
    procesoConteo = procesoConteo.filter(function (proceso) {
      return proceso.intres_DETALLE == 'DESIERTO';
    });
    return procesoConteo.length;
  }

  conteo_cancelados(procesoConteo: CompraPublica[]): number {
    procesoConteo = procesoConteo.filter(function (proceso) {
      return proceso.intres_DETALLE == 'CANCELADO';
    });
    return procesoConteo.length;
  }

  conteo_borradores(procesoConteo: CompraPublica[]): number {
    procesoConteo = procesoConteo.filter(function (proceso) {
      return proceso.intres_DETALLE == 'BORRADOR';
    });
    return procesoConteo.length;
  }

  conteo_no_utilizados(procesoConteo: CompraPublica[]): number {
    procesoConteo = procesoConteo.filter(function (proceso) {
      return proceso.intres_DETALLE == 'NO UTILIZADO';
    });
    return procesoConteo.length;
  }

  calculo_total_contratado(procesos_total_contratado: CompraPublica[]): number {
    this.totalContratado = 0;
    let acumulador = 0;
    for (let i = 0; i < procesos_total_contratado.length; i++) {
      acumulador =
        acumulador + procesos_total_contratado[i].contraf_VALOR_CONTRATO;
    }
    return acumulador;
  }

  //Descargar excel
  async downloadExcel(){
    
    const details_val=[
      this.totalAdjudicados,
      this.totalDesiertos,
      this.totalNoUtilizados,
      this.totalCancelados,
      this.totalBorradores,
      this.totalContratado
    ]   
    
    this.excelService.dowloadExcel(details_val,this.comprasPublicas);

  }

  //Descargar pdf
  downloadPdf(){
    this.pdfService.exportToPdf('tableExporter','detalleExporter');
  }

  //Detalle de las compras
  crearDetalleCompras(){
    this.detalleCompras=[];
    this.detalleCompras.push(new DetalleCompra("Adjudicados",this.totalAdjudicados));
    this.detalleCompras.push(new DetalleCompra("Desiertos",this.totalDesiertos));
    this.detalleCompras.push(new DetalleCompra("Cancelados",this.totalCancelados));
    this.detalleCompras.push(new DetalleCompra("No utilizados",this.totalNoUtilizados));
    this.detalleCompras.push(new DetalleCompra("Borradores",this.totalBorradores));
    this.detalleCompras.push(new DetalleCompra("Total contratado",this.totalContratado));
  }

}
