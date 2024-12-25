import React from 'react';
import BasicExample from './Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
from 'mdb-react-ui-kit';

function Login1() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    localStorage.setItem('isAuthenticated', 'false');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username,
            password,
        }
        

        try {
            const response = await axios.post('http://localhost:8080/login', formData,{ withCredentials: true });
            if (response.status === 200) {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('username',username);
              alert("login successfully!"+username);
              navigate('/users/index/0');
            }
        } catch (error) {
            console.log("Login Failed", error);
            alert("Login failed!");
        }
        
    };
  return (
    <div>
    <BasicExample/>
    <form onSubmit={handleSubmit}>
    <MDBContainer className="my-5">

      <MDBCard>
        <MDBRow className='g-0'>

          <MDBCol md='6'>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100'/>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                <span className="h1 fw-bold mb-0">Price Sentry</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>

                <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' value={username} onChange={(e) => setName(e.target.value)} required size="lg"/>
                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' value={password} onChange={(e) => setPassword(e.target.value)} size="lg"/>

              <MDBBtn className="mb-4 px-5" color='dark' size='lg'>Login</MDBBtn>
              <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <a href="/register" style={{color: '#393f81'}}>Register here</a></p>

              <div className='d-flex flex-row justify-content-start'>
                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                <a href="#!" className="small text-muted">Privacy policy</a>
              </div>

            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </MDBContainer>
    </form>
    </div>
  );
}

export default Login1;