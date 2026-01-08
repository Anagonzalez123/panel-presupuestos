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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton
} from "@mui/material";
import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
const RUBROS = ["Carpintería", "Electricidad", "Servicios", "Diseño", "Otro"];

const Presupuestos = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [presupuestos, setPresupuestos] = useState(() => {
    const data = localStorage.getItem("presupuestos");
    return data ? JSON.parse(data) : [];
  });

  const [form, setForm] = useState({
    rubro: "",
    cliente: "",
    descripcion: "",
    total: ""
  });

  /* =========================
     Persistencia
  ========================== */
  useEffect(() => {
    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
  }, [presupuestos]);

  /* =========================
     Handlers
  ========================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const abrirNuevo = () => {
    setEditIndex(null);
    setForm({ rubro: "", cliente: "", descripcion: "", total: "" });
    setOpen(true);
  };

  const abrirEditar = (p, index) => {
    setEditIndex(index);
    setForm({ rubro: p.rubro, cliente: p.cliente, descripcion: p.descripcion, total: p.total });
    setOpen(true);
  };

  const guardarPresupuesto = () => {
    if (!form.rubro || !form.cliente || !form.total) return;

    if (editIndex !== null) {
      const copia = [...presupuestos];
      copia[editIndex] = { ...copia[editIndex], ...form };
      setPresupuestos(copia);
    } else {
      setPresupuestos([...presupuestos, { ...form, fecha: new Date().toISOString() }]);
    }

    setOpen(false);
    setEditIndex(null);
  };

  const eliminarPresupuesto = (index) => {
    setPresupuestos(presupuestos.filter((_, i) => i !== index));
  };

  /* =========================
     EXPORTAR PDF (jsPDF puro)
  ========================== */
  const exportarPDF = (p) => {
    const doc = new jsPDF();

    // Logo (opcional, genérico)
    // Si tenés una imagen, podés poner: doc.addImage(logoDataUrl, "PNG", x, y, width, height);
    doc.setFontSize(20);
    doc.text("PRESUPUESTO", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date(p.fecha).toLocaleDateString("es-AR")}`, 14, 35);
    doc.text(`Rubro: ${p.rubro}`, 14, 42);
    doc.text(`Cliente: ${p.cliente}`, 14, 49);

    // Tabla simple
    doc.setFontSize(12);
    doc.text("Detalle del servicio:", 14, 60);
    doc.setFontSize(11);
    const descripcionLines = doc.splitTextToSize(p.descripcion, 180);
    doc.text(descripcionLines, 14, 68);

    // Total
    doc.setFontSize(12);
    doc.text(`Total: ${formatoMoneda(p.total)}`, 14, 68 + descripcionLines.length * 7);

    // Guardar PDF
    doc.save(`Presupuesto-${p.cliente}.pdf`);
  };

  /* =========================
     Render
  ========================== */
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Presupuestos</Typography>
        <Button variant="contained" onClick={abrirNuevo}>Nuevo presupuesto</Button>
      </Box>

      {/* Tabla */}
      <Paper sx={{ p: 3 }}>
        {presupuestos.length === 0 ? (
          <Typography color="text.secondary">Todavía no hay presupuestos cargados</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Fecha</b></TableCell>
                <TableCell><b>Rubro</b></TableCell>
                <TableCell><b>Cliente</b></TableCell>
                <TableCell><b>Detalle</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell align="right"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(p.fecha).toLocaleDateString("es-AR")}</TableCell>
                  <TableCell>{p.rubro}</TableCell>
                  <TableCell>{p.cliente}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
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

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Rubro</InputLabel>
            <Select label="Rubro" name="rubro" value={form.rubro} onChange={handleChange}>
              {RUBROS.map((rubro) => <MenuItem key={rubro} value={rubro}>{rubro}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField fullWidth label="Cliente" name="cliente" margin="normal" value={form.cliente} onChange={handleChange} />
          <TextField fullWidth label="Detalle del servicio" name="descripcion" margin="normal" value={form.descripcion} onChange={handleChange} />
          <TextField fullWidth label="Importe estimado" name="total" type="number" margin="normal" value={form.total} onChange={handleChange} />
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
