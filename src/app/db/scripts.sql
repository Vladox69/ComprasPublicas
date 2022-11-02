/*
*Espacio de tablas eeasa
*/
CREATE TABLESPACE EEASA DATAFILE 'eeasa.dbf' SIZE 10G;

/*
*Usuario liquidaciones
*/
CREATE USER LIQUIDACIONES IDENTIFIED BY System2013;
GRANT CONNECT TO LIQUIDACIONES;
GRANT UNLIMITED TABLESPACE TO LIQUIDACIONES;
GRANT CREATE VIEW TO LIQUIDACIONES;
GRANT RESOURCE TO LIQUIDACIONES;

/*
*Usuario SGC
*/
CREATE USER SGC IDENTIFIED BY System2013;
GRANT CONNECT TO SGC;
GRANT UNLIMITED TABLESPACE TO SGC;
GRANT CREATE VIEW TO SGC;
GRANT RESOURCE TO SGC;

/*
*Usuario CONTRATISTA
*/
CREATE USER CONTRATISTA IDENTIFIED BY intranet2019_;
GRANT CONNECT TO CONTRATISTA;
GRANT UNLIMITED TABLESPACE TO CONTRATISTA;
GRANT CREATE VIEW TO CONTRATISTA;
GRANT RESOURCE TO CONTRATISTA;

/*
Crear vista
*/

create or replace view VISTAPROCESOS as
select  rownum as ID, A.INTRP_FECHA_PUBLICACION,B.INTPRO_DESCRIPCION,B.INTPRO_ABREV,A.INTRP_NUMEROPROCESO,A.INTRP_CODIGOPROCESO,A.INTRP_DETALLE,
        D.INTRES_DETALLE,A.INTRP_NUMOFICIO,A.INTRP_NUMCONTRATO,A.INTRP_VALORCONT,
        C.MA_CONT_RAZON_SOCIAL,E.CONTRAF_NUMERO_CONTRATO,E.CONTRAF_VALOR_CONTRATO,F.INTDEP_CODIGO,F.INTDEP_DESCRIPCION,A.INTRP_ANIO,EM.APELLIDOS_NOMBRES
 from
 INTRANET_RESULPROCESO A
 LEFT JOIN CONTRATISTAS C
 ON A.MA_CONT_COD = C.MA_CONT_COD
 JOIN INTRANET_PROCESO B
 ON A.INTPR_CODIGO =  B.INTPR_CODIGO
 LEFT JOIN INTRANET_RESOLUCION D
 ON A.INTRES_CODIGO = D.INTRES_CODIGO
 LEFT JOIN LIQUIDACIONES.DISCON_CONT_CONTRATOF E
 ON A.INTRP_CODIGO = E.INTRP_CODIGO
 LEFT JOIN INTRANET_DEPARTAMENTO F
 on F.INTDEP_CODIGO = E.DEPAR_ID
 LEFT JOIN EMPLEADOS EM
 ON A.DMPER_CODIGO = EM.DMPER_CODIGO