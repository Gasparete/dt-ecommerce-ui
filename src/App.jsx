import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>

        <ToastContainer position="top-center" autoClose={1000} />
    </Router>
  );
}

export default App;