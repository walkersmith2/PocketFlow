import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'
import { Turnstile } from '@marsidev/react-turnstile'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState();
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  async function handleClick(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInAnonymously(
      {options: { captchaToken },
    });
    
    if(error) {
      setError(error.message);
      return;
    }

    navigate('/');
  }

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      options: { captchaToken },
    })

    turnstileRef.current?.reset();
    setCaptchaToken(undefined);
    
    if(error) {
      setError(error.message);
      return;
    }

    navigate('/');
  }

  return (
    <div className="login-container">
      <div className="logo-container">
        <div className="logo-div">
            <h1>Pocket<span>Flow</span>.</h1>
            <h2>Expense tracking, simplified.</h2>
            <hr></hr>
        </div>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-form-header">
          <h1>Log in</h1>
          <h2>Log in to existing account</h2>
        </div>
        <label>
          Email
          <input name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}></input>
        </label>
        
        <label>
          Password
          <input name="password" required type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit">Log In</button>        
        <Turnstile
          ref={turnstileRef}
          siteKey="0x4AAAAAAEjEg1WHD-FahuWt"
          onSuccess={(token) => {
              setCaptchaToken(token)
          }}
        />
        <p>
        Forgot Password? <Link to="/reset-password">Reset Password</Link>
      </p>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
        <button className="try-anonymous-btn" onClick={handleClick}>Try it out</button>
      </p>
      </form>
      
    </div>
  );
}

export default LoginPage;