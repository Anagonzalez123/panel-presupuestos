import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
}  from "@mui/material";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const RUBROS = ["Carpintería", "Electricidad", "Servicios", "Diseño", "Otro"];

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(Number(valor));

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    rubro: "",
    cliente: "",
    descripcion: "",
    total: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  /* =========================
       Cargar solicitudes
  ========================== */
  useEffect(() => {
    const data = localStorage.getItem("solicitudes");
    setSolicitudes(data ? JSON.parse(data) : []);
  }, []);

  /* =========================
       Guardar solicitudes
  ========================== */
  const guardarSolicitudes = (data) => {
    setSolicitudes(data);
    localStorage.setItem("solicitudes", JSON.stringify(data));
  };

  /* =========================
       Handlers modal presupuesto
  ========================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const abrirPresupuesto = (solicitud, index) => {
    setEditIndex(index);
    setForm({
      rubro: "",
      cliente: solicitud.nombre,
      descripcion: solicitud.detalle,
      total: ""
    });
    setOpen(true);
  };

  const guardarPresupuesto = () => {
    if (!form.rubro || !form.cliente || !form.total) {
      alert("Completá rubro y total");
      return;
    }

    const presupuestosGuardados =
      JSON.parse(localStorage.getItem("presupuestos")) || [];

    localStorage.setItem(
      "presupuestos",
      JSON.stringify([...presupuestosGuardados, { ...form, fecha: new Date().toISOString() }])
    );

    // Marcar solicitud como procesada
    const solicitudesActualizadas = [...solicitudes];
    if (editIndex !== null) solicitudesActualizadas[editIndex].estado = "Procesada";
    guardarSolicitudes(solicitudesActualizadas);

    setOpen(false);
    alert("Presupuesto creado correctamente");
  };

  const exportarPDF = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("PRESUPUESTO", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date(p.fecha).toLocaleDateString("es-AR")}`, 14, 35);
    doc.text(`Rubro: ${p.rubro}`, 14, 42);
    doc.text(`Cliente: ${p.cliente}`, 14, 49);

    doc.setFontSize(12);
    doc.text("Detalle del servicio:", 14, 60);
    const descripcionLines = doc.splitTextToSize(p.descripcion, 180);
    doc.text(descripcionLines, 14, 68);

    doc.setFontSize(12);
    doc.text(`Total: ${formatoMoneda(p.total)}`, 14, 68 + descripcionLines.length * 7);

    doc.save(`Presupuesto-${p.cliente}.pdf`);
  };

  const eliminarSolicitud = (id) => {
    const filtradas = solicitudes.filter((s) => s.id !== id);
    guardarSolicitudes(filtradas);
  };

  /* =========================
       Render
  ========================== */
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Solicitudes
      </Typography>

      {solicitudes.length === 0 ? (
        <Typography color="text.secondary">
          No hay solicitudes registradas
        </Typography>
      ) : (
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell><b>Fecha</b></TableCell>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Teléfono</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Detalle</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell align="right"><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((s, index) => (
              <TableRow key={s.id}>
                <TableCell>{new Date(s.fecha).toLocaleDateString("es-AR")}</TableCell>
                <TableCell>{s.nombre}</TableCell>
                <TableCell>{s.telefono}</TableCell>
                <TableCell>{s.email || "-"}</TableCell>
                <TableCell>{s.detalle}</TableCell>
                <TableCell>{s.estado || "Nuevo"}</TableCell>
                <TableCell align="right">
                  {s.estado !== "Procesada" && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={() => abrirPresupuesto(s, index)}
                    >
                      Crear presupuesto
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => eliminarSolicitud(s.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal para crear presupuesto */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear presupuesto</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Rubro</InputLabel>
            <Select label="Rubro" name="rubro" value={form.rubro} onChange={handleChange}>
              {RUBROS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Cliente"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={guardarPresupuesto}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Solicitudes;


