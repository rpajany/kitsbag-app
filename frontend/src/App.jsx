import { ToastContainer } from "react-toastify";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} closeOnClick />
      <AllRoutes />
    </>
  );
}

export default App;
