import api from '../config/axiosConfig';

export const getAddressByZipCode = (zipCode) => api.get(`/addresses/${zipCode}`);