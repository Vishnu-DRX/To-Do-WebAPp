import './Signup.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Signup() {
    const [error,setError]=useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        if (Checker() === 1) {
            const formData = new FormData(event.target);
            const User = { "username": formData.get("username"),"email": formData.get("email"), "password": formData.get("password") }
            axios.post(`http://localhost:8000/postuser`, User)
            .then(res => {
                if(res.data.code===11000)
                { setError(11000);
                console.log("Could not create account. Email already registered");}
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                }
            });             
        }
        window.alert("Account successfully created, PLease login now.");
        navigate("/Login");
    }

    function Checker() {
        var a = document.getElementById("pword1").value;
        var b = document.getElementById("pword2").value;
        var c = document.getElementById("email").value;
        var d = document.getElementById("username").value;
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;;
        if (!(a === b)) {
            window.alert("Passwords do not match.");
            return 0;
        }
        if (!(re.test(c))) {
            window.alert("Invalid Email.");
            return 0;
        }
        if (d==='') {
            window.alert("Username required");
            return 0;
        }
        return 1;
    }


    return (
        <div className="signup">
            <br></br>
            <header className="pageheader">
                <h3>Create an Account</h3>
            </header>
            <div>
                <form method="post" onSubmit={handleSubmit}>
                    <label>
                        <input name="username" id="username" placeholder='USERNAME' />
                        <br></br>
                    </label>
                    <br></br>
                    <label>
                        <input name="email" id="email" placeholder='EMAIL' />
                        <br></br>
                    </label>
                    <br></br>
                    <label>
                        <input name="password" id="pword1" type='password' placeholder='PASSWORD' />
                        <br></br>
                    </label>
                    <br></br>
                    <label>
                        <input name="repassword" id="pword2" type='password' placeholder='CONFIRM PASSWORD' />
                    </label>
                    <br></br>
                    <br></br>
                    <button>Create</button>
                    <a href="Login">Already have an account?</a>
                    <br></br>
                    {error !== '' && <h5 className='error'>Error: Email already registered!</h5>}
                    <div className='goBack'><a href="/">Go back to intro page</a></div>
                </form>
            </div>
        </div>


    );
};

export default Signup;