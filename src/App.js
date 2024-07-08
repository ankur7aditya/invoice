import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase"; // Ensure to import your Firebase authentication setup
import DashBoard from "./components/DashBoard/DashBoard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/DashBoard/Home";
import Invoices from "./components/DashBoard/Invoices";
import NewInvoices from "./components/DashBoard/NewInvoices";
import Setting from "./components/DashBoard/Setting";
import InvoicesPreview from "./components/DashBoard/InvoicesPreview";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={authenticated ? <DashBoard /> : <Navigate to="/login" />}
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoicepreview" element={<InvoicesPreview />} />
          <Route path="newinvoices" element={<NewInvoices />} />
          <Route path="setting" element={<Setting />} />
        </Route>
        <Route
          path="/login"
          element={!authenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
