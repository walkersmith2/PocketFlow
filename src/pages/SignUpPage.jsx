import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'
import { Turnstile } from '@marsidev/react-turnstile'

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState();
    const navigate = useNavigate();

    async function handleSignUp(e) {
        e.preventDefault();
        setError('');

        if(password !== confirmPassword) {
            setError("Passwords must match.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { captchaToken },
        })

        if(error) {
            console.error(error.message);
            setError(error.message);
            return;
        }

        navigate('/');
        console.log(data);
    }

    return (
        <div className='signup-container'>
            <div className="logo-container">
                <div className="logo-div">
                    <h1>Pocket<span>Flow</span>.</h1>
                    <h2>Expense tracking, simplified.</h2>
                    <hr></hr>
                </div>
            </div>
            <form className="signup-form" onSubmit={handleSignUp}>
                <div className="signup-form-header">
                    <h1>Sign up</h1>
                    <h2>Create a new account</h2>
                </div>
                <label>
                    Email
                    <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)}></input>
                </label>
                <label>
                    Password
                    <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
                </label>
                <label>
                    Confirm Password
                    <input name="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
                </label>
                {error && <p>{error}</p>}
                <button className="signup-btn" type="submit">Sign Up</button>
                <Turnstile
                    siteKey="0x4AAAAAAEjEg1WHD-FahuWt"
                    onSuccess={(token) => {
                        setCaptchaToken(token)
                    }}
                    options={{
                        size: 'invisible',
                    }}
                />
                <p>
                    <Link to="/login">Log into existing account</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUpPage;