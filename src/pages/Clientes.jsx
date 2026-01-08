// src/pages/Clientes.jsx
import { Box, Typography, Paper, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });

  /* =========================
     Cargar clientes
  ========================= */
  useEffect(() => {
    const data = localStorage.getItem("clientes");
    setClientes(data ? JSON.parse(data) : []);
  }, []);

  /* =========================
     Guardar clientes
  ========================= */
  const guardarClientes = (data) => {
    setClientes(data);
    localStorage.setItem("clientes", JSON.stringify(data));
  };

  /* =========================
     Agregar cliente
  ========================= */
  const agregarCliente = () => {
    if (!nuevo.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const cliente = {
      id: Date.now(),
      nombre: nuevo.nombre.trim(),
      telefono: nuevo.telefono.trim(),
      email: nuevo.email.trim(),
      fechaAlta: new Date().toISOString(),
    };

    guardarClientes([...clientes, cliente]);
    setNuevo({ nombre: "", telefono: "", email: "" });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Clientes
      </Typography>

      {/* =========================
          Nuevo cliente
      ========================= */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography fontWeight="bold" mb={2}>
          Nuevo cliente
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Nombre"
            value={nuevo.nombre}
            onChange={(e) =>
              setNuevo({ ...nuevo, nombre: e.target.value })
            }
          />
          <TextField
            label="Teléfono"
            value={nuevo.telefono}
            onChange={(e) =>
              setNuevo({ ...nuevo, telefono: e.target.value })
            }
          />
          <TextField
            label="Email"
            value={nuevo.email}
            onChange={(e) =>
              setNuevo({ ...nuevo, email: e.target.value })
            }
          />
        </Box>

        <Button sx={{ mt: 2 }} variant="contained" onClick={agregarCliente}>
          Guardar cliente
        </Button>
      </Paper>

      {/* =========================
          Lista clientes
      ========================= */}
      <Paper sx={{ p: 3 }}>
        <Typography fontWeight="bold" mb={2}>
          Clientes registrados
        </Typography>

        {clientes.length === 0 ? (
          <Typography color="text.secondary">
            No hay clientes registrados
          </Typography>
        ) : (
          clientes.map((c) => (
            <Box
              key={c.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #eee",
                py: 1,
              }}
            >
              <Box>
                <Typography fontWeight="bold">{c.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.email || "Sin email"} · {c.telefono || "Sin teléfono"}
                </Typography>
              </Box>

              <Button variant="outlined" size="small">
                Ver historial
              </Button>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default Clientes;

