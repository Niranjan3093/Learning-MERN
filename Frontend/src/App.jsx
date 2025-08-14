import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectPaymentType from "./pages/SelectPaymentType";
import Khalti from "./pages/Khalti";
import PaymentSuccess from "./pages/PaymentSuccess";
import RegisterForm from "./pages/RegisterForm.jsx";
import ProductList from "./pages/Products.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/LoginForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SelectPaymentType />} />
        <Route path="/khalti" element={<Khalti />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
