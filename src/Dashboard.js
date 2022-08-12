import React, { useContext, useRef } from "react";
import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import { GlobalContext } from "./GlobalProvider";
import Footer from "./Footer";
import Header from "./Header";
//Second commit
const Dashboard = () => {
  const dragItem = useRef();
  const { sheets, dashboards, setDashboards } = useContext(GlobalContext);

  const dashboardParam = useParams().dashboard;

  const handleDrop = (index) => {
    const dragSheet = dragItem.current;
    const updatedDashboard = dashboards.find(
      (dashboard) => dashboard.name === dashboardParam
    );
    updatedDashboard.graphs[index] = dragSheet;
    const tempDashboards = dashboards.map((dashboard) =>
      dashboard.name === dashboardParam ? updatedDashboard : dashboard
    );
    setDashboards(tempDashboards);
  };
  let config = {
    showLink: false,
    displayModeBar: true,
  };

  return (
    <>
      <Header />
      <div
        className="Dashboard"
        style={{ border: "5px solid blue", height: "88vh" }}
      >
        <div className="Sheets">
          <p style={{ fontSize: "20px", padding: "8px", textAlign: "center" }}>
            Sheets
          </p>
          <hr></hr>
          <br></br>
          {sheets.map((sheet, index) => (
            <p
              key={index}
              className="sheetName"
              style={{
                width: "40%",
                height: "40px",
                padding: "6px",
                margin: "3px",
                background: "black",
                color: "white",
              }}
              draggable
              onDragStart={() => (dragItem.current = sheet)}
            >
              {sheet.name}
            </p>
          ))}
        </div>
        <div className="AllSheets">
          {dashboards
            .find((dashboard) => dashboard.name === dashboardParam)
            .graphs.map((sheet, index) => (
              <div
                droppable
                onDrop={() => handleDrop(index)}
                onDragOver={(e) => e.preventDefault()}
                className="graphDrop"
                style={{
                  border: "3px solid black",
                  width: "450px",
                  height: "323px",
                }}
              >
                <Plot
                  className="graphDrop"
                  data={[
                    sheet.graph === "pie"
                      ? {
                          type: sheet?.graph,
                          values: sheet?.row?.values,
                        }
                      : {
                          type: sheet?.graph,
                          x: sheet?.col?.values,
                          y: sheet?.row?.values,
                        },
                  ]}
                  layout={{
                    width: 440,
                    height: 300,
                    title: sheet.name,
                  }}
                  // config={config}
                />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Dashboard;
