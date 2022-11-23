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
   * @param detaila_val_total - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  async dowloadExcel(
    detaila_val_total: DetalleCompra[],
    comprasPublicas: CompraPublica[],
    detail_val_EEASA:DetalleCompra[],
    detail_val_CA:DetalleCompra[],
    fromDate:any,
    toDate:any,
    proceso:any,
    departamento:any
  ) {
    this._workbook = new Workbook();
    await this.create_sheet(detaila_val_total, comprasPublicas,detail_val_EEASA,detail_val_CA,fromDate,toDate,proceso,departamento);
    this._workbook.xlsx.writeBuffer().then((data)=>{
      const blob=new Blob([data])
      fs.saveAs(blob,'Compras_publicas.xlsx');
    });
  }

  /**
   * Método para crear archivo de excel
   * @param detaila_val_total - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  private async create_sheet(
    detaila_val_total: DetalleCompra[],
    comprasPublicas: CompraPublica[],
    detail_val_EEASA:DetalleCompra[],
    detail_val_CA:DetalleCompra[],
    fromDate:any,
    toDate:any,
    proceso:any,
    departamento:any
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
    sheet.getColumn('A').width=20;
    sheet.getColumn('K').width=15;
    // Añadir imagen
    const logoId = this._workbook.addImage({
      base64: LOGO,
      extension: 'png',
    });

    const position: ImagePosition = {
      tl: { col: 0, row: 1 },
      ext: { width: 364, height: 120 },
    };

    sheet.addImage(logoId, position);

    //Añadir encabezados
    const headerRow = sheet.getRow(8);

    headerRow.values = HEADERS;
    headerRow.font = { bold: true, size: 12 };

    const rowsToInsert = sheet.getRows(9, comprasPublicas.length);

    const valor_columna_sig = 11 + comprasPublicas.length;
    sheet.getCell(`A${valor_columna_sig-1}`).value='PROCESOS DETALLE';
    sheet.getCell(`B${valor_columna_sig-1}`).value='Total';
    sheet.getCell(`C${valor_columna_sig-1}`).value='EEASA';
    sheet.getCell(`D${valor_columna_sig-1}`).value='Compras públicas';
    


    //Insertar los detalles de cada resolución y el total contratado
    for (let index = 0; index < detaila_val_total.length; index++) {
      const col = 'A';
      const col_val = 'B';
      const col_val_EEASA='C';
      const col_val_CA='D';

      const indice = valor_columna_sig + index;
      const cell = col + indice;
      const cell_val = col_val + indice;
      const cell_val_EEASA=col_val_EEASA+indice;
      const cell_val_CA=col_val_CA+indice;

      const detailCell = sheet.getCell(cell);
      const detailValTotal = sheet.getCell(cell_val);
      const detailValEEASA=sheet.getCell(cell_val_EEASA);
      const detailValCA=sheet.getCell(cell_val_CA);

      detailCell.value = detaila_val_total[index].detalle;
      detailValTotal.value = detaila_val_total[index].cantidad;
      detailValEEASA.value = detail_val_EEASA[index].cantidad;
      detailValCA.value=detail_val_CA[index].cantidad;
    }

    //Insertar todos los valores
    for (let index = 0; index < rowsToInsert!.length; index++) {
      const itemData = comprasPublicas[index];
      const row = rowsToInsert![index];
      row.values = [
        index+1,
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
        itemData.apellidos_NOMBRES
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

    //Agregar detalle del reporte
    sheet.getCell('C2').value='REPORTE PROCESO DE COMPRAS PÚBLICAS';
    sheet.getCell('C3').value='PROCESO';
    sheet.getCell('C4').value='DEPARTAMENTO';
    sheet.getCell('C5').value='DESDE';
    sheet.getCell('C6').value='HASTA';

    sheet.getCell('D3').value=proceso;
    sheet.getCell('D4').value=departamento;
    sheet.getCell('D5').value=fromDate;
    sheet.getCell('D6').value=toDate;

    sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        cell.alignment = {
          wrapText: true,
          vertical: 'top',
        };
      });
    });

  }
}
