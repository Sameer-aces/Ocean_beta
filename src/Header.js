import React, { useContext } from "react";
import { GlobalContext } from "./GlobalProvider";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { useNavigate, useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Header = () => {
  const sheetParam = useParams().sheet;
  const dashboardParam = useParams().dashboard;

  const {
    columns,
    setColumns,
    dashboards,
    setDashboards,
    sheets,
    setSheets,
    workbook,
    setWorkbook,
    selectedSheet,
    setSelectedSheet,
    csvArray,
    setCsvArray,
  } = useContext(GlobalContext);

  let navigate = useNavigate();
  function fileInput(e) {
    if (e.target.value === "Exit") {
      console.log("exit");
      navigate("/", { replace: true });
    }
    if (e.target.value === "New") {
      console.log("new");
    }
    if (e.target.value === "Save") {
      console.log("save");
      let obj = {};
      let allSheetsData = workbook;
      console.log(workbook);
      obj["sheetParam"] = sheetParam;
      obj["dashboardParam"] = dashboardParam;
      obj["columns"] = columns;
      obj["allworksheetData"] = allSheetsData;
      obj["globalData"] = sheets;
      obj["dashboards"] = dashboards;
      obj["realdata"] = csvArray;
      let content = JSON.stringify(obj);
      let blob = new Blob([content], { type: "application/json" });
      console.log(blob);
      saveAs(blob, "File.owbx");
    }
  }
  return (
    <>
      {/* <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </DropdownButton> */}
      <div className="First-line">
        <select onClick={fileInput}>
          <option type="file">Files</option>

          <option>Open</option>
          <option>Save</option>
          <option>Exit</option>
        </select>
        <select>
          <option>Data</option>
          <option>@</option>
        </select>
        <select>
          <option>WorkSheet</option>
          <option>@</option>
        </select>
        <select>
          <option>Dashboard</option>
          <option>@</option>
        </select>
      </div>
      <hr></hr>
    </>
  );
};
export default Header;
