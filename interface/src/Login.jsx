import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("postgres");
  const [pass, setPass] = useState("password");
  const [database, setdatabase] = useState("postgres");
  const [port, setPort] = useState("5432");
  const [isInValidPassword, setIsInvalidPassword] = useState(false);
//   const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://127.0.0.1:5000/login/`, {
        password: pass,
        username: username,
        database: database,
      })
      .then((response) => {
        const token = response.data.token;
        // login(token, true);
      })
      .catch((error) => {
        setIsInvalidPassword(true);
        console.error(error);
      });

  };

  return (
    <div className="mlog-auth-form-container">
      
      <div className="left-right">
        <div className="mlogin-detail">
          <h2>Welcome! </h2>
          <p>
          </p>
          <form className="mlogin-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              placeholder="Username"
              id="username"
              name="username"
              style={{ height: "40px", width: "300px" }}
            />
            <p></p>

            <label htmlFor="text">Password</label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="text"
              placeholder="********"
              id="password"
              name="password"
              style={{ height: "40px", width: "300px" }}
            />
            <p></p>
            <label htmlFor="text">Database</label>
            <input
              value={database}
              onChange={(e) => setdatabase(e.target.value)}
              type="database"
              placeholder="postgres"
              id="database"
              name="database"
              style={{ height: "40px", width: "300px" }}
            />
            <p></p>

            <label htmlFor="port">Port</label>
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              type="port"
              placeholder="5432"
              id="port"
              name="port"
              style={{ height: "40px", width: "300px" }}
            />

            {isInValidPassword && (
              <div
                style={{
                  color: "red",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                *Invalid entry, please try again.
              </div>
            )}
            <p></p>

            <button
              className="mlogin-button"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              Login
            </button>
            
          </form>
        </div>
        
      </div>
    </div>
  );
};
