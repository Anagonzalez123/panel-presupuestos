import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Presupuestos from "./pages/Presupuestos";
import FormularioPublico from "./pages/FormularioPublico";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/formulario" element={<FormularioPublico />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


