import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();
  async function directHandler(event) {
    event.preventDefault();
    navigate("./Sheet/sheet", { replace: true });
  }

  return (
    <>
      <div className="bg-img">
        <div className="img">
          <h1 className="h1">Project Ocean </h1>
          <a href="https://www.aces-co.com/" rel="noreferrer" target="_blank">
            <img
              className="logo"
              style={{ color: "white" }}
              src="../images/aces.png"
              alt="logo-img"
            />
          </a>
        </div>
        <div className="drag">
          <h2 className="line">Welcome to Project Ocean....</h2>
          <button className="homebtn" onClick={directHandler}>
            Project Ocean
          </button>
          {/* <input
            id="csvFileInput"
            className="homebtn"
            type="file"
            name="hello"
            onChange={directHandler}
            accept=".csv"
            required
          /> */}
        </div>
      </div>
    </>
  );
};

export default Home;
