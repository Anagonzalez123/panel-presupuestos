// src/pages/FormularioPublico.jsx
import { Box, Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useState } from "react";
import jsPDF from "jspdf";

/* =========================
   Utilidad moneda
========================= */
const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(Number(valor));

/* =========================
   Rubros fijos
========================= */
const RUBROS = [
  "Carpintería",
  "Electricidad",
  "Servicios",
  "Diseño",
  "Otro"
];

const FormularioPublico = () => {
  const [form, setForm] = useState({
    rubro: "",
    cliente: "",
    descripcion: "",
    total: ""
  });

  /* =========================
     Handlers
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const enviarPresupuesto = () => {
    if (!form.rubro || !form.cliente || !form.total) {
      alert("Completa los campos obligatorios");
      return;
    }

    // Guardar en localStorage para admin
    const presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];
    localStorage.setItem(
      "presupuestos",
      JSON.stringify([...presupuestos, { ...form, fecha: new Date().toISOString() }])
    );

    alert("Presupuesto enviado con éxito!");
    setForm({ rubro: "", cliente: "", descripcion: "", total: "" });
  };

  /* =========================
     Exportar a PDF
  ========================= */
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Presupuesto", 14, 20);

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-AR")}`, 14, 30);
    doc.text(`Rubro: ${form.rubro}`, 14, 38);
    doc.text(`Cliente: ${form.cliente}`, 14, 46);

    doc.autoTable({
      startY: 60,
      head: [["Detalle", "Importe"]],
      body: [[form.descripcion, formatoMoneda(form.total)]],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [25, 118, 210] }
    });

    doc.text(`Total: ${formatoMoneda(form.total)}`, 14, doc.lastAutoTable.finalY + 15);
    doc.save(`presupuesto-${form.cliente}.pdf`);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Solicitar Presupuesto
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Rubro</InputLabel>
        <Select name="rubro" value={form.rubro} onChange={handleChange}>
          {RUBROS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Nombre del cliente"
        name="cliente"
        margin="normal"
        value={form.cliente}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Detalle del servicio"
        name="descripcion"
        margin="normal"
        value={form.descripcion}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Importe estimado"
        name="total"
        type="number"
        margin="normal"
        value={form.total}
        onChange={handleChange}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" onClick={enviarPresupuesto}>
          Enviar
        </Button>
        <Button variant="outlined" onClick={exportarPDF}>
          Descargar PDF
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioPublico;

