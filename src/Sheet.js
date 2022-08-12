import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from "papaparse";
import Plot from "react-plotly.js";
import { FaTrash } from "react-icons/fa";
import { GlobalContext } from "./GlobalProvider";
import Header from "./Header";
import Footer from "./Footer";
import ImportExcel from "./ImportExcel";

const allowedExtensions = ["csv", "xlsx", "xls", "owbx"];

const Sheet = () => {
  const dragItem = useRef();
  const {
    sheets,
    setSheets,
    columns,
    setColumns,
    fileNames,
    setFileNames,
    selectedSheet,
    setSelectedSheet,
    csvArray,
    setCsvArray,
    workbook,
    setWorkbook,
    setDashboards,
  } = useContext(GlobalContext);
  const [switchSheet, setswitchSheet] = useState(1);
  const [addedFile, setAddedFile] = useState(false);

  //

  const dashboardParam = useParams().dashboard;

  const sheetParam = useParams().sheet;
  const navigate = useNavigate();
  //To handle Owbx file
  const processAgainFile = (jsondata) => {
    let sheet = jsondata.sheetParam;
    let totalSheetSize = sheet.length;
    let numberToSwitch = sheet.substring(totalSheetSize);
    if (sheet === undefined) setswitchSheet(1);
    setswitchSheet(Number(numberToSwitch));
    // setColumns(jsondata.columns);
    setSheets(jsondata.globalData);
    setDashboards(jsondata.dashboards);
    setWorkbook(jsondata.allworksheetData);
    setAddedFile(true);
  };

  // Navigate to Home Page
  async function homehandler(event) {
    event.preventDefault();
    navigate("/", { replace: true });
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    var idx = file.name.lastIndexOf(".");
    var filetype = idx < 1 ? "" : file.name.substr(idx + 1);
    if (filetype === "owbx") {
      const reader = new FileReader();
      reader.onload = (event) => {
        let text = event.target.result;
        const PARSEDTEXT = JSON.parse(text);
        processAgainFile(PARSEDTEXT);
      };
      reader.readAsText(event.target.files[0]);
    }
    if (event.target.files.length) {
      const inputFile = event.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (allowedExtensions.includes(fileExtension)) {
        setFileNames([...fileNames, inputFile]);
      }
    }
  };

  const processCsv = (str, delim = ",") => {
    // to get particular row/column data
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(0, str.indexOf("\n+1")).split("\n");
    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });
    setCsvArray(newArray);
  };

  const handleColumns = (index) => {
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const text = target.result;
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setColumns(columns);
      processCsv(text);
    };
    reader.readAsText(fileNames[index]);
  };

  const handleDrop = (event) => {
    const dragValue = dragItem.current;
    const field = event.currentTarget.id;
    const plotValue = csvArray.slice(1).map((record) => record[dragValue]);
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? { ...s, [field]: { key: dragValue, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };

  //Graph Selection
  const selectGraph = (event) => {
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? {
            ...s,
            graph: event.target.value,
          }
        : s
    );
    setSheets(tempSheets);
  };

  //Delete Values
  const deleteValues = (e) => {
  
    if (e.currentTarget.id === "row") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, row: {} } : s
      );
      setSheets(tempSheets);
    }
    if (e.currentTarget.id === "col") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, col: {} } : s
      );
      setSheets(tempSheets);
    }
  };

  useEffect(() => {
    setSelectedSheet(sheets.find((s) => s.name === sheetParam));
  }, [sheets, sheetParam, setSelectedSheet]);

  return (
    <>
      <Header />
      <div className="Second-line">
        <h3 onClick={homehandler}>Home</h3>
      </div>
      <hr></hr>
      <div className="third-line">
        <div className="field">
          {/* <ImportExcel /> */}

          <input
            onChange={handleFileUpload}
            id="csvInput"
            name="file"
            type="File"
            accept=".csv"
          />

          {/* this is to display Headers from the file */}
          <select onClick={() => {}}>
            <option>Datafield</option>
          </select>

          <div className="display">
            {columns.map((column, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => (dragItem.current = column)}
              >
                {column}
              </div>
            ))}
          </div>

          <div>
            {fileNames.map((filename, index) => (
              <button
                className="fileName"
                onClick={() => handleColumns(index)}
                key={index}
              >
                {filename.name.split(".").slice(0, -1).join(".")}
              </button>
            ))}
          </div>
        </div>

        <div className="filter">
          <select>
            <option>Filters</option>
          </select>
          <select>
            <option>Marks</option>
          </select>
          <select>
            <option>Pages</option>
          </select>
        </div>
        <div className="graph">
          <div
            droppable
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            id="row"
          >
            Row : {selectedSheet?.row?.key}
            <FaTrash
              onClick={deleteValues}
              id="row"
              style={{ cursor: "pointer" }}
            />
          </div>

          <br></br>
          <hr style={{ width: "110vh", background: "blue" }}></hr>
          <div
            droppable
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            id="col"
          >
            Column: {selectedSheet?.col?.key}
            <FaTrash
              onClick={deleteValues}
              id="col"
              style={{ cursor: "pointer" }}
            />
          </div>

          <br></br>
          <select
            className="selectGraph"
            onChange={selectGraph}
            style={{ background: "green" }}
            id="graph"
          >
            <option value="">Graph</option>
            <option value="line">Line-Graph</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie-Chart</option>
          </select>
          <div className="sheetName">{sheetParam}</div>
          <div>
            {selectedSheet?.graph && (
              <Plot
                data={[
                  selectedSheet.graph === "pie"
                    ? {
                        type: selectedSheet?.graph,
                        values: selectedSheet?.row?.values,
                      }
                    : {
                        type: selectedSheet?.graph,
                        x: selectedSheet?.col?.values,
                        y: selectedSheet?.row?.values,
                        transforms: [
                          {
                            type: "aggregate",

                            aggregations: [
                              {
                                target: "y",
                                func: "Sum",
                                enabled: true,
                              },
                            ],
                          },
                        ],
                      },
                ]}
                layout={{
                  // autosize: false,
                  xaxis: selectedSheet?.col?.values,
                  yaxis: selectedSheet?.row?.values,

                  updatemenus: [
                    {
                      x: 0.85,
                      y: 1.05,

                      showactive: true,
                      buttons: [
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "sum"],
                          label: "Sum",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "avg"],
                          label: "Avg",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "min"],
                          label: "Min",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "max"],
                          label: "Max",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "mode"],
                          label: "Mode",
                        },
                        {
                          method: "restyle",
                          args: [
                            "transforms[0].aggregations[0].func",
                            "median",
                          ],
                          label: "Median",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "count"],
                          label: "Count",
                        },
                        {
                          method: "restyle",
                          args: [
                            "transforms[0].aggregations[0].func",
                            "stddev",
                          ],
                          label: "Std.Dev",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "first"],
                          label: "First",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "last"],
                          label: "Last",
                        },
                      ],
                    },
                  ],
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Sheet;
