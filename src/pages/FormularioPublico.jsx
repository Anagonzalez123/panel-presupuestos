// src/pages/FormularioPublico.jsx
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

const FormularioPublico = () => {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    detalle: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviarSolicitud = () => {
    if (!form.nombre || !form.telefono || !form.detalle) {
      alert("Completá los campos obligatorios");
      return;
    }

    const nuevaSolicitud = {
      id: Date.now(),
      ...form,
      fecha: new Date().toISOString(),
      estado: "Nuevo"
    };

    const solicitudesGuardadas =
      JSON.parse(localStorage.getItem("solicitudes")) || [];

    localStorage.setItem(
      "solicitudes",
      JSON.stringify([...solicitudesGuardadas, nuevaSolicitud])
    );

    alert("Solicitud enviada correctamente");

    setForm({
      nombre: "",
      telefono: "",
      email: "",
      detalle: ""
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Solicitar presupuesto
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Completá el formulario y nos pondremos en contacto.
        </Typography>

        <TextField
          label="Nombre y apellido"
          name="nombre"
          fullWidth
          required
          value={form.nombre}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Teléfono / WhatsApp"
          name="telefono"
          fullWidth
          required
          value={form.telefono}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Email (opcional)"
          name="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Detalle del servicio"
          name="detalle"
          fullWidth
          required
          multiline
          rows={4}
          value={form.detalle}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={enviarSolicitud}
        >
          Solicitar presupuesto
        </Button>
      </Paper>
    </Box>
  );
};

export default FormularioPublico;


