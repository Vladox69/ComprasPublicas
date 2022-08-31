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
  ApexTitleSubtitle
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

  @ViewChild("chartRadar") chartRadar: ChartComponent;
  public chartOptionsRadar: Partial<ChartOptionsRadar>;

  tipoProcesos: TipoProceso[] = [];
  tipoProcesosVista: TipoProceso[] = [];
  comprasPublicas: CompraPublica[] = [];
  comprasPublicasVista: CompraPublica[] = [];
  detalleGraficos: DetalleGrafico[] = [];

  fromDate: any;
  toDate: any;

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
    this.getDatos();
  }

  ngOnInit(): void { }

  /**
   * Método para obtener los datos de tipo de proceso, compras públicas entre una fecha de inicio y una fecha de fun
   */

  getDatos() {
    this.tipoProcesoService.getTipoProcesos().subscribe((response) => {
      this.tipoProcesos = response;
    });

    this.comprasPublicasService
      .getComprasPublicasByDate(this.fromDate, this.toDate)
      .subscribe((response) => {
        this.comprasPublicas = response;
        this.obtenerProcesos();
        this.dividirCaracteristicas();
      });
  }

  /**
   * Método para obtener únicamente los tipos de procesos que se encuentren en los datos de compras públicas extraidos entre una fecha inicial y final
   * 
   */
  obtenerProcesos() {
    let auxComprasPublicas: CompraPublica[] = [];
    this.detalleGraficos = [];
    for (let i = 0; i < this.tipoProcesos.length; i++) {
      let abreviatura = this.tipoProcesos[i].abreviatura;
      auxComprasPublicas = this.comprasPublicas.filter(function (proceso) {
        return proceso.intpro_ABREV == abreviatura;
      });

      if (auxComprasPublicas.length > 0) {
        this.detalleGraficos.push(
          new DetalleGrafico(abreviatura, auxComprasPublicas.length, this.crearColorAleatorio())
        );
        this.comprasPublicasVista =
          this.comprasPublicasVista.concat(auxComprasPublicas);
        this.tipoProcesosVista.push(this.tipoProcesos[i]);
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
          click: function (chart, w, e) { },
        },
      },
      colors: this.colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
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
            fontSize: '12px',
          },
        },
      },
    };

    this.chartOptionsPie = {
      series: this.datos,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.categories,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.chartOptionsRadar = {
      series: [
        {
          name: "Series 1",
          data: this.datos
        }
      ],
      chart: {
        height: 350,
        type: "radar"
      },
      title: {
        text: "",
      },
      xaxis: {
        categories: this.categories
      }
    };

  }

  /**
   * Método para generar colores de manera aleatoria
   * @returns Un string con la cadena de color en hexadecimal
   */
  crearColorAleatorio():string{
    const hexadecimal = new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');
    let colorAleatorio = '#';
    for (let i = 0; i < 6; i++) {
      let posarray = Math.trunc(Math.random()*hexadecimal.length);
      colorAleatorio += hexadecimal[posarray];
    }
    return colorAleatorio;
  }
}
