import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from "axios";
import Profile from './Profile';


function Login() {
  const [auth, setAuth] = useState('');
  const navigate = useNavigate();
  var User=null;

  useEffect(() => {
    var idcheck=Profile.getId();
    if(idcheck !== 'null')
    {navigate("/");}
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (Checker() === 1) {
      const formData = new FormData(event.target);
      User = { "email": formData.get("email"), "password": formData.get("password") }
      axios.post(`http://localhost:8000/authuser`, User)
        .then(res =>  {
          //console.log(res);
          if (res.data.auth === 2) {
            axios.post(`http://localhost:8000/getuserid`, User)
              .then(res => {
                
                Profile.setProfile(res.data.id).then(() => {window.location.reload();navigate("/");});
              })
              .catch(function (error) {if (error.response) {console.log(error.response.data);}});
              
          }
          setAuth(res.data.auth);
        })
        .catch(function (error) {if (error.response) {console.log(error.response.data);}});
    }
    
    
  }

  function Checker() {
    var c = document.getElementById("email").value;
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;;
    if (!(re.test(c))) {
      window.alert("Invalid Email.");
      return 0;
    }
    return 1;
  }

  return (
    <div className="login">
      <br></br>
      <header className="pageheader">
        <h3>Log into an Account</h3>
      </header>
      <div>
        <form method="post" onSubmit={handleSubmit}>
          <br></br>
          <label>
            <input name="email" id="email" placeholder='EMAIL' />
            <br></br>
          </label>
          <br></br>
          <label>
            <input name="password" type='password' placeholder='PASSWORD' />
            <br></br>
          </label>
          <br></br>
          <button>Login</button>
          <a href="Signup">Don't have an account?</a>
          <br></br>
          {auth === 0 && <h5 className='authFail'>Login failed! <br></br>Account does not exist</h5>}
          {auth === 1 && <h5 className='authFail'>Login failed! <br></br>Incorrect password</h5>}
          {auth === 2 && <h5 className='authPass'>Login Successful!</h5>}
          <div className='goBack'><a href="/">Go back to intro page</a></div>
        </form>
        
      </div>
    </div>
  );
};

export default Login;