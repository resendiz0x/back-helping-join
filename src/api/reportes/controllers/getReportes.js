import useConnection from "../../../database";

export const getReportes = async (req, res) => {
  const response = {
    success: false,
    message: "No se pudo obtener los reportes",
    data: []
  }

  try {
    const query = `
    select 
      r.*, 
      COUNT(*) as reportes, 
      e.nombre AS evento_nombre,
      e.id_beneficiado AS id_beneficiado,
      (select evento_eliminados from beneficiado where id_beneficiado = e.id_beneficiado) as eventos_eliminados
    from reporte r 
    inner join evento e on r.id_evento = e.id_evento
    where estatus = 'pendiente' 
    group by id_evento
    order by reportes desc;`;

    const connection = await useConnection();

    const result = await connection.query(query);

    await connection.end();
    response.success = true;
    response.message = "Reportes obtenidos";
    response.data = result[0];
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    response.success = false;
    response.message = error.message;
    response.data = [];
    return res.status(500).json(response);
  }
}