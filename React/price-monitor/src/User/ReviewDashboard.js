import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import BasicExample from './Navbar';
import Sidebar from './Sidebar';
import React, { useEffect, useState } from 'react';
import {
    MDBContainer,
    MDBCard,
} from 'mdb-react-ui-kit';
import fetchReviewDashboard from './ReviewService';
const userN=localStorage.getItem('username');

const ReviewDashboard = ({ username }) =>{
    const[reviews,setReviews]=useState([]);
    useEffect(() => {
        const getReviewsDashboard = async () => {
            try {
                const reviewsData = await fetchReviewDashboard(username);
                console.log("Fetched reviews:", reviewsData); // Debugging
                setReviews(reviewsData.reverse());
            } catch (error) {
                console.error("Error fetching product dashboard:", error);
            }
        };

        getReviewsDashboard();
    }, [username]);

    const handleDelete = async (reviewId) => {
        const reviewData={
            userN,
        }
        try {
            if (typeof reviewId !== 'number') {
                console.log(typeof reviewId)
                console.error("Invalid product ID:", reviewId);
                alert("Invalid product ID");
                return;
            }
    
            console.log("Deleting product with ID:", reviewId);
            const response = await fetch(`/api/delete-review/${reviewId}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userN })
        });
            const result = await response.text();
            alert(result);
            // Refresh the product list after deletion
            setReviews(reviews.filter(review => review.rid !== reviewId));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product");
        }
    };

    return (
        <div>
            <BasicExample />
            <div className="main-content">
                <Sidebar />
                <MDBContainer fluid>
                
                    <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ fontSize: '2.5rem' }}>Reviews Dashboard</p>
                        {reviews.length === 0 ? (
                            <p>No reviews found for {username}</p>
                        ):
                        reviews.map(reviewobj => (
                            <Card key={reviewobj.rid} className='mb-3'>
                                <Card.Header><b>{reviewobj.title}</b></Card.Header>
                                <Card.Header>Check Product: <a href={reviewobj.plink} target='_blank' rel="noopener noreferrer">{reviewobj.plink}</a></Card.Header>

                                <Card.Body>

                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: reviewobj.review
                                                .replace(/\n/g, '<br>')
                                                .replace(/\*\*/g, '')
                                        }}
                                    ></p>
                                    
                                    <Button variant="danger" onClick={() => handleDelete(reviewobj.rid)}>
                                        Delete Review Analysis
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </MDBCard>
                    </MDBContainer>
            </div>
        </div>
    );
}
export default ReviewDashboard;