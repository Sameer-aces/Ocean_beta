import React, { createContext, useState, useParams } from "react";

const initailSheets = [{ name: "sheet" }];
const initailDashboards = [{ name: "dashboard", graphs: [0, 1, 2, 3, 4, 5] }];

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const [sheets, setSheets] = useState(initailSheets);
  const [dashboards, setDashboards] = useState(initailDashboards);

  const [csvArray, setCsvArray] = useState([]);
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState();
  const [workbook, setWorkbook] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        csvArray,
        setCsvArray,
        sheets,
        setSheets,
        dashboards,
        setDashboards,
        fileName,
        setFileName,
        columns,
        setColumns,
        fileNames,
        setFileNames,
        selectedSheet,
        setSelectedSheet,
        workbook,
        setWorkbook,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
