import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerList from "./pages/CustomerList";
import CustomerFormPage from "./pages/CustomerFormPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/customers" />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/create" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerFormPage />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={1000} />
    </Router>
  );
}