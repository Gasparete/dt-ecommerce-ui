import { useEffect, useState } from "react";
import CustomerTable from "../components/customer/CustomerTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, CircularProgress } from "@mui/material";
import { getCustomers, deleteCustomer } from "../services/customerService";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const goToCreateCustomer = () => {
    navigate(`/customers/create`);
  };

  const handleRowClick = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir o cliente?"
    );
    if (!confirmDelete) return;
    setLoading(true);
    try {
      await deleteCustomer(id);
      toast.success("Cliente excluído!");
       setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      toast.error("Erro ao excluir cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      setCustomers(await getCustomers());
    } catch (error) {
      toast.error("Erro ao carregar clientes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="app-container">
      <h2>Clientes</h2>
      <Button
        variant="outlined"
        color="success"
        onClick={goToCreateCustomer}
        sx={{ mb: 2 }}
        disabled={loading}
      >
        Adicionar Cliente
      </Button>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", minHeight: 300 }}
        >
          <CircularProgress />
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}