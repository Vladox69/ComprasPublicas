import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Método para exportar a pdf la tabla, detalle de las resoluciones y el total contratado
   * @param tableId - string donde se envia el id de la tabla a exportar
   * @param detalleId - string donde se envia el id del detalle de las resoluciones y el total contratado a exportar 
   * @param name 
   */
   exportToPdf(tableId: string,detalleId:string, name?: string) {
    let printContents, popupWin,printDetail;
   printContents = document.getElementById(tableId).innerHTML;
   printDetail=document.getElementById(detalleId).innerHTML;
   popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
   popupWin.document.open();
   popupWin.document.write(`
 <html>
   <head>
     <title>Reportes</title>
   </head>
<body
onload="window.print();window.close()">
<h1 style="text-align: center;">PROCESO COMPRAS PORTAL</h1>
<table class="table table-dark" style="border: blue;">${printContents}</table>
<div>
${printDetail}
</div>
</body>
<style type="text/css">
h1{
color: black;
font-family: Arial, Helvetica, sans-serif;
margin-left: 10px;
}
table,th,td{
 border-collapse: collapse;
 border: 1px solid black;
 font-size:10px;
}
</style>
 </html>`
   );
   popupWin.document.close();
 }
}
