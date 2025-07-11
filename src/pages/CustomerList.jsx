import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CustomerTable from "../components/customer/CustomerTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const API_URL = "http://localhost:8080";

export default function CustomerList() {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const showedToast = useRef(false);

  useEffect(() => {
    if (location.state?.message && !showedToast.current) {
      toast.success(location.state.message);
      showedToast.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get(`${API_URL}/customers`);
    setCustomers(res.data);
  };

  const handleRowClick = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir o cliente?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      toast.success("Cliente excluído!");
      navigate("/customers");
    } catch (error) {
      toast.error("Erro ao excluir cliente");
      console.error(error);
    } finally {
      fetchCustomers();
    }
  };

  return (
    <div className="app-container">
      <h2>Clientes</h2>
      <Button
        variant="outlined"
        color="success"
        onClick={() => navigate("/customers/create")}
        sx={{ mb: 2 }}
      >
        Adicionar Cliente
      </Button>
      <CustomerTable
        customers={customers}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
      />
    </div>
  );
}
