import CustomerForm from "../pages/CustomerForm";
import CustomerList from "../pages/CustomerList";

const routes = [
  {
    path: "/",
    element: <CustomerList />
  },
  {
    path: "/customers",
    element: <CustomerList />,
  },
  {
    path: "/customers/:id",
    element: <CustomerForm />,
  },
  {
    path: "/customers/create",
    element: <CustomerForm />,
  },
];

export default routes;
