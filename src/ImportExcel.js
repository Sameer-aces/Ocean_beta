import React, { useContext } from "react";
import { Row, Col, Label } from "reactstrap";
import { pickBy, keys, max } from "lodash";
import * as XLSX from "xlsx";
import { FaTrash } from "react-icons/fa";

import { GlobalContext } from "./GlobalProvider";
import "./App.css";

function getDataRange(data) {
  const dataWithValues = pickBy(data, (value, key) => !!value.v);
  const cellNamesWithValues = keys(dataWithValues);
  const cellsWithValues = cellNamesWithValues.map((cell) =>
    XLSX.utils.decode_cell(cell)
  );
  const maxRow = max(cellsWithValues.map((cell) => cell.r));
  const maxColumn = max(cellsWithValues.map((cell) => cell.c));
  const lastCellName = XLSX.utils.encode_cell({ c: maxColumn, r: maxRow });
  return `A1:${lastCellName}`;
}

const ImportExcel = (props) => {
  const { fileName, setFileName, setWorkbook, setSelectedSheet } =
    useContext(GlobalContext);

  const acceptableFileName = ["xlsx", "xls", "csv"];

  const isFileSupported = (name) => {
    return acceptableFileName.includes(name.split(".").pop().toLowerCase());
  };

  const readDataFromExcel = (data) => {
    const wb = XLSX.read(data);
    var mySheetData = {};
    //Loop throught the sheets
    for (var i = 0; i < wb.SheetNames.length; i++) {
      let sheetName = wb.SheetNames[i];
      const worksheet = wb.Sheets[sheetName];
      worksheet["!ref"] = getDataRange(worksheet);
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      mySheetData[sheetName] = jsonData;
    }
    return mySheetData;
  };

  const handleFile = async (e) => {
    const myFile = e.target.files[0];

    if (!myFile) return;

    if (!isFileSupported(myFile.name)) {
      alert("Invalid file type");
      return;
    }

    //Read Xlsx file
    const data = await myFile.arrayBuffer();

    const mySheetData = readDataFromExcel(data);
//     console.log(mySheetData);
    setFileName(myFile.name.split(".").slice(0, -1).join("."));
    setWorkbook(mySheetData);
    setSelectedSheet(Object.keys(mySheetData)[0]);
  };

  const handleRemove = () => {
    setFileName(null);
    setWorkbook(null);
    setSelectedSheet(null);
  };

  return (
    <>
      <Row>
        <Col>
          <div>
            <input
              type="file"
              accept="xlsx,xls,csv"
              onChange={(e) => handleFile(e)}
              style={{ margin: "10px" }}
            />
            <div className="fileName">
              {fileName && <Label>{fileName}</Label>}
              {fileName && (
                <FaTrash
                  onClick={handleRemove}
                  style={{
                    cursor: "pointer",
                    height: "15px",
                    marginLeft: "9px",
                  }}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ImportExcel;
