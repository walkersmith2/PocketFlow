import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleReset(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        const { error } = await supabase.auth.resetPasswordForEmail( email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            setError(error.message);
            console.log(error.message);
            return
        }

        setMessage('Check your email for a password reset link.');
    }

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleReset}>
                <div className="reset-password-form-header">
                    <h1>Reset Password</h1>
                    <h2>Enter email to receive a link</h2>
                </div>
                <label>
                    Email
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
                </label>
                <button className="reset-password-btn" type="submit">Send Reset Link</button>
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}
            </form>
            <p>
                <Link to="/login">Log In</Link>
            </p>
        </div>
    );
}

export default ResetPasswordPage;