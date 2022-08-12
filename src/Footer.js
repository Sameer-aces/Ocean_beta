import React, { useContext } from "react";
import { FaCompress, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GlobalContext } from "./GlobalProvider";

import "./App.css";
const Footer = () => {
  const { sheets, setSheets, dashboards, setDashboards } =
    useContext(GlobalContext);

  const handleAddSheet = () => {
    const newSheet = { name: `sheet${sheets.length}` };
    setSheets((prev) => [...prev, newSheet]);
  };

  const handleAddDashboard = () => {
    const newDashboard = {
      name: `dashboard${dashboards.length}`,
      graphs: [0, 1, 2, 3, 4, 5],
    };
    setDashboards((prev) => [...prev, newDashboard]);
  };

  return (
    <>
      <hr></hr>
      <div className="footer">
        <button>
          <Link to="/Datasource">Data Source</Link>
        </button>
        {sheets.map((sheet, idx) => (
          <button key={idx}>
            <Link to={`/Sheet/${sheet.name}`}>{sheet.name}</Link>
          </button>
        ))}
        <button onClick={handleAddSheet}>
          <FaAngleRight />
        </button>

        {dashboards.map((dashboard, idx) => (
          <button key={idx}>
            <Link to={`/dashboard/${dashboard.name}`}>{dashboard.name}</Link>
          </button>
        ))}
        <button onClick={handleAddDashboard}>
          <FaCompress />
        </button>
      </div>
      <hr></hr>
    </>
  );
};

export default Footer;
