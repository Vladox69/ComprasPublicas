import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-graficos-vacio',
  templateUrl: './graficos-vacio.component.html',
  styleUrls: ['./graficos-vacio.component.css']
})

/**
 * Clase para mostrar la primera vista de los gráficos sin datos
 */
export class GraficosVacioComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
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

  datos: number[] = [5,6];
  categories: string[] = ['ISO','CDC'];
  colors: string[] = ['#008FFB','#008FFB'];

  constructor() {
    this.crearGrafico();
  }
  ngOnInit(): void {
  }

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

}
