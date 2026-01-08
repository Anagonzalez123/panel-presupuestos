import { AppBar, Toolbar, Typography } from "@mui/material";

const Topbar = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "#ffffff", color: "#000" }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Panel de Gestion
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
