import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import WalletIcon from '../assets/wallet.svg?react';

function ResetPasswordPageRedirect() {
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    
    if(password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    
    if(error) {
      setError(error.message);
      return;
    }

    setPasswordChanged(true);

  }
  
  return (
    <div className='reset-password-redirect-container'>
      {!passwordChanged && (
      <>
        <div className='logo-div large'>
          <h2 className='logo-title' >Pocket<span>Flow</span><WalletIcon  className='wallet-icon' /></h2>
          <h3 className='logo-subtitle' >Expense tracking, simplified.</h3>
        </div>
        <form className="reset-password-redirect-form" onSubmit={handleSubmit}>
           <div className="reset-password-form-header">
              <h1>Reset Password</h1>
              <h2>Enter new password below</h2>
            </div>
          <label>
            New password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
          </label>
          <label>
            Confirm new password
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button  className="reset-password-btn" type="submit">Change Password</button>
        </form>
      </>
      )}
      {passwordChanged && (
        <div>
          <p>Your password has been reset.</p>
          <Link to="/login">Back to Login</Link>
        </div>
      )}
    </div>
  )
}

export default ResetPasswordPageRedirect;