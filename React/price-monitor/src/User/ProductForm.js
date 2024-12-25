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
} from 'mdb-react-ui-kit';
import BasicExample from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

function ProductForm() {
    const [productLink, setPlink] = useState('');
    const [threshold, setThreshold] = useState('');
    const [message, setMessage] = useState('');
    const [selectedWebsite, setSelectedWebsite] = useState('Flipkart'); // Default website option
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleS = async (e) => {
        e.preventDefault();

        const productData = {
            productLink,
            threshold: parseInt(threshold),
            username,
            selectedWebsite, // Include the selected website in the data
        };
        console.log(username);
        console.log(productLink);

        try {
            const response = await axios.post('http://localhost:8080/api/processProductData', productData, { withCredentials: true });
            if (response.status === 200) {
                localStorage.setItem('mobile', response.data.mobile);
                setMessage(response.data.message);
                alert("Successfully Entered Product Details!!");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error in Entering Product Details:", error);
            setMessage('Product link and threshold are required');
            alert(error);
        }

        try {
            const resp = await axios.post('http://localhost:8000/check-condition/', {
                productLink: productLink,
                threshold: parseInt(threshold),
                username: username,
                selectedWebsite:selectedWebsite,
                mobile: localStorage.getItem('mobile'),
            });
            if (resp.status === 200) {
                alert("Product Tracking started!!");
                navigate('/users/productDashboard');
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <BasicExample />
            <div className="main-content">
                <Sidebar />
                <form onSubmit={handleS}>
                    <MDBContainer fluid>
                        <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Product Detail</p>

                                        {/* Dropdown for selecting e-commerce website */}
                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <label htmlFor="website-select" className="me-3">Select Website:</label>
                                            <select
                                                id="website-select"
                                                value={selectedWebsite}
                                                onChange={(e) => setSelectedWebsite(e.target.value)}
                                                required
                                            >
                                                <option value="Flipkart">Flipkart</option>
                                                <option value="Amazon">Amazon</option>
                                                <option value="Meesho">Meesho</option>
                                                <option value="Shopsy">Shopsy</option>

                                                {/* Add other website options here */}
                                            </select>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="fa-solid fa-link me-3" size='lg' />
                                            <input
                                                label='Product Link'
                                                id='form3'
                                                type='text'
                                                value={productLink}
                                                onChange={(e) => { setPlink(e.target.value) }}
                                                placeholder={`Enter ${selectedWebsite} link`}
                                                required
                                            />
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="fa-solid fa-tag me-3" size='lg' />
                                            <input
                                                label='Threshold'
                                                id='form3'
                                                type='number'
                                                value={threshold}
                                                onChange={(e) => { setThreshold(e.target.value) }}
                                                placeholder={`Enter ${selectedWebsite} threshold`}
                                                required
                                            />
                                        </div>

                                        <MDBBtn className='mb-4' size='lg' type='submit'>Submit</MDBBtn>
                                    </MDBCol>

                                    <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                        <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>
                </form>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ProductForm;
