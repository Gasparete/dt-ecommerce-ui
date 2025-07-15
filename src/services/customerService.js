import * as customerApi from "../api/customerApi";

export const getCustomers = async () => (await customerApi.getCustomers()).data;

export const getCustomerById = async (id) => (await customerApi.getCustomerById(id)).data;

export const deleteCustomer = (id) => customerApi.deleteCustomer(id);

export const saveCustomer = async (customer) => {
  const isNew = !customer.id;

  const response = isNew
    ? await customerApi.createCustomer(customer)
    : await customerApi.updateCustomer(customer.id, customer);

  return {
    customer: response.data,
    isNew,
  };
}