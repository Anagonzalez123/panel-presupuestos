import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";



const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
