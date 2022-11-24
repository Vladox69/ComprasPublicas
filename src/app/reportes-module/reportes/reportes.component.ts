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
import { DetalleCompra } from 'src/app/models/detalle-compra.interface';
import { Resolucion } from 'src/app/models/resolucion.interface';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Img, PdfMakeWrapper,Txt,Table, ITable, Stack, Columns } from 'pdfmake-wrapper';
import { HEADERS } from 'src/app/services/encabezados';

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
  async downloadPdf() {
    let fromDate,toDate;
    fromDate=this.datePipe.transform(this.fromDate,'d MMMM  y');
    toDate=this.datePipe.transform(this.toDate,'d MMMM  y');
    const pdf=new PdfMakeWrapper();
    pdf.pageOrientation("landscape");
    pdf.add(new Columns([
    await new Img('/assets/logotipo.png').fit([50, 50]).build(),
    new Stack([
      new Txt('REPORTE PROCESOS DE COMPRAS PÚBLICAS').end,
      new Txt(this.descripcion).end,
      new Txt(this.selectDepartamento).end,
      new Txt(`Fecha desde: ${fromDate} hasta: ${toDate}`).end
      ]).absolutePosition(40,40).alignment('center').end,
    ]
    ).margin(10).width(100).columnGap(10).end)
    pdf.add(this.crearTabla());
    pdf.add(this.crearTablaDetalle());
    pdf.create().open();
  }

  crearTabla():ITable{
    return new Table([
      HEADERS,
      ...this.extraerDatos()
    ]).fontSize(6).layout({
      fillColor:(rowIndex?, node?, columnIndex?)=> {
          return rowIndex===0 ?'#CCC':'' 
      },
    }).end;
  }

  extraerDatos():any{
    return this.comprasPublicas.map((compra,index)=>[
      index+1,
      compra.createdAt,
      compra.intpro_DESCRIPCION,
      compra.intpro_ABREV,
      compra.intrp_NUMEROPROCESO,
      compra.intrp_CODIGOPROCESO,
      compra.intrp_DETALLE,
      compra.intres_DETALLE,
      compra.intrp_NUMOFICIO,
      compra.ma_CONT_RAZON_SOCIAL,
      compra.intdep_DESCRIPCION,
      compra.intrp_ANIO,
      compra.contraf_VALOR_CONTRATO,
      compra.apellidos_NOMBRES
    ]);
  }

  crearTablaDetalle():ITable{
    return new Table([
      ['',
        'DESIERTO',
        'ADJUDICADO',
        'CANCELADO',
        'BORRADOR',
        'NO UTILIZADO',
        'EN PROCESO',
        'Total de procesos',
        'Total contratado'],
      [
      'Procesos totales',
      this.detalleComprasTotal[0].cantidad,
      this.detalleComprasTotal[1].cantidad,
      this.detalleComprasTotal[2].cantidad,
      this.detalleComprasTotal[3].cantidad,
      this.detalleComprasTotal[4].cantidad,
      this.detalleComprasTotal[5].cantidad,
      this.detalleComprasTotal[6].cantidad,
      this.detalleComprasTotal[7].cantidad],
      [
        'Procesos compras públicas',
        this.detalleComprasCA[0].cantidad,
        this.detalleComprasCA[1].cantidad,
        this.detalleComprasCA[2].cantidad,
        this.detalleComprasCA[3].cantidad,
        this.detalleComprasCA[4].cantidad,
        this.detalleComprasCA[5].cantidad,
        this.detalleComprasCA[6].cantidad,
        this.detalleComprasCA[7].cantidad
      ],
      [
        'Proceso EEASA',
        this.detalleComprasEEASA[0].cantidad,
        this.detalleComprasEEASA[1].cantidad,
        this.detalleComprasEEASA[2].cantidad,
        this.detalleComprasEEASA[3].cantidad,
        this.detalleComprasEEASA[4].cantidad,
        this.detalleComprasEEASA[5].cantidad,
        this.detalleComprasEEASA[6].cantidad,
        this.detalleComprasEEASA[7].cantidad
      ]
    ]).fontSize(8).margin(10).layout({
      fillColor:(rowIndex?, node?, columnIndex?)=> {
          return rowIndex===0 ?'#CCC':'' 
      },
    }).end;
  }

}

