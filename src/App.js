import React from "react";
import { BrowserRouter as Router,Navigate, Routes,Route } from "react-router-dom";
import DashBoard from "./components/DashBoard/DashBoard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
    </Router>
  );
};

export default App;
