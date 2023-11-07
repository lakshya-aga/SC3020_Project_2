import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrgChartTree from "./QepVisualization.js";
import Box from "./QueryInput.js";


function Routing() {
  return (
    
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Box />} />
        <Route path="explain" element={<OrgChartTree />} />
    </Routes>
  </BrowserRouter>
  );
}

export default Routing;