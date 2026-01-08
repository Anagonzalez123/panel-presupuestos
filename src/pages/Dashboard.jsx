import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/* =========================
   Utilidad moneda
========================= */
const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(valor);

/* =========================
   Agrupar por mes
========================= */
const agruparPorMes = (presupuestos) => {
  const mapa = {};

  presupuestos.forEach((p) => {
    const fecha = new Date(p.fecha);
    const clave = fecha.toLocaleDateString("es-AR", {
      month: "short",
      year: "numeric"
    });

    mapa[clave] = (mapa[clave] || 0) + Number(p.total);
  });

  return Object.keys(mapa).map((mes) => ({
    mes,
    total: mapa[mes]
  }));
};

const Dashboard = () => {
  const [presupuestos, setPresupuestos] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("presupuestos");
    setPresupuestos(data ? JSON.parse(data) : []);
  }, []);

  /* =========================
     Cálculos
  ========================= */
  const totalFacturado = presupuestos.reduce(
    (acc, p) => acc + Number(p.total),
    0
  );

  const cantidad = presupuestos.length;
  const promedio = cantidad > 0 ? totalFacturado / cantidad : 0;

  const datosMensuales = agruparPorMes(presupuestos);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Panel de Gestión
      </Typography>

      {/* =========================
          Cards
      ========================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 2,
          mb: 4
        }}
      >
        <Paper sx={{ p: 3, bgcolor: "#e3f2fd", borderLeft: "6px solid #1976d2" }}>
          <Typography color="text.secondary">Total facturado</Typography>
          <Typography variant="h5" fontWeight="bold" color="#1976d2">
            {formatoMoneda(totalFacturado)}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, bgcolor: "#f3e5f5", borderLeft: "6px solid #7b1fa2" }}>
          <Typography color="text.secondary">Presupuestos</Typography>
          <Typography variant="h5" fontWeight="bold" color="#7b1fa2">
            {cantidad}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, bgcolor: "#e8f5e9", borderLeft: "6px solid #2e7d32" }}>
          <Typography color="text.secondary">Promedio</Typography>
          <Typography variant="h5" fontWeight="bold" color="#2e7d32">
            {formatoMoneda(promedio)}
          </Typography>
        </Paper>
      </Box>

      {/* =========================
          Gráfico mensual
      ========================= */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Ingresos por mes
        </Typography>

        {datosMensuales.length === 0 ? (
          <Typography color="text.secondary">
            No hay datos para mostrar
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={datosMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />

              {/* Tooltip prolijo */}
              <Tooltip
                formatter={(value) => formatoMoneda(value)}
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                }}
              />

              <Bar
                dataKey="total"
                fill="#1976d2"
                radius={[6, 6, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;


