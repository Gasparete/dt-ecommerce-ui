import api from "../api/api";

export const getCustomers = async () => (await api.get('/customers')).data;

export const getCustomerById = async (id) => (await api.get(`/customers/${id}`)).data;

export const deleteCustomer = async (id) => await api.delete(`/customers/${id}`);

export const saveCustomer = async (customer) => {
  const isNew = !customer.id;

  const response = isNew
    ? await api.post('/customers', customer)
    : await api.put(`/customers/${customer.id}`, customer);

  return {
    customer: response.data,
    isNew,
  };
}