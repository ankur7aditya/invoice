import React from "react";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import DashBoard from "./components/DashBoard/DashBoard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/DashBoard/Home";
import Invoices from "./components/DashBoard/Invoices";
import NewInvoices from "./components/DashBoard/NewInvoices";
import Setting from "./components/DashBoard/Setting";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} >
            <Route path = "" element={<Home/>}/>
            <Route path = "home" element={<Home/>}/>
            <Route path="invoices" element={<Invoices/>}/>
            <Route path="newinvoices" element={<NewInvoices/>}/>
            <Route path="setting" element={<Setting/>}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="*" element={<Navigate to="/login"/>} /> */}
        </Routes>
    </Router>
  );
};

export default App;
