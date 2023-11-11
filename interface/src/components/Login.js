import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [inputs, setInputs] = useState({ username: '', host: '', password: '', database: '', port: '' });
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Add backend credentials check and fetch profile info logic here
    try {
      const response = await fetch('http://127.0.0.1:5000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbUser: inputs.username,
          dbHostIP: inputs.host,
          dbPassword: inputs.password,
          dbName: inputs.database,
          dbPort: inputs.port,
        }),
      });

      if (response.ok) {
        // Redirect to the home page after successful login
        const data = await response.json();
        setToken(data.token);
        sessionStorage.setItem('token', data.token);
        console.log('Token:', data.token);
        navigate('/');
      } else {
        // Handle login failure here (display error message, etc.)
        console.error('Authentication failed');
      }
    } catch (error) {
      // Handle network errors or other exceptions here
      console.error('Error:', error);
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
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
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
