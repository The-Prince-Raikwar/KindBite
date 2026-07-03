/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./components/PlaceOrder.jsx";
import About from "./pages/About.jsx";
import Service from "./pages/Service.jsx";
import Verify from "./pages/Verify.jsx";
import Orders from "./pages/Orders.jsx";
import Password from "./pages/Password.jsx";

import { AuthContext } from "./context/AuthContext.jsx";

const App = () => {
  const [showLogIn, setshowLogIn] = useState(false);
  const { token } = useContext(AuthContext);
  const location = useLocation(); // ✅ important

  return (
    <>
      {/* LOGIN MODAL */}
      {showLogIn && <Login setshowLogIn={setshowLogIn} />}

      {/* NAVBAR */}
      {!token ? "" : <Navbar />}

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={showLogIn ? <></> : <Home setshowLogIn={setshowLogIn} />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/forgot" element={<Password />} />
      </Routes>

      {/* ✅ FOOTER FIX */}
      {!showLogIn && location.pathname !== "/forgot" && <Footer />}
    </>
  );
};

export default App;