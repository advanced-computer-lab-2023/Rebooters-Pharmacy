import '../styles/forgotpassword.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRequestPasswordResetOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/guest/requestPasswordResetOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        const json = response.json();
        console.log(json);
        navigate("/otp");
      } else {
        console.error("Not working");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error.message);
    }
  };
  return (
    <div>
      <Navbar/>
    <div className='forgot-container'>
    <div className="card mt-4">
      <div className="body card-body">
        <div className="title">
          <h2>El7a2ni</h2>
        </div>
        <div className="email-container">
          <div className="cc">Write your email:</div>
        </div>
        <input
          name="email"
          className="form-control"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button className="btn btn-primary" onClick={(e) =>handleRequestPasswordResetOTP(e)}>
          Request OTP Code
        </button>

        <br />
      </div>
    </div>
    </div>
      </div>
  );
};
export default ForgotPassword;