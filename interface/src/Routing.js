import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from "./QueryInput.js";
import {Login} from "./Login.jsx";

function Routing() {
  return (
    
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Box />} />
        <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
  );
}

export default Routing;