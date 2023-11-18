import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoadingScreen.css';

function Login() {
  const [inputs, setInputs] = useState({ username: '', host: '', password: '', database: '', port: '', schema: '' });
  const [loading, setLoading] = useState(false);
  const [maxTuples, setMaxTuples] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/authenticate", {
        dbUser: inputs.username,
        dbHostIP: inputs.host,
        dbPassword: inputs.password,
        dbName: inputs.database,
        dbPort: inputs.port,
        tableSchema: inputs.schema
      });

      if (response.statusText == "OK") {
        // Redirect to the main page after successful authentication
        const data = await response.data;
        setMaxTuples(data);
        sessionStorage.setItem('maxTuples', JSON.stringify(data));
        
        console.log('Data:', data);

        navigate('/app');
      } else {
        // Handle login failure here (display error message, etc.)
        console.error('Authentication failed');
      }
    } catch (error) {
      // Handle network errors or other exceptions here
      alert("Enter valid authentication details")
      console.error('Error:', error);
    }finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Welcome</h1>
              <form onSubmit={handleSubmit}>
              {loading && <div className="loading"></div>}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={inputs.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="host" className="form-label">
                    Host:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="host"
                    name="host"
                    value={inputs.host}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="database" className="form-label">
                    Database:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="database"
                    name="database"
                    value={inputs.database}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="port" className="form-label">
                    Port:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="port"
                    name="port"
                    value={inputs.port}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="schema" className="form-label">
                    Schema:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="schema"
                    name="schema"
                    value={inputs.schema}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-info">
                    Authenticate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
