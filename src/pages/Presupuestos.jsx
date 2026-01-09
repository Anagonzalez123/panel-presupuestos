// src/pages/Presupuestos.jsx
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";

const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(Number(valor));

const Presupuestos = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [form, setForm] = useState({
    cliente: "",
    telefono: "",
    email: "",
    detalle: "",
    total: ""
  });

  // Cargar datos de localStorage
  useEffect(() => {
    const dataPresupuestos = localStorage.getItem("presupuestos");
    setPresupuestos(dataPresupuestos ? JSON.parse(dataPresupuestos) : []);

    const dataSolicitudes = localStorage.getItem("solicitudes");
    setSolicitudes(dataSolicitudes ? JSON.parse(dataSolicitudes) : []);
  }, []);

  // Guardar presupuestos
  useEffect(() => {
    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
  }, [presupuestos]);

  // Manejo de formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Abrir modal de nuevo presupuesto
  const abrirNuevo = (solicitud = null) => {
    setEditIndex(null);
    setForm({
      cliente: solicitud?.nombre || "",
      telefono: solicitud?.telefono || "",
      email: solicitud?.email || "",
      detalle: solicitud?.detalle || "",
      total: ""
    });
    setOpen(true);
  };

  // Abrir modal para editar
  const abrirEditar = (p, index) => {
    setEditIndex(index);
    setForm({ ...p });
    setOpen(true);
  };

  // Guardar presupuesto
  const guardarPresupuesto = () => {
    if (!form.cliente || !form.detalle || !form.total) {
      alert("Completá los campos obligatorios: Cliente, Detalle y Valor");
      return;
    }

    const nuevoPresupuesto = {
      ...form,
      id: editIndex !== null ? presupuestos[editIndex].id : Date.now(),
      fecha: new Date().toISOString(),
      numero: editIndex !== null ? presupuestos[editIndex].numero : presupuestos.length + 1
    };

    if (editIndex !== null) {
      const copia = [...presupuestos];
      copia[editIndex] = nuevoPresupuesto;
      setPresupuestos(copia);
    } else {
      setPresupuestos([...presupuestos, nuevoPresupuesto]);
    }

    setOpen(false);
    setEditIndex(null);
  };

  const eliminarPresupuesto = (index) => {
    const copia = presupuestos.filter((_, i) => i !== index);
    setPresupuestos(copia);
  };

  const exportarPDF = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("PRESUPUESTO", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Número: ${p.numero}`, 14, 35);
    doc.text(`Fecha: ${new Date(p.fecha).toLocaleDateString("es-AR")}`, 14, 42);
    doc.text(`Cliente: ${p.cliente}`, 14, 49);
    doc.text(`Teléfono: ${p.telefono || "-"}`, 14, 56);
    doc.text(`Email: ${p.email || "-"}`, 14, 63);

    doc.setFontSize(12);
    doc.text("Detalle del servicio:", 14, 75);
    const descripcionLines = doc.splitTextToSize(p.detalle, 180);
    doc.setFontSize(11);
    doc.text(descripcionLines, 14, 82);

    doc.setFontSize(12);
    doc.text(`Total: ${formatoMoneda(p.total)}`, 14, 82 + descripcionLines.length * 7);

    doc.save(`Presupuesto-${p.cliente}.pdf`);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Presupuestos</Typography>
        <Button variant="contained" onClick={() => abrirNuevo()}>Nuevo presupuesto</Button>
      </Box>

      {solicitudes.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Solicitudes públicas pendientes
          </Typography>
          {solicitudes.map((s) => (
            <Box key={s.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, border: "1px solid #eee", borderRadius: 1 }}>
              <Box>
                <Typography><b>{s.nombre}</b> - {s.telefono}</Typography>
                <Typography>{s.email || "-"}</Typography>
                <Typography>{s.detalle}</Typography>
              </Box>
              <Button variant="contained" onClick={() => abrirNuevo(s)}>Crear presupuesto</Button>
            </Box>
          ))}
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        {presupuestos.length === 0 ? (
          <Typography color="text.secondary">Todavía no hay presupuestos cargados</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Número</b></TableCell>
                <TableCell><b>Fecha</b></TableCell>
                <TableCell><b>Cliente</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Detalle</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell align="right"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{p.numero}</TableCell>
                  <TableCell>{new Date(p.fecha).toLocaleDateString("es-AR")}</TableCell>
                  <TableCell>{p.cliente}</TableCell>
                  <TableCell>{p.telefono || "-"}</TableCell>
                  <TableCell>{p.email || "-"}</TableCell>
                  <TableCell>{p.detalle}</TableCell>
                  <TableCell>{formatoMoneda(p.total)}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => abrirEditar(p, index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => exportarPDF(p)}>
                      <PictureAsPdfIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => eliminarPresupuesto(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
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
            label="Teléfono"
            name="telefono"
            margin="normal"
            value={form.telefono}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Detalle del servicio"
            name="detalle"
            margin="normal"
            multiline
            rows={4}
            value={form.detalle}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Valor total"
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

export default Presupuestos;
