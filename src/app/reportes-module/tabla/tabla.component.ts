import { Component, OnInit } from '@angular/core';
import { CompraPublica } from 'src/app/models/compras-publicas.interface';
import { ComprasPublicasService } from 'src/app/services/compras-publicas.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit {
  comprasPublicas: CompraPublica[] = [];

  constructor(private comprasPublicasService: ComprasPublicasService) {}

  async ngOnInit(): Promise<void> {
    await this.getData();
  }

  async getData() {
    this.comprasPublicasService
      .getComprasPublicasByDate('2022-06-01', '2022-08-18')
      .subscribe((response) => {
        this.comprasPublicas = response;
      });
  }

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
}
