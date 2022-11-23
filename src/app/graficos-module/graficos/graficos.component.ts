import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { DetalleGrafico } from 'src/app/models/detalle-graficos.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { ComprasPublicasService } from 'src/app/services/compras-publicas.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';

/**
 * Clases importadas de módulo apexcharts
 */
type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptionsRadar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

export type ChartOptionsArea = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type ChartOptionsAreaProceso = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild('chartPie') chartPie: ChartComponent;
  public chartOptionsPie: Partial<ChartOptionsPie>;

  @ViewChild('chartRadar') chartRadar: ChartComponent;
  public chartOptionsRadar: Partial<ChartOptionsRadar>;

  @ViewChild('chartArea') chartArea: ChartComponent;
  public chartOptionsArea: Partial<ChartOptionsArea>;

  @ViewChild('chartOptionsAreaProceso') chartAreaProceso: ChartComponent;
  public chartOptionsAreaProceso: Partial<ChartOptionsAreaProceso>;

  tipoProcesos: TipoProceso[] = [];
  tipoProcesosVista: TipoProceso[] = [];
  tipoProcesosSelect: TipoProceso[] = [];
  comprasPublicas: CompraPublica[] = [];
  comprasPublicasFilter: CompraPublica[] = [];
  comprasPublicasVista: CompraPublica[] = [];
  detalleGraficos: DetalleGrafico[] = [];

  fechas: Date[] = [];
  fromDate: any;
  toDate: any;
  meses: any = [
    { id: 0, mes: 'Enero', cantidad: 0 },
    { id: 1, mes: 'Febrero', cantidad: 0 },
    { id: 2, mes: 'Marzo', cantidad: 0 },
    { id: 3, mes: 'Abril', cantidad: 0 },
    { id: 4, mes: 'Mayo', cantidad: 0 },
    { id: 5, mes: 'Junio', cantidad: 0 },
    { id: 6, mes: 'Julio', cantidad: 0 },
    { id: 7, mes: 'Agosto', cantidad: 0 },
    { id: 8, mes: 'Septiembre', cantidad: 0 },
    { id: 9, mes: 'Octubre', cantidad: 0 },
    { id: 10, mes: 'Noviembre', cantidad: 0 },
    { id: 11, mes: 'Diciembre', cantidad: 0 },
  ];
  categoriasPorProceso: any = [];

  selectProceso: string;

  datos: number[] = [0];
  categories: string[] = ['#008FFB'];
  colors: string[] = ['#008FFB'];

  constructor(
    private tipoProcesoService: TipoProcesosService,
    private comprasPublicasService: ComprasPublicasService,
    private activedRoute: ActivatedRoute
  ) {
    this.fromDate = this.activedRoute.snapshot.params.fromDate;
    this.toDate = this.activedRoute.snapshot.params.toDate;
    this.crearGrafico();
  }

  ngOnInit(): void {
    if (this.fromDate != null) {
      this.getDatos();
    }
  }

  /**
   * Método para obtener los datos de tipo de proceso, compras públicas entre una fecha de inicio y una fecha de fun
   */

  async getDatos() {
    this.crearCategoriaParaVariacion();

    this.tipoProcesoService.getTipoProcesos().then((response) => {
      response.subscribe((data) => {
        this.tipoProcesos = data;
      });
      response.subscribe((data) => {
        this.tipoProcesosSelect = data;
      });
    });

    await this.comprasPublicasService
      .getComprasPublicasByDate(this.fromDate, this.toDate)
      .then((response) => {
        response.subscribe((data) => {
          this.comprasPublicas = data;
          this.comprasPublicasFilter = data;
          this.obtenerProcesos();
          this.dividirCaracteristicas();
        });
      });
  }

  /**
   * Método para obtener únicamente los tipos de procesos que se encuentren en los datos de compras públicas extraidos entre una fecha inicial y final
   *
   */
  obtenerProcesos() {
    let auxComprasPublicas: CompraPublica[] = [];
    let auxTipoProcesoVista;
    this.detalleGraficos = [];
    for (let i = 0; i < this.tipoProcesos.length; i++) {
      let abreviatura = this.tipoProcesos[i].abreviatura;
      auxComprasPublicas = this.comprasPublicas.filter(function (proceso) {
        return proceso.intpro_ABREV == abreviatura;
      });

      if (auxComprasPublicas.length > 0) {
        this.detalleGraficos.push(
          new DetalleGrafico(
            abreviatura,
            auxComprasPublicas.length,
            this.crearColorAleatorio()
          )
        );
        this.comprasPublicasVista =
          this.comprasPublicasVista.concat(auxComprasPublicas);
        auxTipoProcesoVista = this.tipoProcesos[i];
        auxTipoProcesoVista.descripcion =
          ' - ' +
          auxTipoProcesoVista.descripcion +
          '  ' +
          auxComprasPublicas.length;
        this.tipoProcesosVista.push(auxTipoProcesoVista);
      }
    }
  }

  /**
   * Método para dividir en arreglos diferentes los tipos de procesos
   * datos son la cantidad de cada proceso que se mostrará en las gráficas
   * categories son las abreviaturas de cada proceso que se mostrará en las gráficas
   * colors son los diferentes colores de cada proceso que se mostrará en las gráficas
   */
  dividirCaracteristicas() {
    this.datos = [];
    this.categories = [];
    this.colors = [];
    for (let i = 0; i < this.detalleGraficos.length; i++) {
      this.datos.push(this.detalleGraficos[i].cantidad);
      this.categories.push(this.detalleGraficos[i].detalle);
      this.colors.push(this.detalleGraficos[i].color);
    }
    this.crearGrafico();
  }

  /**
   * Método para asignar variables datos, categories, colors a cada uno de los gráficos
   */
  crearGrafico() {
    this.chartOptions = {
      series: [
        {
          name: 'Cantidad',
          data: this.datos,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {},
        },
      },
      colors: this.colors,
      plotOptions: {
        bar: {
          columnWidth: '50%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: this.categories,
        labels: {
          style: {
            colors: this.colors,
            fontSize: '10px',
          },
        },
      },
    };

    this.chartOptionsPie = {
      series: this.datos,
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: this.categories,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 380,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    this.chartOptionsArea = {
      series: [
        {
          name: 'Cantidad',
          data: this.datos,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: this.categories,
        labels: {
          style: {
            colors: this.colors,
            fontSize: '10px',
          },
        },
      },
      tooltip: {
        x: {
          show: true,
        },
      },
    };
  }

  /**
   * Método para generar colores de manera aleatoria
   * @returns Un string con la cadena de color en hexadecimal
   */
  crearColorAleatorio(): string {
    const hexadecimal = new Array(
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F'
    );
    let colorAleatorio = '#';
    for (let i = 0; i < 6; i++) {
      let posarray = Math.trunc(Math.random() * hexadecimal.length);
      colorAleatorio += hexadecimal[posarray];
    }
    return colorAleatorio;
  }

  filtrarProceso() {
    let proceso_cod = this.selectProceso;
    this.comprasPublicasFilter = this.comprasPublicas.filter(function (
      proceso
    ) {
      return proceso.intpro_ABREV == proceso_cod;
    });

    this.fechas = this.comprasPublicasFilter.map(function (proceso) {
      return new Date(`${proceso.createdAt}T00:00:00`);
    });

    for (let indice in this.categoriasPorProceso) {
      let aux = this.fechas.filter((fecha) => {
        return fecha.getMonth() == this.categoriasPorProceso[indice].id;
      });
      this.categoriasPorProceso[indice].cantidad = aux.length;
    }

    let meses = this.categoriasPorProceso.map((obj) => {
      return obj.mes;
    });
    let cantidad = this.categoriasPorProceso.map((obj) => {
      return obj.cantidad;
    });

    this.chartOptionsAreaProceso = {
      series: [
        {
          name: proceso_cod,
          data: cantidad,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: meses,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }

  crearCategoriaParaVariacion() {
    let fromDate = new Date(`${this.fromDate}T00:00:00`);
    let toDate = new Date(`${this.toDate}T00:00:00`);
    let from = fromDate.getMonth();
    let to = toDate.getMonth();
    this.categoriasPorProceso = [];

    if (from > to) {
      let i = from;
      do {
        let mes = { ...this.meses[i] };
        this.categoriasPorProceso = [...this.categoriasPorProceso, mes];
        if (i == 11) {
          i = 0;
        } else {
          i = i + 1;
        }
      } while (i != to);
      let mes = { ...this.meses[to] };
      this.categoriasPorProceso = [...this.categoriasPorProceso, mes];
    } else {
      for (let i = from; i <= to; i++) {
        let mes = { ...this.meses[i] };
        this.categoriasPorProceso = [...this.categoriasPorProceso, mes];
      }
    }
  }
}
