import { Injectable } from '@angular/core';
import { ImagePosition, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LOGO } from 'src/app/services/logo';
import { CompraPublica } from '../models/compras-publicas.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private _workbook:Workbook;

  constructor() { }

  /**
   * Método para la descarga del archivo excel
   * @param details_val - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  async dowloadExcel(details_val:number[],comprasPublicas:CompraPublica[]){
    this._workbook=new Workbook();
    await this.create_sheet(details_val,comprasPublicas);
    this._workbook.xlsx.writeBuffer().then((data)=>{
      const blob=new Blob([data])
      fs.saveAs(blob,'Compras_publicas.xlsx');
    })
  }

  /**
   * Método para crear archivo de excel
   * @param details_val - Array de cantidad de cada resolución y el total contratado
   * @param comprasPublicas - Array de compras públicas
   */
  private async create_sheet(details_val:number[],comprasPublicas:CompraPublica[]){
    //Añadir hoja
    const sheet= this._workbook.addWorksheet('Compras Públicas');

    //Cambiar el tamaño de las columnas
    sheet.getColumn("A").width=25;
    sheet.getColumn("B").width=30;
    sheet.getColumn("C").width=25;
    sheet.getColumn("D").width=25;
    sheet.getColumn("E").width=25;
    sheet.getColumn("F").width=25;
    sheet.getColumn("G").width=25;
    sheet.getColumn("H").width=25;
    sheet.getColumn("I").width=25;
    sheet.getColumn("K").width=25;
    sheet.getColumn("L").width=25;

    // Añadir imagen
    const logoId=this._workbook.addImage({
      base64:LOGO,
      extension:'png'      
    });

    const position:ImagePosition={
      tl:{col:0.15,row:0.3},
      ext:{width:700,height:229}
    }

    sheet.addImage(logoId,position);

    //Añadir encabezados
    const headerRow=sheet.getRow(14);

    const headers=[
    'FECHA DE RESOLUCIÓN',
    'DESCRIPCIÓN DE PROCESO',
    'PROCESO',
    'NÚMERO DE PROCESO',
    'CÓDIGO DE PROCESO',
    'DETALLE',
    'RESOLUCIÓN',
    'OFICIO',
    'CONTRATISTA',
    'AÑO',
    'VALOR CONTRATADO',
    'DEPARTAMENTO'
    ]

    const details=[
      'ADJUDICADOS',
      'DESIERTOS',
      'NO UTILIZADOS',
      'CANCELADOS',
      'BORRADORES',
      'VALOR TOTAL CONTRATADO'
    ]


    headerRow.values=headers;
    headerRow.font={bold:true,size:12};
    

    const rowsToInsert=sheet.getRows(15,comprasPublicas.length);
    
    const valor_columna_sig=15+comprasPublicas.length;

    //const detailRow=sheet.getRow(valor_columna_sig);
    
    //detailRow.values=details;
    //Insertar los detalles de cada resolución y el total contratado
    for(let index=0;index<details.length;index++){
      const col='A';
      const col_val='B';
      const indice=valor_columna_sig+index;
      const cell=col+indice;
      const cell_val=col_val+indice;
      const detailCell=sheet.getCell(cell);
      const detailVal=sheet.getCell(cell_val);
      detailCell.value=details[index];
      detailVal.value=details_val[index];
    }

    //Insertar todos los valores
    for(let index=0;index<rowsToInsert!.length;index++){
      const itemData=comprasPublicas[index];
      const row =rowsToInsert![index];
      row.values=[
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
        itemData.intdep_DESCRIPCION
      ];
    }
    //Dar formato de tabla y estilos al texto
    sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
      row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        cell.alignment={
          wrapText:true,
          vertical: 'top'
        }
      });
    });
  }


}
