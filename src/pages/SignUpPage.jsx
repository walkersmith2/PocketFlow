import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'


function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // async function signUpNewUser(email,password) {
    //     const { data, error } = await supabase.auth.signUp({
    //         email: email,
    //         password: password,
    //     })

    //     if(error) {
    //         console.error(error);
    //         return;
    //     }
        
    //     console.log(data);  
    // }
    
    // function handleSubmit(formData) {
    //     signUpNewUser(formData.get("email"), formData.get("password"));
    // }

    async function handleSignUp(e) {
        e.preventDefault();
        setError('');

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
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
            <form className="signup-form" onSubmit={handleSignUp}>
                <div className="signup-form-header">
                    <h1>Sign up</h1>
                    <h2>Create a new account</h2>
                </div>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
                </label>
                <label>
                    Confirm Password
                    <input name="confirm-password" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}></input>
                </label>
                {error && <p>{error}</p>}
                <button className="signup-btn" type="submit">Sign Up</button>
            </form>
            <p>
                <Link to="/login">Log into existing account</Link>
            </p>
        </div>
    );
}

export default SignUpPage;