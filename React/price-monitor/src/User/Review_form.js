import axios from 'axios';
import { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  
}
from 'mdb-react-ui-kit';
import BasicExample from './Navbar';
import Sidebar from './Sidebar';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';

function Reviewform() {
    const[productLink,setPlink]=useState('');
    const username=localStorage.getItem('username');
    const [reviewSummary, setReviewSummary] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate=useNavigate();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        
      };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        alert("wait for certain time.....")
        const productData={
            productLink,
            username,
        }
        try{
            const response=await axios.post('http://localhost:8000/review-analysis/',productData
                ,{withCredentials: true}
            );
            if(response.status===200){
                setReviewSummary(response.data.reviews);
                console.log(response.data.reviews);
                alert("reviews analysed successfully...");
                handleOpen();
            }
        }catch(error){
            console.log(error);
        }

    };

    React.useEffect(()=>{
      if(reviewSummary===undefined){
        return;
      }
      setReviewSummary(reviewSummary.replace(/\n/g, '<br>').replace(/\*\*/g, ''))
    },[reviewSummary]);
  return (
    <div>
    <BasicExample/>
    <div className="main-content">
      <Sidebar/>
      <form onSubmit={handleSubmit} >
      <MDBContainer fluid>

        <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Review Analysis</p>


                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="fa-solid fa-link me-3" size='lg'/>
                  <input label='Product Link' id='form3' type='text' value={productLink} onChange={(e)=>{setPlink(e.target.value)}} required/>
                </div>


                <MDBBtn className='mb-4' size='lg' type='submit'>Submit</MDBBtn>

              </MDBCol>

              <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
              </MDBCol>

            </MDBRow>
          </MDBCardBody>
        </MDBCard>

 
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Review Analysis
            </Typography>
            <div
                  id="modal-modal-description"
                  style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}
                  dangerouslySetInnerHTML={{
                    __html: reviewSummary
                  }}
                />
            </Box>
      </Modal>
   
      </MDBContainer>
      </form>
      </div>
    </div>
  );
}

export default Reviewform;