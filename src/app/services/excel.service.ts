import { Injectable } from '@angular/core';
import { ImagePosition, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LOGO } from 'src/app/services/logo';
import { CompraPublica } from '../models/compras-publicas.interface';
import { DetalleCompra } from '../models/detalle-compra.interface';
import { HEADERS } from './encabezados';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private _workbook: Workbook;

  constructor() {}

  /**
   * Método para la descarga del archivo excel
   * @param details_val - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  async dowloadExcel(
    details_val: DetalleCompra[],
    comprasPublicas: CompraPublica[]
  ) {
    this._workbook = new Workbook();
    await this.create_sheet(details_val, comprasPublicas);
    this._workbook.xlsx.writeBuffer().then((data)=>{
      const blob=new Blob([data])
      fs.saveAs(blob,'Compras_publicas.xlsx');
    });
  }

  /**
   * Método para crear archivo de excel
   * @param details_val - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  private async create_sheet(
    details_val: DetalleCompra[],
    comprasPublicas: CompraPublica[]
  ) {
    //Añadir hoja
    const sheet = this._workbook.addWorksheet('Compras Públicas');

    const abecedario: string[] = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    /*for (let index in headers) {
      let tamanio = headers[index].length+10;
      sheet.getColumn(abecedario[index]).width = tamanio;
    }*/

    //Cambiar el tamaño de las columnas
    var tamanio = 0;
    for (let index in HEADERS) {
      if (tamanio < HEADERS[index].length) {
        tamanio = HEADERS[index].length;
      }
    }
    tamanio = tamanio + 10;
    for (let index in HEADERS) {
      sheet.getColumn(abecedario[index]).width = tamanio;
    }

    // Añadir imagen
    const logoId = this._workbook.addImage({
      base64: LOGO,
      extension: 'png',
    });

    const position: ImagePosition = {
      tl: { col: 0.15, row: 0.3 },
      ext: { width: 700, height: 229 },
    };

    sheet.addImage(logoId, position);

    //Añadir encabezados
    const headerRow = sheet.getRow(14);

    headerRow.values = HEADERS;
    headerRow.font = { bold: true, size: 12 };

    const rowsToInsert = sheet.getRows(15, comprasPublicas.length);

    const valor_columna_sig = 15 + comprasPublicas.length;

    //Insertar los detalles de cada resolución y el total contratado
    for (let index = 0; index < details_val.length; index++) {
      const col = 'A';
      const col_val = 'B';
      const indice = valor_columna_sig + index;
      const cell = col + indice;
      const cell_val = col_val + indice;
      const detailCell = sheet.getCell(cell);
      const detailVal = sheet.getCell(cell_val);
      detailCell.value = details_val[index].detalle;
      detailVal.value = details_val[index].cantidad;
    }

    //Insertar todos los valores
    for (let index = 0; index < rowsToInsert!.length; index++) {
      const itemData = comprasPublicas[index];
      const row = rowsToInsert![index];
      row.values = [
        itemData.createdAt,
        itemData.intpro_DESCRIPCION,
        itemData.intpro_ABREV,
        itemData.intrp_NUMEROPROCESO,
        itemData.intrp_CODIGOPROCESO,
        itemData.intrp_DETALLE,
        itemData.intres_DETALLE,
        itemData.intrp_NUMOFICIO,
        itemData.ma_CONT_RAZON_SOCIAL,
        itemData.intrp_ANIO,
        itemData.contraf_VALOR_CONTRATO,
        itemData.intdep_DESCRIPCION,
      ];
    }
    //Dar formato de tabla y estilos al texto
    sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          wrapText: true,
          vertical: 'top',
        };
      });
    });
  }
}
