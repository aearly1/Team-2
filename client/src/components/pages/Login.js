import React,{useState} from 'react'
import axios from 'axios'
const Login = (props) =>
{
    const [email,setEmail] = useState("") 
    const [pass,setPass] = useState("") 
    const handleSubmit = e => {
        e.preventDefault()
        const user = {email: email,password: pass}
        axios.post("http://localhost:5000/api/login",user)
        .then(res => console.log(res.data))
      }
    const handleChange = (e) => {
        const emailn = e.target.value;
        const passn = e.target.value;
        setEmail(emailn);
        setPass(passn);
    }
    return(
        <form>

                <h3>Log in</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" onSubmit={handleSubmit} className="btn btn-dark btn-lg btn-block">Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
    )


}

export default Login