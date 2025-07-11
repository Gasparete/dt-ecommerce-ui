import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, TextField, Stack, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ZipCodeMaskedInput from "../components/maskedInputs/ZipCodeMaskedInput";
import CpfMaskedInput from "../components/maskedInputs/CpfMaskedInput";

const API_URL = "http://localhost:8080";

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreating = !id;

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

  const fetchAddress = useCallback(async (zip) => {
    setLoadingAddress(true);
    setCepError(false);

    try {
      const res = await axios.get(`${API_URL}/addresses/${zip}`);
      const data = res.data;
      setStreet(data.street || "");
      setNeighborhood(data.neighborhood || "");
      setCity(data.city || "");
      setStateUf(data.state || "");
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

  useEffect(() => {
    if (zipCode.length === 8) {
      fetchAddress(zipCode);
    }
  }, [zipCode, fetchAddress]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/customers/${id}`)
        .then((res) => {
          const c = res.data;
          setName(c.person.name);
          setCpf(c.person.cpf);
          setEmail(c.email);
          setZipCode(c.address.zipCode);
          setStreet(c.address.street || "");
          setNeighborhood(c.address.neighborhood || "");
          setCity(c.address.city || "");
          setStateUf(c.address.state || "");
        })
        .catch(console.error);
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanZipCode = zipCode.replace(/\D/g, "");
    if (
      cleanZipCode.length !== 8 ||
      !street ||
      !neighborhood ||
      !city ||
      !stateUf ||
      cepError
    ) {
      toast.error("Por favor, preencha um CEP válido antes de salvar.");
      return;
    }

    const customer = {
      person: { name, cpf },
      email,
      address: {
        zipCode: cleanZipCode,
        street,
        neighborhood,
        city,
        state: stateUf,
      },
    };

    try {
      if (isCreating) {
        await axios.post(`${API_URL}/customers`, customer);
        navigate("/customers", { state: { message: "Cliente cadastrado!" } });
      } else {
        await axios.put(`${API_URL}/customers/${id}`, customer);
        navigate("/customers", { state: { message: "Dados atualizados!" } });
      }
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
    }
  };

  return (
    <div className="app-container">
      <h2>{isCreating ? "Novo Cliente" : "Editar Cliente"}</h2>
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
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/customers")}
          >
            Cancelar
          </Button>
        </Stack>
      </form>
    </div>
  );
}
