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

function PriceComparison() {
    const[productName,setName]=useState('');
    const username=localStorage.getItem('username');
    const [price_analysis, setPriceAnalysis] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
            productName,
            username,
        }
        try{
            const response=await axios.post('http://localhost:8000/compare-price/',productData
                ,{withCredentials: true}
            );
            if(response.status===200){
                setPriceAnalysis(response.data.price_analysis);             
                console.log(response.data.price_analysis);
                alert("prices analysed successfully...");
                handleOpen();
            }
        }catch(error){
            console.log(error);
        }

    };

  //   React.useEffect(()=>{
  //     if(price_analysis===undefined){
  //       return;
  //     }
  //     setPriceAnalysis(price_analysis.replace(/\n/g, '<br>').replace(/\*\*/g, ''))
  //   },[price_analysis]);
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

                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Monitor Product</p>


                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="fa-solid fa-link me-3" size='lg'/>
                  <input label='Product name' id='form3' type='text'placeholder='Enter product name' value={productName} onChange={(e)=>{setName(e.target.value)}} required/>
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
          Price Comparison
        </Typography>
        <div
          id="modal-modal-description"
          style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}
        >
          {Object.keys(price_analysis).map((platform) => (
            <div key={platform} style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Typography>
              {price_analysis[platform] ? (
                <div>
                  <Typography variant="body1">Title: {price_analysis[platform].title}</Typography>
                  <Typography variant="body1">Price: {price_analysis[platform].price}</Typography>
                  <a href={price_analysis[platform].link} target="_blank" rel="noopener noreferrer">
                    View Product
                  </a>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No data available
                </Typography>
              )}
            </div>
          ))}
        </div>
      </Box>
    </Modal>
   
      </MDBContainer>
      </form>
      </div>
    </div>
  );
}

export default PriceComparison;