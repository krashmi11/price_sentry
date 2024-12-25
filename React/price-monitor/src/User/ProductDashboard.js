// components/ProductDashboard.js
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState } from 'react';
import fetchProductDashboard from './ProductService';
import BasicExample from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
    MDBContainer,
    MDBCard,
} from 'mdb-react-ui-kit';

import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ProductDashboard = ({ username }) => {
    const [products, setProducts] = useState([]);
    const [trackRecords, setTrackRecords] =useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
   
    useEffect(() => {
        const getProductDashboard = async () => {
            try {
                const productData = await fetchProductDashboard(username);
                setProducts(productData.reverse());
            } catch (error) {
                console.error("Error fetching product dashboard:", error);
            }
        };

        getProductDashboard();
    }, [username]);

    const handleDelete = async (productId) => {
        try {
            if (typeof productId !== 'number') {
                console.log(typeof productId)
                console.error("Invalid product ID:", productId);
                alert("Invalid product ID");
                return;
            }
    
            console.log("Deleting product with ID:", productId);
            const response = await fetch(`/api/delete/${productId}`, {
                method: 'DELETE',
            });
            const result = await response.text();
            alert(result);
            // Refresh the product list after deletion
            setProducts(products.filter(product => product.pid !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product");
        }
    };
    const handle_analysis= async(productId)=>{
        const response=await axios.get(`http://localhost:8080/api/get-track-record/${productId}`)
        try{
            if(response.status===200){
                console.log("data recerived successfully");
                setTrackRecords(response.data);
                console.log(response.data);
                setNutrition(response.data)
                setSelectedValue('price');
                handleOpen();
            }
        }catch(error){
            console.log("Failed receiving data.")
        }
        
    };

    

    const [selectedValue, setSelectedValue] = useState('');

    const [nutrition,setNutrition] = useState([]);
    

  const labels = nutrition.map(item => item.currentDateTime);
  const chartData = {
    labels: labels,
    datasets: [
        {
            label: `Selected Value: ${selectedValue}`,
            data: nutrition.map(item => item[selectedValue]), // Dynamic data based on selection
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        },
    ],
};


const options = {
responsive: true,
plugins: {
    legend: {
        position: 'top',
        labels: {
            color: 'black', // Set legend text color to white
        },
    },
    // title: {
    //     display: true,
    //     text: `Price Data Chart`,
    //     color: 'black', // Set title color to black
    // },
    tooltip: {
        bodyColor: 'white', // Set tooltip body text color to black
        titleColor: 'white', // Set tooltip title text color to black
    }
},
scales: {
    x: {
        ticks: {
            color: 'black', // Set x-axis labels text color to black
        },
    },
    y: {
        ticks: {
            color: 'black', // Set y-axis labels text color to black
        },
    },
},
};

    return (
        <div>
            <BasicExample />
            <div className="main-content">
                <Sidebar />
                <MDBContainer fluid>
                
                    <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ fontSize: '2.5rem' }}>Product Dashboard</p>
                        {products.map(product => (
                            <Card key={product.pid} className='mb-3'>
                                <Card.Header><b>{product.title}</b></Card.Header>
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        <div>
                                            Product Threshold set by you: {product.threshold} Rs
                                        </div>
                                        <div>
                                        Actual Price of the Product:{product.price} Rs
                                        </div>
                                        Product Link :
                                        <a href={product.productLink} target="_blank" rel="noopener noreferrer">
                                            {product.productLink}
                                        </a>
                                    </Card.Text>
                                    <Button variant="primary" onClick={()=>handle_analysis(product.pid)} rel="noopener noreferrer" className="me-2">
                                        Price Analysis
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(product.pid)}>
                                        Stop Tracking
                                    </Button>
                                    
                                </Card.Body>
                            </Card>
                        ))}
                    </MDBCard>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Price Analysis Chart 
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='w-[100%] flex justify-center'> 
                        {
                            (selectedValue==='price')?(
                            <div className='w-[100%]'>
                            <Line data={chartData} options={options} />
                            </div>):(<></>)
                        }
                    </div>
                    </Typography>
                    </Box>
                    </Modal>
                </MDBContainer>
            </div>
        </div>
    );
};


export default ProductDashboard;
