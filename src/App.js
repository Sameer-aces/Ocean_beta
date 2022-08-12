import React from "react";
import Home from "./Home";
import Sheet from "./Sheet";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";
import Datasource from "./Datasource";
import "./App.css";

const App = () => {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/Sheet/:sheet" element={<Sheet />} />
          <Route exact path="/dashboard/:dashboard" element={<Dashboard />} />
          <Route path="Datasource" element={<Datasource />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
