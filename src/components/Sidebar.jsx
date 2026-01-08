import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 240, bgcolor: "#1f3a5f"
          , color: "#fff" }}>
      <List>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/presupuestos")}>
          <ListItemText primary="Presupuestos" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/clientes")}>
          <ListItemText primary="Clientes" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;

