import '../styles/forgotpassword.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../content/images/ELHANNY-LOGO.png";
import { Link } from 'react-router-dom';
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
    <div className='forgot-container'>
    <div className="mt-4">
      <div className="body card-body">
      <div className='notwithbtn-container'>
      <div className="d-flex align-items-center">
              <img className='logo-img' src={Image} width="50" alt="El7a2ni Logo" />
              <Link to="" className="logoname"><h4>El7a2ni</h4></Link>
            </div>

        <div className="email-container">
          <div className="cc">Write your email:</div>
        
        <input
          name="email"
          className="form-control email-box"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        </div>
        <br />
        <button className="request-btn btn btn-primary btn-default-width" onClick={(e) =>handleRequestPasswordResetOTP(e)}>
          Request OTP
        </button>

        <br />
      </div>
    </div>
    </div>
      </div>
  );
};
export default ForgotPassword;