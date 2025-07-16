import api from "../api/api";

export const getAddressByZipCode = async (zipCode) =>
  (await api.get(`/addresses/${zipCode}`).data);