
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if(error) {
      setError(error.message);
      return;
    }

    navigate('/');
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-form-header">
          <h1>Log in</h1>
          <h2>Log in to existing account</h2>
        </div>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit">Log In</button>
      </form>
      <p>
        <Link to="/reset-password">Reset Password</Link>
      </p>
      <p>
        <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;