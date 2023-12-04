import '../styles/login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const location = useLocation();
    const errorMessage = location.state && location.state.errorMessage;
    const handleLogin = async () => {
        
        try {
          const response = await fetch('/api/guest/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
    
          if (response.ok) {
            
            const data = await response.json();
            console.log(data);
            switch (data.type) {
              case 'patient':
                navigate('/patient');
                break;
              case 'admin':
                navigate('/admin');
                break;
              case 'pharmacist':
                navigate('/pharmacist');
                break;
              default:
                // Handle other user types or provide a default redirect
                navigate('/');
            }
          } else {
            // Handle login error, e.g., display an error message
            console.error('Login failed');
            setError('An error occurred while logging in. Please try again.');

          }
        } catch (error) {
          console.error('An error occurred while logging in:', error);
        }
        // const userTypeCookie = Cookies.get('type');
        
      // Handle successful login, e.g., redirect or update state
      };
    return(
      <div className='container'>
      <Navbar/>
      <div className='login-cover'>
      </div>
        <div className="login-card card">
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="title">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>LOGIN</h2>
            
            </div>
            <div className='login-form'>
            <div className='wb'>Welcome Back to el7a2ni</div>
            <label>Username:</label>
            <br/>
            <input 
                name="username" 
                placeholder='your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <label>Password:</label>
            <br/>
            <input 
                name="password" 
                type='password' 
                placeholder='*********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>

            <a className='forgot' href='/forgotpassword'>forgot password?</a>
            <br/>
            

            <button className='btn btn-primary btn-default-width' onClick={handleLogin}>Login</button>
            <br/>

            <a className='center' href='/guest'>CREATE ACCOUNT!</a>
            
            </div>
        </div>
        </div>
    )
}
export default Login;