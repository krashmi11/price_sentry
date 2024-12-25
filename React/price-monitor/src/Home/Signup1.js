import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
  
}
from 'mdb-react-ui-kit';
import BasicExample from './Navbar';

function Signup1() {

  const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [phone,setPhone]=useState('');
    const[productLink,setPlink]=useState('');
    const [threshold, setThreshold] = useState('');
    const [password, setPassword] = useState('');
    const [message,setMessage]=useState('');
    const navigate = useNavigate();
    localStorage.setItem('mobile_no','')
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const registrationData={
            name,
            email,
            phone,
            productLink,
            threshold:parseInt(threshold),
            password,
        };

        try{
            const response=await axios.post('http://localhost:8080/register',registrationData);
            if (response.status === 200) { // Check response status correctly
              localStorage.setItem('mobile_no',phone);
              alert("Successfully Registered!!");
              navigate('/login');
          } else {
              setMessage(response.data.message);
          }
            setMessage(response.data.message);
        }catch(error){
            console.error("Error in registering user:",error);
            setMessage('Error registering user. Please Try again');
            alert("Error in registering User. Please Try again!!")
        }
    };

  return (
    <div>
    <BasicExample/>
    <form onSubmit={handleSubmit}>
    <MDBContainer fluid>

      <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

              <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

              <div className="d-flex flex-row align-items-center mb-4 ">
                <MDBIcon fas icon="user me-3" size='lg'/>
                <MDBInput label='Your Name' id='form1' type='text' value={name} onChange={(e)=>setName(e.target.value)} className='w-100'/>
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="envelope me-3" size='lg'/>
                <MDBInput label='Your Email' id='form2' type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="fa-solid fa-phone me-3" size='lg'/>
                <MDBInput label='Phone' id='form3' type='tel' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
              </div>

              {/* <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size='lg'/>
                <MDBInput label='Product Link' id='form3' type='text' value={productLink} onChange={(e)=>setPlink(e.target.value)}/>
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size='lg'/>
                <MDBInput label='Threshold' id='form3' type='number' value={threshold} onChange={(e)=>setThreshold(e.target.value)}/>
              </div> */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size='lg'/>
                <MDBInput label='Password' id='form3' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </div>


              <MDBBtn className='mb-4' size='lg' type='submit'>Register</MDBBtn>

            </MDBCol>

            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
            </MDBCol>

          </MDBRow>
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
    </form>
    {message && <p>{message}</p>}
    </div>
  );
}

export default Signup1;