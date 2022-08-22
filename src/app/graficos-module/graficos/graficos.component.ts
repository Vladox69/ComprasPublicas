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
} from 'ng-apexcharts';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { DetalleGrafico } from 'src/app/models/detalle-graficos.interface';
import { TipoProceso } from 'src/app/models/tipo-proceso.interface';
import { ComprasPublicasService } from 'src/app/services/compras-publicas.service';
import { TipoProcesosService } from 'src/app/services/tipo-procesos.service';

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
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  tipoProcesos: TipoProceso[] = [];
  tipoProcesosVista: TipoProceso[] = [];
  comprasPublicas: CompraPublica[] = [];
  comprasPublicasVista: CompraPublica[] = [];
  detalleGraficos: DetalleGrafico[] = [];

  fromDate: any;
  toDate: any;

  datos: number[] = [];
  categories: string[] = [];
  colors: string[] = [];

  constructor(
    private tipoProcesoService: TipoProcesosService,
    private comprasPublicasService: ComprasPublicasService,
    private activedRoute: ActivatedRoute
  ) {
    this.fromDate = this.activedRoute.snapshot.params.fromDate;
    this.toDate = this.activedRoute.snapshot.params.toDate;

    this.getDatos();
  }

  ngOnInit(): void {}

   getDatos() {
    this.tipoProcesoService.getTipoProcesos().subscribe((response) => {
      this.tipoProcesos = response;
    });

    this.comprasPublicasService
      .getComprasPublicasByDate(this.fromDate, this.toDate)
      .subscribe( (response) => {
        this.comprasPublicas = response;
        this.obtenerProcesos();
        this.dividirCaracteristicas();
        this.crearGrafico();
      });

     
  }

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
          new DetalleGrafico(abreviatura, auxComprasPublicas.length, '#008FFB')
        );
        this.comprasPublicasVista = this.comprasPublicasVista.concat(auxComprasPublicas);
        this.tipoProcesosVista.push(this.tipoProcesos[i]);
      }
    }
    //console.log(this.comprasPublicasVista);
    //console.log(this.tipoProcesosVista);
    //console.log(this.detalleGraficos);
  }

  dividirCaracteristicas() {
    for (let i = 0; i < this.detalleGraficos.length; i++) {
      this.datos.push(this.detalleGraficos[i].cantidad);
      this.categories.push(this.detalleGraficos[i].detalle);
      this.colors.push(this.detalleGraficos[i].color);
    }
  }

  crearGrafico() {
    this.chartOptions = {
      series: [
        {
          name: 'distibuted',
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
  }
}
