import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Layout */
import Layout from "./components/Layout";

/* Pages */
import HomePublica from "./pages/HomePublica";
import FormularioPublico from "./pages/FormularioPublico";
import Dashboard from "./pages/Dashboard";
import Presupuestos from "./pages/Presupuestos";
import Clientes from "./pages/Clientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLICO */}
        <Route path="/" element={<HomePublica />} />
        <Route path="/formulario" element={<FormularioPublico />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/admin/presupuestos"
          element={
            <Layout>
              <Presupuestos />
            </Layout>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <Layout>
              <Clientes />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;




