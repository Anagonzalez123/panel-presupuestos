import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { text: "Dashboard", path: "/admin" },
    { text: "Presupuestos", path: "/admin/presupuestos" },
    { text: "Clientes", path: "/admin/clientes" },
    { text: "Solicitudes", path: "/admin/solicitudes" }
  ];

  return (
    <Box sx={{ width: 240, bgcolor: "#1e1e2f", color: "#fff" }}>
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              color: "#fff",
              "&.Mui-selected": { bgcolor: "#333" }
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
