import { Component, OnInit,ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export interface PeriodicElement {
  alimentador: string;
  id: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: '10000', alimentador: 'CAPRICHO'},
  {id: '76549', alimentador: 'CENTRAL PUYO'},
  {id: '86549', alimentador: 'CIRCUNVALACION'},
  {id: '96549', alimentador: 'MERA'},
  {id: '106549', alimentador: 'SHELL'},
  {id: '106549', alimentador: 'TARQUI'}
];

@Component({
  selector: 'app-graficos-cs',
  templateUrl: './graficos-cs.component.html',
  styleUrls: ['./graficos-cs.component.css']
})
export class GraficosCsComponent implements OnInit {
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartBar") chartBar: ChartComponent;
  public chartOptionsBar: Partial<ChartOptionsBar>;

  displayedColumns: string[] = ['id', 'alimentador'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  fechaAct:any;
  

  constructor() { 
   const fecha = new Date();
    this.fechaAct= fecha.toLocaleDateString();

    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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

    this.chartOptionsBar = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };

  }

  ngOnInit(): void {
  }

}
