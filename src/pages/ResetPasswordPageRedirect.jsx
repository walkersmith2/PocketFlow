import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
    <>
      {!passwordChanged && (
      <>
        <h1>Reset Password</h1>
        <form className="reset-password-redirect-form" onSubmit={handleSubmit}>
          <label>
            New password
            <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)}/>
          </label>
          <label>
            Confirm new password
            <input type="password" placeholder="Confirm New password"  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
          </label>
          {error && <p>{error}</p>}
          <button type="submit">Change Password</button>
        </form>
      </>
      )}
      {passwordChanged && (
        <div>
          <p>Your password has been reset.</p>
          <Link to="/login">Back to Login</Link>
        </div>
      )}
    </>
  )
}

export default ResetPasswordPageRedirect;