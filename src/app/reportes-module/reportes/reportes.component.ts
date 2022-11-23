import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { Departamento } from 'src/app/models/departamento.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { ComprasPublicasService } from 'src/app/services/compras-publicas.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { ResolucionesService } from 'src/app/services/resoluciones.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { PdfService } from 'src/app/services/pdf.service';
import { DetalleCompra } from 'src/app/models/detalle-compra.interface';
import { Resolucion } from 'src/app/models/resolucion.interface';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {

  dataSource:any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  departamentos: Departamento[] = [];
  tipoProcesos: TipoProceso[] = [];
  resoluciones: Resolucion[] = [];

  comprasPublicas: CompraPublica[] = [];
  comprasPublicasFilter: CompraPublica[] = [];
  comprasPublicasConteo: CompraPublica[] = [];
  comprasPublicasCP:CompraPublica[]=[];
  comprasPublicasEEASA:CompraPublica[]=[];

  detalleComprasTotal: DetalleCompra[] = [];
  detalleComprasEEASA: DetalleCompra[]=[];
  detalleComprasCA:DetalleCompra[]=[];

  totalContratado: number = 0;
  eeasaContratado:number=0;
  cpContratado:number=0;

  selectProceso: TipoProceso={id:'',
    descripcion:'',
    abreviatura:'',
    tipo:''};
  selectDepartamento: string;
  descripcion:string='';

  fromDate: any;
  toDate: any;
  datePipe = new DatePipe('es');

  displayedColumns: string[] = [
    'No',
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
    'APELLIDOS_NOMBRES'
  ];

  constructor(
    private departamentoService: DepartamentosService,
    private tipoProcesoServices: TipoProcesosService,
    private comprasPublicasService: ComprasPublicasService,
    private resolucionService: ResolucionesService,
    private activedRoute: ActivatedRoute,
    private excelService: ExcelService,
    private pdfService: PdfService,
    private dialog: MatDialog
  ) {
    this.fromDate = this.activedRoute.snapshot.params.fromDate;
    this.toDate = this.activedRoute.snapshot.params.toDate;
  }

  ngOnInit(): void {
    if (this.fromDate != null) {
      this.getDatos();
    }
  }

  /**
   * Método para abrir un dialog de confirmacion
   */
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.downloadExcel();
      }
    });
  }

  /**
   * Método para extracción de datos de departamentos, tipo de procesos, comprar públicas por medio de servicios
   */
  async getDatos() {
    this.departamentoService.getDepartamentos().subscribe((response) => {
      this.departamentos = response;
    });
    await this.tipoProcesoServices.getTipoProcesos().then((response) => {
      response.subscribe((data) => {
        this.tipoProcesos = data;
      });
    });
    this.resolucionService.getResoluciones().subscribe((response) => {
      this.resoluciones = response;
    });

    await this.comprasPublicasService
      .getComprasPublicasByDate(this.fromDate, this.toDate)
      .then((response: Observable<any>) => {
        response.subscribe((data) => {
          this.comprasPublicas = data;
          this.comprasPublicasFilter = data;
          this.dataSource = new MatTableDataSource<CompraPublica>(this.comprasPublicas);
          this.dataSource.paginator = this.paginator;
          this.filtrar();
        });
      });
  }

  /**
   * Método para realizar filtros por medio de tipo de proceso o departamentos
   */
  filtrar(): void {

    let abreviatura=undefined;
    this.descripcion='';

    if(this.selectProceso!=undefined){
      abreviatura=this.selectProceso.abreviatura;
      this.descripcion=this.selectProceso.descripcion;
    }
    
    if (abreviatura == undefined &&this.selectDepartamento == undefined) {
      this.comprasPublicas = this.comprasPublicasFilter;
      this.dataSource.data=this.comprasPublicas;
    } else if (abreviatura == undefined &&this.selectDepartamento != '') {
      let departamento = this.selectDepartamento;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return proceso.intdep_DESCRIPCION == departamento;
      });
      this.dataSource.data=this.comprasPublicas;
    } else if (abreviatura != '' &&this.selectDepartamento == undefined) {
      let proceso_cod = abreviatura;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return proceso.intpro_ABREV == proceso_cod;});
        this.dataSource.data=this.comprasPublicas;
    } else if (abreviatura != '' && this.selectDepartamento != '') {
      let departamento = this.selectDepartamento;
      let proceso_cod = abreviatura;
      this.comprasPublicas = this.comprasPublicasFilter.filter(function (proceso) {
        return (proceso.intdep_DESCRIPCION == departamento &&proceso.intpro_ABREV == proceso_cod);
      });
      this.dataSource.data=this.comprasPublicas;
    }

    //Filtrar por CA y EEASA
    this.comprasPublicasCP= this.filtrar_tipo_proceso(this.comprasPublicas,'CP');
    this.comprasPublicasEEASA=this.filtrar_tipo_proceso(this.comprasPublicas,'EEASA');


    //Total contratado
    this.totalContratado = parseFloat(this.calculo_total_contratado(this.comprasPublicas).toFixed(2));
    let totalContratadoUSD=this.totalContratado.toLocaleString("en-US", {style:"currency", currency:"USD"});
    this.detalleComprasTotal= this.conteo_cantidad_proceso(this.comprasPublicas,totalContratadoUSD);


    //Total eeasa contarado
    this.eeasaContratado = parseFloat(this.calculo_total_contratado(this.comprasPublicasEEASA).toFixed(2));
    let eeasaContratadoUSD=this.eeasaContratado.toLocaleString("en-US", {style:"currency", currency:"USD"});
    this.detalleComprasEEASA= this.conteo_cantidad_proceso(this.comprasPublicasEEASA,eeasaContratadoUSD);


    //Total ca contratado
    this.cpContratado = parseFloat(this.calculo_total_contratado(this.comprasPublicasCP).toFixed(2));
    let cpContratadoUSD=this.cpContratado.toLocaleString("en-US", {style:"currency", currency:"USD"});
    this.detalleComprasCA= this.conteo_cantidad_proceso(this.comprasPublicasCP,cpContratadoUSD);
  }

  filtrar_tipo_proceso(comprasPublicas: CompraPublica[],tipo:string):CompraPublica[] {
    let auxTipoProceso:TipoProceso[]=[];
    let auxComprasPublicas:CompraPublica[]=[];
    let comprasPublicasFiltrado:CompraPublica[]=[];
    auxTipoProceso=this.tipoProcesos.filter((tipoProceso)=>{
      return tipoProceso.tipo== tipo;      
    });
    
    for(let index in auxTipoProceso){
      auxComprasPublicas=comprasPublicas.filter((compra)=>{
        return compra.intpro_ABREV==auxTipoProceso[index].abreviatura;
      })
      comprasPublicasFiltrado=comprasPublicasFiltrado.concat(auxComprasPublicas);
    }

    return comprasPublicasFiltrado;
  }

  /**
   * Método para calcular el total de cada resolución y total contratado
   * @param procesoConteo - Array de compras públicas
   */
  conteo_cantidad_proceso(procesoConteo: CompraPublica[],totalContratado:string):DetalleCompra[] {
    let detalleCompras: DetalleCompra[] = [];
    let auxConteo: CompraPublica[];
    auxConteo = procesoConteo;

    for (let index in this.resoluciones) {
      procesoConteo = auxConteo.filter((proceso) => {
        return proceso.intres_DETALLE == this.resoluciones[index].detalle;
      });
      detalleCompras.push(
        new DetalleCompra(
          this.resoluciones[index].detalle + ': ',
          procesoConteo.length
        )
      );
    }

    procesoConteo = auxConteo.filter((proceso) => {
      return proceso.intres_DETALLE === null;
    });

    detalleCompras.push(
      new DetalleCompra('EN PROCESO: ', procesoConteo.length)
    );
    detalleCompras.push(
      new DetalleCompra('Total de procesos: ', auxConteo.length)
    );
    detalleCompras.push(
      new DetalleCompra('Total contratado: ', totalContratado)
    );

    return detalleCompras;
  }




  /**
   * Método para realizar la suma del total de las compras públicas
   * @param procesos_total_contratado - Array de compras públicas
   * @returns número total de contrato de las compras públicas
   */
  calculo_total_contratado(procesos_total_contratado: CompraPublica[]): number {
    this.totalContratado = 0;
    let acumulador = 0;
    for (let i = 0; i < procesos_total_contratado.length; i++) {
      acumulador =
        acumulador + procesos_total_contratado[i].contraf_VALOR_CONTRATO;
    }
    return acumulador;
  }

  /**
   * Método para llamar al servicio de descargar excel
   */
  async downloadExcel() {
    let fromDate,toDate;
    fromDate=this.datePipe.transform(this.fromDate,'d MMMM  y');
    toDate=this.datePipe.transform(this.toDate,'d MMMM  y');
    this.excelService.dowloadExcel(this.detalleComprasTotal,
                                    this.comprasPublicas,
                                    this.detalleComprasEEASA,
                                    this.detalleComprasCA,
                                    fromDate,toDate,
                                    this.descripcion,this.selectDepartamento);
  }

  /**
   * Método para llamar al servicio de descargar pdf
   */
  downloadPdf() {
    this.pdfService.exportToPdf('tableExporter', 'detalleExporter','encabezado');
  }



}

