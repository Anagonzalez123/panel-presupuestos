import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const HomePublica = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" fontWeight="bold" mb={2}>
        Sistema de Presupuestos
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Gestioná clientes, presupuestos y solicitudes desde un solo lugar
      </Typography>

      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/formulario"
      >
        Solicitar presupuesto
      </Button>
    </Box>
  );
};

export default HomePublica;
