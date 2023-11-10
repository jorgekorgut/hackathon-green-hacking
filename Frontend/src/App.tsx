import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Calculator from "./pages/Calculator";
import { References } from "./pages/References";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<Home />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="references" element={<References />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}