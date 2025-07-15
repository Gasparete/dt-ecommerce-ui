import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextField, Stack, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ZipCodeMaskedInput from "../components/maskedInputs/ZipCodeMaskedInput";
import CpfMaskedInput from "../components/maskedInputs/CpfMaskedInput";
import { getCustomerById, saveCustomer } from "../services/customerService";
import { getAddressByZipCode } from "../services/addressService";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [cepError, setCepError] = useState(false);

  const goToCustomers = () => {
    navigate("/customers");
  };

  const fetchAddress = useCallback(async (zipCode) => {
    setLoadingAddress(true);
    setCepError(false);
    try {
      const address = await getAddressByZipCode(zipCode);
      setStreet(address.street || "");
      setNeighborhood(address.neighborhood || "");
      setCity(address.city || "");
      setStateUf(address.state || "");
    } catch (err) {
      setStreet("");
      setNeighborhood("");
      setCity("");
      setStateUf("");
      setCepError(true);
      toast.error("CEP inválido ou não encontrado");
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = {
      id,
      person: { name, cpf },
      email,
      address: {
        zipCode,
        street,
        neighborhood,
        city,
        state: stateUf,
      },
    };
    try {
      const { isNew } = await saveCustomer(customer);
      toast.success(
        isNew
          ? "Cliente cadastrado!"
          : "Dados atualizados!"
      );
      goToCustomers();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      name.trim() !== "" &&
      cpf.trim().length === 11 &&
      email.trim() !== "" &&
      zipCode.trim().length === 8 &&
      street.trim() !== "" &&
      neighborhood.trim() !== "" &&
      city.trim() !== "" &&
      stateUf.trim() !== "" &&
      !cepError &&
      !loadingAddress
    );
  }, [
    name,
    cpf,
    email,
    zipCode,
    street,
    neighborhood,
    city,
    stateUf,
    cepError,
    loadingAddress,
  ]);

  useEffect(() => {
    if (id) {
      getCustomerById(id)
        .then((customer) => {
          setName(customer.person.name);
          setCpf(customer.person.cpf);
          setEmail(customer.email);
          setZipCode(customer.address.zipCode);
          setStreet(customer.address.street);
          setNeighborhood(customer.address.neighborhood);
          setCity(customer.address.city);
          setStateUf(customer.address.state);
        })
        .catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (zipCode.length === 8) {
      fetchAddress(zipCode);
    }
  }, [zipCode, fetchAddress]);

  return (
    <div>
      <h2>{isNew ? "Cadastrar Cliente" : "Editar Cliente"}</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
          <TextField
            name="name"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="CPF"
            name="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
            slotProps={{
              input: {
                inputComponent: CpfMaskedInput,
              },
            }}
          />
          <TextField
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
        <Stack spacing={2} direction="row" sx={{ mb: 2, alignItems: "center" }}>
          <TextField
            label="CEP"
            name="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
            slotProps={{
              input: {
                inputComponent: ZipCodeMaskedInput,
              },
            }}
            error={cepError}
            helperText={cepError ? "CEP inválido" : ""}
          />
          {loadingAddress && <CircularProgress />}
        </Stack>
        <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
          <TextField
            disabled
            placeholder="Rua"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <TextField
            disabled
            placeholder="Bairro"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
          <TextField
            disabled
            placeholder="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            disabled
            placeholder="Estado"
            value={stateUf}
            onChange={(e) => setStateUf(e.target.value)}
          />
        </Stack>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            type="submit"
            disabled={!isFormValid}
            startIcon={<SaveIcon />}
          >
            Salvar
          </Button>
          <Button variant="outlined" color="error" onClick={goToCustomers}>
            Cancelar
          </Button>
        </Stack>
      </form>
    </div>
  );
}
