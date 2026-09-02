import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Turnstile } from '@marsidev/react-turnstile'

function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState();
    const turnstileRef = useRef(null);

    async function handleReset(e) {
        e.preventDefault();
        setError('');
        setMessage('');

       const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password-redirect`,
            captchaToken,
        });

        turnstileRef.current?.reset();
        setCaptchaToken(undefined);

        if (error) {
            setError(error.message);
            console.log(error.message);
            return
        }

        setMessage('Check your email for a password reset link.');
    }

    return (
        <div className="reset-password-container">
            <div className="logo-container">
                <div className="logo-div">
                    <h1>Pocket<span>Flow</span>.</h1>
                    <h2>Expense tracking, simplified.</h2>
                    <hr></hr>
                </div>
            </div>
            <form className="reset-password-form" onSubmit={handleReset}>
                <div className="reset-password-form-header">
                    <h1>Reset Password</h1>
                    <h2>Enter email to receive a link</h2>
                </div>
                <label>
                    Email
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}></input>
                </label>
                <button className="reset-password-btn" type="submit">Send Reset Link</button>
                {error && <p className="error-message">{error}</p>}
                {message && <p>{message}</p>}
                <Turnstile
                    ref={turnstileRef}
                    siteKey="0x4AAAAAAEjEg1WHD-FahuWt"
                    onSuccess={(token) => {
                        setCaptchaToken(token)
                    }}
                />
            </form>
            <p>
                <Link to="/login">Log In</Link>
            </p>
        </div>
    );
}

export default ResetPasswordPage;